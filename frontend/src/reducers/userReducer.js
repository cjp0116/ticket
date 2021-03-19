const initialState = [];

function users(state = initialState, action) {
  switch(action.type) {

    case 'RESET_ALL': {
      return [...initialState];
    };
    
    case 'LOAD_USERS': {
      return [...action.users ]
    };
    
    case 'GET_USER': {
      return state.find(ele => ele === action.payload);
    };
    
    case 'DELETE_USER': {
      return state.filter(u => u.username !== action.payload);
    };

    case 'UPDATE_USER': {
      return state.map(user => {
        if(user.username === action.username) {
          return action.user
        } else {
          return user;
        }
      })
    };
    
    default: 
      return state
  }
};

export default users;