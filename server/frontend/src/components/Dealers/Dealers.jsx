import React,{useEffect,useState} from 'react';
import Header from '../Header/Header';
import {api} from '../../api';
export default function Dealers(){
 const [dealers,setDealers]=useState([]),[state,setState]=useState('All'),[error,setError]=useState(''),[user,setUser]=useState(null);
 useEffect(()=>{api('/djangoapp/get_dealers').then(d=>setDealers(d.dealers)).catch(e=>setError(e.message));api('/djangoapp/session').then(d=>setUser(d.userName)).catch(e=>setError(e.message));},[]);
 const states=Array.from(new Set(dealers.map(d=>d.state))).sort();
 const filtered=state==='All'?dealers:dealers.filter(d=>d.state===state);
 return <><Header/><main className="container py-4"><h1>Car Dealerships</h1><label>Filter by state <select aria-label="State" value={state} onChange={e=>setState(e.target.value)}><option value="All">All States</option>{states.map(s=><option key={s}>{s}</option>)}</select></label>{error&&<p role="alert">{error}</p>}<table className="table"><thead><tr><th>ID</th><th>Dealer Name</th><th>City</th><th>Address</th><th>Zip</th><th>State</th>{user&&<th>Review Dealer</th>}</tr></thead><tbody>{filtered.map(d=><tr key={d.id}><td>{d.id}</td><td><a href={'/dealer/'+d.id}>{d.full_name}</a></td><td>{d.city}</td><td>{d.address}</td><td>{d.zip}</td><td>{d.state}</td>{user&&<td><a href={'/postreview/'+d.id}>Post Review</a></td>}</tr>)}</tbody></table>{!dealers.length&&!error&&<p>Loading dealerships…</p>}</main></>;
}
