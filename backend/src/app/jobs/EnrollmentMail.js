import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class EnrollmentMail {
  get key() {
    return 'EnrollmentMail';
  }

  async handle({ data }) {
    const { enrollment, student, plan } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Matrícula realizada',
      template: 'enrollment',
      context: {
        id: student.id,
        student: student.name,
        plan: plan.title,
        price: `R$ ${enrollment.price}`,
        date: format(
          parseISO(enrollment.end_date),
          "'dia' dd 'de' MMMM', às 'H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new EnrollmentMail();
