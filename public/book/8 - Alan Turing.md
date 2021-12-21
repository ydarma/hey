# Alan Turing

Nous avons étudié les instructions suivantes du langage `hey!`
  - `concat`
  - `slice`
  - `def`
  - `fun`
  - `(...)` (appel d'une fonction ou récupération d'un élément d'une liste)

A patir de là nous avons construit :
  - Les opérateurs logiques :
    - `and` cf. chapitre 6
    - `or` cf. chapitre 6
    - `not` cf. chapitre 6

  - Les opérations sur les listes 1\*2 :
    - `incr` cf. chapitre 6
    - `gt`  cf. chapitre 7
    - `le` (`le(a b)` = `not(gt(a b))`)
    - `lt` (`lt(a b)` = `gt(b a))`)
    - `ge` (`ge(a b)` = `le(b a))`)
    - `eg` (`eq(a b)` = `and(ge(a b) le(a b))`

  - Les opérations sur les listes UR :
    - `ur-head`
    - `ur-tail`

  - Les opération de flux :
    - `if`
    - `while`
    
Grâce aux 5 instructions de base nous avons un langage qui est complet.