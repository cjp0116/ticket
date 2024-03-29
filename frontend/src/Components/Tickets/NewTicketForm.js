import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Header, Container, Message } from "semantic-ui-react";
import { postTicket, updateTicket } from "../../actions/ticketActions";
import ErrorMessages from "../UI/ErrorMessages";

const currentdate = new Date();
let dateTime = (currentdate.getMonth() + 1)+ "/"
              + currentdate.getDate() + "/"
              + currentdate.getFullYear() + ' @ '
              + currentdate.getHours() + ":" 
              + currentdate.getMinutes();

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
  createdBy: "",
  assignedTo: "",
  createdAt: currentdate,
  importanceLevel: importanceLevelOptions[0].value,
  closedAt: "",
  isResolved: statusOptions[0].value,
  assignedGroup: departmentOptions[0].value,
  subject: "",
  requestDetail: "",
  notes: "",
};

const NewTicketForm = (props) => {
  const dispatch = useDispatch();
  const errors = useSelector((st) => st.errors);

  const [loading, setLoading] = useState(null);
  const [success, setSuccess] = useState(null);

  const [form, setForm] = useState({
    createdBy: props.ticket.createdby || "",
    assignedTo: props.ticket.assignedto || "",
    createdAt: props.ticket.createdat || currentdate,
    importanceLevel:
      props.ticket.importancelevel || importanceLevelOptions[0].value,
    closedAt: props.ticket.closedat || "",
    isResolved: props.ticket.isresolved || statusOptions[0].value,
    assignedGroup: props.ticket.assignedgroup || departmentOptions[0].value,
    subject: props.ticket.subject || "",
    requestDetail: props.ticket.requestdetail || "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((form) => ({ ...form, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if(form.isResolved) {
      setForm(form => ({...form, closedAt : currentdate }))
    }
    props.edit
      ? dispatch(updateTicket(props.ticketID, { ...form }))
      : dispatch(postTicket({ ...form }));
    setLoading(false);
    if (!errors.length) {
      setSuccess(true);
      setForm(INITIAL_STATE);
    }
  };
  console.log(errors);
  return (
    <Container
      textAlign="justified"
      style={{
        marginTop: "1rem",
        boxShadow: "2px 2px 7px 0 rgb(0 0 0 / 12%)",
        padding: "1rem",
      }}
    >
      {errors && <ErrorMessages errors={errors.errors} />}
      {success && (
        <Message
          success
          header={
            !props.edit
              ? "Ticket successfully created"
              : "Ticket successfully updated"
          }
        />
      )}
      <Header as="h2" style={{ marginTop: "2rem" }}>
        {props.edit ? "Edit" : "New"} Ticket
      </Header>
      <Form onSubmit={handleSubmit} loading={loading}>
        <Form.Input
          label="Created At"
          placeholder={dateTime}
          readOnly
        />
        <Form.Select
          label="Assign Group"
          placeholder="Select department"
          value={form.assignedGroup}
          options={departmentOptions}
          onChange={(e, data) =>
            setForm((form) => ({ ...form, assignedGroup: data.value }))
          }
        />
        <Form.Group widths="equal">
          <Form.Input
            icon="user"
            iconPosition="left"
            label="Created by"
            placeholder="Username"
            value={form.createdBy}
            name="createdBy"
            onChange={handleChange}
            required={!props.edit}
          />
          <Form.Input
            icon="user"
            iconPosition="left"
            label="Assign To"
            placeholder="Username"
            value={form.assignedTo}
            name="assignedTo"
            onChange={handleChange}
            required={!props.edit}
          />
        </Form.Group>
        <Form.Input
          label="Subject"
          placeholder="Subject"
          onChange={handleChange}
          name="subject"
          value={form.subject}
          required={!props.edit}

        />
        <Form.TextArea
          label="Request Details"
          style={{ minHeight: 100 }}
          placeholder="Details of ticket.."
          name="requestDetail"
          value={form.requestDetail}
          onChange={handleChange}
          required={!props.edit}

        />
        {!props.edit && (
          <Form.TextArea
            label="Notes"
            style={{ minHeight: 100 }}
            placeholder="notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
          />
        )}

        <Form.Group>
          <Form.Select
            placeholder="Select importance level"
            selection
            label="Importance Level"
            options={importanceLevelOptions}
            name="importanceLevel"
            onChange={(e, data) =>
              setForm((form) => ({ ...form, importanceLevel: data.value }))
            }
            value={form.importanceLevel}
          />
          <Form.Select
            placeholder="Ticket Status"
            label="Status"
            selection
            options={statusOptions}
            name="status"
            onChange={(e, data) =>
              setForm((form) => ({ ...form, isResolved: data.value }))
            }
            value={form.isResolved}
          />
        </Form.Group>
        {!props.edit ? (
          <Form.Button type="submit" secondary>
            Submit
          </Form.Button>
        ) : (
          <Form.Button secondary fluid style={{ marginTop: "1rem" }}>
            Edit
          </Form.Button>
        )}
      </Form>
    </Container>
  );
};

export default NewTicketForm;
