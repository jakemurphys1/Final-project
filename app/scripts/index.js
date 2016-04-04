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
var LoginForm=require("./components/login.jsx")
var HomeForm =require("./components/home.jsx")

var homeContainer= document.getElementById("container")

var Router = Backbone.Router.extend({
  routes:{
    "":"home",
    "home":"home",
    "owner":"owner",
    "register":"register",
    "signin":"signin",
    "owner/:events":"owner",
    "owner/:cards":"owner",
    "owner/:special":"owner",
  },
  home:function(){
    ReactDOM.unmountComponentAtNode(homeContainer);
    ReactDOM.render(<HomeForm router={this}/>,homeContainer)
  },
  Login:function(){

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
