app.controller("NutritionController", ['NutritionService', function(NutritionService) {
  const vm = this;
  vm.form = {};
  vm.data;

  vm.submit = function(){
    console.log(form.query);
    NutritionService.getData().then(function(data) {
      vm.data = data.data.parsed_body.report.food;
      window.data = data.data.parsed_body.report.food;
    });
  }
}]);
