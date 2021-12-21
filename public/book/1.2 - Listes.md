# Listes
Une liste est une suite de données. Les fonctions `concat` et `c` construisent une liste.

```hey
concat("Le parrain" "film" 1972)
```

`concat` / `c` assemblent les listes qui lui sont données.
Ceci est une liste qui contient 6 valeurs numériques :
```hey
c(c(1 2 3) c(4 5 6))
```
Ce qui est équivalent à :
```hey
c(1 2 3 4 5 6)
```

Pour extraire un élément d'une liste, on utilise son index entre parenthèses.
```hey
c(1 2 3 4 5 6)(3)
```
*Note: l'index commence à 1, `liste(1)` est le premier élément de la liste.*

On peut, en plus de l'index passer une valeur par défaut qui est produite si l'index n'est pas dans la liste.
```hey
c(1 2 3 4 5 6)(8 88)
```

###### Exercices
 - Constrtuire la liste suivante
   - Les
   - 40 (numérique)
   - voleurs

```hey
;solution
c("Les" 40 "voleurs")
```

 - Extraire de la liste précédente la seconde valeur

```hey
;solution
c("Les" 40 "voleurs")(2)
```

 - Quel est le résultat de `c(1 c(2 4) c(8 16))(3)` ?

```hey
; solution
c(1 c(2 4) c(8 16))(3)
```

- Le programme suivant définit `a` et `b` qui peuvent valoir soit `1` soit `2`
Compléter le programme suivant pour qu'il produise :
  - `1` si `a` et `b` valent `1`
  - `2` si `a` ou `b` vaut `2`

```hey
def a ... ; 1 ou 2
def b ... ; 1 ou 2

c(? ?)(?) ; 1 si a ET b = 1
```
```hey
; solution
def a 1 ; 1 ou 2
def b 2 ; 1 ou 2

c(a b)(b) ; 1 si a ET b = 1
```

- Même énoncé qu'à l'exercice précédent mais on veut produire :
  - `1` si `a` ou `b` vaut `1`
  - `2` si `a` et `b` valent `2`

```hey
; solution
def a 1 ; 1 ou 2
def b 2 ; 1 ou 2

c(a b)(a) ; 1 si a OU b = 1
```

## Autres méthodes de construction

Les fonctions `repeat` et `r` permettent de construire une liste en répétant les valeurs d'une autre. 
Le deuxième argument est la taille de la liste résultante :

```hey
repeat(c("rouge" "bleu" "vert") 7)
```

```hey
r(r(c("rouge" "bleu" "vert") 4) 9)
```

Les fonctions `slice` et `s` permettent de construire une liste par extraction d'une partie d'une autre liste.
Les troisième et quatrième arguments donnent les position de départ et d'arrêt de l'extraction.

```hey
slice(c("rouge" "bleu" "vert" "jaune" "marron") 2 4)
```

###### Exercices
 - A partir de la liste `c(1 2 1 2)`, construire la liste `c(2 1 2 1 2)`
```hey
; solution
s(r(c(1 2 1 2) 6) 2 6)
```
 - A pertir de la même liste  `c(1 2 1 2)` construire la liste `c(1 2 1 1 2)`
```hey
; solution
r(s(c(1 2 1 2) 1 3) 5)
```