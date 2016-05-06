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
    "loading":true,
  }
},
  componentDidMount(){
    //find card info from parse
    var currentUser = Parse.User.current();
    var self=this;
    var Event = Parse.Object.extend("Events");
    var query = new Parse.Query(Event);
    var thisDate = new Date(Date.now())
    thisDate.setDate(thisDate.getDate() - 1);
      query.equalTo("storeName", this.props.storeName);
      query.greaterThanOrEqualTo("Date", thisDate);
      query.find({
        success: function(results) {
          var newResults = results.sort(function(a,b) {
                return new Date(a.get("Date")).getTime() - new Date(b.get("Date")).getTime()
          });
            self.setState({"CurStore":newResults,"loading":false})
            self.forceUpdate();
        },
        error: function(error) {
          console.log("Server not find")
        }
    })
  },
  render:function(){
    var store = <div className="loadingContainer"><img src="images/Loading.gif" /></div>;
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
          var day = date.getUTCDate();
          var monthIndex = date.getMonth();
          var year = date.getFullYear();

          //determine day of the week
            var days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
            Date.prototype.getDayName = function() {
              return days[ this.getDay() ];
            };
            var now = new Date();

            var dayname = date.getDayName();
            if(dayname==undefined){
              dayname="Monday"
            }

          var redate = dayname + ", " + monthNames[monthIndex] + " " + day + " " + year;

          var start = item.get("startTime").split(":")
          var starthr = start[0];
          var startmin = start[1];
          var startampm = "AM"
          if(parseInt(starthr)>12){
            starthr=parseInt(starthr)-12;
            startampm="PM"
          }
          if(parseInt(starthr)==12){
              startampm="PM"
          }
          if(parseInt(starthr)==0){
            starthr=12;
            startampm="AM"
          }
          if(startmin==undefined){
            startampm=""
            starthr="???"
            startmin=""
          }

          var end = item.get("endTime").split(":")
          var endhr = end[0];
          var endmin = end[1];
          var endampm = "AM"
          if(parseInt(endhr)>12){
            endhr=parseInt(endhr)-12;
            endampm="PM"
          }
          if(parseInt(endhr)==12){
              endampm="PM"
          }
          if(parseInt(endhr)==0){
            endhr=12;
            endampm="AM"
          }
          if(endmin==undefined){
            endampm=""
            endhr="???"
            endmin=""
          }

          var time = <p>Time: {starthr + ":" + startmin + " " + startampm + " To " + endhr + ":" + endmin + " " + endampm}</p>

          return(<div key={item.id} className = "col-md-3 infoContainer">
                <h3>{item.get("Name")}</h3>
                <p>Format: {item.get("Format")}</p>
                <p>Date: {redate}</p>
                <p>{time}</p>
                <p>{item.get("Description")}</p>
          </div>)

        })
    }

    if(this.state.CurStore.length==0 && this.state.loading==false){
      store=<p>This store has no events posted.</p>
    }
      return(<div>
        <div className="headerSmall row">
          <div className="overlay"></div>
        </div>
          <h1>Events for {this.props.storeName}</h1>
          {store}
      </div>)
  }
})

module.exports=StoreSpecial;
