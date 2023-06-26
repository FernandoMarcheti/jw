class ServiceBase {

    constructor() {
        this.mongoClient = require('mongodb').MongoClient;
        this.url = 'mongodb://fernando:fernando@db:27017/test?authSource=admin';
    }

    getNextSequence(db, property) {
        return new Promise(function (resolve, reject) {
            db.collection('counters').findAndModify({ _id: property }, [], { $inc: { seq: 1 } }, { new: true }, function (err, result) {
                if (err)
                    reject('Error get SEQUENCE');

                resolve(result.value.seq);
            });
        });
    }

    getConnection() {
        var serviceBase = this;
        return new Promise(function (resolve, reject) {
            serviceBase.mongoClient.connect(serviceBase.url, function (err, db) {
                err ? reject(err) : resolve(db);
            });
        });
    }

}

module.exports = new ServiceBase();