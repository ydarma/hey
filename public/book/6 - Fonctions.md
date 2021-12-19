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

  - Ecrire une fonction `n` qui produit une liste uniquement composée par des `1`
 et dont le nombre d'élément est passé en paramètre :

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
Complète la fonction `ge` pour qu'elle produise le même résultat pour deux listes passées en paramètre

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

Les fonctions peuvent être récursives