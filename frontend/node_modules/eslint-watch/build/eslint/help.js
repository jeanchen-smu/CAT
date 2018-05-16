'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = eslintHelp;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _cli = require('./cli');

var _cli2 = _interopRequireDefault(_cli);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = (0, _logger2.default)('eslint-help');
logger.debug('Loaded');

var namedOption = /^--/;

function parseNo(option, str) {
  if (!str) return;

  var cmd = str.replace('--', '');
  if (/no-/.test(cmd)) {
    logger.debug('Parsing no option', str);
    cmd = cmd.replace('no-', '');
    option.default = 'true';
  }
  option.option = cmd;
  return option;
}

function parseDouble(arr) {
  var description = _lodash2.default.without(arr.slice(2), '').join(' ');
  return {
    option: arr[0].replace('--', ''),
    type: 'Boolean',
    alias: arr[1].replace('--', ''),
    description: description
  };
}

function parseRegular(arr) {
  logger.debug('Parsing %s', arr[0]);
  if (!arr[0]) {
    return;
  }
  var optionText = arr[0];
  var type = arr[1] || 'Boolean';
  var option = {};
  option = parseNo(option, optionText);

  option.type = type;

  var helpText = _lodash2.default.without(arr, optionText, type, '');

  var description = helpText.join(' ');
  if (description) {
    option.description = description;
  }
  return option;
}

function parseAlias(arr) {
  var alias = arr[0];
  logger.debug('Alias found: %s', alias);
  var option = parseRegular(_lodash2.default.without(arr, alias));

  if (alias) {
    option.alias = alias.replace('-', '');
  }
  return option;
}

function createOption(arr) {
  var option = void 0;

  if (namedOption.test(arr[0]) && namedOption.test(arr[1])) {
    // no alias defaulted boolean
    option = parseDouble(arr);
  } else if (namedOption.test(arr[0]) && !namedOption.test(arr[1])) {
    // just a no alias
    option = parseRegular(arr);
  } else {
    // aliased or other
    option = parseAlias(arr);
  }
  var isEmpty = _lodash2.default.isEmpty(option);
  return isEmpty ? undefined : option;
}

function parseHelp(helpText) {
  var helpArr = helpText.split('\n');
  var newArr = [];
  var previousLine = [];
  _lodash2.default.each(helpArr, function (row, index) {
    if (index <= 2) {
      return;
    } else {
      var str = row.replace(',', '');
      var arr = str.trim().split(' ');
      if (str.indexOf('-') >= 0 && previousLine[0] !== '') {
        var option = createOption(arr);
        if (option && option.option !== 'format' && option.option !== 'help') {
          newArr.push(option);
        }
      }
      previousLine = arr;
    }
  });
  return newArr;
}

function eslintHelp() {
  logger.debug('Executing help');
  var result = (0, _cli2.default)(['--help'], { stdio: [process.stdin, null, process.stderr] });
  if (!result.message) {
    throw new Error('Help text not received from Eslint.');
  }
  var eslintOptions = parseHelp(result.message);
  return eslintOptions;
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lc2xpbnQvaGVscC5qcyJdLCJuYW1lcyI6WyJlc2xpbnRIZWxwIiwibG9nZ2VyIiwiZGVidWciLCJuYW1lZE9wdGlvbiIsInBhcnNlTm8iLCJvcHRpb24iLCJzdHIiLCJjbWQiLCJyZXBsYWNlIiwidGVzdCIsImRlZmF1bHQiLCJwYXJzZURvdWJsZSIsImFyciIsImRlc2NyaXB0aW9uIiwid2l0aG91dCIsInNsaWNlIiwiam9pbiIsInR5cGUiLCJhbGlhcyIsInBhcnNlUmVndWxhciIsIm9wdGlvblRleHQiLCJoZWxwVGV4dCIsInBhcnNlQWxpYXMiLCJjcmVhdGVPcHRpb24iLCJpc0VtcHR5IiwidW5kZWZpbmVkIiwicGFyc2VIZWxwIiwiaGVscEFyciIsInNwbGl0IiwibmV3QXJyIiwicHJldmlvdXNMaW5lIiwiZWFjaCIsInJvdyIsImluZGV4IiwidHJpbSIsImluZGV4T2YiLCJwdXNoIiwicmVzdWx0Iiwic3RkaW8iLCJwcm9jZXNzIiwic3RkaW4iLCJzdGRlcnIiLCJtZXNzYWdlIiwiRXJyb3IiLCJlc2xpbnRPcHRpb25zIl0sIm1hcHBpbmdzIjoiOzs7OztrQkFxR3dCQSxVOztBQXJHeEI7Ozs7QUFFQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQyxTQUFTLHNCQUFPLGFBQVAsQ0FBZjtBQUNBQSxPQUFPQyxLQUFQLENBQWEsUUFBYjs7QUFFQSxJQUFNQyxjQUFjLEtBQXBCOztBQUVBLFNBQVNDLE9BQVQsQ0FBaUJDLE1BQWpCLEVBQXlCQyxHQUF6QixFQUE2QjtBQUMzQixNQUFHLENBQUNBLEdBQUosRUFBUzs7QUFFVCxNQUFJQyxNQUFNRCxJQUFJRSxPQUFKLENBQVksSUFBWixFQUFrQixFQUFsQixDQUFWO0FBQ0EsTUFBRyxNQUFNQyxJQUFOLENBQVdGLEdBQVgsQ0FBSCxFQUFtQjtBQUNqQk4sV0FBT0MsS0FBUCxDQUFhLG1CQUFiLEVBQWtDSSxHQUFsQztBQUNBQyxVQUFNQSxJQUFJQyxPQUFKLENBQVksS0FBWixFQUFtQixFQUFuQixDQUFOO0FBQ0FILFdBQU9LLE9BQVAsR0FBaUIsTUFBakI7QUFDRDtBQUNETCxTQUFPQSxNQUFQLEdBQWdCRSxHQUFoQjtBQUNBLFNBQU9GLE1BQVA7QUFDRDs7QUFFRCxTQUFTTSxXQUFULENBQXFCQyxHQUFyQixFQUF5QjtBQUN2QixNQUFJQyxjQUFjLGlCQUFFQyxPQUFGLENBQVVGLElBQUlHLEtBQUosQ0FBVSxDQUFWLENBQVYsRUFBdUIsRUFBdkIsRUFBMkJDLElBQTNCLENBQWdDLEdBQWhDLENBQWxCO0FBQ0EsU0FBTztBQUNMWCxZQUFRTyxJQUFJLENBQUosRUFBT0osT0FBUCxDQUFlLElBQWYsRUFBcUIsRUFBckIsQ0FESDtBQUVMUyxVQUFNLFNBRkQ7QUFHTEMsV0FBT04sSUFBSSxDQUFKLEVBQU9KLE9BQVAsQ0FBZSxJQUFmLEVBQXFCLEVBQXJCLENBSEY7QUFJTEssaUJBQWFBO0FBSlIsR0FBUDtBQU1EOztBQUVELFNBQVNNLFlBQVQsQ0FBc0JQLEdBQXRCLEVBQTBCO0FBQ3hCWCxTQUFPQyxLQUFQLENBQWEsWUFBYixFQUEyQlUsSUFBSSxDQUFKLENBQTNCO0FBQ0EsTUFBRyxDQUFDQSxJQUFJLENBQUosQ0FBSixFQUFXO0FBQ1Q7QUFDRDtBQUNELE1BQUlRLGFBQWFSLElBQUksQ0FBSixDQUFqQjtBQUNBLE1BQUlLLE9BQU9MLElBQUksQ0FBSixLQUFVLFNBQXJCO0FBQ0EsTUFBSVAsU0FBUyxFQUFiO0FBQ0FBLFdBQVNELFFBQVFDLE1BQVIsRUFBZ0JlLFVBQWhCLENBQVQ7O0FBRUFmLFNBQU9ZLElBQVAsR0FBY0EsSUFBZDs7QUFFQSxNQUFJSSxXQUFXLGlCQUFFUCxPQUFGLENBQVVGLEdBQVYsRUFBZVEsVUFBZixFQUEyQkgsSUFBM0IsRUFBaUMsRUFBakMsQ0FBZjs7QUFFQSxNQUFJSixjQUFjUSxTQUFTTCxJQUFULENBQWMsR0FBZCxDQUFsQjtBQUNBLE1BQUdILFdBQUgsRUFBZTtBQUNiUixXQUFPUSxXQUFQLEdBQXFCQSxXQUFyQjtBQUNEO0FBQ0QsU0FBT1IsTUFBUDtBQUNEOztBQUVELFNBQVNpQixVQUFULENBQW9CVixHQUFwQixFQUF3QjtBQUN0QixNQUFJTSxRQUFRTixJQUFJLENBQUosQ0FBWjtBQUNBWCxTQUFPQyxLQUFQLENBQWEsaUJBQWIsRUFBZ0NnQixLQUFoQztBQUNBLE1BQUliLFNBQVNjLGFBQWEsaUJBQUVMLE9BQUYsQ0FBVUYsR0FBVixFQUFlTSxLQUFmLENBQWIsQ0FBYjs7QUFFQSxNQUFHQSxLQUFILEVBQVM7QUFDUGIsV0FBT2EsS0FBUCxHQUFlQSxNQUFNVixPQUFOLENBQWMsR0FBZCxFQUFrQixFQUFsQixDQUFmO0FBQ0Q7QUFDRCxTQUFPSCxNQUFQO0FBQ0Q7O0FBRUQsU0FBU2tCLFlBQVQsQ0FBc0JYLEdBQXRCLEVBQTBCO0FBQ3hCLE1BQUlQLGVBQUo7O0FBRUEsTUFBR0YsWUFBWU0sSUFBWixDQUFpQkcsSUFBSSxDQUFKLENBQWpCLEtBQTRCVCxZQUFZTSxJQUFaLENBQWlCRyxJQUFJLENBQUosQ0FBakIsQ0FBL0IsRUFBd0Q7QUFBRztBQUN6RFAsYUFBU00sWUFBWUMsR0FBWixDQUFUO0FBQ0QsR0FGRCxNQUVPLElBQUdULFlBQVlNLElBQVosQ0FBaUJHLElBQUksQ0FBSixDQUFqQixLQUE0QixDQUFDVCxZQUFZTSxJQUFaLENBQWlCRyxJQUFJLENBQUosQ0FBakIsQ0FBaEMsRUFBeUQ7QUFBRTtBQUNoRVAsYUFBU2MsYUFBYVAsR0FBYixDQUFUO0FBQ0QsR0FGTSxNQUVBO0FBQUM7QUFDTlAsYUFBU2lCLFdBQVdWLEdBQVgsQ0FBVDtBQUNEO0FBQ0QsTUFBSVksVUFBVSxpQkFBRUEsT0FBRixDQUFVbkIsTUFBVixDQUFkO0FBQ0EsU0FBT21CLFVBQVVDLFNBQVYsR0FBc0JwQixNQUE3QjtBQUNEOztBQUVELFNBQVNxQixTQUFULENBQW1CTCxRQUFuQixFQUE0QjtBQUMxQixNQUFJTSxVQUFVTixTQUFTTyxLQUFULENBQWUsSUFBZixDQUFkO0FBQ0EsTUFBSUMsU0FBUyxFQUFiO0FBQ0EsTUFBSUMsZUFBZSxFQUFuQjtBQUNBLG1CQUFFQyxJQUFGLENBQU9KLE9BQVAsRUFBZ0IsVUFBU0ssR0FBVCxFQUFjQyxLQUFkLEVBQW9CO0FBQ2xDLFFBQUdBLFNBQVMsQ0FBWixFQUFjO0FBQ1o7QUFDRCxLQUZELE1BRU87QUFDTCxVQUFJM0IsTUFBTTBCLElBQUl4QixPQUFKLENBQVksR0FBWixFQUFpQixFQUFqQixDQUFWO0FBQ0EsVUFBSUksTUFBTU4sSUFBSTRCLElBQUosR0FBV04sS0FBWCxDQUFpQixHQUFqQixDQUFWO0FBQ0EsVUFBR3RCLElBQUk2QixPQUFKLENBQVksR0FBWixLQUFvQixDQUFwQixJQUF5QkwsYUFBYSxDQUFiLE1BQW9CLEVBQWhELEVBQW1EO0FBQ2pELFlBQUl6QixTQUFTa0IsYUFBYVgsR0FBYixDQUFiO0FBQ0EsWUFBR1AsVUFBVUEsT0FBT0EsTUFBUCxLQUFrQixRQUE1QixJQUF3Q0EsT0FBT0EsTUFBUCxLQUFrQixNQUE3RCxFQUFvRTtBQUNsRXdCLGlCQUFPTyxJQUFQLENBQVkvQixNQUFaO0FBQ0Q7QUFDRjtBQUNEeUIscUJBQWVsQixHQUFmO0FBQ0Q7QUFDRixHQWREO0FBZUEsU0FBT2lCLE1BQVA7QUFDRDs7QUFFYyxTQUFTN0IsVUFBVCxHQUFxQjtBQUNsQ0MsU0FBT0MsS0FBUCxDQUFhLGdCQUFiO0FBQ0EsTUFBTW1DLFNBQVMsbUJBQU8sQ0FBQyxRQUFELENBQVAsRUFBbUIsRUFBRUMsT0FBTyxDQUFFQyxRQUFRQyxLQUFWLEVBQWlCLElBQWpCLEVBQXVCRCxRQUFRRSxNQUEvQixDQUFULEVBQW5CLENBQWY7QUFDQSxNQUFHLENBQUNKLE9BQU9LLE9BQVgsRUFBbUI7QUFDakIsVUFBTSxJQUFJQyxLQUFKLENBQVUscUNBQVYsQ0FBTjtBQUNEO0FBQ0QsTUFBTUMsZ0JBQWdCbEIsVUFBVVcsT0FBT0ssT0FBakIsQ0FBdEI7QUFDQSxTQUFPRSxhQUFQO0FBQ0QiLCJmaWxlIjoiaGVscC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5cbmltcG9ydCBMb2dnZXIgZnJvbSAnLi4vbG9nZ2VyJztcbmltcG9ydCBlc2xpbnQgZnJvbSAnLi9jbGknO1xuXG5jb25zdCBsb2dnZXIgPSBMb2dnZXIoJ2VzbGludC1oZWxwJyk7XG5sb2dnZXIuZGVidWcoJ0xvYWRlZCcpO1xuXG5jb25zdCBuYW1lZE9wdGlvbiA9IC9eLS0vO1xuXG5mdW5jdGlvbiBwYXJzZU5vKG9wdGlvbiwgc3RyKXtcbiAgaWYoIXN0cikgcmV0dXJuO1xuXG4gIGxldCBjbWQgPSBzdHIucmVwbGFjZSgnLS0nLCAnJyk7XG4gIGlmKC9uby0vLnRlc3QoY21kKSl7XG4gICAgbG9nZ2VyLmRlYnVnKCdQYXJzaW5nIG5vIG9wdGlvbicsIHN0cik7XG4gICAgY21kID0gY21kLnJlcGxhY2UoJ25vLScsICcnKTtcbiAgICBvcHRpb24uZGVmYXVsdCA9ICd0cnVlJztcbiAgfVxuICBvcHRpb24ub3B0aW9uID0gY21kO1xuICByZXR1cm4gb3B0aW9uO1xufVxuXG5mdW5jdGlvbiBwYXJzZURvdWJsZShhcnIpe1xuICBsZXQgZGVzY3JpcHRpb24gPSBfLndpdGhvdXQoYXJyLnNsaWNlKDIpLCcnKS5qb2luKCcgJyk7XG4gIHJldHVybiB7XG4gICAgb3B0aW9uOiBhcnJbMF0ucmVwbGFjZSgnLS0nLCAnJyksXG4gICAgdHlwZTogJ0Jvb2xlYW4nLFxuICAgIGFsaWFzOiBhcnJbMV0ucmVwbGFjZSgnLS0nLCAnJyksXG4gICAgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uXG4gIH07XG59XG5cbmZ1bmN0aW9uIHBhcnNlUmVndWxhcihhcnIpe1xuICBsb2dnZXIuZGVidWcoJ1BhcnNpbmcgJXMnLCBhcnJbMF0pO1xuICBpZighYXJyWzBdKXtcbiAgICByZXR1cm47XG4gIH1cbiAgbGV0IG9wdGlvblRleHQgPSBhcnJbMF07XG4gIGxldCB0eXBlID0gYXJyWzFdIHx8ICdCb29sZWFuJztcbiAgbGV0IG9wdGlvbiA9IHt9O1xuICBvcHRpb24gPSBwYXJzZU5vKG9wdGlvbiwgb3B0aW9uVGV4dCk7XG5cbiAgb3B0aW9uLnR5cGUgPSB0eXBlO1xuXG4gIGxldCBoZWxwVGV4dCA9IF8ud2l0aG91dChhcnIsIG9wdGlvblRleHQsIHR5cGUsICcnKTtcblxuICBsZXQgZGVzY3JpcHRpb24gPSBoZWxwVGV4dC5qb2luKCcgJyk7XG4gIGlmKGRlc2NyaXB0aW9uKXtcbiAgICBvcHRpb24uZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgfVxuICByZXR1cm4gb3B0aW9uO1xufVxuXG5mdW5jdGlvbiBwYXJzZUFsaWFzKGFycil7XG4gIGxldCBhbGlhcyA9IGFyclswXTtcbiAgbG9nZ2VyLmRlYnVnKCdBbGlhcyBmb3VuZDogJXMnLCBhbGlhcyk7XG4gIGxldCBvcHRpb24gPSBwYXJzZVJlZ3VsYXIoXy53aXRob3V0KGFyciwgYWxpYXMpKTtcblxuICBpZihhbGlhcyl7XG4gICAgb3B0aW9uLmFsaWFzID0gYWxpYXMucmVwbGFjZSgnLScsJycpO1xuICB9XG4gIHJldHVybiBvcHRpb247XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU9wdGlvbihhcnIpe1xuICBsZXQgb3B0aW9uO1xuXG4gIGlmKG5hbWVkT3B0aW9uLnRlc3QoYXJyWzBdKSAmJiBuYW1lZE9wdGlvbi50ZXN0KGFyclsxXSkpeyAgLy8gbm8gYWxpYXMgZGVmYXVsdGVkIGJvb2xlYW5cbiAgICBvcHRpb24gPSBwYXJzZURvdWJsZShhcnIpO1xuICB9IGVsc2UgaWYobmFtZWRPcHRpb24udGVzdChhcnJbMF0pICYmICFuYW1lZE9wdGlvbi50ZXN0KGFyclsxXSkpeyAvLyBqdXN0IGEgbm8gYWxpYXNcbiAgICBvcHRpb24gPSBwYXJzZVJlZ3VsYXIoYXJyKTtcbiAgfSBlbHNlIHsvLyBhbGlhc2VkIG9yIG90aGVyXG4gICAgb3B0aW9uID0gcGFyc2VBbGlhcyhhcnIpO1xuICB9XG4gIGxldCBpc0VtcHR5ID0gXy5pc0VtcHR5KG9wdGlvbik7XG4gIHJldHVybiBpc0VtcHR5ID8gdW5kZWZpbmVkIDogb3B0aW9uO1xufVxuXG5mdW5jdGlvbiBwYXJzZUhlbHAoaGVscFRleHQpe1xuICBsZXQgaGVscEFyciA9IGhlbHBUZXh0LnNwbGl0KCdcXG4nKTtcbiAgbGV0IG5ld0FyciA9IFtdO1xuICBsZXQgcHJldmlvdXNMaW5lID0gW107XG4gIF8uZWFjaChoZWxwQXJyLCBmdW5jdGlvbihyb3csIGluZGV4KXtcbiAgICBpZihpbmRleCA8PSAyKXtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IHN0ciA9IHJvdy5yZXBsYWNlKCcsJywgJycpO1xuICAgICAgbGV0IGFyciA9IHN0ci50cmltKCkuc3BsaXQoJyAnKTtcbiAgICAgIGlmKHN0ci5pbmRleE9mKCctJykgPj0gMCAmJiBwcmV2aW91c0xpbmVbMF0gIT09ICcnKXtcbiAgICAgICAgbGV0IG9wdGlvbiA9IGNyZWF0ZU9wdGlvbihhcnIpO1xuICAgICAgICBpZihvcHRpb24gJiYgb3B0aW9uLm9wdGlvbiAhPT0gJ2Zvcm1hdCcgJiYgb3B0aW9uLm9wdGlvbiAhPT0gJ2hlbHAnKXtcbiAgICAgICAgICBuZXdBcnIucHVzaChvcHRpb24pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBwcmV2aW91c0xpbmUgPSBhcnI7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG5ld0Fycjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZXNsaW50SGVscCgpe1xuICBsb2dnZXIuZGVidWcoJ0V4ZWN1dGluZyBoZWxwJyk7XG4gIGNvbnN0IHJlc3VsdCA9IGVzbGludChbJy0taGVscCddLCB7IHN0ZGlvOiBbIHByb2Nlc3Muc3RkaW4sIG51bGwsIHByb2Nlc3Muc3RkZXJyXSB9KTtcbiAgaWYoIXJlc3VsdC5tZXNzYWdlKXtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0hlbHAgdGV4dCBub3QgcmVjZWl2ZWQgZnJvbSBFc2xpbnQuJyk7XG4gIH1cbiAgY29uc3QgZXNsaW50T3B0aW9ucyA9IHBhcnNlSGVscChyZXN1bHQubWVzc2FnZSk7XG4gIHJldHVybiBlc2xpbnRPcHRpb25zO1xufTtcbiJdfQ==