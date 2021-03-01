import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Login from "../Components/Auth/Login";
import TicketList from "../Components/Tickets/TicketList";
import Ticket  from "../Components/Tickets/Ticket"

const Routes = props => {
  return (
    <Switch>
      <Route exact path="/" component={TicketList} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/tickets" component={TicketList} />
      <Route exact path="/tickets/:ticketID" component={Ticket} />
      <Redirect to="/tickets" />
    </Switch>
  )
};

export default Routes;