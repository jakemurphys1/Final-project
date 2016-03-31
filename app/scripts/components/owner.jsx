var React = require("react");
var ReactDOM=require("react-dom");
var Backbone = require("backbone");
var $ = require("jquery");
var Input = require("react-bootstrap/lib/Input");
var Parse = require("parse");

var eventForm = require("../forms/event.jsx");
var cardForm = require("../forms/cards.jsx");
var specialForm = require("../forms/specials.jsx");

var OwnerForm = React.createClass({
  render:function(){
    console.log("currentId:",this.props.currentId)
    var currentForm = eventForm;
    if(this.props.currentId==":cards"){
      currentForm = cardForm;
    }
    if(this.props.currentId==":special"){
      currentForm = specialForm;
    }
    console.log("here:", currentForm)

    return(
      <div className="row Total">
        <div className="row Header">
          <h1>Store Owner</h1>
        </div>
        <div className="row">
          <ul className="list-inline nav nav-tabs">
            <li><a href="#owner/:events">Events</a></li>
            <li><a href="#owner/:cards">Cards</a></li>
            <li><a href="#owner/:special">Specials</a></li>
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
