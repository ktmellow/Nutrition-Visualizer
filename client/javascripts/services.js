app.service("NutritionService", function($http) {
  return {

    // Makes request to backend with sample API request
    getData: function() {
      // TO DO: 
      // Form validations

      return $http.get('http://localhost:3000/foodData')
    },

    // Collects only the data necessary for the data visualization
    getNutrients: function(data) {
      return data.nutrients;
    },

    // Collects only macronutrients
    getMacros: function(data) {
      return data.slice(3,9).concat(data[0])
    }
  }
})

  // Display Pie Chart of Macronutrients
  // Following tutorial from 
  // http://zeroviscosity.com/d3-js-step-by-step/step-1-a-basic-pie-chart
  // TO DO: Move logic DOM manipulations to its own directive!
app.service("D3Service", function() {
  
  return {
    pieMaker: function(dataset, pieType){
      var macros = dataset;

      var macroColors = ['#ECD078', '#D95B43', '#C02942', '#542437', '#53777A', '#CFF09E', '#A8DBA8', '#3B8686'];

      if (pieType === "macroPie") {
        var colors = macroColors;
      }

      var color = d3.scale.ordinal().range(colors); 

      var height = 360;
      var width = 360;
      var radius = Math.min(width, height) / 2;
      var donutWidth = 100;
      
      macros.forEach(function(d) {
        d.enabled = true;
      });

      // Creates a canvas and sets placeholder values
      var svg = d3.select('#' + pieType)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + (width / 2) + 
          ',' + (height / 2) + ')');

      // Determine nutrient radius
      var arc = d3.svg.arc()
        .innerRadius(radius - donutWidth)
        .outerRadius(radius);

      // Determine value from dataset
      var pie = d3.layout.pie()
        .value(function(d) { return +d.value; })
        .sort(null);

      // Use the above to create pie chart
      var path = svg.selectAll('path')
        .data(pie(macros))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function(d, i) { 
          return color(colors[i]);
        });

      // Adds tooltip on mouseover. 
      path.on('mouseover', function(d) {
        var total = d3.sum(macros.map(function(d) {
          return (d.enabled) ? d.value : 0;
        }));
        var percent = Math.round(1000 * d.value / total) / 10;
        tooltip.select('.label').html(d.data.name);
        tooltip.select('.percent').html(percent + '%')
        tooltip.style('display', 'block');
      })
      .each(function(d) { this._current = d; });     

      path.on('mouseout', function() {
        tooltip.style('display', 'none');
      });

      // Tooltip will move with mouse
      path.on('mousemove', function(d) {
        tooltip.style('top', (d3.event.layerY + 10) + 'px')
          .style('left', (d3.event.layerX + 10) + 'px');
      });

      // Creating Legend
      var legendRectSize = 9;
      var legendSpacing = 4;

      // Creates placeholder for legend rectangles
      var legend = svg.selectAll('.legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
          var height = legendRectSize + legendSpacing;
          var offset =  height * color.domain().length / 2;
          var h = -5.5 * legendRectSize;
          var v = i * height - offset;
          return 'translate(' + h + ',' + v + ')';
        });

      // Fills the legend rectangles with color and adds event listeners
      legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', color)
        .style('stroke', color)

        .on('click', function(label) {
          var rect = d3.select(this);
          var enabled = true;

          // If total enabled segments are < 2, cannot disable any more
          var totalEnabled = d3.sum(macros.map(function(d) {
            return (d.enabled) ? 1 : 0;
          }))
          if (rect.attr('class') === 'disabled') {
            rect.attr('class', '');
          } else {
            if (totalEnabled < 2) return;
            rect.attr('class', 'disabled');
            enabled = false;
          }


          // The 'rect' only has color value, so must check which
          // rect was clicked based on color. (Not ideal.)
          pie.value(function(d, i) {
            if (colors[i] === label) {
              d.enabled = enabled;
            } 
            return (d.enabled) ? d.value : 0;
          });

          path = path.data(pie(macros));

          path.transition()
            .duration(750)
            .attrTween('d', function(d) {
              // debugger
              var interpolate = d3.interpolate(this._current, d)
              this._current = interpolate(0);
              return function(t) {
                return arc(interpolate(t));
              }
            })
        });

      // Adds text for legend
      legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing + 3)
        .text(function(d, i) { return macros[i].name.toLowerCase(); 
      });

     // Adds tooltip
      var tooltip = d3.select('#macroPie')
        .append('div')          
        .attr('class', 'tooltip');
      tooltip.append('div').attr('class', 'label');
      tooltip.append('div').attr('class', 'count'); 
      tooltip.append('div').attr('class', 'percent'); 
    }

  }
})