Compiling the program
---
* CD to project directory and create bin folder
* compile the src into bin directory

``` javac -d bin src/**/*.java ```

Executing the program
---
```java -cp bin/ com.thumb.bhochhi.Main input.txt``` 

or using executable jar

```jar cvfe simple-db.jar com.thumb.bhochhi.Main  -C bin/ com```
then
```java -jar simple-db.jar input.txt```
