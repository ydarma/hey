# HEY!

```hey
def num fun(n) c(1 r(1 n))

def incr fun(a)
  c(a 1)
  
incr(num(3))
```

```hey
def true 1
def false 2

def num fun(n) c(true r(true n))

def and fun(a b) c(a b)(b)
  
def or fun(a b) c(a b)(a)
  
def not fun(a) c(false true)(a)
    
def ge fun(a b) a(l(b) false)

def le fun(a b) b(l(a) false)

def gt fun(a b) ge(b a)

def lt fun(a b) le(b a)

def eq fun(a b) and(ge(a b) ge(b a))
  
def ne fun(a b) not(eq(a b))
  
def odd fun(a) r(c(2 1) l(a))(l(a))

def even fun(a) not(odd(a))

def if fun(pred if-true if-false) 
  c(if-true if-false)(pred)()
  
def odd-even fun(a)
  if(odd(a) fun() "odd" fun() "even")
  
c(
  odd-even(num(128))
  odd-even(num(131))
)
```