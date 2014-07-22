var tp2Routes = angular.module('tp2Routes', [
  'ngRoute'
]);


tp2Routes.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'views/home.html',
        controller: 'SignInController'
      }).
        when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignUpController'
      }).
        when('/apropos', {
        templateUrl: 'views/apropos.html',
        controller: 'MainController'
      }).
        when('/contact', {
        templateUrl: 'views/contact.html',
        controller: 'MainController'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
