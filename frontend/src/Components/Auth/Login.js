import React, { useState, useContext } from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
} from "semantic-ui-react";
import AuthContext from "../../context/AuthContext";
import { useHistory } from 'react-router-dom';
import { decode } from "jsonwebtoken";
import Api from "../../backendAPI";

const Login = (props) => {
  const { setToken, setCurrentUser } = useContext(AuthContext)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const history = useHistory();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm((form) => ({ ...form, [e.target.name]: e.target.value }));
  };
  
  const handleSubmit = async (e) => {
    let token;
    let user;
    try {
      setLoading(true);
      e.preventDefault();
      const res = await Api.request('http://localhost:5000/login/', form, 'POST');
      console.log(res.data);
      token = res.data.token;
      setToken(token);
      const { username } = decode(token);
      user = await Api.request(`http://localhost:5000/users/${username}`);
      setCurrentUser(user.data.user);
      setLoading(false);
      history.push("/tickets");
    } catch (e) {
      console.error(e)
      setError(true);
      setLoading(false);
      setCurrentUser(null);
    }
  };
  return (
    <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="black" textAlign="center">
          Log-in to your account
        </Header>
        <Form
          error={error}
          size="large"
          loading={loading}
          onSubmit={handleSubmit}
        >
          <Segment stacked>
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="username"
              name="username"
              value={form.username}
              onChange={handleChange}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />
            {error && <Message header="Error" content="Invalid credentials." />}
            <Button color="black" fluid size="large">
              Login
            </Button>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

export default Login;
