import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTickets } from "../../actions/ticket";

import Spinner from "../../UI/Spinner";

const TicketList = props => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const tickets = useSelector(store => store.tickets);
  // const store = useSelector(s => s);
  // console.log(store);
  useEffect(() => {
    if(!tickets) {
      setLoading(true);
      dispatch(getAllTickets())
    }
    setLoading(false);
  }, [dispatch, tickets])

  console.log(tickets);

  if(loading) return Spinner;
  return (
    <>
      
    </>
  )
};

export default TicketList;