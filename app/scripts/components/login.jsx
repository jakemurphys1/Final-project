var React = require("react");
var ReactDOM=require("react-dom");
var Backbone = require("backbone");
var $ = require("jquery")
var Input = require("react-bootstrap/lib/Input")
var Parse = require("parse")




var SignUp = React.createClass({
  getInitialState:function(){
      return {
        "forgotPassword":"",
        "forgotUsername":"",
        "bottomMessage":"",
      }
    },
  handleExit:function(){
    $(".signFloat").addClass("hidden");
  },
  login:function(e){
    e.preventDefault();
    var self = this;
    Parse.User.logIn($("#loginEmail").val(), $("#loginPassword").val(), {
      success: function(user) {

        self.props.parent.handleLogin();
        console.log("You logged in as ", $("#loginEmail").val())
        var currentUser = Parse.User.current();
        currentUser.set('username', $("#loginEmail").val());
        currentUser.save();
    $(".signFloat").addClass("hidden");
        self.setState({"bottomMessage":""})
      },
      error: function(user, error) {
        self.setState({"bottomMessage":<p>You failed to log in</p>})
        console.log("You failed to log in as ",user,error)
      }
    });


  },
  sendUsername:function(e){
    e.preventDefault();
    var email = $("#Email").val();
    var emailOnFile=false
    var self=this;

    var User = Parse.Object.extend("User");
    var query = new Parse.Query(User);
    query.equalTo("PersonalEmail", email);
    query.find({
    success: function(results) {
      if(results.length==0){
        self.setState({"bottomMessage":<p>No user with that email is on file.</p>})
      }
      if(results.length>0){
              self.setState({"bottomMessage":<p>Your username is <b>{results[0].get("username")}</b></p>})

      }


    }
    })
    },

sendPassword:function(e){
      e.preventDefault();
      var email = $("#Email").val();
      var username="";
      var self=this;

      var User = Parse.Object.extend("User");
      var query = new Parse.Query(User);
    query.equalTo("PersonalEmail", email);
    query.first({
      success: function(results) {
        if(results){
          username=results.get("username")
                self.setState({"bottomMessage":<p>An email has been sent to reset your password.</p>})


          //mail gun stuff


            var data = {
              from: 'Excited User <me@samples.mailgun.org>',
              to: 'serobnic@mail.ru',
              subject: 'Hello',
              text: 'Testing some Mailgun awesomness!'
            };

            mailgun.messages().send(data, function (error, body) {
              console.log(body);
            });


        }else{
          self.setState({"bottomMessage":<p>No user with that email is on file.</p>})
        }

      },
    error:function(results, error){

    }

  })

  },
  handlePassword:function(e){
    e.preventDefault()
      this.setState({"forgotPassword":<div className="row">
          <div className="col-xs-6 col-xs-offset-1">
            <h4>Contact Admin to change password.</h4>
          </div>
      </div>})
  },
  handleUsername:function(e){
    e.preventDefault()
      this.setState({"forgotUsername":<div className="row">
        <div className="col-md-6 col-xs-offset-1">
          <form onSubmit={this.sendUsername} id="login" action="" className="form-login">
              <h4>Enter your email address below</h4>
              <input id="Email" type="text" name="email" placeholder="Email address"/>
                      <button type="submit" className="btn btn-lg btn-block btn-primary">Send</button>
          </form>

          </div>
      </div>})
  },
  render:function(){
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
              <div className="row bottom">
                <div className="col-xs-8"><a onClick={this.handleUsername} href="">Forgot Username?</a><p><a onClick={this.handlePassword} href="">Forgot Password?</a></p></div>
          <div className="col-xs-4"><span><button onClick={this.handleExit} className="btn btn-secondary">Exit</button></span></div>
            {this.state.forgotUsername}
            {this.state.forgotPassword}
              <div className="col-md-6 col-xs-offset-1">
                    {this.state.bottomMessage}
              </div>

              </div>

    </div>
    )

  }
})

module.exports=SignUp;
