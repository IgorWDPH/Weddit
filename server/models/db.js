const mongoose = require('mongoose');
const config = require('config');
async function connect() {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });       
    }
    catch(e) {
        console.error('Server Error: ', e.message);
        process.exit(1);
    }
}

module.exports = connect;