var React = require("react");
var ReactDOM=require("react-dom");
var Backbone = require("backbone");
var $ = require("jquery");
var Input = require("react-bootstrap/lib/Input");
var Parse = require("parse");

var Total= React.createClass({
  componentDidMount(){
    Parse.initialize("GLID");
    Parse.serverURL = 'http://gaminglocal.herokuapp.com'
  },
  getInitialState:function(){
  return {
    "curName":   "Magic: The Gathering",
    "curImage":"images/Magic_Back.jpg",
    "selectInput":<p></p>,
  }
},
handleSearch:function(e){
  e.preventDefault();

      var curName = $("#cardName").val();
      var cardFound=false;

      $.getJSON('https://api.deckbrew.com/mtg/cards?name=' + curName, function (data) {

                for(var i =0;i<data.length;i++){
                  if(data[i].name.toLowerCase()==curName.toLowerCase()){
                    $(".Search").addClass("hidden")
                    $("#setContainer").removeClass("hidden")
                    $(".infoContainer").removeClass("hidden")
                    cardFound=true;
                      this.setState({"selectInput": <SetSelect data={data[i].editions} />,"curName":data[i].name,"curImage":data[i].editions[0].image_url})

                    // for(var j =0;j<data[i].editions.length;j++){
                    //   if(data[i].editions[j].set.toLowerCase() == curSet.toLowerCase()){
                    //     this.setState({"curName":data[i].name,"curImage":data[i].editions[j].image_url})
                    //   }
                    // }

                  }

                }
        }.bind(this))

},
handleAddCard:function(e){
  e.preventDefault();
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
    }

  cards.save(data).then(function(object) {
      console.log(object)
  })


},
  render:function(){
    return(
      <div className="ownerCards">
      <h3>Cards for sale</h3>
      <div className="col-md-6 col-xs-12">


      <form id="cardForm" action="" className="form-events">

                <div className="row"><label>Card Name</label></div>
                <input id="cardName" type="text" name="cardName" placeholder="Name of Card"/>
                <p><button onClick={this.handleSearch} className="btn btn-primary Search">Search</button></p>
                <div id="setContainer" className="hidden">
                  <div className="row "><label>Set</label></div>
                  {this.state.selectInput}
                </div>

        <div className="infoContainer hidden">
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

          <div className="col-md-6 col-xs-12">
            <h3>{this.state.curName}</h3>
            <img src={this.state.curImage}  />
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
