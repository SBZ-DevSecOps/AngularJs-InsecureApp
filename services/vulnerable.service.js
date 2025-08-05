angular.module('vulnerableApp')
.service('VulnerableService', ['$http', '$window', function($http, $window) {
    
    // VULNÉRABLE: Secrets dans le service - DÉTECTÉ
    this.apiKey = 'sk_test_4eC39HqLyjWDarjtT1zdp7dc';
    this.secretToken = 'secret_token_xyz789';
    
    // VULNÉRABLE: URL de base avec credentials - DÉTECTÉ
    this.baseUrl = 'https://admin:password123@api.example.com';
    
    // VULNÉRABLE: Fonction eval dans service - DÉTECTÉ
    this.executeCode = function(code) {
        // FLAG: eval in service
        return eval(code);
    };
    
    // VULNÉRABLE: Stockage non sécurisé - DÉTECTÉ
    this.saveCredentials = function(username, password) {
        // FLAG: Credentials in localStorage
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        
        // FLAG: Credentials in cookie without flags
        document.cookie = 'auth=' + username + ':' + password;
    };
    
    // VULNÉRABLE: Construction d'URL sans validation - DÉTECTÉ
    this.buildUrl = function(userInput) {
        // FLAG: URL construction with user input
        return 'https://api.example.com/search?q=' + userInput;
    };
    
    // VULNÉRABLE: Requête HTTP sans validation - DÉTECTÉ
    this.makeRequest = function(url) {
        // FLAG: HTTP request to user-controlled URL
        return $http.get(url);
    };
    
    // VULNÉRABLE: Parsing JSON avec eval - DÉTECTÉ
    this.parseData = function(jsonString) {
        try {
            return JSON.parse(jsonString);
        } catch (e) {
            // FLAG: eval as JSON fallback
            return eval('(' + jsonString + ')');
        }
    };
    
    // VULNÉRABLE: Injection dans headers - DÉTECTÉ
    this.setCustomHeader = function(headerValue) {
        // FLAG: Header injection
        $http.defaults.headers.common['X-Custom'] = headerValue;
    };
    
    // VULNÉRABLE: Logging de données sensibles - DÉTECTÉ
    this.debugLog = function(data) {
        // FLAG: Sensitive data in logs
        console.log('API Key:', this.apiKey);
        console.log('User Data:', data);
        console.log('Token:', localStorage.getItem('authToken'));
    };
}])

// VULNÉRABLE: Factory avec configuration dangereuse - DÉTECTÉ
.factory('InsecureFactory', ['$sce', function($sce) {
    return {
        // FLAG: trustAsHtml in factory
        trustHtml: function(html) {
            return $sce.trustAsHtml(html);
        },
        
        // FLAG: trustAsJs (très dangereux)
        trustJs: function(js) {
            return $sce.trustAsJs(js);
        },
        
        // FLAG: trustAsResourceUrl
        trustUrl: function(url) {
            return $sce.trustAsResourceUrl(url);
        }
    };
}]);