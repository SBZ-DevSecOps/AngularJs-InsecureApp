angular.module('vulnerableApp')
.controller('StorageController', ['$scope', '$window', function($scope, $window) {
    
    // VULNÉRABLE: Secrets en dur - DÉTECTÉ
    $scope.apiKey = 'sk_live_4eC39HqLyjWDarjtT1zdp7dc';
    $scope.apiSecret = 'secret_key_abcdef123456';
    $scope.dbPassword = 'admin123!@#';
    
    // VULNÉRABLE: AWS Credentials - DÉTECTÉ
    var awsAccessKey = 'AKIAIOSFODNN7EXAMPLE';
    var awsSecretKey = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY';
    
    // VULNÉRABLE: Tokens - DÉTECTÉ
    var githubToken = 'ghp_1234567890abcdefghijklmnopqrstuvwxyz';
    var slackWebhook = 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX';
    
    // VULNÉRABLE: Clé privée - DÉTECTÉ
    var privateKey = '-----BEGIN RSA PRIVATE KEY-----\n' +
                     'MIIEpAIBAAKCAQEA0Z3VS5JJcds3xfn/ygWyF32TpPQ\n' +
                     '-----END RSA PRIVATE KEY-----';
    
    $scope.showSecrets = false;
    $scope.secrets = {
        apiKey: $scope.apiKey,
        awsAccessKey: awsAccessKey,
        githubToken: githubToken,
        dbPassword: $scope.dbPassword
    };
    
    // VULNÉRABLE: Stockage de mot de passe - DÉTECTÉ
    $scope.storePassword = function(password) {
        // FLAG: Password in localStorage
        localStorage.setItem('userPassword', password);
        localStorage.setItem('password', password);
        
        // FLAG: Password in sessionStorage
        sessionStorage.setItem('tempPassword', password);
        
        // FLAG: Password in cookie
        document.cookie = 'password=' + password;
    };
    
    // VULNÉRABLE: Stockage de token - DÉTECTÉ
    $scope.storeAuthToken = function(token) {
        // FLAG: Auth token in localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('bearerToken', token);
        localStorage.setItem('accessToken', token);
        localStorage.setItem('api_token', token);
    };
    
    // VULNÉRABLE: Stockage de données bancaires - DÉTECTÉ
    $scope.storeCreditCard = function(cardNumber, cvv) {
        // FLAG: Credit card in localStorage
        localStorage.setItem('creditCard', cardNumber);
        localStorage.setItem('cvv', cvv);
        
        var cardData = {
            number: cardNumber,
            cvv: cvv,
            expiry: '12/25'
        };
        
        // FLAG: Sensitive financial data
        localStorage.setItem('paymentInfo', JSON.stringify(cardData));
    };
    
    // VULNÉRABLE: Base64 n'est pas du chiffrement - DÉTECTÉ
    $scope.encodePassword = function(password) {
        // FLAG: Base64 encoding for sensitive data
        var encoded = btoa(password);
        localStorage.setItem('encodedPassword', encoded);
        return encoded;
    };
    
    // VULNÉRABLE: Logs de données sensibles - DÉTECTÉ
    $scope.logSensitiveData = function() {
        // FLAG: Console.log with sensitive data
        console.log('Password:', localStorage.getItem('userPassword'));
        console.log('Token:', localStorage.getItem('authToken'));
        console.log('API Key:', $scope.apiKey);
        console.log('Credit Card:', localStorage.getItem('creditCard'));
        console.error('AWS Secret:', awsSecretKey);
    };
    
    // VULNÉRABLE: Cookies sans flags - DÉTECTÉ
    $scope.setInsecureCookie = function(name, value) {
        // FLAG: Cookie without Secure, HttpOnly, SameSite
        document.cookie = name + '=' + value;
    };
    
    // Helpers pour l'affichage
    $scope.getStoredPassword = function() {
        return localStorage.getItem('userPassword') || 'Aucun';
    };
    
    $scope.getStoredToken = function() {
        var token = localStorage.getItem('authToken') || '';
        return token ? token.substring(0, 20) + '...' : 'Aucun';
    };
    
    $scope.toggleSecrets = function() {
        $scope.showSecrets = !$scope.showSecrets;
    };
}]);