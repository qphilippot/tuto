# Appliquez des filtres sur vos vidéos avec Javascript

Que ce soit pour améliorer la netteté d'une image, rehausser sa luminosité, modifier la répartition des couleurs, ou pour des centaines de raisons toutes aussi fondées, la plupart des images affichées par nos écrans subissent de nombreux traitements.

En règle générale, ces corrections s'appliquent avant l'enregistrement des images sous forme de fichier (pour des raisons d'optimisations évidentes). Cela dit, il est parfois nécessaire d'appliquer des filtres sur un contenu vidéo en temps réel.

## Comment retoucher des images à la volée ?

Je vous propose une solution très simple permettant d'effectuer ces traitements directement depuis notre navigateur. 

Cette méthode peut se résumer ainsi :
- Intégrer une vidéo la notre page, grâce à la balise `<video>` (idéalement en caché)
- Récupérer son flux vidéo dans un objet `ImageData`
- Effectuer le traitement de l'image dessus
- Afficher le résultat dans une balise `<canvas>`.


### Intégrer une vidéo à la page

```html
 <video
   id="tuto-video"
   src="your-video-url"
   width="300"
   height="300"
   controls
></video>
```


### Récupération du flux vidéo en JS

Si vous vous êtes déjà intéressés à l'**encodage des vidéos**, vous savez qu'obtenir un flux de pixels à partir d'un fichier est une tâche complexe. Pour parser les fichiers vidéos, maîtriser les différents formats est un indispensable.

*« - Alors nous devoir allons apprendre tous les formats vidéos pour continuer ? »* 😨 

Non, revenez ! Le navigateur s'occupe de tout ! 

Avec la balise `<video>`, extraire les pixels d'une vidéo se fait en seulement quelques lignes :


```js
const video = document.getElementById('tuto-video');

// Create canvas for video's pixel extraction
const extractPixelCanvas = document.createElement('canvas');
const extractPixelContext = extractPixelCanvas.getContext('2d');

/**
 * @param {HTMLVideoElement} video
 * @param {Number} width 
 * @param {Number} height 
 * @return {ImageData} the pixel matrix
 */
function extractVideoImageData(video, width, height) {
    // avoid unnecessary resize as much as possible (optimization)
    if (extractPixelCanvas.width !==  width) {
        extractPixelCanvas.width =  width;
    }

    if (extractPixelCanvas.height !==  height) {
        extractPixelCanvas.height = height;
    }
    
    extractPixelContext.drawImage(video, 0, 0, extractPixelCanvas.width, extractPixelCanvas.height);
    return extractPixelContext.getImageData(0, 0, extractPixelCanvas.width, extractPixelCanvas.height);
}
```


### Manipuler ses pixels avec `ImageData`

Pour afficher le contenu d'une matrice de pixel sur un écran, il suffit de l'injecter dans un contexte canvas : 
```js
canvasContext2D.putImageData(instanceOfImageData, 0, 0);
```

#### Quelques explications sur la classe `ImageData`
La structure de l'objet est relativement simple :
* une instance possède les propriétés `width` et `height`correspondant à la résolution de l'image.
* Les pixels sont stockés dans la propriété `data`, une matrice de type `Uint8ClampedArray`.
* Les pixels sont encodés sous forme `RGBA`. L'*alpha* est compris entre 0 et 255.

Pour modifier une image à la volée, on modifiera les pixels contenus dans `data`.

Un exemple tiré de [la documentation](https://developer.mozilla.org/en-US/docs/Web/API/ImageData/ImageData).

```js
// Iterate through every pixel
for (let i = 0; i < imageData.data; i += 4) {
    imageData.data[i + 0] = 0;    // R value
    imageData.data = 190;  // G value
    imageData.data = 0;    // B value
    imageData.data  // A value
}
```


### Afficher une image retouchée dans un `<canvas>`

```html
<!--html-->
<canvas id="tuto-canvas"></canvas>
```
```js
//js
const canvas = document.getElementById('tuto-canvas');
canvasContext2D = canvas.getContext('2d');

const instanceOfImageData = applyYourAmazingFilter(/* ... */);

canvasContext2D.putImageData(instanceOfImageData, 0, 0);
```

## Un filtre, oui ; mais aussi une animation !

L'utilisation d'un filtre sur un flux vidéo est considérée (ici) comme une **animation**. 

L'implémentation du filtre et la modification des pixels font office de **méthode de rendu**, tandis que la synchronisation entre le canvas et le lecteur vidéo déterminera le comportement de la **boucle de rendu**.

Ces termes vous paraissent abstraits ? J'ai écrit un tutoriel sur le sujet : [Faîtes vos propres animations en JS](https://dev.to/qphilippot/faites-vos-propres-animations-en-js-34ok).


### Synchroniser l'animation avec le lecteur vidéo - Définir la boucle de rendu

L'animation doit se lancer lorsqu'on clique sur play, s'arrêter à la fin de la vidéo ou quand appuie sur pause (pour ne pas rafraîchir une image qui ne change pas, ce serait dommage de gâcher des ressources CPU pour rien).
En d'autres termes, la boucle de rendu doit être pilotée par le lecteur vidéo.

Pour rappel, la **boucle de rendu** s'occupe de rafraîchir automatiquement notre canvas.

```js
const animation = new Animation({ /* … */ });

video.addEventListener('play', () => {
   animation.play();
});

video.addEventListener('pause', () => {
   animation.pause();
});

video.addEventListener('end', () => {
   animation.pause();
});

// render animation once when we click on timeline
video.addEventListener('timeupdate', () => {
   animation.askRendering()
});
```

### Implémentation d'un filtre - Définir une méthode de rendu

Nous savons désormais comment extraire les pixels d'une vidéo, et configurer la boucle de rendu. Il ne reste plus qu'à définir la méthode de rendu.

```js
const animation = new Animation({
    canvas: document.getElementById('tuto-canvas'),
    // rendering method is here
    render: (context, canvas) => {
        const imageData = extractVideoImageData(video, canvas.width, canvas.height);
        // apply filter over imageData here;
        animation.clear();
        context.putImageData(imageData, 0, 0);
        }
    }
);

```


Ce tutoriel s'appuie sur une connaissance rudimentaire des `canvas`. Besoin d'une piqûre de rappel ? Cet [article](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas) est un classique, de plus, il montre comment appliquer des filtres sur des images. Il constitue un excellent complément à ce tuto. N'hésitez pas à y jeter un oeil ! 👍



## Résumé 

```js
import Animation from '../../shared/animation.model';

document.addEventListener('DOMContentLoaded', () => {
    // Create canvas for video's pixel extraction
    const extractPixelCanvas = document.createElement('canvas');
    const extractPixelContext = extractPixelCanvas.getContext('2d');

    function extractVideoImageData(video, width, height) {
        // avoid unnecessary resize as much as possible (optimization)
        if (extractPixelCanvas.width !==  width) {
            extractPixelCanvas.width =  width;
        }
    
        if (extractPixelCanvas.height !==  height) {
           extractPixelCanvas.height = height;
        }


       extractPixelContext.drawImage(video, 0, 0, extractPixelCanvas.width, extractPixelCanvas.height);
       return extractPixelContext.getImageData(0, 0, extractPixelCanvas.width, extractPixelCanvas.height);
    }
    
    const video = document.getElementById('tuto-video');


    const animation = new Animation({
        canvas: document.getElementById('tuto-canvas'),
        render: (context, canvas) => {
            const imageData = extractVideoImageData(video, canvas.width, canvas.height);
            
            // apply filter over imageData here;
            
           animation.clear();
           context.putImageData(imageData, 0, 0);
       }
   });


    video.addEventListener('play', () => {
        animation.play();
    });

    video.addEventListener('pause', () => {
        animation.pause();
    });

    video.addEventListener('end', () => {
        animation.pause();
    });

    video.addEventListener('timeupdate', () => {
        animation.askRendering()
    })
});
```

## Résultat préliminaire


![Récupération du flux vidéo et rendu dans un canvas en JS](https://github.com/qphilippot/tuto/blob/master/apply-filter-on-video/assets/gif/no-filter-1.gif?raw=true)

*« - Hein ? Je ne vois aucune différence… »* 🙈


Précisément ! Nous n'avons encore appliqué aucun filtre. Toutefois, on constate que notre flux vidéo est bel et bien répliqué sans déformation ni latence.

Pour appliquer un filtre sur l'image, il suffira d'**appliquer un traitement sur l'`ImageData`** extraite dans la méthode de rendu.

Ce tutoriel pourrait s'arrêter là ; le mécanisme n'est guère plus compliqué. Toutefois, cela commence à peine à devenir cool, ne nous arrêtons pas en si bon chemin ! 

# Exemple d'implémentation de filtres en JS

## Grayscale

Nous allons simplement transformer les pixels `RGB` en niveau de gris.

```js
// get grayscale value for a pixel in buffer

function rgbToGrayscale(buffer, offset) {
   return Math.ceil((
       0.30 * buffer[offset] +
       0.59 * buffer[offset + 1] +
       0.11 * buffer[offset + 2]
   ) * (buffer[offset + 4] / 255.0));
}

/**
* @param {Uint8Array} pixelBuffer
*/
function applyGrayscaleFilter(pixelBuffer) {
   for (let offset = 0; offset <pixelBuffer.length; offset += 4) {
       const grayscale = rgbToGrayscale(pixelBuffer, offset);
       pixelBuffer[offset] = grayscale;
       pixelBuffer[offset + 1] = grayscale;
       pixelBuffer[offset + 2] = grayscale;
       pixelBuffer[offset + 3] = 255;
   }
}


const animation = new Animation({
   canvas: document.getElementById('tuto-canvas'),
   render: (context, canvas) => {
       const imageData = extractVideoImageData(video, canvas.width, canvas.height);
       applyGrayscaleFilter(imageData.data);
       
       animation.clear();
       context.putImageData(imageData, 0, 0);
   }
});
```


Nous remplaçons les canaux RGB de chaque pixel par leur niveau de gris.

Intuitivement, il serait tentant de calculer une moyenne des composantes `R`, `G` et `B` et d'utiliser cette valeur comme niveau de gris. Toutefois, l'oeil humain ne perçoit pas toutes les couleurs avec la même sensibilité. Et puisque nous sommes plus sensibles à certaines couleurs, il est tout naturel de donner plus d'importances à celles-ci lors du calcul du niveau de gris.

Cela explique la présence des constantes `0.30`, `0.59` et `0.11` dans la méthode `rgbToGrayscale`. L'intensité obtenue par cette méthode est appelée la **luminance**  du pixel.


![Implémentation du filtre grayscale en JS avec canvas ](https://github.com/qphilippot/tuto/blob/master/apply-filter-on-video/assets/gif/grayscale.gif?raw=true)

## Supporter les interactions souris

Une animation, c'est bien. Mais une animation qui interagit avec la souris, c'est mieux ! Transformons le code afin d'invoquer `applyGrayscaleFilter` seulement quand le pointeur se trouve au dessus du canvas.

```js
const animation = new Animation({
    canvas: document.getElementById('tuto-canvas'),
    render: (context, canvas) => {
        const imageData = extractVideoImageData(video, canvas.width, canvas.height);
        
        // compute isPointerHoverCanvas ...

        if (isPointerHoverCanvas === false) {
            applyGrayscaleFilter(imageData.data);
        }
        
        animation.clear();
        context.putImageData(imageData, 0, 0);
    }
});
```

### Déterminer la position de la souris par rapport au canvas


Il existe plusieurs façons de déterminer si le curseur est au-dessus d'un canvas. Selon l'approche, certaines sont plus appropriées que d'autres.

Dans cette situation, la plus simple consiste à :
* Récupérer les coordonnées du canvas.
* Calculer sa **boîte englobante** (ou **hitbox**)
* Vérifier si les coordonnées du pointeur se trouvent dans la boîte englobante ([collision AABB](https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_collision_detection#point_vs._aabb)).

```js
const pointerCoords = {x: 0, y: 0};

document.addEventListener('pointermove', event => {
    pointerCoords.x = event.clientX;
    pointerCoords.y = event.clientY;
});

const animation = new Animation({
    canvas: document.getElementById('tuto-canvas'),
    render: (context, canvas) => {
        // …

        const boundingBox = canvas.getBoundingClientRect();


        const isPointerHoverCanvas = (
            pointerCoords.x >= boundingBox.left &&
            pointerCoords.y >= boundingBox.top &&
            pointerCoords.x < boundingBox.right &&
            pointerCoords.y < boundingBox.bottom
        );


        if (isPointerHoverCanvas === false) {
            applyGrayscaleFilter(imageData.data);
        }
    }
});
```

![Filtre grayscale changeant lorsque le pointeur est sur le canvas en JS](https://github.com/qphilippot/tuto/blob/master/apply-filter-on-video/assets/gif/grayscale-pointer-1.gif?raw=true)

## On corse le jeu ! 🚀

On va appliquer le filtre grayscale sur toute l'image, et ne faire apparaître les couleurs que sur les pixels autour de notre curseur.

Petite subtilité : pour créer un effet plus lisse, on déterminera un cercle à l'intérieur duquel les pixels seront colorés, mais avec une intensité inversement proportionnelle à la distance au centre…

### Rappel géométrique
Un cercle peut être défini par un point (son centre), et un rayon. Dans notre cas, le centre du cercle correspond à la position du pointeur. Quant au rayon, nous prendrons une valeur arbitraire.

Déterminer si un point est dans un cercle revient à calculer la **collision entre un point et un cercle**.

Pour en savoir plus sur les méthodes de collision : http://www.jeffreythompson.org/collision-detection/point-circle.php

### Approche générale

Pour chaque pixel, vérifions s'il est à l'intérieur du cercle autour du pointeur. Afin de faciliter le calcul, nous allons nous placer dans le *repère géométrique de notre canvas*. Les coordonnées ne seront plus exprimées en fonction de la page, mais de l'élément `<canvas>`.

```js
render: (context, canvas) => {
    const imageData = extractVideoImageData(video, canvas.width, canvas.height);
    
    const coordsRelativeToCanvas = PointerCoordsHelper.getCoordsRelativeToElement(
        canvas,
        pointerCoords.x,
        pointerCoords.y
    );

    const buffer = imageData.data;
    
    // apply to the whole buffer, execept a circle defined by pointer position
    for (let offset = 0; offset < buffer.length; offset += 4) {
        const pixelOffset = (offset / 4); // pixels have 4 channel in ImageData
        const pixelX = pixelOffset % canvas.width;
        const pixelY = pixelOffset / canvas.width;

        // arbitrary radius
        const radius = 50;

        const isInCircle = CollisionHelper.isPointInCircle(
            pixelX, pixelY,
            coordsRelativeToCanvas.x, coordsRelativeToCanvas.y,
            radius
        );

        const grayscale = rgbToGrayscale(buffer, offset);

        if (isInCircle === false) {
            buffer[offset] = grayscale;
            buffer[offset + 1] = grayscale;
            buffer[offset + 2] = grayscale;
            buffer[offset + 3] = 255;
        } else {
            const distance = GeometryHelper.getDistanceBetween2DPoints(
                pixelX, pixelY,
                coordsRelativeToCanvas.x, coordsRelativeToCanvas.y
            );

            const weight = distance / radius;
            // apply a weight in order to let color intensity increase from the outside to the center
            buffer[offset] = weight * grayscale + (1 - weight) * buffer[offset];
            buffer[offset + 1] = weight * grayscale + (1 - weight) * buffer[offset + 1];
            buffer[offset + 2] = weight * grayscale + (1 - weight) * buffer[offset + 2];
            buffer[offset + 3] = 255;
        }
    }


    animation.clear();
    context.putImageData(imageData, 0, 0);
}
```


![Implémentation d'un filtre réagissant selon la position du curseur en JS et canvas](https://github.com/qphilippot/tuto/blob/master/apply-filter-on-video/assets/gif/grayscale-pointer-2.gif?raw=true)

<details>
<summary>⚠️ Remarque sur le calcul de coordonnées (Niveau avancé) ⚠️</summary>

La position du curseur est exprimée relativement à notre canvas (l'origine du repère mathématique est le coin supérieur gauche du canvas). 

On aurait pu implémenter le filtre en utilisant directement les coordonnées du pointeur dans la fenêtre (repère standard), mais les équations auraient étés plus compliquées. 

De plus, la résolution du canvas (*pixel théorique*) et sa taille (*pixel physique*) peuvent parfois varier. Puisque l'algorithme itère sur les pixels théoriques du canvas (`animation.context.width` ou `animation.canvas.width`), pour supporter correctement ce type de situation, il faudra modifier les équations pour prendre en compte ce changement de repère supplémentaire…

</details>

## Sa vision est basée sur le mouvement ! 🦖

Le filtre implémenté dans cet exemple n'affichera que les mouvements perceptibles entre deux frames. 

*« - Calculer les mouvements ? Ça à l'air difficile, non ? »*

Tout dépend ce que l'on appelle *mouvement*. Pour notre exemple, calculer la différence deux pixels entre deux frame est largement suffisant !

Le principe pour calculer le mouvement entre deux frame N-1 et N :
* Calculer le niveau de gris de la frame N-1
* Calculer le niveau de gris de la frame N
* Créer une image en niveau de gris correspondant à la valeur absolue de la différence des niveaux de gris des frame N et N - 1

Parce qu'un code vaut mieux que mille mots : 
```js
render: (context, canvas) => {
    const imageData = extractVideoImageData(video, canvas.width, canvas.height);
    const buffer = imageData.data;
  
    applyGrayscaleFilter(buffer);

    // first rendering
    if (lastBuffer === null) {
        lastBuffer = buffer.slice(0);
        window.lastBuffer = lastBuffer;
        return;
    }
    
    // compute movement
    const diffBuffer = new Uint8Array(buffer.length);
    
    for (let offset = 0; offset < buffer.length; offset += 4) {
        diffBuffer[offset] = Math.abs(buffer[offset] - window.lastBuffer[offset]);
        diffBuffer[offset + 1] = Math.abs(buffer[offset + 1] - window.lastBuffer[offset + 1]);
        diffBuffer[offset + 2] = Math.abs(buffer[offset + 2] - window.lastBuffer[offset + 2]);
        diffBuffer[offset + 3] = 255;
    }

    // update "last" buffer
    window.lastBuffer = buffer.slice(0);
    
    // overwrite image data in order to browse only the differences between the two frames
    diffBuffer.forEach((value, index) => {
        imageData.data[index] = value;
    });

    animation.clear();
    context.putImageData(imageData, 0, 0);
}
```

![Détection du mouvement entre deux frames avec JS et canvas](https://github.com/qphilippot/tuto/blob/master/apply-filter-on-video/assets/gif/movement-1.gif?raw=true)

*« - Mouais, avouons que c'est pas terrible... »* 😞

En effet, on peut mieux faire ! Néanmoins, concentrons-nous sur le positif : nous avons un début de quelque chose !

Nous parvenons à déceler les **contours** du perroquet lorsqu'il effectue un mouvement. Mais ses déplacements sont lents, peu perceptibles d'une frame sur l'autre. 

De plus, le **taux de rafraichissement** étant relativement élevé (60 fps), nous effectuons un rendu approximativement toutes les 16ms. Les mouvements ne sont donc perceptibles que durant ce laps et temps, et sont oubliés au rendu suivant.

Sachant que la **persistance rétinienne** est de l'ordre de 1/25 de secondes (40 ms), pour avoir un rendu plus fidèle, il faudrait garder en mémoire l'image des 40 dernières ms, et les prendre en compte dans notre calcul du mouvement.

### Amélioration simple

Plutôt que de se lancer dans un calcul périlleux sur le taux de rafraîchissement optimal, nous allons opter pour une solution bête et méchante : calculer le mouvement en prenant en compte, non pas la dernière frame, mais les X dernières frames.

```js
function computeMovement(target, newFrame, oldFrame) {
    let offset = 0;
    const length = newFrame.length;
    
    // another version of for-loop to compute movement
    while (offset < length) {
        target[offset] = Math.abs(newFrame[offset] - oldFrame[offset]);
        target[offset + 1] = Math.abs(newFrame[offset + 1] - oldFrame[offset + 1]);
        target[offset + 2] = Math.abs(newFrame[offset + 2] - oldFrame[offset + 2]);
        offset += 4;
    }
}

/**
 * check previous frame difference and apply a weight 
 * @return Uint8Array buffer with some extra movement pixel to add
 */
function computePersistance(buffer) {
    /*** @var {Number} historyLength is a global var, it's the number of frame to consider ***/
    let indexedHistoryBuffer = Array(historyLength);
    let weights = Array(historyLength);
    
    for (let k = 0; k < historyLength; k++) {
        indexedHistoryBuffer[k] = getHistoryBuffer(k);
        weights[k] = state.persistanceFactor * (k / historyLength);
    }

    const length = buffer.length;
    let pixelOffset = 0;
    let historyBufferOffset, historyBuffer;
    let c1, c2, c3, c4;
    
    while (pixelOffset < length) {
        c1 = pixelOffset;
        c2 = c1 + 1;
        c3 = c2 + 1;
        c4 = c3 + 1;

        buffer[pixelOffset] = 0;
        buffer[c2] = 0;
        buffer[c3] = 0;
        buffer[c4] = 255;

        historyBufferOffset = historyLength - 1;
        
        while (historyBufferOffset >= 0) {
            historyBuffer = indexedHistoryBuffer[historyBufferOffset];
            buffer[pixelOffset] += weights[historyBufferOffset] * historyBuffer[pixelOffset];
            buffer[c2] += weights[historyBufferOffset] * historyBuffer[c2];
            buffer[c3] += weights[historyBufferOffset] * historyBuffer[c3];

            historyBufferOffset--
        }
        
        pixelOffset++;
    }
}
```
**Remarques :**
* Afin d'appliquer notre *facteur de persistance* on se base directement sur les différences calculées lors des rendus précédents.
* Pour éviter d'instancier une trop grande quantité de buffers, nous utilisons un pool d'instances que nous gérons grâce à `getHistoryBuffer` 


```js
render: (context, canvas) => {
    const imageData = extractVideoImageData(video, canvas.width, canvas.height);
    const buffer = imageData.data;
    applyGrayscaleFilter(buffer);

    // first rendering
    if (lastBuffer === null) {
        lastBuffer = buffer.slice(0);
        window.lastBuffer = lastBuffer;
        return;
    }
    
    const diffBuffer = new Uint8Array(buffer.length);
    const persistanceBuffer = new Uint8Array(buffer.length);
    
    computeMovement(diffBuffer, buffer, window.lastBuffer);
    computePersistance(persistanceBuffer);

    shallowCopy(lastBuffer, buffer);

    // clamp sum of diffs 
    for (let offset = 0; offset < buffer.length; offset += 4) {
        buffer[offset] = Math.ceil(Math.min(255, diffBuffer[offset] + persistanceBuffer[offset]));
        buffer[offset + 1] = Math.ceil(Math.min(255, diffBuffer[offset + 1] + persistanceBuffer[offset + 1]));
        buffer[offset + 2] = Math.ceil(Math.min(255, diffBuffer[offset + 2] + persistanceBuffer[offset + 2]));
        buffer[offset + 3] = 255;
    }

    let currentHistoryBuffer = diffHistory[state.currentOffset];
    shallowCopy(currentHistoryBuffer, diffBuffer);
    
    state.currentOffset = nbFrameRendered % historyLength;
    

    animation.clear();
    context.putImageData(imageData, 0, 0);
}
```
**Remarques :**
* Lorsqu'on additionne des buffers, ne pas oublier d'effectuer un **clamp** afin de s'assurer que les valeurs additionnées restent dans l'intervalle des valeurs autorisées par la structure de donnée (entre 0 et 255).
* La méthode `shallowCopy` se contente d'effectuer une **copie superficielle** d'un tableau dans un autre tableau. Le but est de réutiliser les instances existantes, et d'éviter la répétition de code. Son implémentation est triviale et disponible sur le [git](https://github.com/qphilippot/tuto/blob/master/apply-filter-on-video/). 

![Détection de mouvement grâce à un filtre sur un canvas JS avec simulation de persistance](https://github.com/qphilippot/tuto/blob/master/apply-filter-on-video/assets/gif/movement-2.gif?raw=true)


Voici une tentative se basant sur les 5 dernières frames, avec coefficient équivalent à 15. Si les mouvements sont davantages perceptibles, le coût en calcul lui est nettement plus élevé. On passe de 60 fps à un peu plus de 20 fps. Rien de plus normal, on a presque triplé la charge de travail.

Il existe des méthodes permettant d'obtenir un résultat plus propre, et moins gourmant en calcul, mais également moins simple à expliquer 😁. 

Puisque le but de cet article est de présenter des filtres simples, je les passe sous silence. Cela fera peut-être l'objet d'un prochain tutoriel.
## La vie en bleu 🦜

Dans ce dernier exemple, je propose de teindre ce cher perroquet en bleu.

Pour atteindre notre objectif, considérons la couleur de son plumage d'origine. Il n'est pas simplement rouge, mais couvre une nuance de rouge. Le filtre devra prendre en compte toutes ces nuances, pour proposer un rendu réaliste prenant en compte la pigmentation naturelle des plumes ainsi que les variations de luminosité.

### Rappel sur la représentation de la couleur
La représentation des couleurs dans les `ImageData` est en `RGBA`. En d'autres termes, la couleur finale est obtenue à partir d'un mélange des quatre composantes.

Une solution naïve consisterait à supprimer la dimension rouge (mettre toutes les intensités à 0). Le défaut de cette représentation (`RGBA`), toutes les couleurs ont une part contiennent une part de rouge. Autrement dit, si l'on modifie la composante `R`, quasiment toutes les couleurs seront impactées.

Bonne nouvelle : il existe énormément d'espaces couleurs, et dont la plupart ne sont pas couplés à la couleur rouge ! Des formules mathématiques permettent de changer facilement de représentation, il n'y a donc aucune raison de se borner à ce bon vieux `RGB`.

Selon le cas d'usage, certains espaces couleurs sont plus pratiques que d'autres (`YCrCb` pour la compression, `CMJN` pour l'impression, etc).

Dans le cas présent, l'ensemble `HSL` *Hue Saturation Lightness*, ou `TSV` en français semble le plus approprié. Dans cet espace, la **teinte** des couleurs est définie via un cercle colorimétrique.

Pour transformer du "rouge" en "bleu", il suffit de déterminer une section du cercle que l'on souhaite remplacer, et d'y coller la section par laquelle on souhaite le remplacer.

![Schéma illustrant l'espace TSV](https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/HSV_cone.png/300px-HSV_cone.png)

### Principe du filtre

* Récupérer la couleur des pixels `RGBA`.
* Les convertir en `HSL`.
* Manipuler les teintes *rouges* et les remplacer par des *bleues*.
* Reconvertir en `RGBA`.
* Remplir l'instance `ImageData` avec les pixels modifiés.

### Implémentation

Concernant les fonctions de transformations `HSL` vers `RGBA` et réciproquement, je vous laisse checker le [git](https://github.com/qphilippot/tuto/blob/master/apply-filter-on-vide).

Pour des raisons de performances, nous allons implémenter une **Look Up Table (*LUT*)**, c'est-à-dire une table de correspondance pour toutes nos couleurs. L'enjeu est de ne pas calculer toutes les correspondances de couleurs à la volée (pixels par pixels à chaque rendu), mais de les calculer une bonne fois pour toutes au lancement de la page. 

La méthode de rendu n'aura qu'à lire dans cette LUT pour y lire les résultats et gagner un temps précieux (et un meilleur frame rate).
#### Calcul de la LUT
```js
function generateRedToBlueLUT() {
    const size = 16777216; // 256 * 256 * 256
    const lut = new Array(size);

    // initialize all colors to black
    for (let i = 0; i < size; i++) {
        lut[i] = [0, 0, 0];
    }

    // iterate through RGB combinaisons
    for (let redOffset = 0; redOffset < 256; redOffset++) {
        for (let greenOffset = 0; greenOffset < 256; greenOffset++) {
            for (let blueOffset = 0; blueOffset < 256; blueOffset++) {
                // Use a pool design pattern
                // If you want to implements it without object pool, juste replace it by [0, 0, 0]
                const rgb = vec3Pool.getOne();
                const hsl = vec3Pool.getOne();
                
                rgb[0] = redOffset;
                rgb[1] = greenOffset;
                rgb[2] = blueOffset;

                // color conversion, check sources for detailled implementation 
                rgbToHSL(rgb, hsl);

                // Clamp saturation and lightness
                hsl[1] = Math.max(0, Math.min(hsl[1], 1));
                hsl[2] = Math.max(0, Math.min(hsl[2], 1));

                // Here is the trick: hue is represented by a degree angle
                // We want : 0 <= hue < 360
                if (hsl[0] < 0) {
                    hsl[0] += 360;
                }

                hsl[0] = hsl[0] % 360;

                // Assume that :
                // - "red" hues are between 340° and 20°
                // - "blue" are between 140° and 220°
                
                // replace hue
                if (hsl[0] > 340 && hsl[2] < 0.85) {
                    hsl[0] -= 120;
                }

                else if (hsl[0] < 20 && hsl[2] < 0.85) {
                    hsl[0] += 240;
                }

                // sanitize angle : 0 <= hue < 360 
                if (hsl[0] < 0) {
                    hsl[0] += 360;
                }

                hsl[0] = hsl[0] % 360;
                
                hslToRGB(hsl, rgb);

                // store RGBA converted into lut
                lut[redOffset * 65536 + greenOffset * 256 + blueOffset] = Array.from(rgb);
                
                // recycle instance, only for object pool implementation
                vec3Pool.recycle(rgb);
                vec3Pool.recycle(hsl);
            }
        }
    }

    return lut;
}
window.lut = generateRedToBlueLUT();
 ```
Plusieurs remarques sur cette implémentation :
* Notre LUT est un tableau. On calcule l'index de chaque couleur par la formule `R * 255 * 255 + G * 255 + B`
* Pour des raisons de performances, on utilise un object pool design pattern. Le calcul d'une LUT demande d'instancier pas mal de petits tableaux, cela peut surcharger inutilement la mémoire du navigateur. Pour en savoir plus sur l'implémentation de l'object pool design pattern en JS, lisez l'article suivant : [Optimisez vos applications JS avec l'Object Pool Design Pattern !](https://dev.to/qphilippot/optimisez-vos-applications-js-avec-l-object-pool-design-pattern-3g8)
* Les calculs d'angles sont empiriques, à partir du cercle colorimétrique. D'ailleurs, en regardant attentivement le rendu, on peut s'apercevoir que la "teinture" n'est pas parfaite, et que quelques pointes de rouges se promènent ça et là 😉

#### Coup d'oeil sur la méthode de rendu

```js
render: (context, canvas) => {
    const imageData = extractVideoImageData(video, canvas.width, canvas.height);
    const buffer = imageData.data;

    for (let offset = 0; offset < buffer.length; offset += 4) {
        const r = buffer[offset];
        const g = buffer[offset + 1];
        const b = buffer[offset + 2];

        // 65536 = 256 * 256
        const lutIndex = r * 65536 + g * 256 + b;
        
        // just replace color by pre-computed value
        const color = window.lut[lutIndex];

        buffer[offset] = color[0];
        buffer[offset + 1] = color[1];
        buffer[offset + 2] = color[2];
        buffer[offset + 3] = 255;

    }
    
    animation.clear();
    context.putImageData(imageData, 0, 0);
}
```

Et voici un beau perroquet haut en couleur ! :D

![Perroquet bleu après l'application d'un filtre en JS](https://github.com/qphilippot/tuto/blob/master/apply-filter-on-video/assets/gif/blue-1.gif?raw=true)

## Conclusion

J'espère sincèrement que ce tutoriel vous a plu. Le principe derrière l'utilisation de filtres en live est assez simple à implémenter, mais nécessitait bien selon moi quelques exemples pour comprendre son utilisation. Je suis passé assez rapidement sur certains points pour éviter de dévier du sujet principal : ~~torturer ce pauvre oiseau~~ utiliser une boucle de rendu pour appliquer des filtres en temps réels.

N'hésitez pas à me faire part de vos commentaires ou de vos remarques, c'est toujours un plaisir 😉