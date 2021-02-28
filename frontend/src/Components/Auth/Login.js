import React, { useState } from 'react';

const Login = props => {
  const [form, setForm] = useState({
    username : "",
    password : ""
  });
  const handleChange = e => {
    setForm(form => ({ ...form, [e.target.name] : e.target.value }))
  }
  return (
    <>
      <form onSubmit={e => e.preventDefault()}>
        
      </form>
    </>
  )
};

export default Login;