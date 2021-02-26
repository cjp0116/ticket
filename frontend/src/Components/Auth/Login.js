import React, { useState } from 'react';

const Login = props => {
  const [form, setForm] = useState({
    username : "",
    password : ""
  });
  return (
    <>
      <form onSubmit={e => e.preventDefault()}>
        
      </form>
    </>
  )
};

export default Login;