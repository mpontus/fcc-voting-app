import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, browserHistory} from 'react-router';
import App from './containers/App';
import IndexContainer from './containers/Index';
import FormContainer from './containers/Form';
import PollContainer from './containers/Poll';

const routes = <Route component={App}>
  <Route path="/" component={IndexContainer} />
  <Route path="/polls/new" component={FormContainer} />
  <Route path="/polls/:pollId" component={PollContainer} />
</Route>;

ReactDOM.render(
  <Router history={browserHistory}>{routes}</Router>,
  document.getElementById('app')
);
