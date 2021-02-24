const initialState = [];

function ticketReducer(state = initialState, action) {
  switch(action.type) {
    case 'LOAD_TICKETS': {
      return [...action.payload.tickets];
    }
    case 'GET_TICKET': {
      return state.find(ele => ele.id === action.payload);
    }
    case 'POST_TICKET': {
      return [...state, action.payload.ticket]
    }
    case 'UPDATE_TICKET': {
      let foundTicket = state.find(ele => ele.id === action.ticketID);
      foundTicket = action.payload.ticket;
      return state;
    };
    case 'REMOVE_TICKET': {
      return state.filter(ele => ele.id !== action.payload);
    };
    case 'CREATE_NOTE': {
      let foundTicket = state.find(ele => ele.id === action.ticketID);
      foundTicket.notes = [...foundTicket.notes, ...action.payload.ticket.notes];
      return state;
    };
    case 'UPDATE_NOTE': {
      let foundTicket = state.find(ele => ele.id === action.ticketID);
      foundTicket = action.payload.ticket;
      return state;
    };
    case 'DELETE_NOTE': {
      let foundTicket = state.find(ele => ele.id === action.ticketID);
      foundTicket = action.payload.ticket;
      return state;
    }
    default: {
      return state;
    }
  }
}

export default ticketReducer;