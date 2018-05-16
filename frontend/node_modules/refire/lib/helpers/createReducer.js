"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = createReducer;

function createReducer(initialState, handlers) {
  return function (state, action) {
    if (state === undefined) state = initialState;

    return handlers[action.type] ? handlers[action.type](state, action) : state;
  };
}

module.exports = exports["default"];