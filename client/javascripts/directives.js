app.directive("pie", function(){
  return {
    templateUrl: "/client/partials/pie.html",
    restrict: 'AE',
    scope: {
      data: '='
    }
  }
})