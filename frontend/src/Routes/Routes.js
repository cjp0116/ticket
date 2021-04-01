import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Login from "../Components/Auth/Login";
import TicketList from "../Components/Tickets/TicketList";
import Ticket from "../Components/Tickets/Ticket";
import NewTicketForm from "../Components/Tickets/NewTicketForm";
import SearchTicketPage from "../Components/Tickets/SearchTicket";
import NewUserForm from "../Components/Users/NewUserForm";
import UserList from "../Components/Users/UserList";

const Routes = (props) => {
  if (props.nonAuth) {
    return (
      <Switch>
        <Route exact path="/login">
          <Login />
        </Route>
        <Redirect to="/login" />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route exact path="/newTicket">
        <NewTicketForm edit={false} ticket={{}} />
      </Route>

      <Route exact path="/login">
        <Login />
      </Route>

      <Route exact path="/tickets">
        <TicketList mine />
      </Route>

      <Route exact path="/group">
        <TicketList group />
      </Route>

      <Route exact path="/recent">
        <TicketList recent />
      </Route>

      <Route exact path="/search">
        <SearchTicketPage />
      </Route>

      <Route exact path="/newUser">
        <NewUserForm user={{}} />
      </Route>

      <Route exact path="/users">
        <UserList />
      </Route>

      <Route exact path="/tickets/:ticketID">
        <Ticket />
      </Route>

      <Redirect to="/login" />
    </Switch>
  );
};

export default Routes;
