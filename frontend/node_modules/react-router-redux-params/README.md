# react-router-redux-params

Provides extra methods for [react-router-redux](https://github.com/reactjs/react-router-redux) which store [react-router](https://github.com/reactjs/react-router) route params in addition to history location object.

You won't need this if you're only accessing route params inside your components, react-router already provides params as a prop. This is meant for usage outside component tree, for example with [refire](https://github.com/hoppula/refire).

**NOTE** This hasn't been tested with [redux-devtools](https://github.com/gaearon/redux-devtools), breakage might ensue.

## Usage

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { Router, Route, browserHistory } from 'react-router'
import { syncHistory, syncParams, routeParamsReducer } from 'react-router-redux-params'
import reducers from '<project-path>/reducers'

const routes = (
  <Route path="foo" component={Foo}/>
  <Route path="bar" component={Bar}/>
)

const reducer = combineReducers(Object.assign({}, reducers, {
  routing: routeParamsReducer
}))

// Sync dispatched route actions to the history
const createStoreWithMiddleware = applyMiddleware(
  syncHistory(browserHistory)
)(createStore)

const store = createStoreWithMiddleware(reducer)
// syncParams also accepts custom action creator as fourth parameter, see src/index.js for more info
syncParams(store, routes, browserHistory)

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        {routes}
      </Route>
    </Router>
  </Provider>,
  document.getElementById('mount')
)
```

## License

MIT
