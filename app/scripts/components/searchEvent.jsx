var React = require("react");
var ReactDOM=require("react-dom");
var Backbone = require("backbone");
var $ = require("jquery")
var Input = require("react-bootstrap/lib/Input")
var Parse = require("parse")
var LoginForm=require("./login.jsx")

var searchEvent = React.createClass({
  getInitialState:function(){
  return {
    "events":   [],
    "description":""
  }
},
  componentDidMount:function(){
  //find card info from parse
  var currentUser = Parse.User.current();
  var self=this;
  var Event = Parse.Object.extend("Events");
  var eventQuery = new Parse.Query(Event);
    eventQuery.greaterThanOrEqualTo("Date", this.props.startDate);
    eventQuery.lessThanOrEqualTo("Date", this.props.endDate);
    eventQuery.find({
      success: function(results) {
        console.log("results",results)
        var newResults = results.sort(function(a,b) {
              return new Date(a.get("Date")).getTime() - new Date(b.get("Date")).getTime()
        });
          self.setState({"events":newResults})
          self.forceUpdate();
      },
      error: function(error) {
        console.log("Event Server not find")
      }
  })
  },
  render:function(){
      var self=this;
      var allEvents = <h1>Loading</h1>;
      if(this.state.events.length>0){
        allEvents = this.state.events.map(function(item){
            return(<FoundEvent key = {item.id} parent={self} item={item}/>)
        })
      }


      if(this.state.description!=""){
        allEvents=this.state.description;
      }

      console.log(allEvents)
    return(
      <div>
      <h1>All events at shops near you:</h1>
      <div>{allEvents}</div>
      </div>
    )
  }
})

var FoundEvent = React.createClass({
  handleDetails:function(){

    this.props.parent.setState({"description":<Description item = {this.props.item} grandparent = {this.props.parent} />})
  },
  render:function(){
    //reformat the date
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
    var date = this.props.item.get("Date");
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var redate = monthNames[monthIndex] + " " + day + " " + year

    return(<div className="col-md-2 col-sm-4 col-sx-12 infoContainer">
      <h3>{this.props.item.get("Name")}</h3>
      <p>Store:  {this.props.item.get("storeName")}</p>
      <p>Format: {this.props.item.get("Format")}</p>
      <p>Date: {redate}</p>
      <p>Time: {this.props.item.get("startTime") + " Through " + this.props.item.get("endTime")}</p>
      <a onClick={this.handleDetails}>Details</a>
  </div>)

  },
})

var Description = React.createClass({
  handleBack:function(){
    this.props.grandparent.setState({"description":""})
  },
  render:function(){
    return(<div className="infoContainer">
        <h1>{this.props.item.get("Name")}</h1>
        <p>{this.props.item.get("Description")}</p>
        <button onClick={this.handleBack} className="btn btn-secondary">Back</button>
        </div>
    )
  }
})

module.exports=searchEvent;
