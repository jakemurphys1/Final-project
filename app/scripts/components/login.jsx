var React = require("react");
var ReactDOM=require("react-dom");
var Backbone = require("backbone");
var $ = require("jquery")
var Input = require("react-bootstrap/lib/Input")
var Parse = require("parse")



var SignUp = React.createClass({
  componentDidMount:function(){
    Parse.initialize("GLID");
    Parse.serverURL = 'http://gaminglocal.herokuapp.com'
  },
  handleExit:function(){
    $(".signFloat").addClass("hidden");
  },
  login:function(e){
    e.preventDefault();
    Parse.User.logIn($("#loginEmail").val(), $("#loginPassword").val(), {
      success: function(user) {
        console.log("You logged in as ", $("#loginEmail").val())
        var currentUser = Parse.User.current();
        currentUser.set('username', $("#loginEmail").val());
        currentUser.save();
      },
      error: function(user, error) {
        console.log("You failed to log in as ",user,error)
      }
    });
    $(".signFloat").addClass("hidden");

  },
  render:function(){
console.log("here")
    return(
      <div className="TotalSignup row">
        <div className="row heading">Login</div>
          <div className="row">
            <div className="col-md-6 col-xs-offset-1">
                <form onSubmit={this.login} id="login" action="" className="form-login">
                    <h2>Please Sign In</h2>
                    <input id="loginEmail" type="text" name="email" placeholder="Username"/>
                    <input id="loginPassword" type="password" name="password" placeholder="Password"/>
                    <button type="submit" className="btn btn-lg btn-block btn-primary">Login</button>
                </form>
                </div>
              </div>
          <button onClick={this.handleExit} className="btn btn-secondary">Exit</button>
    </div>
    )

  }
})

module.exports=SignUp;
