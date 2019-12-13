import { subDays } from 'date-fns';
import { Op } from 'sequelize';

import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async index(req, res) {
    const studentExists = await Student.findByPk(req.params.id);

    if (!studentExists) {
      return res.status(400).json({ error: 'Student not found.' });
    }

    const { page } = req.query;

    let pageLimit = {};
    if (page) {
      pageLimit = {
        offset: (page - 1) * 20,
        limit: 20,
      };
    }

    const checkins = await Checkin.findAll({
      where: { student_id: studentExists.id },
      attributes: ['id', 'created_at'],
      ...pageLimit,
      order: [['created_at', 'DESC']],
    });

    return res.json(checkins);
  }

  async store(req, res) {
    const studentExists = await Student.findByPk(req.params.id);

    if (!studentExists) {
      return res.status(400).json({ error: 'Student not found.' });
    }

    const today = new Date();
    const sevenDaysAgo = subDays(today, 7);

    const weekCheckins = await Checkin.findAll({
      where: {
        student_id: studentExists.id,
        created_at: {
          [Op.between]: [sevenDaysAgo, today],
        },
      },
    });

    if (weekCheckins.length >= 5) {
      return res
        .status(400)
        .json({ error: 'Limite de 5 checkins por semana atingido.' });
    }

    const checkin = await Checkin.create({
      student_id: studentExists.id,
    });

    const studentCheckin = await Checkin.findByPk(checkin.id, {
      attributes: ['id', 'created_at'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    return res.json(studentCheckin);
  }
}

export default new CheckinController();
