var React = require("react");
var ReactDOM=require("react-dom");
var Backbone = require("backbone");
var $ = require("jquery");
var Input = require("react-bootstrap/lib/Input");
var Parse = require("parse");




var Change = React.createClass({

  render:function(){
      return(

        <div className="row infoContainer">

          <div className="col-xs-8 col-xs-offset-2">
                <form onSubmit={this.handleUpdate} id="signin" action="" className="form-login">
                          <label>Change Password</label>
                            <div className="row"><input id="signupFname" type="text" name="Fname" className="input" placeholder="New Password"/></div>
                            <div className="row"><input id="signupLname" type="text" name="Lname" className="input" placeholder="Confirm New Password"/></div>
                      <button type="submit" className="btn btn-lg btn-block btn-primary signinbutton">Update</button>
            </form>
          </div>
        </div>
      )
  },
})

module.exports=Change;
