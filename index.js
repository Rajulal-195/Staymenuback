import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from 'path';
import multer from "multer";
import cookieParser from "cookie-parser";
import cors from "cors";
import Localuser from './models/Localuser.js';
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";
import Hotel from "./models/Hotel.js";
import Room from "./models/Room.js";
// import { validationResult } from 'express-validator'; // Make sure you have express-validator installed
import bcrypt from 'bcryptjs'; // Make sure you have bcryptjs installed

const app = express();
dotenv.config();
const port = process.env.PORT || 8800;
const url = 'mongodb://127.0.0.1:27017/StayMenu?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.1';

// Multer setup for handling file uploads
const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage: storage });

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use('/images', express.static('upload/images'));

// Connect to MongoDB
const Dbconnect = () => {
  mongoose.connect(url)
    .then(() => console.log("mongodb connected"))
    .catch((err) => console.log(err));
};
mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use('/api/Ragisteruser', usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);

app.post('/user', async (req, res) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ error: result.array() });
    }

    const { userName, email, password, contact } = req.body;
    const user = await Localuser.findOne({ email: req.body.email });

    if (user) {
      return res.status(400).send('User exists already');
    }

    const salt = bcrypt.genSaltSync(5);
    const hashPassword = bcrypt.hashSync(password, salt);
    req.body.password = hashPassword;

    const valid = await Localuser.create(req.body);
    const data = JSON.parse(JSON.stringify(valid));

    res.json({ message: data, success: true });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/upload', upload.single('product'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: 0, message: 'No file uploaded.' });
  }
  
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`
  });
});

app.post('/hotels', async (req, res) => {
  try {
    const product = new Hotel({
      name: req.body.name,
      type: req.body.type,
      city: req.body.city,
      address: req.body.address,
      distance: req.body.distance,
      image: req.body.image,
      title: req.body.title,
      rating: req.body.rating,
      rooms: req.body.rooms,
      cheapestPrice: req.body.cheapestPrice,
      featured: req.body.featured
    });

    await product.save();
    res.json({
      success: true,
      product: product
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.get("/", (req, res) => {
  res.send('Start the challenges');
});

app.listen(port, (err) => {
  if (err) {
    console.log('Error is', err);
  } else {
    console.log(`Listening by Server on port http://localhost:${port}`);
    Dbconnect();
  }
});
