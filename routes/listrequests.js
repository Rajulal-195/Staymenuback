import express from "express";
import { ListRequest } from "../models/ListingRequests.js";
import {
    createListreqest,getAllReqest
} from "../controllers/Listreq.js";


const router = express.Router();
//CREATE
router.post("/listRequest", createListreqest, );


//GET

router.get("/", getAllReqest);

export default router;
