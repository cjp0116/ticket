import React, { useState } from "react";
import { Table, Confirm, Popup, Button, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { updateTicket, deleteTicket } from "../../actions/ticketActions";
import { useDispatch } from 'react-redux';
import EditTicketForm from "./NewTicketForm";
import TicketModals from "./TicketModals";

const TicketData = (props) => {
  const dispatch = useDispatch();

  const [showEdit, setShowEdit] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clickedTicket, setClickedTicket] = useState(null);

  const handleDeleteConfirm = ticketID => {
    setLoading(true);
    dispatch(deleteTicket(ticketID));
    setLoading(false);
    setOpenConfirm(false);    
  }
  
  const handleEdit = (e, ticketID, formData) => {
    e.preventDefault();
    dispatch(updateTicket(ticketID, formData));
    setShowEdit(false);
  }
    
  console.log('clicked ticket', clickedTicket)
  console.log('showEdit', showEdit);
  console.log('openConfirm', openConfirm);

  return props.tickets.map((t) => (
    <Table.Row error={!t.isresolved} textAlign="center" key={t.id}>
      <Table.Cell>
        <Link to={`tickets/${t.id}`} style={{ textDecoration: "none" }}>
          {t.id}
        </Link>
      </Table.Cell>

      <Table.Cell>
        <Link to={`tickets/${t.id}`} style={{ textDecoration: "none" }}>
          {t.createdby}
        </Link>
      </Table.Cell>

      <Table.Cell>
        <Link to={`tickets/${t.id}`} style={{ textDecoration: "none" }}>
          {t.assignedto}
        </Link>
      </Table.Cell>

      <Table.Cell>
        <Link to={`tickets/${t.id}`} style={{ textDecoration: "none" }}>
          {t.createdat}
        </Link>
      </Table.Cell>

      <Table.Cell error={+t.importancelevel > 3}>
        <Link to={`tickets/${t.id}`} style={{ textDecoration: "none" }}>
          {+t.importancelevel}
          {+t.importancelevel > 3 && <Icon name="attention" />}
        </Link>
      </Table.Cell>

      <Table.Cell>
        <Link to={`tickets/${t.id}`} style={{ textDecoration: "none" }}>
          {t.isresolved ? "closed" : "open"}
        </Link>
      </Table.Cell>

      <Table.Cell>
        <Link to={`tickets/${t.id}`} style={{ textDecoration: "none" }}>
          {t.subject}
        </Link>
      </Table.Cell>
      <Table.Cell>
        <TicketModals 
          ticketID={t.id}
          typeOfConfirm="edit"
          ticket={t}
        />
        <TicketModals 
          ticketID={t.id}
          typeOfConfirm="remove"
          ticket={t}
        />
      </Table.Cell>
    </Table.Row>
  ));
};

export default TicketData;
