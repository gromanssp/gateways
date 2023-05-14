const express = require('express');
const { validateUID } = require('../middleware/validation');

const app = express();

const Gateway = require('../models/gateway');

const Device = require('../models/device');

// =======================================================
// Get all devices for a Gateway
// =======================================================
app.get('/:gatewayId/devices', async (req, res) => {
    try {
      // Find the gateway
      const gateway = await Gateway.findById(req.params.gatewayId).populate('devices');
      if (!gateway) {
        return res.status(404).json({ error: 'Gateway not found' });
      }
  
      res.status(200).json(gateway.devices);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
});
  
/// =======================================================
// Get details for a simple device
// =======================================================
app.get('/devices/:deviceId', async (req, res) => {
    try {
      const device = await Device.findById(req.params.deviceId);
      if (!device) {
        return res.status(404).json({ error: 'Device not found' });
      }
  
      res.status(200).json(device);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

// =======================================================
// Create a new devices for a Gateway
// =======================================================
app.post('/:gatewayId/devices', async (req, res) => {
    try {
      // Find the gateway
      const gateway = await Gateway.findById(req.params.gatewayId);
  
      // Check the number of devices
      if (gateway.devices.length >= 10) {
        return res.status(400).json({ error: 'Maximum number of devices reached' });
      }
  
      // Create a new device
      const device = new Device(req.body);
      await device.save();
  
      // Add the device to the gateway
      gateway.devices.push(device._id);
      await gateway.save();
  
      res.status(201).json(device);
    } catch (error) {
      if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return res.status(404).json({
            error: 'There is no gateway with this ID: ' + req.params.gatewayId,
        });
      }
      res.status(500).json({ 
        message: 'Internal Server Error',
        error: error
       });
    }
});

// =======================================================
// Update a device
// =======================================================
app.put('/devices/:deviceId', validateUID, async (req, res) => {
    try {
      const device = await Device.findById(req.params.deviceId);  
  
      // Update device fields
      device.uid = req.body.uid;
      device.vendor = req.body.vendor || device.vendor;
      device.dateCreated = req.body.dateCreated;
      device.status = req.body.status || device.status;
      await device.save();
  
      res.status(200).json(device);
    } catch (error) {
      if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return res.status(404).json({
            error: 'There is no device with the ID: ' + req.params.deviceId,
        });
      }
      res.status(500).json({ message: 'Internal Server Error', error: error });
    }
  });

// =======================================================
// Delete device
// =======================================================
app.delete('/devices/:deviceId', async (req, res) => {
  try {
    // Find the device
    const device = await Device.findByIdAndRemove(req.params.deviceId);

    if (!device) {
      return res.status(404).json({
        error: 'There is no device with the ID: ' + req.params.deviceId,
      });
    }

    // Find the gateway and remove device from it 
    const gateway = await Gateway.findOneAndUpdate(
      { devices: req.params.deviceId },
      { $pull: { devices: req.params.deviceId } }
    );

    res.status(200).json({
      ok: true,
      device: device
  });
  } catch (error) {
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(404).json({
          error: 'There is no device with the ID: ' + req.params.deviceId,
      });
    }
    res.status(500).json({ message: 'Internal Server Error', error: error });
  }
})

module.exports = app;