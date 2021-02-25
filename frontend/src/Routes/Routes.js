import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import HomePage from "../Components/HomePage";
import Login from "../Components/Auth/Login";
import TicketList from "../Components/Tickets/TicketList";

const Routes = props => {
  return (
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/login" component={Login} />
      <Route to="/tickets" component={TicketList} />
      <Redirect to="/" />
    </Switch>
  )
};

export default Routes;