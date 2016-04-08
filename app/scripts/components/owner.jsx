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
var InfoForm = require("../forms/info.jsx");

var OwnerForm = React.createClass({
  getInitialState:function(){
      var currentUser = Parse.User.current();
      return {
        "userName":   currentUser.getUsername(),
        "storeName":""
      }
},
  componentDidMount:function(){
  var currentUser = Parse.User.current();
  var self = this;
  var storeName = Parse.Object.extend("Stores");
  var query = new Parse.Query(storeName);
    query.equalTo("username", currentUser.getUsername());

    query.find({
      success: function(results) {
          self.setState({"storeName":results[0].get("storeName")})

      },
      error: function(error) {
        console.log("Step Server not find")
      }
  })

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
    if(this.props.currentId==":account"){
      currentForm = <InfoForm storeName={this.state.storeName} />;
    }

    return(
      <div className="row Total">
        <div className="row Header">
          <h1>{this.state.storeName}</h1>
        </div>
        <div className="row">
          <div className="col-xs-12 col-xs-offset-1">
          <ul className="list-inline nav nav-tabs tabs">
            <li><a href="#home">Home</a></li>
            <li><a href="#owner/:events">Events</a></li>
              <li><a href="#owner/:special">Specials</a></li>
            <li><a href="#owner/:cards">Add Cards to sale</a></li>
            <li><a href="#owner/:remove">View Cards</a></li>
            <li><a href="#owner/:remove">View Orders</a></li>
              <li><a href="#owner/:account">Manage Account</a></li>
          </ul>
        </div>
        </div>
        <div id="ownerContainer" className="row ownerContainer">
            {currentForm}
        </div>
      </div>
    )
  }
})

module.exports=OwnerForm;
