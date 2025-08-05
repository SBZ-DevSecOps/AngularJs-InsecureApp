# AngularJS SAST/SCA Test Application

## ⚠️ AVERTISSEMENT

Cette application AngularJS (1.x) contient **intentionnellement** des vulnérabilités de sécurité pour tester les outils SAST/SCA.

**NE JAMAIS DÉPLOYER EN PRODUCTION !**

## 🎯 Objectif

Tester la capacité des outils SAST/SCA à détecter des vulnérabilités frontend dans une application AngularJS 1.x, spécifiquement les vulnérabilités du Top 10 OWASP pour les applications web côté client.

## 📊 Résumé des Vulnérabilités

| Composant | Vulnérabilités | Détections attendues |
|-----------|----------------|---------------------|
| **XSS** | innerHTML, bypassSecurity, document.write | 8-10 |
| **Storage** | localStorage, secrets en dur | 15-20 |
| **Injection** | eval, Function, setTimeout | 6-8 |
| **Redirect** | open redirect, crypto faible | 8-10 |
| **Prototype Pollution** | merge, Object.assign | 4-6 |
| **PostMessage** | pas de validation origine | 5-7 |
| **File Upload** | pas de validation, XSS | 6-8 |
| **Regex DoS** | regex complexes | 8-10 |

**Total attendu : ~70 vulnérabilités détectables**

## 📁 Structure du Projet

```
angularjs-sast-vulnerabilities/
├── index.html                    # Page principale
├── app.js                        # Module et configuration AngularJS
├── controllers/                  # Contrôleurs avec vulnérabilités
│   ├── xss.controller.js         # ✅ XSS (Cross-Site Scripting)
│   ├── storage.controller.js     # ✅ Stockage non sécurisé
│   ├── injection.controller.js   # ✅ Injection de code
│   ├── redirect.controller.js    # ✅ Open redirect & crypto faible
│   ├── prototype.controller.js   # ✅ Prototype pollution
│   ├── postmessage.controller.js # ✅ PostMessage vulnérabilités
│   ├── fileupload.controller.js  # ✅ Upload de fichiers non sécurisé
│   └── regex.controller.js       # ✅ ReDoS (Regex Denial of Service)
├── templates/                    # Templates HTML
│   ├── xss.html                  # ✅
│   ├── storage.html              # ✅
│   ├── injection.html            # ✅
│   ├── redirect.html             # 🔄 À créer
│   ├── prototype.html            # 🔄 À créer
│   ├── postmessage.html          # 🔄 À créer
│   ├── fileupload.html           # 🔄 À créer
│   └── regex.html                # 🔄 À créer
├── services/                     # Services
│   └── vulnerable.service.js     # ✅ Service avec vulnérabilités
├── styles.css                    # ✅ Styles
├── package.json                  # ✅ Dépendances
└── README.md                     # ✅ Ce fichier
```

## 🚀 Installation et Démarrage

### Option 1: Avec npm et http-server

```bash
# Installer les dépendances
npm install

# Démarrer le serveur
npm start

# Ouvrir http://localhost:8080
```

### Option 2: Avec Python (si installé)

```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

### Option 3: Avec Live Server (VS Code)

- Installer l'extension "Live Server" dans VS Code
- Clic droit sur `index.html` → "Open with Live Server"

## 📋 Vulnérabilités Implémentées par Module

### 1. **XSS (Cross-Site Scripting)** ✅
- `ng-bind-html` avec `$sce.trustAsHtml()`
- SCE (Strict Contextual Escaping) désactivé globalement
- innerHTML direct
- jQuery `.html()`
- Expression injection AngularJS
- Template injection via ng-include
- document.write avec input utilisateur
- DOM XSS via paramètres URL

### 2. **Stockage Non Sécurisé** ✅
- Mots de passe en localStorage
- Tokens JWT/Bearer en localStorage
- Données bancaires (cartes de crédit, CVV)
- Secrets en dur (API keys, AWS credentials)
- Clés privées dans le code
- Base64 utilisé comme "chiffrement"
- Cookies sans flags Secure/HttpOnly/SameSite
- Console.log de données sensibles

### 3. **Injection de Code** ✅
- `eval()` direct
- `Function()` constructor
- `$eval()` AngularJS
- `setTimeout/setInterval` avec strings
- Script injection dynamique
- Attributs event handler dynamiques
- javascript: protocol
- document.write avec scripts

### 4. **Open Redirect & Crypto Faible** ✅
- window.location.href sans validation
- window.location.replace non sécurisé
- Paramètres URL (redirect, returnUrl, next)
- window.open avec input utilisateur
- Meta refresh injection
- Crypto MD5 (obsolète)
- Crypto SHA1 (compromis)
- Clés de chiffrement faibles

### 5. **Prototype Pollution** ✅
- Deep merge sans protection __proto__
- Object.assign avec données utilisateur
- Lodash merge (version 4.17.4 vulnérable)
- jQuery.extend deep
- Angular.extend non validé
- Copie récursive sans protection
- Constructor.prototype manipulation

### 6. **PostMessage Vulnérabilités** ✅
- Pas de validation event.origin
- postMessage avec origine '*'
- eval() de données de messages
- innerHTML avec contenu de messages
- Redirection automatique sur commande
- Broadcast de données sensibles
- Réponse automatique avec données locales
- JSON.parse sans validation

### 7. **File Upload Non Sécurisé** ✅
- Stockage de fichiers dans localStorage/sessionStorage
- XSS via nom de fichier
- Rendu direct de HTML uploadé
- iframe srcdoc avec contenu utilisateur
- Blob URLs non révoquées (fuites mémoire)
- FileReader bloquant sur gros fichiers
- Upload SVG avec scripts
- Exécution de JavaScript uploadé
- Web Workers depuis contenu utilisateur

### 8. **ReDoS (Regex Denial of Service)** ✅
- Email validation avec backtracking
- URL validation complexe
- Quantificateurs imbriqués (a+)+
- Validation mot de passe avec lookahead
- Regex contrôlées par l'utilisateur
- Parsing HTML avec regex
- Patterns avec alternances multiples
- Groupes capturants répétés

## 🔍 Détection Attendue par les Outils SAST

| Outil | Catégories Bien Détectées | Points Forts AngularJS |
|-------|---------------------------|------------------------|
| **SonarQube** | XSS, eval, secrets, ReDoS | ng-bind-html, $sce |
| **Checkmarx** | Toutes catégories | Spécifique Angular |
| **Fortify** | Injections, storage, redirect | $eval, trustAsHtml |
| **Semgrep** | Patterns personnalisés | Templates Angular |
| **ESLint Security** | eval, Function, regex | - |
| **Snyk** | Dépendances vulnérables | Lodash 4.17.4 |

## ⚡ Tests Rapides des Vulnérabilités

### Test XSS
```javascript
// Dans /#!/xss
{{constructor.constructor('alert("XSS")')()}}
<img src=x onerror=alert(1)>
```

### Test Injection
```javascript
// Dans /#!/injection
alert('Code injecté!')
console.log(document.cookie)
```

### Test Prototype Pollution
```json
// Dans /#!/prototype
{
  "__proto__": {
    "isAdmin": true
  }
}
```

### Test ReDoS
```
// Dans /#!/regex
Email: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@
```

## 🛡️ Corrections Recommandées

### XSS
- Utiliser `ng-bind` au lieu de `ng-bind-html`
- Ne jamais désactiver SCE
- Valider/échapper toutes les entrées

### Stockage
- Utiliser httpOnly cookies pour les tokens
- Chiffrer les données sensibles
- Ne jamais stocker de mots de passe

### Injection
- Bannir eval() et Function()
- Utiliser des fonctions au lieu de strings dans setTimeout
- Valider toutes les entrées utilisateur

### Redirect
- Whitelist des domaines autorisés
- Validation des URLs avant redirection
- Utiliser des algorithmes de hash modernes (SHA-256+)

### Prototype Pollution
- Utiliser Object.create(null)
- Valider les clés avant merge
- Mettre à jour lodash (>= 4.17.21)

### PostMessage
- Toujours vérifier event.origin
- Ne jamais utiliser '*' comme targetOrigin
- Valider le contenu des messages

### File Upload
- Éviter le stockage de fichiers dans localStorage
- Nettoyer les noms de fichiers avant affichage
- Ne jamais exécuter du JavaScript uploadé
- Révoquer les Blob URLs après usage
- Utiliser des Web Workers uniquement avec du code validé
- Traiter les gros fichiers de manière asynchrone
- Sanitizer le contenu SVG

### ReDoS
- Utiliser des regex simples
- Éviter les quantificateurs imbriqués
- Timeout sur les opérations regex

## 📚 Ressources

- [OWASP Top 10 Client-Side](https://owasp.org/www-project-top-10-client-side-security-risks/)
- [AngularJS Security Guide](https://docs.angularjs.org/guide/security)
- [OWASP AngularJS Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/AngularJS_Security_Cheat_Sheet.html)
- [PortSwigger AngularJS Sandbox Bypasses](https://portswigger.net/research/xss-without-html-client-side-template-injection-with-angularjs)
- [Snyk Vulnerability Database](https://security.snyk.io/)

## ⚠️ Note Importante

Cette application est conçue pour être **vulnérable**. Elle sert uniquement à :
- Tester les outils SAST/SCA
- Former les développeurs à la sécurité frontend
- Comprendre les vulnérabilités spécifiques à AngularJS et au JavaScript côté client

**Ne JAMAIS utiliser ce code en production !**