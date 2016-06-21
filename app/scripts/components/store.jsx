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
    "Support":[],
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
  getInitialState:function(){
  return {
    "Id":"hi",
    "Supporting":[],
    "doesSupport":false,
    "supporters":0,
  }
},
  handleSupport:function(){
          var currentUser = Parse.User.current();
                var self = this;
          var supported = {
            "userName":currentUser.getUsername(),
            "store":this.state.Id,
          }

          var Supports = Parse.Object.extend("Supported");
          var supports = new Supports();

          supports.save(supported).then(function(object) {
              console.log(object)
              self.setState({"doesSupport":true})
                console.log("supporters1", self.state.supporters)
              self.setState({"supporters":self.state.supporters + 1})
              console.log("supporters2", self.state.supporters)
          })
        },
  handleUnSupport:function(e){
      console.log("deleted")
      var self = this;
            var currentUser = Parse.User.current();
      var curId= e.currentTarget.id;
      var EventBase = Parse.Object.extend("Supported");
      var query = new Parse.Query(EventBase);
            query.equalTo("store", curId);
            query.equalTo("userName", currentUser.getUsername());
      query.find({
        success: function(myObj) {
          Parse.Object.destroyAll(myObj);
              self.setState({"doesSupport":false})
                self.setState({"supporters":self.state.supporters - 1})
        },
        error: function(object, error) {
        }
      });
    },
  componentDidMount:function(){
    this.setState({"Id":this.props.item.get("storeName")})
    var currentUser = Parse.User.current();
    var self=this;

    var Supports = Parse.Object.extend("Supported");
    var query = new Parse.Query(Supports);
    var supportCount = 0;
    //  query.equalTo("userName", currentUser.getUsername());
      query.find({
        success: function(results) {
            self.setState({"Supporting":results})
            results.map(function(item){
                if(item.get("store")==self.props.item.get("storeName")){
                  supportCount+=1;
                }

              if(item.get("store")==self.props.item.get("storeName") && item.get("userName")==currentUser.getUsername()){
                console.log("success")
                self.setState({"doesSupport":true})
              }
            })
            self.setState({"supporters":supportCount})
        },
        error: function(error) {
          console.log("Server not find")
        }
    })
  },
  render:function(){
    var supportButton = "support";
    var supportText = "Support";
    var supportOrUn=this.handleSupport;
    var self = this;
if(this.state.doesSupport){
  supportButton = "supported";
  supportText = "Supported";
  supportOrUn=self.handleUnSupport;
}
    return(
      <div key={this.props.item.get("storeName")} className="col-md-3 col-sm-6 col-xs-12 infoContainer">
              <h2>{this.props.item.get("storeName")}:</h2>
              <p><a href ={"#storeInfo/" + this.props.item.get("storeName")}>Learn more about {this.props.item.get("storeName")}</a></p>
                <p><a href ={"#storeEvent/" + this.props.item.get("storeName")}>See Events</a></p>
                <p><a href={"#storeSpecial/" + this.props.item.get("storeName")}>See Specials</a></p>
                <p><a href ={"#storeCard/" + this.props.item.get("storeName")}>See Cards for Sale</a></p>
                <div className="row">
                  <p onClick = {supportOrUn} id={this.props.item.get("storeName")} className={supportButton}><button>{supportText}</button></p>
                </div>
                  <div className="row">
              <p className="Players">Supporting Players: {this.state.supporters}</p>
              </div>
            </div>
    )
  },
})

module.exports=AllStores;
