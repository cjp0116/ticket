import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Header, Container } from 'semantic-ui-react';
import { postTicket } from "../../actions/ticket";
import AuthContext from "../../context/AuthContext";
const importanceLevelOptions = [
  {
    key: 1,
    text: 'None',
    value: 1,
    name : "importanceLevel",
    label: { color: 'green', empty: true, circular: true }
  },
  {
    key: 2,
    text: 'Low',
    value: 2,
    name : "importanceLevel",
    label: { color: 'yellow', empty: true, circular: true }
  },
  {
    key: 3,
    text: 'Normal',
    value: 3,
    name : "importanceLevel",
    label: { color: 'orange', empty: true, circular: true }
  },
  {
    key: 4,
    text: 'High',
    value: 4,
    label: { color: 'red', empty: true, circular: true }
  },
  {
    key: 5,
    text: 'Critical',
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
]
const NewTicketForm = props => {
  // const { currentUser } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const currentDate = new Date();
  const [loading, setLoading] = useState(null);
  const [form, setForm] = useState({
    createdBy: "",
    assignTo: "",
    createdAt: currentDate,
    importanceLevel: "",
    closedAt: "",
    status: "",
    subject: "",
    requestDetail: "",
    notes: ""
  });
  const dispatch = useDispatch();
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(form => ({ ...form, [name]: value }))
  }
  
  const handleSelect = e => {
    console.log(e.target.name)
    console.log(e.target.value)
  }

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    dispatch(postTicket({ ...form }));
    
  }
  return (
    <Container textAlign="justified">
      <Header as='h2'>New Ticket</Header>
      <Form onSubmit={handleSubmit} loading={loading}>
        <Form.Input
          label="Created At"
          placeholder={currentDate}
          readOnly
          onChange={handleChange}
        />
        <Form.Group widths='equal'>
          <Form.Input
            icon="user"
            iconPosition="left"
            label="Created by"
            placeholder="Username"
            error={error}
            value={form.createdBy}
            name="createdBy"
            onChange={handleChange}
          />
          <Form.Input
            icon="user"
            iconPosition="left"
            label="Assign To"
            placeholder="Username"
            error={
              error && { content: 'Please enter a username', pointing: 'below' }
            }
            value={form.assignTo}
            name="assignTo"
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
            onChange={handleSelect}
            defaultValue={importanceLevelOptions[0].value}
            // value={form.importanceLevel}
          />
          <Form.Select
            placeholder="Ticket Status"
            label="Status"
            selection
            options={statusOptions}
            name="status"
            onChange={handleSelect}
            // value={form.status}
            defaultValue={statusOptions[0].value}
          />
        </Form.Group>
        <Form.Button>Submit</Form.Button>
      </Form>
    </Container>
  )
};

export default NewTicketForm;