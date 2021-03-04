import React, { useEffect, useState } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { decode } from 'jsonwebtoken';
import Api from "./backendAPI";
import Spinner from "./UI/Spinner";
import './App.css';
import Routes from "./Routes/Routes";
import Navbar from "./Components/Navbar";
import AuthContext from "./context/AuthContext";
import { useHistory } from 'react-router-dom';

function App() {
  const [token, setToken] = useLocalStorage('token');
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const history = useHistory();
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        setLoading(true);
        let { username } = decode(token);
        let currentUser = await Api.request(`http://localhost:5000/users/${username}`);
        setCurrentUser(currentUser.data.user);
      } catch (e) {
        setCurrentUser(null);
      }
      setLoading(false);
    }
    getCurrentUser();
  }, [token]);

  const handleLogout = () => {
    setCurrentUser(null);
    setToken(null);
    history.push("/")
  }

  if (loading) return <Spinner />;
  return (
    <AuthContext.Provider value={{ setToken, currentUser, setCurrentUser, handleLogout }}>
        <div className="App">
          <Navbar />
          <Routes />
        </div>
    </AuthContext.Provider>
  );
}

export default App;
