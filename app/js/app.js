var tp2App = angular.module('tp2App', [
  'google-maps',
  'tp2Routes',
  'tp2Controllers',
  'ngAnimate',
  'angularSpinner',
  'timer'
]);
tp2App.config(['$httpProvider',
  function($httpProvider) {
    $httpProvider.interceptors.push('requestRejector');
  }
]);
