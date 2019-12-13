import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import { MdAdd, MdCheckCircle } from 'react-icons/md';

import api from '~/services/api';
import history from '~/services/history';

import { Container, DataHeader, Data, NoData, Paginator } from './styles';

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [lastPage, setLastPage] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchEnrollments(1);
  }, []); //eslint-disable-line

  function formatDate(date) {
    return format(parseISO(date), "d 'de' MMMM 'de' yyyy", {
      locale: pt,
    });
  }

  async function fetchEnrollments(currentPage) {
    try {
      const { data } = await api.get('enrollments', {
        params: { page: currentPage },
      });

      const newData = data.content.map(reg => ({
        ...reg,
        start_date: formatDate(reg.start_date),
        end_date: formatDate(reg.end_date),
        page: currentPage,
      }));

      setPage(currentPage);
      setLastPage(data.lastPage);
      setEnrollments(newData);
    } catch (err) {
      toast.error(err.response.data.error);
    }
  }

  async function handleDeleteEnrollment({ id }) {
    if (window.confirm(`Tem certeza que deseja deletar a matrícula?`))  //eslint-disable-line
      try {
        await api.delete(`/enrollments/${id}`);

        const newEnrollments = enrollments.filter(
          enrollment => enrollment.id !== id
        );

        let newPage = newEnrollments.length ? page : page - 1;
        if (newPage === 0) {
          newPage = 1;
        }

        fetchEnrollments(newPage);

        toast.success('Matrícula removida');
      } catch (err) {
        const { error } = err.response.data;
        toast.error(error);
      }
  }

  function handlePreviousPageChange() {
    const currentPage = page - 1;
    fetchEnrollments(currentPage);
  }

  function handleNextPageChange() {
    const currentPage = page + 1;
    fetchEnrollments(currentPage);
  }

  return (
    <Container>
      <DataHeader>
        <strong>Gerenciando matrículas</strong>
        <button type="button" onClick={() => history.push('/enrollments/new')}>
          <MdAdd color="#fff" size={20} />
          <span>CADASTRAR</span>
        </button>
      </DataHeader>

      {enrollments.length ? (
        <>
          <Data>
            <thead>
              <tr>
                <th>ALUNO</th>
                <th>PLANO</th>
                <th>INÍCIO</th>
                <th>TÉRMINO</th>
                <th>ATIVO</th>
                <th aria-label="Título da coluna vazia" />
              </tr>
            </thead>
            <tbody>
              {enrollments.map(enrollment => (
                <tr key={enrollment.id}>
                  <td>{enrollment.student.name}</td>
                  <td>{enrollment.plan.title}</td>
                  <td>{enrollment.start_date}</td>
                  <td>{enrollment.end_date}</td>
                  <td>
                    <MdCheckCircle
                      size={20}
                      color={enrollment.active ? '#42cb59' : '#ddd'}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() =>
                        history.push(`/enrollments/${enrollment.id}/edit`)
                      }
                    >
                      editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteEnrollment(enrollment)}
                    >
                      apagar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Data>

          <Paginator>
            <button
              type="button"
              disabled={page === 1}
              onClick={() => {
                handlePreviousPageChange();
              }}
            >
              Anterior
            </button>
            <button
              disabled={lastPage}
              type="button"
              onClick={() => {
                handleNextPageChange();
              }}
            >
              Próxima
            </button>
          </Paginator>
        </>
      ) : (
        <NoData>
          <span>Nenhuma matrícula encontrada</span>
        </NoData>
      )}
    </Container>
  );
}
