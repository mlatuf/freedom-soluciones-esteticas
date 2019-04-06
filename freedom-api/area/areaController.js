// areaController.js
// Import area model
Area = require("./areaModel");
// Handle index actions
exports.index = function(req, res) {
  Area.get(function(err, areas) {
    if (err) {
      res.json({
        status: "error",
        message: err
      });
    }
    res.json({
      status: "success",
      message: "Areas retrieved successfully",
      data: areas
    });
  });
};

// Handle create area actions
exports.new = function(req, res) {
  var area = new Area();
  area.description = req.body.description
    ? req.body.description
    : area.description;
  area.duration = req.body.duration;
  area.price = req.body.price;
  // save the area and check for errors
  area.save(function(err) {
    // if (err)
    //     res.json(err);
    res.json({
      message: "New area created!",
      data: area
    });
  });
};

// Handle view area info
exports.view = function(req, res) {
  Area.findById(req.params._id, function(err, area) {
    if (err) res.send(err);
    res.json({
      message: "Area details loading..",
      data: area
    });
  });
};

// Handle update area info
exports.update = function(req, res) {
  Area.findByIdAndUpdate(req.params._id, req.body, function(err, area) {
    if (err) res.send(err);
    res.json({
      message: "Area Info updated",
      data: area
    });
    // area.description = req.body.description
    //   ? req.body.description
    //   : area.description;
    // area.duration = req.body.duration;
    // area.price = req.body.price;
    // // save the area and check for errors
    // area.save(function(err) {
    //   if (err) res.json(err);
    //   res.json({
    //     message: "Area Info updated",
    //     data: area
    //   });
    // });
  });
};

// Handle delete area
exports.delete = function(req, res) {
  
  Area.findByIdAndRemove(req.params._id , function(err, area) {
    if (err) res.send(err);
    res.json({
      status: "success",
      message: "Area deleted"
    });
  });
};
