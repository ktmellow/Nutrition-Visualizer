app.controller("NutritionController", ['NutritionService', function(NutritionService) {
  const vm = this;
  vm.form = {};
  vm.results;
  vm.data;
  vm.macros;
  vm.macroPie = "macroPie";

  vm.submit = function(){
    // console.log(vm.form.query);
    NutritionService.getData().then(function(data) {
      vm.data = data.data.parsed_body.report.food;
      vm.macros = NutritionService.getMacros(vm.data);

      // For development, remove later
      window.data = vm.data;
      window.macros = vm.macros

      vm.results = data.data.parsed_body.report.food.name;
    });
  }
  
  // Display Bar Chart of Vitamins 

  // Display Bar Chart of Minerals



}]);
