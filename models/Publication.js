const { Schema, model } = require("mongoose");


const schema = new Schema({
    title: {type: String, required: true},
    tech: {type: String, required: true},
    imgUrl: {type: String, required: true},
    certificate: {type: String, required: true},
    owner: {type: Schema.Types.ObjectId, ref: "User", required: true},
    shared: [{type: Schema.Types.ObjectId, ref: "User"}]
});


module.exports = model("Publication", schema);