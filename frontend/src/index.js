/* eslint-disable import/default */

import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import routes from './routes';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Provider } from "react-redux";
import store from './store.js';
require('./favicon.ico');
import './styles.scss';
import 'font-awesome/css/font-awesome.css';
import 'flexboxgrid/css/flexboxgrid.css';

injectTapEventPlugin();

store.subscribe(()=>{
    console.log(store.getState());
});

render(
    <Provider store={store}>
        <Router routes={routes} history={browserHistory} />
    </Provider>, document.getElementById('app')
);
