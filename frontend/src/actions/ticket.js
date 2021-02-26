import Api from "../backendAPI";

const BASEURL = `http://localhost:5000/tickets`

function getAllTickets() {
  return async function(dispatch) {
    try {
      const tickets = await Api.request(BASEURL);
      dispatch(loadTickets(tickets))
    } catch(e) {
      console.log(e)
    }
  };
};
function loadTickets(tickets) {
  return { type : 'LOAD_TICKETS', tickets };
};


function getTicketByID(ticketID) {
  return async function(dispatch) {
    const ticket = await Api.request(`${BASEURL}/${ticketID}`);
    dispatch(getTicket(ticket))
  };
};
function getTicket(ticket) {
  return { type : 'GET_TICKET', ticket }
};


function postTicket() {
  return async function(dispatch) {
    const ticket = await Api.request(`${BASEURL}`);
    dispatch(addTicket(ticket))
  };  
};
function addTicket(ticket) {
  return { type : 'POST_TICKET', ticket }
};


function updateTicket(ticketID) {
  return async function (dispatch) {
    const ticket = await Api.request(`${BASEURL}/${ticketID}`);
    dispatch(updateState(ticket, ticketID));
  };
};
function updateState(ticket, ticketID) {
  return { type : 'UPDATE_TICKET', ticket, ticketID };
};


function deleteTicket(ticketID) {
  return async function (dispatch) {
    await Api.request(`${BASEURL}/${ticketID}`);
    dispatch(removeFromState(ticketID));
  };
};
function removeFromState(ticketID) {
  return { type : 'REMOVE_TICKET', ticketID };
};


function createNote(ticketID) {
  return async function (dispatch) {
    const ticket = await Api.request(`${BASEURL}/${ticketID}/notes`);
    dispatch(addNote(ticket, ticketID));
  };
};
function addNote(ticket, ticketID) {
  return { type : 'CREATE_NOTE', ticket, ticketID };
};


function updateNote(ticketID, noteID) {
  return async function (dispatch) {
    const ticket = await Api.request(`${BASEURL}/${ticketID}/notes/${noteID}`);
    dispatch(updateNoteState(noteID, ticketID, ticket));
  }
};
function updateNoteState(noteID, ticketID, ticket) {
  return { type : 'UPDATE_NOTE', noteID, ticketID, ticket };
}


function deleteNote(noteID, ticketID) {
  return async function(dispatch) {
    const updatedTicketNotes = await Api.request(`${BASEURL}/${ticketID}/notes/${noteID}`);
    dispatch({
      type : 'DELETE_NOTE',
      payload : updatedTicketNotes,
      ticketID
    });
  };
};

export { deleteNote, updateNote, getAllTickets, getTicketByID, postTicket, updateTicket, deleteTicket, createNote };