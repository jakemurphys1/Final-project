var React = require("react");
var ReactDOM=require("react-dom");
var Backbone = require("backbone");
var $ = require("jquery")
var Input = require("react-bootstrap/lib/Input")
var Parse = require("parse")
var LoginForm=require("./login.jsx")



var Home = React.createClass({
  componentDidMount(){
    var self=this;
    ReactDOM.render(<LoginForm parent={self} />,document.getElementById("signFloat"))
  },
  getInitialState:function(){
      return {
        "currentUser":Parse.User.current(),
      }
},
  handleShowLogin:function(){
    $(".signFloat").removeClass("hidden")
    },
  handleLogin:function(){
    console.log(Parse.User.current())
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
    var cardName = $("#cardName").val();
    console.log($("#cardName").val())
    Backbone.history.navigate("searchCard/" + cardName,{trigger:true})
  },
  handleStore:function(e){
    e.preventDefault();
        Backbone.history.navigate("store/" + $("#storeName").val(),{trigger:true})
  },
  render:function(){
      var currentUser = this.state.currentUser
      var storeSight = ""
      var logContents = <span onClick={this.handleShowLogin} id="headerUser">Log In</span>
      if(currentUser!=""){
          logContents =<span onClick={this.handleLogOut} id="headerUser">Log Out</span>
          storeSight = <span><a href="#owner">Manage Store</a></span>
      }
    return(
  <div className="Total">
    <div id="signFloat" className="hidden signFloat col-xs-6 col-md-3 col-md-offset-4"></div>
    <div className="header row">
      <h1>Gaming Local</h1>
      <div className="logIn">
        {logContents}
        <span>Sign Up</span>
        <span><a href="#register">Register Store</a></span>
        {storeSight}
      </div>
    </div>

    <div className="row">
      <div className="col-md-5 homeEvent home infoContainer">
        <div className="row"><h2>Events</h2></div>
          <p>Search by Date</p>
          <form id="eventDate" onSubmit={this.handleEvent} action="" className="form-events">
              <div className="col-xs-6">
                <label>StartDate</label>
                  <p><input id="startDate" type="date" name="startDate" placeholder="Start Date"/></p>
              </div>
              <div className="col-xs-6">
                <label>EndDate</label>
                  <p><input id="endDate" type="date" name="endDate" placeholder="End Date"/></p>
              </div>
                  <p><button className="btn btn-primary Search">Search</button></p>
          </form>
      </div>

      <div className="col-md-5 homeSpecials home infoContainer">
        <div className="row"><h2>Specials</h2></div>
          <p>Search by Tags</p>
          <form onSubmit={this.handleSpecial} id="cardSearch" action="" className="form-events">
                  <input id="tagSearch" type="text" name="cardName" placeholder="Keyword to search"/>
                  <p><button className="btn btn-primary Search">Search</button></p>
          </form>
          <a href="#specials">See all specials</a>
      </div>
    </div>

    <div className="row">
      <div className="col-md-5 homeCards home infoContainer">
        <div className="row"><h2>Cards for Sale</h2></div>
          <p>Search by Name</p>
          <form onSubmit={this.handleCard} id="cardSearch" action="" className="form-events">
                  <input id="cardName" type="text" name="cardName" placeholder="Name of Card"/>
                  <p><button className="btn btn-primary Search">Search</button></p>
          </form>
      </div>

      <div className="col-md-5 homeStores home infoContainer">
        <div className="row"><h2>Search for Stores near you!</h2></div>
          <p>Search by Name</p>
        <form onSubmit={this.handleStore} id="storeSearch" action="" className="form-events">
                <input id="storeName" type="text" name="storeName" placeholder="Name of Store"/>
                <p><button className="btn btn-primary Search">Search</button></p>
        </form>
        <div><a href="#allStores">View all Stores</a></div>
      </div>
    </div>
  </div>
)
  },
})

module.exports=Home;
