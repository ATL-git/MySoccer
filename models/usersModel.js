const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
require('dotenv').config();

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "le nom est requis"],
        validate: function (value) {
            return /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(value);
        },
        default: "yolo", 
    },
    firstname: {
        type: String,
        required: [true, "le prénom est requis"],
        validate: function (value) {
            return /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(value);
        }
    },
    mail: {
        type: String,
        required: [true, "le mail est requis"],
        validate: function (value) {
            return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
        },
        default: "yolo@yolo.fr",
    },
    password: {
        type: String,
        required: [true, "le mot de passe est requis"],
        validate: function (value) {
            return /^(?=.*\d.*\d)[A-Za-z\d\W]{4,}$/.test(value);
        },
        default: "yolo123",
        
    },
    phone: {
        type: Number,
        required: [true, "le numéro de téléphone est requis"],
        validate: function (value) {
            return /^\d{8,12}$/.test(value);
        },
       default:"0644444444",
    },
    birthDate: {
        type: Date,
        default : "01/01/2000" ,
    },
    teams: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "teams"
    }],
    role: {
        type : String ,
        default: "User",
    },
    teamrole:{
        type : String , 
        default : "none"
    }
})

userSchema.pre('save', async function (next) {
    if (this.isModified("password")) {
        this.password = bcrypt.hashSync(this.password, parseInt(process.env.PASS))
    }
})


const usersModel = mongoose.model('users', userSchema);
module.exports = usersModel;