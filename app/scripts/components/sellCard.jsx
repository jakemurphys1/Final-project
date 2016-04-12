var React = require("react");
var ReactDOM=require("react-dom");
var Backbone = require("backbone");
var $ = require("jquery");
var Input = require("react-bootstrap/lib/Input");
var Parse = require("parse");

var Total= React.createClass({
  getInitialState:function(){
    return {
    "curName":   "Magic: The Gathering",
    "curImage":"images/Magic_Back.jpg",
    "selectInput":<p></p>,
    "selectStore":<p></p>,
    "totalQty":0,
    "setQty":[],
    "sets":[],
    }
  },
handleReset:function(){
  $("#cardNameContainer").removeClass("hidden")
  $("#setContainer").addClass("hidden")
  $(".thisinfoContainer").addClass("hidden")
  this.setState(this.getInitialState());
},
handleSearch:function(e){
  e.preventDefault();
      //find card info from deckbrew.com
      var curName = $("#cardName").val();
      var cardFound=false;
      $.getJSON('https://api.deckbrew.com/mtg/cards?name=' + curName, function (data) {

                for(var i =0;i<data.length;i++){
                  if(data[i].name.toLowerCase()==curName.toLowerCase()){
                    $("#cardNameContainer").addClass("hidden")
                    $("#setContainer").removeClass("hidden")
                    $(".thisinfoContainer").removeClass("hidden")
                    cardFound=true;
                    this.setState({"sets":data[i].editions})
                      this.setState({"selectInput": <SetSelect data={data[i].editions} />,"curName":data[i].name,"curImage":data[i].editions[0].image_url})
                  }
                }
        }.bind(this));
        this.setState({"selectStore":<StoreSelect />})
      $("#cardQty").val(1)

},
handleAddCard:function(e){
  e.preventDefault();
  if( $("#cardQty").val()==""){
    alert("Please insert a quantity")
    return;
  }
    var currentUser = Parse.User.current();
    var foil = document.getElementById('foil').checked;
    var promo =document.getElementById('promo').checked;

    var data = {
      "Name":$("#cardName").val(),
      "Set":$("#Sets").val(),
      "Condition":$("#cardCondition").val(),
      "Qty":$("#cardQty").val(),
      "Store":$("#Stores").val(),
      "Foil":foil,
      "Promo":promo,
      "Type":"Sell",
      "date":Date.now(),
      "userName":currentUser.getUsername(),
      "storeName":this.props.storeName,
    }

    this.props.collection.add(data)
    console.log(this.props.collection)

  $("#cardNameContainer").removeClass("hidden")
  $("#setContainer").addClass("hidden")
  $(".thisinfoContainer").addClass("hidden")
  this.setState(this.getInitialState());

},
  render:function(){
      var curCollection=this.props.collection.map(function(item){
        if(item.get("Foil")){
          var foil = <span>(Foil)</span>
        }
        if(item.get("Promo")){
          var promo = <span>(Promo)</span>
        }
          return(<p>{item.get("Qty")} copies of {item.get("Name")} from {item.get("Set")}{foil}{promo}</p>)


      }.bind(this))


    return(
      <div className="ownerCards row infoContainer">
      <h1>Sell Your Cards</h1>


      <div className="col-md-4 col-xs-12 imageContainer">
          <h3>{this.state.curName}</h3>
          <div><img src={this.state.curImage}  /></div>
          <p>Images and card information courtesy of <a href ="https://deckbrew.com/">deckbrew.com</a></p>
      </div>

      <div className="col-md-4 col-xs-12">

      <form id="cardForm" action="" className="form-events">

            <div id="cardNameContainer">
              <div className="row"><label>Card Name</label></div>
              <input id="cardName" type="text" name="cardName" placeholder="Name of Card"/>
              <p><button onClick={this.handleSearch} className="btn btn-primary Search">Search</button></p>
            </div>



        <div className="thisinfoContainer hidden">
          <div id="resetContainer">
            <button onClick={this.handleReset} className="btn btn-secondary">Change Card</button>
          </div>
          <div id="setContainer">
            <div className="row "><label>Set</label></div>
            {this.state.selectInput}
            <div className="row "><label>Sell to Store:</label></div>
            {this.state.selectStore}
          </div>
          <div className="row">
            <div className="col-xs-6">
              <div className="row"><label>Condition</label></div>
                      <select id="cardCondition">
                        <option value="Mint">Mint</option>
                        <option value="Near-Mint">Near-Mint</option>
                        <option value="Lightly-Played">Lightly-Played</option>
                        <option value="Moderately-Played">Moderately-Played</option>
                        <option value="Heavily-Played">Heavily-Played</option>
                        <option value="Damaged">Damaged</option>
                      </select>
            </div>
            <div className="col-xs-6">
              <div className="row"><label>Qty</label></div>
              <input id="cardQty" type="number" name="cardQty" placeholder="Qty"/>
            </div>
          </div>

          <div className="row">
            <div className="col-xs-6">
              <div className="row"><label>Foil?</label></div>
                <div className="checkbox">
                  <label><input id="foil" type="checkbox" value="" />Yes</label>
                </div>
            </div>
            <div className="col-xs-6">
              <div className="row"><label>Promo?</label></div>
                <div className="checkbox">
                  <label><input id="promo" type="checkbox" value="" />Yes</label>
                </div>
            </div>
          </div>
            <div onClick={this.handleAddCard} className="row"><button type="submit" className="btn btn-lg btn-block btn-primary signinbutton">Add</button></div>
          </div>
      </form>
      <a href="#checkout"><button style={{"float":"right"}} className="btn btn-primary">Go to Check Out</button></a>
        </div>


            <div className="col-md-4 col-xs-12">
              <h3>You are currently selling:</h3>
              {curCollection}
            </div>

      </div>
      )
  },

})

var SetSelect= React.createClass({
  render:function(){
    var allSets = this.props.data.map(function(item){
        return(<option key={item.set} value={item.set}>{item.set}</option>)
    })
    return(
      <select id="Sets">
                  {allSets}
      </select>
    )
  },
})

var StoreSelect= React.createClass({
  getInitialState:function(){
    return {
    "allStores":   "",
    "storeList":[],
    }
  },
  componentDidMount(){
    var Store = Parse.Object.extend("Stores");
    var query = new Parse.Query(Store);
    var self=this;
    query.find({
      success: function(results) {
        console.log("results",results)
        self.setState({"storeList":results})
      },
      error: function(error) {
        console.log("Store Server not find")
      }
    })

    },
  render:function(){
    var allStores= this.state.storeList.map(function(item){
      console.log(item.get("storeName"))
        return(<option key={item.id} value={item.get("storeName")}>{item.get("storeName")}</option>)
    })
    return(
      <select id="Stores">
                  {allStores}
      </select>
    )
  },
})

module.exports=Total;
