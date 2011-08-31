package com.telogical.diff.util;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.lang.StringUtils;

public final class ClassUtils {

   // fast array assignable List
   private static final Class[] assigns;

   /**
    * Constant for the package separator character: <code>&#x2e;</code>.
    */
   public static final char PACKAGE_SEPARATOR_CHAR = '.';

   /**
    * Constant for the package separator String: <code>&#x2e;</code>.
    */
   public static final String PACKAGE_SEPARATOR = String
      .valueOf(PACKAGE_SEPARATOR_CHAR);

   /**
    * Constant for the inner class separator character: <code>$</code>.
    */
   public static final char INNER_CLASS_SEPARATOR_CHAR = '$';

   /**
    * Constant for the inner class separator String: <code>$</code>.
    */
   public static final String INNER_CLASS_SEPARATOR = String
      .valueOf(INNER_CLASS_SEPARATOR_CHAR);

   // initializes assigns for fast assignment searching
   static {

      // create the assigns List
      List assignList = new ArrayList();

      // add all String identifiers for primitive types
      assignList.add(byte.class);
      assignList.add(char.class);
      assignList.add(short.class);
      assignList.add(int.class);
      assignList.add(long.class);
      assignList.add(float.class);
      assignList.add(double.class);

      // set the list to the private lookup variable
      assigns = (Class[])ArrayUtils.convert(assignList.toArray());
   }

   /**
    * The ClassUtils class should not be instantiated.  The methods in the
    * class should be called as static methods.<p>
    *
    * The ClassUtils class has a public constructor to allow tools that create
    * JavaBean instances to use this class.
    */
   public ClassUtils() {

   }

   /**
    * Returns <code>true</code> if the String passed is an actual Class name.<p>
    * 
    * If the object is <code>null</code>, <code>false</code> is returned.<p>
    * 
    * <pre>
    *   ClassUtils.isClass(null)                = false
    *   ClassUtils.isClass("hello")             = false
    *   ClassUtils.isClass("java.lang.Long"))   = true
    * </pre><p>
    * 
    * @param object The object from which the short Class name is derived.
    * 
    * @return String The short Class name without the package name.
    */
   public static boolean isClass(String className) {

      // check for null objects
      if (className == null) {

         // not a classname, return false
         return false;
      }

      // is the String passed an actual Class
      boolean isClass = true;

      try {
         // try to create a Class
         Class.forName(className);
      }
      catch(ClassNotFoundException cnfe) {

         // if an exception is thrown then the String is not a class
         isClass = false;
      }
      catch(Exception e) {

         // do nothing for any other exception
      }

      // if didn't throw an exception then actual class
      return isClass;
   }

   /**
    * Returns <code>true</code> if the Class passed is an inner Class.<p>
    * 
    * If the object is <code>null</code>, <code>false</code> is returned.<p>
    * 
    * <pre>
    *   ClassUtils.isInnerClass(null)                    = false
    *   ClassUtils.isInnerClass("hello")                 = false
    *   ClassUtils.isInnerClass("java.util.Vector$1"))   = true
    * </pre><p>
    * 
    * @param object The object from which the short Class name is derived.
    * 
    * @return String The short Class name without the package name.
    */
   public static boolean isInnerClass(Class cls) {

      // if the Class is null
      if (cls == null) {

         // inner class cannot be determined, return false
         return false;
      }

      // otherwise if the name has an inner class separator, return true
      return (cls.getName().indexOf(INNER_CLASS_SEPARATOR_CHAR) >= 0);
   }

   /**
    * Returns <code>true</code> if the Class passed can be assigned to a variable
    * of the assignment Class.<p>
    * 
    * Unlike the {@link Class#isAssignableFrom(java.lang.Class)} method, this
    * this method takes into account widenings conversions of primitive classes 
    * and <code>null</code>s.  Primitive widenings allow an int to be assigned 
    * to a long, float or double. This method returns the correct result for 
    * these cases.<p>
    * 
    * If the to Class is <code>null</null>, <code>false</code> is returned.  If
    * the Class to check is <code>null</null>, <code>null</code> is returned.<p>
    * 
    * <pre>
    *   ClassUtils.isAssignable(null, null)                          = false
    *   ClassUtils.isAssignable(int.class, long.class)               = true
    *   ClassUtils.isAssignable(short.class, null)                   = false
    *   ClassUtils.isAssignable(short.class, char.class)             = false
    *   ClassUtils.isAssignable(char.class, short.class)             = false
    *   ClassUtils.isAssignable(byte.class, char.class)              = false
    *   ClassUtils.isAssignable(int.class, double.class)             = true
    *   ClassUtils.isAssignable(byte.class, float.class)             = true
    *   ClassUtils.isAssignable(float.class, double.class)           = true
    *   ClassUtils.isAssignable(String.class, Serializable.class)    = true
    * <pre><p>
    * 
    * @param cls The Class to assign.
    * @param toClass The Class to check for assignment to.
    * 
    * @return boolean <code>true</code> if the Class passed can be assigned to 
    * a variable of the assignment Class.
    */
   public static boolean isAssignable(Class cls, Class toClass) {

      // if either Class is null
      if ((cls == null) || (toClass == null)) {

         // assignable cannot be determined, return false
         return false;
      }

      // if the Classes are the same type
      if (cls.equals(toClass)) {

         // it is assignable, return true
         return true;
      }

      // if the class to assign is a primitive Class
      if (cls.isPrimitive()) {

         // if the Class to assign to is not a primitive or we are trying to 
         // assign a boolean or a double Class
         if ((toClass.isPrimitive() == false) || cls.equals(boolean.class)
            || cls.equals(double.class)) {

            // can't assign those combinations, return false
            return false;
         }

         // if char to short or byte to char
         if ((cls.equals(char.class) && toClass.equals(short.class))
            || (cls.equals(byte.class) && toClass.equals(char.class))) {

            // can't assign those combinations, return false
            return false;
         }

         // get the positions of the Classes in the assigns array
         int clsPos = ArrayUtils.indexOf(assigns, cls);
         int assignPos = ArrayUtils.indexOf(assigns, toClass);

         // higher positions should be safe to widen, exceptions for this type
         // of rule have already been handled
         return (assignPos >= clsPos);
      }

      // otherwise it is not a primitive, pass off to java method
      return toClass.isAssignableFrom(cls);
   }

   /**
    * Returns the name of the class for an Object without the package name.<p>
    * 
    * If the object is <code>null</code>, <code>null</code> is returned.<p>
    * 
    * <pre>
    *   ClassUtils.getShortClassName(null)      = null
    *   ClassUtils.getShortClassName("hello")   = "String.class"
    *   ClassUtils.getShortClassName(Long(3))   = "Long.class"
    * </pre><p>
    * 
    * @param object The object from which the short Class name is derived.
    * 
    * @return String The short Class name without the package name.
    */
   public static String getShortClassName(Object object) {

      // check for null objects
      if (object == null) {

         // Class name cannot be determined, return null
         return null;
      }

      // otherwise get the Class of the object and pass off to overloaded method
      return getShortClassName(object.getClass().getName());
   }

   /**
    * Returns the name of the class for the Class without the package name.<p>
    * 
    * If the Class is <code>null</code>, <code>null</code> is returned.<p>
    * 
    * <pre>
    *   ClassUtils.getShortClassName(null)            = null
    *   ClassUtils.getShortClassName(String.class)    = "String"
    *   ClassUtils.getShortClassName(Number.class)    = "Number"
    * </pre><p>
    * 
    * @param object The object from which the short Class name is derived.
    * 
    * @return String The short Class name without the package name.
    */
   public static String getShortClassName(Class cls) {

      // check for null classes
      if (cls == null) {

         // Class name cannot be determined, return null
         return null;
      }

      // get the name of the Class and pass off to overloaded method
      return getShortClassName(cls.getName());
   }

   /**
    * Returns the name of the class for the String Class name without the 
    * package name.<p>
    * 
    * If the String Class name is <code>null</code>, <code>null</code> is 
    * returned.<p>
    * 
    * <pre>
    *   ClassUtils.getShortClassName(null)                  = null
    *   ClassUtils.getShortClassName("hello")               = "String"
    *   ClassUtils.getShortClassName("java.lang.Number")    = "Number"
    * </pre><p>
    * 
    * @param object The object from which the short Class name is derived.
    * 
    * @return String The short Class name without the package name.
    */
   public static String getShortClassName(String className) {

      // if the Class name is null or an empty String
      if (StringUtils.isEmpty(className)) {

         // Class name cannot be determined, return null
         return null;
      }

      // if the String is not a Class then we were passed an object which is 
      // a String
      if (!isClass(className)) {

         // we know it's a String, return short name
         return "String";
      }

      // get the Class name as a character array
      char[] chars = className.toCharArray();
      int lastDot = 0;

      // loop through the characters
      for (int i = 0; i < chars.length; i++) {

         // if the character is a package separator, otherwise inner classes
         if (chars[i] == PACKAGE_SEPARATOR_CHAR) {

            // set the start point to 1 past the last dot
            lastDot = i + 1;
         }
         else if (chars[i] == INNER_CLASS_SEPARATOR_CHAR) {

            // change the inner class separater to a path separator, will show
            // up in the short class name
            chars[i] = PACKAGE_SEPARATOR_CHAR;
         }
      }

      // return the class name from the last do to the end of the name
      return new String(chars, lastDot, chars.length - lastDot);
   }

   /**
    * Returns the name of the package for an Object without the Class name.<p>
    * 
    * If the object is <code>null</code>, <code>null</code> is returned.<p>
    * 
    * <pre>
    *   ClassUtils.getPackageName(null)               = null
    *   ClassUtils.getPackageName((Object)"hello")    = "java.lang"
    *   ClassUtils.getPackageName(Long(3))            = "java.lang"
    * </pre><p>
    * 
    * @param object The object from which the package name is derived.
    * 
    * @return String The package name without the Class name.
    */
   public static String getPackageName(Object object) {

      // check for null objects
      if (object == null) {

         // Class name cannot be determined, return null
         return null;
      }

      // otherwise get the Class of the object and pass off to overloaded method
      return getPackageName(object.getClass().getName());
   }

   /**
    * Returns the name of the package for the Class without the Class name.<p>
    * 
    * If the Class is <code>null</code>, <code>null</code> is returned.<p>
    * 
    * <pre>
    *   ClassUtils.getPackageName(null)            = null
    *   ClassUtils.getPackageName(String.class)    = "java.lang"
    *   ClassUtils.getPackageName(Number.class)    = "java.lang"
    * </pre><p>
    * 
    * @param object The object from which the package name is derived.
    * 
    * @return String The package name without the Class name.
    */
   public static String getPackageName(Class cls) {

      // check for null classes
      if (cls == null) {

         // Class name cannot be determined, return null
         return null;
      }

      // get the name of the Class and pass off to overloaded method
      return getPackageName(cls.getName());
   }

   /**
    * Returns the name of the package for the String Class name without the 
    * Class name.<p>
    * 
    * If the String Class name is <code>null</code>, <code>null</code> is 
    * returned.<p>
    * 
    * <pre>
    *   ClassUtils.getPackageName(null)                  = null
    *   ClassUtils.getPackageName("hello")               = null
    *   ClassUtils.getPackageName("java.lang.Number")    = "java.lang"
    * </pre><p>
    * 
    * @param object The object from which the package name is derived.
    * 
    * @return String The package name without the Class name.
    */
   public static String getPackageName(String className) {

      // if the Class name is null or an empty String
      if (StringUtils.isEmpty(className) || !isClass(className)) {

         // package name cannot be determined, return null
         return null;
      }

      // get the last index of the package separator
      int i = className.lastIndexOf(PACKAGE_SEPARATOR_CHAR);

      // if there is not package separator
      if (i == -1) {

         // there is not package name, return empty String
         return StringUtils.EMPTY;
      }

      // otherwise get the package name, beginning to the last package separator
      return className.substring(0, i);
   }

   /**
    * Returns the name of the package for the String Class name without the 
    * Class name.<p>
    * 
    * If the String Class name is <code>null</code>, <code>null</code> is 
    * returned.<p>
    * 
    * <pre>
    *   ClassUtils.getPackageName(null)                  = null
    *   ClassUtils.getPackageName("hello")               = null
    *   ClassUtils.getPackageName("java.lang.Number")    = "java.lang"
    * </pre><p>
    * 
    * @param object The object from which the package name is derived.
    * 
    * @return String The package name without the Class name.
    */
   public static Class[] getAllSuperclasses(Class cls) {

      if (cls == null) {

         return null;
      }

      List clsList = new ArrayList();
      Class superclass = cls.getSuperclass();

      while (superclass != null) {

         clsList.add(superclass);
         superclass = superclass.getSuperclass();
      }

      Object[] clsObjs = clsList.toArray();
      Class[] classes = (Class[])ArrayUtils.convert(clsObjs, Class.class);

      return classes;
   }

   public static Class[] getAllInterfaces(Class cls) {

      if (cls == null) {

         return null;
      }

      List clsList = new ArrayList();

      while (cls != null) {

         Class[] interfaces = cls.getInterfaces();

         for (int i = 0; i < interfaces.length; i++) {

            if (clsList.contains(interfaces[i]) == false) {

               clsList.add(interfaces[i]);
            }

            Class[] superInterfaces = getAllInterfaces(interfaces[i]);

            for (int k = 0; k < superInterfaces.length; k++) {

               Class intface = superInterfaces[k];

               if (clsList.contains(intface) == false) {

                  clsList.add(intface);
               }
            }
         }

         cls = cls.getSuperclass();
      }

      Object[] clsObjs = clsList.toArray();
      Class[] classes = (Class[])ArrayUtils.convert(clsObjs, Class.class);

      return classes;
   }

   public static Class[] getAllTypes(Class cls) {

      Class[] classes = getAllSuperclasses(cls);
      Class[] interfaces = getAllInterfaces(cls);

      List typeList = new ArrayList();
      typeList.addAll(Arrays.asList(classes));
      typeList.addAll(Arrays.asList(interfaces));

      Object[] typeObjs = typeList.toArray();

      return (Class[])ArrayUtils.convert(typeObjs, Class.class);
   }

   public static Class[] toClasses(String[] classNames)
      throws ClassNotFoundException {

      if (ArrayUtils.isEmpty(classNames)) {
         return null;
      }

      Class[] classes = new Class[classNames.length];
      for (int i = 0; i < classes.length; i++) {

         String curName = classNames[i];
         classes[i] = (curName != null) ? Class.forName(curName) : null;
      }

      return classes;
   }

   public static Method[] getMethods(Object object) {

      if (object == null) {
         return null;
      }

      Class objCls = object.getClass();
      return objCls.getMethods();
   }

   public static String[] toClassNames(Class[] classes) {

      if (ArrayUtils.isEmpty(classes)) {
         return null;
      }

      String[] names = new String[classes.length];
      for (int i = 0; i < classes.length; i++) {

         Class curClass = classes[i];
         names[i] = (curClass != null) ? curClass.getName() : null;
      }

      return names;
   }
}