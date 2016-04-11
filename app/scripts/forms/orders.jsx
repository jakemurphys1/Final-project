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
    }
  },
  componentWillMount(){
    //find order info from parse
    var currentUser = Parse.User.current();
    var Order = Parse.Object.extend("Orders");
    var query = new Parse.Query(Order);
    query.equalTo("seller", currentUser.getUsername());

    var Card = Parse.Object.extend("OrderedCards");
    var cardQuery = new Parse.Query(Card);



      var self = this;

      query.find({
        success: function(results) {
          for(var i =0;i<results.length;i++){

              //set order
              var allOrders = self.state.allOrders;
              allOrders.push({"buyer":results[i].get("buyer"),"curId":results[i].id,"Price":results[i].get("Price"),"Agreed":results[i].get("Agreed")})


              cardQuery.equalTo("orderId", results[i].id);
              cardQuery.find({
                success: function(theCards){

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
                  self.setState({"allOrders":allOrders})
                }

              })
          }




        }
        })
  },
  handleRemove:function(e){
    //delete Order
    var curId= e.currentTarget.id;
    var CardBase = Parse.Object.extend("Cards");
    var query = new Parse.Query(CardBase);
    query.get(curId, {
      success: function(myObj) {
        myObj.destroy({});
      },
    });




    //remove the item from setInfo
    var setInfo = this.state.setInfo.filter(function(item){
    return(item.id!=curId)
    })
    this.setState({"setInfo":setInfo})
  },

  render:function(){
    var self = this;
    var allOrders = this.state.allOrders.map(function(item){
      return(<Orders parent={self} key={item.curId} item={item} />)
    });
    return(
      <div className="ownerOrder row">
      <h2>Orders Pending</h2>
      {allOrders}

      </div>
    )
  },

})

var Orders = React.createClass({
  getInitialState:function(){
    return {
      "PriceShown":false,
      "message":false
    }
  },
  handleSend:function(){
    var price = $("#price"+this.props.item.curId).val();

    var Order = Parse.Object.extend("Orders");
    var query = new Parse.Query(Order);
      query.get(this.props.item.curId,{
              success: function(order) {
                  order.set('Price',price);
                  order.save();
              }
        });
          this.setState({"PriceShown":true})
  },
  handleRemove:function(){
    var Orders = Parse.Object.extend("Orders");
    var self=this;
    var query = new Parse.Query(Orders);
    query.get(this.props.item.curId, {
      success: function(myObj) {
        myObj.destroy({});
        self.setState({"message":true})
    },
    });

    //delete cards too
    var Cards = Parse.Object.extend("OrderedCards");
    var query = new Parse.Query(Cards);
          query.equalTo("orderId", this.props.item.curId);
    query.find({
    success: function(myObj) {
      for(var i =0;i<myObj.length;i++){
        myObj[i].destroy({});
      }
    },
    });


    },
  render:function(){
    var message = <h4>Submit price for the customer</h4>
    var format = "infoContainerRED"
    var priceButton=<div><input id={"price"+this.props.item.curId} type="text" name="price" placeholder="Total price of cards"/><button onClick={this.handleSend} className="btn btn-primary">Send</button></div>
    if(this.props.item.Price!="" || this.state.PriceShown==true){
      message=<h4>Awaiting acceptance from customer</h4>
      format = "infoContainer"
      priceButton="";
    }
    if(this.props.item.Agreed){
      message=<h4>Customer has agreed to the Price of {this.props.item.Price}!</h4>
      format = "infoContainerGREEN"
          priceButton="";
    }
     var thisremoveButton=(<div><button onClick={this.handleRemove} className="btn btn-danger">Remove</button></div>)
    if(this.state.message){
      thisremoveButton=<p>You deleted this order</p>
    }
    var allCards = this.props.item.cards.map(function(card){
      return(<IndivCards key={card.curId} id={card.curId} card={card} />)
    })
    return(<div className={"col-md-3 " + format}>
    {message}
      <p>{this.props.item.buyer} wants to Purchase: </p>
      {allCards}
      {priceButton}
      {thisremoveButton}
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
