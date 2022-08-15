const mongoose = require('mongoose');

var adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: 'This field is required.'
    },
    password: {
        type: String,
        required: 'This field is required.'
    }
   
}
,{
    versionKey: false
}
);


const Admin = new mongoose.model('admin', adminSchema);

module.exports = Admin
