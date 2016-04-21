HOWTO run:

1. CD to project directory and create bin folder
2. compile the src into bin directory
```
javac -d bin src/**/*.java
 
```
3. Create executable jar
```
jar cvfe simple-db.jar com.thumb.bhochhi.Main  -C bin/ com
```
4. Run the simple-db.jar file.
```
java -jar simple-db.jar
```


HOW