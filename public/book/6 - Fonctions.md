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

  *Note : rappelle-toi bien de cette fonction elle te sera utile plus loin*

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

 - Dans un chapitre précédent [Listes](/?title=4+-+Listes#compare-l) nous avons résolu un exercice
qui produisait `1` ou `2` selon que la première liste était plus longue ou plus courte que la seconde.
```hey
c(1 1 1 1 1 1 1 1 1)(l(c(1 1 1 1 1 1 1 1 1 1)) 2)
```
Inspire-toi de cet exercice pour construire la fonction `ge` qui produit le même résultat pour deux listes passées en paramètre

```hey
def n fun(a) r(1 a)
def ge fun... ; complète !

ge(n(9) n(10))
```

```hey
; solution
def n fun(a) r(1 a)
def ge fun(a b) a(l(b) 2)

ge(n(9) n(10))
```


Les fonctions sont des valeurs, au même titre qu'un nombre, un texte ou une liste.
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