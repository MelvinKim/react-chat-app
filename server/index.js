const express = require('express');
const cors = require('cors');

//routes
const authRoutes = require("./routes/auth.js");

//create an instance of the express application
const app = express();
const PORT = process.env.PORT || 5000;

//enables us to call the environment variables inside our node application
require('dotenv').config();

app.use(cors());
app.use(express.json());  //allows passing of json payloads from the frontend to the backend
app.use(express.urlencoded({ extended: true}));

app.get("/", (req, res) => {
    res.send("Hello, world!"); 
});

//use the routes
app.use("/auth", authRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





