var React = require("react");
var ReactDOM=require("react-dom");
var Backbone = require("backbone");
var $ = require("jquery");
var Input = require("react-bootstrap/lib/Input");
var Parse = require("parse");

var Total= React.createClass({
  getInitialState:function(){
    return {
      "eventList":[],
      "allDates":[<p><input key={1} id="eventDate1" type="date" name="eventDate" placeholder="Event Date"/></p>],
      "dateCount":1,
    }
  },
  handleAddDate:function(){
    var newDates = this.state.allDates;
    newDates.push(<p><input key={this.state.dateCount + 1} id={"eventDate" +  (this.state.dateCount + 1)} type="date" name="eventDate" placeholder="Event Date"/></p>)
    this.setState({"allDates":newDates,"dateCount":this.state.dateCount+1})
  },
  handleAddEvent:function(e){
    e.preventDefault();
    if($("#eventName").val()==""){
      return
    }
    if($("#eventDate").val()==""){
      return
    }
    if($("#eventFormat").val()==""){
      return
    }
    var currentUser = Parse.User.current();
    var Events = Parse.Object.extend("Events");
    var dataList=[];
    var self=this;
    var dateCount=this.state.dateCount;

    for(var i =1;i<=dateCount;i++){

      var data = {
        "Name":$("#eventName").val(),
        "Format":$("#eventFormat").val(),
        "Date":new Date($("#eventDate" + i).val()),
        "startTime":$("#startTime").val(),
        "endTime":$("#endTime").val(),
        "Description":$("#Description").val(),
        "userName":currentUser.getUsername(),
        "storeName":this.props.storeName,
      }
      if($("#eventDate" + i).val()){
        var events = new Events(data);
      dataList.push(events)
      }


    }

    Parse.Object.saveAll(dataList,{
      success:function(object){
        console.log("here")
        var newResults = object.sort(function(a,b) {
          return new Date(a.get("Date")).getTime() - new Date(b.get("Date")).getTime()
        });


                    $("#eventName").val("")
                    $("#eventFormat").val("")
                    $("#eventDate1").val("")
                    $("#startTime").val("")
                    $("#endTime").val("")
                    $("#Description").val("")
                      // self.replaceState(self.getInitialState())
                      //     self.setState({"eventList":newResults})
                      location.reload()
                      self.forceUpdate();
      },
    })




  },
  componentDidMount(){
    //find card info from parse
    var currentUser = Parse.User.current();
    var self=this;
    var Event = Parse.Object.extend("Events");
    var eventQuery = new Parse.Query(Event);
    var thisDate = new Date(Date.now())
    thisDate.setDate(thisDate.getDate() - 1);

      eventQuery.greaterThanOrEqualTo("Date", thisDate);
      eventQuery.equalTo("userName", currentUser.getUsername());
      eventQuery.find({
        success: function(results) {
          var newResults = results.sort(function(a,b) {
                return new Date(a.get("Date")).getTime() - new Date(b.get("Date")).getTime()
          });
            self.setState({"eventList":newResults})
            self.forceUpdate();
        },
        error: function(error) {
          console.log("Event Server not find")
        }
    })
  },
  render:function(){
    var self=this;
    var eventList=this.state.eventList.map(function(event){
        return(<IndivEvent parent={self} key={event.id} event={event} />)
    })
    return(<div className="ownerEvent infoContainer row">
      <h3>Events</h3>
      <form onSubmit={this.handleAddEvent} id="eventForm" action="" className="form-events">
          <div className="col-md-4 col-sm-12 info">
            <div className="row"><label>Event Name</label></div>
              <input id="eventName" type="text" name="eventName" placeholder="Event Name"/>
              <div className="row"><label>Format</label></div>
              <input id="eventFormat" type="text" name="eventFormat" placeholder="Standard, Modern, ect."/>
                <div className="row times">
                        <div className="row"><label>Time</label></div>
                  <input id="startTime" type="time" name="startTime" placeholder="Start Time"/>
                  <input id="endTime" type="time" name="endTime" placeholder="End Time"/>
                </div>
                    <div className="row"><label>Date(s)</label>
                    <p>Create multiple events with the same information but different dates.</p>
                    <p><button type="button" onClick={this.handleAddDate} className="btn btn-primary addDate">Add More Dates</button></p>
                    </div>

                      {this.state.allDates}




          </div>
          <div className="col-md-4 col-sm-12"><textarea id="Description" placeholder="Details of the event"></textarea>
            <button type="submit" className="btn btn-lg btn-block btn-primary signinbutton">Add</button>
          </div>
          <div className="col-md-4 col-sm-12 eventList">
            <label>Scheduled Events</label>
            {eventList}
          </div>
      </form>
      </div>
    )
  },
})

var IndivEvent = React.createClass({
  handleRemove:function(e){
    var curId= e.currentTarget.id;
    var EventBase = Parse.Object.extend("Events");
    var query = new Parse.Query(EventBase);
    query.get(curId, {
      success: function(myObj) {
        myObj.destroy({});
      },
      error: function(object, error) {
      }
    });

    //remove the item from setInfo
    var eventList = this.props.parent.state.eventList.filter(function(item){
    return(item.id!=curId)
    })
    this.props.parent.setState({"eventList":eventList})
  },
  render:function(){
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
    var date = this.props.event.get("Date");
    var day = date.getUTCDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var redate = monthNames[monthIndex] + " " + day + " " + year
    return(<p><b>{this.props.event.get("Name")}</b> on {redate}<span id={this.props.event.id} onClick={this.handleRemove} className="removeButton">Remove</span></p>)
  },
})

module.exports=Total;
