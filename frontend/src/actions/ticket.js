import Api from "../backendAPI";

const BASEURL = `http://localhost:5000/tickets`

function getAllTickets() {
  return async function(dispatch) {
    try {
      const tickets = await Api.request(BASEURL);
      dispatch({ type : 'LOAD_TICKETS', payload : tickets })
    } catch(e) {
      console.log(e)
    }
  };
};

function getTicketByID(ticketID) {
  return async function(dispatch) {
    const ticket = await Api.request(`${BASEURL}/${ticketID}`);
    dispatch({ type : 'GET_TICKET', payload : ticketID })
  };
};

function postTicket() {
  return async function(dispatch) {
    const ticket = await Api.request(`${BASEURL}`);
    dispatch({ type : 'POST_TICKET', payload : ticket });
  };  
};

function updateTicket(ticketID) {
  return async function (dispatch) {
    const ticket = await Api.request(`${BASEURL}/${ticketID}`);
    dispatch({ type : 'UPDATE_TICKET', payload : ticket, ticketID });
  };
};

function deleteTicket(ticketID) {
  return async function (dispatch) {
    await Api.request(`${BASEURL}/${ticketID}`);
    dispatch({ type : 'REMOVE_TICKET', payload : ticketID });
  };
};

function createNote(ticketID) {
  return async function (dispatch) {
    const ticket = await Api.request(`${BASEURL}/${ticketID}/notes`);
    dispatch({ type : 'CREATE_NOTE', ticketID, payload : ticket });
  };
};

function updateNote(ticketID, noteID) {
  return async function (dispatch) {
    const ticket = await Api.request(`${BASEURL}/${ticketID}/notes/${noteID}`);
    dispatch({
      type : 'UPDATE_NOTE',
      payload : ticket,
      ticketID,
      noteID
    });
  }
};

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