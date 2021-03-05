import Api from "../backendAPI";

const BASEURL = `http://localhost:5000/tickets`

function setError(error) {
  return { type: 'ERROR', error }
}

function getAllTickets() {
  return async function (dispatch) {
    try {
      let ticketsResults = await Api.request(BASEURL);
      const tickets = ticketsResults.data.tickets;
      dispatch(loadTickets(tickets))
    } catch (e) {
      console.log(e)
    }
  };
};
function loadTickets(tickets) {
  return { type: 'LOAD_TICKETS', tickets };
};



function postTicket(formData) {
  return async function (dispatch) {
    try {
      const ticket = await Api.request(`${BASEURL}`, { ...formData }, 'POST');
      dispatch(addTicket(ticket))
    } catch (e) {
      dispatch(setError(e))
    }
  };
};
function addTicket(ticket) {
  return { type: 'POST_TICKET', ticket: ticket.ticket }
};


function updateTicket(ticketID) {
  return async function (dispatch) {
    try {
      const ticket = await Api.request(`${BASEURL}/${ticketID}`);
      dispatch(updateState(ticket, ticketID));
    } catch (e) {
      dispatch(setError(e))
    }
  };
};
function updateState(ticket, ticketID) {
  return { type: 'UPDATE_TICKET', ticket, ticketID };
};


function deleteTicket(ticketID) {
  return async function (dispatch) {
    try {
      const message = await Api.request(`${BASEURL}/${ticketID}`, {}, "DELETE");
      console.log(message);
      dispatch(removeFromState(ticketID));
    } catch (e) {
      console.error(e)
      dispatch(setError(e))
    }
  };
};
function removeFromState(ticketID) {
  return { type: 'REMOVE_TICKET', ticketID };
};


function createNote(ticketID, data) {
  return async function (dispatch) {
    try {
      const ticket = await Api.request(`${BASEURL}/${ticketID}/notes`, { ...data }, 'POST');
      dispatch(addNote(ticket, ticketID));
    } catch (e) {
      console.error(e);
      dispatch(setError(e))
    }
  };
};
function addNote(ticket, ticketID) {
  return { type: 'CREATE_NOTE', ticket, ticketID };
};


function updateNote(ticketID, noteID, data) {
  return async function (dispatch) {
    try {
      const ticket = await Api.request(`${BASEURL}/${ticketID}/notes/${noteID}`, { ...data }, 'PUT');
      dispatch(updateNoteState(noteID, ticketID, ticket));
    } catch (e) {
      console.error(e);
      dispatch(setError(e))
    }
  }
};
function updateNoteState(noteID, ticketID, ticket) {
  return { type: 'UPDATE_NOTE', noteID, ticketID, ticket };
}


function deleteNote(noteID, ticketID) {
  return async function (dispatch) {
    const updatedTicketNotes = await Api.request(`${BASEURL}/${ticketID}/notes/${noteID}`);
    dispatch({
      type: 'DELETE_NOTE',
      payload: updatedTicketNotes,
      ticketID
    });
  };
};

export {
  deleteNote,
  updateNote,
  getAllTickets,
  postTicket,
  updateTicket,
  deleteTicket,
  createNote
};