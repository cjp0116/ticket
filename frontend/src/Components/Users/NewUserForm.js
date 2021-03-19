import React, { useState, useEffect } from "react";
import { Container, Form, Header, Checkbox, Message } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import { createUser } from "../../actions/usersActions";
import ErrorMessages from "../UI/ErrorMessages";
import { useParams } from "react-router-dom";
import { updateUser } from "../../actions/usersActions";

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
  console.log(useParams)
  const { username } = useParams();

  const users = useSelector((store) => store.users);
  const user = users.find((u) => u.username === username);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();

  const errors = useSelector((st) => st.errors.errors);
  const [form, setForm] = useState({
    username: user.username || "",
    email: user.email || "",
    password: "",
    firstName: user.firstname || "",
    lastName: user.lastname || "",
    deptCode: user.deptcode || "",
    isAdmin: user.isadmin || false,
  });

  const handleSubmit = (e) => {
    setSuccess(false);
    e.preventDefault();
    setLoading(true);
    console.log(form);
    dispatch(createUser({ ...form }));
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((form) => ({ ...form, [name]: value }));
    if (!errors.length) {
      setSuccess(true);
    }
  };

  const handleUserUpdate = (e, form) => {
    e.preventDefault();
    setLoading(true);
    dispatch(updateUser(username, form));
    setLoading(false);
  };

  console.log('useParams', username)
  return (
    <Container
      textAlign="justified"
      style={{
        marginTop: "1rem",
        boxShadow: "2px 2px 7px 0 rgb(0 0 0 / 12%)",
        padding: "1rem",
      }}
    >
      {errors.length > 0 && <ErrorMessages errors={errors} />}
      {success && <Message success header="User successfully created" />}
      <Header as="h2" style={{ marginTop: "2rem" }}>
        {props.edit ? "Edit User" : 'User Registration'}
      </Header>
      <Form onSubmit={props.edit ? handleUserUpdate : handleSubmit} loading={loading}>
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
        <Form.Button secondary type="submit" style={{ marginTop: "1rem" }}>
          Submit
        </Form.Button>
      </Form>
    </Container>
  );
};

export default NewUserForm;
