import _ from 'lodash';
import { Search, Grid, Label } from 'semantic-ui-react';
import React, { useReducer } from 'react';
import UserCard from "./UserCard";

const INITIAL_STATE = {
  loading : false,
  results : [],
  value : ""
};

function userSearchReduer(state, action) {
  switch(action.type) {
    case 'CLEAN_QUERY':
      return INITIAL_STATE
    case 'START_SEARCH':
      return {
        ...state,
        loading : true,
        value : action.query
      }
    case 'FINISH_SEARCH':
      return {
        ...state,
        loading : false,
        results : action.results
      }
    case 'UPDATE_SELECTION':
      return {
        ...state,
        value : action.selection
      }
    default:
      throw new Error();
  }
};

const resultRenderer = ({ username }) => <Label content={username} />;

const UserSearch = (props) => {
  const [state, dispatch] = useReducer(userSearchReduer, INITIAL_STATE);
  
  const { loading, results, value } = state;
  const { source } = props;
  const timeoutRef = React.useRef();

  const handleSearchChange = React.useCallback((e, data) => {
    clearTimeout(timeoutRef.current);
    dispatch({ type : "START_SEARCH", query : data.value });
    timeoutRef.current = setTimeout(() => {
      if(data.value.length === 0) {
        dispatch({ type : 'CLEAN_QUERY' });
        return
      }

      const re = new RegExp(_.escapeRegExp(data.value), 'i');
      const isMatch = (result) => re.test(result.username);
      dispatch({
        type : 'FINISH_SEARCH',
        results : _.filter(source, isMatch)
      });
    }, 300)
  }, []);
  
  React.useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <Grid>  
      <Grid.Column width={16}>
        <Search 
          loading={loading}
          onResultSelect={(e, data) => {
            dispatch({ type : 'UPDATE_SELECTION', selection : data.result.username })
          }}
          onSearchChange={handleSearchChange}
          resultRenderer={resultRenderer}
          results={results}
          value={value}
        />
      </Grid.Column>
      <Grid.Column width="4">
          {results.map(user => {
            return (
              <UserCard user={user} />
            )
          })}
      </Grid.Column>
    </Grid>
  )
};

export default UserSearch;