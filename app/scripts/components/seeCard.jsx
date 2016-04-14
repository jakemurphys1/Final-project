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
    var curName = this.props.curId;
    var cardFound=false;
    $.getJSON('https://api.deckbrew.com/mtg/cards?name=' + curName, function (data) {

              for(var i =0;i<data.length;i++){
                if(data[i].name.toLowerCase()==curName.toLowerCase()){
                  cardFound=true;
                    this.setState({"curImage":data[i].editions[0].image_url})
                }
              }
      }.bind(this));
    },
  render:function(){

      var self=this;

    return(
        <div className="row seeCard">
          <div className="row">
            <h1>{this.props.curId}</h1>
            <h4>Image is a stock image of the card, and does not reflect any real card. Image may be different based on edition.</h4>
            <div className="col-md-6 col-md-offset-4"><img src={this.state.curImage}  />
              <p>Images and card information courtesy of <a href ="https://deckbrew.com/">deckbrew.com</a></p>
            </div>
        </div>
      </div>
      )
  },

})

module.exports=searchCard;
