var React = require("react");
var ReactDOM=require("react-dom");
var Backbone = require("backbone");
var $ = require("jquery")
var Input = require("react-bootstrap/lib/Input")
var Parse = require("parse")
var LoginForm=require("./login.jsx")

var searchTag = React.createClass({
  getInitialState:function(){
  return {
    "specialList":[],
  }
},
  componentDidMount:function(){
  //find card info from parse
  var currentUser = Parse.User.current();
  var self=this;
  var Specials = Parse.Object.extend("Specials");
  var query = new Parse.Query(Specials);
    query.find({
      success: function(results) {
          self.setState({"specialList":results})
      }
    })
  },
  render:function(){
      var All = [];
this.state.specialList.forEach(function(item){
    for(var i =1;i<4;i++){
      if(item.get("specialName" + i)!="" && item.get("tags" + i).includes(this.props.searchTerm)){
        All.push(<p key={item.id + i}><b>{item.get("specialName" + i)}</b> from {item.get("storeName")}<a href = {"#specialDescription/" + item.id + "_" + i}>  More Info</a></p>)
      }
    }

}.bind(this))

    return(<div>
      <div className="headerSmall row">
        <div className="overlay"></div>
      </div>
      <div className="row infoContainer searchTag">
      <h2>All Specials with the tag(s): {this.props.searchTerm}</h2>
      <div className="tagContainer">{All}</div>
      </div>
    </div>

    )
  }
})

module.exports=searchTag;
