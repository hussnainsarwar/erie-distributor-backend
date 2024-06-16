


const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Replace the connection string with your MongoDB Atlas connection string
const atlasConnectionUri = 'mongodb+srv://eriedistributor:khan123456@cluster0.cibpvkp.mongodb.net/ErieDistributor';

mongoose.connect(atlasConnectionUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('DB Connected Successfully');
  })
  .catch((error) => {
    console.error('Error in connection:', error);
  });
 
module.exports = mongoose;
