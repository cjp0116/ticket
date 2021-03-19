import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../actions/usersActions";
import { Card, Container, Header, Icon } from "semantic-ui-react";

const UserList = (props) => {
  const dispatch = useDispatch();
  const users = useSelector((store) => store.users);
  useEffect(() => {
    if (!users.length) {
      dispatch(getUsers());
    }
  }, []);
  console.log(users);
  return (
    <Container>
      <div>
        <Header as="h2" icon textAlign="center">
          <Icon name="users" circular />
          <Header.Content>Users</Header.Content>
        </Header>

      </div>
      <Card.Group>
        {users.map(user => (
          <Card 
            image="https://palmbayprep.org/wp-content/uploads/2015/09/user-icon-placeholder.png"
            header={user.username}
            meta={user.deptcode}
          />
        ))}
        <Card
          image="/images/avatar/large/elliot.jpg"
          header="Elliot Baker"
          meta="Friend"
          description="Elliot is a sound engineer living in Nashville who enjoys playing guitar and hanging with his cat."
        />
        <Card
          image="/images/avatar/large/elliot.jpg"
          header="Elliot Baker"
          meta="Friend"
          description="Elliot is a sound engineer living in Nashville who enjoys playing guitar and hanging with his cat."
        />
      </Card.Group>
    </Container>
  );
};

export default UserList;
