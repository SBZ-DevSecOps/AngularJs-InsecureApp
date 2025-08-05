angular.module('vulnerableApp')
.controller('PrototypeController', ['$scope', function($scope) {
    
    $scope.mergeData = '';
    $scope.objectData = '';
    $scope.extendData = '';
    $scope.assignData = '';
    
    // VULNÉRABLE: Merge sans validation - DÉTECTÉ
    $scope.unsafeMerge = function() {
        try {
            var userObj = JSON.parse($scope.mergeData);
            var target = {};
            
            // FLAG: Deep merge without prototype check
            function deepMerge(target, source) {
                for (var key in source) {
                    if (source[key] && typeof source[key] === 'object') {
                        target[key] = target[key] || {};
                        deepMerge(target[key], source[key]);
                    } else {
                        target[key] = source[key];
                    }
                }
            }
            
            deepMerge(target, userObj);
            console.log('Merged object:', target);
        } catch (e) {
            console.error('Error:', e);
        }
    };
    
    // VULNÉRABLE: Object.assign avec __proto__ - DÉTECTÉ
    $scope.unsafeAssign = function() {
        try {
            var userObj = JSON.parse($scope.assignData);
            var target = {};
            
            // FLAG: Object.assign with user input
            Object.assign(target, userObj);
            
            // Aussi vulnérable avec spread
            var spread = {...userObj};
            
            console.log('Assigned object:', target);
        } catch (e) {
            console.error('Error:', e);
        }
    };
    
    // VULNÉRABLE: Lodash merge (version vulnérable) - DÉTECTÉ
    $scope.lodashMerge = function() {
        try {
            var userObj = JSON.parse($scope.mergeData);
            var target = {};
            
            // FLAG: Lodash merge (vulnerable version)
            _.merge(target, userObj);
            
            console.log('Lodash merged:', target);
        } catch (e) {
            console.error('Error:', e);
        }
    };
    
    // VULNÉRABLE: jQuery extend deep - DÉTECTÉ
    $scope.jqueryExtend = function() {
        try {
            var userObj = JSON.parse($scope.extendData);
            var target = {};
            
            // FLAG: jQuery deep extend
            $.extend(true, target, userObj);
            
            console.log('jQuery extended:', target);
        } catch (e) {
            console.error('Error:', e);
        }
    };
    
    // VULNÉRABLE: Angular.extend - DÉTECTÉ
    $scope.angularExtend = function() {
        try {
            var userObj = JSON.parse($scope.extendData);
            var target = {};
            
            // FLAG: Angular extend with user input
            angular.extend(target, userObj);
            
            console.log('Angular extended:', target);
        } catch (e) {
            console.error('Error:', e);
        }
    };
    
    // VULNÉRABLE: Recursive copy sans protection - DÉTECTÉ
    $scope.recursiveCopy = function() {
        try {
            var userObj = JSON.parse($scope.objectData);
            
            // FLAG: Recursive copy without prototype check
            function copy(obj) {
                var result = {};
                for (var key in obj) {
                    if (typeof obj[key] === 'object' && obj[key] !== null) {
                        result[key] = copy(obj[key]);
                    } else {
                        result[key] = obj[key];
                    }
                }
                return result;
            }
            
            var copied = copy(userObj);
            console.log('Copied object:', copied);
        } catch (e) {
            console.error('Error:', e);
        }
    };
    
    // Test de pollution
    $scope.testPollution = function() {
        // Vérifier si Object.prototype a été pollué
        console.log('isAdmin:', {}.isAdmin);
        console.log('role:', {}.role);
        console.log('toString polluted?:', {}.toString !== Object.prototype.toString);
    };
    
    // Helper pour afficher des exemples
    $scope.getExamplePayload = function() {
        return JSON.stringify({
            "__proto__": {
                "isAdmin": true,
                "role": "admin"
            }
        }, null, 2);
    };
    
    $scope.getConstructorPayload = function() {
        return JSON.stringify({
            "constructor": {
                "prototype": {
                    "isAdmin": true
                }
            }
        }, null, 2);
    };
}]);