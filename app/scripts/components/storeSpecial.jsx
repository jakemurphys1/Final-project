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
    var Special = Parse.Object.extend("Specials");
    var query = new Parse.Query(Special);
      query.equalTo("storeName", this.props.storeName);
      query.find({
        success: function(results) {
          console.log(results)
          console.log("results",results[0].get("specialName1"))
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
      return(<div>
          {store}
      </div>)
  }
})

module.exports=StoreSpecial;
