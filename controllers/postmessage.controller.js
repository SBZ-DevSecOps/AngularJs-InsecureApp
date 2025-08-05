angular.module('vulnerableApp')
.controller('PostMessageController', ['$scope', '$window', function($scope, $window) {
    
    $scope.messageToSend = '';
    $scope.targetOrigin = '*';
    $scope.receivedMessages = [];
    $scope.listenersActive = false;
    
    // NE PAS activer les listeners automatiquement pour éviter les popups
    $scope.activateListeners = function() {
        if ($scope.listenersActive) {
            console.log('Listeners déjà actifs');
            return;
        }
        
        $scope.listenersActive = true;
        
        // VULNÉRABLE: PostMessage sans validation d'origine - DÉTECTÉ
        window.addEventListener('message', function(event) {
            // FLAG: No origin validation in message handler
            $scope.$apply(function() {
                $scope.receivedMessages.push({
                    data: event.data,
                    origin: event.origin
                });
            });
            
            // VULNÉRABLE: Traitement direct des données - DÉTECTÉ
            if (event.data.action) {
                // FLAG: Direct eval of message data
                eval(event.data.action);
            }
            
            // VULNÉRABLE: innerHTML avec données du message - DÉTECTÉ
            if (event.data.html) {
                var element = document.getElementById('message-output');
                if (element) {
                    // FLAG: innerHTML with postMessage data
                    element.innerHTML = event.data.html;
                }
            }
        });
        
        // Ajouter les autres listeners vulnérables
        $scope.autoActionListener();
        $scope.setupAutoResponder();
        $scope.trustExternalData();
    };
    
    // VULNÉRABLE: PostMessage avec '*' comme origine - DÉTECTÉ
    $scope.sendToAnyOrigin = function() {
        // FLAG: postMessage with wildcard origin
        window.parent.postMessage($scope.messageToSend, '*');
        
        // Aussi vulnérable avec un objet
        window.parent.postMessage({
            secret: 'confidential-data',
            token: localStorage.getItem('authToken')
        }, '*');
    };
    
    // VULNÉRABLE: Listener avec action automatique - DÉTECTÉ
    $scope.autoActionListener = function() {
        window.addEventListener('message', function(e) {
            // FLAG: No origin check before action
            if (e.data.command === 'redirect') {
                window.location.href = e.data.url;
            }
            
            if (e.data.command === 'execute') {
                // FLAG: Function constructor from postMessage
                new Function(e.data.code)();
            }
        });
    };
    
    // VULNÉRABLE: Réponse automatique aux messages - DÉTECTÉ
    $scope.setupAutoResponder = function() {
        window.addEventListener('message', function(event) {
            // FLAG: Auto-response without origin check
            event.source.postMessage({
                userData: localStorage.getItem('userData'),
                sessionId: sessionStorage.getItem('sessionId')
            }, event.origin);
        });
    };
    
    // VULNÉRABLE: Trust de données externes - DÉTECTÉ
    $scope.trustExternalData = function() {
        window.addEventListener('message', function(event) {
            // FLAG: Direct DOM manipulation from message
            var element = document.getElementById(event.data.elementId);
            if (element && event.data.content) {
                element.innerHTML = event.data.content;
            }
            
            // FLAG: Style injection from message
            if (event.data.styles) {
                var style = document.createElement('style');
                style.textContent = event.data.styles;
                document.head.appendChild(style);
            }
        });
    };
    
    // VULNÉRABLE: Broadcast de données sensibles - DÉTECTÉ
    $scope.broadcastSensitiveData = function() {
        // FLAG: Broadcasting sensitive data
        var sensitiveData = {
            user: 'admin',
            password: localStorage.getItem('password'),
            apiKey: 'secret-key-123'
        };
        
        // Envoyer à toutes les fenêtres
        window.postMessage(sensitiveData, '*');
        
        // Envoyer aux iframes
        var iframes = document.getElementsByTagName('iframe');
        for (var i = 0; i < iframes.length; i++) {
            iframes[i].contentWindow.postMessage(sensitiveData, '*');
        }
    };
    
    // VULNÉRABLE: JSON.parse sans try-catch - DÉTECTÉ
    $scope.unsafeMessageParsing = function() {
        window.addEventListener('message', function(event) {
            // FLAG: Unsafe JSON parsing of message
            var data = JSON.parse(event.data);
            
            // Utilisation directe des données parsées
            var element = document.getElementById('parsed-output');
            if (element) {
                element.textContent = data.content;
            }
        });
    };
    
    // Helper pour simuler l'envoi de messages
    $scope.simulateMessage = function() {
        window.postMessage({
            action: "console.log('Message reçu!')",
            html: "<img src=x onerror='alert(1)'>",
            command: "redirect",
            url: "http://evil.com"
        }, '*');
    };
}]);