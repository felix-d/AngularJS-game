var tp2Controllers = angular.module('tp2Controllers', []);

//PARENT CONTROLLER
tp2Controllers.controller("MainController", function($scope, $location) {
  //Let buttons act like a href
  $scope.go = function(path) {
    $location.path(path);
  };
  $scope.test = "alloo";
});

//CONTROLS SIGN IN PROCESS
tp2Controllers.controller('SignInController', function($scope, $http, $rootScope) {
  $scope.accountData = {
    username: '',
    password: ''
  };
  $scope.showLoginForm = true;
  $scope.loginMessage = "";
  $scope.loginErrorMessage = "";

  $scope.doSubmit = function() {
    if ($scope.accountData.password === "" ||
      $scope.accountData.username === "") {
      $scope.loginErrorMessage = "All fields must be filled";
      return;
    }
    $scope.showLoginForm = false;
    $scope.loginMessage = "Logging in...";

    //send login request
    // $scope.accountData.password = md5($scope.accountData.password);
    $http({
      method: 'POST',
      url: 'backend/login.php',
      data: $scope.accountData
    }).success(function(data) {
      if (data == 'success') {
        $scope.showLoginForm = false;
        $scope.loginMessage = "Success... Verifying...";
        $rootScope.$broadcast("event:doCheckLogin");
      } else {
        $scope.showLoginForm = true;
        $scope.loginMessage = "";
        $scope.loginErrorMessage = data;
        $scope.password = "";
      }
    }).error(function(data) {
      $scope.showLoginForm = true;
      $scope.loginErrorMessage = data;
      $scope.loginMessage = "";
      $scope.password = "";
    });
  };
});

//CONTROLS ACCESSIBLE CONTENT
tp2Controllers.controller('ContentCtrl', function($scope, $http, $rootScope) {
  //If you do any sort of request here
  //that returns 401 you will get a login
  $scope.resultData = {
    username: 'fetching',
    email: 'fetching'
  };
  $http({
    method: 'GET',
    url: 'php/userdetails.php'
  }).success(function(data) {
    if (data == 'error') {
      $scope.resultData.username = $scope.resultData.password = 'Error fetching data!';
    } else {
      $scope.resultData = data;
    }
  });
});

//CONTROLS SIGN UP PROCESS
tp2Controllers.controller('SignUpController', function($scope, $rootScope, $http, $log) {
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
