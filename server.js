require("dotenv").config();
const express = require('express');
const port = process.env.PORT || 8000;
const app = express();
const Router = require('./web/routes');
const mongoose = require('mongoose');
// const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// global.rootDirectory = path.resolve(__dirname);

// const corsOption = {
//     origin: 'http://localhost:3000',
//     credentials: true
// }

app.use(cors());


app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})


app.use(cookieParser());

app.use(express.json());
app.use('/api', Router);

mongoose.connect(process.env.DB_URL, {
    useUnifiedTopology: true
}).then(() => {
    console.log("database connected");
}).catch((err) => {
    console.log(err);
})


