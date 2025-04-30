const router = require('express').Router();
const { auth } = require('../middlewares/auth');
const Vaccine = require('../models/Vaccine');

const upcomingVaccines = [
    {
        "id": 1,
        "vaccineName": "Polio Vaccine",
        "date": "2025-05-12",
        "location": "City Hospital"
    },
    {
        "id": 2,
        "vaccineName": "Influenza (Flu) Shot",
        "date": "2025-06-15",
        "location": "Community Center"
    },
    {
        "id": 3,
        "vaccineName": "COVID-19 Booster Dose",
        "date": "2025-07-20",
        "location": "Downtown Clinic"
    },
    {
        "id": 4,
        "vaccineName": "Hepatitis B Vaccine",
        "date": "2025-08-05",
        "location": "Green Valley Health Center"
    },
    {
        "id": 5,
        "vaccineName": "MMR (Measles, Mumps, Rubella)",
        "date": "2025-09-10",
        "location": "Sunrise Pediatrics"
    }
];

// Get all vaccines for a user
router.get('/', auth, async (req, res) => {
    const vaccines = await Vaccine.find({ userId: req.user.id });
    res.json(vaccines);
});

// Add vaccine record
router.post('/', auth, async (req, res) => {
    const { vaccineName, date } = req.body;

    if (!vaccineName || !date) {
        return res.status(400).json({ message: 'Vaccine name and date are required' });
    }

    const newVaccine = new Vaccine({
        userId: req.user.id,
        vaccineName,
        date
    });

    await newVaccine.save();
    res.status(201).json(newVaccine);
});

router.get('/upcoming', auth, (req, res) => {
    res.status(200).json(upcomingVaccines);
});

module.exports = router;
