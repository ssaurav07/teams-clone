const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const postSchema = new Schema({
    title : String,
	image : {
        type: String,
        default: "https://akm-img-a-in.tosshub.com/indiatoday/images/story/202104/photo-1531564701487-f238224b7c_1200x768.jpeg?q_6io2tiCIj7McK_gRABr11yUCEqtSAC&size=1200:675"
    },
	description : String,

	author : {
        type:String ,
        default: 'Saurav'
    },

    ownerId : {
        type: String ,
        default: '60d8123c48448d0015c36980'
    },

	date : {
        type:Date ,
        default:Date.now
    }
    
});

const post = mongoose.model('post',postSchema);
module.exports = post;