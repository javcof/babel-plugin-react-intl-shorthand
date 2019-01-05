import React from 'react';
import { IntlProvider } from 'react-intl';
import { Router, Route, Switch } from 'dva/router';
import IndexPage from './routes/IndexPage';

function RouterConfig({ history }) {
  return (
    <IntlProvider>
      <Router history={history}>
        <Switch>
          <Route path="/" exact component={IndexPage} />
        </Switch>
      </Router>
    </IntlProvider>
  );
}

export default RouterConfig;
