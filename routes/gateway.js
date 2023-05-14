const express = require('express');
const { validateFields } = require('../middleware/validation');

const app = express();

const Gateway = require('../models/gateway');

// =======================================================
// Get all Gateways
// =======================================================
app.get('/', async (req, res) => {
    try {
        const gateways = await Gateway.find({});
        const count = await Gateway.countDocuments({});
        res.status(200).json({
            ok: true,
            total: count,
            gateways: gateways,
        });
        } catch (e) {
            res.status(500).json({
                ok: false,
                mensaje: 'Error finding Gateways',
                errors: e,
              });
        }
});
// =======================================================
// Create new Gateway
// =======================================================
app.post('/', validateFields, async (req, res) => {
    try {
        // Validate fields
             
        // Check if the gateway already exists
        const existingGateway = await Gateway.findOne({
            $or: [
                {serialNumber: req.body.serialNumber},
                {ipv4Address: req.body.ipv4Address},
            ],
        });
        if(existingGateway){
            return res.status(409).json({
                error: 'Gateway already exists'
            });
        }

        const gateway = new Gateway(req.body);
        await gateway.save();
        res.status(201).json(gateway);
    } catch (e) {
        res.status(500).json({
            message: 'Internal Server Error', 
            error: e
        });
    }
});
// =======================================================
// Update Gateway
// =======================================================
app.put('/:gatewayId', validateFields, async (req, res) => {
    try {       
        // Check if the gateway already exists
        const gateway = await Gateway.findById(req.params.gatewayId);

        // Check if the updated serial number or IP address conflicts with other gateways
        const existingGateway = await Gateway.findOne({
            $or: [
              { serialNumber: req.body.serialNumber },
              { ipv4Address: req.body.ipv4Address },
            ],
            _id: { $ne: req.params.gatewayId }, // Exclude the current gateway from the query
          });

        if(existingGateway){
            return res.status(409).json({ error: 'Gateway already exists'});
        }
        // Update gateway 
        gateway.serialNumber = req.body.serialNumber;
        gateway.fullName = req.body.fullName;
        gateway.ipv4Address = req.body.ipv4Address;
        await gateway.save();

        res.status(200).json(gateway);
    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(404).json({
                error: 'There is no gateway with this ID: ' + req.params.gatewayId,
            });
        }
        res.status(500).json({
            message: 'Internal Server Error',
            error, error
        });
    }
});
// =======================================================
// Delete Gateway
// =======================================================
app.delete('/:gatewayId', async (req, res) => {
    try {
        const gatewayId = req.params.gatewayId;
        const gatewayDeleted = await Gateway.findByIdAndRemove(gatewayId);
        res.status(200).json({
            ok: true,
            gateway: gatewayDeleted
        });
    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(404).json({
                error: 'There is no gateway with this ID: ' + req.params.gatewayId,
            });
        }
        res.status(500).json({
            message: 'Error deleting Gateway',
            error: error
        });
        
    }
});

module.exports = app;