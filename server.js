const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const config = require('./db/mongo');
const helmet = require('helmet');
const morgan = require("morgan");
const port = 4000;

// for deployment

const dotenv = require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors({
  origin: 'https://helpful-dodol-3e6fb2.netlify.app',
  credentials: true
}));

app.use(cookieParser());

app.use(helmet());
app.use(morgan("common"));

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true}, (err) => {
  if(err) throw err;
  console.log("MongoDB connected")
})

app.use(`/api`, require('./routes/userRoutes'))
app.use(`/api`, require('./routes/coinRoutes'))

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is up and running at htth:localhost:${process.env.PORT}`)
});

