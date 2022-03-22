require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const connectDatabase = require('./config/dbConnect');
const userRoute = require('./routes/userRoute');
const BlogPostRoute = require('./routes/blogPostRoute');

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json({extended: true}));

app.use('/api', userRoute);
app.use('/api', BlogPostRoute);

connectDatabase()

app.listen(process.env.PORT, ()=> {
    console.log("Server is running in",process.env.PORT);
})