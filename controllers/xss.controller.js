angular.module('vulnerableApp')
.controller('XssController', ['$scope', '$sce', '$location', '$timeout', function($scope, $sce, $location, $timeout) {
    
    console.log('XssController chargé - Aucune exécution automatique');
    
    // Initialisation des variables SANS contenu dangereux
    $scope.userInput = '';
    $scope.htmlInput = '';
    $scope.writeInput = '';
    $scope.trustedHtml = '';
    $scope.rawHtml = '';
    $scope.userExpression = '';
    $scope.expressionResult = '';
    $scope.templateUrl = '';
    $scope.dynamicTemplate = '';
    $scope.userTemplate = '';
    
    // Récupérer le paramètre URL mais NE PAS l'exécuter
    $scope.urlParam = $location.search().q || '';
    $scope.urlExecuted = false;
    
    // Activer SCE localement pour cette fonction uniquement
    $scope.enableVulnerability = false;
    
    // Bouton pour activer les vulnérabilités
    $scope.activateVulnerabilities = function() {
        $scope.enableVulnerability = true;
        console.log('Vulnérabilités XSS activées');
    };
    
    // VULNÉRABLE: innerHTML direct - nécessite activation
    $scope.injectViaInnerHTML = function() {
        if (!$scope.enableVulnerability) {
            alert('Activez d\'abord les vulnérabilités');
            return;
        }
        
        $timeout(function() {
            var element = document.getElementById('innerHTML-output');
            if (element && $scope.userInput) {
                // FLAG: Direct innerHTML assignment
                element.innerHTML = $scope.userInput;
            }
        }, 0);
    };
    
    // VULNÉRABLE: bypassSecurityTrustHtml - nécessite activation
    $scope.bypassSecurity = function() {
        if (!$scope.enableVulnerability) {
            alert('Activez d\'abord les vulnérabilités');
            return;
        }
        
        if ($scope.htmlInput) {
            // FLAG: Bypass Angular security
            $scope.trustedHtml = $sce.trustAsHtml($scope.htmlInput);
        }
    };
    
    // VULNÉRABLE: document.write - nécessite activation
    $scope.useDocumentWrite = function() {
        if (!$scope.enableVulnerability) {
            alert('Activez d\'abord les vulnérabilités');
            return;
        }
        
        if ($scope.writeInput) {
            // FLAG: document.write usage
            document.write($scope.writeInput);
        }
    };
    
    // VULNÉRABLE: jQuery html() - nécessite activation
    $scope.jqueryInject = function() {
        if (!$scope.enableVulnerability) {
            alert('Activez d\'abord les vulnérabilités');
            return;
        }
        
        $timeout(function() {
            if ($scope.userInput && typeof $ !== 'undefined') {
                // FLAG: jQuery html with user input
                $('#jquery-output').html($scope.userInput);
            }
        }, 0);
    };
    
    // VULNÉRABLE: DOM XSS via URL - nécessite action manuelle
    $scope.processUrlParam = function() {
        if (!$scope.enableVulnerability) {
            alert('Activez d\'abord les vulnérabilités');
            return;
        }
        
        if ($scope.urlExecuted) {
            alert('Paramètre URL déjà exécuté');
            return;
        }
        
        $timeout(function() {
            var param = $location.search().q;
            var element = document.getElementById('url-output');
            if (param && element) {
                // FLAG: Direct DOM manipulation with URL param
                element.innerHTML = 'Recherche: ' + param;
                $scope.urlExecuted = true;
            }
        }, 0);
    };
    
    // VULNÉRABLE: Expression injection - nécessite activation
    $scope.evaluateExpression = function() {
        if (!$scope.enableVulnerability) {
            alert('Activez d\'abord les vulnérabilités');
            return;
        }
        
        if ($scope.userExpression) {
            try {
                // FLAG: $eval with user input
                $scope.expressionResult = $scope.$eval($scope.userExpression);
            } catch (e) {
                $scope.expressionResult = 'Erreur: ' + e.message;
            }
        }
    };
    
    // VULNÉRABLE: Template compilation - nécessite activation
    $scope.compileTemplate = function(template) {
        if (!$scope.enableVulnerability) {
            return 'Activez d\'abord les vulnérabilités';
        }
        
        if (template) {
            try {
                // FLAG: Dynamic template compilation
                return $sce.trustAsHtml(template);
            } catch (e) {
                console.error('Template error:', e);
                return '';
            }
        }
        return '';
    };
    
    // VULNÉRABLE: ng-include dynamique - nécessite activation
    $scope.loadTemplate = function() {
        if (!$scope.enableVulnerability) {
            alert('Activez d\'abord les vulnérabilités');
            return;
        }
        
        if ($scope.templateUrl) {
            $scope.dynamicTemplate = $scope.templateUrl;
        }
    };
}]);