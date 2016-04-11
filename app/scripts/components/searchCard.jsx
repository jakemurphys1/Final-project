var React = require("react");
var ReactDOM=require("react-dom");
var Backbone = require("backbone");
var $ = require("jquery")
var Input = require("react-bootstrap/lib/Input")
var Parse = require("parse")
var LoginForm=require("./login.jsx")

var searchCard = React.createClass({
  getInitialState:function(){
    return {
      "cardList":"",
      "curImage":"images/Magic_Back.jpg",
    }
  },
  componentDidMount:function(){
    //find card info from deckbrew.com
    var curName = this.props.cardName;
    var cardFound=false;
    $.getJSON('https://api.deckbrew.com/mtg/cards?name=' + curName, function (data) {

              for(var i =0;i<data.length;i++){
                if(data[i].name.toLowerCase()==curName.toLowerCase()){
                  cardFound=true;
                    this.setState({"curImage":data[i].editions[0].image_url})
                }
              }
      }.bind(this));

      //find card info from parse
      var currentUser = Parse.User.current();
      var self=this;
      var Cards = Parse.Object.extend("Cards");
      var cardQuery = new Parse.Query(Cards);
    cardQuery.equalTo("Name", this.props.cardName);
    cardQuery.find({
      success: function(results) {
        var cardList =[];

        for(var i =0;i<results.length;i++){
          //check if store name is already used
          var used=false
          for(var j = 0;j<cardList.length;j++){
            if(cardList[j].storeName==results[i].get("storeName")){
              used=true
            }
          }

          if(used==false){
            var qtyFromStore =0;
            var condition="Mint"
            //determine total copies of card at the store
            var cardsBySet=[];
            for(var k =0;k<results.length;k++){
              if(results[k].get("storeName")==results[i].get("storeName")){
                var addAmount = parseInt(results[k].get("Qty"))
                qtyFromStore+=addAmount

                //determine qty by setState
                for(var q=0;q<results.length;q++){

                  if(results[q].get("storeName")==results[k].get("storeName")){
                    //determine if set already accounted for
                    var setUsed = false;
                    for(var w =0;w<cardsBySet.length;w++){
                      if(cardsBySet[w].Set==results[q].get("Set")){
                        setUsed = true
                      }
                    }

                    //calculate qty in set

                    if(setUsed == false){
                        var setQty = 0;
                        var foilQty=0;
                        var promoQty=0;
                        for(var r = 0;r<results.length;r++){
                          if(results[r].get("storeName")==results[q].get("storeName") && results[q].get("Set")==results[r].get("Set")){
                            var addAmount=parseInt(results[r].get("Qty"))
                            setQty+=addAmount
                            if(results[r].get("Foil")==true){
                              foilQty+=addAmount
                            }
                            if(results[r].get("Promo")==true){
                              promoQty+=addAmount
                            }
                          }
                        }
                        cardsBySet.push({"quantity":setQty,"Set":results[q].get("Set"),"Foils":foilQty,"Promos":promoQty})
                    }
                    var setData = {}
                  }
                }
                var curCondition = results[k].get("Condition");
              }
            }
              var cardInfo ={"quantity":qtyFromStore,"storeName":results[i].get("storeName"),"cardsBySet":cardsBySet}
              cardList.push(cardInfo)
          }

        }

        if(cardList.length==0){
          cardList = "FAIL";
        }
          self.setState({"cardList":cardList})
          self.forceUpdate();
      },
      error: function(error) {
        console.log("Card Server not find")
      }
    })

    },
  render:function(){
      var allCards=<h2>No stores are selling this card</h2>
      var self=this;
      if(this.state.cardList!="FAIL" && this.state.cardList!=""){
        allCards = this.state.cardList.map(function(item){
                 var cardsBySet = item.cardsBySet.map(function(set){
                    return(<CardSample cardName={self.props.cardName} collection={self.props.collection} key={set.Set} set={set} item={item}/>)
                 })
               return(
                 <div className="col-md-3 col-sm-6 col-xs-12 infoContainer" key={item.storeName}>
                   <h2>{item.storeName}:</h2>
                   <p className="Top">Total Quantity: {item.quantity}</p>
                   {cardsBySet}
                 </div>)
         })
       } else{
        if(this.state.cardList!="FAIL"){
          allCards = <h2>Loading</h2>
        }
      }

    return(
      <div className="row searchCard">
      <h1>Copies of {this.props.cardName} for sale:</h1>
      <h2>Add cards to your cart, then submit for store owners to reply with the prices</h2>
      <div className="col-md-3 col-sm-12"><img src={this.state.curImage}  />
        <p>Images and card information courtesy of <a href ="https://deckbrew.com/">deckbrew.com</a></p>
      </div>
      <div className="col-md-9 col-sm-12">{allCards}</div>
      </div>
    )
  }
})

var CardSample = React.createClass({
  handleAddFoil:function(){
    var currentUser = Parse.User.current();
    var cardInfo = {"CardName": this.props.cardName,"Set": this.props.set.Set,"Store": this.props.item.storeName,
      "Foil":true,"Promo":false,"buyer":currentUser.getUsername(),"Seller":this.props.item.get("userName")}
    this.props.collection.add(cardInfo)
  },
  handleAdd:function(){
      var currentUser = Parse.User.current();
      var cardInfo = {"CardName": this.props.cardName,"Set": this.props.set.Set,"Store": this.props.item.storeName,
        "Foil":false,"Promo":false,"buyer":currentUser.getUsername(),"Seller":this.props.item.get("userName")}
      this.props.collection.add(cardInfo)
  },
  handleAddPromo(){
    var currentUser = Parse.User.current();
    var cardInfo = {"CardName": this.props.cardName,"Set": this.props.set.Set,"Store": this.props.item.storeName,
      "Foil":false,"Promo":true,"buyer":currentUser.getUsername(),"Seller":this.props.item.get("userName")}
    this.props.collection.add(cardInfo)
  },
  render: function(){
    var foilButton = "";
    var promoButton="";
    if(this.props.set.Foils>0){
      foilButton=<button onClick={this.handleAddFoil} className="btn btn-primary">Add Foil</button>
    }
    if(this.props.set.Promo>0){
      foilButton=<button onClick={this.handleAddPromo} className="btn btn-primary">Add Promo</button>
    }

   return(<div>{this.props.set.quantity} from <b>{this.props.set.Set}</b> <p>({this.props.set.Foils} Foil, {this.props.set.Promos} Promo)</p>
 <button onClick={this.handleAdd} className="btn btn-primary">Add 1</button>{foilButton}{promoButton}
 </div>)
  },
})

module.exports=searchCard;
