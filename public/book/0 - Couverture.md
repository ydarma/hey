# HEY!

```hey
def num fun(n) c(1 r(1 n))

def incr fun(a)
  c(a 1)
  
incr(num(3))
```

```hey
def num fun(n) c(1 r(1 n))

def eq fun(a b)
 def f fun(a b) a(l(b) 2)
 def z c(f(a b) f(b a))
 def y c(r(2 z(1)) r(2 z(2)))
 y(3 1)
 
c(
  eq(num(0) num(0))
  eq(num(0) num(1))
  eq(num(1) num(0))
  eq(num(1) num(1))
)
```