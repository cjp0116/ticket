import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from "../../UI/Spinner";

import Api from "../../backendAPI";


const Ticket = props => {
  const { ticketID } = useParams();
  const [ticket, setTicket] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchTicket = async () => { 
      try {
        setLoading(true);
        const ticketResults = await Api.request(`http://localhost:5000/tickets/${ticketID}`)
        const ticket = ticketResults.data.ticket;
        setTicket({ ...ticket})
      } catch(e) {
        setTicket(null);
      }
      setLoading(false);
    };
    fetchTicket()
  }, [ticketID]);

  console.log('ticket', ticket);

  if(loading) return <Spinner />

  return (
    <>
      <h1>Ticket #{ticket.id}</h1>
    </>
  )
};
export default Ticket;