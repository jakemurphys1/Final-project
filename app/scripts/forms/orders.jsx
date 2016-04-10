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
  componentDidMount(){
    //find order info from parse
    var currentUser = Parse.User.current();
    var Order = Parse.Object.extend("Orders");
    var query = new Parse.Query(Order);
      query.equalTo("seller", currentUser.get("storeName"));
      var self = this;

      query.find({
        success: function(results) {

          for(var i =0;i<results.length;i++){

              //set order
              var allOrders = self.state.allOrders;
              console.log("results:", results[i].get("buyer"))
              allOrders.push({"buyer":results[i].get("buyer")})



            var Card = Parse.Object.extend("OrderedCards");
            var cardQuery = new Parse.Query(Card);
              cardQuery.equalTo("seller", currentUser.get("storeName"));
              cardQuery.find({
                success: function(theCards){
                  console.log("TheCards",theCards)
                var allOrders = self.state.allOrders;
                for(var j = 0;j<allOrders.length;j++){

                  var cardCollection = [];
                  for(var k =0;k<theCards.length;k++){
                    if(allOrders[j].buyer==theCards[k].get("buyer")){
                        cardCollection.push({"Name":theCards[k].get("Name")})
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
    var curId= e.currentTarget.id;
    var CardBase = Parse.Object.extend("Cards");
    var query = new Parse.Query(CardBase);
    query.get(curId, {
      success: function(myObj) {
        myObj.destroy({});
      },
      error: function(object, error) {
        // The object was not retrieved successfully.
        // error is a Parse.Error with an error code and description.
      }
    });

    //remove the item from setInfo
    var setInfo = this.state.setInfo.filter(function(item){
    return(item.id!=curId)
    })
    this.setState({"setInfo":setInfo})
  },

  render:function(){
    var self = this;
    console.log("All Orders",this.state.allOrders)
    var allOrders = this.state.allOrders.map(function(item){
      var allCards = item.cards.map(function(card){
        return(<p>{card.Name}</p>)
      })
      return(<div className="col-md-3 infoContainer">
        <p>{item.buyer} wants {allCards}</p>

      </div>)
    });
    return(
      <div className="ownerOrder row">
      <h2>Orders Pending</h2>
      {allOrders}

      </div>
    )
  },

})

var IndivCard = React.createClass({
  render:function(){
    var foil ="";
    var promo="";
    if(this.props.item.get("Foil")){
      foil=<span>(Foil)</span>
    }
    if(this.props.item.get("Promo")){
      promo=<span>(Promo)</span>
    }
    return(<p id={this.props.id} className="removeCard">
            <span>{this.props.item.get("Name")}: {this.props.item.get("Qty")} from {this.props.item.get("Set")} {foil}{promo}</span>
            <span className="buttonContainer"><button id={this.props.item.id} onClick={this.props.parent.handleRemove} className="btn btn-danger">Remove</button>
            <button id={this.props.item.id} onClick={this.props.parent.handleDecrease} className="btn btn-danger">- 1</button>
            <button id={this.props.item.id} onClick={this.props.parent.handleIncrease} className="btn btn-danger">+ 1</button>
            </span>
      </p>
    )
  },
})

module.exports=Total;
