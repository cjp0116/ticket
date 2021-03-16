import React from "react";
import { Table, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import TicketModals from "./TicketModals";

const TicketData = (props) => {
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
          {new Date(t.createdat.substr(0, 10)).toLocaleString()}
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
