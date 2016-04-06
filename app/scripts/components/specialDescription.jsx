var React = require("react");
var ReactDOM=require("react-dom");
var Backbone = require("backbone");
var $ = require("jquery")
var Input = require("react-bootstrap/lib/Input")
var Parse = require("parse")
var LoginForm=require("./login.jsx")

var Description = React.createClass({
  getInitialState:function(){
  return {
    "results":[],
  }
},
  componentDidMount:function(){
  var currentUser = Parse.User.current();
  //find card info from parse
  var currentUser = Parse.User.current();
  var self=this;
  var Specials = Parse.Object.extend("Specials");
  var query = new Parse.Query(Specials);
      query.equalTo("objectId", this.props.curId);
    query.find({
      success: function(results) {
self.setState({"results":results})
      }
    })
  },
  render:function(){
    var insert = "";
    var name=""
    if(this.state.results.length>0){
      name=this.state.results[0].get("specialName" + this.props.specialNum)
      insert = this.state.results[0].get("specialDescription" + this.props.specialNum)
    }
  return(<div className="row infoContainer specialDescription">
          <h2>{name}</h2>
          <div className="col-md-6 col-md-offset-3">
            <p>{insert}</p>
          </div>
        </div>
        )
  },
})

module.exports=Description;
