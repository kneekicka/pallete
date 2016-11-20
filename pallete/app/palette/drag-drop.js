var module = angular.module("directives.dragdrop", ['services']);

module.directive('draggable', ['$rootScope', 'uuid', function ($rootScope, uuid) {
    return {
        restrict: 'A',
        link: function (scope, el, attrs, controller) {
            angular.element(el).attr("draggable", "true");

            var id = angular.element(el).attr("id");

            if (!id) {
                id = uuid.new();
                angular.element(el).attr("id", id);
            }
            el.bind("dragstart", function (e) {
                e.dataTransfer.setData('text', id);
                $rootScope.$emit("DRAG-START");
            });

            el.bind("dragend", function (e) {
                $rootScope.$emit("DRAG-END");
            });
        }
    };
}]);

module.directive('dropTarget', ['$rootScope', 'uuid', function ($rootScope, uuid) {
    return {
        restrict: 'A',
        scope: {
            onDrop: '&'
        },
        link: function (scope, el, attrs, controller) {
            var id = angular.element(el).attr("id");
            if (!id) {
                id = uuid.new();
                angular.element(el).attr("id", id);
            }

            el.bind("dragover", function (e) {
                if (e.preventDefault) {
                    e.preventDefault(); // Necessary. Allows us to drop.
                }

                e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
                return false;
            });

            el.bind("dragenter", function (e) {
                // this / e.target is the current hover target.
                angular.element(e.target).addClass('over');
            });

            el.bind("dragleave", function (e) {
                angular.element(e.target).removeClass('over');  // this / e.target is previous target element.
            });

            el.bind("drop", function (e) {
                if (e.preventDefault) {
                    e.preventDefault(); // Necessary. Allows us to drop.
                }

                if (e.stopPropagation) {
                    e.stopPropagation(); // Necessary. Allows us to drop.
                }
                var data = e.dataTransfer.getData("text");
                var dest = document.getElementById(id);
                var src = document.getElementById(data);

                scope.onDrop({dragEl: data, dropEl: id});
            });

            $rootScope.$on("DRAG-START", function () {
                var el = document.getElementById(id);
                angular.element(el).addClass("target");
            });

            $rootScope.$on("DRAG-END", function () {
                var el = document.getElementById(id);
                angular.element(el).removeClass("target");
                angular.element(el).removeClass("over");
            });
        }
    };
}]);
