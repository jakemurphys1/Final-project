var React = require("react");
var ReactDOM=require("react-dom");
var Backbone = require("backbone");
var $ = require("jquery")
var Input = require("react-bootstrap/lib/Input")
var Parse = require("parse")
var LoginForm=require("./login.jsx")



var Home = React.createClass({
  getInitialState:function(){
      return {
        "currentUser":Parse.User.current(),
        "events":[],
        "specials":[],
        "stores":[],
      }
    },
  componentDidMount(){
    var self=this;
    ReactDOM.render(<LoginForm storeCollection={this.props.storeCollection} parent={self} />,document.getElementById("signFloat"))


    var Store = Parse.Object.extend("Stores");
    var storeQuery = new Parse.Query(Store);
      storeQuery.find({
        success: function(theCards){
          self.setState({"stores":theCards});
        }
      })

    //find events info from parse
    var currentUser = Parse.User.current();
    var self=this;
    var Event = Parse.Object.extend("Events");
    //calculate one week from today
    var oneMoreWeek = new Date();
    oneMoreWeek.setDate(oneMoreWeek.getDate() + 7);
    var eventQuery = new Parse.Query(Event);
        eventQuery.lessThanOrEqualTo("Date", oneMoreWeek);
      eventQuery.find({
        success: function(results) {
          var newResults = results.sort(function(a,b) {
                return new Date(a.get("Date")).getTime() - new Date(b.get("Date")).getTime()
          });
            self.setState({"events":newResults})
            self.forceUpdate();
        },
        error: function(error) {
          console.log("Event Server not find")
        }
    })


    //find specials info from parse
    var Special = Parse.Object.extend("Specials");
    var query = new Parse.Query(Special);
      query.find({
        success: function(results) {

            self.setState({"specials":results})
            self.forceUpdate();
        },
        error: function(error) {
          console.log("Event Server not find")
        }
    })
  },
  handleShowLogin:function(){
    $(".signFloat").removeClass("hidden")
    },
  handleLogin:function(){
     this.setState({"currentUser":Parse.User.current()})
  },
  handleLogOut:function(){
    Parse.User.logOut();
     this.setState({"currentUser":""})
  },
  handleEvent:function(e){
    e.preventDefault();
    var startDate = $("#startDate").val();
    var endDate=$("#endDate").val();
    Backbone.history.navigate("searchEvent/" + startDate + "_" + endDate,{trigger:true})
  },
  handleCard:function(e){
    e.preventDefault();

    var cardName = $("#buyCardName").val();
    Backbone.history.navigate("searchCard/" + cardName,{trigger:true})
  },
  handleSellCard:function(e){
    e.preventDefault();


    var cardName = $("#sellCardName").val();
    Backbone.history.navigate("sellCard/" + cardName,{trigger:true})
  },
  handleStore:function(e){
    e.preventDefault();
        Backbone.history.navigate("store/" + $("#storeName").val(),{trigger:true})
  },
  handleSpecial:function(e){
    e.preventDefault();
    Backbone.history.navigate("tagSearch/" + $("#tagSearch").val(),{trigger:true})
  },
  handleSpecificEvent:function(event){
    Backbone.history.navigate("searchSpecificEvent/" + event.id,{trigger:true})

  },
  render:function(){
      var currentUser = this.state.currentUser
      var storeSight = ""
      var self=this;

      var logContents = [<li onClick={this.handleShowLogin} id="headerUser"><a>Log In</a></li>,
        <li><a href="#signUp">Sign Up</a></li>,
        <li><a href="#register">Register Store</a></li>
      ]


      if(currentUser){

          logContents =[<li onClick={this.handleLogOut} id="headerUser"><a>Log Out</a></li>,
            <li><a href="#checkout">CheckOut</a></li>,
            <li><a href="#orders">Your Orders</a></li>]

          if(currentUser.get("hasStore")){
              logContents.push(<li><a href="#owner">Manage Store</a></li>)
          }
      }
//carousel event stuff
var eventcount=0;
var sixEvents=[];
var rannumbers = [];
var firstone = true;
var loopcount=0;

while(sixEvents.length<6 && loopcount<50){
  loopcount+=1;
  for(var i =1;i<7;i++){
    var newrand = Math.floor((Math.random() * this.state.events.length) + 1);
    rannumbers.push(newrand)
  }

  var events = this.state.events.forEach(function(thisevent){
    //check is store is approved
    var isApproved = false
    var stores = self.state.stores;
    for(var i =0;i<stores.length;i++){
      if(stores[i].get("storeName")==thisevent.get("storeName")){
        if(stores[i].get("Approved")){
          isApproved=true
        }
      }
    }

    //if this one was chosen
    var chosen = false
    for(var i =0;i<rannumbers.length;i++){

      if(eventcount==rannumbers[i]){
        chosen=true
      }
    }
    eventcount+=1;

    if(chosen && isApproved && thisevent.get("Date")>=Date.now()){

      var activeWord="";
      if(firstone){
        activeWord="active"
      }
      firstone=false;

      //reformat the date
      var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
      ];
      var date = thisevent.get("Date");
      var day = date.getUTCDate();
      var monthIndex = date.getMonth();
      var year = date.getFullYear();

      var days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
      Date.prototype.getDayName = function() {
        return days[ this.getDay() ];
      };
      var now = new Date();
      var dayname = date.getDayName();
      var redate = dayname + ", " +  monthNames[monthIndex] + " " + day + " " + year

      sixEvents.push(
        <div  key = {"event" + eventcount} className={"item " + activeWord}>
            <div key={"event" + eventcount}  onClick={self.handleSpecificEvent.bind(null,thisevent)} className="carousel-content">
                <div>
                  <h4>{thisevent.get("storeName")}</h4>
                    <p>{thisevent.get("Name")}</p>
                    <p>{redate}</p>
                </div>
            </div>
        </div>
      )
    }
  })
}



console.log("sixevents",sixEvents)

var specials = this.state.specials.map(function(thisspecial){
  var activeWord="";
  if(eventcount==1){
    activeWord="active"
  }

  //check is store is approved
  var isApproved = false
  var stores = self.state.stores;
  for(var i =0;i<stores.length;i++){

    if(stores[i].get("storeName")==thisspecial.get("storeName")){

      if(stores[i].get("Approved")){
        isApproved=true

      }
    }
  }

  if(eventcount<6){
      eventcount+=1;
    return(<div key = {thisspecial.get("specialName1") + eventcount} className={"item " + activeWord}>
          <div  className="carousel-content">
              <div>
                <h4>{thisspecial.get("storeName")}</h4>
                  <p>{thisspecial.get("specialName1")}</p>
                    <p>{thisspecial.get("specialName2")}</p>
                      <p>{thisspecial.get("specialName3")}</p>
              </div>
          </div>
      </div>

    )
  }
})

    return(
  <div className="Total">
    <div id="signFloat" className="hidden signFloat col-xs-6 col-md-3 col-md-offset-4"></div>
    <div className="header row">
      <div className="overlay"></div>
      <div className=" col-sm-8 col-sm-offset-4 col-xs-10 col-xs-offset-1 title"><img src="images/logo2.png" /></div>
    </div>
    <div className="row">
      <div className="col-xs-12 col-xs-offset-1">
      <div className="list-inline nav nav-tabs tabs">
        {logContents}
            {storeSight}
      </div>
      </div>
    </div>

<div className="row">

  <div className="infoContainer intro">
      <h3>Welcome to Gaming Local!</h3>
    <h4>Your one place for all things Magic: The gathering around the Greenville SC area.</h4>
    <p>If you are a player, search for events based on date, or specials based on tags. Need some cards? See what the stores have, send a list, and they will reply with their prices. Looking to sell cards? Send a list to a store to check what they will buy them for.</p>
    <p>If you are a store owner, please register your store and enter your events, and specials. You can also build a list of all your cards you want to sell so players know what you have and allow them to request prices from you.</p>

  </div>

</div>

<div className="row mana">
  <div className="col-xs-2 col-xs-offset-1"><img src="images/Black.gif" /></div>
    <div className="col-xs-2"><img src="images/Red.gif" /></div>
      <div className="col-xs-2"><img src="images/Green.gif" /></div>
  <div className="col-xs-2"><img src="images/White.gif" /></div>
  <div className="col-xs-2"><img src="images/Blue.gif" /></div>
</div>

    <div className="row">
      <div className="col-md-5 homeEvent home hometop infoContainer">
        <div className="row"><h2>Upcoming Events</h2></div>

      <div id="text-carousel" className="carousel slide" data-ride="carousel">
        <div className="row">
            <div className="col-xs-offset-3 col-xs-6">
                <div className="carousel-inner">
                    {sixEvents}
                </div>
            </div>
        </div>

        <a className="left carousel-control" href="#text-carousel" data-slide="prev">
            <span className="glyphicon glyphicon-chevron-left"></span>
        </a>
        <a className="right carousel-control" href="#text-carousel" data-slide="next">
            <span className="glyphicon glyphicon-chevron-right"></span>
        </a>

    </div>


          <p>Search by Date</p>
          <form id="eventDate" onSubmit={this.handleEvent} action="" className="form-events">
              <div className="col-xs-6">
                <label>StartDate</label>
                  <p><input id="startDate" className="dateHolder" type="date" name="startDate" placeholder="Start Date"/></p>
              </div>
              <div className="col-xs-6">
                <label>EndDate</label>
                  <p><input id="endDate" type="date" name="endDate" className="dateHolder" placeholder="End Date"/></p>
              </div>
                  <p><button className="btn btn-primary Search">Search</button></p>
          </form>
      </div>

      <div className="col-md-5 homeSpecials home hometop infoContainer">
        <div className="row"><h2>Specials</h2></div>
          <div id="text-carousel" className="carousel slide" data-ride="carousel">
            <div className="row">
                <div className="col-xs-offset-3 col-xs-6">
                    <div className="carousel-inner">
                        {specials}
                    </div>
                </div>
            </div>

            <a className="left carousel-control" href="#text-carousel" data-slide="prev">
                <span className="glyphicon glyphicon-chevron-left"></span>
            </a>
            <a className="right carousel-control" href="#text-carousel" data-slide="next">
                <span className="glyphicon glyphicon-chevron-right"></span>
            </a>

        </div>
          <p>Search by Tags</p>
          <form onSubmit={this.handleSpecial} id="cardSearch" action="" className="form-events">
                  <input id="tagSearch" type="text" name="cardName" placeholder="Keyword to search"/>
                  <p><button className="btn btn-primary Search">Search</button></p>
          </form>
          <a href="#specials">See all specials</a>
      </div>
    </div>

    <div className="row">
      <div className="col-md-5 homeCards home homebottom infoContainer">
        <h2>Store Pricing</h2>
        <div className="row">
          <div className="col-sm-6 col-xs-12">
            <div className="row"><h4>Check store prices for buying cards</h4></div>
              <form onSubmit={this.handleCard} id="cardSearch" action="" className="form-events">
                      <input id="buyCardName" type="text" name="cardName" placeholder="Name of Card"/>
                      <p><button className="btn btn-primary Search">Search</button></p>
              </form>
          </div>
          <div className="col-sm-6 col-xs-12"><h4>Check store prices for selling your cards</h4>
              <p><button onClick={this.handleSellCard} className="btn btn-primary Search">Build List</button></p>
          </div>
        </div>




      </div>

      <div className="col-md-5 homeStores home homebottom infoContainer">
        <div className="row"><h2>Search for Stores near you!</h2></div>
          <p>Search by Name</p>
        <form onSubmit={this.handleStore} id="storeSearch" action="" className="form-events">
                <input id="storeName" type="text" name="storeName" placeholder="Name of Store"/>
                <p><button className="btn btn-primary Search">Search</button></p>
        </form>
        <div><a href="#allStores">View all Stores</a></div>
      </div>
    </div>

    <div className="footer row">
    <p>This website was created and is maintained by Jake Murphy</p>
    <p>Contact him for any web development and design jobs</p>
    <p>jakemurphys1@gmail.com</p>
    <p><a href="http://jakemurphywebdesigner.com/">jakemurphywebdesigner.com</a></p>
    <div>Logo made by <a href="http://logotypemaker.com" title="Free Logo Maker">LogotypeMaker.com</a> | licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC BY 3.0</a></div>
      </div>
  </div>
)
  },
})

module.exports=Home;
