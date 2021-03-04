import React, { useState } from 'react';
import { Container, Header, Icon } from "semantic-ui-react";
const SearchTicketPage = props => {
  const [searchFields, setSearchFields] = useState({
    ticketID : "",
    date : "",
    createdBy : "",
    assignedTo : "",
    status : "",
  });
  return (
    <Container textAlign='justified'>
      <Header as="h5" icon>
        <Icon name="search" />
        Search Ticket
      </Header>
    </Container>
  )
};

export default SearchTicketPage