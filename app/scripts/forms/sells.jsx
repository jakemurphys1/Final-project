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
        "sells":[],
        "loading":true,
    }
  },
  componentWillMount(){
    //find order info from parse
    var currentUser = Parse.User.current();
      var self = this;
    var Order = Parse.Object.extend("Sells");
    var OrderQuery = new Parse.Query(Order);
    OrderQuery.equalTo("store", currentUser.get("storeName"));


    var Card = Parse.Object.extend("SellingCards");
    var cardQuery = new Parse.Query(Card);
      cardQuery.equalTo("store", currentUser.get("storeName"));


      cardQuery.find({
        success: function(theCards){
            //set up orders
          OrderQuery.find({
            success: function(results) {
              //set order
              var allOrders = [];

              for(var j = 0;j<results.length;j++){

                var cardCollection = [];

                for(var k =0;k<theCards.length;k++){

                  if(results[j].id==theCards[k].get("orderId")){
                      //Based on SellingCards Class
                      cardCollection.push({"Name":theCards[k].get("Name"),"Set":theCards[k].get("Set"),"Foil":theCards[k].get("foil"),
                        "Promo":theCards[k].get("promo"),"Qty":theCards[k].get("Qty"),"curId":theCards[k].id})

                  }
                }
                  //Based on Sells Class
                allOrders.push({"seller":results[j].get("seller"),"curId":results[j].id,"Price":results[j].get("Price"),"Agreed":results[j].get("Agreed"),"cards":cardCollection,"Message":results[j].get("message")})
              }
                self.setState({"allOrders":allOrders,"loading":false})
            }
            })

        }
      })


  },

  render:function(){
    var self = this;
    var allOrders = this.state.allOrders.map(function(item){
      return(<Orders parent={self} key={item.curId} item={item} />)
    });

    //put orders into even rows
    var count = 0;
    var rowcount=0;
    var allrows=[];
    var currow=[];
    while(count<=allOrders.length){

      if(rowcount==3){
        rowcount=0
        allrows.push(<div key={count} className="row">{currow}</div>)
        currow=[];
      }
      currow.push(allOrders[count])
        count+=1
        rowcount+=1;
    }
    allrows.push(<div key={count} className="row">{currow}</div>)



    if(allOrders.length==0){
      allOrders=<p>You have no pending purchases</p>
    }
    if(this.state.loading){
      allOrders=<div className="loadingContainer"><img src="images/Loading.gif" /></div>
    }
    return(
      <div className="ownerOrder row">
      <h2>Sells Pending</h2>
      <p>Click the <span className="removeOrder">X</span>  to remove cards not desired</p>
      {allrows}

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

    var Order = Parse.Object.extend("Sells");
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
    var Orders = Parse.Object.extend("Sells");
    var self=this;
    var query = new Parse.Query(Orders);
    query.get(this.props.item.curId, {
      success: function(myObj) {
        myObj.destroy({});
        self.setState({"message":true})
    },
    });

    //delete cards too
    var Cards = Parse.Object.extend("SellingCards");
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
  handleRemoveInv:function(){
      console.log(this.props.item)
  },
  render:function(){
    var self=this;
    var message = <h4>Submit price for the customer</h4>
    var format = "infoContainerRED"
    var priceButton=<span><input id={"price"+this.props.item.curId} type="text" name="price" placeholder="Total price of cards"/><button onClick={this.handleSend} className="btn btn-primary">Send</button></span>
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
     var thisremoveButton=(<span><button onClick={this.handleRemove} className="btn btn-danger deleteButton">Delete</button></span>)
    if(this.state.message){
      thisremoveButton=<p>You deleted this order</p>
    }
    var allCards = this.props.item.cards.map(function(card){
      return(<IndivCards parent={self} key={card.curId} id={card.curId} card={card} />)
    })
    if(this.props.item.Message!=""){
      var messageBox = <div><label>Message from seller</label>
              <div className="buyerMessage">{this.props.item.Message}</div></div>
    }
    return(<div className={"col-md-3 " + format}>
    {message}
      <p>{this.props.item.seller} wants to sell: </p>
      {allCards}
      {messageBox}
      {priceButton}
      {thisremoveButton}
    </div>)
  },
})

var IndivCards = React.createClass({
  getInitialState:function(){
    return {
        "format":"",
    }
  },
  handleRemove:function(e){
    var curId= e.currentTarget.id;
    var cardBase = Parse.Object.extend("SellingCards");
    var query = new Parse.Query(cardBase);
    query.get(curId, {
      success: function(myObj) {
        myObj.destroy({});
      },
      error: function(object, error) {
      }
    });

    this.setState({"format":"turnRed"})
  },
  render:function(){
    var foil="";
    var promo="";
    if(this.props.card.Foil){
      foil=<span>(Foil)</span>
    }
    if(this.props.card.Promo){
      promo=<span>(Promo)</span>
    }
    return(<div className={"row " + this.state.format}><p>{this.props.card.Qty} <b><a href={"#seeCard/"+this.props.card.Name}>{this.props.card.Name}</a></b> from {this.props.card.Set}{foil}{promo}<span id={this.props.card.curId} onClick={this.handleRemove} className="removeOrder">X</span></p></div>)
  },
})


module.exports=Total;
