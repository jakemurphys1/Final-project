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
          var userData={"username":$("#signupUsername").val(),"password":$("#signupPassword1").val(),"Fname":$("#signupFname").val(),
                      "Lname":$("#signupLname").val(),"PersonalEmail":$("#signupEmail").val(),"Zip":$("#signupZip").val(),"hasStore":false}


        user.set(userData);

        user.signUp(null, {
          'success':function(results){
            var currentUser = Parse.User.current();
            currentUser.set('username', $('#signupUsername').val());
            currentUser.save();
            //go back to home
            Backbone.history.navigate("#home",{trigger:true})
          }
                  });

        },
  render:function(){
      return(<div>
        <div className="headerSmall row">
          <div className="overlay"></div>
        </div>
        <div className="row infoContainer">

          <div className="row Header">
            <h1>Signup</h1>
          </div>

          <div className="col-xs-8 col-xs-offset-2">
                <form onSubmit={this.handleSignup} id="signin" action="" className="form-login">
                          <label>User Information</label>
                            <div className="row"><input id="signupFname" type="text" name="Fname" className="input" placeholder="First Name"/></div>
                            <div className="row"><input id="signupLname" type="text" name="Lname" className="input" placeholder="Last Name"/></div>
                            <div className="row"><input id="signupUsername" type="text" name="Username" className="input" placeholder="Username"/></div>
                            <div className="row"><input id="signupEmail" type="email" name="signupEmail" className="input" placeholder="Email"/></div>
                            <div className="row"><input id="signupZip" type="text" name="signupZip" className="input" placeholder="Zip Code"/></div>
                            <div className="row"><input id="signupPassword1" type="password" name="password1" className="input" placeholder="Password"/></div>
                            <div className="row"><input id="signupPassword2" type="password" name="password2" className="input" placeholder="Confirm Password"/></div>
                      <button type="submit" className="btn btn-lg btn-block btn-primary signinbutton">Sign Up</button>
            </form>
          </div>
        </div>
      </div>
      )
  },
})

module.exports=SignUp;
