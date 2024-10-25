const express = require('express');
const reservationRouter = express.Router();
const Users = require("../models/usersModel");
const reservationModel = require('../models/reservationModel');
const authGuard = require('../middleware/authguard');

reservationRouter.get('/calendar', authGuard, (req, res) => {
    res.render('pages/calendar.twig', {
        user: req.session.user,
    })
})

reservationRouter.post('/reserve', authGuard, async (req, res) => {
    const { terrainId, start, end, title } = req.body;

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
        const reservationUser = await reservationModel.find().populate('userId', 'name firstname mail role');

        const Reservations = reservationUser.map(reservation => {
            const isAdmin = reservation.userId.role === 'Admin';
            const isUser = reservation.userId._id.toString() === userId.toString();
            const isCurrentUserAdmin = req.session.user.role === 'Admin';

            // Définir la couleur selon le rôle de l'utilisateur et le propriétaire de la réservation
            let color;
            if (isAdmin) {
                color = 'red'; // Les réservations Admin sont rouges pour tous
            } else if (isUser) {
                color = 'green'; // Les réservations de l'utilisateur courant sont vertes
            } else {
                color = 'blue'; // Les réservations d'autres utilisateurs sont bleues
            }

            return {
                id: reservation._id,
                terrainId: reservation.terrainId,
                start: reservation.start,
                end: reservation.end,
                title: reservation.title,
                user: {
                    name: reservation.userId.name,
                    firstname: reservation.userId.firstname,
                    mail: reservation.userId.mail,
                    role: reservation.userId.role,
                },
                color: color
            };
        });

        res.json(Reservations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des réservations.' });
    }
});

reservationRouter.delete('/deleteReservation/:id', authGuard, async (req, res) => {
    const reservationId = req.params.id;
    try {
        await reservationModel.findByIdAndDelete(reservationId);
        res.json({ message: 'Réservation supprimée avec succès.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la suppression de la réservation.' });
    }
});

reservationRouter.get('/getUser', authGuard, (req, res) => {

    const user = req.session.user;
    res.json({ user: user });
});


module.exports = reservationRouter;
