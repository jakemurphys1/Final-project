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
    "setInfo":[],
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
          //       var setInfo = [];
          // for(var i =0;i<results.length;i++){
          //   totalQty+=parseInt(results[i].get("Qty"));
          //   setInfo.push({"Set":results[i].get("Set"),"Qty":results[i].get("Qty"),"Foil":results[i].get("Foil"),"Promo":results[i].get("Promo")})
          // }
          // self.setState({"setQty":setInfo})
          // self.setState({"totalQty":totalQty})
        }
        })
  },
  handleRemove:function(){
    console.log(this.props.id)

    var CardBase = Parse.Object.extend("Cards");
    var query = new Parse.Query(CardBase);
    query.get(id, {
      success: function(myObj) {
        // The object was retrieved successfully.
        myObj.destroy({});
      },
      error: function(object, error) {
        // The object was not retrieved successfully.
        // error is a Parse.Error with an error code and description.
      }
    });

  },
  render:function(){
    var self = this;
    var allCards = this.state.setInfo.map(function(item){
      return(<IndivCard parent={self} item = {item} id={item.id} key={item.id}/>)
    })
    return(
      <div className="ownerCards ">
      <h3>Cards for sale</h3>
      <div className="col-md-6">{allCards}</div>


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
            <span className="buttonContainer"><button id={this.props.item.id} onClick={this.props.parent.handleRemove} className="btn btn-danger">Remove</button><button onClick={this.handleDecrease} className="btn btn-danger">Decrease by 1</button></span>
      </p>
    )
  },
})

module.exports=Total;
