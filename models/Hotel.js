import mongoose from "mongoose";
const HotelSchema = new mongoose.Schema({
  
 name: {
    type: String,
    
  },
  type: {
    type: String,
    
  },
  city: {
    type: String,
    
  },
  address: {
    type: String,
    
  },
  distance: {
    type: String,
    
  },
  image: {
    type: [String],
  },
  title: {
    type: String,
    
  },
  desc: {
    type: String,
    
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  rooms: {
    type: [String],
  },
  cheapestPrice: {
    type: Number,
    
  },
  featured: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Hotel", HotelSchema)