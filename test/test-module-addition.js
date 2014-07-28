/*global describe, beforeEach, it */
'use strict';
var join = require('path').join
  , assert = require('yeoman-generator').assert
  , helpers = require('yeoman-generator').test;

describe('module generator', function () {

  // generate default app
  beforeEach(function (done) {
    helpers.testDirectory(join(__dirname, 'temp'), function (err) {
      if (err) {
        done(err);
      }

      this.app = helpers.createGenerator('ng-poly:app', [
        '../../app',
        '../../controller',
        '../../module',
        '../../view'
      ]);

      helpers.mockPrompt(this.app, {
        'appName': 'temp',
        'markup': 'html',
        'appScript': 'js',
        'controllerAs': false,
        'namedFunc': true,
        'testScript': 'js',
        'testDir': 'src',
        'style': 'less'
      });

      this.app.options['skip-install'] = true;
      this.app.run([], function () {
        done();
      });

    }.bind(this));
  });

  describe('adding a new module', function () {
    beforeEach(function (done) {
      this.app = helpers.createGenerator('ng-poly:module', [
        '../../module',
        '../../controller',
        '../../view'
      ], 'test');

      this.app.run([], function () {
        done();
      });
    });

    it('should add test to src/app.js deps', function () {
      assert.fileContent('src/app.js', /\'ui.router\',/);
      assert.fileContent('src/app.js', /\'test\'/);
    });
  });

  describe('adding a deep level module', function () {
    beforeEach(function (done) {
      this.app = helpers.createGenerator('ng-poly:module', [
        '../../module',
        '../../controller',
        '../../view'
      ], 'home/door');

      this.app.run([], function () {
        done();
      });
    });

    it('should add home.door to src/home/home.js deps', function () {
      assert.fileContent('src/home/home.js', /\'ui.router\',/);
      assert.fileContent('src/home/home.js', /\'home.door\'/);
    });

    it('should name module in src/home/door/door.js home.door', function () {
      assert.fileContent('src/home/door/door.js', /angular.module\(.[^$]*\'home.door\'/);
    });
  });

});