var tp2Services = angular.module('tp2Services', []);

tp2Services.factory('requestRejector', ['$q', '$rootScope', '$location', function($q, $rootScope, $location){
  var requestRejector = {
    request: function (config) {
      if(config.url == 'backend/checksession.php' || config.url == 'backend/endgame.php'){
        //do nothing 
      }
      else if($rootScope.loggedIn == 1 && (config.url == 'views/lobby.html' || config.url == 'views/jeu.html')){
        
        $location.path('/home').replace();
      } 
      else if($rootScope.loggedIn == 2 && (config.url != 'views/lobby.html' && config.url != 'views/jeu.html')){
        $location.path('/lobby').replace();
      }
      return config;
    }
  };
  return requestRejector;
}]);

