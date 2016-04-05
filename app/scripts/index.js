var Backbone=require("backbone");
var $ = require("jquery");
var React = require("react");
var ReactDOM=require("react-dom");
var Parse = require("parse")
var Input = require("react-bootstrap/lib/Input");
var ButtonInput= require("react-bootstrap/lib/ButtonInput")
//local
var RegisterForm=require("./components/register.jsx")
var OwnerForm=require("./components/owner.jsx")
var SearchEventForm=require("./components/searchEvent.jsx")
var SearchCardForm=require("./components/searchCard.jsx")
var HomeForm =require("./components/home.jsx")

var homeContainer= document.getElementById("container")

var Router = Backbone.Router.extend({
  routes:{
    "":"home",
    "home":"home",
    "owner":"owner",
    "register":"register",
    "signin":"signin",
    "searchEvent/:dates":"searchEvent",
    "searchCard/:name":"searchCard",
    "owner/:events":"owner",
    "owner/:cards":"owner",
    "owner/:special":"owner",
  },
  home:function(){
    ReactDOM.unmountComponentAtNode(homeContainer);
    ReactDOM.render(<HomeForm router={this}/>,homeContainer)
  },
  searchEvent:function(id){
  var dates = id.split("_")
  var startDate = new Date(dates[0])
  var endDate = new Date(dates[1])
    ReactDOM.unmountComponentAtNode(homeContainer);
    ReactDOM.render(<SearchEventForm startDate={startDate} endDate={endDate} router={this}/>,homeContainer)
  },
  searchCard:function(id){
  var cardName = id;
    ReactDOM.unmountComponentAtNode(homeContainer);
    ReactDOM.render(<SearchCardForm cardName={cardName} router={this}/>,homeContainer)
  },
  owner:function(id){
    ReactDOM.unmountComponentAtNode(homeContainer);
    ReactDOM.render(<OwnerForm currentId={id} router={this}/>,homeContainer)
  },
  register:function(){
    ReactDOM.unmountComponentAtNode(homeContainer);
    ReactDOM.render(<RegisterForm router={this}/>,homeContainer)
  },
})


var router = new Router();
Backbone.history.start();
