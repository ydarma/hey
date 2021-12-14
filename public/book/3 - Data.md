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
