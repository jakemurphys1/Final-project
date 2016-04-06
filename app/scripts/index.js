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
var SpecialForm =require("./components/special.jsx")
var SpecialDescriptionForm =require("./components/specialDescription.jsx")
var StoreForm =require("./components/store.jsx")

var homeContainer= document.getElementById("container")
Parse.initialize("GLID");
Parse.serverURL = 'http://gaminglocal.herokuapp.com'

var Router = Backbone.Router.extend({
  routes:{
    "":"home",
    "home":"home",
    "owner":"owner",
    "register":"register",
    "signin":"signin",
    "searchEvent/:dates":"searchEvent",
    "searchCard/:name":"searchCard",
    "specials":"specials",
    "specialDescription/:id":"specialDescription",
    "allStores":"allStores",
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
  specials:function(){
    ReactDOM.unmountComponentAtNode(homeContainer);
    ReactDOM.render(<SpecialForm router={this}/>,homeContainer)
  },
  specialDescription:function(id){
    console.log(id)
    var info = id.split("_");
    var curId = info[0];
    var specialNum =info[1];
    ReactDOM.unmountComponentAtNode(homeContainer);
    ReactDOM.render(<SpecialDescriptionForm curId = {curId} specialNum={specialNum} router={this}/>,homeContainer)
  },
  allStores:function(){
    ReactDOM.unmountComponentAtNode(homeContainer);
    ReactDOM.render(<StoreForm router={this}/>,homeContainer)
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
