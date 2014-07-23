(function (angular, _) {
    'use strict';

    angular.module('connect-grid-select2-editor')
        .directive('select2CellEditor', ['$timeout', function ($timeout) {
            return {
                restrict: 'E',
                link: function (scope, element, attrs) {
                    scope.data = scope.$eval(attrs.data);

                    element.on('select2-close', function () {
                        $timeout(function () {
                            // overwrite ui-select2 model value with value read directly from select2:
                            var val = element.find('select').select2('val');
                            if (_.isString(val) && val.length > 0) {
                                scope.value = val;
                            }

                            if (scope.value) {
                                var selectedItem;

                                // convert number coming as string into a number:
                                if (scope.value !== null && !isNaN(+scope.value)) {
                                    scope.value = Number(scope.value);
                                }

                                selectedItem = _.findWhere(scope.data, { id: scope.value });

                                if (!selectedItem) {
                                    scope.value = null;
                                    scope.cancelEditing();
                                } else {
                                    scope.confirmEditing();
                                    scope.finishEditing();
                                }
                            } else {
                                scope.confirmEditing();
                                scope.finishEditing();
                            }
                        });
                    });

                    scope.$on('editorFocus', function () {
                        // convert number coming as string into a number:
                        if (scope.value !== null && !isNaN(+scope.value)) {
                            scope.value = Number(scope.value);
                        }

                        // open the dropdown:
                        element.find('select').select2('open');

                        // try to find an item in the collection by id:
                        var selectedItem = _.findWhere(scope.data, { id: scope.value });
                        if (!selectedItem) {
                            // if it's not found, we assume, that value is coming from
                            // a keypress on an active cell and  start a search:
                            element.find('select').select2('search', scope.value);
                        }
                    });

                },
                template: '<select ng-model="value" ui-select2="{ width: getCellWidth($parent.$index, $index) }"><option></option><option ng-repeat="row in data" value="{{ row.id }}">{{ row.name }}</option></select>'
            };
        }]);

}(window.angular, window._));