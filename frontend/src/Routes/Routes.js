import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Login from "../Components/Auth/Login";
import TicketList from "../Components/Tickets/TicketList";
import Ticket  from "../Components/Tickets/Ticket"
import NewTicketForm from "../Components/Tickets/NewTicketForm";
import SearchTicketPage from "../Components/Tickets/SearchTicket";

const Routes = props => {
  return (
    <Switch>
      <Route exact path="/" >
        <TicketList />
      </Route>
      <Route exact path="/newTicket">
        <NewTicketForm />
      </Route>
      <Route exact path="/login">
        <Login />
      </Route>
      <Route exact path="/tickets">
        <TicketList mine />
      </Route>
      <Route exact path="/group">
        <TicketList />
      </Route>
      <Route exact path="/search">
        <SearchTicketPage />
      </Route>
      <Route exact path="/tickets/:ticketID">
        <Ticket />
      </Route>
      <Redirect to="/tickets" />
    </Switch>
  )
};

export default Routes;