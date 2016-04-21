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
    "loading":true,
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
            self.setState({"CurStore":results,"loading":false})
            self.forceUpdate();
        },
        error: function(error) {
          console.log("Server not find")
        }
    })
  },
  render:function(){
    var store = <div className="loadingContainer"><img src="images/Loading.gif" /></div>;
      var self=this;
    if(this.state.loading==false){
        store=this.state.CurStore.map(function(item){
            return(<CardSample collection={self.props.collection} key = {item.id} item={item} />)
        })
    }
    if(this.state.CurStore.length==0 && this.state.loading==false){
      store=<p>This store has no cards posted.</p>
    }

    //check if user logged in
    var lowerText =   <h3>Add cards to your cart, then submit for store owners to reply with the prices</h3>
    var checkoutButton=<div className="row"><a href="#checkout"><button style={{"float":"right"}} className="btn btn-primary checkout">Go to Check Out</button></a></div>
  if(!Parse.User.current()){
       lowerText=<h2>Please <a href="#signUp">sign up</a> or log in to check pricing</h2>
       checkoutButton=""
    }

      return(<div>
        <div className="headerSmall row">
          <div className="overlay"></div>
        </div>
        <div className=" col-md-8 col-md-offset-2">

          <h1>Cards for sale at {this.props.storeName}</h1>
          {lowerText}

          <div className="infoContainer">
              {store}

          </div>
          {checkoutButton}
      </div>
      </div>)
  }
})

var CardSample = React.createClass({
  handleAddFoil:function(){
    var currentUser = Parse.User.current();
    var cardInfo = {"CardName": this.props.item.get("Name"),"Set": this.props.item.get("Set"),"Store": this.props.item.get("storeName"),
      "Foil":true,"Promo":false,"buyer":currentUser.getUsername(),"Seller":this.props.item.get("userName")}
    this.props.collection.add(cardInfo)
  },
  handleAdd:function(){
      var currentUser = Parse.User.current();
      var cardInfo = {"CardName": this.props.item.get("Name"),"Set": this.props.item.get("Set"),"Store": this.props.item.get("storeName"),
        "Foil":false,"Promo":false,"buyer":currentUser.getUsername(),"Seller":this.props.item.get("userName")}
      this.props.collection.add(cardInfo)
  },
  handleAddPromo(){
    var currentUser = Parse.User.current();
    var cardInfo = {"CardName": this.props.item.get("Name"),"Set": this.props.item.get("Set"),"Store": this.props.item.get("storeName"),
      "Foil":false,"Promo":true,"buyer":currentUser.getUsername(),"Seller":this.props.item.get("userName")}
    this.props.collection.add(cardInfo)
  },
  render: function(){
    var plural = "copies";
    var foil = "";
    var promo="";
    var foilButton = "";
    var promoButton="";
    if(this.props.item.get("Qty")==1){
      plural="copy"
    }
    if(this.props.item.get("Foil")){
      foil="(Foil)"
      foilButton=<button onClick={this.handleAddFoil} className="btn btn-primary">Add Foil</button>
    }
    if(this.props.item.get("Promo")){
      promo="(Promo)"
      foilButton=<button onClick={this.handleAddPromo} className="btn btn-primary">Add Promo</button>
    }

    return(<div className="storeSearchCard">
          <span>{this.props.item.get("Qty")} {plural} of <b><a href={"#seeCard/"+this.props.item.get("Name")}>{this.props.item.get("Name")}</a></b> from {this.props.item.get("Set")}{foil}{promo}</span>
           <span><button onClick={this.handleAdd} className="btn btn-primary">Add 1</button>{foilButton}{promoButton}</span>
    </div>)
  },
})

module.exports=StoreCards;
