var tp2Controllers = angular.module('tp2Controllers', ['google-maps', 'tp2Services']);

//PARENT CONTROLLER
tp2Controllers.controller("MainController", function($rootScope, $scope, $location) {
  //Let buttons act like a href
  $scope.go = function(path) {
    $location.path(path);
  };
  // if ($rootScope.loggedIn == 2) $location.path('/lobby').replace();
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
//
tp2Controllers.controller('SignInController', function($scope, $http, $rootScope, $log, $location) {
  // if ($rootScope.loggedIn == 2) $location.path('/lobby').replace();

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
    // $scope.showLoginForm = false;
    // $scope.loginMessage = "Logging in...";

    //send login request
    // $scope.accountData.password = md5($scope.accountData.password);
    $http({
      method: 'POST',
      url: 'backend/login.php',
      data: $scope.accountData
    }).success(function(data) {
      $scope.message = data;
      if (data == 'success') {

        $scope.showLoginForm = false;
        // $scope.loginMessage = "Success... Verifying...";
        $rootScope.$broadcast("event:doCheckLogin");
      } else {
        $scope.loginErrorMessage = data;
      }
    }).error(function(data) {
      $scope.loginErrorMessage = data;
    });
  };
});

//CONTROLS ACCESSIBLE CONTENT
tp2Controllers.controller('ContentController', function($log, $scope, $http, $rootScope, $location) {
  // if ($rootScope.loggedIn != 2) {
  //   $location.path('/home').replace();
  // }


});

//CONTROLS SIGN UP PROCESS
tp2Controllers.controller('SignUpController', function($scope, $rootScope, $http, $log, $location) {
  // if ($rootScope.loggedIn == 2) $location.path('/lobby').replace();
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

    $scope.showCreateForm = false;
    $scope.createMessage = "Creating your account...";

    // Rawtext password so the server can check the password constraints.
    // If you want you could uncomment this and make it md5 encrypted.
    // $scope.accountData.password = md5($scope.accountData.password);

    $http({
      method: 'POST',
      url: 'backend/registration.php',
      data: $scope.accountData
    }).success(function(data) {
      if (data == 'success') {
        $scope.showCreateForm = false;
        $scope.createMessage = "Success... Continuing to site...";
        $rootScope.$broadcast("event:doCheckLogin");
      } else {
        $scope.showCreateForm = true;
        $scope.createMessage = "";
        $scope.createErrorMessage = data;
        $scope.password = "";
      }
    }).error(function(data) {
      console.log(data);
      $scope.showCreateForm = true;
      $scope.createErrorMessage = data;
      $scope.createMessage = "";
      $scope.password = "";
    });
  };
});
