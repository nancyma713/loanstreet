import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
const app = express();

import db from './config/keys';
import bodyParser from 'body-parser';
import users from './routes/api/users';
import loans from './routes/api/loans';

app.get("/", (req, res) => res.send("Hello World!!!"));

mongoose
    .connect(db.mongoURI, { useNewUrlParser: true })
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch(err => console.log(err));

const port = process.env.PORT || 5000;

app.use(passport.initialize());
require('./config/passport')(passport);

app.listen(port, () => console.log(`Server is running on port ${port}`));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/users", users);
app.use("/api/loans", loans);