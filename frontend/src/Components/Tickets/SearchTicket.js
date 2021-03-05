import React, { useState } from "react";
import { Container, Header, Icon, Form } from "semantic-ui-react";

const SearchTicketPage = (props) => {

  const [searchFields, setSearchFields] = useState({
    ticketID: "",
    date: "",
    createdBy: "",
    assignedTo: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);

  return (
    <Container textAlign="justified">
      <Icon name="search" />{" "}<Header as="h3" icon>Search Ticket</Header>
      <Form loading={loading}>

      </Form>
    </Container>
  );
};

export default SearchTicketPage;
