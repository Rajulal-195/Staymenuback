import express from "express";
import { AddLocalUser } from "../controllers/Localusers";
import { verifyUser } from "../utils/verifyToken";

const router = express.Router();

router.post("/Ragisteruser", verifyUser, AddLocalUser)