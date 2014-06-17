'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');


var BlockGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');
    this.block = {};
  },

  askFor: function () {
    var done = this.async();
    var self = this;

    // Have Yeoman greet the user.
    this.log(yosay('Welcome to the marvelous Block generator!'));

    var prompts = [
      {
        type    : 'input',
        name    : 'name',
        message : 'Name your block',
        default : this.appname // Default to current folder name
      },
      {
        type: 'checkbox',
        name: 'features',
        message: 'What more would you like?',
        choices: [{
          name: 'CSS',
          value: 'css',
          checked: true
        },{
          name: 'LESS',
          value: 'less',
          checked: false
        },{
          name: 'SASS',
          value: 'sass',
          checked: false
        },{
          name: 'JS',
          value: 'js',
          checked: true
        },{
          name: 'CoffeeScript',
          value: 'coffee',
          checked: false
        }]
      }
    ];

    this.prompt(prompts, function (answers) {
      self.block.name = answers.name;
      self.block.basename = answers.name.replace(/ /g, '-').toLowerCase();
      self.block.features = answers.features;
      done();
    });
  },

  makeBlock: function () {
    var self = this;
    this.template('_index.php', this.block.basename + '.php', this.block);
    this.template('_block.json', 'block.json', this.block);

    var featureFiles = {
      'css': 'style.css',
      'less': 'style.less',
      'sass': 'style.scss',
      'js': 'script.js',
      'coffee': 'script.coffee'
    };

    this.block.features.forEach(function(feature) {
      if(feature in featureFiles) {
        self.template('_' + featureFiles[feature], featureFiles[feature], self.block);
      }
    })

    return;
    this.mkdir('app');
    this.mkdir('app/templates');

    this.copy('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
  }
});

module.exports = BlockGenerator;
