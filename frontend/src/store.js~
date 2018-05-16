import {applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";
import {createLogger} from "redux-logger";
import promise from "redux-promise-middleware";
import reducers from "./reducers";
import {GetMyStats} from "./actions/statAction";

const middleware = applyMiddleware(promise(), thunk, createLogger());

const store =  createStore(reducers, middleware);

export default store;
