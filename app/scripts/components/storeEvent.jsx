var React = require("react");
var ReactDOM=require("react-dom");
var Backbone = require("backbone");
var $ = require("jquery")
var Input = require("react-bootstrap/lib/Input")
var Parse = require("parse")

var StoreSpecial= React.createClass({
  getInitialState:function(){
  return {
    "CurStore":[],
  }
},
  componentDidMount(){
    //find card info from parse
    var currentUser = Parse.User.current();
    var self=this;
    var Event = Parse.Object.extend("Events");
    var query = new Parse.Query(Event);
      query.equalTo("storeName", this.props.storeName);
      query.find({
        success: function(results) {
            self.setState({"CurStore":results})
            self.forceUpdate();
        },
        error: function(error) {
          console.log("Server not find")
        }
    })
  },
  render:function(){
    var store = <p>Loading</p>;
    if(this.state.CurStore.length>0){
        store=this.state.CurStore.map(function(item){
          //reformat the date
          var monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
          ];
          var date = item.get("Date");
          var day = date.getDate();
          var monthIndex = date.getMonth();
          var year = date.getFullYear();
          var redate = monthNames[monthIndex] + " " + day + " " + year
          return(<div key={item.id} className = "col-md-3 infoContainer">
                <h3>{item.get("Name")}</h3>
                <p>Format: {item.get("Format")}</p>
                <p>Date: {redate}</p>
                <p>From {item.get("startTime")} to {item.get("endTime")}</p>
                <p>{item.get("Description")}</p>
          </div>)
        })
    }
      return(<div>
          <h1>Events for {this.props.storeName}</h1>
          {store}
      </div>)
  }
})

module.exports=StoreSpecial;
