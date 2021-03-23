import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../actions/usersActions";
import { Card, Container, Header, Icon, Image } from "semantic-ui-react";
import UserSearch from "./UserSearch";
import UserCard from "./UserCard";

const UserList = (props) => {
  const dispatch = useDispatch();
  const users = useSelector((store) => store.users);
  useEffect(() => {
    if (!users.length) {
      dispatch(getUsers());
    }
  }, []);
  
  
  return (
    <Container>
      <div>
        <Header as="h2" icon textAlign="center">
          <Icon name="users" circular />
          <Header.Content>Users</Header.Content>
        </Header>
        <UserSearch source={users}/>
      </div>
      <Card.Group>
        {users.map((user) => (
          <UserCard user={user} />
        ))}
      </Card.Group>
    </Container>
  );
};

export default UserList;
