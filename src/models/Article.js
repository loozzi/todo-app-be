const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Article = new Schema({
    title: { type: String },
    permalink: { type: String },
    body: { type: String },
    author_id: { type: String },
    tags: { type: Array },
    create_at: { type: Date, default: Date.now }
});


const ArticleModel = mongoose.model('article', Article);
module.exports = ArticleModel;