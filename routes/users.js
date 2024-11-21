import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import {

  updateUser,
  deleteUser,
  getUser,
  getUsers,

} from "../controllers/user.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/checkauthentication", verifyToken, (req, res, next) => {
  res.send("hello user, you are logged in")
})

router.get("/checkuser/:id", verifyUser, (req, res, next) => {
  res.send("hello user, you are logged in and you can delete your account")
})

router.get("/checkadmin/:id", verifyAdmin, (req, res, next) => {
  res.send("hello admin, you are logged in and you can delete all accounts")
})

//UPDATE
router.put("/:id", updateUser);

//DELETE
router.delete("/:id", verifyUser, deleteUser);

//GET
router.get("/find/:id", getUser);

//GET ALL 
router.get("/", getUsers);

router.get('/check-phone/:phone', async (req, res) => {
  const phone = req.params.phone;
  try {
    const user = await User.findOne({ phone });
    if (user) {
      return res.status(200).json({ exists: true });
    }
    return res.status(200).json({ exists: false });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/find-by-phone/:phone', async (req, res) => {
  const { phone } = req.params;

  try {
    // Find the user by phone number
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found with that phone number.' });
    }
    res.json(user); // Return user data (but exclude sensitive info like password)
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving user data.' });
  }
});


router.put('/update-by-phone/:phone', async (req, res) => {
  const { phone } = req.params;
  const { password, ...updateData } = req.body;
    // Destructure password and other fields
  try {
    // Find the user by phone number
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found with that phone number.' });
    }

    // If password is provided, hash it before updating
    if (password) {
      const salt = bcrypt.genSaltSync(10);
      updateData.password = bcrypt.hashSync(password, salt);
    }

    // Update the user's data (excluding phone)
    await User.updateOne({ phone }, { $set: updateData });

    res.json({ message: 'User data updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating user data.' });
  }
});

router.get('/contacts',)
export default router;
