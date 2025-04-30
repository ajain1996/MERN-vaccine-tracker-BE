const express = require('express');
const { auth } = require('../middlewares/auth');
const Service = require('../models/Service');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

const router = express.Router();

// Only patients can access this route
router.post('/book-appointments', auth('patient'), async (req, res) => {
    try {
        const { doctorId, serviceId, appointmentDate } = req.body;
        const patientId = req.user.id; // assuming `authMiddleware` sets req.user

        const appointment = new Appointment({
            doctor: doctorId,
            patient: patientId,
            service: serviceId,
            appointmentDate,
        });

        await appointment.save();
        res.status(201).json({ message: 'Appointment booked successfully', appointment });
    } catch (error) {
        console.error('Booking Error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

router.get('/all-booked-appointments', auth('patient'), async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.user.id })
            .populate('doctor', 'username')
            .populate('service', 'name');

        res.json(appointments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});


router.get('/my-doctor', auth('patient'), async (req, res) => {
    const { doctorId } = req.query;

    try {
        const doctor = await User.findOne({ _id: doctorId });
        res.json(doctor);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});


router.get('/all-services', auth('patient'), async (req, res) => {
    try {
        const services = await Service.find().populate("doctor", "username role");
        res.json(services);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
