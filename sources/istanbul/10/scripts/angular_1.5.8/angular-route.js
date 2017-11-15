/*! RESOURCE: /scripts/angular_1.5.8/angular-route.js */
(function(window, angular) {
  'use strict';

  function shallowCopy(src, dst) {
    if (isArray(src)) {
      dst = dst || [];
      for (var i = 0, ii = src.length; i < ii; i++) {
        dst[i] = src[i];
      }
    } else if (isObject(src)) {
      dst = dst || {};
      for (var key in src) {
        if (!(key.charAt(0) === '$' && key.charAt(1) === '$')) {
          dst[key] = src[key];
        }
      }
    }
    return dst || src;
  }
  var isArray;
  var isObject;
  var ngRouteModule = angular.module('ngRoute', ['ng']).
  provider('$route', $RouteProvider),
    $routeMinErr = angular.$$minErr('ngRoute');

  function $RouteProvider() {
    isArray = angular.isArray;
    isObject = angular.isObject;

    function inherit(parent, extra) {
      return angular.extend(Object.create(parent), extra);
    }
    var routes = {};
    this.when = function(path, route) {
      var routeCopy = shallowCopy(route);
      if (angular.isUndefined(routeCopy.reloadOnSearch)) {
        routeCopy.reloadOnSearch = true;
      }
      if (angular.isUndefined(routeCopy.caseInsensitiveMatch)) {
        routeCopy.caseInsensitiveMatch = this.caseInsensitiveMatch;
      }
      routes[path] = angular.extend(
        routeCopy,
        path && pathRegExp(path, routeCopy)
      );
      if (path) {
        var redirectPath = (path[path.length - 1] == '/') ?
          path.substr(0, path.length - 1) :
          path + '/';
        routes[redirectPath] = angular.extend({
            redirectTo: path
          },
          pathRegExp(redirectPath, routeCopy)
        );
      }
      return this;
    };
    this.caseInsensitiveMatch = false;

    function pathRegExp(path, opts) {
      var insensitive = opts.caseInsensitiveMatch,
        ret = {
          originalPath: path,
          regexp: path
        },
        keys = ret.keys = [];
      path = path
        .replace(/([().])/g, '\\$1')
        .replace(/(\/)?:(\w+)(\*\?|[\?\*])?/g, function(_, slash, key, option) {
          var optional = (option === '?' || option === '*?') ? '?' : null;
          var star = (option === '*' || option === '*?') ? '*' : null;
          keys.push({
            name: key,
            optional: !!optional
          });
          slash = slash || '';
          return '' +
            (optional ? '' : slash) +
            '(?:' +
            (optional ? slash : '') +
            (star && '(.+?)' || '([^/]+)') +
            (optional || '') +
            ')' +
            (optional || '');
        })
        .replace(/([\/$\*])/g, '\\$1');
      ret.regexp = new RegExp('^' + path + '$', insensitive ? 'i' : '');
      return ret;
    }
    this.otherwise = function(params) {
      if (typeof params === 'string') {
        params = {
          redirectTo: params
        };
      }
      this.when(null, params);
      return this;
    };
    this.$get = ['$rootScope',
      '$location',
      '$routeParams',
      '$q',
      '$injector',
      '$templateRequest',
      '$sce',
      function($rootScope, $location, $routeParams, $q, $injector, $templateRequest, $sce) {
        var forceReload = false,
          preparedRoute,
          preparedRouteIsUpdateOnly,
          $route = {
            routes: routes,
            reload: function() {
              forceReload = true;
              var fakeLocationEvent = {
                defaultPrevented: false,
                preventDefault: function fakePreventDefault() {
                  this.defaultPrevented = true;
                  forceReload = false;
                }
              };
              $rootScope.$evalAsync(function() {
                prepareRoute(fakeLocationEvent);
                if (!fakeLocationEvent.defaultPrevented) commitRoute();
              });
            },
            updateParams: function(newParams) {
              if (this.current && this.current.$$route) {
                newParams = angular.extend({}, this.current.params, newParams);
                $location.path(interpolate(this.current.$$route.originalPath, newParams));
                $location.search(newParams);
              } else {
                throw $routeMinErr('norout', 'Tried updating route when with no current route');
              }
            }
          };
        $rootScope.$on('$locationChangeStart', prepareRoute);
        $rootScope.$on('$locationChangeSuccess', commitRoute);
        return $route;

        function switchRouteMatcher(on, route) {
          var keys = route.keys,
            params = {};
          if (!route.regexp) return null;
          var m = route.regexp.exec(on);
          if (!m) return null;
          for (var i = 1, len = m.length; i < len; ++i) {
            var key = keys[i - 1];
            var val = m[i];
            if (key && val) {
              params[key.name] = val;
            }
          }
          return params;
        }

        function prepareRoute($locationEvent) {
          var lastRoute = $route.current;
          preparedRoute = parseRoute();
          preparedRouteIsUpdateOnly = preparedRoute && lastRoute && preparedRoute.$$route === lastRoute.$$route &&
            angular.equals(preparedRoute.pathParams, lastRoute.pathParams) &&
            !preparedRoute.reloadOnSearch && !forceReload;
          if (!preparedRouteIsUpdateOnly && (lastRoute || preparedRoute)) {
            if ($rootScope.$broadcast('$routeChangeStart', preparedRoute, lastRoute).defaultPrevented) {
              if ($locationEvent) {
                $locationEvent.preventDefault();
              }
            }
          }
        }

        function commitRoute() {
          var lastRoute = $route.current;
          var nextRoute = preparedRoute;
          if (preparedRouteIsUpdateOnly) {
            lastRoute.params = nextRoute.params;
            angular.copy(lastRoute.params, $routeParams);
            $rootScope.$broadcast('$routeUpdate', lastRoute);
          } else if (nextRoute || lastRoute) {
            forceReload = false;
            $route.current = nextRoute;
            if (nextRoute) {
              if (nextRoute.redirectTo) {
                if (angular.isString(nextRoute.redirectTo)) {
                  $location.path(interpolate(nextRoute.redirectTo, nextRoute.params)).search(nextRoute.params)
                    .replace();
                } else {
                  $location.url(nextRoute.redirectTo(nextRoute.pathParams, $location.path(), $location.search()))
                    .replace();
                }
              }
            }
            $q.when(nextRoute).
            then(resolveLocals).
            then(function(locals) {
              if (nextRoute == $route.current) {
                if (nextRoute) {
                  nextRoute.locals = locals;
                  angular.copy(nextRoute.params, $routeParams);
                }
                $rootScope.$broadcast('$routeChangeSuccess', nextRoute, lastRoute);
              }
            }, function(error) {
              if (nextRoute == $route.current) {
                $rootScope.$broadcast('$routeChangeError', nextRoute, lastRoute, error);
              }
            });
          }
        }

        function resolveLocals(route) {
          if (route) {
            var locals = angular.extend({}, route.resolve);
            angular.forEach(locals, function(value, key) {
              locals[key] = angular.isString(value) ?
                $injector.get(value) :
                $injector.invoke(value, null, null, key);
            });
            var template = getTemplateFor(route);
            if (angular.isDefined(template)) {
              locals['$template'] = template;
            }
            return $q.all(locals);
          }
        }

        function getTemplateFor(route) {
          var template, templateUrl;
          if (angular.isDefined(template = route.template)) {
            if (angular.isFunction(template)) {
              template = template(route.params);
            }
          } else if (angular.isDefined(templateUrl = route.templateUrl)) {
            if (angular.isFunction(templateUrl)) {
              templateUrl = templateUrl(route.params);
            }
            if (angular.isDefined(templateUrl)) {
              route.loadedTemplateUrl = $sce.valueOf(templateUrl);
              template = $templateRequest(templateUrl);
            }
          }
          return template;
        }

        function parseRoute() {
          var params, match;
          angular.forEach(routes, function(route, path) {
            if (!match && (params = switchRouteMatcher($location.path(), route))) {
              match = inherit(route, {
                params: angular.extend({}, $location.search(), params),
                pathParams: params
              });
              match.$$route = route;
            }
          });
          return match || routes[null] && inherit(routes[null], {
            params: {},
            pathParams: {}
          });
        }

        function interpolate(string, params) {
          var result = [];
          angular.forEach((string || '').split(':'), function(segment, i) {
            if (i === 0) {
              result.push(segment);
            } else {
              var segmentMatch = segment.match(/(\w+)(?:[?*])?(.*)/);
              var key = segmentMatch[1];
              result.push(params[key]);
              result.push(segmentMatch[2] || '');
              delete params[key];
            }
          });
          return result.join('');
        }
      }
    ];
  }
  ngRouteModule.provider('$routeParams', $RouteParamsProvider);

  function $RouteParamsProvider() {
    this.$get = function() {
      return {};
    };
  }
  ngRouteModule.directive('ngView', ngViewFactory);
  ngRouteModule.directive('ngView', ngViewFillContentFactory);
  ngViewFactory.$inject = ['$route', '$anchorScroll', '$animate'];

  function ngViewFactory($route, $anchorScroll, $animate) {
    return {
      restrict: 'ECA',
      terminal: true,
      priority: 400,
      transclude: 'element',
      link: function(scope, $element, attr, ctrl, $transclude) {
        var currentScope,
          currentElement,
          previousLeaveAnimation,
          autoScrollExp = attr.autoscroll,
          onloadExp = attr.onload || '';
        scope.$on('$routeChangeSuccess', update);
        update();

        function cleanupLastView() {
          if (previousLeaveAnimation) {
            $animate.cancel(previousLeaveAnimation);
            previousLeaveAnimation = null;
          }
          if (currentScope) {
            currentScope.$destroy();
            currentScope = null;
          }
          if (currentElement) {
            previousLeaveAnimation = $animate.leave(currentElement);
            previousLeaveAnimation.then(function() {
              previousLeaveAnimation = null;
            });
            currentElement = null;
          }
        }

        function update() {
          var locals = $route.current && $route.current.locals,
            template = locals && locals.$template;
          if (angular.isDefined(template)) {
            var newScope = scope.$new();
            var current = $route.current;
            var clone = $transclude(newScope, function(clone) {
              $animate.enter(clone, null, currentElement || $element).then(function onNgViewEnter() {
                if (angular.isDefined(autoScrollExp) &&
                  (!autoScrollExp || scope.$eval(autoScrollExp))) {
                  $anchorScroll();
                }
              });
              cleanupLastView();
            });
            currentElement = clone;
            currentScope = current.scope = newScope;
            currentScope.$emit('$viewContentLoaded');
            currentScope.$eval(onloadExp);
          } else {
            cleanupLastView();
          }
        }
      }
    };
  }
  ngViewFillContentFactory.$inject = ['$compile', '$controller', '$route'];

  function ngViewFillContentFactory($compile, $controller, $route) {
    return {
      restrict: 'ECA',
      priority: -400,
      link: function(scope, $element) {
        var current = $route.current,
          locals = current.locals;
        $element.html(locals.$template);
        var link = $compile($element.contents());
        if (current.controller) {
          locals.$scope = scope;
          var controller = $controller(current.controller, locals);
          if (current.controllerAs) {
            scope[current.controllerAs] = controller;
          }
          $element.data('$ngControllerController', controller);
          $element.children().data('$ngControllerController', controller);
        }
        scope[current.resolveAs || '$resolve'] = locals;
        link(scope);
      }
    };
  }
})(window, window.angular);;