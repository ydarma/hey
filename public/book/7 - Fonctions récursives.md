# Fonctions récursives

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
def vrai 1
def faux 2

def est-non-vide fun(liste) liste(1 faux)
def if fun(predicat f-1 f-2) c(f-1 f-2)(predicat)()
def tail fun(liste) s(liste 2)

def est-pair fun(liste) if (
  est-non-vide(liste)
  fun() est-impair(tail(liste))
  fun() 1
)
  
def est-impair fun(liste) if (
  est-non-vide(liste)
  fun() est-pair(tail(liste))
  fun() 2
)
  
est-pair(c(1 1 1))
```