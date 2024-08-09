import multer from 'multer'
import ListRequest from "../models/ListingRequests.js";


export const storage = multer.diskStorage({
    destination: 'Uploads/',
  
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // create a unique filename
    },
  });
  const upload = multer({ storage: storage });

export const createListreqest = async (req, res, next) => {
      
        const { name } = req.body;
        const { email } = req.body;
        const { contact } = req.body;
        const { rooms } = req.body;
        const { price } = req.body;
        const { address } = req.body;
        const { checkboxValue } = req.body;
        const imagePaths = req.files.map(file => file.path);
        try {
          const newListRequest = new ListRequest({ name, email, contact, rooms, price, address, checkboxValue, imagePaths });
          await newListRequest.save();
          res.status(200).json({ message: 'Hotel Listing Request Send Successfully' });
        } catch (error) {
          res.status(500).json({ message: 'Internal server error' });
        }
      };
      



export const getAllReqest = async (req, res, next) => {
  try {
    const rooms = await ListRequest.find();
    res.status(200).json(rooms);
  } catch (err) {
    next(err);
  }
};
