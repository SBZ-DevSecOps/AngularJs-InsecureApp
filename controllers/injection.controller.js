angular.module('vulnerableApp')
.controller('InjectionController', ['$scope', '$timeout', '$interval', function($scope, $timeout, $interval) {
    
    $scope.codeInput = '';
    $scope.functionCode = '';
    $scope.timeoutCode = '';
    $scope.jsonInput = '';
    $scope.scriptContent = '';
    $scope.eventCode = '';
    
    $scope.evalResult = '';
    $scope.functionResult = '';
    $scope.jsonResult = '';
    
    // VULNÉRABLE: eval() direct - DÉTECTÉ
    $scope.executeEval = function() {
        try {
            // FLAG: eval usage
            $scope.evalResult = eval($scope.codeInput);
        } catch (e) {
            $scope.evalResult = 'Erreur: ' + e.message;
        }
    };
    
    // VULNÉRABLE: Function constructor - DÉTECTÉ
    $scope.executeFunctionConstructor = function() {
        try {
            // FLAG: Function constructor (equivalent to eval)
            var fn = new Function($scope.functionCode);
            $scope.functionResult = fn();
        } catch (e) {
            $scope.functionResult = 'Erreur: ' + e.message;
        }
    };
    
    // VULNÉRABLE: Function avec return - DÉTECTÉ
    $scope.executeFunctionWithReturn = function() {
        try {
            // FLAG: Function constructor with return
            var fn = new Function('return ' + $scope.functionCode);
            return fn();
        } catch (e) {
            return null;
        }
    };
    
    // VULNÉRABLE: setTimeout avec string - DÉTECTÉ
    $scope.executeSetTimeout = function() {
        // FLAG: setTimeout with string (implicit eval)
        setTimeout($scope.timeoutCode, 0);
        
        // Alternative aussi vulnérable
        window.setTimeout($scope.timeoutCode, 100);
    };
    
    // VULNÉRABLE: setInterval avec string - DÉTECTÉ
    $scope.executeSetInterval = function() {
        // FLAG: setInterval with string
        var interval = setInterval($scope.timeoutCode, 1000);
        
        // Arrêter après 3 secondes
        $timeout(function() {
            clearInterval(interval);
        }, 3000);
    };
    
    // VULNÉRABLE: Angular $eval - DÉTECTÉ (spécifique AngularJS)
    $scope.executeAngularEval = function() {
        try {
            // FLAG: $eval with user input
            $scope.evalResult = $scope.$eval($scope.codeInput);
        } catch (e) {
            $scope.evalResult = 'Erreur: ' + e.message;
        }
    };
    
    // VULNÉRABLE: JSON.parse avec fallback eval - DÉTECTÉ
    $scope.parseJsonUnsafe = function() {
        try {
            $scope.jsonResult = JSON.parse($scope.jsonInput);
        } catch (e) {
            try {
                // FLAG: eval as JSON.parse fallback
                $scope.jsonResult = eval('(' + $scope.jsonInput + ')');
            } catch (e2) {
                $scope.jsonResult = 'Erreur de parsing';
            }
        }
    };
    
    // VULNÉRABLE: Script injection - DÉTECTÉ
    $scope.injectScript = function() {
        var script = document.createElement('script');
        // FLAG: Dynamic script text content
        script.textContent = $scope.scriptContent;
        document.head.appendChild(script);
    };
    
    // VULNÉRABLE: Element.setAttribute avec event handler - DÉTECTÉ
    $scope.setEventHandler = function() {
        var container = document.getElementById('dynamic-button-container');
        if (container) {
            container.innerHTML = ''; // Clear
            var button = document.createElement('button');
            button.textContent = 'Cliquez-moi!';
            
            // FLAG: Setting onclick attribute with string
            button.setAttribute('onclick', $scope.eventCode);
            container.appendChild(button);
        }
    };
    
    // VULNÉRABLE: javascript: protocol - DÉTECTÉ
    $scope.executeViaProtocol = function() {
        // FLAG: javascript: URL
        location.href = 'javascript:' + $scope.codeInput;
    };
    
    // VULNÉRABLE: AngularJS expression injection - DÉTECTÉ
    $scope.expressionInput = '';
    $scope.interpolateExpression = function() {
        // Simulation d'interpolation dangereuse
        var template = '{{' + $scope.expressionInput + '}}';
        // Dans un vrai cas, ceci serait compilé par Angular
        $scope.expressionResult = 'Expression: ' + template;
    };
    
    // VULNÉRABLE: document.write avec script - DÉTECTÉ
    $scope.writeScript = function() {
        // FLAG: document.write with script
        document.write('<script>' + $scope.scriptContent + '</script>');
    };
}]);