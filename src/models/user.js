var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
// Esquema para poder recubir los campos de usuario y password
var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

UserSchema.plugin(passportLocalMongoose)
//Exporta el modulo para su uso externo
module.exports = mongoose.model("User", UserSchema);