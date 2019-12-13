module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'students',
      [
        {
          name: 'Hugo Marcelo',
          email: 'hugo.marcelo@lg.com.br',
          age: 28,
          weight: 85,
          height: 1.75,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Diego Marques',
          email: 'diego@lg.com.br',
          age: 30,
          weight: 70.9,
          height: 1.68,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: queryInterface => queryInterface.bulkDelete('students', null, {}),
};
