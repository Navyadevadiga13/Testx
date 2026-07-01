const mongoose = require('mongoose');

const uri = 'mongodb://internxindia:internx123@ac-ruj0gsp-shard-00-01.m9ephgo.mongodb.net:27017,ac-ruj0gsp-shard-00-02.m9ephgo.mongodb.net:27017,ac-ruj0gsp-shard-00-00.m9ephgo.mongodb.net:27017/psyx?ssl=true&replicaSet=atlas-12jzcu-shard-0&authSource=admin&retryWrites=true&w=majority';

console.log('Connecting to MongoDB using corrected standard connection string...');

mongoose.connect(uri)
    .then(() => {
        console.log('✅ Success! Connected with fallback string.');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Failed even with fallback string:', err);
        process.exit(1);
    });
