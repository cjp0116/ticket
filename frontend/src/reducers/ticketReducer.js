const initialState = [];

function ticketReducer(state = initialState, action) {
  switch(action.type) {
    
    case 'LOAD_TICKETS': {
      return [...action.tickets]
    };

    case 'POST_TICKET': {
      return [...state, { ...action.ticket }]
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
    

    case 'DELETE_NOTE': {
      return state;
    };

    default: {
      return state;
    };
  };
};

export default ticketReducer;
