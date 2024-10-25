const usersRouter = require('express').Router();
const usersModel = require('../models/usersModel');
const bcrypt = require('bcrypt')

usersRouter.get('/register', (req, res) => {
    res.render('pages/register.twig')
})

usersRouter.post('/register', async (req, res) => {
    try {
        const user = await usersModel.findOne({ mail: req.body.mail })
        if (!user) {
            let newUser = new usersModel(req.body)
            newUser.validateSync()
            await newUser.save()
            res.redirect('/login')
        } else {
            throw new Error("Ce mail existe déjà")
        }
    } catch (error) {
        res.render('pages/register.twig', {
            error: error.message,

        })
    }
})


usersRouter.get('/login', (req, res) => {
    res.render('pages/login.twig')
})

usersRouter.post('/login', async (req, res) => {
    try {
        const user = await usersModel.findOne({ mail: req.body.mail })
        if (user) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                req.session.user = user
                res.redirect("/dashboard")
            } else {
                throw new Error('Mot de passe incorrecte')
            }
        }else{
            throw new Error('Utilisateur non trouver')
        }
    } catch (error) {
        console.log(error);
        res.render('pages/login.twig', {
            error: error.message
        })
    }
})

usersRouter.get('/dashboard', (req, res) => {
    res.render('pages/dashboard.twig',{
        user : req.session.user
    })
})

usersRouter.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/dashboard')
})

module.exports = usersRouter