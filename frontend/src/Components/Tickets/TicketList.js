import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTickets } from "../../actions/ticket";
import { Link } from 'react-router-dom';
import { deleteTicket } from "../../actions/ticket";
import { Table, Icon, Popup, Button, Confirm } from 'semantic-ui-react';
import Spinner from "../../UI/Spinner";

const TicketList = props => {
  const [loading, setLoading] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const dispatch = useDispatch();
  const tickets = useSelector(store => store.tickets);

  useEffect(() => {
    if (!tickets.length) {
      setLoading(true);
      dispatch(getAllTickets())
    }
    setLoading(false);
  }, [dispatch, tickets]);

  console.log(tickets)

  if (loading) return <Spinner />;

  const handleDeleteConfirm = (ticketID) => {
    setLoading(true);
    dispatch(deleteTicket(ticketID));
    setLoading(false);
    setOpenConfirm(false);
  };

  return (
    <>
      <Table celled selectable>
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell>Ticket #</Table.HeaderCell>
            <Table.HeaderCell>Created By</Table.HeaderCell>
            <Table.HeaderCell>Assigned To</Table.HeaderCell>
            <Table.HeaderCell>Created At</Table.HeaderCell>
            <Table.HeaderCell>Importance Level</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Subject</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {tickets.map(t => (
            <Table.Row error={!t.isresolved} textAlign="center" key={t.id}>
              <Table.Cell>
                <Link to={`tickets/${t.id}`} style={{ textDecoration: 'none' }} >
                  {t.id}
                </Link>
              </Table.Cell>

              <Table.Cell>
                <Link to={`tickets/${t.id}`} style={{ textDecoration: 'none' }} >
                  {t.createdby}
                </Link>
              </Table.Cell>

              <Table.Cell>
                <Link to={`tickets/${t.id}`} style={{ textDecoration: 'none' }} >
                  {t.assignedto}
                </Link>
              </Table.Cell>

              <Table.Cell>
                <Link to={`tickets/${t.id}`} style={{ textDecoration: 'none' }} >
                  {t.createdat}
                </Link>
              </Table.Cell>

              <Table.Cell error={+t.importancelevel > 3}>
                <Link to={`tickets/${t.id}`} style={{ textDecoration: 'none' }} >
                  {+t.importancelevel}
                  {+t.importancelevel > 3 && <Icon name='attention' />}
                </Link>
              </Table.Cell>

              <Table.Cell>
                <Link to={`tickets/${t.id}`} style={{ textDecoration: 'none' }} >
                  {t.isresolved ? 'closed' : 'open'}
                </Link>
              </Table.Cell>

              <Table.Cell>
                <Link to={`tickets/${t.id}`} style={{ textDecoration: 'none' }} >
                  {t.subject}
                </Link>
              </Table.Cell>
              <Table.Cell>
                <Link to={`tickets/${t.id}`} style={{ textDecoration: 'none' }} >
                  <Popup 
                    content={`Edit ticket ${t.id}`} 
                    trigger={<Button icon="edit" size="small" color="green" circular />}
                  />
                </Link>
                  <Popup 
                    content={`Delete ticket ${t.id}`} 
                    trigger={<Button icon="remove" size="small" color="red" circular onClick={() => setOpenConfirm(true)} />}
                  />
                  <Confirm 
                    open={openConfirm}
                    header="Delete Ticket"
                    content="The operation is irreversable, are you sure?"
                    cancelButton="Nevermind"
                    confirmButton="Delete" 
                    onCancel={() => setOpenConfirm(false)} 
                    onConfirm={() => handleDeleteConfirm(t.id)}
                  />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>

  )
};

export default TicketList;