// =======================================================
// Validate Fields
// =======================================================
exports.validateUID = function(req, res, next) {
    if (!req.body.uid) {
      return res.status(400).json({ error: 'Missing required field UID' });
    }
    next();
}

exports.validateFields = function(req, res, next) {
    if(!req.body.serialNumber || !req.body.ipv4Address){
        return res.status(400).json({
            error: 'Missing required fields'
        });
    };  
    next(); 
};