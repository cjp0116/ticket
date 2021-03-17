import React, { useState } from "react";
import { Popup, Confirm, Button } from "semantic-ui-react";
import { deleteTicket } from "../../actions/ticketActions";
import { useDispatch } from 'react-redux';
import EditTicketForm from "./NewTicketForm";

const TicketModals = (props) => {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState({
    edit: false,
    remove: false,
  });
  
  const toggleEdit = () => {
    setShowForm(state => ({ ...state, edit : !state.edit }));
  };
  
  const toggleRemove = () => {
    setShowForm(state => ({ ...state, remove : !state.remove }))
  };
  
  const handleDeleteTicket = ticketID => {
    dispatch(deleteTicket(ticketID));
  }

  return (
    <>
      <Popup
        content={props.typeOfConfirm === 'edit' ? `Edit ticket ${props.ticketID}` : `Delete ticket ${props.ticketID}`}
        trigger={
          <Button
            icon={props.typeOfConfirm === 'edit' ? 'edit' : 'remove'}
            size='small'
            color={props.typeOfConfirm === 'edit' ? 'green' : 'red'}
            circular
            onClick={props.typeOfConfirm === 'edit' ? toggleEdit : toggleRemove}
          />
        }
      />
      <Confirm
        open={props.typeOfConfirm === 'edit' ? showForm.edit : showForm.remove}
        header={props.typeOfConfirm === 'edit' ? `Edit ticket ${props.ticketID}` : `Delete ticket ${props.ticketID}`}
        content={
          props.typeOfConfirm === 'edit' ? 
          <EditTicketForm ticketID={props.ticketID} edit ticket={props.ticket} /> :
          'The operation is irreversable, are you sure?'
        }

        onCancel={
          props.typeOfConfirm === 'edit' ? toggleEdit : toggleRemove
        }
        onConfirm={
          props.typeOfConfirm === 'remove' ?
          () => handleDeleteTicket(props.ticketID) :
          toggleEdit
        }
      />
    </>
  );
};

export default TicketModals;
