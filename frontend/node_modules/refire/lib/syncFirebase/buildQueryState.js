"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports["default"] = buildQueryState;

function buildQueryState() {
  var state = {};
  return {
    orderByChild: function orderByChild(order) {
      state = _extends({}, state, { orderByChild: order });
      return this;
    },
    orderByKey: function orderByKey(order) {
      state = _extends({}, state, { orderByKey: order });
      return this;
    },
    orderByValue: function orderByValue(order) {
      state = _extends({}, state, { orderByValue: order });
      return this;
    },
    orderByPriority: function orderByPriority(order) {
      state = _extends({}, state, { orderByPriority: order });
      return this;
    },
    startAt: function startAt(start) {
      state = _extends({}, state, { startAt: start });
      return this;
    },
    endAt: function endAt(end) {
      state = _extends({}, state, { endAt: end });
      return this;
    },
    equalTo: function equalTo(_equalTo) {
      state = _extends({}, state, { equalTo: _equalTo });
      return this;
    },
    limitToFirst: function limitToFirst(limit) {
      state = _extends({}, state, { limitToFirst: limit });
      return this;
    },
    limitToLast: function limitToLast(limit) {
      state = _extends({}, state, { limitToLast: limit });
      return this;
    },
    getState: function getState() {
      return state;
    }
  };
}

module.exports = exports["default"];