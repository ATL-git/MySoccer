const authGuard = require('../middleware/authguard');
const teamsRouter = require('express').Router();
const teamsModel = require('../models/teamsModel');
const usersModel = require("../models/usersModel");
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken")


teamsRouter.get('/teamsManager', authGuard, async (req, res) => {
    const teamsFinded = await usersModel.findById(req.session.user._id).populate({
        path: "teams",
        populate: {
            path: "users",
        }

    })
    res.render('pages/teamsManager.twig', {
        user: req.session.user,
        teams: teamsFinded.teams,
    })
})


teamsRouter.post('/teamAdd', authGuard, async (req, res) => {
    try {
        const newteam = new teamsModel(req.body)
        const userConnected = await usersModel.findOne({ _id: req.session.user._id })
        newteam.validateSync()
        await newteam.save()
        await usersModel.updateOne({ _id: req.session.user._id }, { $push: { teams: newteam._id } })
        await teamsModel.updateOne({ _id: newteam._id }, { $push: { users: userConnected } })
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
            error: "Un probleme est survenu pendant la suppression",
            user: await userModel
                .findById(req.session.user)
                .populate("teams"),

        });
    }
});

teamsRouter.post("/invitPlayer", authGuard, async (req, res) => {

    try {
        const nameAdmin = req.session.user.firstname;
        const teamId = req.body.teamId;
        const user = await usersModel.findOne({ mail: req.body.mail });

        if (!user) {
            return res.render("pages/teamsManager.twig", {
                user: req.session.user,
                error: "Utilisateur non trouvé avec cet email",
            });

        }


        const token = jwt.sign({
            userId: user._id,
            teamId: teamId
        }, process.env.TOKEN_MAIL_PASS, { expiresIn: '48h' });

        const mailOptions = {
            from: 'no-reply@mySoccer.com',
            to: req.body.mail,
            subject: 'Invitation pour MySoccer',
            html: `<p>Veuillez cliquer sur le lien suivant pour accepter l'invitation de ${nameAdmin} : <a href='http://localhost:3000/acceptMailInvite/${token}'>Cliquez ici</a></p>`
        };


        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.log(error);
                return res.render("pages/teamsManager.twig", {
                    user: req.session.user,
                    error: "Une erreur est survenue lors de l'envoi de l'email",
                });
            } else {
                console.log("Email envoyé avec succès !");
                return res.render("pages/teamsManager.twig", {
                    user: req.session.user,
                    PMailSend: "Email envoyé avec succès !",
                });
            }
        });

        res.redirect("/teamsManager")

    } catch (err) {
        console.log(err);
        return res.render("pages/teamsManager.twig", {
            user: req.session.user,
            error: "Une erreur s'est produite lors du traitement de la requête",
        });
    }
});

teamsRouter.get('/acceptMailInvite/:token', authGuard, async (req, res) => {
    try {

        const decoded = jwt.verify(req.params.token, process.env.TOKEN_MAIL_PASS);
        const user = await usersModel.findById(decoded.userId);

        if (!user) {
            throw new Error('Utilisateur non trouvé.');
        }

        await teamsModel.updateOne(
            { _id: decoded.teamId },
            { $addToSet: { users: user._id } }
        );
        res.render('pages/dashboard.twig', {
            message: 'Invitation acceptée , vous avez etait ajouté à l\'équipe avec succès !'
        });
    } catch (error) {
        console.log(error.message);
        res.render('pages/teamsManager.twig', {
            error: 'Une erreur est survenue lors de l\'acceptation de l\'invitation.',
            details: error.message
        });
    }
})

teamsRouter.post('/createPlayer', authGuard, async (req, res) => {
    try {

        const { firstname, teamId } = req.body;
        const newPlayer = new usersModel({
            firstname: firstname,
            role: "player",
        })
        newPlayer.validateSync()
        await newPlayer.save()
        await teamsModel.updateOne({ _id: teamId }, { $push: { users: newPlayer._id } })
        res.redirect("/teamsManager")

    } catch (error) {
        res.render('pages/teamsManager.twig', {
            error: error.message,
        });
    }
});

teamsRouter.get('/playerDelete/:playerid/:teamid', authGuard, async (req, res) => {
    try {
        const playerId = req.params.playerid;
        const teamId = req.params.teamid;
        const userDelete = await usersModel.findOne({ _id: playerId })

        if (userDelete.name === "botPlayer" && userDelete.role === "player") {
            await usersModel.deleteOne({ _id: playerId });
            await teamsModel.updateOne({ _id: teamId }, { $pull: { users: playerId } })

        } else {
            await teamsModel.updateOne({ _id: teamId }, { $pull: { users: playerId } })
        }

        res.redirect("/teamsManager");
    } catch (error) {
        res.render("pages/teamsManager.twig", {
            error: "Un probleme est survenu pendant la suppression",
        });
    }
})

module.exports = teamsRouter
