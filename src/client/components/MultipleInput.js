import React from 'react';

export default React.createClass({
  getDefaultProps: function() {
    return {
      values: []
    };
  },
  handleExistingItemChange: function(i, e) {
    var newValues = this.props.values.slice();
    newValues[i] = e.target.value;
    this.props.onChange(newValues);
  },
  handleNewItemChange: function(e) {
    var newValues = this.props.values.slice();
    newValues.push(e.target.value);
    this.props.onChange(newValues);
  },
  render: function() {
    var items = this.props.values.slice();
    items.push("");
    return <div>
      {items.map((v, i) =>
        <div key={i}>
          <input type="text" value={v} onChange={e => this.handleExistingItemChange(i, e)} />
        </div>
       )}
    </div>;
  }
});

