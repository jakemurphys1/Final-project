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
console.log("outside",this.props.endDate)
  if(this.props.endDate !=""){
    eventQuery.greaterThanOrEqualTo("Date", this.props.startDate);
    eventQuery.lessThanOrEqualTo("Date", this.props.endDate);
  }else{
        console.log("id",this.props.id)
    eventQuery.equalTo("objectId", this.props.id);


  }


    eventQuery.find({
      success: function(results) {
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
      var allEvents = <div className="loadingContainer"><img src="images/Loading.gif" /></div>;
      if(this.state.events.length>0){
        allEvents = this.state.events.map(function(item){
            //check is store is approved
            var isApproved = false
            var stores = self.props.storeCollection
            for(var i =0;i<stores.length;i++){
              if(stores[i].get("storeName")==item.get("storeName")){
                if(stores[i].get("Approved")){
                  isApproved=true
                }
              }
            }

            if(isApproved==true){
                  return(<FoundEvent key = {item.id} parent={self} item={item}/>)
            }

        })
      }


      if(this.state.description!=""){
        allEvents=this.state.description;
      }

      console.log(allEvents)
    return(
      <div>
        <div className="headerSmall row">
          <div className="overlay"></div>
        </div>
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
    var day = date.getUTCDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    Date.prototype.getDayName = function() {
      return days[ this.getDay() ];
    };
    var now = new Date();

    var dayname = date.getDayName();

    var redate = dayname + ", " +  monthNames[monthIndex] + " " + day + " " + year

    if(this.props.item.get("startTime")){
      var start = this.props.item.get("startTime").split(":")
      var starthr = start[0];
      var startmin = start[1];
      var startampm = "AM"
      if(parseInt(starthr)>12){
        starthr=parseInt(starthr)-12;
        startampm="PM"
      }
      if(parseInt(starthr)==12){
          startampm="PM"
      }
      if(parseInt(starthr)==0){
        starthr=12;
        startampm="AM"
      }
      if(startmin==undefined){
        startampm=""
        starthr="???"
        startmin=""
      }

      var end = this.props.item.get("endTime").split(":")
      var endhr = end[0];
      var endmin = end[1];
      var endampm = "AM"
      if(parseInt(endhr)>12){
        endhr=parseInt(endhr)-12;
        endampm="PM"
      }
      if(parseInt(endhr)==12){
          endampm="PM"
      }
      if(parseInt(endhr)==0){
        endhr=12;
        endampm="AM"
      }
      if(endmin==undefined){
        endampm=""
        endhr="???"
        endmin=""
      }

      var time = <p>Time: {starthr + ":" + startmin + " " + startampm + " To " + endhr + ":" + endmin + " " + endampm}</p>
    }

    return(<div className="col-md-3 col-sm-4 col-sx-12 infoContainer">
      <h3>{this.props.item.get("Name")}</h3>
      <p>Store:  {this.props.item.get("storeName")}</p>
      <p>Format: {this.props.item.get("Format")}</p>
      <p>Date: {redate}</p>
      {time}
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
        <button onClick={this.handleBack} className="btn btn-secondary back">Back</button>
        </div>
    )
  }
})

module.exports=searchEvent;
