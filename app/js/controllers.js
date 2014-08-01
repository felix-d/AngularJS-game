var tp2Controllers = angular.module('tp2Controllers', ['google-maps', 'tp2Services', 'timer', 'QuickList']);


//PARENT CONTROLLER
tp2Controllers.controller("MainController", function($rootScope, $scope, $location) {
  //Let buttons act like a href
  $scope.go = function(path) {
    $location.path(path);
  };
});


//NAV CONTROLLER
tp2Controllers.controller("NavController", function($rootScope, $scope) {
  $rootScope.$watch('loggedIn', function(l) {
    if (l == 2) {
      $scope.showHomeMenu = false;
      $scope.showGameMenu = true;
      $scope.currentHome = '/lobby';
    } else if (l == 1) {
      $scope.showHomeMenu = true;
      $scope.showGameMenu = false;
      $scope.currentHome = '/home';
    }
  });
});


//CONTROLS SIGN IN PROCESS
tp2Controllers.controller('SignInController', function($scope, $http, $rootScope, $log, $location) {

  $scope.$log = $log;
  $scope.accountData = {
    username: '',
    password: ''
  };

  $scope.showLoginForm = true;
  $scope.loginErrorMessage = "";

  $scope.doSubmit = function() {
    if ($scope.accountData.password === "" ||
      $scope.accountData.username === "") {
      $scope.loginErrorMessage = "All fields must be filled";
      return;
    }

    //Requete Ajax pour la connection du joueur
    $http({
      method: 'POST',
      url: 'backend/login.php',
      data: $scope.accountData
    }).success(function(data) {
      $scope.message = data;
      if (data == 'success') {
        $rootScope.username = $scope.accountData.username;
        $rootScope.$broadcast("event:doCheckLogin");
      } else {
        $scope.loginErrorMessage = data;
      }
    }).error(function(data) {
      $scope.loginErrorMessage = data;
    });
  };
});


//CONTROLS SIGN UP PROCESS
tp2Controllers.controller('SignUpController', function($scope, $rootScope, $http, $log, $location) {
  $scope.accountData = {
    username: '',
    password: '',
    confirmation: ''
  };
  $scope.showCreateForm = true;
  $scope.createMessage = "";
  $scope.createErrorMessage = "";
  $scope.doSubmit = function() {

    if ($scope.accountData.password === "" ||
      $scope.accountData.confirmation === "" ||
      $scope.accountData.username === "") {
      $scope.createErrorMessage = "All fields must be filled";
      return;
    } else if ($scope.accountData.password !== $scope.accountData.confirmation) {
      $scope.createErrorMessage = "Password and confirmation do not match.";
      return;
    }

    //Requete Ajax pour l'enregistrement du joueur
    $http({
      method: 'POST',
      url: 'backend/registration.php',
      data: $scope.accountData
    }).success(function(data) {
      if (data == 'success') {
        $rootScope.username = $scope.accountData.username;
        $rootScope.$broadcast("event:doCheckLogin");
      } else {
        $scope.showCreateForm = true;
        $scope.createErrorMessage = data;
      }
    }).error(function(data) {
      console.log(data);
      $scope.showCreateForm = true;
      $scope.createErrorMessage = data;
    });
  };
});


//Lobby controller
tp2Controllers.controller('LobbyController', function($log, $scope, $http, $rootScope, $location, usSpinnerService) {
  $scope.showbutton = false;
  usSpinnerService.spin('spinner-1');

  //Fonction activee par le bouton 'jouez'
  $scope.play = function() {
    $location.path('/game').replace();
  };

  //Requete Ajax pour obtenir l'information sur la partie
  $http({
    method: 'GET',
    url: 'backend/preparegame.php'
  }).
  success(function(data, status, headers, config) {
    $rootScope.gamedata = data;
    $scope.showbutton = true;
    usSpinnerService.stop('spinner-1');
  }).error(function(data, status, headers, config) {
    usSpinnerService.stop('spinner-1');
  });
});


//GAME CONTROLLER
tp2Controllers.controller('GameController', function($log, $scope, $http, $rootScope, $location, $timeout) {

  //Si les donnees de jeu n'ont pas reussi a etre telechargees
  if ($rootScope.gamedata == undefined) {
    $scope.showError = true;
  }

  //Initialisation des variables
  $scope.timerRunning = true;
  $scope.count = 0;
  $scope.score = 0;
  $scope.showbar = true;
  $scope.showLobbyButton = false;
  $scope.endGameMessage = '';
  $scope.valid = 0;
  $scope.displayLastScore = '';
  var timeout = false;
  var goodInRow = 0;
  var lastScore = '';
  //On surveille le nombre de tours
  $scope.$watch('count', function(c) {
    var t = 0;
    c == 0 ? t = 0 : t = 800;
    $timeout(function() {
      timeout = false;
      $scope.displayLastScore = '';
      if (c == 15) $scope.finished();
      if ($rootScope.gamedata != undefined) {
        $scope.choices = $rootScope.gamedata[c];
        $scope.valid = getValidIndex();
      }
    }, t);
  });


  function getValidIndex() {
    if ($scope.choices != undefined) {
      for (var i = 0; i < 3; i++) {
        if ($scope.choices[i].flag == 1) return i;
      }
    }
  }

  $scope.getClass = function(index) {
    if (timeout) {
      if (index == $scope.valid) {
        return "btn-success";
      } else {
        return "btn-danger";
      }
    } else {
      return "btn-info";
    }
  };

  $scope.getScoreClass = function() {
    var ls = lastScore;
      if(timeout)
      switch (ls) {
        case 0:
          return "";
        case 1:
          return "animate-score get-points final";
        case 2:
          return "animate-score combo1 final";
        case 5:
          return "animate-score combo2 final";
        default:
      }
      else return 'reset-score-animation';
  };

  $scope.getStaticScoreClass = function(){
    if($scope.lastScore==0)
    return "get-red";
    else return "";
  }
  //Fonction lors du clique sur le bouton associe a une ville
  $scope.pickChoice = function(index) {
    if (timeout === false) {
      timeout = true;
      if (index == $scope.valid) {
        if (goodInRow != 3) goodInRow++;
        switch (goodInRow) {
          case 1:
            lastScore = 1;
            break;
          case 2:
            lastScore = 2;
            break;
          case 3:
            lastScore = 5;
            break;
          default:
            break;
        }
        $scope.displayLastScore = lastScore;
        $scope.score += lastScore;
      } else {
        lastScore = '';
        goodInRow = 0;
      }

      $scope.count++;
    }
  };

  //Fin de partie
  $scope.finished = function() {
    $scope.showbar = false;
    $scope.endGameMessage = "Votre score est de " + $scope.score + "!";
    var sendData = {
      score: $scope.score,
      username: $rootScope.username
    };
    //Requete AJAX pour enregistrer les scores
    $http({
      method: 'POST',
      url: 'backend/endgame.php',
      data: sendData
    }).success(function(data) {
      $scope.showLobbyButton = true;
    }).error(function(data) {
      $scope.endGameMessage = "Le score n'a pas pu etre enregistre. Une erreur technique est survenue.";
    });
  };
});
