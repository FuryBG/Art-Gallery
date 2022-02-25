const User = require("../models/User");

async function createUser(username, hashedPassword, address) {
    const newUser = new User({
        username,
        hashedPassword,
        address
    });
    await newUser.save();
    return newUser;
};

async function getUserByUsername(username) {
    let userRegEx = new RegExp(`^${username}$`, "i");
    const currUser = await User.findOne({username:{$regex: userRegEx}});
    return currUser;
};

async function createPublication(userId, publicationId) {
    let currUser = await User.findById(userId);
    currUser.publications.push(publicationId);
    await currUser.save();
};

async function sharePublication(userId, publicationId) {
    let currUser = await User.findById(userId);
    currUser.subscribed.push(publicationId);
    await currUser.save();
};

async function getCurrentUser(userId) {
    return await User.findById(userId).populate("publications").populate("subscribed").lean();
};

module.exports = {
    createUser,
    getUserByUsername,
    createPublication,
    sharePublication,
    getCurrentUser
};