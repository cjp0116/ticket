import React, { useState } from "react";
import { Button, Header, Icon, Modal } from "semantic-ui-react";
import { deleteUser } from "../../actions/usersActions";
import { useDispatch } from "react-redux";
import EditUser from "./NewUserForm";

const UserModal = (props) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const handleDeleteUser = (username) => {
    dispatch(deleteUser(username));
    setOpen(false);
  };
  return (
    <Modal
      basic={props.delete}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size="small"
      trigger={
        props.delete ? (
          <Button circular negative>
            Delete
          </Button>
        ) : (
          <Button circular positive>
            Edit
          </Button>
        )
      }
    >
      {props.delete && (
        <>
          <Header icon>
            <Icon name="archive" />
            Delete user {props.username}
          </Header>
          <Modal.Content>
            <p>
              Do you really want to delete this user? This operation is
              irreversable.
            </p>
          </Modal.Content>
          <Modal.Actions>
            <Button basic color="red" inverted onClick={() => setOpen(false)}>
              <Icon name="remove" /> No
            </Button>
            <Button
              color="green"
              inverted
              onClick={() => handleDeleteUser(props.username)}
            >
              <Icon name="checkmark" /> Yes
            </Button>
          </Modal.Actions>
        </>
      )}
      {
        props.edit && (
          <>
            <Modal.Content>
              <EditUser edit user={props.user}/>
            </Modal.Content>
          </>
        )
      }
    </Modal>
  );
};

export default UserModal;
