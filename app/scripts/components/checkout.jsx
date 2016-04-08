var React = require("react");
var ReactDOM=require("react-dom");
var Backbone = require("backbone");
var $ = require("jquery")
var Input = require("react-bootstrap/lib/Input")
var Parse = require("parse")

var CheckOut = React.createClass({
  handleSend:function(){

  },
  render:function(){
    var orderByStore = [];
    var self=this;
    this.props.collection.forEach(function(item){
      var cardsByStore =[];
        self.props.collection.forEach(function(card){
          var foil = "";
          var promo="";
          if(card.get("Foil")){
            foil=<span>(Foil)</span>
          }
          if(card.get("Promo")){
            promo=<span>(Promo)</span>
          }
          if(card.get("Store")==item.get("Store")){
              cardsByStore.push(<p>1 copy of <b>{card.get("CardName")}</b> from <b>{card.get("Set")}</b>{foil}{promo}</p>)
          }
        })
      orderByStore.push(<div className="col-md-3 infoContainer" key={item.get("Store")}>
          <h2>{item.get("Store")}</h2>
          {cardsByStore}
      </div>)
    });
if(this.props.collection.length==0){
  orderByStore=(<h2>Your cart is empty</h2>)
}
    return(
      <div className="row checkout">
      <h1>Card Cart:</h1>
      <p>Click 'Send' to submit these orders to the store owners. They will reply with the prices for those cards.</p>
      <div className="row">{orderByStore}</div>
      <div className="row">
          <button onClick={this.handleSend} className="btn btn-primary">Send</button>
      </div>
      </div>
    )
  },
})


module.exports=CheckOut;
