const mongoose = require('mongoose');

const VaccineSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    vaccineName: { type: String, required: true },
    date: { type: Date, required: true }
});

module.exports = mongoose.model('Vaccine', VaccineSchema);
