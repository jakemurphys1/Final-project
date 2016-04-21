var Backbone=require("backbone");
var $ = require("jquery");
var React = require("react");
var ReactDOM=require("react-dom");
var Parse = require("parse")
var Input = require("react-bootstrap/lib/Input");
var ButtonInput= require("react-bootstrap/lib/ButtonInput")
//local
var RegisterForm=require("./components/register.jsx")
var SignUpForm = require("./components/signUp.jsx")
var OwnerForm=require("./components/owner.jsx")
var SearchEventForm=require("./components/searchEvent.jsx")
var SearchCardForm=require("./components/searchCard.jsx")
var SellCardForm=require("./components/sellCard.jsx")
var HomeForm =require("./components/home.jsx")
var SpecialForm =require("./components/special.jsx")
var SearchTag =require("./components/tagSearch.jsx")
var SpecialDescriptionForm =require("./components/specialDescription.jsx")
var StoreForm =require("./components/store.jsx")
var StoreSpecialForm =require("./components/storeSpecial.jsx")
var StoreEventForm =require("./components/storeEvent.jsx")
var StoreCardForm =require("./components/storeCards.jsx")
var StoreInfoForm =require("./components/storeInfo.jsx")
var CheckoutForm =require("./components/checkout.jsx")
var OrderForm =require("./components/orders.jsx")
var SeeCardForm =require("./components/seeCard.jsx")
var LoginForm=require("./components/login.jsx")
var ChangeForm=require("./components/changepassword.jsx")
//Models
var model = require("./models/models.js");
var OrderModel = new model.Model();
var OrderCollection = new model.ModelCollection()
var SellModel = new model.SellModel();
var SellCollection = new model.SellModelCollection()
var StoreModel = new model.Model();
var StoreCollection = new model.ModelCollection()



var homeContainer= document.getElementById("container")
Parse.initialize("GLID");
Parse.serverURL = 'http://gaminglocal.herokuapp.com'

//create collection of users
var Store = Parse.Object.extend("Stores");
var storeQuery = new Parse.Query(Store);
  storeQuery.find({
    success: function(theCards){
      StoreCollection=theCards
    }
  })

var Router = Backbone.Router.extend({
  routes:{
    "":"home",
    "home":"home",
    "owner":"owner",
    "register":"register",
    "signin":"signin",
    "signUp":"signUp",
      "login":"login",
    "change":"change",
    "searchEvent/:dates":"searchEvent",
    "searchCard/:name":"searchCard",
    "sellCard/:name":"sellCard",
    "specials":"specials",
    "tagSearch/:id":"tagSearch",
    "specialDescription/:id":"specialDescription",
    "allStores":"allStores",
    "store/:name":"store",
    "storeSpecial/:name":"storeSpecial",
    "storeEvent/:name":"storeEvent",
    "storeCard/:name":"storeCard",
    "storeInfo/:name":"storeInfo",
    "owner/:id":"owner",
    "checkout":"checkout",
    "orders":"orders",
    "seeCard/:name":"seeCard"
  },
  home:function(){
    ReactDOM.unmountComponentAtNode(homeContainer);
    ReactDOM.render(<HomeForm storeCollection={StoreCollection} router={this}/>,homeContainer)
  },
  signUp:function(){
    ReactDOM.unmountComponentAtNode(homeContainer);
    ReactDOM.render(<SignUpForm router={this}/>,homeContainer)
  },
  login:function(){
    ReactDOM.unmountComponentAtNode(document.getElementById("signFloat"));
      ReactDOM.render(<LoginForm />,document.getElementById("signFloat"))
  },
  change:function(type){
    ReactDOM.unmountComponentAtNode(homeContainer);
      ReactDOM.render(<ChangeForm />,homeContainer)
  },
  searchEvent:function(id){
    var dates = id.split("_")
    var startDate = new Date(dates[0])
    var endDate = new Date(dates[1])
    ReactDOM.unmountComponentAtNode(homeContainer);
    ReactDOM.render(<SearchEventForm storeCollection={StoreCollection} startDate={startDate} endDate={endDate} router={this}/>,homeContainer)
  },
  searchCard:function(id){
    var cardName = id;
    ReactDOM.unmountComponentAtNode(homeContainer);
    ReactDOM.render(<SearchCardForm storeCollection={StoreCollection} cardName={cardName} collection={OrderCollection} router={this}/>,homeContainer)
  },
  sellCard:function(){
    ReactDOM.unmountComponentAtNode(homeContainer);
    ReactDOM.render(<SellCardForm collection={SellCollection} router={this}/>,homeContainer)
  },
  specials:function(){
    ReactDOM.unmountComponentAtNode(homeContainer);
    ReactDOM.render(<SpecialForm storeCollection={StoreCollection} router={this}/>,homeContainer)
  },
  tagSearch:function(id){
    ReactDOM.unmountComponentAtNode(homeContainer);
    ReactDOM.render(<SearchTag searchTerm={id} router={this}/>,homeContainer)
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
    ReactDOM.render(<StoreForm  storeCollection={StoreCollection} storeName="" router={this}/>,homeContainer)
  },
  store:function(id){
    ReactDOM.unmountComponentAtNode(homeContainer);
    ReactDOM.render(<StoreForm storeCollection={StoreCollection}  storeName={id} router={this}/>,homeContainer)
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
    ReactDOM.render(<StoreCardForm storeName={id}  collection={OrderCollection} router={this}/>,homeContainer)
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
    ReactDOM.render(<RegisterForm storeCollection={StoreCollection} router={this}/>,homeContainer)
  },
  checkout:function(){
    ReactDOM.unmountComponentAtNode(homeContainer);
    ReactDOM.render(<CheckoutForm collection={OrderCollection} sellCollection={SellCollection} router={this}/>,homeContainer)
  },
  orders:function(){
    ReactDOM.unmountComponentAtNode(homeContainer);
    ReactDOM.render(<OrderForm router={this}/>,homeContainer)
  },
  seeCard:function(id){
    console.log(id)
    ReactDOM.unmountComponentAtNode(homeContainer);
    ReactDOM.render(<SeeCardForm curId={id} router={this}/>,homeContainer)
  },
})


var router = new Router();
Backbone.history.start();
