var React = require("react");
var ReactDOM=require("react-dom");
var Backbone = require("backbone");
var $ = require("jquery")
var Input = require("react-bootstrap/lib/Input")
var Parse = require("parse")
var LoginForm=require("./login.jsx")

var searchSpecial = React.createClass({
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
    self=this;
var allSpecials = this.state.specialList.map(function(item){
  //check is store is Approved
  var isApproved = false
 var stores = self.props.storeCollection
  for(var i =0;i<stores.length;i++){
    //  console.log(stores[i].get("storeName"))
    if(stores[i].get("storeName")==item.get("storeName")){
      if(stores[i].get("Approved")){
        isApproved=true
      }
    }
  }


    var All = [];
    for(var i =1;i<4;i++){
      if(item.get("specialName" + i)!=""){
        All.push(<p key={item.id + i}>{item.get("specialName" + i)}<a href = {"#specialDescription/" + item.id + "_" + i}>  More Info</a></p>)
      }
    }

    if(item.get("storeName") && isApproved){
      return(<div key={item.get("storeName")} className="col-md-3 col-sm-6 col-xs-12 infoContainer">
              <h2>{item.get("storeName")}:</h2>
              {All}
        </div>
      )
    }

})
if(allSpecials.length==0){
  allSpecials=<div className="loadingContainer"><img src="images/Loading.gif" /></div>
}
    return(
      <div className="row">
        <div className="headerSmall row">
          <div className="overlay"></div>
        </div>
      <h1>All current Specials:</h1>
      <div>{allSpecials}</div>
      </div>
    )
  }
})

module.exports=searchSpecial;
