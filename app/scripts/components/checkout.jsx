var React = require("react");
var ReactDOM=require("react-dom");
var Backbone = require("backbone");
var $ = require("jquery")
var Input = require("react-bootstrap/lib/Input")
var Parse = require("parse")

var CheckOut = React.createClass({
  handleSend:function(){
    if(this.props.collection.length==0){
      return;
    }

    var orderByStore = [];
    var self=this;
    var currentUser = Parse.User.current();
    var storesThatWereUsed=[];

    this.props.collection.forEach(function(item){
      //checkif order for store already created
      var storeWasUsed=false;
      for(var i =0;i<storesThatWereUsed.length;i++){
        if(storesThatWereUsed[i]==item.get("Store")){
          storeWasUsed=true
        }
      }

      if(storeWasUsed==false){
        //add order
        storesThatWereUsed.push(item.get("Store"))
        var Orders = Parse.Object.extend("Orders");
        var orders = new Orders();

        var data = {
          "buyer":currentUser.getUsername(),
          "seller":item.get("Store"),
        }

      orders.save(data).then(function(object) {
        //add cards
        self.props.collection.forEach(function(card){
          if(card.get("Store")==object.get("seller")){
            var Cards = Parse.Object.extend("OrderedCards");
            var cards = new Cards();
            console.log("card",card.get("CardName"))
            var cardData = {
              "orderId":object.id,
              "buyer":currentUser.getUsername(),
              "seller":object.get("seller"),
              "Name":card.get("CardName"),
            }
            console.log(cardData)
            cards.save(cardData).then(function(cardobject){
              console.log("Success",cardobject)
            })

          }
        })

      })
      }



    });

  },
  render:function(){
    var orderByStore = [];
    var self=this;
    this.props.collection.forEach(function(item){
      var cardsByStore =[];
        self.props.collection.forEach(function(card){
          if(card.get("Store")==item.get("Store")){
              cardsByStore.push(<CardSample collection={self.props.collection} parent={self} card={card} />)
          }
        })
      orderByStore.push(<div className="col-md-4 infoContainer" key={item.get("Store")}>
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

var CardSample = React.createClass({
  handleRemove:function(){
      this.props.collection.remove(this.props.collection.where(this.props.card))
      this.props.parent.forceUpdate();
  },
  render:function(){
    var foil = "";
    var promo="";
    if(this.props.card.get("Foil")){
      foil=<span>(Foil)</span>
    }
    if(this.props.card.get("Promo")){
      promo=<span>(Promo)</span>
    }
    return(<div className="row">
      1 copy of <b>{this.props.card.get("CardName")}</b> from <b>{this.props.card.get("Set")}</b>{foil}{promo}
  <button onClick={this.handleRemove} className="btn btn-primary remove">Remove</button>
</div>)
  },
})


module.exports=CheckOut;
