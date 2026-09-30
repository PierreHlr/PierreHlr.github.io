// Petit script du site : bouton de thème, année du pied de page,
// LED de la page d'accueil qui s'allume à l'approche de la souris,
// petit personnage en pixel art et prénom en art ASCII animé.

(function () {
  var racine = document.documentElement;

  // Bouton clair / sombre : le choix est mémorisé dans le navigateur
  var bouton = document.querySelector(".theme-toggle");
  if (bouton) {
    bouton.addEventListener("click", function () {
      var estSombre = racine.dataset.theme
        ? racine.dataset.theme === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches;
      var nouveau = estSombre ? "light" : "dark";
      racine.dataset.theme = nouveau;
      try { localStorage.setItem("theme", nouveau); } catch (e) {}
    });
  }

  // Année courante dans le pied de page
  document.querySelectorAll("[data-annee]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();

// LED D1 : plus la souris (ou le doigt) est proche, plus elle brille
(function () {
  var led = document.querySelector("[data-led]");
  if (!led) return;

  var lentille = led.querySelector(".d1-eteinte");
  var affichagePwm = document.querySelector("[data-pwm]");

  var PORTEE = 260;   // en pixels : plus c'est grand, plus la LED s'allume de loin
  var MINIMUM = 0.06; // luminosité quand la souris est loin ou hors de la page
  var LISSAGE = 0.15; // entre 0 et 1 : plus c'est petit, plus la LED réagit en douceur

  var pointeur = null;  // dernière position connue de la souris, ou null
  var actuelle = MINIMUM;
  var enCours = false;

  function luminositeVisee() {
    if (!pointeur) return MINIMUM;
    var r = lentille.getBoundingClientRect();
    var dx = pointeur.x - (r.left + r.width / 2);
    var dy = pointeur.y - (r.top + r.height / 2);
    var distance = Math.sqrt(dx * dx + dy * dy);
    // Décroissance exponentielle : 100 % sur la LED, environ 37 % à PORTEE pixels
    return MINIMUM + (1 - MINIMUM) * Math.exp(-distance / PORTEE);
  }

  function afficher(valeur) {
    led.style.setProperty("--lum", valeur.toFixed(3));
    if (affichagePwm) affichagePwm.textContent = Math.round(valeur * 100) + "%";
  }

  // Rapproche doucement la luminosité de sa cible, image par image
  function boucle() {
    var cible = luminositeVisee();
    actuelle += (cible - actuelle) * LISSAGE;
    if (Math.abs(cible - actuelle) < 0.002) actuelle = cible;
    afficher(actuelle);
    if (actuelle !== cible) {
      requestAnimationFrame(boucle);
    } else {
      enCours = false;
    }
  }

  function relancer() {
    if (!enCours) {
      enCours = true;
      requestAnimationFrame(boucle);
    }
  }

  function suivre(e) {
    pointeur = { x: e.clientX, y: e.clientY };
    relancer();
  }

  function relacher() {
    pointeur = null;
    relancer();
  }

  window.addEventListener("pointermove", suivre, { passive: true });
  window.addEventListener("pointerdown", suivre, { passive: true });
  // Sur écran tactile, la LED s'éteint quand on lève le doigt
  window.addEventListener("pointerup", function (e) {
    if (e.pointerType !== "mouse") relacher();
  });
  window.addEventListener("pointercancel", relacher);
  // La souris quitte la fenêtre
  document.addEventListener("mouseout", function (e) {
    if (!e.relatedTarget) relacher();
  });
  // La LED bouge quand on fait défiler la page : on recalcule
  window.addEventListener("scroll", relancer, { passive: true });

  afficher(actuelle);
})();

// ---------------------------------------------------------------
// Petit personnage en pixel art (moi !), réutilisé dans le site.
// Utilisation dans le HTML : <span class="pixel" data-pose="salut"></span>
// Poses : repos, salut, multimetre, loupe, diplome, judo, lettre.
// Les couleurs sont dans css/style.css (variables --px-…).
// ---------------------------------------------------------------
(function () {
  // Grille de 20 × 24 pixels. Chaque lettre est une couleur :
  // o contour · k détails sombres · h cheveux · i reflet des cheveux · s peau
  // e yeux · g verres des lunettes · n bouche · t sweat · u manches · y logo
  // p pantalon · b chaussures · w blanc · z ombre du judogi · r rouge · m métal
  var BASE = [
    ".......oooooo.......",
    ".....oohhhhhhoo.....",
    "....ohhhiihhhhho....",
    "...ohhhiihhhhhhho...",
    "...ohhhhhhhhhhhho...",
    "...ohhsshssssshho...",
    "...ohskksssskksho...",
    "...ohkggkkkkggkho...",
    "...oskgeksskegkso...",
    "...osskksssskksso...",
    "....osssssssssso....",
    ".....osssnnssso.....",
    ".....oooossoooo.....",
    ".....otttttttto.....",
    "....outtttttttuo....",
    "....outtttttttuo....",
    "....outttyytttuo....",
    "....outtttttttuo....",
    "....osttttttttso....",
    "....oooooooooooo....",
    "......oppppppo......",
    "......oppooppo......",
    ".....obbboobbbo.....",
    ".....oooo..oooo.....",
  ];

  // Chaque pose modifie la grille de base :
  // "patches" = [ligne, colonne, texte à écrire], "recolor" = couleurs à remplacer
  var POSES = {
    repos: {},
    salut: {
      patches: [
        [7, 17, "oo"], [8, 17, "sso"], [9, 17, "sso"],
        [10, 16, "ouo"], [11, 16, "ouo"], [12, 15, "ouo"], [13, 14, "uuo"],
        [14, 14, "o."], [15, 14, "o."], [16, 14, "o."], [17, 14, "o."], [18, 14, "o."],
        [19, 15, "."]
      ]
    },
    multimetre: { // multimètre avec son cordon de mesure rouge
      patches: [
        [13, 15, "ooooo"], [14, 15, "ogggo"], [15, 15, "ogkgo"], [16, 15, "oyyyo"],
        [17, 15, "oykyo"], [18, 15, "oyyyo"], [19, 15, "ooooo"],
        [20, 18, "r"], [21, 18, "r"], [22, 19, "r"]
      ]
    },
    loupe: {
      patches: [
        [13, 17, "oo"], [14, 16, "oggo"], [15, 16, "ogwo"], [16, 17, "oo"],
        [17, 16, "o"], [18, 15, "o"]
      ]
    },
    diplome: { // toque de diplômé
      patches: [
        [0, 4, "okkkkkkkkkko"], [1, 1, "okkkkkkkkkkkkkkkko"], [2, 5, "kkkkkkkkkk"],
        [2, 18, "y"], [3, 18, "y"], [4, 18, "y"]
      ]
    },
    judo: { // judogi blanc, ceinture noire, pieds nus
      recolor: { from: 13, to: 22, map: { t: "w", u: "z", y: "w", p: "w", b: "s" } },
      patches: [[13, 9, "ss"], [14, 9, "zz"], [17, 6, "kkkkkkkk"], [18, 9, "kk"]]
    },
    lettre: {
      patches: [[15, 15, "ooooo"], [16, 15, "owrwo"], [17, 15, "owwwo"], [18, 15, "ooooo"]]
    }
  };

  function grille(nom) {
    var pose = POSES[nom] || POSES.repos;
    var lignes = BASE.slice();
    if (pose.recolor) {
      for (var y = pose.recolor.from; y <= pose.recolor.to; y++) {
        lignes[y] = lignes[y].replace(/./g, function (c) { return pose.recolor.map[c] || c; });
      }
    }
    (pose.patches || []).forEach(function (p) {
      var l = lignes[p[0]];
      lignes[p[0]] = l.slice(0, p[1]) + p[2] + l.slice(p[1] + p[2].length);
    });
    return lignes;
  }

  function dessiner(el) {
    var lignes = grille(el.dataset.pose);
    var L = lignes[0].length, H = lignes.length;
    var svg = '<svg viewBox="0 0 ' + L + " " + H + '" shape-rendering="crispEdges" aria-hidden="true" focusable="false">';
    lignes.forEach(function (ligne, y) {
      var x = 0;
      while (x < L) {
        // Regroupe les pixels identiques d'une même ligne en un seul rectangle
        var c = ligne[x], n = 1;
        while (x + n < L && ligne[x + n] === c) n++;
        // (léger chevauchement pour éviter de fines lignes entre les pixels)
        var rect = '" x="' + x + '" y="' + y + '" width="' + (n + 0.04) + '" height="1.04"/>';
        if (c === "e") svg += '<rect class="px-s' + rect; // peau sous les yeux (pour le clignement)
        if (c !== ".") svg += '<rect class="px-' + c + rect;
        x += n;
      }
    });
    el.innerHTML = svg + "</svg>";
  }

  document.querySelectorAll(".pixel[data-pose]").forEach(dessiner);
})();

// ---------------------------------------------------------------
// Prénom en art ASCII animé (page d'accueil).
// Le texte de data-ascii est dessiné dans un canvas invisible, puis
// découpé en grille : chaque case qui tombe dans une lettre reçoit
// un caractère ASCII dont la densité suit une onde qui se déplace.
// ---------------------------------------------------------------
(function () {
  var bloc = document.querySelector("[data-ascii]");
  if (!bloc) return;

  var LIGNES = 16;                  // hauteur de la grille, en caractères (10 sur téléphone)
  var RAMPE = " .:-=+*#%@";         // du plus léger au plus dense
  var BROUILLE = "!?/<>{}$&~^";     // caractères du « front » d'apparition
  var NB_COULEURS = 4;              // classes .ascii-c0 à .ascii-c3 (style.css)
  var IMAGES_PAR_SECONDE = 20;
  var DUREE_APPARITION = 1.2;       // secondes
  var reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var colonnes = 0;
  var masque = [];                  // couverture de chaque case par les lettres (0 à 1)
  var pre = document.createElement("pre");
  pre.setAttribute("aria-hidden", "true");

  // Dessine le texte dans un canvas et mesure, case par case, la part couverte par les lettres
  function construireMasque() {
    var LC = 6, HC = 10;            // une case = un caractère (largeur 0,6 × hauteur 1)
    var hauteur = LIGNES * HC;
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var texte = bloc.dataset.ascii;
    var police = "800 " + Math.round(hauteur * 1.3) + "px 'JetBrains Mono', 'Arial Black', monospace";
    ctx.font = police;
    var espace = hauteur * 0.02;
    var largeurs = texte.split("").map(function (l) { return ctx.measureText(l).width; });
    var total = largeurs.reduce(function (a, b) { return a + b; }, 0) + espace * (texte.length - 1);

    colonnes = Math.ceil(total / LC) + 1;
    canvas.width = colonnes * LC;
    canvas.height = hauteur;
    ctx.font = police;              // (redimensionner le canvas efface la police)
    ctx.fillStyle = "#000";
    var x = LC / 2;
    var ligneDeBase = hauteur * 0.97;
    texte.split("").forEach(function (lettre, i) {
      ctx.fillText(lettre, x, ligneDeBase);
      x += largeurs[i] + espace;
    });

    var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    masque = [];
    for (var ly = 0; ly < LIGNES; ly++) {
      for (var cx = 0; cx < colonnes; cx++) {
        // 3 × 3 points de mesure dans chaque case
        var somme = 0;
        for (var sy = 0; sy < 3; sy++) {
          for (var sx = 0; sx < 3; sx++) {
            var px = Math.floor(cx * LC + (sx + 0.5) * LC / 3);
            var py = Math.floor(ly * HC + (sy + 0.5) * HC / 3);
            somme += pixels[(py * canvas.width + px) * 4 + 3] / 255;
          }
        }
        masque.push(somme / 9);
      }
    }
  }

  // Ajuste la taille des caractères pour que la grille remplisse la largeur disponible
  function ajusterTaille() {
    var largeur = bloc.clientWidth;
    if (largeur > 0 && colonnes > 0) pre.style.fontSize = (largeur / (colonnes * 0.6)) + "px";
  }

  var vitesse = 1;
  bloc.addEventListener("mouseenter", function () { vitesse = 2.5; });
  bloc.addEventListener("mouseleave", function () { vitesse = 1; });

  function dessiner(temps) {
    var apparition = reduit ? 1 : Math.min(1, temps / DUREE_APPARITION);
    var front = apparition * colonnes;
    var html = "";
    for (var y = 0; y < LIGNES; y++) {
      var classe = null, morceau = "";
      for (var x = 0; x < colonnes; x++) {
        var couverture = masque[y * colonnes + x];
        var car = " ", nouvelle = null;
        if (couverture > 0.3 && x <= front) {
          if (apparition < 1 && front - x < 3) {
            // Front d'apparition : caractères brouillés
            car = BROUILLE[Math.floor(Math.random() * BROUILLE.length)];
            nouvelle = "ascii-glitch";
          } else {
            // Onde : somme de trois sinus qui se déplacent dans des directions différentes
            var onde = Math.sin(x * 0.16 - temps * 2.2)
                     + Math.sin(y * 0.5 + temps * 1.4)
                     + Math.sin((x + y * 2) * 0.08 + temps * 0.9);
            var n = (onde + 3) / 6;                          // entre 0 et 1
            var densite = (0.55 + 0.45 * n) * Math.min(1, couverture * 1.4);
            car = RAMPE[Math.max(1, Math.round(densite * (RAMPE.length - 1)))];
            nouvelle = "ascii-c" + Math.min(NB_COULEURS - 1, Math.floor(n * NB_COULEURS));
          }
        }
        if (nouvelle !== classe) {
          if (morceau) html += classe ? '<span class="' + classe + '">' + morceau + "</span>" : morceau;
          classe = nouvelle; morceau = "";
        }
        morceau += car;
      }
      if (morceau) html += classe ? '<span class="' + classe + '">' + morceau + "</span>" : morceau;
      html += "\n";
    }
    pre.innerHTML = html;
  }

  function demarrer() {
    if (bloc.clientWidth < 480) LIGNES = 10;  // caractères plus gros sur téléphone
    construireMasque();
    bloc.innerHTML = "";
    bloc.appendChild(pre);
    ajusterTaille();
    dessiner(0);                              // réserve la hauteur dès le départ
    if (window.ResizeObserver) new ResizeObserver(ajusterTaille).observe(bloc);
    else window.addEventListener("resize", ajusterTaille);

    if (reduit) { dessiner(0); return; }

    // Animation, mise en pause quand le prénom n'est pas visible à l'écran
    var visible = true, horloge = 0, precedent = null, dernierDessin = 0;
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (entrees) {
        visible = entrees[0].isIntersecting;
      }).observe(bloc);
    }
    function boucle(t) {
      if (precedent === null) precedent = t;
      var dt = (t - precedent) / 1000;
      precedent = t;
      if (visible) {
        horloge += dt * (horloge < DUREE_APPARITION ? 1 : vitesse);
        if (t - dernierDessin >= 1000 / IMAGES_PAR_SECONDE) {
          dessiner(horloge);
          dernierDessin = t;
        }
      }
      requestAnimationFrame(boucle);
    }
    requestAnimationFrame(boucle);
  }

  // Attend la police JetBrains Mono pour dessiner les lettres avec la bonne forme
  if (document.fonts && document.fonts.load) {
    document.fonts.load("800 100px 'JetBrains Mono'").then(demarrer, demarrer);
  } else {
    demarrer();
  }
})();
