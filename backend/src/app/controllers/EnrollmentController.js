import * as Yup from 'yup';
import {
  startOfDay,
  endOfDay,
  parseISO,
  isBefore,
  isAfter,
  addMonths,
  startOfHour,
  startOfMinute,
  endOfMinute,
} from 'date-fns';
import { Op } from 'sequelize';
import Enrollment from '../models/Enrollment';
import Plan from '../models/Plan';
import Student from '../models/Student';
import User from '../models/User';

import EnrollmentMail from '../jobs/EnrollmentMail';
import Queue from '../../lib/Queue';

class EnrollmentController {
  async index(req, res) {
    const { id, page } = req.query;

    const loggedUser = await User.findByPk(req.userId);

    if (!loggedUser) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    const include = [
      {
        model: Student,
        as: 'student',
        attributes: ['id', 'name'],
      },
      {
        model: Plan,
        as: 'plan',
        attributes: ['id', 'title', 'duration'],
      },
    ];

    if (id) {
      const enrollment = await Enrollment.findByPk(id, { include });
      return res.json(enrollment);
    }

    if (page) {
      const limit = 5;

      const enrollmentsCount = await Enrollment.count();

      const lastPage = page * limit >= enrollmentsCount;

      const queryLimitOffset = {
        limit,
        offset: (page - 1) * limit,
      };

      const enrollments = await Enrollment.findAll({
        include,
        ...queryLimitOffset,
      });

      return res.json({ lastPage, content: enrollments });
    }

    const enrollments = await Enrollment.findAll();

    return res.json(enrollments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id, plan_id, date } = req.body;

    const student = await Student.findOne({
      where: { id: student_id },
    });

    if (!student) {
      return res.status(401).json({ error: 'Student not found' });
    }

    const plan = await Plan.findOne({
      where: { id: plan_id },
    });

    if (!plan) {
      return res.status(401).json({ error: 'Plan not found' });
    }

    const parsedDate = parseISO(date);
    const startDate = startOfHour(parsedDate);

    /**
     * Check for past dates
     */
    if (isBefore(parsedDate, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    /**
     * Check date availability
     */
    const checkAvailability = await Enrollment.findOne({
      where: {
        student_id,
        plan_id,
        start_date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
    });

    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Enrollment date is not available' });
    }

    const planMonths = plan.duration;
    const planPrice = plan.price;

    const end_date = addMonths(startDate, planMonths);
    const price = planMonths * planPrice;

    const enrollment = await Enrollment.create({
      student_id,
      plan_id,
      start_date: startDate,
      end_date,
      price,
    });

    await Queue.add(EnrollmentMail.key, {
      enrollment,
      student,
      plan,
    });

    return res.json(enrollment);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().integer(),
      plan_id: Yup.number().integer(),
      date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id, plan_id, date } = req.body;

    const enrollmentExists = await Enrollment.findByPk(req.params.id);

    if (!enrollmentExists) {
      return res.status(400).json({ error: 'Enrollment not found' });
    }

    const studentExists = await Student.findOne({
      where: { id: student_id },
    });

    if (!studentExists) {
      return res.status(401).json({ error: 'Student not found' });
    }

    const planExists = await Plan.findOne({
      where: { id: plan_id },
    });

    if (!planExists) {
      return res.status(401).json({ error: 'Plan not found' });
    }

    const parsedDate = parseISO(date);
    const startDate = startOfHour(parsedDate);

    /**
     * Check for past dates
     */
    if (
      isBefore(parsedDate, startOfMinute(enrollmentExists.start_date)) ||
      isAfter(parsedDate, endOfMinute(enrollmentExists.start_date))
    ) {
      if (isBefore(parsedDate, new Date())) {
        return res.status(400).json({ error: 'Past dates are not permitted' });
      }
    }

    /**
     * Check date availability
     */
    const checkAvailability = await Enrollment.findOne({
      where: {
        student_id,
        plan_id,
        start_date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
    });

    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Enrollment date is not available' });
    }

    const planMonths = planExists.duration;
    const planPrice = planExists.price;

    const end_date = addMonths(startDate, planMonths);
    const price = planMonths * planPrice;

    const enrollmentUpdated = await enrollmentExists.update({
      student_id,
      plan_id,
      start_date: startDate,
      end_date,
      price,
    });

    return res.json(enrollmentUpdated);
  }

  async delete(req, res) {
    const { id } = req.params;

    const enrollmentExists = await Enrollment.findByPk(id);

    if (!enrollmentExists) {
      return res.status(400).json({ error: 'Enrollment not found' });
    }

    await enrollmentExists.destroy(id);

    return res.json();
  }
}

export default new EnrollmentController();
