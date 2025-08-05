// Module principal - VERSION PROPRE sans exécutions automatiques
angular.module('vulnerableApp', ['ngRoute', 'ngSanitize'])

.config(['$routeProvider', '$compileProvider', function($routeProvider, $compileProvider) {
    
    // NE PAS désactiver SCE globalement pour éviter les exécutions auto
    // Les vulnérabilités SCE seront gérées localement dans les contrôleurs
    
    // Routes
    $routeProvider
        .when('/', {
            template: '<div class="panel panel-info"><div class="panel-body"><h2>Application de Test OWASP - AngularJS</h2><p>Cette application contient des vulnérabilités intentionnelles pour tester les outils SAST.</p><p><strong>Instructions :</strong></p><ul><li>Sélectionnez une vulnérabilité dans le menu</li><li>Suivez les instructions pour chaque test</li><li>Les vulnérabilités ne s\'exécutent que sur action utilisateur</li></ul></div></div>'
        })
        .when('/xss', {
            templateUrl: 'templates/xss.html',
            controller: 'XssController'
        })
        .when('/storage', {
            templateUrl: 'templates/storage.html',
            controller: 'StorageController'
        })
        .when('/injection', {
            templateUrl: 'templates/injection.html',
            controller: 'InjectionController'
        })
        .when('/redirect', {
            templateUrl: 'templates/redirect.html',
            controller: 'RedirectController'
        })
        .when('/prototype', {
            templateUrl: 'templates/prototype.html',
            controller: 'PrototypeController'
        })
        .when('/postmessage', {
            templateUrl: 'templates/postmessage.html',
            controller: 'PostMessageController'
        })
        .when('/fileupload', {
            templateUrl: 'templates/fileupload.html',
            controller: 'FileUploadController'
        })
        .when('/regex', {
            templateUrl: 'templates/regex.html',
            controller: 'RegexController'
        })
        .otherwise({
            redirectTo: '/'
        });
}])

.run(['$rootScope', function($rootScope) {
    // Données statiques uniquement - pas de fonctions eval
    $rootScope.apiKey = 'sk_live_4eC39HqLyjWDarjtT1zdp7dc';
    $rootScope.debugMode = false;
    
    console.log('Application chargée - Aucune vulnérabilité active par défaut');
}]);