import React,{useEffect,useState} from 'react';
import {useParams} from 'react-router-dom';
import Header from '../Header/Header';
import {api} from '../../api';
export default function PostReview(){
 const {id}=useParams();const [dealer,setDealer]=useState(null),[cars,setCars]=useState([]),[error,setError]=useState(''),[ready,setReady]=useState(false);
 useEffect(()=>{Promise.all([api('/djangoapp/dealer/'+id),api('/djangoapp/get_cars'),api('/djangoapp/session')]).then(([d,c,s])=>{if(!s.userName){window.location.href='/login';return;}setDealer(d.dealer[0]);setCars(c.CarModels);setReady(true);}).catch(e=>setError(e.message));},[id]);
 async function submit(e){e.preventDefault();const data=Object.fromEntries(new FormData(e.target));const car=cars[Number(data.car)];if(!car){setError('Choose a car');return;}try{await api('/djangoapp/add_review',{method:'POST',body:JSON.stringify({...data,dealership:Number(id),purchase:true,car_make:car.CarMake,car_model:car.CarModel,car_year:Number(data.car_year)})});window.location.href='/dealer/'+id;}catch(e){setError(e.message);}}
 return <><Header/><main className="container py-4"><h1>Post Review {dealer&&'— '+dealer.full_name}</h1><p role="alert">{error}</p>{ready&&<form onSubmit={submit}><label>Review<textarea className="form-control" name="review" rows="5" required maxLength="5000"/></label><div><label>Purchase date<input type="date" name="purchase_date" required/></label></div><div><label>Car make and model<select name="car" defaultValue="" required><option value="" disabled>Choose a car</option>{cars.map((c,i)=><option key={i} value={i}>{c.CarMake} {c.CarModel}</option>)}</select></label></div><div><label>Car year<input type="number" name="car_year" min="2015" max="2023" required/></label></div><button className="btn btn-primary mt-3">Post Review</button></form>}</main></>;
}
