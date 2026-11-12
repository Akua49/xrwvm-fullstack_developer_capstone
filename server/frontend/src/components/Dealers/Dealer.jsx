import React,{useEffect,useState} from 'react';
import {useParams} from 'react-router-dom';
import Header from '../Header/Header';
import {api} from '../../api';
import positive from '../assets/positive.png';
import neutral from '../assets/neutral.png';
import negative from '../assets/negative.png';
export default function Dealer(){
 const {id}=useParams();const [dealer,setDealer]=useState(null),[reviews,setReviews]=useState([]),[user,setUser]=useState(null),[error,setError]=useState('');
 useEffect(()=>{Promise.all([api('/djangoapp/dealer/'+id),api('/djangoapp/reviews/dealer/'+id),api('/djangoapp/session')]).then(([d,r,s])=>{setDealer(d.dealer[0]);setReviews(r.reviews);setUser(s.userName);}).catch(e=>setError(e.message));},[id]);
 return <><Header/><main className="container py-4">{error&&<p role="alert">{error}</p>}{dealer?<><h1>{dealer.full_name}</h1><p>{dealer.address}, {dealer.city}, {dealer.state}, {dealer.zip}</p>{user&&<a className="btn btn-primary" href={'/postreview/'+id}>Post Review</a>}<h2 className="mt-4">Customer Reviews</h2>{reviews.length?reviews.map(r=><article key={r.id} className="card p-3 my-3"><img src={{positive,neutral,negative}[r.sentiment]||neutral} width="42" alt={r.sentiment+' sentiment'}/><p>{r.review}</p><strong>{r.name}</strong><p>{r.car_make} {r.car_model} · {r.car_year} · {r.purchase_date}</p></article>):<p>No reviews yet.</p>}</>:!error&&<p>Loading dealer…</p>}</main></>;
}
