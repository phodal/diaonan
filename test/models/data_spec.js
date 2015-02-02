var async, expect, helper;

helper = require("../spec_helper");

expect = require('chai').expect;

async = require("async");

describe("Data", function () {
	var models;
	models = null;
	before(function () {
		helper.globalSetup();
		return models = helper.app.models;
	});
	after(function () {
		return helper.globalTearDown();
	});
	beforeEach(function (done) {
		return helper.setup(done);
	});
	afterEach(function (done) {
		return helper.tearDown(done);
	});
	it("should have a findOrCreate method", function () {
		return expect(models.Data.findOrCreate).to.exist;
	});
	it("should findOrCreate a new instance with a key", function (done) {
		return models.Data.findOrCreate("key", (function (_this) {
			return function (err, data) {
				expect(data).to.eql(new models.Data("key"));
				return done();
			};
		})(this));
	});
	it("should findOrCreate a new instance with a key and a value", function (done) {
		return models.Data.findOrCreate("aaa", "bbbb", (function (_this) {
			return function (err, data) {
				expect(data).to.eql(new models.Data("aaa", "bbbb"));
				return done();
			};
		})(this));
	});
	it("should findOrCreate an old instance overriding the value", function (done) {
		return models.Data.findOrCreate("aaa", "bbbb", (function (_this) {
			return function () {
				return models.Data.findOrCreate("aaa", "ccc", function () {
					return models.Data.find("aaa", function (err, data) {
						expect(data).to.eql(new models.Data("aaa", "ccc"));
						return done();
					});
				});
			};
		})(this));
	});
	it("should publish an update when calling findOrCreate", function (done) {
		models.Data.subscribe("aaa", (function (_this) {
			return function (data) {
				return done();
			};
		})(this));
		return models.Data.findOrCreate("aaa", "bbbb");
	});
	it("should allow subscribing in the create step", function (done) {
		return models.Data.findOrCreate("aaa", (function (_this) {
			return function (err, data) {
				models.Data.subscribe("aaa", function (curr) {
					if (curr.value === "ccc") {
						return done();
					}
				});
				data.value = "ccc";
				return data.save();
			};
		})(this));
	});
	it("should allow unsubscribing in the create step", function (done) {
		return models.Data.findOrCreate("aaa", (function (_this) {
			return function (err, data) {
				var func;
				func = function () {
					throw "This should never be called";
				};
				models.Data.subscribe("aaa", func);
				models.Data.unsubscribe("aaa", func);
				models.Data.subscribe("aaa", function (curr) {
					return done();
				});
				return data.save();
			};
		})(this));
	});
	it("should provide a find method that returns an error if there is no obj", function (done) {
		return models.Data.find("obj", (function (_this) {
			return function (err, data) {
				expect(err).to.eql("Record not found");
				return done();
			};
		})(this));
	});
	it("should provide a find method that uses a regexp for matching", function (done) {
		var results;
		results = [];
		return async.parallel([async.apply(models.Data.findOrCreate, "hello bob", "aaa"), async.apply(models.Data.findOrCreate, "hello mark", "aaa")], function () {
			return models.Data.find(/hello .*/, function (err, data) {
				if (err == null) {
					results.push(data.key);
				}
				if (results.length === 2) {
					expect(results).to.contain("hello bob");
					expect(results).to.contain("hello mark");
					return done();
				}
			});
		});
	});
	it("should provide a subscribe method that works for new topics", function (done) {
		var results;
		results = [];
		models.Data.subscribe("hello/*", function (data) {
			results.push(data.key);
			if (results.length === 2) {
				expect(results).to.contain("hello/bob");
				expect(results).to.contain("hello/mark");
				return done();
			}
		});
		return async.parallel([async.apply(models.Data.findOrCreate, "hello/bob", "aaa"), async.apply(models.Data.findOrCreate, "hello/mark", "aaa")]);
	});
	return describe("instance", function () {
		it("should get the key", function () {
			var subject;
			subject = new models.Data("key", "value");
			return expect(subject.key).to.eql("key");
		});
		it("should get the key (dis)", function () {
			var subject;
			subject = new models.Data("aaa");
			return expect(subject.key).to.eql("aaa");
		});
		it("should get the value", function () {
			var subject;
			subject = new models.Data("key", "value");
			return expect(subject.value).to.eql("value");
		});
		it("should get the value (dis)", function () {
			var subject;
			subject = new models.Data("key", "aaa");
			return expect(subject.value).to.eql("aaa");
		});
		it("should get the redisKey", function () {
			var subject;
			subject = new models.Data("key", "value");
			return expect(subject.redisKey).to.eql("topic:key");
		});
		it("should get the redisKey (dis)", function () {
			var subject;
			subject = new models.Data("aaa/42", "value");
			return expect(subject.redisKey).to.eql("topic:aaa/42");
		});
		it("should accept an object as value in the constructor", function () {
			var obj, subject;
			obj = {
				hello: 42
			};
			subject = new models.Data("key", obj);
			return expect(subject.value).to.eql(obj);
		});
		it("should export its value as JSON", function () {
			var obj, subject;
			obj = {
				hello: 42
			};
			subject = new models.Data("key", obj);
			return expect(subject.jsonValue).to.eql(JSON.stringify(obj));
		});
		it("should export its value as JSON when setting the value", function () {
			var obj, subject;
			obj = {
				hello: 42
			};
			subject = new models.Data("key");
			subject.value = obj;
			return expect(subject.jsonValue).to.eql(JSON.stringify(obj));
		});
		it("should set the value", function () {
			var subject;
			subject = new models.Data("key");
			subject.value = "bbb";
			return expect(subject.value).to.eql("bbb");
		});
		it("should set the value (dis)", function () {
			var subject;
			subject = new models.Data("key");
			subject.value = "ccc";
			return expect(subject.value).to.eql("ccc");
		});
		it("should set the json value", function () {
			var subject;
			subject = new models.Data("key");
			subject.jsonValue = JSON.stringify("ccc");
			return expect(subject.value).to.eql("ccc");
		});
		it("should have a save method", function () {
			var subject;
			subject = new models.Data("key");
			return expect(subject.save).to.exist;
		});
		it("should save an array", function (done) {
			var subject;
			subject = new models.Data("key");
			subject.value = [1, 2];
			return subject.save((function (_this) {
				return function () {
					return done();
				};
			})(this));
		});
		it("should support subscribing for change", function (done) {
			var subject;
			subject = new models.Data("key");
			return subject.save((function (_this) {
				return function () {
					models.Data.subscribe(subject.key, function (data) {
						expect(data.value).to.equal("aaaa");
						return done();
					});
					subject.value = "aaaa";
					return subject.save();
				};
			})(this));
		});
		it("should register for change before creation", function (done) {
			var subject;
			subject = new models.Data("key");
			models.Data.subscribe(subject.key, (function (_this) {
				return function (data) {
					expect(data.value).to.equal("aaaa");
					return done();
				};
			})(this));
			subject.value = "aaaa";
			return subject.save();
		});
		it("should save and findOrCreate", function (done) {
			var subject;
			subject = new models.Data("key");
			return subject.save((function (_this) {
				return function () {
					return models.Data.findOrCreate(subject.key, function (err, data) {
						expect(data).to.eql(subject);
						return done();
					});
				};
			})(this));
		});
		it("should save and find", function (done) {
			var subject;
			subject = new models.Data("key");
			return subject.save((function (_this) {
				return function () {
					return models.Data.find(subject.key, function (err, data) {
						expect(data).to.eql(subject);
						return done();
					});
				};
			})(this));
		});
		return it("should not persist the value before save", function (done) {
			var subject;
			subject = new models.Data("key");
			return subject.save((function (_this) {
				return function () {
					subject.value = "ccc";
					return models.Data.find(subject.key, function (err, data) {
						expect(data.value).to.not.eql("ccc");
						return done();
					});
				};
			})(this));
		});
	});
});
