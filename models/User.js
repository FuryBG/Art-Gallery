const { Schema, model } = require("mongoose");

const schema = new Schema({
    username: {type: String, required: true},
    hashedPassword: {type: String, required: true},
    address: {type: String, required: true},
    publications: [{type: Schema.Types.ObjectId, ref: "Publication"}],
    subscribed: [{type: Schema.Types.ObjectId, ref: "Publication"}]
});

module.exports = model("User", schema);