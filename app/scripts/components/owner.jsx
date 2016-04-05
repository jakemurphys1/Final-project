var React = require("react");
var ReactDOM=require("react-dom");
var Backbone = require("backbone");
var $ = require("jquery");
var Input = require("react-bootstrap/lib/Input");
var Parse = require("parse");

var EventForm = require("../forms/event.jsx");
var CardForm = require("../forms/cards.jsx");
var SpecialForm = require("../forms/specials.jsx");
var RemoveForm = require("../forms/remove.jsx");

var OwnerForm = React.createClass({
  getInitialState:function(){
    Parse.initialize("GLID");
    Parse.serverURL = 'http://gaminglocal.herokuapp.com'
      var currentUser = Parse.User.current();
      var self=this;
      Parse.User.current().fetch().then(function (user) {
        self.setState({"storeName":user.get("storeName")})
      });
      return {
        "userName":   currentUser.getUsername(),
        "storeName":""
      }
},
  componentDidMount:function(){
  var currentUser = Parse.User.current();
      console.log("CurrentUser",currentUser.getUsername())
  },
  render:function(){
    var currentForm = <EventForm storeName={this.state.storeName} />;
    if(this.props.currentId==":cards"){
      currentForm = <CardForm storeName={this.state.storeName} />;
    }
    if(this.props.currentId==":special"){
      currentForm = <SpecialForm storeName={this.state.storeName} />;
    }
    if(this.props.currentId==":remove"){
      currentForm = <RemoveForm storeName={this.state.storeName} />;
    }

    return(
      <div className="row Total">
        <div className="row Header">
          <h1>{this.state.storeName}</h1>
        </div>
        <div className="row">
          <ul className="list-inline nav nav-tabs">
            <li><a href="#home">Home</a></li>
            <li><a href="#owner/:events">Events</a></li>
              <li><a href="#owner/:special">Specials</a></li>
            <li><a href="#owner/:cards">Add Cards to sale</a></li>
            <li><a href="#owner/:remove">Remove Cards</a></li>
          </ul>
        </div>
        <div id="ownerContainer" className="row ownerContainer">
            {currentForm}
        </div>
      </div>
    )
  }
})

module.exports=OwnerForm;
