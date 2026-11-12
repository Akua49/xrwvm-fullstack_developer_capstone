const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Reviews = require('./review');
const Dealerships = require('./dealership');
const app = express();
app.use(express.json({limit: '100kb'}));
const asyncRoute = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
app.get('/', (req, res) => res.json({service: 'Dealership Express-Mongo API'}));
app.get('/fetchReviews', asyncRoute(async (req,res) => res.json(await Reviews.find().lean())));
app.get('/fetchReviews/dealer/:id', asyncRoute(async (req,res) => res.json(await Reviews.find({dealership: Number(req.params.id)}).lean())));
app.get('/fetchDealers', asyncRoute(async (req,res) => res.json(await Dealerships.find().lean())));
app.get('/fetchDealers/:state', asyncRoute(async (req,res) => res.json(await Dealerships.find(req.params.state === 'All' ? {} : {state: req.params.state}).lean())));
app.get('/fetchDealer/:id', asyncRoute(async (req,res) => res.json(await Dealerships.find({id: Number(req.params.id)}).lean())));
const counterSchema = new mongoose.Schema({_id: String, value: Number});
const Counter = mongoose.model('Counter', counterSchema);
app.post('/insert_review', asyncRoute(async (req,res) => {
    if (!(await Dealerships.exists({id: Number(req.body.dealership)}))) return res.status(400).json({error: 'Unknown dealer'});
    const counter = await Counter.findOneAndUpdate({_id: 'review'}, {$inc: {value: 1}}, {new: true, upsert: true});
    const allowed = ['name','dealership','review','purchase','purchase_date','car_make','car_model','car_year'];
    const data = Object.fromEntries(allowed.map(k => [k, req.body[k]]));
    const review = await Reviews.create({...data, id: counter.value});
    res.status(201).json(review);
}));
app.use((err,req,res,next) => {
    console.error(err.message);
    res.status(err.name === 'ValidationError' || err instanceof SyntaxError ? 400 : 500).json({error: 'Unable to process request'});
});
async function start() {
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://mongo_db:27017/dealershipsDB');
    for (const [Model, filename, key] of [[Reviews,'reviews.json','reviews'], [Dealerships,'dealerships.json','dealerships']]) {
        if (await Model.countDocuments() === 0) {
            const data = JSON.parse(fs.readFileSync(path.join(__dirname,'data',filename),'utf8'));
            await Model.insertMany(data[key]);
        }
    }
    const last = await Reviews.findOne().sort({id:-1});
    await Counter.updateOne({_id:'review'}, {$max:{value:last ? last.id : 0}}, {upsert:true});
    return app.listen(process.env.PORT || 3030, '0.0.0.0', () => console.log('Dealership API ready on port ' + (process.env.PORT || 3030)));
}
if(require.main === module) start().catch(err => {console.error(err); process.exit(1);});
module.exports = {app,start};
