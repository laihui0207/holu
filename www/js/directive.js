/**
 * Created by sunlaihui on 7/10/15.
 */
angular.module('Holu.SelectDirective', [])
    /*.directive('tabsSwipable', ['$ionicGesture', function ($ionicGesture) {
        //
        // make ionTabs swipable. leftswipe -> nextTab, rightswipe -> prevTab
        // Usage: just add this as an attribute in the ionTabs tag
        // <ion-tabs tabs-swipable> ... </ion-tabs>
        //
        return {
            restrict: 'A',
            require: 'ionTabs',
            link: function (scope, elm, attrs, tabsCtrl) {
                var onSwipeLeft = function () {
                    var target = tabsCtrl.selectedIndex() + 1;
                    if (target < tabsCtrl.tabs.length) {
                        scope.$apply(tabsCtrl.select(target));
                    }
                };
                var onSwipeRight = function () {
                    var target = tabsCtrl.selectedIndex() - 1;
                    if (target >= 0) {
                        scope.$apply(tabsCtrl.select(target));
                    }
                };

                var swipeGesture = $ionicGesture.on('swipeleft', onSwipeLeft, elm).on('swiperight', onSwipeRight);
                scope.$on('$destroy', function () {
                    $ionicGesture.off(swipeGesture, 'swipeleft', onSwipeLeft);
                    $ionicGesture.off(swipeGesture, 'swiperight', onSwipeRight);
                });
            }
        };
    }])*/
    .directive('compile', ['$compile', function ($compile) {
        return function(scope, element, attrs) {
            scope.$watch(
                function(scope) {
                    // watch the 'compile' expression for changes
                    return scope.$eval(attrs.compile);
                },
                function(value) {
                    // when the 'compile' expression changes
                    // assign it into the current DOM
                    element.html(value);

                    // compile the new DOM and link it to the current
                    // scope.
                    // NOTE: we only compile .childNodes so that
                    // we don't get into infinite loop compiling ourselves
                    $compile(element.contents())(scope);
                }
            );
        };
    }])
   /* .directive('loading',   ['$http' ,function ($http)
    {
        return {
            restrict: 'A',
            link: function (scope, elm, attrs)
            {
                scope.isLoading = function () {
                    return $http.pendingRequests.length > 0;
                };

                scope.$watch(scope.isLoading, function (v)
                {
                    if(v){
                        elm.show();
                    }else{
                        elm.hide();
                    }
                });
            }
        };

    }])*/
   /* .directive("appMap", function () {
        return {
            restrict: "E",
            replace: true,
            template: "<div id='allMap'></div>",
            scope: {
                center: "=", // Center point on the map (e.g. <code>{ latitude: 10, longitude: 10 }</code>).
                markers: "=", // Array of map markers (e.g. <code>[{ lat: 10, lon: 10, name: "hello" }]</code>).
                width: "@", // Map width in pixels.			height: "@",		// Map height in pixels.
                zoom: "@", // Zoom level (one is totally zoomed out, 25 is very much zoomed in).
                zoomControl: "@", // Whether to show a zoom control on the map.
                scaleControl: "@", // Whether to show scale control on the map.
                address: "@"
            },
            link: function (scope, element, attrs) {
                var map; // 百度地图API功能
                map = new BMap.Map("allMap");
                var myGeo = new BMap.Geocoder(); // 将地址解析结果显示在地图上,并调整地图视野
                myGeo.getPoint(scope.address, function (point) {
                    if (point) {
                        map.centerAndZoom(point, 16);
                        map.addOverlay(new BMap.Marker(point));
                    }
                }, "");
                map.addEventListener("click",function(e){
                    alert(e.point.lng + "," + e.point.lat);
                });
            }
        };
    })*/
    .directive('fancySelect',
    [
        '$ionicModal',
        function ($ionicModal) {
            return {
                /* Only use as <fancy-select> tag */
                restrict: 'E',

                /* Our template */
                templateUrl: 'templates/fancy-select.html',

                /* Attributes to set */
                scope: {
                    'items': '=', /* Items list is mandatory */
                    'text': '=', /* Displayed text is mandatory */
                    'label': '=',
                    'value': '=', /* Selected value binding is mandatory */
                    'callback': '&'
                },

                link: function (scope, element, attrs) {

                    /* Default values */
                    scope.multiSelect = attrs.multiSelect === 'true' ? true : false;
                    scope.allowEmpty = attrs.allowEmpty === 'false' ? false : true;

                    /* Header used in ion-header-bar */
                    scope.headerText = attrs.headerText || '';
                    scope.label = scope.label || '';
                    /* Text displayed on label */
                    // scope.text          = attrs.text || '';
                    scope.defaultText = scope.text || '';

                    /* Notes in the right side of the label */
                    scope.noteText = attrs.noteText || '';
                    scope.noteImg = attrs.noteImg || '';
                    scope.noteImgClass = attrs.noteImgClass || '';

                    /* Optionnal callback function */
                    // scope.callback = attrs.callback || null;

                    /* Instanciate ionic modal view and set params */

                    /* Some additionnal notes here :
                     *
                     * In previous version of the directive,
                     * we were using attrs.parentSelector
                     * to open the modal box within a selector.
                     *
                     * This is handy in particular when opening
                     * the "fancy select" from the right pane of
                     * a side view.
                     *
                     * But the problem is that I had to edit ionic.bundle.js
                     * and the modal component each time ionic team
                     * make an update of the FW.
                     *
                     * Also, seems that animations do not work
                     * anymore.
                     *
                     */
                    $ionicModal.fromTemplateUrl(
                        'templates/fancy-select-items.html', function (modal) {
                            scope.modal = modal;
                        },
                        {
                            scope: scope,
                            animation: 'slide-in-up'
                        }
                    )


                    /* Validate selection from header bar */
                    scope.validate = function (event) {
                        // Construct selected values and selected text
                        if (scope.multiSelect == true) {

                            // Clear values
                            scope.value = '';
                            scope.text = '';

                            // Loop on items
                            jQuery.each(scope.items, function (index, item) {
                                if (item.checked) {
                                    scope.value = scope.value + item.id + ';';
                                    scope.text = scope.text + item.text + ', ';
                                }
                            });

                            // Remove trailing comma
                            scope.value = scope.value.substr(0, scope.value.length - 1);
                            scope.text = scope.text.substr(0, scope.text.length - 2);
                        }

                        // Select first value if not nullable
                        if (typeof scope.value == 'undefined' || scope.value == '' || scope.value == null) {
                            if (scope.allowEmpty == false) {
                                scope.value = scope.items[0].id;
                                scope.text = scope.items[0].text;

                                // Check for multi select
                                scope.items[0].checked = true;
                            } else {
                                scope.text = scope.defaultText;
                            }
                        }

                        // Hide modal
                        scope.hideItems();

                        // Execute callback function
                        if (typeof scope.callback == 'function') {
                            scope.callback(scope.value);
                        }
                    }
                    scope.init = function () {
                        if (scope.multiSelect == true) {

                            // Clear values
                            scope.value = '';
                            scope.text = '';

                            // Loop on items
                            jQuery.each(scope.items, function (index, item) {
                                if (item.checked) {
                                    scope.value = scope.value + item.id + ';';
                                    scope.text = scope.text + item.text + ', ';
                                }
                            });

                            // Remove trailing comma
                            scope.value = scope.value.substr(0, scope.value.length - 1);
                            scope.text = scope.text.substr(0, scope.text.length - 2);
                        }
                    }
                    /* Show list */
                    scope.showItems = function (event) {
                        //event.preventDefault();
                        scope.modal.show();
                    }

                    /* Hide list */
                    scope.hideItems = function () {
                        scope.modal.hide();
                    }

                    /* Destroy modal */
                    scope.$on('$destroy', function () {
                        scope.modal.remove();
                    });

                    /* Validate single with data */
                    scope.validateSingle = function (item) {

                        // Set selected text
                        scope.text = item.text;

                        // Set selected value
                        scope.value = item.id;

                        // Hide items
                        scope.hideItems();

                        // Execute callback function
                        if (typeof scope.callback == 'function') {
                            scope.callback(scope.value);
                        }
                    }
                }
            };
        }
    ]
)