// areaModel.js
var mongoose = require("mongoose");
// Setup schema
var areaSchema = mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  create_date: {
    type: Date,
    default: Date.now
  }
});
// Export Area model
var Area = (module.exports = mongoose.model("area", areaSchema));
module.exports.get = function(callback, limit) {
  Area.find(callback).limit(limit);
};
