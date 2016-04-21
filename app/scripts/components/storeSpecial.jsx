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
    var Special = Parse.Object.extend("Specials");
    var query = new Parse.Query(Special);
      query.equalTo("storeName", this.props.storeName);
      query.find({
        success: function(results) {
            self.setState({"CurStore":results,"loading":false})
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
      var name = this.state.CurStore[0];
      store=(<div>
        <h1>Specials for {name.get("storeName")}</h1>
        <div className = "row">
          <div className = "col-md-3 infoContainer">
            <h2>{name.get("specialName1")}</h2>
            <p>{name.get("specialDescription1")}</p>
          </div>
          <div className = "col-md-3 infoContainer">
            <h2>{name.get("specialName2")}</h2>
            <p>{name.get("specialDescription2")}</p>
          </div>
          <div className = "col-md-3 infoContainer">
            <h2>{name.get("specialName3")}</h2>
            <p>{name.get("specialDescription3")}</p>
          </div>
        </div>
      </div>)

    }
    console.log(this.state.loading)
    if(this.state.CurStore.length==0 && this.state.loading==false){
      store=<h1>This store has no specials posted.</h1>
    }
      return(<div>
        <div className="headerSmall row">
          <div className="overlay"></div>
        </div>
          {store}
      </div>)
  }
})

module.exports=StoreSpecial;
