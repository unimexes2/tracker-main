// Iteration #5: The movie model
const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const trackerSchema = new Schema({

 

  trackerData: [{
    time: { type: Date, default: Date.now },
    coordlat: { type: String },
    coordlng: { type: String },
    speed: { type: String }
  }],

  alias: {
    type: String
  },

  


  user: { type: Schema.Types.ObjectId, ref: "User" }

});




const Tracker = mongoose.model("Tracker", trackerSchema);
module.exports = Tracker;
