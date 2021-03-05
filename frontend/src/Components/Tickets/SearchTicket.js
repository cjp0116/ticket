import React, { useState } from "react";
import { Container, Header, Icon } from "semantic-ui-react";
const SearchTicketPage = (props) => {
  const [searchFields, setSearchFields] = useState({
    ticketID: "",
    date: "",
    createdBy: "",
    assignedTo: "",
    status: "",
  });
  return (
    <Container textAlign="justified">
      <Icon name="search" />{" "}
      <Header as="h3" icon>
        Search Ticket
      </Header>
      
    </Container>
  );
};

export default SearchTicketPage;
