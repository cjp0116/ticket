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
    

    default: {
      return state;
    };
  };
};

export default ticketReducer;
