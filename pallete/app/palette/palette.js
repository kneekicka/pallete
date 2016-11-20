'use strict';

var colorToStr = function(rgb) {
    return rgb[0] + ',' + rgb[1] + ',' + rgb[2];
};

var strToColor = function(str) {
    return str.split(',');
};

function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}

angular.module('myApp.palette', ['ngRoute', 'directives.dragdrop'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/palette', {
    templateUrl: 'palette/palette.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', function($scope) {

    $scope.grid = [];
    for(var i = 0; i < 10; ++i) {
        $scope.grid[i] = [];
        for(var j = 0; j < 10; ++j) {
            $scope.grid[i][j] = {
                color: colorToStr([255, 255, 255])
            };
        }
    }

    $scope.json = JSON.stringify($scope.grid);

    $scope.dropped = function(dragEl, dropEl) {

        var cellId = document.getElementById(dropEl).innerHTML.split(',');

        var drop = document.getElementById(dropEl);
        var drag = document.getElementById(dragEl);

        var x = cellId[0];
        var y = cellId[1];

        var currentColor = drop.style.color.substring(4, drop.style.color.length - 1).split(', ');
        
        var newColor = [];

        if(currentColor == '255,255,255') {
            newColor = strToColor(drag.getAttribute('data-color'));
        }
        else {
            var cellColor = currentColor;
            var dragColor = strToColor(drag.getAttribute('data-color'));
            newColor = [
                Math.round((parseInt(dragColor[0]) + parseInt(cellColor[0]))/2),
                Math.round((parseInt(dragColor[1]) + parseInt(cellColor[1]))/2),
                Math.round((parseInt(dragColor[2]) + parseInt(cellColor[2]))/2)
            ];
        }
        $scope.grid[x][y].color = colorToStr(newColor);
        document.getElementById('jsonSpan').innerHTML = JSON.stringify($scope.grid);
        document.getElementById(dropEl).style.color = 'rgb(' + colorToStr(newColor) + ')';
        document.getElementById(dropEl).style.backgroundColor = 'rgb(' + colorToStr(newColor) + ')';


        var bgClass = drop.getAttribute('data-color');
        if (bgClass) {
            drag.className = drag.className.replace(bgClass, ' ');
        }

        bgClass = drag.getAttribute("data-color");
        drop.className += bgClass;
        drop.setAttribute('data-color', bgClass);

        //if element has been dragged from the grid, clear dragged color
        if (drag.getAttribute("x-drop-target")) {
            drag.className = drag.className.replace(bgClass, ' ');
        }

    };

    $scope.loadData = function() {
        var data = document.getElementById('jsonText').value;
        $scope.grid = JSON.parse(data);
        document.getElementById('jsonData').style.display = 'none'
    }
});