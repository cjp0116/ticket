import React, { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTickets } from "../../actions/ticketActions";
import { deleteTicket } from "../../actions/ticketActions";
import { Table, Container, Dimmer, Loader } from 'semantic-ui-react';
import AuthContext from "../../context/AuthContext";
import TicketData from "./TicketData";

const TicketList = props => {
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const dispatch = useDispatch();
  
  const tickets = useSelector(store => store.tickets);
  const myOpenTickets = tickets.filter(t => t.assignedto === currentUser.username && !t.isresolved) || [];
  const myGroupTickets = tickets.filter(t => t.assignedgroup === currentUser.deptcode && !t.isresolved) || [];
  const myRecentTickets = tickets.filter(t => t.assignedto === currentUser.username).sort((a,b) => b.createdat - a.createdat) || [];

  useEffect(() => {
    setLoading(true)
    if (!tickets.length) {
      setLoading(true);
      dispatch(getAllTickets())
    }
    setLoading(false)
  }, [dispatch, tickets, loading]);

  const handleDeleteConfirm = (ticketID) => {
    setLoading(true);
    dispatch(deleteTicket(ticketID));
    setLoading(false);
    setOpenConfirm(false);
  };

  return (
    <Container fluid>
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
        {loading && <Dimmer active inverted><Loader inverted>Loading</Loader></Dimmer>}
        <Table.Body>
          {
            props.mine ? <TicketData tickets={myOpenTickets} openConfirm={openConfirm} setOpenConfirm={setOpenConfirm} handleDeleteConfirm={handleDeleteConfirm} />:
            props.group ? <TicketData tickets={myGroupTickets} openConfirm={openConfirm} setOpenConfirm={setOpenConfirm} handleDeleteConfirm={handleDeleteConfirm} /> :
            props.recent && <TicketData tickets={myRecentTickets} openConfirm={openConfirm} setOpenConfirm={setOpenConfirm} handleDeleteConfirm={handleDeleteConfirm} />
          }
        </Table.Body>
      </Table>
    </Container>
  )
};

export default TicketList;