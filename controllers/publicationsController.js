const router = require("express").Router();
const { isUser, isGuest } = require("../middlewares/guards");

router.get("/", async(req, res) => {
    let allGalleries = await req.storage.getAll();
    allGalleries.forEach(x => {
        x.sharedNum = x.shared.length;
    });
    res.render("home.hbs", {allGalleries});
});

router.get("/gallery", async(req, res) => {
    let allItems = await req.storage.getAll();
    res.render("gallery.hbs", {allItems});
});

router.get("/profile/:id", isUser(), async(req ,res) => {
    try {
    let currUser = await req.auth.getCurrentUser(req.params.id);
        if(currUser.publications.length > 0) {
            currUser.havePublications = true;
            currUser.publications = currUser.publications.map(x => x.title).join(", ");
        };
        if(currUser.subscribed.length > 0) {
            currUser.haveSubscribed = true;
            currUser.subscribed = currUser.subscribed.map(x => x.title).join(", ");
        };
    res.render("profile.hbs", currUser);
    }catch(err) {
        res.redirect("/notfound");
    };
});

router.get("/details/:id", async(req, res) => {
    try {
    let current = await req.storage.getById(req.params.id);
    let isSubscribed = false;
    if(req.user && req.user._id == current.owner._id) {
        current.isOwner = true;
    };
    if(req.user) {
    isSubscribed = current.shared.find(x => x._id == req.user._id);
    }
    if(isSubscribed) {
        current.isSubscribed = true;
    };
    current.owner = current.owner.username;
    res.render("details.hbs", current);
    }catch(err) {
        res.redirect("/notfound");
    };
});

router.get("/share/:id", isUser(), async(req, res) => {
    try {
        await req.storage.subscribe(req.params.id, req.user._id);
        await req.auth.sharePublication(req.user._id, req.params.id);
        res.redirect(`/details/${req.params.id}`);
    }catch(err) {
        res.redirect("/notfound");
    };
});

router.get("/delete/:id", async(req, res) => {
    try {
        req.storage.del(req.params.id);
        res.redirect("/");
    }catch(err) {
        res.redirect("/notfound");
    };
});

router.get("/edit/:id", async(req, res) => {
    try {
        let currItem = await req.storage.getById(req.params.id);
        res.render("edit.hbs", currItem);
    }catch(err) {
        res.redirect("/notfound");
    }
});

router.post("/edit/:id", async(req, res) => {
    try {
        let errors = [];
        if(req.body.title.length < 6) {
            errors.push("Tittle is too short!");
        };
        if(req.body.tech.length > 15) {
            errors.push("Tech is too long!");
        };
        if(req.body.tech == "") {
            errors.push("All fields are required!");
        };
        if(req.body.certificate != "Yes" && req.body.certificate != "No") {
            errors.push("Certificate must be Yes or No!");
        };
        if(!req.body.imgUrl.startsWith("http://") && !req.body.imgUrl.startsWith("https://")) {
        errors.push("Image address is invalid!");
        };
        if(errors.length > 0) {
            throw new Error(errors.join("\n"));
        };
        await req.storage.edit(req.params.id, req.body);
        res.redirect(`/details/${req.params.id}`);
    }catch(err) {
        res.render("edit.hbs", {errors: err.message.split("\n")});
    };
});

router.get("/create", isUser(), (req, res) => {
    res.render("create.hbs");
});

router.post("/create", isUser(), async(req, res) => {
    try {
        let errors = [];
        if(req.body.title.length < 6) {
            errors.push("Tittle is too short!");
        };
        if(req.body.tech.length > 15) {
            errors.push("Tech is too long!");
        };
        if(req.body.tech == "") {
            errors.push("All fields are required!");
        };
        if(req.body.certificate != "Yes" && req.body.certificate != "No") {
            errors.push("Certificate must be Yes or No!");
        };
        if(!req.body.imgUrl.startsWith("http://") && !req.body.imgUrl.startsWith("https://")) {
        errors.push("Image address is invalid!");
        };
        if(errors.length > 0) {
            throw new Error(errors.join("\n"));
        };
        req.body.owner = req.user._id;
        let created = await req.storage.create(req.body);
        await req.auth.createPublication(req.user._id, created._id);
        res.redirect("/");
    }catch(err) {
        res.render("create.hbs", {errors: err.message.split("\n")});
    }
});

router.all("*", (req, res) => {
    res.render("404.hbs");
});




module.exports = router;