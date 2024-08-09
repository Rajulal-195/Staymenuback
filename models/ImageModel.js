// server/models/ImageModel.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  textData: { type: String, required: true },
  files: [
    {
      filename: { type: String, required: true },
      path: { type: String, required: true }
    }
  ]
});

const ImageModel = mongoose.model('Image', imageSchema);

module.exports = ImageModel;
