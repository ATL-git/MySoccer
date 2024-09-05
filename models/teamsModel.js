const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "le nom est requis"],
        validate: function (value) {
            return /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(value);
        },
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
       
    }],

})

const teamsModel = mongoose.model('teams', teamSchema);
module.exports = teamsModel;