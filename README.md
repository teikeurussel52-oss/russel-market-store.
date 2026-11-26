# Russel Market Store

Site vitrine e-commerce responsive avec panier, suivi de commandes de démonstration et tableau de suivi des projets.

## Tester le site
Ouvrez `index.html` dans un navigateur. Une connexion Internet est nécessaire pour charger les polices Google ; le site reste utilisable sans elles.

## Publier gratuitement avec GitHub Pages
1. Créez un compte sur https://github.com/.
2. Créez un nouveau dépôt public, par exemple `russel-market-store`.
3. Importez les fichiers `index.html`, `styles.css`, `app.js` et `README.md` à la racine du dépôt.
4. Dans le dépôt, ouvrez **Settings → Pages**.
5. Dans **Build and deployment**, choisissez **Deploy from a branch**.
6. Sélectionnez la branche `main` et le dossier `/ (root)`, puis cliquez sur **Save**.
7. Attendez la publication. L'adresse sera du type `https://VOTRE-PSEUDO.github.io/russel-market-store/`.

## Personnaliser les produits
Modifiez la liste `products` au début de `app.js` : nom, catégorie, prix, emoji et description. Les visuels actuels sont des illustrations emoji temporaires.

## Limites importantes
- Le panier, les commandes et les projets sont stockés dans `localStorage` du navigateur. Les données ne sont donc pas partagées entre visiteurs ou appareils.
- Le passage de commande est une démonstration : aucun paiement n'est collecté et aucune livraison réelle n'est organisée.
- Pour vendre réellement : connecter un backend sécurisé, une base de données, un service de paiement (par exemple Stripe ou PayPal) et un système de gestion des commandes. Ne placez jamais de clés secrètes dans le code JavaScript public.
- GitHub Pages héberge des sites statiques ; il ne fournit pas de serveur backend.
- Remplacez l'adresse e-mail d'exemple dans `index.html` par votre adresse professionnelle avant publication.
- 
