import React from 'react';
import {browserHistory} from 'react-router';
import MultipleInput from '../components/MultipleInput';

export default React.createClass({
  displayName: 'Form',

  getInitialState: function() {
    return {
      question: '',
      options: [],
    };
  },
  handleQuestionChange: function(e) {
    this.setState({
      question: e.target.value
    });
  },
  handleOptionsChange: function(values) {
    this.setState({
      options: values,
    });
  },
  handleSubmit: function(e) {
    e.preventDefault();

    if (!this.state.question.trim()) {
      return this.setState({
        error: "Question cannot be empty",
      });
    }

    if (this.getFilteredOptions().length < 2) {
      console.log(this.getFilteredOptions());
      return this.setState({
        error: "Poll must have at least 2 options",
      });
    }

    var query = new URLSearchParams;

    query.append('question', this.state.question.trim());

    this.getFilteredOptions().forEach(function(option) {
      query.append('options[]', option);
    });

    fetch('/api/polls', {
      method: 'post',
      body: this.serializeState(),
    }).then(response => response.json())
      .then((data) => {
        browserHistory.push(`/polls/${data.poll.id}`);
      });
  },
  getFilteredOptions: function() {
    return this.state.options.filter(function(option) {
      return !!option.trim();
    });
  },
  serializeState: function() {
    var query = new URLSearchParams();
    query.append('question', this.state.question);
    this.state.options.forEach(function(v) {
      query.append('options[]', v);
    });
    return query;
  },
  render: function() {
    return <form ref={(c) => this._form = c} onSubmit={this.handleSubmit}>
      {this.state.error &&
       <div className="error">{this.state.error}</div>
      }
      <div>
        <label>Question</label>
      </div>
      <div>
        <input type="text" onChange={this.handleQuestionChange} />
      </div>
      <div>
        <label>Options</label>
      </div>
      <MultipleInput
        values={this.getFilteredOptions()}
        onChange={this.handleOptionsChange} />
      <div>
        <input type="submit" />
      </div>
    </form>;
  }
});
