# Language documentation

List of builtin functions and keywords

| data construction | data transformation | keywords    | sequences            | shapes                  |
|-------------------|---------------------|-------------|----------------------|-------------------------|
| [c](#concat)      | map                 | [def](#def) | [ada-lovelace](#ada) | circle                  |
| [concat](#concat) | reduce              | [fun](#fun) | fibonacci            | rectangle               |
| [r](#repeat)      | rotate              |             | geom                 | [square](#square)       |
| [repeat](#repeat) | translate           |             | [range](#range)      | triangle                |
| [s](#slice)       |                     |             |                      | wedge                   |
| [slice](#slice)   |                     |             |                      |                         |


Functions and keywords reference :

 - <a name="ada"></a> `ada-lovelace(n)` : returns the n first bernouilli numbers as fractions.
```hey
ada-lovelace(7)
```

 - <a name="concat"></a> `concat(data...)` | `c(data...)` : builds data built by concatenating and flattening data.
```hey
concat(square c(20 orange) square(20 orange))
```

 - <a name="def"></a> `def identifier prog` : binds a program result to an identifier.
```hey
def green-square(sz) square(sz green)
def size 20
green-square(size)
```

 - <a name="fun"></a> `fun(...param) prog` : declares a funtion that takes params and evaluate a program.
```hey
def green-square(sz) square(sz green)
def size 20
green-square(size)
```

 - <a name="range"></a> `range(count start step?)` : builds a sequence of count numbers which first element is the given start number.
   Optionally skips numbers by the given step.
```hey
range(10 2 2)
```

 - <a name="repeat"></a> `repeat(data count)` : builds data by repeating given data until it reaches count.
```hey
repeat(c(blue 3 green) 8)
```

 - <a name="slice"></a> `slice(data start end)` : builds data by slicing data between start and end positions.
   If given positions are negative, effective position are computed from the end of the data.
```hey
slice(ada-lovelace(15) 4 -2)
```

 - <a name="square"></a> `square(size color)` : draws a square with given size and color.
 ```hey
 square(20 purple)
 ```