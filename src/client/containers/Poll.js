import React from 'react';

export default React.createClass({
  getInitialState: function() {
    return {
      poll: {
        id: null,
        question: "",
        options: [],
      },
      votes: {},
      myChoice: null,
    };
  },

  componentDidMount: function() {
    fetch(`/api/polls/${this.props.params.pollId}`).then((response) => {
      return response.json();
    }).then((data) => {
      this.setState({
        poll: data.poll,
        votes: data.votes,
        myChoice: data.myChoice,
      });
    });
  },

  handleChoice: function(e) {
    this.setState({
      newChoiceSelected: false,
      newChoiceValue: "",
      myChoice: e.target.value,
    });

    var query = new URLSearchParams();
    query.append('pollId', this.state.poll.id);
  },

  handleNewChoiceSelect: function(e) {
    this.setState({
      newChoiceSelected: true,
      newChoiceValue: "",
      myChoice: null,
    });
  },

  handleNewChoiceChange: function(e) {
    this.setState({
      newChoiceValue: e.target.value,
    });
  },

  render: function() {
    return <div>
      <h3>{this.state.poll.question}</h3>
      {this.state.poll.options.map((option, i) =>
        <p key={i}>
          <label>
            <input type="radio" name="choice" value={option} onChange={this.handleChoice} 
              checked={!this.state.newChoiceSelected && this.state.myChoice === option} />
            <span>{option}</span>
          </label>
        </p>
      )}
        {this.state.poll.id &&
         <p>
           <label>
             <input type="radio" name="choice" ref={(c) => this._newChoice = this}
               checked={this.state.newChoiceSelected} />
             <input type="text"
               onFocus={this.handleNewChoiceSelect}
               onChange={this.handleNewChoiceChange}

             />
           </label>
         </p>
        }
    </div>;
  }
});
