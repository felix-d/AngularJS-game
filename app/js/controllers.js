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
  var guid = (function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return function() {
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    };
  })();
  $scope.showbutton = false;
  usSpinnerService.spin('spinner-1');

  //Fonction activee par le bouton 'jouez'
  $scope.play = function() {
    $location.path('/game').replace();
  };
  $rootScope.uuid = guid();
  var userData = {
    randString: $rootScope.uuid

  };
  //Requete Ajax pour obtenir l'information sur la partie
  $http({
    method: 'POST',
    url: 'backend/preparegame.php',
    data: userData
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
  $scope.gmURL = '';
  $scope.gmURL2 = '';

  $scope.map1 = false;
  var timeout = false;
  var balance = 1;
  var goodInRow = 0;
  var lastScore = '';
  //On surveille le nombre de tours
  $scope.$watch('count', function(c) {
    console.log(c);
    if ($rootScope.gamedata !== undefined) {
      // $scope.map1 = false;

      if (c != 20) {
        $scope.tempchoices = $rootScope.gamedata[c];
        var tv = getValidIndex($scope.tempchoices);
        var lat = $scope.tempchoices[tv].lat;
        var lon = $scope.tempchoices[tv].lon;
        if (balance == 1)
          $scope.gmURL = "http://maps.googleapis.com/maps/api/staticmap?center=" + lat + "," + lon + "&zoom=7&format=png&sensor=false&size=640x480&maptype=roadmap&style=feature:administrative.locality|visibility:off&markers=color:red|"+lat+","+lon+"&key=AIzaSyDdIYLcSj7QQBxsiP4Cy0ChfpxnbdHK-4I";
        else
          $scope.gmURL2 = "http://maps.googleapis.com/maps/api/staticmap?center=" + lat + "," + lon + "&zoom=7&format=png&sensor=false&size=640x480&maptype=roadmap&style=feature:administrative.locality|visibility:off&markers=color:red|"+lat+","+lon+"&key=AIzaSyDdIYLcSj7QQBxsiP4Cy0ChfpxnbdHK-4I";
      }
      var t = 0;
      (c === 0) ? t = 0: t = 800;
      $timeout(function() {
        if (balance == 1)
          $scope.map1 = true;
        else
          $scope.map1 = false;
        balance *= -1;
        timeout = false;
        $scope.displayLastScore = '';
        if (c == 20) $scope.finished();
        if ($rootScope.gamedata != undefined) {
          $scope.choices = $rootScope.gamedata[c];
          var v = $scope.valid = getValidIndex($scope.choices);
          // $scope.gmURL = "../temp/" + $rootScope.uuid + "/" + c + ".png";
        }
      }, t);
    }
  });



  function getValidIndex(chs) {
    if (chs != undefined) {
      for (var i = 0; i < 3; i++) {
        if (chs[i].flag == 1) return i;
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
    if (timeout)
      switch (lastScore) {
        case 0:
          return "";
        case 1:
          return "animate-score get-points final";
        case 2:
          return "animate-score combo1 final";
        case 5:
          return "animate-score combo2 final";
        default:
      } else return 'reset-score-animation';
  };

  $scope.getStaticScoreClass = function() {
    console.log(lastScore);
    if (timeout) {
      if (lastScore === 0)
        return 'get-red';
      else return "";
    } else return "get-black";
  };
  //Fonction lors du clique sur le bouton associe a une ville
  $scope.pickChoice = function(index) {
    if (timeout === false) {
      timeout = true;
      if (index == $scope.valid) {
        if (goodInRow != 3) goodInRow++;
        switch (goodInRow) {
          case 1:
            lastScore = 1;
            $scope.displayLastScore = '+' + lastScore;
            break;
          case 2:
            lastScore = 2;
            $scope.displayLastScore = 'Combo! +' + lastScore;
            break;
          case 3:
            lastScore = 5;
            $scope.displayLastScore = 'Combo! +' + lastScore;
            break;
          default:
            break;
        }
        $scope.score += lastScore;
      } else {
        lastScore = 0;
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
      username: $rootScope.username,
      randString: $rootScope.uuid
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
