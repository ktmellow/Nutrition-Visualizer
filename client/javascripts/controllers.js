app.controller("NutritionController", ['NutritionService', 'D3Service', function(NutritionService, D3Service) {
  const vm = this;
  vm.form = {};
  vm.results;
  vm.data;

  vm.submit = function(){
    // console.log(vm.form.query);
    NutritionService.getData().then(function(data) {
      vm.results = data.data.parsed_body.report.food.name;
      vm.data = data.data.parsed_body.report.food;
      vm.data = NutritionService.getNutrients(vm.data);

      // For development, remove later
      window.data = vm.data;
      D3Service.pieMaker(NutritionService.getMacros(vm.data), 'macroPie');
    });
  }
  
  // Display Bar Chart of Vitamins 

  // Display Bar Chart of Minerals



}]);
