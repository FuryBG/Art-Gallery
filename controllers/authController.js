const router = require("express").Router();
const { isUser, isGuest } = require("../middlewares/guards");


    router.get("/register", isGuest(), (req, res) => {
        res.render("register.hbs", {title: "Register"});
    });

    router.post("/register", isGuest(), async(req, res) => {
        try{
            let errors = [];
            if(req.body.username == "" || req.body.password == "" || req.body.address == "") {
                errors.push("All fields are required!");
            };
            if(req.body.username.length < 4) {
                errors.push("Username is too short!");
            };
            if(req.body.password.length < 3) {
                errors.push("Password is too short!");
            };
            if(req.body.address.length > 20) {
                errors.push("Address is too long!");
            };
            if(req.body.password != req.body.rePass) {
                errors.push("Passwords must match!");
            };
            if(errors.length > 0) {
                throw new Error(errors.join("\n"));
            };

        await req.auth.register(req.body.username, req.body.password, req.body.address);
        res.redirect("/");
        }catch(err) {
            console.log(err);
            res.render("register.hbs", {title: "Register", errors: err.message.split("\n")});
        }
    });

    router.get("/login", isGuest(), (req, res) => {
        res.render("login.hbs", {title: "Login"});
    });

    router.post("/login", isGuest(), async(req, res) => {
        try{
            await req.auth.login(req.body.username, req.body.password);
        res.redirect("/");
        }catch(err) {
            console.log(err);
            res.render("login.hbs", {title: "Login", errors: err.message.split("\n")});
        }
    });


    router.get("/logout", isUser(), (req, res) => {
        req.auth.logout();
        res.redirect("/");
    });


module.exports = router;