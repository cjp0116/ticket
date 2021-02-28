import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTickets } from "../../actions/ticket";
import { Link, useHistory } from 'react-router-dom';

import { Table, Icon } from 'semantic-ui-react';
import Spinner from "../../UI/Spinner";

const TicketList = props => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const tickets = useSelector(store => store.tickets);
  const history = useHistory()
  useEffect(() => {
    if (!tickets.length) {
      setLoading(true);
      dispatch(getAllTickets())
    }
    setLoading(false);
  }, [dispatch, tickets]);

  const handleClick = (ticketID) => {
    const currentURL = window.location.href
    history.push(`${currentURL}/${ticketID}`)
    console.log(currentURL)
  }
  
  console.log(tickets)
  
  if (loading) return Spinner;
  
  return (
    <Table celled selectable sortable>
      <Table.Header>
        <Table.Row textAlign="center">
          <Table.HeaderCell>Ticket #</Table.HeaderCell>
          <Table.HeaderCell>Created By</Table.HeaderCell>
          <Table.HeaderCell>Assigned To</Table.HeaderCell>
          <Table.HeaderCell>Created At</Table.HeaderCell>
          <Table.HeaderCell>Importance Level</Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
          <Table.HeaderCell>Subject</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {tickets.map(t => (
          <Table.Row error={!t.isresolved} textAlign="center" onClick={() => handleClick(t.id)}>
            <Table.Cell>{t.id}</Table.Cell>
            <Table.Cell>{t.createdby}</Table.Cell>
            <Table.Cell>{t.assignedto}</Table.Cell>
            <Table.Cell>{t.createdat}</Table.Cell>
            <Table.Cell>
              {t.importancelevel}
               {t.importancelevel > 3 && <Icon name='attention'/>}
            </Table.Cell>
            <Table.Cell>{t.isresolved ? 'closed' : 'open'}</Table.Cell>
            <Table.Cell>{t.subject}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
};

export default TicketList;