# Portfolio — Pierre

Site statique (HTML + CSS + un peu de JavaScript), sans outil à installer.
Destiné à être publié gratuitement sur **GitHub Pages** : `https://pierrehlr.github.io`

## Organisation des fichiers

```
index.html                 Page d'accueil : présentation, projets, compétences, parcours, contact
projets/
  ecepilot.html            Pages des projets
  neural-speech.html
  double-pendule.html
  _modele-projet.html      Modèle de page projet, à copier pour chaque nouveau projet
                           (le « _ » au début du nom empêche GitHub Pages de le publier)
en/                        Version anglaise (mêmes images, styles et scripts que la version française)
  index.html
  projects/ecepilot.html, neural-speech.html, double-pendulum.html
css/style.css              Mise en page et couleurs (thème clair et sombre)
js/main.js                 Thème, LED de l'accueil, personnage pixel art, prénom en ASCII
assets/
  cv/CV.pdf                Ton CV (avec exactement ce nom)
  img/projets/             Les images, un sous-dossier par projet
  img/placeholder.svg      Image provisoire « à remplacer » (utilisée par le modèle)
  img/favicon.svg          Icône de l'onglet
```

## Voir le site sur ton ordinateur

Double-clique sur `index.html` : il s'ouvre dans ton navigateur.
Après une modification, enregistre le fichier puis rafraîchis la page (F5).

## Ce qu'il reste à remplir

Dans VS Code, cherche dans tous les fichiers (Ctrl+Maj+F) :

- **`[`** : les crochets marquent les infos personnelles (nom, école, dates…)
- **`À MODIFIER`** : les commentaires aux endroits clés

À faire aussi :

- déposer ton CV dans `assets/cv/CV.pdf`
- garder dans Compétences uniquement ce que tu sais vraiment faire

## Version anglaise

Chaque page française a sa traduction dans `en/`. Le bouton FR / EN du menu passe de l'une à l'autre.
**Quand tu modifies un texte en français, pense à modifier aussi la page anglaise correspondante.**
Pour un nouveau projet, crée aussi sa page dans `en/projects/`, en mettant `../../` devant les chemins
(`../../css/style.css`, `../../assets/…`), et ajoute sa carte dans `en/index.html`.

## Ajouter un projet

1. Copie `projets/_modele-projet.html` et renomme la copie (sans le « _ » au début), par exemple `projets/station-meteo.html`
   (minuscules, pas d'espaces ni d'accents).
2. Crée le dossier `assets/img/projets/station-meteo/` et mets-y tes photos.
3. Dans la nouvelle page, remplace les textes et les chemins d'images, par exemple :
   `<img src="../assets/img/projets/station-meteo/carte.jpg" alt="Carte assemblée">`
4. Dans `index.html`, copie un bloc `<a class="card" …> … </a>` de la section Projets
   et fais pointer son `href` vers ta nouvelle page.

**Images** : utilise du JPG ou du WebP, d'environ 1600 px de large au maximum et si possible
moins de 300 Ko chacune (tu peux les compresser sur squoosh.app). Le site reste ainsi rapide.

## Mettre le site à jour

Le site est publié par GitHub Pages depuis le dépôt `PierreHlr/PierreHlr.github.io`
(branche `main`), à l'adresse `https://pierrehlr.github.io`.

Après une modification, dans ce dossier :

```
git add .
git commit -m "Description de la modification"
git push
```

Le site est mis à jour une à deux minutes plus tard.

## Conseils

- **3 à 6 projets** suffisent. Mets ton meilleur projet en premier.
- Pour chaque projet, montre **des photos de la carte, le schéma, et des mesures**
  (objectif comparé au résultat). C'est ce qui fait la différence en électronique.
- Fais relire le site par deux ou trois personnes avant de l'envoyer à des entreprises.
- Mets le lien du site sur ton CV et sur ton profil LinkedIn.
