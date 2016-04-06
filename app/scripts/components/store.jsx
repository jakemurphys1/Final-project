var React = require("react");
var ReactDOM=require("react-dom");
var Backbone = require("backbone");
var $ = require("jquery")
var Input = require("react-bootstrap/lib/Input")
var Parse = require("parse")

var AllStores = React.createClass({
  getInitialState:function(){
  return {
    "Users":[],
  }
},
  componentDidMount:function(){
  //find card info from parse
  var currentUser = Parse.User.current();
  var self=this;
  var Users = Parse.Object.extend("User");
  var query = new Parse.Query(Users);
    query.find({
      success: function(results) {
        console.log("got here")
        console.log("results",results)
          self.setState({"Users":results})
      }
    })
  },
  render:function(){
var allStores= this.state.Users.map(function(item){
  console.log(item)
    if(item.get("storeName")){
      return(<div key={item.get("storeName")} className="col-md-3 col-sm-6 col-xs-12 infoContainer">
              <h2>{item.get("storeName")}:</h2>
              <p>Learn more about {item.get("storeName")}</p>
                <p>See Events</p>
                <p>See Specials</p>
                <p>See Cards for Sale</p>
            </div>
      )
    }

})
    return(
      <div className="row">
      <h1>All Registered Stores:</h1>
      <div>{allStores}</div>
      </div>
    )
  }
})

module.exports=AllStores;
