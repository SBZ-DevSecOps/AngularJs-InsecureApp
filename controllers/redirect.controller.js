angular.module('vulnerableApp')
.controller('RedirectController', ['$scope', '$window', '$location', function($scope, $window, $location) {
    
    $scope.redirectUrl = '';
    $scope.returnUrl = '';
    $scope.nextPage = '';
    $scope.cryptoKey = '';
    $scope.hashInput = '';
    
    // VULNÉRABLE: Open Redirect avec window.location - DÉTECTÉ
    $scope.redirectWithLocation = function() {
        // FLAG: Open redirect via window.location
        window.location.href = $scope.redirectUrl;
    };
    
    // VULNÉRABLE: Open Redirect avec window.location.replace - DÉTECTÉ
    $scope.redirectWithReplace = function() {
        // FLAG: Open redirect via location.replace
        window.location.replace($scope.redirectUrl);
    };
    
    // VULNÉRABLE: Redirect via paramètre URL - DÉTECTÉ
    $scope.redirectFromParam = function() {
        var redirectParam = $location.search().redirect || $location.search().returnUrl || $location.search().next;
        if (redirectParam) {
            // FLAG: Unvalidated redirect parameter
            window.location.href = redirectParam;
        }
    };
    
    // VULNÉRABLE: window.open sans validation - DÉTECTÉ
    $scope.openNewWindow = function() {
        // FLAG: window.open with user input
        window.open($scope.redirectUrl, '_blank');
    };
    
    // VULNÉRABLE: Meta refresh injection - DÉTECTÉ
    $scope.metaRefreshRedirect = function() {
        var meta = document.createElement('meta');
        meta.httpEquiv = 'refresh';
        // FLAG: Meta refresh with user input
        meta.content = '0;url=' + $scope.redirectUrl;
        document.head.appendChild(meta);
    };
    
    // VULNÉRABLE: JavaScript protocol redirect - DÉTECTÉ
    $scope.javascriptRedirect = function() {
        // FLAG: javascript: protocol in location
        location.href = 'javascript:' + $scope.redirectUrl;
    };
    
    // VULNÉRABLE: Crypto MD5 (obsolète) - DÉTECTÉ
    $scope.useMD5 = function() {
        // FLAG: MD5 usage (weak crypto)
        // Simulation d'utilisation MD5
        var md5Hash = 'MD5(' + $scope.hashInput + ')';
        console.log('Using weak MD5:', md5Hash);
        return md5Hash;
    };
    
    // VULNÉRABLE: Crypto SHA1 (faible) - DÉTECTÉ
    $scope.useSHA1 = function() {
        // FLAG: SHA1 usage (weak crypto)
        var sha1Hash = 'SHA1(' + $scope.hashInput + ')';
        console.log('Using weak SHA1:', sha1Hash);
        return sha1Hash;
    };
    
    // VULNÉRABLE: Clé de chiffrement faible - DÉTECTÉ
    $scope.weakEncryption = function() {
        // FLAG: Weak encryption key
        var weakKey = '1234567890';
        var simpleKey = 'password';
        var shortKey = 'key';
        
        console.log('Using weak keys:', weakKey, simpleKey, shortKey);
    };
    
    // VULNÉRABLE: Redirect basé sur le referrer - DÉTECTÉ
    $scope.referrerRedirect = function() {
        // FLAG: Referrer-based redirect
        var referrer = document.referrer;
        if (referrer) {
            window.location.href = referrer;
        }
    };
    
    // VULNÉRABLE: Angular $location redirect - DÉTECTÉ
    $scope.angularRedirect = function() {
        // FLAG: Unvalidated Angular redirect
        $location.url($scope.redirectUrl);
    };
    
    // VULNÉRABLE: Form action redirect - DÉTECTÉ
    $scope.formActionRedirect = function() {
        var form = document.getElementById('redirect-form');
        if (form) {
            // FLAG: Dynamic form action
            form.action = $scope.redirectUrl;
            form.submit();
        }
    };
    
    // Helper pour afficher les URLs de redirection actuelles
    $scope.getCurrentRedirectParams = function() {
        return {
            redirect: $location.search().redirect,
            returnUrl: $location.search().returnUrl,
            next: $location.search().next
        };
    };
}]);