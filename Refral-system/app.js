const express = require ("express");
const connectDB = require ("./db/connection.js");
const userRoute = require ("./routes/userRoute.js");

const app = express();

//Db connection
require('dotenv').config();
connectDB();
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Sever running on http://localhost:${PORT}`));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use("/user", userRoute);




