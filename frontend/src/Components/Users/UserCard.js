import React from "react";
import { Card, Image, Icon } from "semantic-ui-react";
import UserModal from "./UsersModal";

const UserCard = ({ user }) => {
  return (
    <Card key={user.username}>
      <Image
        src="https://palmbayprep.org/wp-content/uploads/2015/09/user-icon-placeholder.png"
        wrapped
      />
      <Card.Content>
        <Card.Header>{user.username}</Card.Header>
        <Card.Meta>
          <Icon name="mail outline" /> {user.email}
        </Card.Meta>
        <Card.Meta>
          <Icon name="building outline" /> {user.deptcode}
        </Card.Meta>
        <Card.Content extra>
          <UserModal edit user={user} />
          <UserModal delete username={user.username} />
        </Card.Content>
      </Card.Content>
    </Card>
  );
};

export default UserCard;