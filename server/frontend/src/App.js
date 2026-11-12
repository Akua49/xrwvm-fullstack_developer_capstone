import React from 'react';
import {Routes,Route} from 'react-router-dom';
import Header from './components/Header/Header';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Dealers from './components/Dealers/Dealers';
import Dealer from './components/Dealers/Dealer';
import PostReview from './components/Dealers/PostReview';
function Info({contact=false}){return <><Header/><main className="container py-5"><h1>{contact?'Contact Us':'About Us'}</h1>{contact?<><p>Best Cars customer support</p><p>Email: support@example.com</p><p>Phone: +1 555 010 0200</p><p>For questions about a purchase or dealership review, contact our customer care team.</p></>:<><h2>Welcome to Best Cars Dealerships</h2><p>Explore our nationwide car dealerships, compare customer experiences and share a review of your purchase.</p><h3>Our team</h3><p>Sales consultants help you compare vehicles. Our customer care team supports you after your purchase, and our technicians keep your vehicle running.</p></>}</main></>;}
export default function App(){return <Routes><Route path="/" element={<Dealers/>}/><Route path="/dealers" element={<Dealers/>}/><Route path="/about" element={<Info/>}/><Route path="/contact" element={<Info contact/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="/dealer/:id" element={<Dealer/>}/><Route path="/postreview/:id" element={<PostReview/>}/><Route path="*" element={<p>Page not found</p>}/></Routes>;}
