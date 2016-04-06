var React = require("react");
var ReactDOM=require("react-dom");
var Backbone = require("backbone");
var $ = require("jquery");
var Input = require("react-bootstrap/lib/Input");
var Parse = require("parse");

var Total= React.createClass({
  componentDidMount(){

  },
  getInitialState:function(){
  return {
    "curName":   "Magic: The Gathering",
    "curImage":"images/Magic_Back.jpg",
    "selectInput":<p></p>,
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
      $("#cardQty").val(1)

            //find card info from parse
            var currentUser = Parse.User.current();
            var Card = Parse.Object.extend("Cards");
            var cardQuery = new Parse.Query(Card);
              cardQuery.equalTo("userName", currentUser.getUsername());
              cardQuery.equalTo("Name", curName);
              var totalQty=0;
              var self = this;

              cardQuery.find({
                success: function(results) {
                        var setInfo = [];
                  for(var i =0;i<results.length;i++){
                    totalQty+=parseInt(results[i].get("Qty"));
                    setInfo.push({"Set":results[i].get("Set"),"Qty":results[i].get("Qty"),"Foil":results[i].get("Foil"),"Promo":results[i].get("Promo")})
                  }
                  self.setState({"setQty":setInfo})
                  self.setState({"totalQty":totalQty})


                },
                error: function(error) {
                  console.log("Step Server not find")
                }
            })

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
    var Cards = Parse.Object.extend("Cards");
    var cards = new Cards();

    var data = {
      "Name":$("#cardName").val(),
      "Set":$("#Sets").val(),
      "Condition":$("#cardCondition").val(),
      "Qty":$("#cardQty").val(),
      "Foil":foil,
      "Promo":promo,
      "date":Date.now(),
      "userName":currentUser.getUsername(),
      "storeName":this.props.storeName,
    }

  cards.save(data).then(function(object) {
      console.log(object)
  })

  $("#cardNameContainer").removeClass("hidden")
  $("#setContainer").addClass("hidden")
  $(".thisinfoContainer").addClass("hidden")
  this.setState(this.getInitialState());

},
  render:function(){
      var renderSets=this.state.sets.map(function(item){
        var setQty = 0;
        var foilQty = 0;
        var promoQty=0
        for(var j = 0;j<this.state.setQty.length;j++){
          if(item.set==this.state.setQty[j].Set){
            setQty+=parseInt(this.state.setQty[j].Qty);
            if(this.state.setQty[j].Foil){
              foilQty+=parseInt(this.state.setQty[j].Qty);
            }
            if(this.state.setQty[j].Promo){
              promoQty+=parseInt(this.state.setQty[j].Qty);
            }
          }
        }
        if(setQty > 0){
          return(<p>{setQty} from {item.set}   ({foilQty} Foil, {promoQty} Promo)</p>)
        }

      }.bind(this))



    return(
      <div className="ownerCards row infoContainer">
      <h3>Cards for sale</h3>


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
        </div>


            <div className="col-md-4 col-xs-12">
              <h3>You are currently selling {this.state.totalQty} copies of this card</h3>
              {renderSets}
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

module.exports=Total;
