import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import errorHandler from "./middlewares/error.middleware.js";
import blogRoutes from "./routes/blog.routes.js";
import authRoutes from "./routes/auth.routes.js";


import cors from "cors";

dotenv.config();
connectDB();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes

app.use("/blog", blogRoutes);
app.use("/auth", authRoutes);



// global error handler
app.get("/",(req,res)=> {
    // console.log(req.country);
    // res.redirect(`/${req.country}`);
    res.send("server is running . welcome .");
});
 
app.use(errorHandler);

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Server running at http://192.168.0.2:${PORT}`);
});
