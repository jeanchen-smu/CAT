"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var firebaseStateToProps = function firebaseStateToProps(state, localBindings) {
  return (localBindings || []).reduce(function (stateSlice, binding) {
    if (binding === "_status") {
      var _state$firebase = state.firebase;
      var initialValuesReceived = _state$firebase.initialValuesReceived;
      var stores = _state$firebase.stores;

      var slice = _objectWithoutProperties(_state$firebase, ["initialValuesReceived", "stores"]);

      stateSlice[binding] = slice;
    } else {
      stateSlice[binding] = state.firebase.stores[binding];
    }
    return stateSlice;
  }, {});
};

exports["default"] = function (firebaseBindings, mapStateToProps) {
  return function (state, ownProps) {
    var firebaseState = firebaseStateToProps(state, firebaseBindings);
    var mappedState = typeof mapStateToProps === "function" ? mapStateToProps(state, ownProps) : {};
    return _extends({}, mappedState, firebaseState);
  };
};

module.exports = exports["default"];