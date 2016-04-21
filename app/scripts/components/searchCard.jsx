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
              var cardInfo ={"quantity":qtyFromStore,"storeName":results[i].get("storeName"),"seller":results[i].get("userName"),"cardsBySet":cardsBySet}
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
      var lowerText = <h2>Add cards to your cart, then go to checkout for store owners to reply with the prices</h2>
      var checkoutButton=<div className="row"><a href="#checkout"><button style={{"float":"right"}} className="btn btn-primary checkout">Go to Check Out</button></a></div>
    if(!Parse.User.current()){
         lowerText=<h2>Please <a href="#signUp">sign up</a> or log in to check pricing</h2>
         checkoutButton=""
      }
      if(this.state.cardList!="FAIL" && this.state.cardList!=""){

        allCards = this.state.cardList.map(function(item){
          //check is store is approved


          var isApproved = false
          var stores = self.props.storeCollection
          for(var i =0;i<stores.length;i++){
            if(stores[i].get("storeName")==item.storeName){
              if(stores[i].get("Approved")){
                isApproved=true
              }
            }
          }
          if(isApproved){
            var cardsBySet = item.cardsBySet.map(function(set){
               return(<CardSample cardName={self.props.cardName} collection={self.props.collection} key={set.Set} set={set} item={item}/>)
            })

            return(<div className="col-md-3 col-sm-6 col-xs-12 infoContainer" key={item.storeName}>
                <h2>{item.storeName}:</h2>
                <p className="Top">Total Quantity: {item.quantity}</p>
                {cardsBySet}
              </div>)

          }

         })

       } else{
        if(this.state.cardList!="FAIL"){
          allCards = <div className="loadingContainer"><img src="images/Loading.gif" /></div>
        }
      }

    return(
      <div className="row searchCard">
        <div className="headerSmall row">
          <div className="overlay"></div>
        </div>
        <div className="row">
          <h1>Copies of {this.props.cardName} for sale:</h1>
          {lowerText}
          <div className="row instructions">
            <div className="col-md-2 col-md-offset-1 col-sm-4 col-xs-6 instructionContainer"><h4>Step One:</h4><p>Search for all the cards you want to purchase. Click "Add 1" to add the specific card from the specific store to your cart. Click "Add Foil" or "Add Promo" for foils or promos</p></div>
            <div className="col-md-2 col-sm-4 col-xs-6 instructionContainer"><h4>Step Two:</h4><p>Once you have completed your list, click the "Go to Check Out" to review your list. Verify the information is correct, then click "Send" to request prices for the cards from the store or stores.</p></div>
            <div className="col-md-2 col-sm-4 col-xs-6 instructionContainer"><h4>Step Three:</h4><p>Click the "Your Orders" tab on the home page to check on your requests. When the store replies with the price they are willing to sell the cards, the order will change color.</p></div>
              <div className="col-md-2 col-sm-4 col-xs-6 instructionContainer"><h4>Step Four:</h4><p>If you agreed to the prices, click agree. Otherwise, Click Decline to delete the order and try another offer or another store. </p></div>
              <div className="col-md-2 col-sm-4 col-xs-6 instructionContainer"><h4>Step Five:</h4><p>If you agree, you have two days to go to the store and purchase the cards. If you wait longer, the store reserves the right to withdraw the offer.</p></div>
          </div>
          <div className="col-md-3 col-sm-12"><img src={this.state.curImage}  />
            <p>Images and card information courtesy of <a href ="https://deckbrew.com/">deckbrew.com</a></p>
          </div>

          <div className="col-md-9 col-sm-12">{allCards}</div>
        </div>
        {checkoutButton}
      </div>
      )
  }
})

var CardSample = React.createClass({
  handleAddFoil:function(){
    var currentUser = Parse.User.current();
    var cardInfo = {"CardName": this.props.cardName,"Set": this.props.set.Set,"Store": this.props.item.storeName,
      "Foil":true,"Promo":false,"buyer":currentUser.getUsername(),"Seller":this.props.item.seller}
    this.props.collection.add(cardInfo)
  },
  handleAdd:function(){
      var currentUser = Parse.User.current();
      var cardInfo = {"CardName": this.props.cardName,"Set": this.props.set.Set,"Store": this.props.item.storeName,
        "Foil":false,"Promo":false,"buyer":currentUser.getUsername(),"Seller":this.props.item.seller}
      this.props.collection.add(cardInfo)
      console.log(cardInfo)
  },
  handleAddPromo(){
    var currentUser = Parse.User.current();
    var cardInfo = {"CardName": this.props.cardName,"Set": this.props.set.Set,"Store": this.props.item.storeName,
      "Foil":false,"Promo":true,"buyer":currentUser.getUsername(),"Seller":this.props.item.seller}
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
