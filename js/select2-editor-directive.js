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
                            if (scope.value) {
                                var selectedItem;

                                // convert number coming as string into a number:
                                if (!isNaN(+scope.value)) {
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
                            }
                        });
                    });

                    scope.$on('editorFocus', function () {
                        element.find('select').select2('open');
                    });

                },
                template: '<select ng-model="value" ui-select2="{ width: getCellWidth($parent.$index, $index) }"><option ng-repeat="row in data" value="{{ row.id }}">{{ row.name }}</option></select>'
            };
        }]);

}(window.angular, window._));