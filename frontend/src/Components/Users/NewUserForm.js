import React, { useState } from "react";
import { Container, Form, Header, Checkbox, Message } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import { createUser  } from "../../actions/usersActions";
import ErrorMessages from "../UI/ErrorMessages";

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
const NewUserForm = (props) => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    deptCode: "",
    isAdmin: false,
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();
  
  const errors = useSelector(st => st.errors.errors);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(form);
    dispatch(createUser({ ...form }));
    setLoading(false);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((form) => ({ ...form, [name]: value }));
    if(!errors.length) {
      setSuccess(true);
    }
  };
  
  return (
    <Container textAlign="justified">
      {
        errors.length && <ErrorMessages errors={errors} />
      }
      {success && <Message success header="Ticket successfully created" />}
      <Header as="h2">User Registration</Header>
      <Form onSubmit={handleSubmit} loading={loading}>
        <Form.Group widths="equal">
          <Form.Input
            label="First Name"
            placeholder="John"
            onChange={handleChange}
            name="firstName"
            value={form.firstName}
            required
          />
          <Form.Input
            label="Last Name"
            placeholder="Park"
            onChange={handleChange}
            name="lastName"
            value={form.lastName}
            required
          />
        </Form.Group>

        <Form.Input
          icon="user"
          iconPosition="left"
          label="Username"
          placeholder="Username"
          onChange={handleChange}
          name="username"
          value={form.username}
          required
        />
        <Form.Input
          label="Email"
          icon="envelope"
          type="email"
          iconPosition="left"
          name="email"
          onChange={handleChange}
          value={form.email}
        />
        <Form.Input
          icon="key"
          iconPosition="left"
          label="Password"
          placeholder="password"
          type="password"
          name="password"
          onChange={handleChange}
          value={form.password}
          required
        />

        <Form.Select
          label="Department"
          selection
          options={departmentOptions}
          value={form.deptCode}
          onChange={(e, data) =>
            setForm((form) => ({ ...form, deptCode: data.value }))
          }
        />
        <Checkbox
          label="Admin?"
          checked={form.isAdmin}
          toggle
          onChange={(e) =>
            setForm((form) => ({ ...form, isAdmin: !form.isAdmin }))
          }
        />
        <Form.Button type="submit">Submit</Form.Button>
      </Form>
    </Container>
  );
};

export default NewUserForm;
