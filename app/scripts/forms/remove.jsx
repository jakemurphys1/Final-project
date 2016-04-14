var React = require("react");
var ReactDOM=require("react-dom");
var Backbone = require("backbone");
var $ = require("jquery");
var Input = require("react-bootstrap/lib/Input");
var Parse = require("parse");

var Total= React.createClass({
  getInitialState:function(){
    return {
      "setInfo":[],
      "searchCard":""
    }
  },
  componentDidMount(){
    //find card info from parse
    var currentUser = Parse.User.current();
    var Card = Parse.Object.extend("Cards");
    var cardQuery = new Parse.Query(Card);
      cardQuery.equalTo("userName", currentUser.getUsername());
      var totalQty=0;
      var self = this;

      cardQuery.find({
        success: function(results) {
          self.setState({"setInfo":results})
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
  handleIncrease:function(e){
    var curId = e.currentTarget.id;
    var self=this;
    var Card = Parse.Object.extend("Cards");

       var query = new Parse.Query(Card);
           query.equalTo("objectId", curId);
       query.first({
           success: function(card) {

                  card.set('Qty',(parseInt(card.get("Qty"))+1).toString())
                  card.save();
                  self.forceUpdate()


           }
       });

  },
  handleDecrease:function(e){
    var curId = e.currentTarget.id;
    var self=this;
    var Card = Parse.Object.extend("Cards");

       var query = new Parse.Query(Card);
           query.equalTo("objectId", curId);
       query.first({
           success: function(card) {
                if(card.get("Qty")<=1){
                      card.destroy({});
                      var setInfo = self.state.setInfo.filter(function(item){
                      return(item.id!=curId)
                      })
                      self.setState({"setInfo":setInfo})
                } else{
                  card.set('Qty',(parseInt(card.get("Qty"))-1).toString())
                  card.save();
                  self.forceUpdate()
                }

           }
       });

  },
  handleSearch:function(e){
    e.preventDefault();
    var cardName = $("#cardName").val();
    this.setState({"searchCard":cardName})
  },
  render:function(){
    var self = this;
    var count=0
    var oddCards = [];
    var allCards = this.state.setInfo.map(function(item){
      count+=1;
      if(self.state.searchCard =="" || self.state.searchCard==item.get("Name")){
        if((count/2)==parseInt(count/2)){
            return(<IndivCard parent={self} item = {item} id={item.id} key={item.id}/>)
        }
            oddCards.push(<IndivCard parent={self} item = {item} id={item.id} key={item.id}/>)
      }
    })
    return(
      <div className="ownerCards infoContainer row">
      <h2>Cards for sale</h2>
      <div className="col-md-2">

        <div>
              <h3>Search by Card</h3>
          <form onSubmit={this.handleSearch}>
            <input id="cardName" type="text" name="cardName" placeholder="Name of Card"/>
            <p><button className="btn btn-primary Search">Search</button></p>
          </form>
        </div>


      </div>
      <div className="col-md-5">{allCards}</div>
      <div className="col-md-5">{oddCards}</div>

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
    return(<div id={this.props.id} className="removeCard row">
            <div className="col-md-7">
                <span>{this.props.item.get("Qty")} <b><a href={"#seeCard/"+this.props.item.get("Name")}>{this.props.item.get("Name")}</a></b>-{this.props.item.get("Set")} {foil}{promo}</span>
            </div>
            <div className="col-md-5">
              <span className="buttonContainer"><button id={this.props.item.id} onClick={this.props.parent.handleRemove} className="btn btn-danger">Remove</button>
              <button id={this.props.item.id} onClick={this.props.parent.handleDecrease} className="btn btn-danger">- 1</button>
              <button id={this.props.item.id} onClick={this.props.parent.handleIncrease} className="btn btn-danger">+ 1</button>
              </span>
            </div>
      </div>
    )
  },
})

module.exports=Total;
