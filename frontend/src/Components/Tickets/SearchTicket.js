import React, { useState } from "react";
import {
  Container,
  Header,
  Icon,
  Form,
  Input,
  Table,
  Loader,
  Dimmer,
} from "semantic-ui-react";
import Api from "../../backendAPI";
import TicketData from "./TicketData";
import { useDispatch } from "react-redux";
import { deleteTicket } from "../../actions/ticketActions";
const importanceLevelOptions = [
  {
    key: 1,
    text: "1. None",
    value: 1,
    name: "importanceLevel",
    label: { color: "green", empty: true, circular: true },
  },
  {
    key: 2,
    text: "2. Low",
    value: 2,
    name: "importanceLevel",
    label: { color: "yellow", empty: true, circular: true },
  },
  {
    key: 3,
    text: "3. Normal",
    value: 3,
    name: "importanceLevel",
    label: { color: "orange", empty: true, circular: true },
  },
  {
    key: 4,
    text: "4. High",
    value: 4,
    label: { color: "red", empty: true, circular: true },
  },
  {
    key: 5,
    text: "5. Critical",
    value: 5,
    label: { color: "red", empty: true, circular: true },
  },
];
const statusOptions = [
  {
    key: "Open",
    text: "Open",
    value: false,
    label: { color: "red", empty: true, circular: true },
  },
  {
    key: "Closed",
    text: "Closed",
    value: true,
    label: { color: "green", empty: true, circular: true },
  },
];
const departmentOptions = [
  {
    key: "Full Stack",
    text: "Full Stack",
    value: "F_STACK",
  },
  {
    key: "Front End",
    text: "Front End",
    value: "F_END",
  },
  {
    key: "Back End",
    text: "Back End",
    value: "B_END",
  },
];
const INITIAL_STATE = {
  ticketID: "",
  dateFrom: "",
  dateTo: "",
  createdBy: "",
  assignedTo: "",
  isResolved: "",
  importanceLevel: "",
  assignedGroup: "",
};
const SearchTicketPage = (props) => {
  const dispatch = useDispatch();
  const [tickets, setTickets] = useState([]);
  const [searchFields, setSearchFields] = useState({
    ticketID: "",
    dateFrom: "",
    dateTo: "",
    createdBy: "",
    assignedTo: "",
    isResolved: "",
    importanceLevel: "",
    assignedGroup: "",
  });
  const [loading, setLoading] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchFields((s) => ({ ...s, [name]: value }));
  };
  const handleDeleteConfirm = (ticketID) => {
    setLoading(true);
    dispatch(deleteTicket(ticketID));
    setLoading(false);
    setOpenConfirm(false);
  };

  const sendHTTPSearch = async (searchFields) => {
    try {
      const results = await Api.request(
        "http://localhost:5000/tickets/search",
        { ...searchFields },
        "POST"
      );
      const searchResults = results.data.searchResults;
      setTickets(searchResults);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await sendHTTPSearch(searchFields);
    setLoading(false);
    setSearchFields(INITIAL_STATE);
  };

  return (
    <Container textAlign="justified">
      <Icon name="search" />{" "}
      <Header as="h3" icon>
        Search Ticket
      </Header>
      <Form loading={loading} onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Field inline>
            <label>Ticket#</label>
            <Input
              name="ticketID"
              value={searchFields.ticketID}
              onChange={handleChange}
              placeholder="35"
            />
          </Form.Field>

          <Form.Field inline>
            <label>Date From</label>
            <Input
              type="date"
              onChange={handleChange}
              value={searchFields.dateFrom}
              name="dateFrom"
            />
          </Form.Field>

          <Form.Field inline>
            <label>Date To</label>
            <Input
              type="date"
              name="dateTo"
              onChange={handleChange}
              value={searchFields.dateTo}
            />
          </Form.Field>
        </Form.Group>

        <Form.Group>
          <Form.Field width={6} inline>
            <label>Created By</label>
            <Input
              name="createdBy"
              onChange={handleChange}
              value={searchFields.createdBy}
            />
          </Form.Field>

          <Form.Field width={6} inline>
            <label>Assigned To</label>
            <Input
              name="assignedTo"
              onChange={handleChange}
              value={searchFields.assignedTo}
            />
          </Form.Field>
        </Form.Group>
        <Form.Group>
          <Form.Select
            label="Status"
            options={statusOptions}
            name="isResolved"
            value={searchFields.isResolved}
            onChange={(e, data) =>
              setSearchFields((s) => ({ ...s, isResolved: data.value }))
            }
          />
          <Form.Select
            label="Assigned Group"
            name="assignedGroup"
            options={departmentOptions}
            value={searchFields.assignedGroup}
            onChange={(e, data) =>
              setSearchFields((s) => ({ ...s, assignedGroup: data.value }))
            }
          />
          <Form.Select
            label="Importance Level"
            name="importanceLevel"
            options={importanceLevelOptions}
            value={searchFields.importanceLevel}
            onChange={(e, data) =>
              setSearchFields((s) => ({ ...s, imporatanceLevel: data.value }))
            }
          />
        </Form.Group>
        <Form.Button type="submit">Search</Form.Button>
      </Form>
      <Table celled selectable>
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell>Ticket #</Table.HeaderCell>
            <Table.HeaderCell>Created By</Table.HeaderCell>
            <Table.HeaderCell>Assigned To</Table.HeaderCell>
            <Table.HeaderCell>Created At</Table.HeaderCell>
            <Table.HeaderCell>Importance Level</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Subject</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {loading && (
          <Dimmer active inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>
        )}
        <Table.Body>{tickets.map(t => (
          <TicketData tickets={tickets} handleDeleteConfirm={handleDeleteConfirm} openConfirm={openConfirm} setOpenConfirm={setOpenConfirm} />
        ))}</Table.Body>
      </Table>
    </Container>
  );
};

export default SearchTicketPage;
