const Publication = require("../models/Publication");

async function getAll() {
    return await Publication.find({}).lean();
};

async function create(data) {
    const newPublication = new Publication(data);
    await newPublication.save();
    return newPublication;
};

async function edit(id, data) {
    let currPublication = await Publication.findById(id);
    let newPublication = Object.assign(currPublication, data);
    await newPublication.save();
    return newPublication;
};

async function del(id) {
    await Publication.findByIdAndRemove(id);
};

async function findById(id) {
    const current = await Publication.findById(id).populate("shared").populate("owner").lean();
    return current;
};

async function subscribe(id, userId) {
    let curr = await Publication.findById(id);
    curr.shared.push(userId);
    await curr.save();
};


module.exports = {
    create,
    edit,
    del,
    findById,
    getAll,
    subscribe
};