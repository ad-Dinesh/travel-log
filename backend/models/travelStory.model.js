const mongoose = require("mongoose");

const travelStorySchema = new mongoose.Schema({
  userId: { type: String },
  title: { type: String, required: true },
  story: { type: String, required: true },
  visitedLocation: { type: String },
  imageUrl: { type: String },
  visitedDate: { type: Date },
  createdOn: { type: Date, default: new Date().getTime() }
});

module.exports = mongoose.model("TravelStory", travelStorySchema);