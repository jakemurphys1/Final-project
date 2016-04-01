var React = require("react");
var ReactDOM=require("react-dom");

var Total= React.createClass({
  render:function(){
    return(
      <div className="ownerCards">
      <h3>Cards for sale</h3>
      <div className="col-md-6 col-xs-12">


      <form onSubmit={this.handleAddCard} id="eventForm" action="" className="form-events">

                <div className="row"><label>Card Name</label></div>
                <input id="cardName" type="text" name="cardName" placeholder="Name"/>
                <div id="setContainer">
                  <div className="row"><label>Set</label></div>
                  <input id="cardSet" type="text" name="cardSet" placeholder="Ravnica, Innistrad, ect."/>
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
            <div className="row"><button type="submit" className="btn btn-lg btn-block btn-primary signinbutton">Add</button></div>
          </div>
      </form>
        </div>

          <div className="col-md-6 col-xs-12">
            <h3>Multilate</h3>
            <img src= "images/Magic_Back.jpg" />
          </div>

      </div>
    )
  },

})

module.exports=Total;
