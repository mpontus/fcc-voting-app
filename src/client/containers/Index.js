import React from 'react';
import {Link} from 'react-router';

export default React.createClass({
  getInitialState: function() {
    return {
      polls: [],
    };
  },

  componentDidMount: function() {
    fetch('/api/polls').then((response) => {
      return response.json();
    }).then((data) => {
      this.setState({
        polls: data.polls,
      });
    });
  },

  render: function() {
    console.log(this.state.polls);
    return <div>
      {this.state.polls.map(poll =>
        <p><Link key={poll.id} to={`/polls/${poll.id}`}>{poll.question}</Link></p>
      )}
    </div>;
  }
});
