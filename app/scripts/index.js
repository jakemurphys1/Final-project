var Backbone=require("backbone");
var $ = require("jquery");
var React = require("react");
var ReactDOM=require("react-dom");
var Parse = require("parse")
var Input = require("react-bootstrap/lib/Input");
var ButtonInput= require("react-bootstrap/lib/ButtonInput")
//local
var SignupForm=require("./components/signup.jsx")
var OwnerForm=require("./components/owner.jsx")

console.log(SignupForm)

var appContainer= document.getElementById("container")

var Router = Backbone.Router.extend({
  routes:{
    "":"owner",
    "home":"home",
    "owner":"owner",
    "signin":"signin",
    "owner/:events":"owner",
    "owner/:cards":"owner",
    "owner/:special":"owner",
  },
  home:function(){

  },
  Login:function(){

  },
  owner:function(id){
    console.log(id)
    ReactDOM.unmountComponentAtNode(appContainer);
    ReactDOM.render(<OwnerForm currentId={id} router={this}/>,appContainer)
  },
  signin:function(){
    ReactDOM.unmountComponentAtNode(appContainer);
    ReactDOM.render(<SignupForm router={this}/>,appContainer)
  },
})


var router = new Router();
Backbone.history.start();
