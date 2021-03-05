const initialState = [];

function editDate(date) {
  date = String(date);
  return new Date(date.substr(0, 10)).toLocaleString();
}

function ticketReducer(state = initialState, action) {
  switch(action.type) {
    case 'LOAD_TICKETS': {
      const withEdit = action.tickets.map(ticket => {
        const dateToString = editDate(ticket.createdat);
        ticket.createdat = dateToString;
        return ticket;
      });
      return [...withEdit]
    };

    case 'POST_TICKET': {
      return [...state, action.ticket]
    };
    
    case 'UPDATE_TICKET': {
      let foundTicket = state.find(ele => ele.id === action.ticketID);
      foundTicket = action.ticket;
      return state;
    };
    
    case 'REMOVE_TICKET': {
      return state.filter(ele => ele.id !== action.ticketID);
    };
    
    case 'CREATE_NOTE': {
      let foundTicket = state.find(ele => ele.id === action.ticketID);
      foundTicket.notes = [...foundTicket.notes, ...action.ticket.notes];
      return state;
    };

    case 'UPDATE_NOTE': {
      let foundTicket = state.find(ele => ele.id === action.ticketID);
      let foundNote = foundTicket.notes.find(ele => ele.id === action.noteID);
      foundNote = action.ticket.notes[0];
      return state;
    };

    case 'DELETE_NOTE': {
      return state;
    };

    default: {
      return state;
    };
  };
};

export default ticketReducer;
