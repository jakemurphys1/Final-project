var React = require("react");
var ReactDOM=require("react-dom");
var Backbone = require("backbone");
var $ = require("jquery");
var Input = require("react-bootstrap/lib/Input");
var Parse = require("parse");

var Total=React.createClass({
  getInitialState:function(){
  return {
    "Specials":   "",
  }
},
  handleAddSpecial:function(e){
    e.preventDefault();
      var currentUser = Parse.User.current();
    var specialList={
      "specialName1": $("#specialName1").val(),
      "specialDescription1":$("#specialDescription1").val(),
      "specialStart1":$("#startDay1").val(),
      "specialEnd1":$("#endDay1").val(),
      "specialName2": $("#specialName2").val(),
      "specialDescription2":$("#specialDescription2").val(),
      "specialStart2":$("#startDay2").val(),
      "specialEnd2":$("#endDay2").val(),
      "specialName3": $("#specialName3").val(),
      "specialDescription3":$("#specialDescription3").val(),
      "specialStart3":$("#startDay3").val(),
      "specialEnd3":$("#endDay3").val(),
      "date":Date.now(),
      "userName":currentUser.getUsername(),
    }

    var query = new Parse.Query("Specials");
 query.equalTo("userName", currentUser.getUsername());
 query.first({
     success: function (Contact) {
         Contact.save(null, {
             success: function (contact) {
                 contact.set(specialList);
                 contact.save();
                 //location.reload();
             }
         });
     }
 });

  },
componentDidMount(){
  Parse.initialize("GLID");
  Parse.serverURL = 'http://gaminglocal.herokuapp.com'
    var currentUser = Parse.User.current();

  var Specials = Parse.Object.extend("Specials");
    var specQuery = new Parse.Query(Specials);
    var specArray=[];
    specQuery.equalTo("userName", currentUser.getUsername());
    specQuery.find({
    success: function(results) {
       specArray=results;
       console.log("success", specArray)
      },
      error: function(error) {
        console.log("Special Server not find")
      }
      }).done(function(){
        this.setState({"Specials":specArray[0]});
        for(var i =1;i<4;i++){
          $("#specialName" + i).val(this.state.Specials.get("specialName"+i))
          $("#specialDescription" + i).val(this.state.Specials.get("specialDescription"+i))
          $("#startDay" + i).val(this.state.Specials.get("specialStart"+i))
          $("#endDay" + i).val(this.state.Specials.get("specialEnd"+i))
        }
       }.bind(this));



},
  render:function(){
    if(this.state.Specials != ""){
      var specialName1 = this.state.Specials.get("specialName1")
      var specialName2 = this.state.Specials.get("specialName2")
      var specialName3 = this.state.Specials.get("specialName3")
      var specialDescription1 = this.state.Specials.get("specialDescription1")
      var specialDescription2 = this.state.Specials.get("specialDescription2")
      var specialDescription3 = this.state.Specials.get("specialDescription3")
      var startDay1 = this.state.Specials.get("specialStart1")
      var startDay2 = this.state.Specials.get("specialStart2")
      var startDay3 = this.state.Specials.get("specialStart3")
      var endDay1 = this.state.Specials.get("specialEnd1")
      var endDay2 = this.state.Specials.get("specialEnd2")
      var endDay3 = this.state.Specials.get("specialEnd3")
    }
    return(
      <div className="ownerSpecial">
      <h3>Specials</h3>
      <p>Limit three per store</p>
      <form onSubmit={this.handleAddSpecial} id="eventForm" action="" className="form-events">
          <div className="col-md-4">
            <div className="row"><label>Special 1</label></div>

              <input id="specialName1" type="text" name="specialName" placeholder="Name"/>
              <div className="row"><label>Description</label></div>
              <textarea className="specialDescription" id="specialDescription1" placeholder="Description of the Special"></textarea>
                    <div className="row"><label>Dates of special</label></div>
              <div className="col-md-6"><input id="startDay1" className="theDates" type="date" name="startDay" placeholder="Start Day"/></div>
              <div className="col-md-6"><input id="endDay1" className="theDates" type="date" name="endDay" placeholder="End Day"/></div>
          </div>
          <div className="col-md-4">
            <div className="row"><label>Special 2</label></div>
              <input id="specialName2" type="text" name="specialName" placeholder="Name"/>
              <div className="row"><label>Description</label></div>
              <textarea className="specialDescription" id="specialDescription2" placeholder="Description of the Special"></textarea>
                    <div className="row"><label>Dates of special</label></div>
              <div className="col-md-6"><input id="startDay2" className="theDates" type="date" name="startDay" placeholder="Start Day"/></div>
              <div className="col-md-6"><input id="endDay2" className="theDates" type="date" name="endDay" placeholder="End Day"/></div>
          </div>
          <div className="col-md-4">
            <div className="row"><label>Special 3</label></div>
              <input id="specialName3" type="text" name="specialName" placeholder="Name"/>
              <div className="row"><label>Description</label></div>
              <textarea className="specialDescription" id="specialDescription3" placeholder="Description of the Special"></textarea>
                    <div className="row"><label>Dates of special</label></div>
              <div className="col-md-6"><input id="startDay3" className="theDates" type="date" name="startDay" placeholder="Start Day"/></div>
              <div className="col-md-6"><input id="endDay3" className="theDates" type="date" name="endDay" placeholder="End Day"/></div>
          </div>
      <button type="submit" className="btn btn-lg btn-block btn-primary signinbutton">Update</button>
      </form>
      </div>
    )

  }
})

module.exports=Total;
