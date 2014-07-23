var tp2Routes = angular.module('tp2Routes', [
  'ngRoute'
]);

tp2Routes.config(function($routeProvider, $httpProvider) {
  $routeProvider.
  when('/', {
    //SIGNIN
    templateUrl: 'views/home.html',
    controller: 'SignInController'
  }).
  when('/signup', {
    //SIGNUP
    templateUrl: 'views/signup.html',
    controller: 'SignUpController'
  }).
  when('/lobby', {
    //CONTENT
    templateUrl: 'views/lobby.html',
    controller: 'ContentController'
  }).
  when('/jeu', {
    //CONTENT
    templateUrl: 'views/jeu.html',
    controller: 'GameController'
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
  // ==== CODE TO DO 401 NOT LOGGED IN CHECKING
    //This code will intercept 401 unauthorized errors returned from web requests.
    //On default any 401 will make the app think it is not logged in.
    var interceptor = ['$rootScope','$q', function(scope, $q) {

        function success(response) {
            return response;
        }

        function error(response) {
            var status = response.status;

            if (status == 401) {
                var deferred = $q.defer();
                var req = {
                    config: response.config,
                    deferred: deferred
                };
                scope.$broadcast('event:loginRequired');
                return deferred.promise;
            }
            // otherwise
            return $q.reject(response);

        }

        return function(promise) {
            return promise.then(success, error);
        };

    }];
    $httpProvider.responseInterceptors.push(interceptor);
  }).run(['$rootScope', '$http', '$location', function(scope, $http, $location) {

    /**
     * Holds page you were on when 401 occured.
     * This is good because, for example:
     *  User goes to protected content page, for example in a bookmark.
     *  401 triggers relog, this will send them back where they wanted to go in the first place.
     */
    scope.pageWhen401 = "";
    scope.loggedIn = false;

    scope.logout = function(){
        console.log("Logout request.");
        $http.get('backend/logout.php').success(function(data){
            scope.$broadcast('event:doCheckLogin');
        }).error(function(data){
               scope.$broadcast('event:doCheckLogin');
            });
    };

    scope.$on('event:loginRequired', function(){
        scope.loggedIn = false;

        //Only redirect if we aren't on create or login pages.
        if($location.path() == "/signup" || $location.path() == "/")
            return;
        scope.pageWhen401 = $location.path();

        //go to the login page
        $location.path('/home').replace();
    });

    /**
     * On 'event:loginConfirmed', return to the page.
     */
    scope.$on('event:loginConfirmed', function() {
        scope.loggedIn = true;
        console.log("Login confirmed!");
        $location.path('/lobby').replace();
    });

    /**
     * On 'logoutRequest' invoke logout on the server and broadcast 'event:loginRequired'.
     */
    scope.$on('event:logoutRequest', function() {
        scope.logout();
    });

    scope.$on("$locationChangeSuccess", function(event){
        //event.preventDefault();
        ping();
    });

    scope.$on('event:doCheckLogin', function(){
        ping();
    });

    /**
     * Ping server to figure out if user is already logged in.
     */
    function ping() {
        $http.get('backend/checksession.php').success(function() {
            scope.$broadcast('event:loginConfirmed');
        }); //If it fails the interceptor will automatically redirect you.
    }

    //Finally check the logged in state on every load
    ping();
}
]);
