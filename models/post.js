const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title : String,
	image : String,
	description : String,

	author : {
        type:String ,
        default:"Saurav"
    },

	date : {
        type:Date ,
        default:Date.now
    }
});

const post = mongoose.model('post',postSchema);
module.exports = post;