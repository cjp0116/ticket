import React, { useState } from "react";
import { Container, Form, Header, Checkbox, Message, Loader } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import { createUser, updateUser } from "../../actions/usersActions";
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
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const errors = useSelector((st) => st.errors);
  const dispatch = useDispatch();
  
  const [form, setForm] = useState({
    username: props.user.username || "",
    email: props.user.email || "",
    password: "",
    firstName: props.user.firstname || "",
    lastName: props.user.lastname || "",
    deptCode: props.user.deptcode || "",
    isAdmin: props.user.isadmin || false,
  });

  const handleSubmit = (e) => {
    setSuccess(false);
    e.preventDefault();
    setLoading(true);
    console.log("FORM IS :", form);
    props.edit ? dispatch(updateUser(props.user.username, { ...form})) : dispatch(createUser({ ...form }));
    if (!errors) {
      setSuccess(true);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((form) => ({ ...form, [name]: value }));
 
  };
  
  if(loading) return <Loader content="Loading.." />;
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
      {success && <Message success header={ !props.edit ? "User successfully created" : 'Editted user'} />}
      <Header as="h2" style={{ marginTop: "2rem" }}>
        {props.edit ? "Edit User" : 'User Registration'}
      </Header>
      <Form onSubmit={handleSubmit} loading={loading}>
        <Form.Group widths="equal">
          <Form.Input
            label="First Name"
            placeholder="John"
            onChange={handleChange}
            name="firstName"
            value={form.firstName}
            required={!props.edit}
          />
          <Form.Input
            label="Last Name"
            placeholder="Park"
            onChange={handleChange}
            name="lastName"
            value={form.lastName}
            required={!props.edit}
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
          required={!props.edit}
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
          required={!props.edit}
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
