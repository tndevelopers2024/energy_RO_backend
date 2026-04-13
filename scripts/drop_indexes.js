const mongoose = require('mongoose');
require('dotenv').config();

const dropIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const collections = await mongoose.connection.db.collections();
    const customerCollection = collections.find(c => c.collectionName === 'customers');

    if (customerCollection) {
      console.log('Found customers collection. Checking indexes...');
      const indexes = await customerCollection.indexes();
      console.log('Current indexes:', indexes.map(i => i.name));

      // Drop unique indexes for mobileNumber and email
      // The names are usually mobileNumber_1 and email_1
      try {
        await customerCollection.dropIndex('mobileNumber_1');
        console.log('Dropped mobileNumber_1 index');
      } catch (e) {
        console.log('mobileNumber_1 index not found or already dropped');
      }

      try {
        await customerCollection.dropIndex('email_1');
        console.log('Dropped email_1 index');
      } catch (e) {
        console.log('email_1 index not found or already dropped');
      }
    }

    console.log('Index cleanup complete.');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

dropIndexes();
