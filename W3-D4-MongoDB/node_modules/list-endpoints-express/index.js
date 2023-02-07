'use strict';
/**
 *
 * Original code has been forked from https://github.com/AlbertoFdzM/express-list-endpoints
 * and I have made changes to make it more generic by taking into account an array of paths
 * and path variables.
 *
 */

var lodash = require('lodash');

let getRouteMethod = (route) => {
      var val = '';
      for (let method in route.methods) {
        if (method === '_all') {
          continue;
        }
        val = method.toUpperCase();
      }
      return val;
    },
    hasParams = (value) => {
      var regExp = /\(\?:\(\[\^\\\/]\+\?\)\)/g;
      return regExp.test(value);
    },
    replaceWithSlashRegex = /\\\/|\/\(\?:/g,
    replaceWithEmptyStringRegex = /\/\?\(\?=\/\|\$\)|\^\/|\)\/i|\/i/g,
    getDefinedPath = (expressPath) => {
      expressPath = expressPath.replace(replaceWithSlashRegex, '/')
        .replace(replaceWithEmptyStringRegex, '');
      return expressPath;
    },
    getEndpoints = (app, path, endpoints) => {
      let stack = app.stack || (app._router && app._router.stack);
      endpoints = endpoints || [];
      path = path || '';

      stack.forEach((val) => {
        if (val.route) {
          let method = getRouteMethod(val.route),
              endpoint = lodash.find(endpoints, (ep => {
                return ep.method === method;
              }));
          if (endpoint) {
            endpoint.paths.push(path + (path && val.route.path === '/' ? '' : val.route.path));
          } else {
            endpoints.push({
              method: method,
              paths: [path + (path && val.route.path === '/' ? '' : val.route.path)]
            });
          }

        } else if (val.name === 'router' || val.name === 'bound dispatch') {

          let pathArray = [],
              expressPath = val.regexp.toString(),
              keyIndex = 0;

          // insert the parameters in the uri
          while (hasParams(expressPath)) {
            expressPath = expressPath.toString().replace(/\(\?:\(\[\^\\\/]\+\?\)\)/, ':' + val.keys[keyIndex].name);
            keyIndex += 1;
          }
          expressPath = getDefinedPath(expressPath);
          pathArray = expressPath.split('|');

          pathArray.forEach(newPath => {
            if (newPath && (newPath.indexOf('/') != 0)) {
              newPath = '/' + newPath;
            }
            getEndpoints(val.handle, newPath, endpoints);
          });
        }
      });

      return endpoints;
    };

module.exports = getEndpoints;
