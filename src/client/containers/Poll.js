import React from 'react';

export default React.createClass({
  getInitialState: function() {
    return {
      poll: null,
      fetched: false,
      newChoiceValue: "",
      newChoiceSelected: false,
    };
  },

  componentDidMount: function() {
    fetch(`/api/polls/${this.props.params.pollId}`, {
      credentials: 'include',
    }).then((response) => {
      return response.json();
    }).then((data) => {
      this.setState({
        ...data,
        fetched: true
      });
    });
  },

  handleChoice: function(e) {
    var newChoice = e.target.value;

    this.setState({
      newChoiceSelected: false,
      newChoiceValue: "",
      myChoice: newChoice,
    });

    this.submitVote(newChoice);
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

  handleNewChoiceSubmit: function(e) {
    e.target.blur();

    var newChoice = e.target.value;

    this.setState({
      poll: {
        ...this.state.poll,
        options: [
          ...this.state.poll.options,
          newChoice
        ],
      },
      newChoiceSelected: false,
      newChoiceValue: "",
      myChoice: newChoice,
    });

    this.submitVote(newChoice);
  },

  submitVote: function(choice) {
    var query = new URLSearchParams();
    query.append('pollId', this.state.poll.id);
    query.append('choice', choice);
    fetch('/api/votes', {
      method: 'post',
      body: query,
      credentials: 'include',
    }).then(response => response.json())
      .then(data => {
        this.setState(data);
      })
      .catch(err => {
        console.warn(err);
      });
  },

  render: function() {
    return <div>
      {this.state.poll && (
       <div>
         <h3>{this.state.poll.question}</h3>
         {this.state.poll.options.map((option, i) =>
           <p key={i}>
             <label>
               <input type="radio" name="choice" value={option} onChange={this.handleChoice}
                 checked={!this.state.newChoiceSelected && this.state.myChoice === option} />
               <span>{option}</span> <span>{this.state.poll.votes[option] || 0}</span>
             </label>
           </p>
          )}
           <p>
             <label>
               <input type="radio" name="choice" value=""
                 checked={this.state.newChoiceSelected} />
               <input type="text"
                 value={this.state.newChoiceValue}
                 onFocus={this.handleNewChoiceSelect}
                 onChange={this.handleNewChoiceChange}
                 onKeyDown={(e) => e.keyCode === 13 && this.handleNewChoiceSubmit(e)} />
             </label>
           </p>
       </div>
      )}
    </div>;
  }
});
