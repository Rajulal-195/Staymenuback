import Localuser from '../models/Localuser';

export const AddLocalUser = async (req,res,next)=>{
    try {
        const newItem = Localuser(req.body);
        const savedItem = await newItem.save();
        res.json(savedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

