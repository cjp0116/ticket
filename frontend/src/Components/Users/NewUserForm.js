import React, { useState } from "react";
import { Container, Form, Header } from "semantic-ui-react";

// create table users (
//   id serial primary key,
//   email varchar(254) not null unique,
//   username text not null unique,
//   password text not null,
//   firstName text not null,
//   lastName text not null,
//   deptCode text REFERENCES departments (deptCode) ON DELETE CASCADE,
//   isAdmin BOOLEAN default false
// );
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
const NewUserForm = (props) => {
  const [form, setForm] = useState({
    username : "",
    email : "",
    password : "",
    firstName : "",
    lastName : "",
    deptCode : "",
    isAdmin : false,
  });
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((form) => ({ ...form, [name]: value }));
  };
  return (
    <Container textAlign="justified">
      <Header as="h2">User Registration</Header>
      <Form onSubmit={handleSubmit}>
        <Form.Group widths="equal">
          <Form.Input
            label="First Name"
            placeholder="John"
            onChange={handleChange}
            name="firstName"
            value={form.firstName}
          />
          <Form.Input
            label="Last Name"
            placeholder="Park"
            onChange={handleChange}
            name="lastName"
            value={form.lastName}
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
        />
        <Form.Group widths='equal'>
          <Form.Select 
            label="Department"
            selection
            options={departmentOptions}
            value={form.deptCode}
            onChange={(e, data) => setForm(form => ({ ...form, deptCode : data.value }))}
          />
        </Form.Group>
      </Form>
    </Container>
  );
};

export default NewUserForm;
