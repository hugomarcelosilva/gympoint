import { Op } from 'sequelize';
import * as Yup from 'yup';

import Student from '../models/Student';

class StudentController {
  async index(req, res) {
    const { id, q, page } = req.query;

    if (id) {
      const studentExists = await Student.findByPk(id);

      if (!studentExists) {
        return res.status(400).json({ error: 'Student not found.' });
      }

      return res.json(studentExists);
    }

    if (page) {
      const limit = 5;

      const where = q ? { name: { [Op.iLike]: `%${q}%` } } : {};

      const studentsCount = await Student.count({ where });

      const lastPage = page * limit >= studentsCount;

      const students = await Student.findAll({
        where,
        limit,
        offset: (page - 1) * limit,
      });

      return res.json({ lastPage, content: students });
    }

    const students = await Student.findAll();

    return res.json(students);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.string().required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExists) {
      return res.status(400).json({ error: 'Student already exists.' });
    }

    const student = await Student.create(req.body);

    return res.json(student);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      age: Yup.number().integer(),
      weight: Yup.number().positive(),
      height: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const studentExists = await Student.findByPk(id);

    if (!studentExists) {
      return res.status(400).json({ error: 'Student not found.' });
    }

    const { email } = req.body;

    if (email) {
      const emailAlreadyExists = await Student.findOne({
        where: {
          email,
          id: {
            [Op.not]: id,
          },
        },
      });

      if (emailAlreadyExists) {
        return res.status(400).json({ error: 'Student already exists.' });
      }
    }

    const student = await studentExists.update(req.body);

    return res.json(student);
  }

  async delete(req, res) {
    const { id } = req.params;

    const studentExists = await Student.findByPk(id);

    if (!studentExists) {
      return res.status(400).json({ error: 'Student not found' });
    }

    await studentExists.destroy(id);

    return res.json();
  }
}

export default new StudentController();
