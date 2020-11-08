Dans cet article, nous allons comparer plusieurs méthodes permettant de faire des animations en JavaScript.

# L'approche intuitive
Une animation, ce n'est qu'une succession d'images dans le temps. De fait, pour créer une animation, il suffit d'effectuer un rendu à intervalle régulier. Facile, non ? 😄

Si toutefois un exemple était nécessaire, animons sans attendre la scène suivante : un cercle blanc se déplaçant horizontalement dans un canvas.

```javascript
const canvas = document.querySelector('canvas');
const _2PI = 2 * Math.PI;
 
 
function setupCanvas(canvasElement) {
    canvasElement.width = window.innerWidth;
    canvasElement.style.width = window.innerWidth + 'px';
 
    canvasElement.height = window.innerHeight;
    canvasElement.style.height = window.innerHeight + 'px';
 
    const ctx = canvasElement.getContext('2d');
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
 
    ctx.fillStyle = 'rgb(255,255,255)';
 
    return ctx;
}
 
const context = setupCanvas(canvas);
 
 
var x = 50;
var y = 50;
 
var duration = 4000;
// Rendering loop interval
setInterval(function() {
    // logic of our animation
    window.clear();
    var now = Date.now();
 
    x = ((now % duration) / duration * canvas.width);
 
    // draw circle
    context.beginPath();
    context.arc(x, y, 30, 0, _2PI);
    context.closePath();
    context.fill();
    context.stroke();
}, 16);
```

**Résultat :**

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/xt0kyiu03lewvksmw5h8.gif)


Notez qu'une telle animation aurait très bien pu être réalisée en HTML/CSS, et qu'une implémentation reposant sur un canvas peut s'apparenter - selon certains - à atomiser une mouche avec un bazooka 💣

Toutefois, puisque nous allons complexifier nos animations dans la suite de l'article, autant partir sur de bonnes bases !


# La boucle de rendu

Avant de gérer des animations plus complexes, il semble opportun d'introduire un concept clé : la **boucle de rendu** ou rendering loop.

Il s'agit d'un mécanisme utilisée pour *rendre* notre animation, similaire à la *boucle de jeu* dans le contexte des jeux-vidéo.

Pour gagner en lisibilité, nous allons isoler la logique propre au rendu de l'animation dans une méthode nommée `render`.

```javascript 
function render() {
 // logic of our animation
    window.clear();
    var now = Date.now();
 
    x = ((now % duration) / duration * canvas.width);
 
    // draw circle
    context.beginPath();
    context.arc(x, y, 30, 0, _2PI);
    context.closePath();
    context.fill();
    context.stroke();
}

// rendering loop
setInterval(render, 16);
```

Cette modification paraît anodine, pourtant nous venons de faire un pas de géant ! 🚀

Nous disposons désormais d'une **méthode de rendu** `render` invoquée en boucle, ou pour être plus formel, d'une boucle de rendu.

## Boucle de rendu, méthode de rendu, quelle différence ?

Les deux entités sont très liées, mais se différencient par la nature de leur préoccupation :

* La **méthode de rendu** contient la logique propre au rendu de nos objets. Elle répond à la question : "Comment gérer l'apparence mes objets ?".

* La **boucle de rendu** contient la logique propre au séquençage des rendus. Elle répond à la question : "Comment planifier l'affichage de mes objets ?"

Nous le verrons, chacun de ses deux aspects nous expose à des problématiques différentes 👍.

# Gérer le cycle de rendu

Une façon de mesurer les performances d'une animation consiste à analyser son **frame rate**. Le frame rate se mesure en *FPS* (Frame Per Seconds) et représente nombre d'images que notre animation affiche par seconde.

Pour considérer qu'une animation est fluide, nous considérerons que :
* **Le frame rate doit idéalement se situer autour des 60 FPS** (soit une image toutes les 16 ms).
* **Le frame rate doit être stable** pour que l'impression de mouvement soit cohérente. Une variation soudaine peut entraîner une sensation de ralentissement ou de saccade. Passer subitement de 60 fps à  30 fps provoquera un ressentit généralement plus désagréable qu'une animation constante à 30 fps, bien que son score moyen de fps soit presque 2x plus grand !

En réalité, le problème est beaucoup plus complexe ! J'ai volontairement simplifié pour les besoins de l'article, mais si vous souhaitez en savoir plus sur l'impression de mouvement et le traitement des images, je ne peux que vous recommander cet excellent article 🤓 : [the-illusion-of-motion](https://paulbakaus.com/tutorials/performance/the-illusion-of-motion/)

Voici les modifications à apporter à notre code pour calculer le frame rate :

```javascript
let nbRender = 0;

// every seconds prompt frame-rate, then reset counter
setInterval(function() {
    console.log('fps:' + nbRender);
    nbRender = 0;
}, 1000);
 
// Rendering loop interval
setInterval(function() {
  nbRender++;
  render();
}, 16);
```

Notez combien la modification est simple. Grâce au découplage du code via la méthode de rendu, la logique propre au rendu de nos objets n'a pas été impactée 🧐.

En rejouant notre script, on constate que l'animation tourne autour de 60FPS. Si l’on diminue le délai de notre intervalle (de 16ms à 10 ms par exemple), la boucle de rendu sera plus souvent évaluée, et l'on obtiendra un frame rate plus élevée…

Enfin, en théorie !



# Limitation des méthodes de rendues reposant sur un intervalle

Attention : tous les navigateurs ne se valent pas. La façon dont ils gèrent les intervalles peut varier. Google Chrome notamment tire son épingle du jeu et minimise l'impact des limitations listées ci-après.


## Intervalles non réguliers et drift


Rien ne garantit que le délai renseigné un `setInterval` sera scrupuleusement respecté. Ce temps ne correspond pas à "dans combien de temps le callback sera exécuté", mais à la durée minimale avant que celui-ci soit invoqué.

Surpris ? Pourtant, rien de plus logique ! Les navigateurs exécutant le code JS en mono-thread, si le moteur JS est déjà occupé au moment traiter le code contenu dans notre intervalle, il nous faudra attendre qu'il termine sa tâche actuelle avant de s'intéresser à notre intervalle.

À chaque itération, notre intervalle peut accumuler du retard. Si bien qu'un intervalle initialisé au temps 0ms avec 100ms de délais entre chaque itération, pourrait avoir lieu au temps 100...548 ms !

C'est ce déphasage que l'on désigne par "drift".

Dans le cadre d'une animation, selon la charge de l'application web, on peut "perdre des frames" en cours de route. Cela peut être gênant si notre boucle de rendu implémente une partie de la logique métier de l'application.

Cet article détaille comment les timers JavaScript fonctionnent, et pourquoi ils ne sont pas fiables : [how-javascript-timers-work](https://johnresig.com/blog/how-javascript-timers-work).

## Des problèmes de performances historiques

Il y a encore quelques années il existait une différence palpable entre les performances d'une animation reposant sur `setInterval` ou sur les `requestAnimationFrame`.

Je ne prends même pas la peine de vous proposer de lien vers un article. Il y en a des centaines. La plupart sont très bien détaillés.

⚠️ De nos jours cet écart a tendance à s'estomper. À l'heure où j'écris cet article, je n'ai pas réussi à mesurer de différence significative entre les deux méthodes.


# La méthode window.requestAnimationFrame

Afin de contourner tous ces problèmes, les navigateurs implémentent une méthode nommée `requestAnimationFrame` (parfois abrégée rAF).

Plutôt que de planifier des rendus à intervalle régulier, nous déléguons cette responsabilité au navigateur. D'un coup d'un seul, nous nous débarrassons des problèmes liés à la **logique propre au séquençage des rendus**.

Parmi les services rendus par les requestAnimationFrame, on peut noter :

* Elles adaptent le frame rate en fonction de l'écran de l'utilisateur. Après tout, pourquoi s'acharner à calculer 60 images par seconde si notre installation n'est capable d'en afficher que 50 ?

* La boucle de rendu s'arrête dès que la page n'est plus visible (changement d'onglet, passage en arrière-plan, etc). Cela évite une consommation inutile de ressources et préserve la batterie des appareils mobiles.

* Elles ne reposent pas sur un système de timer, nous ne rencontrons donc pas de problème de drift.

* Les images sont calculées les unes à la suite des autres, on évite de tomber dans un goulot d'étranglement.


Sans plus attendre, voyons comment modifier notre boucle de rendu pour utiliser les requestAnimationFrame :


```javascript
function renderingLoop () {
  nbRender++;
  render();
 
  // ask a new rendering
  window.requestAnimationFrame(renderingLoop);
});
 
window.requestAnimationFrame(renderingLoop);
```

C'est tout ? Oui 😌.

Notez (une fois de plus !) que les modifications auraient étés bien plus complexes si nous n'avions pas pris la peine de séparer la **boucle de rendu** et **la méthode de rendu** en deux entités distinctes.


# Interagir avec une animation


Une bonne animation, ça peut être chouette. Mais, une animation avec laquelle on peut interagir, c'est carrément mieux !

## Mettre en pause / reprendre une animation

Il suffit d'introduire un boolean `isPlaying` indiquant si un rendu doit être effectué ou non. Ce n'est pas bien sorcier, toutefois une subtilité requiert votre attention. Je vois bien souvent des implémentations comme :

```javascript
var animation = function() {
    window.requestAnimationFrame(animation);
    if (animation.isPlaying !== false) {
         render();
    }
}
```

ou si on utilise des intervalles :

```javascript
setInterval(function() {
    if (isPlaying === true) {
        render();
    }
}, 16);
```

Soyez vigilant : suspendre le rendu ne signifie pas interrompre la boucle de rendu. Votre application cessera certes de calculer de nouvelles frames, mais votre boucle de rendu continuera à tourner dans le vide.

Ce n'est pas très élégant, et cela peut parfois vous jouer des tours.

Voici comment interrompre proprement la boucle de rendu : 

```javascript
var animation = function() {
    if (animation.isPlaying !== false) {
        window.requestAnimationFrame(animation);
        render();
    }
};
 
animation.pause = function() {
    animation.isPlaying = false;
};
 
animation.play = function() {
    animation.isPlaying = true;
    window.requestAnimationFrame(animation);
}


 
var animationIntervalId = null;
 
function play() {
    if (animationIntervalId === null) {
        animationIntervalId = setInterval(function() {
           render();
    }, 16);
    }
}
 
function pause() {
    if (animationIntervalId !== null) {
        clearInterval(animationIntervalId);
        animationIntervalId = null;
    }
}
```

## Interagir avec la souris (ou le clavier)

Soit l'animation suivante :
*(Adaptée pour les besoins depuis [le benchmark de @nukadelic](https://codepen.io/nukadelic/pen/QgQJeK))*


On ne va pas rentrer dans le détail de son implémentation. Pour les curieux, jetez un coup d'œil sur le [repository git](https://github.com/qphilippot/tuto/tree/master/make-your-own-animation-js).

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/5uxfavmdfxy47d24vm4d.gif)

Nous souhaitons modifier son comportement afin de faire apparaître un cercle rouge à l'emplacement de la souris. Si le curseur bouge, le cercle se déplacera en conséquence.

```javascript
// Attention : à ne surtout pas faire !
document.addEventListener('mousemove', function(event) {
    render(context);

    // compute coordinate into canvas
    var bb = event.target.getBoundingClientRect();
    var x = event.clientX - bb.left;
    var y = event.clientY - bb.top;
 
    context.fillStyle = "rgba(255,0,0,0.5)"
    context.beginPath();
    context.arc(x,y, 10 ,0,6.283185,0,true);
    context.fill();
});
```

Horreur, nos FPS baissent drastiquement ! Très vite, la page a crashée. Je n'ai même pas pu prendre un gif pour illustrer la situation 😢.


## Analyse du problème

### Une indigestion d'événements 

Chaque déplacement du curseur lance un événement `mousemove`, et appelle `render()`. 

L'ennui c'est qu'en déplaçant physiquement votre souris, ce n'est pas un, mais plusieurs centaines d'événements qui sont lancés en quelques secondes, et autant de demandes de rendus ! 🤯
 
Une machine idéale - disposant d'une capacité de calcul et des ressources mémoire infinies - résisterait à une telle charge de travail. L'animation serait alors d'une fluidité exemplaire. Le frame-rate atteindrait un pic équivalent à plusieurs centaines de FPS.

En pratique, aucun navigateur n'est capable de suivre la cadence.

Le problème dépasse le simple cadre des animations : plus le callback associé à un événement fréquent est complexe, plus l'expérience utilisateur est dégradée. 


### L'Event Loop.

> **La gestion des événements JavaScript est en mono-thread.**

Quand un utilisateur déplace son curseur, les `mousemove` sont mis dans une file d'attente et traité un par un. Dans le cas d'une animation, plusieurs centaines de rendus sont mis en attente.

Si vous souhaitez en apprendre davantage sur l'Event Loop, je recommande cet article : [https://felixgerschau.com/javascript-event-loop-call-stack](https://felixgerschau.com/javascript-event-loop-call-stack)

*« Et alors ? Si JavaScript est mono-thread, et qu'il effectue mes rendus un par un, tout devrait fonctionner correctement. Je ne vois pas où est le problème ! »*

Supposons que chaque frame requiert 20 ms pour être affichée. Puisque le rendu est séquentiel, si déplacer le curseur jette 1000 événements `mousemove`, le script commandera le calcul de 1000 frames.

Le programme consacra donc 20 secondes pour retranscrire un mouvement de souris ayant pourtant duré moins d'une seconde ! ☠️

Le fait que l'exécution du JS soit en mono-thread ne signifie pas qu'il évolue dans un thread dédié. Loin de là !

Le processus responsable de notre JS s'occupe aussi de la réactivité de la page. Noyer le processus (main-thread) aboutira à une expérience utilisateur dégradée (le plantage pur et simple de votre page n'est pas exclu).
[https://developer.mozilla.org/en-US/docs/Glossary/Main_thread](https://developer.mozilla.org/en-US/docs/Glossary/Main_thread)

De façon générale, dès que le temps de rendu est supérieur à la durée de vie de votre frame, votre animation en pâtit. Au mieux elle  saccade (le moteur de rendu "sacrifie" des demandes de rendu). 

Dans le pire des cas l'animation est désynchronisée, car toutes les demandes de rendu sont exécutées. Les interactions de l'utilisateur sont rendues avec un décalage dû au temps de calcul élevé. Une autre possibilité est un mélange des deux à coup de grand "freeze" d'écran. Rien de bien souhaitable !

## Solution
Lors d'une interaction provenant de l'utilisateur, modifiez seulement l'état de vos objets. N'effectuez surtout pas de rendu. C'est le job de la boucle de rendu, et elle le fait très bien.

Dans cet exemple "modifier l'état de l'objet" signifier simplement rafraîchir les coordonnées du cercle. 

```javascript
// rendering method 
function render(context) {
   var radius= 25;
   // only draws circles with something like that:
   for (var i = 0; i < circles.length; ++i) {
    context.beginPath();
    context.arc(circle[0], circle[1], radius, 0, _2PI);
    context.fill();
    context.stroke();
  }
}
 
// rendering-loop
var animation = function() {
    window.requestAnimationFrame(animation);
 
    window.clear(raf);
    render(raf.context);
}
 
animation();
 
document.addEventListener('mousemove', function(event) {
    // compute coordinate into canvas
    var bb = event.target.getBoundingClientRect();
    // Assume the following :
    // - mouseCircle refer a circle
    // - mouseCircle[0] means x position 
    // - mouseCircle[1] means y position 
    mouseCircle[0] = event.clientX - bb.left;
    mouseCircle[1] = event.clientY - bb.top;
});
```

Encore une fois, cela se traduit par une **séparation de la logique business et la logique de rendu**. Dans notre listener, on met seulement à jour la position de notre cercle (logique business), et on laisse notre boucle de rendu s'occuper du reste. Automatiquement, lorsqu'elle effectuera son rendu, elle dessinera `mouseCircle` avec ses nouvelles coordonnées.

![Exemple d'une animation utilisant requestAnimationFrame et supportant le déplacement de souris](https://dev-to-uploads.s3.amazonaws.com/i/75hkmbx2kubouu57dfcc.gif)

# Conclusion

Créer une animation basique est assez intuitif. Néanmoins, il existe quelques règles permettant de développer plus facilement et éviter des problèmes de performances ou de maintenabilité.
* Créer une **méthode de rendu** et une **boucle de rendu** afin de faciliter le cycle de vie de vos animations.
* La méthode de rendu **décrit** comment gérer **l'apparence** de mes objets à afficher
* La boucle de rendu **planifie l'affichage** de mes objets, elle décide quand invoquer la méthode de rendu.
* La méthode de rendu a pour vocation de décrire comment afficher vos objets. Si l'utilisateur peut interagir avec l'animation, **éviter au maximum de modifier vos objets à l'intérieur de celle-ci**.
* Implémenter une boucle de rendu avec `setInterval` présente de nombreux défauts : taux de rafraîchissement non adaptatif, drift, mauvaise gestion parfois chaotiques des intervalles en arrière-plan par le navigateur, fuites mémoires car on oublie 9 fois sur 10 de récupérer l'`intervalId` retourné par `setInterval` (avouons-le 😇), etc.
* **Il est recommandé d'utiliser les requestAnimationFrame**. Les navigateurs gèrent les demandes de rendu selon leur besoin et s'adaptent au contexte d'exécution.


# Le mot de la fin

Ceci clôture mon deuxième tutoriel sur le JavaScript 😁. N'hésitez pas à poster dans les commentaires vos expériences avec les animations en JavaScript ! 

