// api-routes.js
// Initialize express router
let router = require('express').Router();
// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to RESTHub crafted with love!',
    });
});
// Import area controller
var areaController = require('./area/areaController');
// Area routes
router.route('/areas')
    .get(areaController.index)
    .post(areaController.new);
router.route('/areas/:_id')
    .get(areaController.view)
    .patch(areaController.update)
    .put(areaController.update)
    .delete(areaController.delete);
// Export API routes
module.exports = router;