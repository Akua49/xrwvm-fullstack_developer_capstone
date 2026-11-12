import React, {useEffect, useState} from 'react';
import {api} from '../../api';
import '../assets/bootstrap.min.css';
export default function Header() {
  const [user,setUser] = useState(null);
  const [error,setError] = useState('');
  const [notice] = useState(()=>sessionStorage.getItem('logoutNotice') || '');
  useEffect(()=>{api('/djangoapp/session').then(d=>{setUser(d.userName); if(d.userName)sessionStorage.setItem('username',d.userName); else sessionStorage.removeItem('username');}).catch(e=>setError(e.message));},[]);
  async function logout(e) {
    e.preventDefault();
    try {await api('/djangoapp/logout',{method:'POST'});sessionStorage.clear();sessionStorage.setItem('logoutNotice','Logged out successfully');alert('Logged out successfully');window.location.href='/';}
    catch(e){setError(e.message);}
  }
  return <><nav className="navbar navbar-expand navbar-light" style={{background:'#12c9ce',padding:'24px',gap:'24px',flexWrap:'wrap'}}>
    <a className="navbar-brand" href="/">Best Cars Dealerships</a>
    <a href="/dealers">Dealerships</a><a href="/about">About Us</a><a href="/contact">Contact Us</a>
    {user ? <><strong>{user}</strong><a href="/" onClick={logout}>Logout</a></> : <><a href="/login">Login</a><a href="/register">Register</a></>}
  </nav>{notice && !user && <p role="alert" className="alert alert-success" style={{margin:'16px 24px'}}>{notice}</p>}{error && <p role="alert">{error}</p>}</>;
}
