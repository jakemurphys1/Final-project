var React = require("react");
var ReactDOM=require("react-dom");
var Backbone = require("backbone");
var $ = require("jquery")
var Input = require("react-bootstrap/lib/Input")
var Parse = require("parse")

var StoreCards= React.createClass({
  getInitialState:function(){
  return {
    "CurStore":[],
  }
},
  componentDidMount(){
    //find card info from parse
    var currentUser = Parse.User.current();
    var self=this;
    var Cards = Parse.Object.extend("Cards");
    var query = new Parse.Query(Cards);
      query.equalTo("storeName", this.props.storeName);
      query.find({
        success: function(results) {
          console.log("results", results)
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
          var plural = "copies";
          var foil = "";
          var promo="";
          if(item.get("Qty")==1){
            plural="copy"
          }
          if(item.get("Foil")){
            foil="(Foil)"
          }
          if(item.get("Promo")){
            promo="(Promo)"
          }

          return(<div key={item.id}>
                <p>{item.get("Qty")} {plural} of <b>{item.get("Name")}</b> from {item.get("Set")}{foil}{promo}</p>
          </div>)
        })
    }
      return(<div>
          <h1>Cards for sale at {this.props.storeName}</h1>
          <div className="col-md-6 col-md-offset-3 infoContainer">
              {store}
          </div>

      </div>)
  }
})

module.exports=StoreCards;
