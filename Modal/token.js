const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var ttl = require('mongoose-ttl');

const tokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "userlogins",
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
// tokenSchema.plugin(ttl, { ttl: 600000 });

module.exports = mongoose.model("token", tokenSchema);