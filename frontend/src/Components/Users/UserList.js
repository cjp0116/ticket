import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../actions/usersActions";
import { Card, Container, Header, Icon, Image } from "semantic-ui-react";
import UserModal from "./UsersModal";

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
      </div>
      <Card.Group>
        {users.map((user) => (
          <Card key={user.username}>
            <Image src="https://palmbayprep.org/wp-content/uploads/2015/09/user-icon-placeholder.png" wrapped />
            <Card.Content>
              <Card.Header>{user.username}</Card.Header>
              <Card.Meta><Icon name="mail outline"/> {user.email}</Card.Meta>
              <Card.Meta><Icon name="building outline" /> {user.deptcode}</Card.Meta>
              <Card.Content extra>
                <UserModal edit user={user} />
                <UserModal delete username={user.username} />
              </Card.Content>
            </Card.Content>  
          </Card>
        ))}
      </Card.Group>
    </Container>
  );
};

export default UserList;
