# Fonctions récursives

 - [Introduction](#introduction)
 - [Premier exemple : `mul-2`](#premier-exemple--mul-2)
 - [Deuxième exemple : `gt`](#deuxième-exemple--gt)
 - [Exercice : `is-1*2`](#exercice--is-12)
 - [Exercice : `paire?` / `impaire?`](#exercice--paire--impaire)
 - [Exercice : `head-1*2` / `tail-1*2`](#exercice--head-12--tail-12)
 - [Exercice : `while`](#exercice--while)

#### Introduction

Une fonction peut s'appeler elle-même. Cela s'appelle la récursion.

Dans la suite nous considérerons qu'un résultat égal à `1` est vrai et `2` est faux.
Définissons les deux valeurs suivantes, par commodité

Dans ce chapitre, nous allons systématiquement recourir aux fonctions `tail` et `if`
déjà construites au chapitre précédent:
  - tail renvoie les éléments d'une liste en ôtant le premier
  - if renvoie le résultat la fonction `si-vrai` si le paramètre `predicat` vaut `1`
  sinon renvoie le résultat de la fonction `si-faux`

```hey
def vrai 1
def faux 2

def tail fun(liste) s(liste 2)

def if fun(predicat f-si-vrai f-si-faux)
  c(f-si-vrai f-si-faux)(predicat)()

c(vrai faux tail if)
```

Nous allons dans les exemples et exercices qui suivent travailler avec des listes de la forme :
 - `c(2)`
 - `c(1 2)`
 - `c(1 1 2)`
 - `c(1 1 1 2)`
 - ...

Nous les appelerons les listes 1\*2.

#### Premier exemple : `mul-2`
La fonction récursive `mul-2` reçoit en paramètre une liste 1\*2
et renvoie une autre liste 1\*2 avec le double de nombres `1`.
<pre>
 c(2)     ->  c(2)
 c(1 2)   ->  c(1 1 2)
 c(1 1 2) ->  c(1 1 1 1 2)
 - ...
</pre>

Voici comment fonctionne `mul-2`, elle reçoit une liste `l` en paramètre :
 - cas 1 : la liste est égale à `c(2)` : elle renvoie `c(2)`
 - cas 2 : elle n'est pas égale à `c(2)` :
   - construit la liste `l-prime` égale à `tail(l)`
   - renvoie la liste `c(1 1 mul-2(l-prime))`

Le premier cas produit le résultat et le second entraine la récursion.

Par exemple : on multiplie la liste `c(1 1 2)` :
| appel     | paramètre  | cas                    | décision         | récursion et résultat          |
|-----------|------------|------------------------|------------------|--------------------------------|
| premier   | `c(1 1 2)` | l différente de `C(2)` | rappeler `mul-2` | `c(1 1 mul-2(c(1 2)))`         |
| deuxième  | `c(1 2)`   | l différente de `C(2)` | rappeler `mul-2` | `c(1 1 mul-2(c(2)))`           |
| troisième | `c(2)`     | l égale à `C(2)`       | résultat         | `c(2)`                         |

<pre class="ascii h-100 my-5">
                                    +-------+
     premier appel --->             | 1 | 1 |
         +                          +-------+
         |                             :    +-------+
         | deuxième appel --->         :    | 1 | 1 |
         |   +                         :    +-------+
         |   |                         :        :   +---+
         |   | troisième appel --->    :        :   | 2 |
         |   |   +  liste =  c(2)      :        :   +---+
         v   v   v                     v        v     v
       +-----------+                +-------------------+
liste  | 1 | 1 | 2 |  ------------> | 1 | 1 | 1 | 1 | 2 |
       +-----------+                +-------------------+
</pre>

Par commodité nous appelerons la liste `c(2)` la liste *zero*.
La fonction `zero?` renvoie `2` si la liste est *zero* :

```hey
def vrai 1
def faux 2

def zero? fun(liste) c(faux vrai)(liste(1) faux)

zero? (c(1 1 2))
```
*Note: la fonction zero? renverra aussi 2 (faux) quand le premier élément n'est ni `1` ni `2`*

En s'appuyant sur les fonctions `if` et `tail` nous allons construire la récursion
en suivant exactement l'énoncé donné plus haut :

```hey
def vrai 1
def faux 2

def tail fun(liste) s(liste 2)

def if fun(predicat f-si-vrai f-si-faux)
  c(f-si-vrai f-si-faux)(predicat)()

def zero? fun(liste) c(faux vrai)(liste(1) faux)

def cas-1 fun() c(2)

def cas-2 fun(l)
  def l-prime tail(l)
  c(1 1 mul-2(l-prime))

def mul-2 fun(l) if(
    zero?(l)
    fun() cas-1()
    fun() cas-2(l)
  )

mul-2(c(1 1 2))
```

#### Deuxième exemple : `gt`
La fonction `gt` vérifie si une liste 1\*2 est plus longue qu'une autre.

La fonction `gt` reçoit deux listes, `a` et `b` et renvoie `1` si `a` est plus longue que `b`, `2` sinon.
`gt` se comporte différemment suivant les deux cas :
 - cas 1 : une des deux listes est égale à `c(2)`
   - si c'est le cas de la première (`a`), alors elle n'est pas plus longue que la seconde
   - sinon la première (`a`) est plus longue que la seconde.
 - cas 2 : si aucune liste n'est égale à `c(2)` :
   - construire la liste `a2` égale à `slice(a 2)`, c'est à dire la liste `a` moins son premier élément
   - construire la liste `b2` égale à `slice(b 2)`, c'est à dire la liste `b` moins son premier élément
   - rappeler `gt` avec les listes (raccourcies) `a2` et `b2`

Par exemple : on compare les longueurs des deux listes `c(1 1 1 2)` et `c(1 1 2)` :
| appel     | paramètres `a` et `b`      | cas                       | décision      | récursion ou résultat          |
|-----------|----------------------------|---------------------------|---------------|--------------------------------|
| premier   | `c(1 1 1 2)` et `c(1 1 2)` | aucune liste n'est `C(2)` | rappeler `gt` | `c(1 2)` et `c(1 1 2)`         |
| deuxième  | `c(1 1 2)` et `c(1 2)`     | aucune liste n'est `C(2)` | rappeler `gt` | `c(2)` et `c(1 2)`             |
| troisième | `c(1 2)`et `c(2)`          | deuxième liste est `C(2)` | résultat      | première liste est plus longue |

<pre class="ascii h-100 my-5">
       premier appel
           +
           | deuxième appel
           |   +
           |   | troisième appel
           |   |   +  liste b est c(2) : a est plus longue
           v   v   v
         +---------------+
liste a  | 1 | 1 | 1 | 2 |
         +---------------+
           |   |   |
           v   v   v
         +-----------+
liste b  | 1 | 1 | 2 |
         +-----------+
</pre>

La fonction `gt` renverra `1` (vrai) si la première liste est plus longue, `2` sinon.

Pour construire `gt` nous devons savoir lequel des deux cas décris plus haut s'applique,
et pour cela utiliser la fonction `zero?` construite plus haut.

Nous avons aussi déjà construit une fonction `or` qui renvoie `1` si un de ses deux paramètres est égal à `1`.
On peut donc tester le cas où une des deux listes est *zero* :

```hey
def vrai 1
def faux 2

def or fun(a b) c(a b)(a)

def zero? fun(liste) c(faux vrai)(liste(1) faux)

def une-zero? fun(a b) or(zero?(a) zero?(b))

une-zero?(c(1 2) c(2))
```

Nous pouvons construire la récurtionn en suivant littéralement l'énoncé donné plus haut :

```hey
def vrai 1
def faux 2

def if fun(predicat f-si-vrai f-si-faux)
  c(f-si-vrai f-si-faux)(predicat)()

def tail fun(liste) s(liste 2)

def zero? fun(liste) c(faux vrai)(liste(1) faux)

def not fun(a) c(faux vrai)(a)

def or fun(a b) c(a b)(a)

def une-zero? fun(a b) or(zero?(a) zero?(b))

def cas-1 fun(a) not(zero?(a))

def cas-2 fun(a b)
  def a2 tail(a)
  def b2 tail(b)
  gt(a2 b2)

def gt fun(a b) if (
  une-zero?(a b)
  fun() cas-1(a)
  fun() cas-2(a b)
)

gt(c(1 1 2) c(1 1 1 2))
```

###### Exercice : `is-1*2`
Le but est d'écrire une fonction récursive qui vérifie si une liste est de type 1*2.
Rédige en français les deux cas possibles : celui qui produit un résultat et celui qui entraine la récursion.
*indice : le premier cas contient 2 possibilités de résultat*

```hey
; solution
; * cas 1 : si la liste est *zero* elle est de type 1*2,
;           si le premier élément est différent de 1 elle n'est pas de type 1*2
; * cas 2 : la liste est de type 1*2 si diminuée de son premier élément elle est de type 1*2
```

Ecris la fonction `head-1?` qui reçoit une liste et renvoie `1` (vrai)
si son premier élément est `1`, et qui renvoe `2` sinon
```hey
; solution
def vrai 1
def faux 2

def head-1? fun(liste) c(vrai)(liste(1) faux)

head-1?(c(3 1 2))
```

La fonction `head-1?` renvoie `2` aussi si la liste est *zero*, elle nous permet donc de différencier les deux cas.

Ecris la fonstion récursive `is-1*2?` qui renvoie `1` si la liste est de type 1*2 et `2` dans le cas contraire :
```hey
; solution
def vrai 1
def faux 2

def if fun(predicat f-si-vrai f-si-faux)
  c(f-si-vrai f-si-faux)(predicat)()

def tail fun(liste) s(liste 2)

def not fun(a) c(faux vrai)(a)

def or fun(a b) c(a b)(a)

def head-1? fun(liste) c(vrai)(liste(1) faux)

def zero? fun(liste) c(faux vrai)(liste(1) faux)

def is-1*2? fun(liste) if (
  not(head-1?(liste))
  fun() zero?(liste)
  fun() is-1*2?(tail(liste))
)

is-1*2?(c(1 1 1 3 1 2))
```

###### Exercice : `paire?` / `impaire?`
Dans cet exercice nous allons chercher si une liste 1\*2 contient un nombre pair de `1`.
Par commodité nous dirons qu'une liste 1\*2 est paire si elle contient un nombre pair de `1`
et sinon qu'elle est impaire.

Nous allons construire une double récursion, c'est à dire deux
fonctions qui s'appellent l'une, l'autre : `paire?` et `impaire?`.

Nous allons raisonner ainsi :
  - cas 1 : la liste est *zero*, elle ne contient aucun 1, donc un nombre pair
  - cas 2 : la liste n'est pas *zero*, elle est paire si diminuée de son premier élément elle est impaire.

Complète le programme suivant pour construire la fonction `paire?`
nous supposerons que la fonction `impaire?` existe.

```hey
def vrai 1
def faux 2

def if fun(predicat f-si-vrai f-si-faux)
  c(f-si-vrai f-si-faux)(predicat)()

def tail fun(liste) s(liste 2)

def zero? fun(liste) c(faux vrai)(liste(1) faux)

def paire? fun(liste) if (
  ... ; cas 1 ou cas 2 ?
  ... ; résultat
  fun() impaire?(tail(liste))
)

paire?
```

```hey
; solution
def vrai 1
def faux 2

def if fun(predicat f-si-vrai f-si-faux)
  c(f-si-vrai f-si-faux)(predicat)()

def tail fun(liste) s(liste 2)

def zero? fun(liste) c(faux vrai)(liste(1) faux)

def paire? fun(liste) if (
  zero?(liste)
  fun() vrai
  fun() impaire?(tail(liste))
)

paire?
```

Maintenant nous allons écrire le programme de la fonction `ipmpaire?`:
D'abord rédige en français les deux cas : celui qui produit le résultat et celui qui entraîne la récursion.

```hey
; solution
; * cas 1 : la liste est *zero*, elle ne contient aucun 1,
;           donc pas un nombre impair
; * cas 2 : la liste n'est pas *zero*, elle est impaire si
;           diminuée de son premier élément elle est paire.
```

Maintnant transpose le raisonnement en compétant ce programme :
```hey
def vrai 1
def faux 2

def if fun(predicat f-si-vrai f-si-faux)
  c(f-si-vrai f-si-faux)(predicat)()

def tail fun(liste) s(liste 2)

def zero? fun(liste) c(faux vrai)(liste(1) faux)

def impaire? fun(liste) ...

def paire? fun(liste) if (
  zero?(liste)
  fun() vrai
  fun() impaire?(tail(liste))
)

paire?(c(1 1 1 2))
```

```hey
; solution
def vrai 1
def faux 2

def if fun(predicat f-si-vrai f-si-faux)
  c(f-si-vrai f-si-faux)(predicat)()

def tail fun(liste) s(liste 2)

def zero? fun(liste) c(faux vrai)(liste(1) faux)

def impaire? fun(liste) if (
  zero?(liste)
  fun() faux
  fun() paire?(tail(liste))
)

def paire? fun(liste) if (
  zero?(liste)
  fun() vrai
  fun() impaire?(tail(liste))
)

paire?(c(1 1 1 2))
```

###### Exercice : `head-1\*2` / `tail-1\*2`

Considérons maintenant des listes de la forme `c(1 1 1 2 1 2 1 1 1 1 2 ... 2)`
composées de plusieurs suites 1\*2 concaténées. Nous les apellerons listes UR
(nous verrons pourquoi au chapitre suivant).

Soit le programme suivant :

```hey
def vrai 1
def faux 2

def if fun(predicat f-si-vrai f-si-faux)
  c(f-si-vrai f-si-faux)(predicat)()

def tail fun(liste) s(liste 2)

def zero? fun(liste) c(faux vrai)(liste(1) faux)

def head-1*2 fun(liste) if(
  zero?(liste)
  fun() c(2)
  fun() c(1 head-1*2(tail(liste)))
)

head-1*2(c(1 2 1 1 1 2 1 2))
```

 - Redige en français le fonctionnement de la fonction récursive `head-1*2`
   - Quel résultat produit-elle ?
   - Dans quel cas la récursion est effectuée ?

```hey
; solution
; * cas 1: si la liste est *zero*, la première liste 1*2 de la liste UR
;          est la liste *zero*
; * cas 2: sinon ajoute un `1` au début de la première liste 1*2
;          de la liste UR diminuée de son premier élément
;
; le résultat final est la première liste 1*2 de la liste UR reçue en paramètre
```

  - Ecris maintemant la fonction `tail-1*2` qui supprime la première liste 1\*2
  de la liste (1\*2)\* reçue en paramètre, et renvoie la fin.

<pre>
ex: tail-1*2(c(1 2 1 1 1 2 1 2)) -> c(1 1 1 2 1 2)
</pre>

```hey
; solution
def vrai 1
def faux 2

def if fun(predicat f-si-vrai f-si-faux)
  c(f-si-vrai f-si-faux)(predicat)()

def tail fun(liste) s(liste 2)

def zero? fun(liste) c(faux vrai)(liste(1) faux)

def tail-1*2 fun(liste) if(
  zero?(liste)
  fun() tail(liste)
  fun() tail-1*2(tail(liste))
)

tail-1*2(c(1 2 1 1 1 2 1 2))
```

###### Exercice : `while`

La fonction `while` prend trois paramètres :
  - `test` : une fonction du type `(liste) -> vrai ou faux`
  - `f` : une fonction du type `(liste) -> liste`
  - `args` : une liste initiale
  
La fonction `while` est une fonction récursive dont le fonctionnement est :
  - cas 1: `test(args)` renvoie `faux` : renvoie `args`
  - cas 2: `test(args)` renvoie `vrai` : renvoie `f(args)`
  
Complète le programme suivant sachant que le résultat final est `c(2 1 2 1 2 1 2)`:

```hey
def vrai 1
def faux 2

def if fun(predicat f-si-vrai f-si-faux)
  c(f-si-vrai f-si-faux)(predicat)()
  
def tail fun(liste) s(liste 2)

def zero? fun(liste) c(faux vrai)(liste(1) faux)

def cas-1 fun(args) ...

def cas-2 fun(test f args) ...

def while fun(test f args) if (
    test(args)
    fun() cas-1(args)
    fun() cas-2(args)
)

def test fun(args) zero?(args)

def f fun(args)
  c(args tail(args))
  
while(test f c(1 1 1 2))
```

```hey
; solution
def vrai 1
def faux 2

def if fun(predicat f-si-vrai f-si-faux)
  c(f-si-vrai f-si-faux)(predicat)()
  
def tail fun(liste) s(liste 2)

def zero? fun(liste) c(faux vrai)(liste(1) faux)

def cas-1 fun(args) args

def cas-2 fun(args) while(test f f(args))

def while fun(test f args) if (
    test(args)
    fun() cas-1(args)
    fun() cas-2(args)
)

def test fun(args) zero?(args)

def f fun(args)
  c(tail(args) 1 2)
  
while(test f c(1 1 1 2))
```