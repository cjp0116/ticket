import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../actions/usersActions";
import { Card, Container, Header, Icon, Image, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { deleteUser } from "../../actions/usersActions";

const UserList = (props) => {
  const dispatch = useDispatch();
  const users = useSelector((store) => store.users);
  useEffect(() => {
    if (!users.length) {
      dispatch(getUsers());
    }
  }, []);
  
  const handleDeleteUser = (username) => {
    dispatch(deleteUser(username))
  }
  
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
          <Card>
            <Image src="https://palmbayprep.org/wp-content/uploads/2015/09/user-icon-placeholder.png" wrapped />
            <Card.Content>
              <Card.Header>{user.username}</Card.Header>
              <Card.Meta><Icon name="mail outline"/> {user.email}</Card.Meta>
              <Card.Meta><Icon name="building outline" /> {user.deptcode}</Card.Meta>
              <Card.Content extra>
                <Link to={`/users/${user.username}`}>
                  <Button circular icon="settings" positive>Edit</Button>
                </Link>
                <Button onClick={() => handleDeleteUser(user.username)} circular icon="Delete" negative>Delete</Button>
              </Card.Content>
            </Card.Content>  
          </Card>
        ))}
      </Card.Group>
    </Container>
  );
};

export default UserList;
