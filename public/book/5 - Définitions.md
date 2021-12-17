# Définir et nommer

Jusqu'à présent nous avons construit et produit des données en même temps.

```hey
c("Résultat")
```

Ci-dessus, la même ligne fabrique la donnée et le renvoie le résultat du programme.

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
def couleur-préférée "vert"
def barbe "oui"
def metier "informaticien"
def plat-préféré "pâtes napolitaines"
def Yves c(taille cheveux coupe-cheveux yeux age barbe metier couleur-préférée plat-préféré)
Yves
```

Il n'est pas possible de redéfinir quelque chose qui a déjà été défini, ceci donne une erreur :

```hey
def taille 169
def yeux "verts"
def Théo c("Théo" taille yeux)
def taille 165
def yeux "bleus"
def Antony c("Antony" taille yeux)
c(Théo Antony)
```

Une définition donne un nom au résultat d'un programme.
Celui-ci peut être plus élaboré qu'une simple valeur,
il peut être composé de plusieurs définitions suivies d'un résultat :

```hey
def Théo
  def taille 169
  def yeux "verts"
  c("Théo" taille yeux)

Théo
```

Le programme ci-dessus affecte à `Théo` le résultat d'un sous-programme qui produit la valeur `c(169 "verts")`.
Pour ce faire il utilise deux définitions locales : `taille` et `yeux` ; celles-ci n'existent pas en dehors du sous-programme.
Elles peuvent donc être réutilisées dans deux sous-programmes différents.

```hey
def Théo
  def taille 169
  def yeux "verts"
  c("Théo" taille yeux)


def Antony
  def taille 165
  def yeux "bleus"
  c("Antony" taille yeux)

c(Théo Antony)
```

###### Exercice
En reprenant la méthode ci-dessus, construis trois définitions :
 - `Allemagne` (superficie = 357 386 km², population = 83 149 300, capitale = Berlin)
 - `Espagne` (superficie = 505 911 km², population = 46 934 632, capitale = Madrid)
 - `France` (superficie = 672 051, population = 68 014 000, capitale=Paris)
 
```hey
; solution
def Allemagne
  def superficie 357386
  def population 83149300
  def capitale "Berlin"
  c("Allemagne" superficie population capitale)

def Espagne
  def superficie 505911
  def population 46934632
  def capitale "Madrid"
  c("Espagne" superficie population capitale)

def France
  def superficie 672051
  def population 68014000
  def capitale "Paris"
  c("France" superficie population capitale)

c(Allemagne Espagne France)
```

Ici encore, réutiliser le même nom n'est pas gênant car les contextes sont différents :

```hey
def prénom 1
def taille 2
def yeux 3

def Théo
  def taille 169
  def yeux "verts"
  c("Théo" taille yeux)
  
Théo(taille)
```

Dans le programme ci-dessus, le définition `taille` sert :
 - dans le sous-programme à construire la donnée affectée à `Théo`
 - dans le programme global à retrouver la valeur correspondante

Bien définir et nommer les données revêt une importance capitale.
Cela permet de construire des abstractions qui rendent les programmes lisibles 
et qui permettent de les réutiliser.
