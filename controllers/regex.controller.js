angular.module('vulnerableApp')
.controller('RegexController', ['$scope', '$timeout', function($scope, $timeout) {
    
    $scope.emailInput = '';
    $scope.urlInput = '';
    $scope.phoneInput = '';
    $scope.customPattern = '';
    $scope.testString = '';
    $scope.processing = false;
    
    // VULNÉRABLE: Regex avec backtracking excessif (email) - DÉTECTÉ
    $scope.validateEmailUnsafe = function() {
        $scope.processing = true;
        
        // FLAG: ReDoS vulnerable regex pattern
        var unsafeEmailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        
        // Test avec input malicieux: "aaaaaaaaaaaaaaaaaaaaaaaaa@"
        var result = unsafeEmailRegex.test($scope.emailInput);
        
        $timeout(function() {
            $scope.processing = false;
            console.log('Email validation result:', result);
        }, 100);
    };
    
    // VULNÉRABLE: Regex complexe pour URL - DÉTECTÉ
    $scope.validateURLUnsafe = function() {
        // FLAG: Complex regex with catastrophic backtracking
        var unsafeUrlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        
        // Encore plus vulnérable
        var veryUnsafeRegex = /^(([a-z]+:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-\.]+)*\/?)?$/;
        
        console.log('Testing URL with unsafe regex...');
        var result = unsafeUrlRegex.test($scope.urlInput);
    };
    
    // VULNÉRABLE: Regex avec quantificateurs imbriqués - DÉTECTÉ
    $scope.nestedQuantifiers = function() {
        // FLAG: Nested quantifiers causing ReDoS
        var vulnerableRegex = /(a+)+b/;
        var anotherVulnerable = /(a*)*b/;
        var yetAnother = /(a+)*b/;
        
        // Test avec "aaaaaaaaaaaaaaaaaaaaa!"
        console.log('Testing with nested quantifiers...');
        vulnerableRegex.test($scope.testString);
    };
    
    // VULNÉRABLE: Regex pour validation de mot de passe - DÉTECTÉ
    $scope.validatePasswordUnsafe = function() {
        // FLAG: ReDoS in password validation
        var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
        
        // Pattern avec alternances multiples
        var complexRegex = /^((?=.*[a-z])|(?=.*[A-Z]))+(?=.*\d).+$/;
        
        console.log('Validating password...');
        return passwordRegex.test($scope.testString);
    };
    
    // VULNÉRABLE: Regex pour numéro de téléphone - DÉTECTÉ
    $scope.validatePhoneUnsafe = function() {
        // FLAG: Phone regex with ReDoS
        var phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
        var unsafePhoneRegex = /^([0-9]+\s?)+$/;
        
        // Pattern avec groupes répétés
        var veryUnsafe = /^(\d+[-.\s]?)+$/;
        
        return unsafePhoneRegex.test($scope.phoneInput);
    };
    
    // VULNÉRABLE: Regex personnalisée de l'utilisateur - DÉTECTÉ
    $scope.testCustomRegex = function() {
        try {
            // FLAG: User-controlled regex
            var userRegex = new RegExp($scope.customPattern);
            
            // Test direct sans timeout ni protection
            var result = userRegex.test($scope.testString);
            console.log('Custom regex result:', result);
        } catch (e) {
            console.error('Invalid regex:', e);
        }
    };
    
    // VULNÉRABLE: Regex pour parser du HTML - DÉTECTÉ
    $scope.parseHTMLUnsafe = function() {
        // FLAG: HTML parsing with regex (bad practice + ReDoS)
        var htmlRegex = /<\/?[a-z][\s\S]*>/i;
        var tagRegex = /<([a-z]+)(?:\s+[a-z]+(?:\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)*\s*>/gi;
        
        // Pattern extrêmement vulnérable
        var vulnerableHtmlRegex = /<[^>]+>/g;
        
        console.log('Parsing HTML with regex (bad idea!)...');
        return $scope.testString.match(tagRegex);
    };
    
    // VULNÉRABLE: Multiple regex en séquence - DÉTECTÉ
    $scope.multipleRegexValidation = function() {
        var input = $scope.testString;
        
        // FLAG: Multiple ReDoS vulnerable patterns
        var patterns = [
            /(a+)+b/,
            /(\d+)+$/,
            /^(a?){n}a{n}$/,
            /(x+x+)+y/,
            /([a-zA-Z]+)*[0-9]+/
        ];
        
        patterns.forEach(function(pattern, index) {
            console.log('Testing pattern', index);
            pattern.test(input);
        });
    };
    
    // Helper pour générer des chaînes malicieuses
    $scope.generateMaliciousInput = function(type) {
        switch(type) {
            case 'email':
                return 'a'.repeat(50) + '@';
            case 'nested':
                return 'a'.repeat(30) + '!';
            case 'phone':
                return '1'.repeat(40);
            default:
                return 'x'.repeat(25) + 'y';
        }
    };
}]);