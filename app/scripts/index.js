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
var StoreSpecialForm =require("./components/storeSpecial.jsx")
var StoreEventForm =require("./components/storeEvent.jsx")
var StoreCardForm =require("./components/storeCards.jsx")
var StoreInfoForm =require("./components/storeInfo.jsx")

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
    "store/:name":"store",
    "storeSpecial/:name":"storeSpecial",
    "storeEvent/:name":"storeEvent",
    "storeCard/:name":"storeCard",
    "storeInfo/:name":"storeInfo",
    "owner/:id":"owner",

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
  console.log("what")
    ReactDOM.unmountComponentAtNode(homeContainer);
    ReactDOM.render(<SearchCardForm cardName={cardName} router={this}/>,homeContainer)
  },
  specials:function(){
    ReactDOM.unmountComponentAtNode(homeContainer);
    ReactDOM.render(<SpecialForm router={this}/>,homeContainer)
  },
  specialDescription:function(id){
    var info = id.split("_");
    var curId = info[0];
    var specialNum =info[1];
    ReactDOM.unmountComponentAtNode(homeContainer);
    ReactDOM.render(<SpecialDescriptionForm curId = {curId} specialNum={specialNum} router={this}/>,homeContainer)
  },
  allStores:function(){
    ReactDOM.unmountComponentAtNode(homeContainer);
    ReactDOM.render(<StoreForm storeName="" router={this}/>,homeContainer)
  },
  store:function(id){
    ReactDOM.unmountComponentAtNode(homeContainer);
    ReactDOM.render(<StoreForm storeName={id} router={this}/>,homeContainer)
  },
  storeSpecial:function(id){
    ReactDOM.unmountComponentAtNode(homeContainer);
    ReactDOM.render(<StoreSpecialForm storeName={id} router={this}/>,homeContainer)
  },
  storeEvent:function(id){
    ReactDOM.unmountComponentAtNode(homeContainer);
    ReactDOM.render(<StoreEventForm storeName={id} router={this}/>,homeContainer)
  },
  storeCard:function(id){
    ReactDOM.unmountComponentAtNode(homeContainer);
    ReactDOM.render(<StoreCardForm storeName={id} router={this}/>,homeContainer)
  },
  storeInfo:function(id){
    ReactDOM.unmountComponentAtNode(homeContainer);
    ReactDOM.render(<StoreInfoForm storeName={id} router={this}/>,homeContainer)
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
