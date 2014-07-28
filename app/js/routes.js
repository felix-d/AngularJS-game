var tp2Routes = angular.module('tp2Routes', [
  'ngRoute',
  'tp2Services'
]);

tp2Routes.config(function($routeProvider, $httpProvider) {
  $routeProvider.
  when('/home', {
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
    //
    templateUrl: 'views/lobby.html',
    controller: 'ContentController'
  }).
  when('/jeu', {
    //CONTENT
    templateUrl: 'views/jeu.html',
    controller: 'GameController'
  }).
  when('/about', {
    templateUrl: 'views/apropos.html',
    controller: 'MainController'
  }).
  when('/contact', {
    templateUrl: 'views/contact.html',
    controller: 'MainController'
  }).
  otherwise({
    redirectTo: '/home'
  });
}).run(['$rootScope', '$http', '$location', '$log',
  function($rootScope, $http, $location, $log) {

    //On demande au serveur si le joueur est connecte!
    ping();

    //When loggedIn changes, set loggedIn to local storage
    //If local storage exists
    $rootScope.$watch('loggedIn', function(l) {
      localStorage.setItem("loggedIn", l);
    });

    //On recupere l'etat du local storage 
    if (typeof(Storage) !== "undefined") {
      $rootScope.loggedIn = localStorage.getItem("loggedIn");
      if ($rootScope.loggedIn === 'null') $rootScope.loggedIn = 1;

    } else $rootScope.loggedIn = 1;

    //logout function

    $rootScope.logout = function() {
        $log.debug("logging out");
        $rootScope.loggedIn = 1;
      $http.get('backend/logout.php').success(function(data) {
        $rootScope.$broadcast('event:doCheckLogin');
      }).error(function(data) {
        $rootScope.$broadcast('event:doCheckLogin');
      });
    };

    //Si on est bien logged in, on va au lobby!
    $rootScope.$on('event:loginConfirmed', function() {
      //empeche la page de flasher si on est logged in et quon essaie daller a laccueil
      var relocate = true;
      //Si on est logged in, on relocate pas! ca se fait dans le controlleur 
      //puisquil ny a pas de delai
      if ($rootScope.loggedIn == 2) relocate = false;
      else $rootScope.loggedIn = 2;
      if (relocate) $location.path('/lobby').replace();
    });


    //On enleve le comportement par default
    $rootScope.$on("$locationChangeSuccess", function(event) {
      // alert($location.path());
      event.preventDefault();
      ping();
    });

    //On appelle ping pour etre sur determiner si on est bien logged in
    //
    $rootScope.$on('event:doCheckLogin', function() {
      ping();
    });

    //On determine si l'utilisateur est logged in
    function ping() {
      $http.get('backend/checksession.php').success(function(data, status, headers, config) {
        $rootScope.$broadcast('event:loginConfirmed');
      });
    }
  }
]);
