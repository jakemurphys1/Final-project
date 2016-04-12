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
        "loading":true,
    }
  },
  componentDidMount(){
    //find order info from parse
    var currentUser = Parse.User.current();
    var Order = Parse.Object.extend("Orders");
    var query = new Parse.Query(Order);
      query.equalTo("buyer", currentUser.getUsername());
      var self = this;

      query.find({
        success: function(results) {
          for(var i =0;i<results.length;i++){
              //set order
              var allOrders = self.state.allOrders;
              allOrders.push({"store":results[i].get("store"),"curId":results[i].id,"Price":results[i].get("Price"),"Agreed":results[i].get("Agreed")})



            var Card = Parse.Object.extend("OrderedCards");
            var cardQuery = new Parse.Query(Card);
              cardQuery.equalTo("buyer", currentUser.getUsername());
              cardQuery.find({
                success: function(theCards){
                var allOrders = self.state.allOrders;
                for(var j = 0;j<allOrders.length;j++){
                  var cardCollection = [];
                  for(var k =0;k<theCards.length;k++){
                    if(allOrders[j].curId==theCards[k].get("orderId")){

                        cardCollection.push({"Name":theCards[k].get("Name"),"Set":theCards[k].get("Set"),"Foil":theCards[k].get("foil"),
                          "Promo":theCards[k].get("promo"),"curId":theCards[k].id})
                    }
                  }
                  allOrders[j].cards=cardCollection;
                }
                  self.setState({"allOrders":allOrders,"loading":false})
                }

              })


          }

        }
        })
  },

  render:function(){
    var self = this;
    var allOrders = this.state.allOrders.map(function(item){
      return(<Orders parent={self} key={item.curId} item={item} />)
    });
    if(allOrders.length==0){
      allOrders=<p>You have no pending orders</p>
    }
    if(this.state.loading==true){
      allOrders= <div className="loadingContainer"><img src="images/Loading.gif" /></div>
    }
    return(
      <div className="Order row">
      <h1>Orders Pending</h1>
      <p>Please note that the sellers may have removed cards from order</p>
      {allOrders}

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
    var Order = Parse.Object.extend("Orders");
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
    var Orders = Parse.Object.extend("Orders");
    var query = new Parse.Query(Orders);
    var self=this;
    query.get(this.props.item.curId, {
      success: function(myObj) {
        myObj.destroy({});
        self.setState({"message":<p>You've declined these prices.</p>})

      },
    });

    //delete cards too
    var Cards = Parse.Object.extend("OrderedCards");
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
    var heading =<p>{this.props.item.store} prices these cards at {this.props.item.Price}: </p>
    if(this.props.item.Price==""){
      heading=<p>Awaiting prices from {this.props.item.store}</p>
      message=""
      theButtons=""
    }
    if(this.state.agreed){
      theButtons="";
      heading=<p>{this.props.item.store} prices these cards at {this.props.item.Price}: </p>
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
    if(this.props.card.Foil){
      foil=<span>(Foil)</span>
    }
    if(this.props.card.Promo){
      promo=<span>(Promo)</span>
    }
    return(<p>1 <b>{this.props.card.Name}</b> from {this.props.card.Set}{foil}{promo}</p>)
  },
})


module.exports=Total;
