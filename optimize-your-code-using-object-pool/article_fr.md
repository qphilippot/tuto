Parfois méconnu des développeurs junior, l'**object pool** est un **patron de conception** fréquemment utilisés lorsqu'on manipule un grand nombre d'instances.

Indépendamment de votre langage de prédilection, vos chances de le rencontrer sont loin d'être dérisoires. Que vous soyez développeur Web, Mobile, ou que vous luttiez tous les jours contre un langage de bas niveau, ce design pattern s'adresse à vous ! 😉

# Qu'est-ce que l'Object Pool design pattern ?

Ce patron de conception repose sur la **réutilisation massive d'instances**. Le concept est simple : au lieu de laisser notre programme détruire nos objets lorsqu'ils ne sont plus utiles, on les place dans une réserve d'instance : la *pool*.

Ainsi, dès que notre application aura à nouveau besoin d'une instance de même type, au lieu d'en créer une, il suffira simplement d'en piocher une dans notre pool. C'est tout.


# Rappel sur la gestion mémoire ⚙️

## Principe général
Tout au long de son exécution, un programme manipule toute sorte d'objet et de structure de données plus ou moins complexe. Pour créer une nouvelle instance, il effectue une **allocation mémoire**, c'est-à-dire qu'il réserve une certaine quantité de mémoire en RAM afin d'y stocker les informations relative à notre objet.

Lorsqu'une instance n'est plus nécessaire, le programme libère l'espace mémoire précédemment réservée, et détruit notre instance, c'est ce que l'on appelle la **libération mémoire**.

## En pratique 

Selon les langages, la **gestion de la mémoire** est une tâche plus ou moins aisée. Ceux qui bénéficient d'une expérience en C/C++ (ou autre *langage bas niveau*), connaissent les difficultés liées à la gestion de la mémoire. Jongler entre les pointeurs et les adresses mémoire n'est pas aussi amusant qu'on le voudrait.

Toutefois, la gestion de la mémoire est d'un enjeu critique. Une mauvaise gestion de celle-ci peut entraîner des désagréments allant du simple crash, à la faille de sécurité, en passant par la perte de performance et une myriade de *fuites-mémoire*. 🤯

C'est pourquoi les *langages haut niveau*  (dont JavaScript fait parti), imposent généralement un système limitant les possibilités du développeur en matière d'allocation mémoire. Adieu `malloc`, adieu les *pointeurs*, le **garbage collector** gère désormais la libération mémoire pour nous. Ainsi nous pouvons concentrer tous nos efforts sur la logique propre à notre application, et non à son fonctionnement subsidiaire.

Enfin, il est toujours bon de rappeler que le **garbage collector** ne peut ni être invoqué explicitement (comme j'ai parfois entendu certains développeurs le supposer), ni être contrôlé d'une quelconque façon que ce soit. Au mieux, il est possible de diminuer son impact en gérant judicieusement le cycle de vie des instances. C'est justement sur ce point que nous allons jouer.

# L'Object Pool Design Pattern et le Javascript

On peut s'interroger sur les bénéfices apportés par l'**object pool**. En effet, si le garbage collector s'occupe de l'allocation mémoire et de libération mémoire, ce n'est sont plus de notre ressort. Pourquoi s'encombrer avec un tel système ? 

Et puis : *"Jusque là, mes applications ont toujours bien fonctionnés"*

Certes. 

Il faut garder à l'esprit que l'allocation mémoire et la libération ne sont pas des opérations anodines. Elles peuvent être relativement coûteuses en fonction du nombre et de la complexité des instances à créer ou à détruire.

Diminuer le coût de fonctionnement de notre application est possible en recyclant nos instances : 

Au lieu de laisser le garbage collector les détruire, on conserve une référence de ces instances dans un **pool d'instances**. Ainsi, elles sont toujours considérées comme actives par le garbage collector, mais temporairement non utilisées au sein de notre programme. 

✔️ On aura économisé une libération mémoire.


Lorsqu'une instance du même type sera requise, plutôt d'en créer une nouvelle, on récupèrera l'instance recyclée dans notre pool d'instance.

✔️ On aura économisé une allocation mémoire.

# Mise en situation

## Exercice : un monde de particules

Supposons que l'on développe le système de particule suivant :

Des particules apparaissent sur un fond noir avec une position et une couleur aléatoire toutes les 200ms. Chaque particule vit approximativement 1000ms. Lorsqu'on déplacera la souris, un nuage de particule suivra le curseur. Pour donner une impression de crépitement, on déplacera les particules à chaque rendu sur des cases voisines.


![objectif-pool](https://dev-to-uploads.s3.amazonaws.com/i/nz08iljnenzjqxkj8edz.gif)
 
```javascript
let particles = [];
const maxTtl = 50;
 
    class Particle {
        constructor(x, y, r, g, b) {
            this.initialize(x, y, r, g, b);
        }               
 
        initialize(x, y, r, g, b) {
            this.x = x || 0;
            this.y = y || 0;
            this.ttl = maxTtl;
            this.rgb = [
                r || 255, 
                g || 255, 
                b || 255 
            ];
        }
 
        live() {
            this.wiggle();
            this.ttl--;
        }
 
        /**
        * Retourne l'index de notre particule dans une matrice de pixels en fonction de sa position (x, y)
        */
        getOffset() {
            return (Math.ceil(this.y) * image.width + Math.ceil(this.x)) * 4;
        }
 
        /**
        * @image {ImageData} Matrice de pixels sur lesquels faire le rendu
        */
        draw(image) {
            const offset = this.getOffset();
 
            // 4 channels : r, g, b, a 
            image.data[offset] = this.rgb[0]; 
            image.data[offset + 1] = this.rgb[1];
            image.data[offset + 2] = this.rgb[2];
            image.data[offset + 3] = 255 * (this.ttl / maxTtl);
        }
 
        wiggle() {
            this.x += Math.random() * 4 - 2;
            this.y += Math.random() * 4 - 2;
       }
 
       isAlive() {
           return this.ttl > 0;
       }
}


```
Et c'est tout pour le comportement d'une particule.

Concernant le système en lui-même, on gérera l'apparition de particules grâce à un intervalle :

```javascript
function clamp(value) {
    return Math.ceil(Math.max(Math.min(value, 255), 0));
}
 
function spread(x, y, r, g, b) {
    // On crée une particule à l'emplacement désiré
    particles.push(new Particle(x, y));
    
    // On ajoute un nuage de particules tout autour pour un meilleur rendu
    for(var i = 0; i < 10; i++) {
        particles.push(
            new Particle(
                x + Math.random() * 10 - 5, 
                y + Math.random() * 10 - 5,
                clamp(r + Math.random() * 10 - 5),
                clamp(g + Math.random() * 10 - 5),
                clamp(b + Math.random() * 10 - 5)
            )
        );
    }
}
 
// boucle gérant l'apparition aléatoire de particules
setInterval(function() {
    for (let i = 0; i < 1500; ++i) {
        spread(
            // position aléatoire
            Math.ceil(Math.random() * context.width),
            Math.ceil(Math.random() * context.height),
 
            // couleur aléatoire
            Math.ceil(Math.random() * 255),                        
            Math.ceil(Math.random() * 255),                        
            Math.ceil(Math.random() * 255)    
        );
    }                  
}, 200);
 
// boucle simulant la "vie" d'une particule
setInterval(function() {
    particles.forEach(function(particle) {
        particle.live();
    });
}, 20);
```

Concernant la boucle d'animation, elle ne présente pas un intérêt majeur dans cet exemple. Néanmoins, si vous êtes curieux :

```javascript
function clearImage(image) {
    const nbSample = image.width * image.height;
    const data = image.data;
    for (let i = 0; i < nbSample; i++) {
        const offset = i * 4;
        data[offset] = 0;
        data[offset + 1] = 0;
        data[offset + 2] = 0;
        data[offset + 3] = 0;
    }
}
 
function animation() {
    let nbParticlesAlive = 0;
 
    clearImage(image);
    
    particles.forEach(function(particle) {
        particle.draw(image);
        
        if (particle.isAlive()) {
            nbParticlesAlive++;
        }
    });
 
    const nextParticles = new Array(nbParticlesAlive);
    let currentParticleIndex = 0;
    
    particles.forEach(function(particle) {
        if (particle.isAlive()) {
            nextParticles[currentParticleIndex] = particle;
            currentParticleIndex++;
        }
    });
 
    // La variable particles fait désormais référence à nextParticle
    // -> le garbage collector pourra supprimer l'ancien tableau (quand ça lui chantera)
    particles = nextParticles;
    context.putImageData(image, 0, 0);
 
    window.requestAnimationFrame(animation);
}
 
animation();
```

Une fois que l'on a implémenté toutes ces méthodes, vient l'heure du test :

![no-pool-1](https://dev-to-uploads.s3.amazonaws.com/i/z1w32i7s6dw9y53xnfsz.gif)

En le testant, on s'aperçoit que notre système de particule fonctionne à merveille. Notre animation tourne à 60 FPS. 🏆

L'utilisation de **requestAnimationFrame** limitant notre fréquence maximale à environ 60 FPS, nous obtenons le meilleur résultat possible. Class.

Après quelques secondes d'euphorie et d'auto-congratulation, on essaie de jouer avec notre script, on augmente le nombre de particules et on diminue leur durée de vie. Tout de suite, le résultat est moins flatteur.

![no-pool-3](https://dev-to-uploads.s3.amazonaws.com/i/xxatjaq5rusqtodl5l43.gif)

Le nombre de FPS s'effondre. La boucle d'animation est durement touchée, le nombre de wiggles par secondes a lui aussi quasiment été divisé par 2. Pourtant le cycle de vie de nos particules était indépendant de la boucle d'animation, et répondait à un intervalle, comment est-ce possible ? 

Notre programme est tellement ralenti que le navigateur "repousse" leur exécution. Pourtant, la durée de vie de nos particules se basant sur un timestamp, une des conséquences directes de ce ralentissement est que les particules se déplaceront moins au cours de leur vie et formeront des sortes de pâtés multicolores.

## Comment expliquer cette perte de performance ?##

En augmentant le nombre d'instances affichées, on a également augmenté le nombre d'allocations mémoires, et donc la libération mémoire lorsque celles-ci meurent. En diminuant leur durée de vie, on laisse moins de temps au **garbage collector** pour libérer la mémoire, on augmente sa charge.

Un coup d'oeil sur l'analyseur de performance confortera notre hypothèse.

![GB-no-pool](https://dev-to-uploads.s3.amazonaws.com/i/t41eqj2lgsdx2gz8fc9h.png)
 
## Implémentation de l'Object Pool design pattern

Puisque c'est ainsi, implémentons un pool de particules et voyons si le pattern tient sa promesse.

```javascript
class ParticlesPool {
    constructor() {
        this.instances = [];
        this.index = -1;
    }
    
    getOne(x, y, r, g, b, born_at) {
        const instance = null;
        if (this.index >= 0) {
            instance = this.instances[this.index];
            instance.initialize(x, y, r, g, b, born_at);
            this.index--;
        }
 
        else {
            instance = new Particle(x, y, r, g, b, born_at);
        }
 
        return instance;
    }
 
    recycle(instance) {
        this.instances[this.index + 1] = instance;
        this.index++;
    }
}   
 
 
const pool = new ParticlesPool();
```

Puis on adapte notre code pour l'utiliser. Les modifications seront simplissimes : 

* Remplacer tous les appels au constructeur de Particle par `pool.getOne()`.
* Ajouter un appel à `pool.recycle` lorsqu'une particule meurt afin d'éviter la *fuite mémoire*.

```javascript
// ...
 
function spread(x, y, r, g, b, born_at) {
    particles.push(pool.getOne(x, y, r, g, b, born_at));
    for(var i = 0; i < window.additionnalSpreadParticles; i++) {
        particles.push(
            pool.getOne(
               // ...
            )
        );
    }
}
 
 // ...
 
function animation() {
 
    // ...
 
    particles.forEach(function(particle) {
        if (particle.isAlive(currentTime)) {
            particle.draw(image);
            nbParticlesAlive++;
        }
        
        else {
            pool.recycle(particle);
        }
    });
 
    // ...
}

```

Et c'est tout !

On relance notre application :

![pool-23](https://dev-to-uploads.s3.amazonaws.com/i/pcbk4ne2xqc1vyczvlro.gif)

On constate un gain de 10 FPS ! 🚀

Le nombre de wiggle est lui aussi plus élevé. Quant à la charge du garbage collector, celle-ci devient tout de suite plus acceptable.

![after-pool](https://dev-to-uploads.s3.amazonaws.com/i/9bm48odhq6a5w2kgqgee.png)

## Analyse à postériori

On n'atteint pas encore les 60 FPS, certes. Mais, il ne faut pas oublier que le but fondamental de notre application est de faire une animation graphique ! En augmentant le nombre d'objets à dessiner, notre *boucle de rendu* voit naturellement sa charge augmenter. L'object pool design pattern ne peux rien pour cela.

Des optimisations au niveau de la logique de rendu existent, et feront peut-être l'objet d'un autre article. Quant à la gestion mémoire, on peut encore l'améliorer, notamment lorsqu'on recalcule la liste des particules en vie.

# Conclusion 

L'implémentation d'un Object Pool design pattern peut avoir un effet bénéfique sur les performances de votre application. En gérant judicieusement la mémoire, vous pouvez augmenter le nombre de ressources manipulables par votre application. Dans notre exemple, augmenter le nombre de particules affichables simultanément, l'a rendue plus *résiliente*. 💪


## Bon à savoir

### Correspondance avec les autres langages

Cet article / cours se focalise sur les avantages que peut avoir ce pattern pour le JavaScript. On n'y aborde pas du tout la problématique liée à la fragmentation de la mémoire, qui mérite au moins notre curiosité. Pour en apprendre plus à ce sujet, je vous invite à lire [cet excellent article](https://gameprogrammingpatterns.com/object-pool.html) (C++/anglais).

### Domaine d'application

Comme nous ne développons pas un système à particules tous les jours, voici d'autres exemples d'utilisations :


* Les jeux vidéos : on instancie toute sorte d'objets à durée de vie limitée.
* Le traitement d'image et la 3D : pour tout ce qui est calcul, équation mathématique, gestion des ressources.
* Couplé à un Singleton, on le retrouve régulièrement comme un service gérant les connections à une couche tierce, cache, connexions base de données, pool de workers, etc.

Ce pattern est particulièrement adapté quand :

* Vous devez instancier un grand nombre d'objets complexes.
* La durée de vie de ses objets est courte.
* Le nombre d'objets requis simultanément est faible.

### Le mot de la fin

Voici qui clôt mon premier article (qui prend un peu des aspects de cours) ! 🤓

Je sais qu'il est un peu long, le sujet est tellement dense qu'il mérite bien toutes ces lignes. N'hésitez pas à me faire remonter vos remarques afin d'améliorer la qualité de mes articles !

D'ailleurs, si vous avez déjà rencontrés ce design pattern, ou qu'il vous a sauvé la vie, je vous encourage à partager votre expérience dans les commentaires. 😃