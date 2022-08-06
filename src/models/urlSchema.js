const mongoose = require('mongoose');

var urlSchema = new mongoose.Schema({
    sr_no: {
        type: Number,
        required: 'This field is required.'
    },
    url_title: {
        type: String,
        required: 'This field is required.'
    },
    url_desc: {
        type: String,
        required: 'This field is required.'
    },
    video_file :
    {
        type: String,
        unique : false
    }
},{
    versionKey: false
});


const url_schema = new mongoose.model('video1Schema', urlSchema);

module.exports = url_schema
