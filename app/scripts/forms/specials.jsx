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
      "tags1":$("#Tags1").val(),
      "specialName2": $("#specialName2").val(),
      "specialDescription2":$("#specialDescription2").val(),
      "tags2":$("#Tags2").val(),
      "specialName3": $("#specialName3").val(),
      "specialDescription3":$("#specialDescription3").val(),
        "tags3":$("#Tags3").val(),
      "date":Date.now(),
      "userName":currentUser.getUsername(),
      "storeName":this.props.storeName,
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
          $("#Tags" + i).val(this.state.Specials.get("tags"+i))
        }
       }.bind(this));



},
  render:function(){
    return(
      <div className="ownerSpecial row infoContainer">
      <h3>Specials</h3>
      <p>Limit three per store</p>
      <form onSubmit={this.handleAddSpecial} id="eventForm" action="" className="form-events">
          <div className="col-md-4">
            <div className="row"><label>Special 1</label></div>

              <input id="specialName1" type="text" name="specialName" placeholder="Name"/>
              <div className="row"><label>Description</label></div>
              <textarea className="specialDescription" id="specialDescription1" placeholder="Description of the Special"></textarea>
                    <div className="row"><label>Tags</label></div>
              <div className="col-md-6"><input id="Tags1" className="Tags" type="text" name="Tags" placeholder="tags for users to search"/></div>

          </div>
          <div className="col-md-4">
            <div className="row"><label>Special 2</label></div>
              <input id="specialName2" type="text" name="specialName" placeholder="Name"/>
              <div className="row"><label>Description</label></div>
              <textarea className="specialDescription" id="specialDescription2" placeholder="Description of the Special"></textarea>
                <div className="row"><label>Tags</label></div>
          <div className="col-md-6"><input id="Tags2" className="Tags" type="text" name="Tags" placeholder="tags for users to search"/></div>
          </div>
          <div className="col-md-4">
            <div className="row"><label>Special 3</label></div>
              <input id="specialName3" type="text" name="specialName" placeholder="Name"/>
              <div className="row"><label>Description</label></div>
              <textarea className="specialDescription" id="specialDescription3" placeholder="Description of the Special"></textarea>
                <div className="row"><label>Tags</label></div>
                <div className="col-md-6"><input id="Tags3" className="Tags" type="text" name="Tags" placeholder="tags for users to search"/></div>
          </div>
      <button type="submit" className="btn btn-lg btn-block btn-primary signinbutton">Update</button>
      </form>
      </div>
    )

  }
})

module.exports=Total;
