const express = require('express');
require('dotenv').config();
const Transaction = require('./models/Transaction.js');
const cors = require('cors');
//const mongoose = require('mongoose')
const { default: mongoose, mongo } = require('mongoose');
const app = express();

app.use(cors()); // Allow frontend requests
app.use(express.json()); // Middleware to parse JSON body

app.get('/api/test', (req, res) => {
    res.json('test ok');
});

app.post('/api/transaction', async (req, res) => {
    //res.json('test ok');
    await mongoose.connect(process.env.MONGO_URL)
    const{price,name,description, datetime }=req.body;

    if (!price || !name || !description || !datetime) {
        return res.status(400).json({ error: "All fields are required." });
    }
    const transaction = await Transaction.create({price, name, description, datetime})

    res.json(transaction);
});

app.get('/api/transaction', async (req,res)=>{
    await mongoose.connect(process.env.MONGO_URL)
    const transactions = await Transaction.find()
    res.json(transactions)
})

app.listen(4000, () => {
    console.log("🚀 Server running on port 4000");
});
