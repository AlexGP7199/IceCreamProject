var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
// Esquema para la creacion de los datos que recibira el Usuario
var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

UserSchema.plugin(passportLocalMongoose)
//Exporta el modulo para su uso externo
module.exports = mongoose.model("User", UserSchema);