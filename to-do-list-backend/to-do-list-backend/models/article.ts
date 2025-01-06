const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const ArticleModel = mongoose.model("Article", ArticleSchema);

module.exports = ArticleModel; // CommonJS export