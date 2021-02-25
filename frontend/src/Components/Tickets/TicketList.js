import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTickets } from "../../actions/ticket";

import Spinner from "../../UI/Spinner";

const TicketList = props => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const tickets = useSelector(store => store.tickets) || [];

  useEffect(() => {
    if(!tickets) {
      setLoading(true);
      dispatch(getAllTickets())
    }
    setLoading(false);
  }, [dispatch, tickets])

  if(loading) return Spinner;
  return (
    <>
      
    </>
  )
};

export default TicketList;