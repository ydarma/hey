# Fonctions récursives

Une fonction peut s'appeler elle-même. Cela s'appelle la récursion.

Nous allons dans les exemples et exercices qui suivent travailler avec des listes de la forme :
 - `c(2)`
 - `c(1 1 2)`
 - `c(1 1 1 2)`
 - `c(1 1 1 1 2)`
 - `c(1 1 1 1 1 2)`
 - ...

Nous les appelerons les listes 1\*2.

Nous pouvons par exemple chercher si une liste 1\*2 est plus longue qu'une autre.

La fonction `gt` reçoit deux listes, `a` et `b` et renvoie `1` si `a` est plus longue que `b`, `2` sinon.
`gt` se comporte différemment suivant les deux cas :
 - cas 1 : une des deux listes est égale à `c(2)` 
   - si c'est le cas de la première (`a`), alors elle n'est pas plus longue que la seconde
   - sinon la première (`a`) est plus longue que la seconde. 
 - cas 2 : si aucune liste n'est égale à `c(2)` :
   - construire la liste `a2` égale à `slice(a 2)`, c'est à dire la liste `a` moins son premier élément
   - construire la liste `b2` égale à `slice(b 2)`, c'est à dire la liste `b` moins son premier élément
   - rappeler `gt` avec les listes (raccourcies) `a2` et `b2`
   
Le premier cas produit le résultat et le second entraine la récursion.

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
liste a   | 1 | 1 | 1 | 2 |
          +---------------+
            |   |   |
            v   v   v
          +-----------+
liste b   | 1 | 1 | 2 |
          +-----------+
</pre>

Dans la suite nous considérerons qu'un résultat égal à `1` est vrai et `2` est faux.
Définissons les deux valeurs suivantes, par commodité

```hey
def vrai 1
def faux 2

c(vrai faux)
```

La fonction `gt` renverra `1` (vrai) si la première liste est plus longue, `2` sinon.

Pour construire `gt` nous devons savoir lequel des deux cas décris plus haut s'applique,
et pour cela tester si une liste est égale à `c(2)`.
Par commodité nous appelerons la liste `c(2)` la liste *zero*.
La fonction `zero?` renvoie `2` si la liste est *zero* :

```hey
def vrai 1
def faux 2

def zero? fun(liste) c(faux vrai)(liste(1) faux)

zero? (c(1 1 2))
```
*Note: la fonction zero? renverra aussi 2 (faux) pour les valeurs quand le premier élément n'est ni `1` ni `2`*

Nous avons aussi déjà construit une fonction `or` qui renvoie `1` si un de ses deux paramètres est égal à `1`.
On peut donc tester le cas où une des deux listes est *zero* :

```hey
def vrai 1
def faux 2

def or fun(a b) c(a b)(a)

def zero? fun(liste) c(faux vrai)(liste(1) faux)

def une-zero? fun(liste-1 liste-2)
  or(zero?(liste-1) zero?(liste-2))

une-zero?(c(1 2) c(2))
```

Si aucune liste n'est *zero* il faut rappeler `gt` avec deux listes plus courtes.
On va s'aider de la fonction `tail` qui renvoie les éléments d'une liste en ôtant le premier :

```hey
def tail fun(liste) s(liste 2)

tail(c(1 1 1 2))
```

Si une liste est *zero* le résultat est trouvé : si la premère liste n'est pas *zero*
elle est plus longue que la seconde, sinon elle est plus longue.

Nous pouvons maintenant construire notre récursion de la façon suivante, en s'appuyant sur la fonction
`if` construite plus haut :

```hey
def vrai 1
def faux 2

def not fun(a) c(faux vrai)(a)

def or fun(a b) c(a b)(a)

def if fun(predicat f-si-vrai f-si-faux)
  c(f-si-vrai f-si-faux)(predicat)()

def tail fun(liste) s(liste 2)

def zero? fun(liste) c(faux vrai)(liste(1) faux)

def une-zero? fun(liste-1 liste-2)
  or(zero?(liste-1) zero?(liste-2))

def gt fun(liste-1 liste-2) if (
  une-zero?(liste-1 liste-2)
  fun() not(zero?(liste-1))
  fun() gt(tail(liste-1) tail(liste-2))
)
  
gt(c(1 1 2) c(1 1 1 2))
```

Nous avons appliqué littéralement l'énoncé :
si une des deux liste est *zero* la première est la plus longue si elle n'est pas *zero* (car alors c'est forcément le cas de la seconde) ;
dans le cas contraire il faut comparer les listes diminuées de leur premier élément.

###### Exercice
Le but est d'écrire une fonction récursive qui vérifie si une liste est de type 1*2.
Rédige en français les deux cas possibles : celui qui produit un résultat et celui qui entraine la récursion.
*indice : le premier cas contient 2 possibilités de résultat*

```hey
; solution
; * cas 1 : si la liste est *zero* elle est de type 1*2,
;           si le premier élément est différent de 1 elle n'est pas de type 1*2
; * cas 2 : la liste est de type 1*2 si diminuée de son premier élément elle est de type 1*2
```

Ecris la fonction `l1?` qui reçoit une liste et renvoie `1` (vrai)
si son premier élément est `1`, et qui renvoe `2` sinon
```hey
; solution
def vrai 1
def faux 2

def l1? fun(liste) c(vrai)(liste(1) faux)

l1?(c(3 1 2))
```

La fonction `l1?` renvoie `2` aussi si la liste est *zero*, elle nous permet donc de différencier les deux cas.

Ecris la fonstion `l1*2?` correspondante :
```hey
; solution
def vrai 1
def faux 2

def not fun(a) c(faux vrai)(a)

def or fun(a b) c(a b)(a)

def l1? fun(liste) c(vrai)(liste(1) faux)

def zero? fun(liste) c(faux vrai)(liste(1) faux)

def if fun(predicat f-si-vrai f-si-faux)
  c(f-si-vrai f-si-faux)(predicat)()

def tail fun(liste) s(liste 2)

def l1*2? fun(liste) if (
  not(l1?(liste))
  fun() zero?(liste)
  fun() l1*2?(tail(liste))
)

l1*2?(c(1 1 1 3 1 2))
```

###### Exercice
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

def zero? fun(liste) c(faux vrai)(liste(1) faux)

def if fun(predicat f-si-vrai f-si-faux)
  c(f-si-vrai f-si-faux)(predicat)()

def tail fun(liste) s(liste 2)

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

def zero? fun(liste) c(faux vrai)(liste(1) faux)

def if fun(predicat f-si-vrai f-si-faux)
  c(f-si-vrai f-si-faux)(predicat)()

def tail fun(liste) s(liste 2)

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

def zero? fun(liste) c(faux vrai)(liste(1) faux)

def if fun(predicat f-si-vrai f-si-faux)
  c(f-si-vrai f-si-faux)(predicat)()

def tail fun(liste) s(liste 2)

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

def zero? fun(liste) c(faux vrai)(liste(1) faux)

def if fun(predicat f-si-vrai f-si-faux)
  c(f-si-vrai f-si-faux)(predicat)()

def tail fun(liste) s(liste 2)

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

###### Exercice

Considérons maintenant des listes de la forme `c(1 1 1 2 1 2 1 1 1 1 2 ... 2)`
composées de plusieurs suites 1\*2 concaténées. Nous les apellerons (1\*2)\*.

 - Redige en français le fonctionnement de la fonction récursive `head1*2`
   - Quel résultat produit-elle ?
   - Dans quel cas la récursion est effectuée ?

```hey
def vrai 1
def faux 2

def zero? fun(liste) c(faux vrai)(liste(1) faux)

def if fun(predicat f-si-vrai f-si-faux)
  c(f-si-vrai f-si-faux)(predicat)()
  
def tail fun(liste) s(liste 2)

def head1*2 fun(liste) if(
  zero?(liste)
  fun() c(2)
  fun() c(1 head1*2(tail(liste)))
)
  
head1*2(c(1 2 1 1 1 2 1 2))
```

```hey
; solution
; * cas 1: si la liste est *zero*, la première liste 1*2 de la liste (1*2)*
;          est la liste *zero*
; * cas 2: sinon ajoute un `1` au début de la première liste 1*2
;          de la liste (1*2)* diminuée de son premier élément
;
; le résultat final est la première liste 1*2 de la liste (1*2)* reçue en paramètre
```

*Note : cette récursion ne fonctionne pas comme les précédentes : l'appel récursif 
est effectué AVANT la constitution du résultat*

Ecris maintemant la fonction `tail1*2` qui supprime la première liste 1\*2
de la liste (1\*2)\* reçue en paramètre, et renvoie la fin.

```
ex: tail1*2(c(1 2 1 1 1 2 1 2)) -> c(1 1 1 2 1 2)
```

```hey
; solution
def vrai 1
def faux 2

def zero? fun(liste) c(faux vrai)(liste(1) faux)

def if fun(predicat f-si-vrai f-si-faux)
  c(f-si-vrai f-si-faux)(predicat)()
  
def tail fun(liste) s(liste 2)

def tail1*2 fun(liste) if(
  zero?(liste)
  fun() tail(liste)
  fun() tail1*2(tail(liste))
)
  
tail1*2(c(1 2 1 1 1 2 1 2))
```