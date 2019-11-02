//preparando express, mongoose, etc . . . 
var express             = require('express'),
    app                 = express(),
    bodyParser          = require('body-parser'),
    mongoose            = require('mongoose'),
    passport            = require('passport'),
    LocalStrategy       = require('passport-local'),
    User                = require  ('./src/models/user')
    


/* Database 
Mongoose.set (* Evitar error por mongoose!!! *) */
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);

//Se crea la base de datos ya que si esta no extiste, te la creara! 
mongoose.connect("mongodb://localhost/ice_cream");


//Configuracion. 
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));


//Configuracion de PASSPORT
app.use(require("express-session")({
    secret: "Dario Gomez",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//var es codigo global!! 
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
 });



// Schema para la base de datos 
var icecreamSchemaRC = new mongoose.Schema({
    name: String, 
    description: String, 
    author: {   
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username: String
    }

});
//Schema  
var IceCream = mongoose.model("IceCream", icecreamSchemaRC);




//ROUTES 
app.get("/",function(req, res){
    res.render("../src/views/Landing");
});


//INDEX ROUTE 
app.get("/icecream", function(req,res){
    //obtiene todo el icecreams from db
   IceCream.find({}, function(err, allIcecreams){
        if(err){
            console.log(err);
        }else{
        res.render("../src/views/index", {icecream:allIcecreams});

        }

    });
});

    



//FORM TO LIST A NEW ICE CREAM!
app.get("/icecream/new", isLoggedIn, function(req, res){
    res.render("../src/views/New");
});

//ADD NEW ICE CREAM TO THE DB.
app.post("/icecream", isLoggedIn, function(req, res){
    //get data from form and add to icecreams array
    var name = req.body.name;
    var description = req.body.description;
    var username = res.locals.currentUser = req.user;
    var newIcecreams = {name: name, description: description, username: username}
    //CREATE A NEW ICECREAM AND SAVE TO DB 
    IceCream.create(newIcecreams,function(err, newlyAdded){
        if(err){
            console.log(err);
        }else{
            res.redirect("/icecream");
        }
    });
});


//  ===========
// AUTH ROUTES
//  ===========

// show register form
app.get("/register", function(req, res){
    res.render("../src/views/register"); 
 });

//handle sign up logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("./src/views/register");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/icecream"); 
        });
    });
});

// show login form
app.get("/login", function(req, res){
    res.render("../src/views/login"); 
 });
 // handling login logic
 app.post("/login", passport.authenticate("local", 
     {
         successRedirect: "/icecream",
         failureRedirect: "/login"
     }), function(req, res){
 });

// logic route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
 });
 
 function isLoggedIn(req, res, next){
     if(req.isAuthenticated()){
         return next();
     }
     res.redirect("/login");
 }


//ERROR PAGE
app.get("*", function(req, res){
    res.render("../src/views/Error")
});

app.listen(3000, function(){
    console.log('Server UP');
});








