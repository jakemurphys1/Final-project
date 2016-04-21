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
  var Users = Parse.Object.extend("Stores");
  var query = new Parse.Query(Users);
    query.find({
      success: function(results) {
          self.setState({"Users":results})
      }
    })
  },
  render:function(){
    var storeName = this.props.storeName.toLowerCase();
    var self=this;
  var allStores=<div className="loadingContainer"><img src="images/Loading.gif" /></div>
  if(this.state.Users.length>0){
    var allStores= this.state.Users.map(function(item){

      if(item.get("Approved") && (storeName=="" || storeName== item.get("storeName").toLowerCase())){

        return(<PerStore item={item} key = {item.get("storeName")} />)
      }
    });
  }


    return(
      <div className="row">
        <div className="headerSmall row">
          <div className="overlay"></div>
        </div>
      <h1>All Registered Stores:</h1>
      <div>{allStores}</div>
      </div>
    )
  }
})

var PerStore = React.createClass({
  render:function(){
    return(
      <div key={this.props.item.get("storeName")} className="col-md-3 col-sm-6 col-xs-12 infoContainer">
              <h2>{this.props.item.get("storeName")}:</h2>
              <p><a href ={"#storeInfo/" + this.props.item.get("storeName")}>Learn more about {this.props.item.get("storeName")}</a></p>
                <p><a href ={"#storeEvent/" + this.props.item.get("storeName")}>See Events</a></p>
                <p><a href={"#storeSpecial/" + this.props.item.get("storeName")}>See Specials</a></p>
                <p><a href ={"#storeCard/" + this.props.item.get("storeName")}>See Cards for Sale</a></p>
            </div>
    )
  },
})

module.exports=AllStores;
