Intro
---
Simulating the simple db operations. The implementation is kinda based on __Event Sourcing__ pattern. Data structure used is __LinkedList__ as an __stack__. Performance for GET query might not be best (_O(n)_) with this implementation, but other operational are O(1) and puts more effort on understandability, flexibility and rapid prototyping.

Compiling the program
---
* CD to project directory and create bin folder
* compile the src into bin directory

``` javac -d bin src/**/*.java ``` *assuming java 8 installed.

Executing the program 
---

```java -cp bin/ com.thumb.bhochhi.Main ``` _Using REPL_ or
```java -cp bin/ com.thumb.bhochhi.Main input.txt``` _Using input file_

or using executable jar

```jar cvfe simple-db.jar com.thumb.bhochhi.Main  -C bin/ com```
then
```java -jar simple-db.jar``` or
```java -jar simple-db.jar input.txt```

######NB: Eclipse IDE used for tests and implementation 
