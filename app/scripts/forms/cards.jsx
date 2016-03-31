var React = require("react");
var ReactDOM=require("react-dom");

var Total=(
  <div>
  <h3>Cards</h3>
  <form onSubmit={this.handleSignup} id="eventForm" action="" className="form-events">
      <div className="col-md-6 info">
        <div className="row"><label>Card Name</label></div>
          <input id="eventName" type="text" name="eventName" placeholder="Event Name"/>
          <div className="row"><label>Format</label></div>
          <input id="eventFormat" type="text" name="eventFormat" placeholder="Standard, Modern, ect."/>
                <div className="row"><label>Date</label></div>
          <input id="eventDate" type="date" name="eventDate" placeholder="Event Date"/>

        <div className="row times">
                <div className="row"><label>Time</label></div>
          <input id="startTime" type="time" name="startTime" placeholder="Start Time"/>
          <input id="endTime" type="time" name="endTime" placeholder="End Time"/>
        </div>

      </div>
      <div className="col-md-6"><textarea id="Description" placeholder="Details of the event"></textarea></div>
  <button type="submit" className="btn btn-lg btn-block btn-primary signinbutton">Add</button>
  </form>
  </div>
)

module.exports=Total;
