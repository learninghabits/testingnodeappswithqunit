QUnit.module('DataService Tests', {
    setup: function () { },
    teardown: function () { }
});

QUnit.test('returns a dataservice', function (assert) {
    var dataService = require('../dataservice');
    assert.ok(dataService, 'expected a dataservice');
});

QUnit.test('create an instance of dataservice', function (assert) {
    var DataService = require('../dataservice');
    var dataService = new DataService();
    assert.ok(dataService, 'could not create an instance of dataservice');
});


QUnit.test('calling the connect function (success scenario)',
    function (assert) {
        var done = assert.async();
        var mock = require('mock-require');
        mock('mongodb', {
            MongoClient: {
                connect: function (url, cb) {
                    cb(null, {});
                }
            }
        });
        var DataService = require('../dataservice');
        var dataService = new DataService();
        dataService.connect()
            .then(function (db) {
                assert.ok(db);
                done();
            })
            .catch(function (error) {
                assert.notOk(error);
                done();
            });;
    });

QUnit.test('calling the connect function (error scenario)',
    function (assert) {
        var done = assert.async();
        var mock = require('mock-require');
        mock('mongodb', {
            MongoClient: {
                connect: function (url, cb) {
                    cb({ message: 'DB Time out' }, null);
                }
            }
        });
        var DataService = require('../dataservice');
        var dataService = new DataService();
        dataService.connect()
            .then(function (data) {
                assert.notOk(data);
                done();
            })
            .catch(function (error) {
                assert.ok(error);
                assert.equal(error.message, "DB Time out");
                done();
            });
    });

QUnit.test('calling the getTopic function (success scenario)',
    function (assert) {
        var done = assert.async();
        var DataService = require('../dataservice');
        var dataService = new DataService();
        var params = {
            db: {
                collection: function (collectionName) {
                    return {
                        findOne: function (mainQ, subQ, cb) {
                            cb(null, {});
                        }
                    };
                },
                close: function () {
                }
            },
            query: [{}, {}]
        };
        dataService.getTopic(params)
            .then(function (db) {
                assert.ok(db);
                done();
            })
            .catch(function (error) {
                assert.notOk(error);
                done();
            });
    });

QUnit.test('calling the getTopic function (error scenario)',
    function (assert) {
        var done = assert.async();
        var DataService = require('../dataservice');
        var dataService = new DataService();
        var params = {
            db: {
                collection: function (collectionName) {
                    return {
                        findOne: function (mainQ, subQ, cb) {
                            cb({ message: 'some random error occured' }, null);
                        }
                    };
                },
                close: function () {
                }
            },
            query: [{}, {}]
        };
        dataService.getTopic(params)
            .then(function (data) {
                assert.notOk(data);
                done();
            })
            .catch(function (error) {
                assert.ok(error);
                assert.equal(error.message, 'some random error occured');
                done();
            });
    });

