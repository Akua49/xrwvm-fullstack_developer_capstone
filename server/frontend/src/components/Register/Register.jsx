import React,{useState} from 'react';
import Header from '../Header/Header';
import {api} from '../../api';
export default function Register(){
 const [error,setError]=useState('');
 async function submit(e){e.preventDefault();const data=Object.fromEntries(new FormData(e.target));if(data.password!==data.confirmPassword){setError('Passwords must match');return;}try{const d=await api('/djangoapp/register',{method:'POST',body:JSON.stringify(data)});sessionStorage.setItem('username',d.userName);window.location.href='/dealers';}catch(e){setError(e.message);}}
 return <><Header/><main className="container py-4"><h1>Sign Up</h1><form onSubmit={submit}>{[['firstName','First name','text'],['lastName','Last name','text'],['userName','Username','text'],['email','Email','email'],['password','Password','password'],['confirmPassword','Confirm password','password']].map(([name,label,type])=><div key={name}><label>{label}<input className="form-control" name={name} type={type} required minLength={type==='password'?8:1}/></label></div>)}<button className="btn btn-primary mt-3">Register</button></form><p role="alert">{error}</p></main></>;
}
