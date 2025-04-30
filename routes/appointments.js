const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { verifyPatient } = require('../middleware/auth');

// Patient books an appointment
router.post('/', verifyPatient, async (req, res) => {
    const { serviceId } = req.body;
    const appointment = new Appointment({ patient: req.userId, service: serviceId });
    await appointment.save();
    res.status(201).json(appointment);
});

// Patient views own appointments
router.get('/', verifyPatient, async (req, res) => {
    const appointments = await Appointment.find({ patient: req.userId }).populate('service');
    res.json(appointments);
});

module.exports = router;
