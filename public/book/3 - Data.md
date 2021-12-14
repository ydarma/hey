# Données

## Valeurs
Ce sont des données simples :
 - les valeurs textuelles : "pierre qui roule n'amasse pas mousse", entourées de `"`
 - les valeurs numériques : 2022

```hey
"pierre qui roule n'amasse pas mousse"
```

```hey
2022
```

Si une chaîne doit contenir le caractère `"`, celui-ci doit être doublé :

```hey
"entre ""guillemets"""
```

###### Exercice
Produire les valeurs suivantes :
 - 1972 (numérique)
```hey
; solution
1972
```
 - 1972 (texte)
```hey
; solution
"1972"
```
 - "Le parrain" est un film de 1972
```hey
; solution
"""Le parrain"" est un film de 1972"
```

# Listes
Une liste est une suite de données. L'instruction `concat` ou `c` construit une liste.

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

###### Exercices
Constrtuire la liste suivante
 - Les
 - 40 (numérique
 - voleurs

```hey
;solution
c("Les" 40 "voleurs")
```

Extraire de la liste précédente la seconde valeur
```hey
;solution
c("Les" 40 "voleurs")(2)
```

Quel est le résultat de `c(1 c(2 4) c(8 16))(3)` ?
```hey
; solution
c(1 c(2 4) c(8 16))(3)
```