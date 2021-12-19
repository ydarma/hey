# HEY!

```hey
def num fun(n) c(1 r(1 n))

def incr fun(a)
  c(a 1)
  
incr(num(3))
```

```hey
def vrai 1
def faux 2

def num fun(n) c(vrai r(vrai n))

def and fun(a b) c(a b)(b)
  
def or fun(a b) c(a b)(a)
  
def not fun(a) c(faux vrai)(a)
    
def ge fun(a b) a(l(b) faux)

def eq fun(a b) and(ge(a b) ge(b a))
  
def ne fun(a b) not(eq(a b))
  
ne(num(11) num(12))
```