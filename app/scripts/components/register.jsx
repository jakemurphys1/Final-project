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

          var $form = $(this);
          var data = {"username":$("#signupUsername").val(),"password":$("#signupPassword1").val(),"Fname":$("#signupFname").val(),
                      "Lname":$("#signupLname").val(),"email":$("#signupEmail").val(),"storeName":$("#signupStoreName").val(),"address":$("#addressStreet").val(),
                    "city":$("#addressCity").val(),"state":$("#addressState").val(),"zip":$("#addressZip").val(),"isStore":true};
        user.set(data);

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
            Backbone.history.navigate("home",{trigger:true})
          },
          "error": function(user,error){
            console.log("error",user,error);
          }
        });




        },
  render:function(){
      return(

        <div className="row infoContainer">
          <div className="row Header">
            <h1>Store Owner Signup</h1>
          </div>
          <div className="col-xs-6 col-xs-offset-3">
          <form onSubmit={this.handleSignup} id="signin" action="" className="form-login">
                      <div className="row"><h2>Sign up</h2></div>
                      <div className="row">
                        <div className="col-md-6">
                          <label>Information</label>
                            <div className="row"><input id="signupFname" type="text" name="Fname" placeholder="First Name"/></div>
                            <div className="row"><input id="signupLname" type="text" name="Lname" placeholder="Last Name"/></div>
                            <div className="row"><input id="signupUsername" type="text" name="Username" placeholder="Username"/></div>
                            <div className="row"><input id="signupEmail" type="text" name="email" placeholder="Email"/></div>
                            <div className="row"><input id="signupStoreName" type="text" name="storeName" placeholder="Name of Store"/></div>
                        </div>
                        <div className="col-md-6">
                          <label>Address</label>
                            <div className="row"><input id="addressStreet" type="text" name="addressStreet" placeholder="Street Address"/></div>
                            <div className="row"><input id="addressCity" type="text" name="addressCity" placeholder="City"/></div>
                            <div className="row"><input id="addressState" type="text" name="addressState" placeholder="State"/></div>
                            <div className="row"><input id="addressZip" type="text" name="addressZip" placeholder="Zip Code"/></div>
                        </div>
                      <div className="col-md-6">
                        <div className="row"><input id="signupPassword1" type="password" name="password1" placeholder="Password"/></div>
                        <div className="row"><input id="signupPassword2" type="password" name="password2" placeholder="Confirm Password"/></div>
                      </div>
                    </div>


                      <button type="submit" className="btn btn-lg btn-block btn-primary signinbutton">Sign Up</button>
            </form>
          </div>
        </div>
      )
  },
})

module.exports=SignUp;
