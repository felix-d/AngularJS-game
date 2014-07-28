var tp2Services = angular.module('tp2Services', []);

tp2Services.factory('requestRejector', ['$q', '$rootScope', '$location', function($q, $rootScope, $location){
  var requestRejector = {
    request: function (config) {
      // alert(config.url +' ' +$rootScope.loggedIn); 
      if($rootScope.loggedIn == 1 && config.url == 'views/lobby.html'){
        
        $location.path('/home').replace();
      } else if($rootScope.loggedIn == 2 && config.url != 'views/lobby.html'){
        $location.path('/lobby').replace();
      }
      return config;
    }
  };
  return requestRejector;
}]);
