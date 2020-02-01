const { MongoClient, ObjectId } = require('mongodb');
const { config } = require('../config/index');

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const DB_NAME = config.dbName;
const HOST = config.dbHost;

const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@${HOST}/${DB_NAME}?retryWrites=true&w=majority`;

class MongoLib {
  constructor() {
    this.client = new MongoClient(MONGO_URI, { userNewUrlParser: true });
    this.dbName = DB_NAME;
  }

  connect() {
    if (!MongoLib.connection) {
      MongoLib.connection = new Promise((resolve, reject) => {
        this.client.connect((err) => {
          if (err) {
            reject(err);
          }

          const debugDB = require('debug')('app:db');
          debugDB('Connected succesfully to mongo');
          resolve(this.client.db(this.dbName));
        });
      });
    }

    return MongoLib.connection;
  }

  create(collection, data) {
      return this.connect().then((db) => {
        return db.collection(collection).insertOne(data);
      }).then(result => result.insertedId);
  }

  getAll(collection, query) {
    return this.connect().then((db) => {
      return db.collection(collection).find(query).toArray();
    });
  }

  update(collection, id, data) {
    return this.connect().then((db) => {
      return db.collection(collection).updateOne({ _id: ObjectId(id)}, { $set: data }, { upsert: true });
    }).then(result => result.upsertedId || id);
  }

  delete(collection, id) {
    return this.connect().then((db) => {
      return db.collection(collection).deleteOne({ _id: ObjectId(id) });
    }).then(() => id);
  }
}

module.exports = MongoLib;
