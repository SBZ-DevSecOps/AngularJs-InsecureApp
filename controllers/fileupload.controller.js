angular.module('vulnerableApp')
.controller('FileUploadController', ['$scope', function($scope) {
    
    $scope.fileName = '';
    $scope.fileContent = '';
    $scope.uploadPath = '';
    
    // VULNÉRABLE: Pas de validation du type de fichier - DÉTECTÉ
    $scope.handleFileUpload = function(files) {
        if (files && files.length > 0) {
            var file = files[0];
            
            // FLAG: No file type validation
            $scope.fileName = file.name;
            
            // VULNÉRABLE: Accepter tous les types - DÉTECTÉ
            var reader = new FileReader();
            reader.onload = function(e) {
                $scope.$apply(function() {
                    $scope.fileContent = e.target.result;
                    
                    // FLAG: Direct display of file content
                    document.getElementById('file-preview').innerHTML = e.target.result;
                });
            };
            
            // FLAG: Reading file as text without validation
            reader.readAsText(file);
        }
    };
    
    // VULNÉRABLE: Stockage de fichier en localStorage - DÉTECTÉ
    $scope.storeFileInBrowser = function() {
        // FLAG: Storing file content in localStorage
        if ($scope.fileContent) {
            localStorage.setItem('uploadedFile_' + $scope.fileName, $scope.fileContent);
            
            // FLAG: Storing sensitive file data in sessionStorage
            sessionStorage.setItem('lastFile', JSON.stringify({
                name: $scope.fileName,
                content: $scope.fileContent,
                type: 'uploaded'
            }));
        }
    };
    
    // VULNÉRABLE: Nom de fichier non validé - DÉTECTÉ
    $scope.processFileName = function() {
        // FLAG: Unsafe file name handling
        var script = '<script>alert("XSS via filename")</script>';
        
        // Affichage direct du nom
        document.getElementById('filename-display').innerHTML = 'Fichier: ' + $scope.fileName;
        
        // Création d'un lien avec le nom
        var link = document.createElement('a');
        link.href = '#';
        // FLAG: XSS via file name
        link.innerHTML = $scope.fileName;
        document.getElementById('file-link').appendChild(link);
    };
    
    // VULNÉRABLE: Exécution de fichier HTML uploadé - DÉTECTÉ
    $scope.previewHTML = function() {
        if ($scope.fileContent) {
            // FLAG: Direct HTML rendering
            var preview = document.getElementById('html-preview');
            preview.innerHTML = $scope.fileContent;
            
            // Aussi vulnérable avec srcdoc
            var iframe = document.getElementById('preview-iframe');
            if (iframe) {
                // FLAG: iframe srcdoc with user content
                iframe.srcdoc = $scope.fileContent;
            }
        }
    };
    
    // VULNÉRABLE: Pas de limite de taille - DÉTECTÉ
    $scope.uploadLargeFile = function(file) {
        // FLAG: No file size limit
        var maxSize = Infinity; // Pas de limite!
        
        if (file.size < maxSize) {
            console.log('Uploading file of size:', file.size);
        }
    };
    
    // VULNÉRABLE: Exécution de JavaScript depuis un fichier - DÉTECTÉ
    $scope.executeUploadedJS = function() {
        if ($scope.fileContent && $scope.fileName.endsWith('.js')) {
            // FLAG: Executing uploaded JavaScript
            try {
                eval($scope.fileContent);
            } catch (e) {
                console.error('Error executing JS:', e);
            }
            
            // Alternative aussi dangereuse
            // FLAG: Creating script from file content
            var script = document.createElement('script');
            script.textContent = $scope.fileContent;
            document.body.appendChild(script);
        }
    };
    
    // VULNÉRABLE: Web Workers avec contenu uploadé - DÉTECTÉ
    $scope.createWorkerFromFile = function() {
        if ($scope.fileContent) {
            // FLAG: Creating Worker from user content
            var blob = new Blob([$scope.fileContent], {type: 'application/javascript'});
            var workerUrl = URL.createObjectURL(blob);
            
            try {
                var worker = new Worker(workerUrl);
                // Jamais terminé = fuite de ressources
            } catch (e) {
                console.error('Worker error:', e);
            }
        }
    };
    
    // VULNÉRABLE: Création d'URL blob sans revoke - DÉTECTÉ
    $scope.createBlobURL = function(file) {
        // FLAG: Creating blob URL without cleanup
        var blob = new Blob([file], {type: file.type});
        var url = URL.createObjectURL(blob);
        
        // Jamais révoqué = fuite mémoire
        document.getElementById('blob-link').href = url;
        
        // FLAG: Multiple blob URLs without revocation
        for (var i = 0; i < 10; i++) {
            URL.createObjectURL(blob); // Fuite mémoire
        }
    };
    
    // Helper pour obtenir l'extension
    $scope.getFileExtension = function(filename) {
        // VULNÉRABLE: Validation basée sur l'extension seule
        return filename.split('.').pop();
    };
}]);