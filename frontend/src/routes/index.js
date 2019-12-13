import React from 'react';
import { Switch } from 'react-router-dom';
import Route from './Route';

import SignIn from '~/pages/SignIn';
import Students from '~/pages/Students';
import StudentForm from '~/pages/StudentForm';
import Plans from '~/pages/Plans';
import PlanForm from '~/pages/PlanForm';
import Enrollments from '~/pages/Enrollments';
import EnrollmentForm from '~/pages/EnrollmentForm';
import HelpOrders from '~/pages/HelpOrders';

import { items } from '~/components/Header/navigation';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />

      <Route
        path={items.students.route}
        component={Students}
        navItem={items.students.name}
        isPrivate
        exact
      />
      <Route
        path={`${items.students.route}/new`}
        component={StudentForm}
        navItem={items.students.name}
        isPrivate
      />
      <Route
        path={`${items.students.route}/:id/edit`}
        component={StudentForm}
        navItem={items.students.name}
        isPrivate
      />

      <Route
        path={items.plans.route}
        component={Plans}
        navItem={items.plans.name}
        isPrivate
        exact
      />
      <Route
        path={`${items.plans.route}/new`}
        component={PlanForm}
        navItem={items.plans.name}
        isPrivate
      />
      <Route
        path={`${items.plans.route}/:id/edit`}
        component={PlanForm}
        navItem={items.plans.name}
        isPrivate
      />

      <Route
        path={items.enrollments.route}
        component={Enrollments}
        navItem={items.enrollments.name}
        isPrivate
        exact
      />
      <Route
        path={`${items.enrollments.route}/new`}
        component={EnrollmentForm}
        navItem={items.enrollments.name}
        isPrivate
      />
      <Route
        path={`${items.enrollments.route}/:id/edit`}
        component={EnrollmentForm}
        navItem={items.enrollments.name}
        isPrivate
      />

      <Route
        path={items.helpOrders.route}
        component={HelpOrders}
        navItem={items.helpOrders.name}
        isPrivate
        exact
      />
    </Switch>
  );
}
