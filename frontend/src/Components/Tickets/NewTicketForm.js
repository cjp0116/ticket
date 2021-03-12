import React, { useState, useEffect } from 'react'; 
import { useSelector, useDispatch } from 'react-redux';
import { Form, Header, Container, Message } from 'semantic-ui-react';

import { postTicket } from "../../actions/ticketActions";
import ErrorMessages from "../UI/ErrorMessages";
import Api from "../../backendAPI";

const importanceLevelOptions = [
  {
    key: 1,
    text: '1. None',
    value: 1,
    name : "importanceLevel",
    label: { color: 'green', empty: true, circular: true }
  },
  {
    key: 2,
    text: '2. Low',
    value: 2,
    name : "importanceLevel",
    label: { color: 'yellow', empty: true, circular: true }
  },
  {
    key: 3,
    text: '3. Normal',
    value: 3,
    name : "importanceLevel",
    label: { color: 'orange', empty: true, circular: true }
  },
  {
    key: 4,
    text: '4. High',
    value: 4,
    label: { color: 'red', empty: true, circular: true }
  },
  {
    key: 5,
    text: '5. Critical',
    value: 5,
    label: { color: 'red', empty: true, circular: true }
  }
];
const statusOptions = [
  {
    key: 'Open',
    text: 'Open',
    value: false,
    label: { color: 'red', empty: true, circular: true }
  },
  {
    key: 'Closed',
    text: 'Closed',
    value: true,
    label: { color: 'green', empty: true, circular: true }
  }
];
const departmentOptions = [
  {
    key : 'Full Stack',
    text : 'Full Stack',
    value : 'F_STACK',
  },
  {
    key : 'Front End',
    text : 'Front End',
    value : 'F_END'
  },
  {
    key : 'Back End',
    text : 'Back End',
    value : 'B_END'
  }
];

const NewTicketForm = props => {

  const dispatch = useDispatch();
  const errors = useSelector(st => st.errors.errors);
  const currentDate = new Date();

  const [loading, setLoading] = useState(null);
  const [success, setSuccess] = useState(null);
  const [ticket, setTicket] = useState({});

  const [form, setForm] = useState({
    createdBy: "",
    assignedTo: "",
    createdAt: currentDate,
    importanceLevel: importanceLevelOptions[0].value,
    closedAt: "",
    isResolved : statusOptions[0].value,
    assignedGroup : departmentOptions[0].value,
    subject: "",
    requestDetail: "",
    notes: ""
  });
  
  useEffect(() => {
    const fetchTicket = async (ticketID) => {
      try {
        setLoading(true);
        const res = await Api.request(
          `http://localhost:5000/tickets/${ticketID}`
        );
        const ticket = res.data.ticket;
        setTicket(ticket);
      } catch (e) {
        setTicket({});
      }
      setLoading(false);
    };

    fetchTicket(props.ticketID);
  }, [props.ticketID]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(form => ({ ...form, [name]: value }))
  };

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    dispatch(postTicket({ ...form }));
    setLoading(false);
    if(!errors.length) {
      setSuccess(true);
    }
  }
  console.log(ticket)
  return (  
    <Container textAlign="justified">
      {errors.length && <ErrorMessages errors={errors} />}
      {success && <Message success header="Ticket successfully created" />}
      <Header as='h2'>New Ticket</Header>
      <Form onSubmit={handleSubmit} loading={loading}>
        <Form.Input
          label="Created At"
          placeholder={currentDate}
          readOnly
          onChange={handleChange}
        />
        <Form.Select
          label="Assign Group"
          placeholder="Select department"
          value={form.assignedGroup}
          options={departmentOptions}
          onChange={(e, data) => setForm(form => ({ ...form, assignedGroup : data.value }))}
        />
        <Form.Group widths='equal'>
          <Form.Input
            icon="user"
            iconPosition="left"
            label="Created by"
            placeholder="Username"
            value={form.createdBy}
            name="createdBy"
            onChange={handleChange}
          />
          <Form.Input
            icon="user"
            iconPosition="left"
            label="Assign To"
            placeholder="Username"
            value={form.assignedTo}
            name="assignedTo"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Input
          label="Subject"
          placeholder='Subject'
          onChange={handleChange}
          name="subject"
          value={form.subject}
        />
        <Form.TextArea 
          label="Request Details"
          style={{ minHeight : 100 }}
          placeholder="Details of ticket.."
          name="requestDetail"
          value={form.requestDetail}
          onChange={handleChange}
        />
        <Form.TextArea
          label='Notes'
          style={{ minHeight: 100 }}
          placeholder="notes"
          name="notes"
          value={form.notes}
          onChange={handleChange}
        />
        <Form.Group>
          <Form.Select
            placeholder="Select importance level"
            selection
            label="Importance Level"
            options={importanceLevelOptions}
            name="importanceLevel"
            onChange={(e, data) => setForm(form => ({ ...form, importanceLevel : data.value}))}
            value={form.importanceLevel}
          />
          <Form.Select
            placeholder="Ticket Status"
            label="Status"
            selection
            options={statusOptions}
            name="status"
            onChange={(e, data) => setForm(form => ({ ...form, isResolved : data.value }))}
            value={form.isResolved}
          />
        </Form.Group>
        {!props.edit && <Form.Button type="submit">Submit</Form.Button>}
      </Form>
    </Container>
  )
};

export default NewTicketForm;
