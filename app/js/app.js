var tp2App = angular.module('tp2App', [
  'tp2Routes',
  'tp2Controllers'
]);

// tp2App.directive('flash', function() {
//     return {
//         restrict: 'A',
//         link: function(scope, element, attrs) {
//             scope.$watch('createErrorMessage', function(variable) {

//             });
//         }
//     };
// });
//  // ==== CODE TO DO 401 NOT LOGGED IN CHECKING
//This code will intercept 401 unauthorized errors returned from web requests.
//On default any 401 will make the app think it is not logged in.
