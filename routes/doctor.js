const express = require('express');
const {auth} = require('../middlewares/auth');
const Service = require('../models/Service');

const router = express.Router();

// Only doctors can access this route
router.get('/services', auth('doctor'), async (req, res) => {
    try {
        const services = await Service.find({ doctor: req.user.id });
        res.json(services);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/services-create', auth('doctor'), async (req, res) => {
    try {
        const { title, description, price } = req.body;
        const doctorId = req.user.id;

        const newService = new Service({
            doctor: doctorId,
            title,
            description,
            price
        });

        await newService.save();
        res.status(201).json({ message: 'Service created successfully', service: newService });
    } catch (err) {
        res.status(500).json({ message: 'Error creating service', error: err.message });
    }
});

module.exports = router;
