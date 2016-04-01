var React = require("react");
var ReactDOM=require("react-dom");
var Backbone = require("backbone");
var $ = require("jquery");
var Input = require("react-bootstrap/lib/Input");
var Parse = require("parse");

var EventForm = require("../forms/event.jsx");
var CardForm = require("../forms/cards.jsx");
var SpecialForm = require("../forms/specials.jsx");

var OwnerForm = React.createClass({
  componentDidMount:function(){
    Parse.initialize("GLID");
    Parse.serverURL = 'http://gaminglocal.herokuapp.com'

  },
  render:function(){

    var currentForm = <EventForm />;
    if(this.props.currentId==":cards"){
      currentForm = <CardForm />;
    }
    if(this.props.currentId==":special"){
      currentForm = <SpecialForm />;
    }

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
