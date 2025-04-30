const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { verifyDoctor } = require('../middleware/auth');

// Doctor adds service
router.post('/', verifyDoctor, async (req, res) => {
    const { title, description } = req.body;
    const service = new Service({ doctor: req.userId, title, description });
    await service.save();
    res.status(201).json(service);
});

// Get all services
router.get('/', async (req, res) => {
    const services = await Service.find().populate('doctor', 'username');
    res.json(services);
});

module.exports = router;
