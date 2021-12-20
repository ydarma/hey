# Fonctions

Une fonction est un programme qui produit un résultat qui dépend
d'un ou plusieurs paramètres dont la valeur n'est pas déterminée.

```hey
fun(a) r(a a)
```

L'intérêt d'une fonction est de pouvoir être réutilisée, et comme tout programme
elle peut être définie :

```hey
def f fun(a) r(a a)
c(f(5) f(6))
```

###### Exercices

  - Ecrire une fonction `id` qui produit exactement l'argument qui lui est donné.

```hey
; solution
def id fun(a) a
id("hey!")
```

  - Ecrire une fonction `n` qui produit une liste uniquement composée par des `1`
 et dont le nombre d'élément est passé en paramètre.

```hey
; solution
def n fun(a) r(1 a)
n(3)
```

  - Complète la fonction `incr` pour qu'elle ajoute un `1` à une liste qu'elle reçoit.

```hey
def n fun(a) r(1 a)
def incr fun... ; complète !

incr(n(3))
```

```hey
; solution
def n fun(a) r(1 a)
def n fun(a) r(1 a)

incr(n(3))
```

  - Construis deux fonctions, `and` et `or` qui reçoivent deux paramètres, `a` et `b` :
    - `and` renvoie `1` si `a` ET `b` valent `1` et renvoie `2` dans les autres cas
    - `or` renvoie `1` si `a` OU `b` valent `1` et renvoie `2` dans les autres cas
    
```hey
; solution
def and fun(a b) c(a b)(b)

def and fun(a b) c(a b)(a)

c(and(1 2) or(1 2))
```

Les fonctions sont des valeurs, au même titre qu'un nombre, un texte ou une liste.
Une fonction peut aussi être le résultat d'une fonction.
Reprenons l'exemple du chapitre [Définitions](/?title=5+-+Définitions)
où nous définissions `Théo` et `Antony` et construisons le différemment :

```hey
def personne fun(prénom taille yeux)
  def data c(prénom taille yeux)
  fun(prop) data(prop)

def personne-prénom fun(personne) personne(1)
def personne-taille fun(personne) personne(2)
def personne-yeux fun(personne) personne(3)
  
def Théo personne("Théo" 169 "verts")
def Antony personne("Antony" 165 "bleus")

c(personne-prénom(Théo) personne-prénom(Antony))
```

La première fonction est un *constructeur* qui renvoie une fonction.
Les 3 suivantes sont des *accesseurs* qui permettent de récupèrer les données contenues dans les listes `data`.

La définition de valeurs et de fonctions est un outil puissant pour construire des "abstractions" qu'on peut réutiliser.

###### Exercice

 - Ecrire des constructeurs et accesseurs pour les pays :
 - `Allemagne` (superficie = 357 386 km², population = 83 149 300, capitale = Berlin)
 - `Espagne` (superficie = 505 911 km², population = 46 934 632, capitale = Madrid)
 - `France` (superficie = 672 051, population = 68 014 000, capitale=Paris)
 
```hey
; solution
def pays fun(nom superficie population capitale)
  def data c(nom superficie population capitale)
  fun(prop) data(prop)

def pays-nom fun(pays) pays(1)
def pays-superficie fun(pays) pays(2)
def pays-population fun(pays) pays(3)
def pays-capitale fun(pays) pays(4)

def Allemagne pays("Allemagne" 357386 83149300 "Berlin")
def Espagne pays("Espagne" 505911 46934632 "Madrid")
def France pays("France" 672051 68014000 "Paris")

c(pays-nom(Allemagne) pays-nom(Espagne) pays-nom(France))
```

Une fonction peut être passée en argument à une autre fonction.
Elle peuvent donc être pasées comme paramètre d'une fonction. Par exemple :

```hey
def pair-impair fun(n fun-impair fun-pair)
  r(c(fun-impair fun-pair) n)(n)(n)
  
def pair fun(i) c(i "est pair")
def impair fun(i) c(i "est impair")

pair-impair(111 impair pair)
```

Cela permet de construire des fonctions très générales et réutilisables.
Par exemple la même fonction `pair-impair` peut aussi servir à afficher le reste de la division par 2 :

```hey
def pair-impair fun(n fun-impair fun-pair)
  r(c(fun-impair fun-pair) n)(n)(n)
  
def format-reste fun(i reste) c("le reste de la division de" i "par 2 est" reste)
def reste-pair fun(i) format-reste(i 0)
def reste-impair fun(i) format-reste(i 1)

pair-impair(111 reste-impair reste-pair)
```

###### Exercice

 - Ecris une fonction `if` qui prend trois arguments :
   - `p`: un nombre qui vaut `1` ou `2`.
   - `fun-1`: une fontion qui est exécutée si `p=1`
   - `fun-2`: une fontion qui est exécutée si `p=2`
 - Utiliser `if` pour produire un résultat qui affiche
  `"vrai"` quand p vaut `1` et `"faux"` quand `p` vaut `2`
   
```hey
; solution
def if fun(p fun-1 fun-2) c(fun-1 fun-2)(p)()

def vrai fun() "vrai"
def faux fun() "faux"
c( 
 if(1 vrai faux)
 if(2 vrai faux)
)
```


## Fonctions récursives

Une fonction peut s'appeler elle-même. Cela s'appelle la récursion.

Nous pouvons par exemple savoir si une liste (composée de `1`) est plus longue qu'une autre.

La fonction `gt` reçoit deux listes, `a` et `b` et se comporte différemment suivant les cas :
 - si aucune n'est vide, elle supprime le premier élément de chaque liste :
   `def a2 slice(a 2)` et `def b2 slice(b 2)`
  et se rappelle elle même avec les listes `a2` et `b2`.
 - si une des deux listes est vide c'est la plus courte
 - si les deux listes sont vides elles sont égales

Par exemple : si on veut comparer les longueurs des deux listes `c(1 1 1)` et `c(1 1 1 1)` :
| appel      | paramètres                 | cas                     | décision      | valeurs                           |
|------------|----------------------------|-------------------------|---------------|-----------------------------------|
| premier    | `c(1 1 1)` et `c(1 1 1 1)` | aucune liste n'est vide | rappeler `gt` | `c(1 1)` et `c(1 1 1)`            |
| deuxième   | `c(1 1)` et `c(1 1 1)`     | aucune liste n'est vide | rappeler `gt` | `c(1)` et `c(1 1)`                |
| troisième  | `c(1)` et `c(1 1)`         | aucune liste n'est vide | rappeler `gt` | `c()` et `c(1)`                   |
| quatrième  | `c()`et `c(1)`             | deuxième liste est vide | résultat      | la première liste est plus longue |


<pre class="ascii h-100 my-5">
        premier appel
            +
            | deuxième appel
            |   +
            |   | troisième appel
            |   |   +
            v   v   v  quatrième appel : liste a est vide
          +-----------+  |
liste a   | 1 | 1 | 1 |  x
          +-----------+  |
              |   |   |  |
              v   v   |  v
          +-----------+---+
liste b   | 1 | 1 | 1 | 1 |
          +-----------+---+
</pre>

Nous allons d'abord définir les deux valeurs suivantes

```hey
def vrai 1
def faux 2

c(vrai faux)
```
Dans la suite nous considérerons qu'un résultat égal à `1` est vrai et `2` est faux.

La fonction `gt` renverra `1` (vrai) si la première liste est plus longue, `2` sinon.

Pour construire `gt` Nous devons savoir dans quel cas nous sommes, et pour cela tester si une liste est vide.
La fonction `est-vide` renvoie `2` si la liste est vide :

```hey
def vrai 1
def faux 2

def est-non-vide fun(liste) liste(1 2)

est-non-vide(c(vrai vrai vrai))
```

Nous avons déjà construit une fonction `and` qui renvoie `1` si ses deux paramètres sont égaux à `1`.
On peut donc tester le cas où une des deux listes sont vides :

```hey
def vrai 1
def faux 2

def est-non-vide fun(liste) liste(1 faux)

def and fun(a b) c(a b)(b)

def deux-non-vides fun(liste-1 liste-2)
  and(est-non-vide(liste-1) est-non-vide(liste-2))

deux-non-vides(c(vrai vrai) c(vrai))
```

Si aucune liste n'est vide il faut rappeler `gt` avec deux listes plus courtes.
On va s'aider de la fonction `tail` qui renvoie les éléments d'une liste en ôtant le premier :

```hey
def vrai 1
def faux 2

def tail fun(liste) s(liste 2)

tail(c(vrai vrai vrai vrai))
```

Si une liste est vide le résultat est trouvé : si la premère liste contient 1 élément au moins
elle est plus longue que la seconde, sinon elle n'est pas plus longue.
Nous allons nous aider de la fonction `head` qui renvoie le premier élément s'il existe, `2` sinon :

```hey
def vrai 1
def faux 2

def head fun(liste) liste(1 faux)

head(c())
```

Nous pouvons maintenant construire notre récursion de la façon suivante, en s'appuyant sur la fonction
`if` construite plus haut.

```hey
def vrai 1
def faux 2

def est-non-vide fun(liste) liste(1 faux)

def and fun(a b) c(a b)(b)

def deux-non-vides fun(liste-1 liste-2)
  and(est-non-vide(liste-1) est-non-vide(liste-2))

def if fun(p f-1 f-2) c(f-1 f-2)(p)()

def tail fun(liste) s(liste 2)

def head fun(liste) liste(1 faux)

def gt fun(liste-1 liste-2)
  def resultat fun() head(liste-1)
  def recursion fun() gt(tail(liste-1) tail(liste-2))
  def cas-1 deux-non-vides(liste-1 liste-2)
  if(cas-1 recursion resultat)
  
gt(c(vrai vrai vrai) c(vrai vrai vrai vrai))
```

Nous avons appliqué littéralement l'énoncé donné plus haut :
dans le cas 1, c'est à dire quand les deux listes ne sont pas vides, on rapelle `gt` avec les deux listes plus courtes.
dans l'autre cas on produit le résultat.

```hey
def est-pair fun(l)
  def est-non-vide l(1 2)
  def recursion fun() est-impair(s(l 2))
  def resultat fun() 1
  c(recursion resultat)(est-non-vide)()
  
def est-impair fun(l)
  def est-non-vide l(1 2)
  def recursion fun() est-pair(s(l 2))
  def resultat fun() 2
  c(recursion resultat)(est-non-vide)()
  
est-pair(c(1 1 1))
```