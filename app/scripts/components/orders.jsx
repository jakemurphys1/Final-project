var React = require("react");
var ReactDOM=require("react-dom");
var Backbone = require("backbone");
var $ = require("jquery");
var Input = require("react-bootstrap/lib/Input");
var Parse = require("parse");

var Total= React.createClass({
  getInitialState:function(){
    return {
        "allOrders":[],
        "sellOrders":[],
        "loading":true,
    }
  },
  componentDidMount(){
    //find cards person is buying
    var currentUser = Parse.User.current();
    var Order = Parse.Object.extend("Orders");
    var query = new Parse.Query(Order);
      query.equalTo("buyer", currentUser.getUsername());
      var self = this;

      var Card = Parse.Object.extend("OrderedCards");
      var cardQuery = new Parse.Query(Card);
        cardQuery.equalTo("buyer", currentUser.getUsername());

        cardQuery.find({
          success: function(theCards){

            //use orders in parse
            query.find({

              success: function(results) {

                    var allOrders = [];
                for(var i =0;i<results.length;i++){

                  var cardCollection = [];
                  for(var k =0;k<theCards.length;k++){
                    if(results[i].id==theCards[k].get("orderId")){

                        cardCollection.push({"Name":theCards[k].get("Name"),"Set":theCards[k].get("Set"),"Foil":theCards[k].get("foil"),
                          "Promo":theCards[k].get("promo"),"curId":theCards[k].id})
                    }
                  }
                    allOrders.push({"store":results[i].get("store"),"curId":results[i].id,"Price":results[i].get("Price"),"Agreed":results[i].get("Agreed"),"cards":cardCollection})
                }
                self.setState({"allOrders":allOrders,"loading":false})
              }
            })
          }
        });



    //find cards person is selling
    var Sell = Parse.Object.extend("Sells");
    var sellQuery = new Parse.Query(Sell);
      sellQuery.equalTo("seller", currentUser.getUsername());
      var Card = Parse.Object.extend("SellingCards");
      var cardQuery = new Parse.Query(Card);
        cardQuery.equalTo("seller", currentUser.getUsername());

        cardQuery.find({
          success: function(theCards){
            sellQuery.find({
              success: function(results) {
                  var allOrders = [];
                for(var i =0;i<results.length;i++){
                  var cardCollection = [];
                  for(var k =0;k<theCards.length;k++){
                      if(results[i].id==theCards[k].get("orderId")){
                        cardCollection.push({"Name":theCards[k].get("Name"),"Set":theCards[k].get("Set"),"Foil":theCards[k].get("foil"),
                          "Promo":theCards[k].get("promo"),"Qty":theCards[k].get("Qty"),"curId":theCards[k].id})
                      }
                    }
                    allOrders.push({"store":results[i].get("store"),"curId":results[i].id,"Price":results[i].get("Price"),"Agreed":results[i].get("Agreed"),"cards":cardCollection})
                }
                self.setState({"sellOrders":allOrders,"loading":false})
              }
              })
            }
        })

  },

  render:function(){
    var self = this;
    var allOrders = this.state.allOrders.map(function(item){
      return(<Orders curtype={"buy"} parent={self} key={item.curId} item={item} />)
    });
    var sellOrders = this.state.sellOrders.map(function(item){
      return(<Orders curtype={"sell"} parent={self} key={item.curId} item={item} />)
    });
    if(allOrders.length==0 && sellOrders.length==0){
      allOrders = <p>You have no pending orders</p>
    }
    if(this.state.loading){
      var allOrders = <div className="loadingContainer"><img src="images/Loading.gif" /></div>
    }
    return(
      <div className="Order row">
      <h1>Orders Pending</h1>
      <p>Please note that the sellers may have removed cards from order</p>
      {allOrders}
      {sellOrders}
      </div>
    )
  },

})

var Orders = React.createClass({
  getInitialState:function(){
    return {
        "message":<p>Do you accept these prices?</p>,
        "agreed":this.props.item.Agreed,
    }
  },
  handleAgree:function(){
    if(this.props.curtype=="sell"){
        var Order = Parse.Object.extend("Sells");
    }
    if(this.props.curtype=="buy"){
        var Order = Parse.Object.extend("Orders");
    }

    var self=this;
    var query = new Parse.Query(Order);
      query.get(this.props.item.curId,{
              success: function(order) {
                  order.set('Agreed',true);
                  order.save();
                  self.setState({"message":<p>You've accepted these prices! Go to the store to purchase.</p>,"agreed":true})
              }
        });
  },
  handleDecline:function(){

    if(this.props.curtype=="sell"){
        var Orders = Parse.Object.extend("Sells");
    }
    if(this.props.curtype=="buy"){
        var Orders = Parse.Object.extend("Orders");
    }
    var query = new Parse.Query(Orders);
        console.log("got here")
    var self=this;

    query.get(self.props.item.curId, {
      success: function(myObj) {
        myObj.destroy({});
        self.setState({"message":<p>You've declined these prices.</p>})

      },
    });

    //delete cards too
    if(this.props.curtype=="sell"){
          var Cards = Parse.Object.extend("SellingCards");
    }
    if(this.props.curtype=="buy"){
          var Cards = Parse.Object.extend("OrderedCards");
    }

    var query = new Parse.Query(Cards);
          query.equalTo("orderId", self.props.item.curId);
    query.find({
    success: function(myObj) {
      for(var i =0;i<myObj.length;i++){
        myObj[i].destroy({});
      }
    },
    });



  },
  render:function(){
    var theButtons = <div><button onClick={this.handleAgree} className="btn btn-primary">Agree</button><button onClick={this.handleDecline} className="btn btn-primary">Decline</button></div>
    var allCards = this.props.item.cards.map(function(card){
      return(<IndivCards key={card.curId} id={card.curId} card={card} />)
    })
    var message=this.state.message;
    var heading =<p>{this.props.item.store} is selling these cards at {this.props.item.Price}: </p>
    if(this.props.curtype=="sell"){
        heading =<p>{this.props.item.store} is buying these cards at {this.props.item.Price}: </p>
    }

    if(this.props.item.Price==""){
      if(this.props.curtype=="sell"){
        var ptype = "purchasing"
      } else{
        var ptype="selling"
      }
      heading=<p>Awaiting {ptype} prices from {this.props.item.store}</p>
      message=""
      theButtons=""
    }
    if(this.state.agreed){
      theButtons="";
      message=<p>You've agreed to the prices. Head to the store to pick them up.</p>;
    }

    return(<div className="col-md-3 infoContainer">

      {heading}
      {allCards}
      {message}
      {theButtons}
      </div>)
    },
  })

var IndivCards = React.createClass({
  render:function(){
    var foil="";
    var promo="";
    var qty=1;
    if(this.props.card.Foil){
      foil=<span>(Foil)</span>
    }
    if(this.props.card.Promo){
      promo=<span>(Promo)</span>
    }
    if(this.props.card.Qty){
      qty=this.props.card.Qty
    }
    return(<p>{qty} <b>{this.props.card.Name}</b> from {this.props.card.Set}{foil}{promo}</p>)
  },
})


module.exports=Total;
