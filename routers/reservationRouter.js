const express = require('express');
const reservationRouter = express.Router();
const Users = require("../models/usersModel");
const reservationModel = require('../models/reservationModel');
const authGuard = require('../middleware/authguard');

reservationRouter.get('/calendar', authGuard, (req, res) => {
    res.render('pages/calendar.twig',{
        user : req.session.user
    })
})

reservationRouter.post('/reserve', authGuard, async (req, res) => {
   
    const { terrainId, start, end, title } = req.body;
   // Vérifiez que les données existent
   if (!terrainId || !start || !end || !title) {
    return res.status(400).json({ message: 'Tous les champs sont requis.' });
}
    try {
        const reservation = new reservationModel({
            terrainId,
            userId: req.session.user._id,
            start,
            end,
            title,
        });

        await reservation.save();
        res.json({ message: 'Réservation réussie' }); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Une erreur est survenue lors de l\'enregistrement de la réservation.' });
    }
});

reservationRouter.get('/getReservations', authGuard, async (req, res) => {
    try {
        const userId = req.session.user._id;
        
        // Utiliser reservationModel pour obtenir les réservations
        const reservations = await reservationModel.find().populate('userId', 'name firstname mail'); // Assurez-vous d'utiliser reservationModel ici

        const formattedReservations = reservations.map(reservation => ({
            id: reservation._id,
            terrainId: reservation.terrainId,  // Assurez-vous d'inclure l'ID du terrain
            start: reservation.start,
            end: reservation.end,
            title: reservation.title,
            user: {
                name: reservation.userId.name, // Accéder à l'utilisateur peuplé
                firstname: reservation.userId.firstname,
                mail: reservation.userId.mail
            },
            color: reservation.userId._id.toString() === userId.toString() ? 'green' : 'red' // Couleur en fonction de l'utilisateur
        }));

        res.json(formattedReservations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des réservations.' });
    }
});


module.exports = reservationRouter;
