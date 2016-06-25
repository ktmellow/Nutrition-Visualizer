app.controller("NutritionController", ['NutritionService', function(NutritionService) {
  const vm = this;
  vm.form = {};
  vm.data;

  vm.submit = function(){
    console.log(form.query);
    NutritionService.getData().then(function(data) {
      vm.type = typeof(data.data.body);
      vm.data = data.data.body;
      window.data = data.data;
    });
  }

}]);
