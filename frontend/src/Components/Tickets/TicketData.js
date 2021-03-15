import React, { useState } from "react";
import { Table, Confirm, Popup, Button, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import EditTicketForm from "./NewTicketForm";


const TicketDetails = (props) => {
  const [showEdit, setShowEdit] = useState(false);
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
        <Link to={`tickets/${t.id}/edit`} style={{ textDecoration: "none" }}>
          <Popup
            content={`Edit ticket ${t.id}`}
            trigger={<Button icon="edit" size="small" color="green" circular />}
          />
        </Link>
        <Popup
          content={`Edit ticket ${t.id}`}
          trigger={
            <Button 
              icon="edit" 
              size="small" 
              color="green" 
              circular 
              onClick={() => setShowEdit(true)}
            />
          }
        />
        <Confirm 
          open={showEdit}
          header={`Edit ticket ${t.id}`}
          content={
            <EditTicketForm ticketID={t.id} edit t />
          }
          cancelButton="Go back"
          confirmButton="Edit"
          onCancel={() => setShowEdit(false)}
          onConfirm={() => setShowEdit(false)}
        />
        <Popup
          content={`Delete ticket ${t.id}`}
          trigger={
            <Button
              icon="remove"
              size="small"
              color="red"
              circular
              onClick={() => props.setOpenConfirm(true)}
            />
          }
        />
        <Confirm
          open={props.openConfirm}
          header="Delete Ticket"
          content="The operation is irreversable, are you sure?"
          cancelButton="Nevermind"
          confirmButton="Delete"
          onCancel={() => props.setOpenConfirm(false)}
          onConfirm={() => props.handleDeleteConfirm(t.id)}
        />
      </Table.Cell>
    </Table.Row>
  ));
};

export default TicketDetails;
