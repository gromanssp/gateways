const request = require('supertest');
const express = require('express');

// Import Routes
const appRoutes = require('../routes/app');
const gatewayRoutes = require('../routes/gateway');

const Gateway = require('../models/gateway');

const app = express();


// CORS
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  next();
});

// Config Route
app.use('/', appRoutes);
app.use('/gateways', gatewayRoutes);

// Prueba de ejemplo para la ruta '/'
describe('Unit Test APP', () =>{
  test('GET / sould return status 200', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBe(true);
  });

  // test('GET /gateways should return all gateways', async () => {
  //   const response = await request(app).get('/gateways');
  //   expect(response.status).toBe(200);
  //   expect(response.body.ok).toBe(true);
  // });

  // test('POST /gateways should create a new gateway', async () => {
  //   const newGateway = {
  //     serialNumber: '120',
  //     fullName: 'Gateway 1',
  //     ipv4Address: '192.168.1.15',
  //   };
  //   const response = await request(app).post('/gateways').send(newGateway);
  //   expect(response.status).toBe(201);
  //   expect(response.body.serialNumber).toBe(newGateway.serialNumber);
  // });

  test('CORS middleware allows access from any origin', async () => {
    const response = await request(app).options('/');
    //Verify headers
    expect(response.headers['access-control-allow-origin']).toBe('*');
    expect(response.headers['access-control-allow-methods']).toBe('POST, GET, PUT, DELETE, OPTIONS');
    expect(response.headers['access-control-allow-headers']).toBe('Origin, X-Requested-With, Content-Type, Accept');
  });

});
