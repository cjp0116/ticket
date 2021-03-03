import React, { useState } from 'react';
import { useHistory }  from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

const NewTicketForm = props => {
  const [form, setForm] = useState({
    createdBy : "",
    assignTo : "",
    createdAt : "",
    importanceLevel : "",
    closedAt : "",
    status : "",
    subject : "",
    requestDetail : ""
  });
  return (
    <div>
      <h1>New Ticket Form</h1>
    </div>
  )
};

export default NewTicketForm;