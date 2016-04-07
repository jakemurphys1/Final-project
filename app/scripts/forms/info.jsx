var React = require("react");
var ReactDOM=require("react-dom");
var Backbone = require("backbone");
var $ = require("jquery");
var Input = require("react-bootstrap/lib/Input");
var Parse = require("parse");

var Total=React.createClass({
  getInitialState:function(){
    return {
      "Info":   "",
    }
  },
handleUpdate:function(e){
  e.preventDefault();
  var Monday = "Closed";
  var Tuesday = "Closed";
  var Wednesday = "Closed";
  var Thursday = "Closed";
  var Friday = "Closed";
  var Saturday = "Closed";
  var Sunday = "Closed";
  if($("#mon1").val()!=""){
      Monday = ($("#mon1").val() + " to " + $("#mon2").val())
  }
  if($("#tues1").val()!=""){
         Tuesday = ($("#tues1").val() + " to " + $("#tues2").val())
  }
  if($("#wed1").val()!=""){
      Wednesday = ($("#wed1").val() + " to " + $("#wed2").val())
  }
  if($("#thur1").val()!=""){
      Thursday = ($("#thur1").val() + " to " + $("#thur2").val())
  }
  if($("#fri1").val()!=""){
      Friday = ($("#fri1").val() + " to " + $("#fri2").val())
  }
  if($("#sat1").val()!=""){
      Saturday = ($("#sat1").val() + " to " + $("#sat2").val())
  }
  if($("#sun1").val()!=""){
      Sunday = ($("#sun1").val() + " to " + $("#sun2").val())
  }

  var data = {"email":$("#signupEmail").val(),"storeName":$("#signupStoreName").val(),"address":$("#addressStreet").val(),
            "city":$("#addressCity").val(),"state":$("#addressState").val(),"zip":$("#addressZip").val(),"phone":$("#signupPhone").val(),"website":$("#signupWebsite").val(),
            "Mon":Monday,"Tues":Tuesday,"Wed":Wednesday,"Thur":Thursday,"Fri":Friday,"Sat":Saturday,"Sun":Sunday,"isStore":true};

console.log(data)
            var currentUser = Parse.User.current();
            console.log(currentUser.id);
            var query = new Parse.Query("Stores");
              query.equalTo("username", currentUser.getUsername());
              query.first({
                success: function (Contact) {
                 Contact.save(null, {
                     success: function (contact) {
                         contact.set(data);
                         contact.save();
                         //location.reload();
                     }
                 });
             }
           });
},
componentDidMount(){
    var currentUser = Parse.User.current();
    var self = this;
  var User = Parse.Object.extend("Stores");
    var query = new Parse.Query(User);
    query.equalTo("username", currentUser.getUsername());
    query.find({
    success: function(results) {
      $("#signupFname").val(results[0].get("Fname"))
      $("#signupLname").val(results[0].get("Lname"))
      $("#signupUsername").val(results[0].get("username"))
      $("#addressStreet").val(results[0].get("address"))
      $("#addressCity").val(results[0].get("city"))
      $("#addressZip").val(results[0].get("zip"))
      $("#addressState").val(results[0].get("state"))
      $("#signupStoreName").val(results[0].get("storeName"))
      $("#signupWebsite").val(results[0].get("website"))
      $("#signupEmail").val(results[0].get("email"))
        $("#signupPhone").val(results[0].get("phone"))

        var Monday = (results[0].get("Mon").split(" to "))
        var Tuesday = (results[0].get("Tues").split(" to "))
        var Wednesday = (results[0].get("Wed").split(" to "))
        var Thursday = (results[0].get("Thur").split(" to "))
        var Friday = (results[0].get("Fri").split(" to "))
        var Saturday = (results[0].get("Sat").split(" to "))
        var Sunday = (results[0].get("Sun").split(" to "))
        if(Monday[0]=="Closed"){Monday=""}
        if(Tuesday[0]=="Closed"){Tuesday=""}
        if(Wednesday[0]=="Closed"){Wednesday=""}
        if(Thursday[0]=="Closed"){Thursday=""}
        if(Friday[0]=="Closed"){Friday=""}
        if(Saturday[0]=="Closed"){Saturday=""}
        if(Sunday[0]=="Closed"){Sunday=""}
       $("#mon1").val(Monday[0]);
       $("#mon2").val(Monday[1]);
       $("#tues1").val(Tuesday[0]);
       $("#tues2").val(Tuesday[1]);
       $("#wed1").val(Wednesday[0]);
       $("#wed2").val(Wednesday[1]);
       $("#thur1").val(Thursday[0]);
       $("#thur2").val(Thursday[1]);
       $("#fri1").val(Friday[0]);
       $("#fri2").val(Friday[1]);
       $("#sat1").val(Saturday[0]);
       $("#sat2").val(Saturday[1]);
       $("#sun1").val(Sunday[0]);
       $("#sun2").val(Sunday[1]);
      },
      error: function(error) {
        console.log("User Server not find")
      }
      })



},
  render:function(){
    return(
      <div className="row infoContainer">
        <div className="col-xs-8 col-xs-offset-2">
              <form onSubmit={this.handleUpdate} id="signin" action="" className="form-login">
              <div className="row">
                      <div className="col-md-6">
                        <label>Address of Store</label>
                          <div className="row"><input id="addressStreet" type="text" name="addressStreet" className="input" placeholder="Street Address"/></div>
                          <div className="row"><input id="addressCity" type="text" name="addressCity" className="input" placeholder="City"/></div>
                          <div className="row"><input id="addressState" type="text" name="addressState" className="input" placeholder="State"/></div>
                          <div className="row"><input id="addressZip" type="text" name="addressZip" className="input" placeholder="Zip Code"/></div>
                      </div>
                      <div className="col-md-6">
                          <label>Store Information</label>
                          <div className="row"><input id="signupStoreName" type="text" name="storeName" className="input" placeholder="Name of Store"/></div>
                          <div className="row"><input id="signupEmail" type="email" name="email" className="input" placeholder="Email for Store"/></div>
                          <div className="row"><input id="signupPhone" type="text" name="phone" className="input" placeholder="Phone Number for Store"/></div>
                          <div className="row"><input id="signupWebsite" type="text" name="website" className="input" placeholder="Website for Store"/></div>
                      </div>
                    </div>
                      <div className="row">

                        <div className="col-md-6 ">
                            <label>Hours of Operation</label>
                            <p>(leave empty if closed)</p>
                            <div className="row">
                              <div className="col-md-6">
                                <span>Mon:  </span><p><input id="mon1" type="text" className="Time"/> to <input id="mon2" type="text" className="Time"/></p>
                                <span>Tues: </span><p><input id="tues1" type="text" className="Time"/> to <input id="tues2" type="text" className="Time"/></p>
                                <span>Wed:  </span><p><input id="wed1" type="text" className="Time"/> to <input id="wed2" type="text" className="Time"/></p>
                                <span>Thur: </span><p><input id="thur1" type="text" className="Time"/> to <input id="thur2" type="text" className="Time"/></p>
                              </div>
                              <div className="col-md-6">
                                <span>Fri:  </span><p><input id="fri1" type="text" className="Time"/> to <input id="fri2" type="text" className="Time"/></p>
                                <span>Sat:  </span><p><input id="sat1" type="text" className="Time"/> to <input id="sat2" type="text" className="Time"/></p>
                                <span>Sun:  </span><p><input id="sun1" type="text" className="Time"/> to <input id="sun2" type="text" className="Time"/></p>
                              </div>
                              </div>
                        </div>
                      </div>



                    <button type="submit" className="btn btn-lg btn-block btn-primary signinbutton">Update</button>
          </form>
        </div>
      </div>
    )

  }
})

module.exports=Total;
