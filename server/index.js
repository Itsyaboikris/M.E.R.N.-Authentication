import express from "express";
import dotenv from "dotenv";
import authRoutes from './routes/auth.js';
import privateRoutes from './routes/private.js';
import connectDatabase from "./config/db.js";
import errorHandler from "./middleware/err.js";

dotenv.config();
connectDatabase().then(() => console.log("Connected to database successfully."));

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/private', privateRoutes);

//Error handler always last
app.use(errorHandler);

const PORT = process.env.PORT || 6000;

const server = app.listen(PORT, ()=> console.log(`Server running on port ${PORT}.`));

process.on("unhandledRejection", (err, promise) => {
    console.log(`Unhandled Rejection: ${err}`);
    server.close(() => process.exit(1));
});
