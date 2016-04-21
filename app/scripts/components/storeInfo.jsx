var React = require("react");
var ReactDOM=require("react-dom");
var Backbone = require("backbone");
var $ = require("jquery")
var Input = require("react-bootstrap/lib/Input")
var Parse = require("parse")

var StoreInfo= React.createClass({
  getInitialState:function(){
  return {
    "CurUser":[],
  }
},
  componentDidMount(){
    //find card info from parse
    var currentUser = Parse.User.current();
    var self=this;
    var Info = Parse.Object.extend("Stores");
    var query = new Parse.Query(Info);
      query.equalTo("storeName", this.props.storeName);
      query.find({
        success: function(results) {
            self.setState({"CurUser":results})
            self.forceUpdate();
        },
        error: function(error) {
          console.log("Server not find")
        }
    })
  },
  render:function(){
    var store = <p>Loading</p>;

    if(this.state.CurUser.length>0){
      var name = this.state.CurUser[0];
      store=(<div className="storeInfo">
        <h1>{name.get("storeName")}</h1>
          <div className="row">
            <div className="col-md-6">
              <p><b>Address:</b></p>
              <p>{name.get("address")}</p> <p>{name.get("city")}, {name.get("state")} {name.get("zip")}</p>
            </div>
            <div className="col-md-6">
              <p><b>Phone Number:</b></p>
              <p>{name.get("phone")}</p>
                <p><b>Email:</b></p>
                <p>{name.get("email")}</p>
                  <p><b>Website:</b></p>
                  <p>{name.get("website")}</p>
            </div>
          </div>
          <div className="row">
            <p><b>Hours of Operation:</b></p>
          </div>
          <div className="row hourOperation">
            <div className="col-md-6">
              <p>Monday: {name.get("Mon")}</p>
              <p>Tuesday: {name.get("Tues")}</p>
              <p>Wednesday: {name.get("Wed")}</p>
              <p>Thursday: {name.get("Thur")}</p>
            </div>
            <div className="col-md-6">
              <p>Friday: {name.get("Fri")}</p>
              <p>Saturday: {name.get("Sat")}</p>
              <p>Sunday: {name.get("Sun")}</p>
            </div>

          </div>

        </div>)

    }
      return(<div>
      <div className="headerSmall row">
        <div className="overlay"></div>
      </div>
        <div className="infoContainer">
          {store}
      </div>
      </div>)
  }
})

module.exports=StoreInfo;
