# Définir et nommer

Jusqu'à présent nous avons construit et produit des données en même temps.

En effet :
```hey
c("Résultat")
```

La même ligne fabrique la donnée et le renvoie le résultat du programme.

On peut séparer la construction des données de la production du résultat :

```hey
def result c("Résultat")
result
```

Définir permet d'abord de nommer les données, ce qui rend le programme plus lisible.

```hey
def taille 165
def cheveux "blancs"
def age 66
def Jeanne c(taille cheveux age)
Jeanne
```

Ceci est plus expressif que

```hey
c(175 "blancs" 66)
```

###### Exercice
Décris un de tes amis. Sois créatif, ajoute le plus d'information possible
```hey
; solution
def taille 175
def cheveux "chatains"
def coupe-cheveux "longs"
def yeux "bleus"
def age 50
def couleur-preferee "vert"
def barbe "oui"
def metier "informaticien"
def Yves c(taille cheveux coupe-cheveux yeux age barbe metier couleur-preferee)
Yves
```

Définir permet aussi de réutiliser des données

```hey
def couleur-bord c("rose" "jaune" "vert" "rouge")
def couleur-centre c("bleu" "noir" "marron" "gris")
def bande-coloree c(couleur-bord couleur-centre couleur-bord)
bande-coloree
```
