const mongoose = require('mongoose');
// Enable access to .env variables
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/socialmediaapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

module.exports = mongoose.connection;