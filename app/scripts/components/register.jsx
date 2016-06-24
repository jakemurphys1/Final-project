var React = require("react");
var ReactDOM=require("react-dom");
var Backbone = require("backbone");
var $ = require("jquery");
var Input = require("react-bootstrap/lib/Input");
var Parse = require("parse");




var SignUp = React.createClass({
  handleSignup:function(event){

      event.preventDefault();
      var user = new Parse.User();

      if($("#signupPassword1").val()!=$("#signupPassword2").val()){
        alert("Your passwords did not match.")
        return;
      }
      var uniqueStoreName=this.props.storeCollection
      for(var i =0;i<uniqueStoreName.length;i++){
        if($("#signupStoreName").val()==uniqueStoreName[i].get("storeName")){
          alert("That store name has already been taken, please use another.")
          return
        }
        if($("#signupUsername").val()==uniqueStoreName[i].get("username")){
          alert("That username has already been taken, please use another.")
          return
        }

      }

          var $form = $(this);
          var userData={"username":$("#signupUsername").val(),"password":$("#signupPassword1").val(),"Fname":$("#signupFname").val(),
                      "Lname":$("#signupLname").val(),"storeName":$("#signupStoreName").val(),"Zip":$("#addressZip").val(),"hasStore":true,"PersonalEmail":$("#signupEmail").val(),}


        user.set(userData);

        user.signUp(null, {
          'success':function(results){
            console.log("results: ",results)
            var currentUser = Parse.User.current();
            currentUser.set('username', $('#signupUsername').val());
            currentUser.save();
            console.log("CurrentUser",currentUser.getUsername())

            //store null values for the Specials
            var specialList={
              "specialName1": "",
              "specialDescription1":"",
              "tags1":"",
              "specialName2":"",
              "specialDescription2":"",
              "tags2":"",
              "specialName3": "",
              "specialDescription3":"",
              "tags3":"",
              "date":Date.now(),
              "userName":currentUser.getUsername(),
            }
            var Specials = Parse.Object.extend("Specials");
            var specials = new Specials();
            specials.save(specialList).then(function(object) {
                console.log(object)
            })

            //set store info
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
            var storeData = {"email":$("#signupEmail").val(),"storeName":$("#signupStoreName").val(),"address":$("#addressStreet").val(),"PersonalEmail":$("#signupEmail").val(),
                      "city":$("#addressCity").val(),"state":$("#addressState").val(),"zip":$("#addressZip").val(),"phone":$("#signupPhone").val(),"website":$("#signupWebsite").val(),
                      "Mon":Monday,"Tues":Tuesday,"Wed":Wednesday,"Thur":Thursday,"Fri":Friday,"Sat":Saturday,"Sun":Sunday,"Approved":false,"username":$("#signupUsername").val()};
            var Stores = Parse.Object.extend("Stores");
            var stores = new Stores();
            stores.save(storeData).then(function(object) {
                console.log(object)
                //go back to home
                Backbone.history.navigate("#home",{trigger:true})
            })


          },
          "error": function(user,error){
            console.log("error",user,error);
          }
        });




        },
  render:function(){
      return(
        <div>
          <div className="headerSmall row">
            <div className="overlay"></div>
          </div>
          <div className="row infoContainer">

            <div className="row Header">
              <h1>Store Owner Signup</h1>
            </div>

            <div className="col-xs-8 col-xs-offset-2">
                  <form onSubmit={this.handleSignup} id="signin" action="" className="form-login">
                  <div className="row">
                          <div className="col-md-6">
                            <label>User Information</label>
                              <div className="row"><input id="signupFname" type="text" name="Fname" className="input" placeholder="First Name"/></div>
                              <div className="row"><input id="signupLname" type="text" name="Lname" className="input" placeholder="Last Name"/></div>
                              <div className="row"><input id="signupUsername" type="text" name="Username" className="input" placeholder="Username"/></div>
                              <div className="row"><input id="signupEmail" type="text" name="signupEmail" className="input" placeholder="Personal Email"/></div>
                              <div className="row"><input id="signupPassword1" type="password" name="password1" className="input" placeholder="Password"/></div>
                              <div className="row"><input id="signupPassword2" type="password" name="password2" className="input" placeholder="Confirm Password"/></div>

                          </div>
                          <div className="col-md-6">
                            <label>Address of Store</label>
                              <div className="row"><input id="addressStreet" type="text" name="addressStreet" className="input" placeholder="Street Address"/></div>
                              <div className="row"><input id="addressCity" type="text" name="addressCity" className="input" placeholder="City"/></div>
                              <div className="row"><input id="addressState" type="text" name="addressState" className="input" placeholder="State"/></div>
                              <div className="row"><input id="addressZip" type="text" name="addressZip" className="input" placeholder="Zip Code"/></div>
                          </div>
                        </div>
                          <div className="row">
                            <div className="col-md-6">
                                <label>Store Information</label>
                                <div className="row"><input id="signupStoreName" type="text" name="storeName" className="input" placeholder="Name of Store"/></div>
                                <div className="row"><input id="signupEmail" type="email" name="email" className="input" placeholder="Email for Store"/></div>
                                <div className="row"><input id="signupPhone" type="text" name="phone" className="input" placeholder="Phone Number for Store"/></div>
                                <div className="row"><input id="signupWebsite" type="text" name="website" className="input" placeholder="Website for Store"/></div>
                            </div>
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



                        <button type="submit" className="btn btn-lg btn-block btn-primary signinbutton">Sign Up</button>
              </form>
            </div>
          </div>
        </div>

      )
  },
})

module.exports=SignUp;
