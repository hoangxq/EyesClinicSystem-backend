// const { MongoClient } = require('mongodb');
// const fs = require('fs');

// const uri = 'mongodb://127.0.0.1:27017';
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// async function exportAllCollections() {
//   try {
//     console.log('Connecting to MongoDB...');
//     await client.connect();
//     console.log('Connected to MongoDB.');

//     const database = client.db('eyesclinic');
//     const collections = await database.listCollections().toArray();

//     for (const collectionInfo of collections) {
//       const collectionName = collectionInfo.name;
//       console.log(`Fetching data from collection: ${collectionName}...`);
//       const collection = database.collection(collectionName);
//       const cursor = collection.find();
//       const data = await cursor.toArray();

//       console.log(`Fetched ${data.length} documents from ${collectionName}.`);
//       if (data.length > 0) {
//         fs.writeFileSync(`${collectionName}.json`, JSON.stringify(data, null, 2));
//         console.log(`Data exported successfully for collection: ${collectionName}`);
//       } else {
//         console.log(`No data found in collection: ${collectionName}`);
//       }
//     }
//   } catch (err) {
//     console.error('Error exporting data:', err);
//   } finally {
//     await client.close();
//   }
// }

// exportAllCollections().catch(console.error);
const { MongoClient } = require('mongodb');
const fs = require('fs');

const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function exportAllCollections() {
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected to MongoDB.');

    const database = client.db('pip');
    const collections = await database.listCollections().toArray();

    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      console.log(`Fetching data from collection: ${collectionName}...`);
      const collection = database.collection(collectionName);
      const cursor = collection.find();
      const data = await cursor.toArray();

      console.log(`Fetched ${data.length} documents from ${collectionName}.`);
      if (data.length > 0) {
        fs.writeFileSync(`${collectionName}.json`, JSON.stringify(data, null, 2));
        console.log(`Data exported successfully for collection: ${collectionName}`);
      } else {
        console.log(`No data found in collection: ${collectionName}`);
      }
    }
  } catch (err) {
    console.error('Error exporting data:', err);
  } finally {
    await client.close();
  }
}

exportAllCollections().catch(console.error);
