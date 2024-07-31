const authGuard = require('../middleware/authguard');
const teamsRouter = require('express').Router();
const teamsModel = require('../models/teamsModel');
const usersModel = require("../models/usersModel");
const nodemailer = require('nodemailer');

teamsRouter.get('/teamsManager', authGuard, async (req, res) => {
    const teamsFinded = await usersModel.findById(req.session.user._id).populate({
        path: "teams",
    })
    res.render('pages/teamsManager.twig', {
        user: req.session.user,
        teams: teamsFinded.teams
    })
})


teamsRouter.post('/teamAdd', authGuard, async (req, res) => {
    try {
        const newteam = new teamsModel(req.body)
        newteam.validateSync()
        await newteam.save()
        await usersModel.updateOne({ _id: req.session.user._id }, { $push: { teams: newteam._id } })
        res.redirect("/teamsManager")
    } catch (error) {
        res.render("pages/teamsManager.twig", {
            user: req.session.user,
            error: error.message,
        })
    }
})

teamsRouter.get("/teamdelete/:teamid", authGuard, async (req, res) => {
    try {
        await teamsModel.deleteOne({ _id: req.params.teamid });
        await usersModel.updateOne({ _id: req.session.user._id }, { $pull: { teams: req.params.teamid } })
        res.redirect("/teamsManager");
    } catch (error) {
        console.log(error.message);
        res.render("pages/teamsManager.twig", {
            errorMessage: "Un probleme est survenu pendant la suppression",
            user: await userModel
                .findById(req.session.user)
                .populate("teams"),

        });
    }
});

teamsRouter.post("/invitPlayer", authGuard, (req, res) => {
    const nameAdmin = req.session.user.firstname
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {

        from: 'no-reply@mySoccer.com',
        to: req.body.mail,
        subject: 'Invitation pour MySoccer',
        html: `<p>Veuillez cliquer sur le lien suivant pour accepter l'invitation de ${nameAdmin} : <a href='http://localhost:3000/acceptMailInvite'>Cliquez ici</a></p>`
    };

    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            res.render("pages/teamsManager.twig", {
                user: req.session.user,
                errorMessage: "Une erreur est survenue lors de l'envoi de l'email",
            });
        } else {
            res.render("pages/teamsManager.twig", {
                user: req.session.user,
                PMailSend: "Email envoyé avec succès !",
            });
        }
    });
});


module.exports = teamsRouter