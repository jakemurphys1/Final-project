var Backbone = require("backbone");
var $ = require("jquery");
var React = require("react");
var ReactDOM = require("react-dom");

var Model = Backbone.Model.extend({
   idAttribute: "_id",
});

var ModelCollection = Backbone.Collection.extend({
  model:Model,
  initialize: function(){},
});

var SellModel = Backbone.Model.extend({
   idAttribute: "_id",
});

var SellModelCollection = Backbone.Collection.extend({
  model:SellModel,
  initialize: function(){},
});


module.exports = {
  "Model":Model,
  "ModelCollection":ModelCollection,
  "SellModel":SellModel,
  "SellModelCollection":SellModelCollection,
}
