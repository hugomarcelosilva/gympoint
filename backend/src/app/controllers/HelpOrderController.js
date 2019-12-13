import * as Yup from 'yup';

import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

import HelpOrderMail from '../jobs/HelpOrderMail';
import Queue from '../../lib/Queue';

class HelpOrderController {
  async index(req, res) {
    const include = [
      {
        model: Student,
        as: 'student',
        attributes: ['id', 'name'],
      },
    ];

    const { page } = req.query;

    if (page) {
      const limit = 5;

      const plansCount = await HelpOrder.count({ where: { answer: null } });
      const lastPage = page * limit >= plansCount;

      const helpOrders = await HelpOrder.findAll({
        where: { answer: null },
        limit,
        offset: (page - 1) * limit,
        include,
      });
      return res.json({ lastPage, content: helpOrders });
    }

    const helpOrders = await HelpOrder.findAll({
      include,
    });
    return res.json(helpOrders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { answer } = req.body;

    const helpOrderId = req.params.id;

    const helpOrder = await HelpOrder.findByPk(helpOrderId, {
      attributes: ['id', 'question', 'answer', 'answer_at'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (!helpOrder) {
      return res.status(400).json({ error: 'Help order not found.' });
    }

    helpOrder.answer = answer;
    helpOrder.answer_at = new Date();

    await helpOrder.save();

    await Queue.add(HelpOrderMail.key, {
      helpOrder,
    });

    return res.json(helpOrder);
  }

  async delete(req, res) {
    const { id } = req.params;

    const helpOrder = await HelpOrder.findByPk(id);

    if (!helpOrder) {
      return res.status(400).json({ error: 'Help order not found.' });
    }

    helpOrder.destroy();

    return res.send();
  }
}

export default new HelpOrderController();
