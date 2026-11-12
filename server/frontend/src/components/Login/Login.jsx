import React, {useState} from 'react';
import Header from '../Header/Header';
import {api} from '../../api';
export default function Login(){
 const [error,setError]=useState('');
 async function submit(e){e.preventDefault();const f=new FormData(e.target);try{const d=await api('/djangoapp/login',{method:'POST',body:JSON.stringify(Object.fromEntries(f))});sessionStorage.setItem('username',d.userName);window.location.href='/dealers';}catch(e){setError(e.message);}}
 return <><Header/><main className="container py-4"><h1>Login</h1><form onSubmit={submit}><label>Username<input className="form-control" name="userName" required autoComplete="username"/></label><br/><label>Password<input className="form-control" name="password" type="password" required autoComplete="current-password"/></label><br/><button className="btn btn-primary">Login</button></form><p role="alert">{error}</p><a href="/register">Register Now</a></main></>;
}
