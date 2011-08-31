package com.telogical.diff.util;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;

import org.apache.commons.lang.StringUtils;

/**
 * The <code>ArrayUtils</code> class contains static methods that perform null
 * safe operations on arrays.  Methods are generic and can operate on any type
 * of array, primitive or reference.<p>
 *
 * <ul>
 *  <li><b>GetArray</b>
 *      - returns a new array of the Class and length</li>
 *  <li><b>GetArrayClass/GetPrimitiveArrayClass/GetReferenceArrayClass/
 *         GetArrayObjectsClass</b>
 *      - returns the class type of different types of arrays</li>
 *  <li><b>AreSameType</b>
 *      - are the arrays of the same Class</li>
 *  <li><b>AreSameLength</b>
 *      - are the arrays the same length</li>
 *  <li><b>AreEqual/AreEqualNotSame</b>
 *      - are the two arrays equal, equal but not same array</li>
 *  <li><b>IsArray</b>
 *      - is the object an array</li>
 *  <li><b>IsEmpty/IsNotEmpty</b>
 *      - is the array empty or not empty</li>
 *  <li><b>IsPrimitiveArray</b>
 *      - is the array a primitive array</li>
 *  <li><b>IsTypedObjectArray</b>
 *      - is the array a generic created Object array</li>
 *  <li><b>IsReferenceArray</b>
 *      - is the array a reference array</li>
 *  <li><b>isWrapperArray</b>
 *      - is the array a wrapper array</li>
 *  <li><b>isInstance</b>
 *      - can the array be converted to the given Class</li>
 *  <li><b>toPrimitiveArray/ToWrapperArray/toObjectArray/toStringArray</b>
 *      - conver the array to the given type of array</li>
 *  <li><b>create</b>
 *      - create a copy of the array with the given length</li>
 *  <li><b>append</b>
 *      - returns new array with second array appended to the first</li>
 *  <li><b>pad/rightPad/leftPad</b>
 *      - returns a new array with the array padded</li>
 *  <li><b>chop/rightChop/leftChop</b>
 *      - returns a new array with the array chopped</li>
 *  <li><b>insert</b>
 *      - returns a new array with the objects of the second array inserted into
 *        the objects of the first array.</li>
 *  <li><b>replace</b>
 *      - replaces objects of the first array with the objects of the second
 *        array, original array is modified.</li>
 *  <li><b>copyReplace</b>
 *      - returns a new array with the objects of the first array replaced by
 *        the objects of the second array.</li>
 *  <li><b>delete</b>
 *      - returns a new array with the objects deleted.</li>
 *  <li><b>copy</b>
 *      - returns a copy of the part or all of the array.</li>
 *  <li><b>convert</b>
 *      - converts the array to a new Class, a new array is returned.</li>
 *  <li><b>removeNulls</b>
 *      - returns a new array with the null objects removed.</li>
 *  <li><b>reverse</b>
 *      - returns a new array with the array objects in reverse order.</li>
 *  <li><b>contains/containsOnly/containsNone</b>
 *      - returns true if the array contains the object or objects</li>
 *  <li><b>same</b>
 *      - returns a new array with the same object in both arrays</li>
 *  <li><b>different</b>
 *      - returns a new array with the objects not in both arrays</li>
 * </ul><p>
 *
 * @version 1.0
 */
public final class ArrayUtils {

  // fast array type searching lookups map
  private static final HashMap lookups;

  /**
   * Constant for an empty immutable <code>Object</code> array.
   */
  public static final Object[] EMPTY_OBJECT_ARRAY = new Object[0];

  /**
   * Constant for an empty immutable <code>Class</code> array.
   */
  public static final Class[] EMPTY_CLASS_ARRAY = new Class[0];

  /**
   * Constant for an empty immutable <code>String</code> array.
   */
  public static final String[] EMPTY_STRING_ARRAY = new String[0];

  /**
   * Constant for an empty immutable <code>long</code> array.
   */
  public static final long[] EMPTY_LONG_ARRAY = new long[0];

  /**
   * Constant for an empty immutable <code>Long</code> array.
   */
  public static final Long[] EMPTY_LONG_OBJECT_ARRAY = new Long[0];

  /**
   * Constant for an empty immutable <code>int</code> array.
   */
  public static final int[] EMPTY_INT_ARRAY = new int[0];

  /**
   * Constant for an empty immutable <code>Integer</code> array.
   */
  public static final Integer[] EMPTY_INTEGER_OBJECT_ARRAY = new Integer[0];

  /**
   * Constant for an empty immutable <code>short</code> array.
   */
  public static final short[] EMPTY_SHORT_ARRAY = new short[0];

  /**
   * Constant for an empty immutable <code>Short</code> array.
   */
  public static final Short[] EMPTY_SHORT_OBJECT_ARRAY = new Short[0];

  /**
   * Constant for an empty immutable <code>byte</code> array.
   */
  public static final byte[] EMPTY_BYTE_ARRAY = new byte[0];

  /**
   * Constant for an empty immutable <code>Byte</code> array.
   */
  public static final Byte[] EMPTY_BYTE_OBJECT_ARRAY = new Byte[0];

  /**
   * Constant for an empty immutable <code>double</code> array.
   */
  public static final double[] EMPTY_DOUBLE_ARRAY = new double[0];

  /**
   * Constant for an empty immutable <code>Double</code> array.
   */
  public static final Double[] EMPTY_DOUBLE_OBJECT_ARRAY = new Double[0];

  /**
   * Constant for an empty immutable <code>float</code> array.
   */
  public static final float[] EMPTY_FLOAT_ARRAY = new float[0];

  /**
   * Constant for an empty immutable <code>Float</code> array.
   */
  public static final Float[] EMPTY_FLOAT_OBJECT_ARRAY = new Float[0];

  /**
   * Constant for an empty immutable <code>boolean</code> array.
   */
  public static final boolean[] EMPTY_BOOLEAN_ARRAY = new boolean[0];

  /**
   * Constant for an empty immutable <code>Boolean</code> array.
   */
  public static final Boolean[] EMPTY_BOOLEAN_OBJECT_ARRAY = new Boolean[0];

  /**
   * Constant for an empty immutable <code>char</code> array.
   */
  public static final char[] EMPTY_CHAR_ARRAY = new char[0];

  /**
   * Constant for an empty immutable <code>Character</code> array.
   */
  public static final Character[] EMPTY_CHARACTER_OBJECT_ARRAY = new Character[0];

  // initializes lookups for fast array type searching
  static {

    // create the lookup map
    HashMap lookmap = new HashMap();

    // add all String identifiers for primitive type arrays
    lookmap.put("class [B", byte.class);
    lookmap.put("class [S", short.class);
    lookmap.put("class [C", char.class);
    lookmap.put("class [I", int.class);
    lookmap.put("class [Z", boolean.class);
    lookmap.put("class [F", float.class);
    lookmap.put("class [J", long.class);
    lookmap.put("class [D", double.class);

    // set the map to the private lookup variable
    lookups = lookmap;
  }

  /**
   * The ArrayUtils class should not be instantiated.  The methods in the
   * class should be called as static methods.<p>
   *
   * The ArrayUtils class has a public constructor to allow tools that create
   * JavaBean instances to use this class.
   */
  public ArrayUtils() {

  }

  /**
   * Checks if the object passed is a non-null instance of an array.<p>
   *
   * If the object is null, or if the object is not a type of array, then an
   * exception is thrown.<p>
   *
   * <pre>
   *   StringUtils.isEmpty(null)                  = passes
   *   StringUtils.isEmpty("")                    = IllegalArgumentException
   *   StringUtils.isEmpty("xyz")                 = IllegalArgumentException
   *   StringUtils.isEmpty({"1","2"}) = passes
   *   StringUtils.isEmpty(new String[]{})        = passes
   * </pre><p>
   *
   * @param array The Object to check.
   */
  protected static void checkArray(Object array) {

    // check for objects that are not arrays
    if (!isArray(array)) {

      // throw illegal argument exception for objects that are not arrays
      String msg = "Object passed must be an array";
      throw new IllegalArgumentException(msg);
    }
  }

  /**
   * Returns an array of the length passed holding instances of the Class type
   * passed.<p>
   *
   * If the Class type is <code>null</code> then a <code>null</code> object is
   * returned.  If the length is <= 0 then an empty array is returned.<p>
   *
   * <pre>
   *   ArrayUtils.getArray(null, 2)               = null
   *   ArrayUtils.getArray(String.class, 2)       = new String[2]
   *   ArrayUtils.getArray(Object.class, -5)      = new Object[0]
   *   ArrayUtils.getArray(int.class, 0)          = new int[0]
   * </pre><p>
   *
   * @param array The Object to check.
   */
  public static Object getArray(Class type, int length) {

    // check for null Class types
    if (type == null) {

      // return a null Object (no type)
      return null;
    }

    // not null, return a new array of the type and length or empty if the 
    // length is <= 0
    return Array.newInstance(type, (length < 0) ? 0 : length);
  }

  /**
   * Returns the Class of the type of objects that the array passed holds.<p>
   *
   * If the array is <code>null</code> then a <code>null</code> object is
   * returned.  If the Class type of the array cannot be determined then a
   * <code>null</code> is returned.<p>
   *
   * <pre>
   *   ArrayUtils.getArrayClass(null)                = null
   *   ArrayUtils.getArrayClass({"1","2"})           = String.class
   *   ArrayUtils.getArrayClass({1,2})               = int.class
   *   ArrayUtils.getArrayClass(String{})            = String.class
   *   ArrayUtils.getArrayClass(Object{})            = Object.class
   * </pre><p>
   *
   * @param array The Object to check.
   *
   * @return Class The class of the objects the array holds or <code>null</code>
   * if the array object passed is <code>null</code>.
   */
  public static Class getArrayClass(Object array) {

    // check for null objects passed
    if (array == null) {

      // return null class type
      return null;
    }

    // check for objects that are not arrays
    if (!isArray(array)) {

      // throw illegal argument exception
      String msg = "Object passed must be an array";
      throw new IllegalArgumentException(msg);
    }

    // holder for the array Class type
    Class arrayType = null;

    // if the array is a primitive array otherwise a reference array
    if (isPrimitiveArray(array)) {

      // get the primitive array type
      arrayType = getPrimitiveArrayClass(array);
    }
    else if (isReferenceArray(array)) {

      // not primitive, must be reference, get reference array type
      arrayType = getReferenceArrayClass(array);
    }

    // return the array Class type
    return arrayType;
  }

  /**
   * Returns the primitive Class type of the array.<p>
   *
   * If the array is <code>null</code> then a <code>null</code> object is
   * returned.  If the Class type of the array cannot be determined then a
   * <code>null</code> is returned.
   *
   * If the Object passed is not a primitive array then an Exception is thrown.
   * <p>
   *
   * <pre>
   *   ArrayUtils.getPrimitiveArrayClass(null)       = null
   *   ArrayUtils.getPrimitiveArrayClass({"1","2"})  = Exception
   *   ArrayUtils.getPrimitiveArrayClass({1,2})      = int.class
   *   ArrayUtils.getPrimitiveArrayClass(long{})     = long.class
   * </pre><p>
   *
   * @param array The Object to check.
   *
   * @return Class The class of the primitive array or <code>null</code> if
   * the array object passed is <code>null</code>.
   */
  public static Class getPrimitiveArrayClass(Object array) {

    // check for null objects passed
    if (array == null) {

      // return null class type
      return null;
    }

    // checks that the object is a primitive array
    if (!isPrimitiveArray(array)) {

      // not a primitive array, then throw illegal argument
      String message = "Object must be a primitive array type.";
      throw new IllegalArgumentException(message);
    }

    // check each of the array primitive types and return the correct type
    String arIdent = array.getClass().toString();
    Class lookupClass = (Class)lookups.get(arIdent);

    // is the array identifier is in the lookup map
    if (lookupClass != null) {

      // return the class
      return lookupClass;
    }

    // no class type could be determined.  It should never get here.
    return null;
  }

  /**
   * Returns the reference Class type of the array.<p>
   *
   * If the array is <code>null</code> then a <code>null</code> object is
   * returned.  If the Class type of the array cannot be determined then a
   * <code>null</code> is returned.
   *
   * If the Object passed is not a reference array then an Exception is thrown.
   * <p>
   *
   * <pre>
   *   ArrayUtils.getReferenceArrayClass(null)             = null
   *   ArrayUtils.getReferenceArrayClass({"1","2"})        = String.class
   *   ArrayUtils.getReferenceArrayClass({1,2})            = Exception
   *   ArrayUtils.getReferenceArrayClass(Long{Long(8)})    = Long.class
   *   ArrayUtils.getReferenceArrayClass(Object{})         = Object.class
   * </pre><p>
   *
   * @param array The Object to check.
   *
   * @return Class The class of the reference array or <code>null</code> if
   * the array object passed is <code>null</code>.
   */
  public static Class getReferenceArrayClass(Object array) {

    // check for null objects passed
    if (array == null) {

      // return null class type
      return null;
    }

    // checks that the object is a reference array
    if (!isReferenceArray(array)) {

      // not a reference array, then throw illegal argument
      String message = "Object must be a reference array type.";
      throw new IllegalArgumentException(message);
    }

    // get the array class type and the array class identifier
    String cls = array.getClass().toString();
    String arIdent = "class [L";

    // parse the array objects Class type from the array Class string
    int start = StringUtils.indexOf(cls, arIdent) + arIdent.length();
    String outCls = StringUtils.substring(cls, start);
    outCls = StringUtils.substring(outCls, 0, outCls.length() - 1);

    // convert the String to a Class
    try {

      Class refClass = Class.forName(outCls);

      // return the class
      return refClass;
    }
    catch (ClassNotFoundException e) {

      // this should never happen, but just in case it does
      e.printStackTrace();
    }

    // array type cannot be determined
    return null;
  }

  /**
   * Returns the Class of the type of objects that the array passed holds.<p>
   *
   * This is different from the <code>getArrayClass()</code> method in that if
   * the array is a typed Object array then this method attempts to determine
   * the lowest Class type which all objects in the array are instances of. The
   * superclasses of the first non-null object in the array will be searched
   * with first best match is returned.<p>
   *
   * If all objects in the array are not instances of a single Class or all
   * objects in the array are <code>null</code> then a generic Object Class
   * type is returned.<p>
   *
   * If the array is <code>null</code> then a <code>null</code> object is
   * returned.<p>
   *
   * <pre>
   *   ArrayUtils.getArrayObjectsClass(null)                   = null
   *   ArrayUtils.getArrayObjectsClass(Object{"1","2"})  = String.class
   *   ArrayUtils.getArrayObjectsClass({1,2})         = Exception
   *   ArrayUtils.getArrayObjectsClass(Long{Long(8)})    = Long.class
   *   ArrayUtils.getArrayObjectsClass(Object{})         = Object.class
   *   ArrayUtils.getArrayObjectsClass(Object{"1", new Long(1),
   *       "2"}), Serializable.class);
   *   ArrayUtils.getArrayObjectsClass(Object{Long(8), Short(8)})
   *       = Number.class
   * </pre><p>
   *
   * @param array The Object to check.
   *
   * @return Class The class of the objects the array holds or <code>null</code>
   * if the array object passed is <code>null</code>.
   */
  public static Class getArrayObjectsClass(Object array) {

    // try to get the array Class
    Class arCls = getArrayClass(array);

    // the array is either null, or it is a primitive array or a non typed
    // Object array, otherwise it is a generic typed Object array
    if ((arCls == null) || !arCls.equals(Object.class)) {

      // return the Class
      return arCls;
    }
    else {

      // it is a generic Object class 
      Object[] arObjs = (Object[])array;
      Class arObjClass = null;

      // loop through the array objects
      for (int i = 0; i < arObjs.length; i++) {

        // get the class of the current object
        Class curCls = (arObjs[i] != null) ? arObjs[i].getClass() : null;

        // if the Class is not null, meaning the object is not null
        if (curCls != null) {

          // set the starting Class for the array
          arObjClass = curCls;

          // break the loop because we have the starting class
          break;
        }
      }

      // if all objects in the array are null
      if (arObjClass == null) {

        // class cannot be determined, return generic Object Class
        return Object.class;
      }

      // get the super classes for the starting Class
      Class[] superTypes = ClassUtils.getAllSuperclasses(arObjClass);

      // add starting class to a List as the first element
      ArrayList superList = new ArrayList();
      superList.add(arObjClass);

      // if the class has superclasses always will unless its a generic Object
      if (superTypes != null) {

        // add all other classes to the List, should be in order
        superList.addAll(Arrays.asList(superTypes));
      }

      // Class to return
      Class allClass = null;

      // loop through the list of super classes
      classLoop: for (int i = 0; i < superList.size(); i++) {

        // get the current Class 
        Class curClass = (Class)superList.get(i);

        // loop through all object in the array
        for (int k = 0; k < arObjs.length; k++) {

          // get the current object
          Object curObj = arObjs[k];

          // if the object's is not null and is NOT an instance of the
          // current Class
          if ((curObj != null) && !curClass.isInstance(curObj)) {

            // break to go to the next super class
            continue classLoop;
          }
        }

        // it has gone through all objects in the array and must at 
        // least be a generic Object Class
        allClass = curClass;

        // break Class loop
        break;
      }

      // return the Class if found, otherwise Object.class
      return (allClass == null) ? Object.class : allClass;
    }
  }

  /**
   * Returns the lowest common Class type of the arrays.<p>
   *
   * If either array is <code>null</code> or there is no common class, such as
   * when one array is a primitive array and one is not, or when both are
   * primitive arrays of different types, then <code>null</code> is returned.<p>
   *
   * If either Object passed is not an array then an Exception is thrown.<p>
   *
   * <pre>
   *   ArrayUtils.getArraysClass(null, null)                  = null
   *   ArrayUtils.getArraysClass(null, {"1","2"})             = null
   *   ArrayUtils.getArraysClass({"1","2"}, {"1","2"})        = String.class
   *   ArrayUtils.getArraysClass({1},{0})                     = int.class
   *   ArrayUtils.getArraysClass({1},{"0"})                   = null
   *   ArrayUtils.getArraysClass(Long(1)},{"0"})              = Serializable.class
   *   ArrayUtils.getArraysClass({Long(1)},{Short(0)})        = Number.class
   * </pre><p>
   *
   * @param array The Object to check.
   *
   * @return Class The class of the reference array or <code>null</code> if
   * the array object passed is <code>null</code>.
   */
  public static Class getArraysClass(Object first, Object second) {

    // check for null objects passed
    if ((first == null) || (second == null)) {

      // return null class type
      return null;
    }

    // check for objects that are not arrays
    if (!isArray(first) || !isArray(second)) {

      // throw illegal argument exception
      String msg = "Object passed must be an array";
      throw new IllegalArgumentException(msg);
    }

    // if the arrays are the same type, otherwise not same type and one or more
    // are primitive arrays, otherwise both are reference arrays
    if (areSameType(first, second)) {

      // return the common class
      return getArrayObjectsClass(first);
    }
    else if (isPrimitiveArray(first) || isPrimitiveArray(second)) {

      // one or both of the arrays is a primitive array but are not the 
      // same type, there can be no common class, return null
      return null;
    }
    else {

      // both are reference arrays of different types, try to find a common
      // class between them, get the Class type for both arrays
      Class firstObjCls = getArrayObjectsClass(first);
      Class secondObjCls = getArrayObjectsClass(second);

      // get all of the superclasses for the array Class type
      Class[] firstTypes = ClassUtils.getAllSuperclasses(firstObjCls);
      Class[] secondTypes = ClassUtils.getAllSuperclasses(secondObjCls);

      // get the same types between the arrays
      Class[] sameTypes = (Class[])same(firstTypes, secondTypes);

      // if there are same types, return the first one, should be the lowest
      // common Class, otherwise no common types return Object.class
      return ((sameTypes != null) && (sameTypes.length > 0)) ? sameTypes[0]
        : Object.class;
    }
  }

  /**
   * Returns the length of the array passed.<p>
   *
   * If the array is <code>null</code> -1 is returned.  If the Object passed
   * is not an array, an exception is thrown.<p>
   *
   * <pre>
   *   ArrayUtils.getArrayLength(null)            = -1
   *   ArrayUtils.getArrayLength({"1","2"})       = 2
   *   ArrayUtils.getArrayLength({1})             = 1
   *   ArrayUtils.getArrayLength({})              = 0
   * </pre><p>
   *
   * @param array The array Object from which to get the length.
   *
   * @return int The length of the array passed or -1 if the array is null.
   */
  public static int getArrayLength(Object array) {

    // if the object is null
    if (array == null) {

      // it is not an array type
      return -1;
    }

    // check for objects that are not arrays
    if (!isArray(array)) {

      // throw illegal argument exception for objects that are not arrays
      String msg = "Object passed must be an array";
      throw new IllegalArgumentException(msg);
    }

    return Array.getLength(array);
  }

  /**
   * Returns <code>true</code> if both arrays are not null and of the same Class,
   * meaning they hold the same Class of object instances<p>
   *
   * If either of the arrays is <code>null</code> false is returned.<p>
   *
   * <pre>
   *   ArrayUtils.areSameType(null, null)           = false
   *   ArrayUtils.areSameType({"1","2"},{"1","3"})  = true
   *   ArrayUtils.areSameType({1,2}, {3,4})         = true
   *   ArrayUtils.areSameType({"1"},{1})            = false
   *   ArrayUtils.areSameType(null, {"1"})          = false
   * </pre><p>
   *
   * @param first The first array Object.
   * @param second The second array Object.
   *
   * @return boolean <code>true</code> if both arrays are not null and are of
   * the same Class.
   */
  public static boolean areSameType(Object first, Object second) {

    // get the Class types of both arrays, exceptions will be thrown if either
    // of the objects is not an array
    Class firstType = getArrayObjectsClass(first);
    Class secondType = getArrayObjectsClass(second);

    // if either of the arrays are null
    if ((firstType == null) || (secondType == null)) {

      // they are not the same type because type cannot be determined
      return false;
    }

    // return the equals of the two Class types
    return firstType.equals(secondType);
  }

  /**
   * Returns <code>true</code> if both arrays are not null and are the same
   * length.<p>
   *
   * If either of the arrays is <code>null</code> false is returned.<p>
   *
   * <pre>
   *   ArrayUtils.areSameLength(null, null)           = false
   *   ArrayUtils.areSameLength({"1","2"},{"1","3"})  = true
   *   ArrayUtils.areSameLength({1,2}, {3,4})         = true
   *   ArrayUtils.areSameLength({"1"},{1})            = true
   *   ArrayUtils.areSameLength({"1","2"},{"1"})      = false
   *   ArrayUtils.areSameLength(null, {"1"})          = false
   * </pre><p>
   *
   * @param first The first array Object.
   * @param second The second array Object.
   *
   * @return boolean <code>true</code> if both arrays are not null and are the
   * same length.
   */
  public static boolean areSameLength(Object first, Object second) {

    // if either of the arrays are null
    if ((first == null) || (second == null)) {

      // they are not the same length because null is not a length
      return false;
    }

    // get the length of both arrays 
    int arrayLen = getArrayLength(first);
    int equalLen = getArrayLength(second);

    // return if they are equal length
    return (arrayLen == equalLen);
  }

  /**
   * Returns <code>true</code> if both arrays are logically equal.<p>
   *
   * If either of the arrays is <code>null</code> false is returned.<p>
   *
   * <pre>
   *   ArrayUtils.areEqual(null, null)           = false
   *   ArrayUtils.areEqual({"1","2"},{"1","3"})  = false
   *   ArrayUtils.areEqual({1,2}, {3,4})         = false
   *   ArrayUtils.areEqual({"1"},{"1"})          = true
   *   ArrayUtils.areEqual({1,2},{1,2})          = true
   *   ArrayUtils.areEqual(null, {"1"})          = false
   * </pre><p>
   *
   * @param first The first array Object.
   * @param second The second array Object.
   *
   * @return boolean <code>true</code> if both arrays are not null and are
   * logically equal, meaning the objects in both arrays are logically equal.
   */
  public static boolean areEqual(Object first, Object second) {

    // if the arrays are not the same Class
    if (!areSameType(first, second)) {

      // return false
      return false;
    }

    // if the arrays are not the same length
    if (!areSameLength(first, second)) {

      // return false
      return false;
    }

    // if the first array is a primitive array
    if (isPrimitiveArray(first)) {

      // convert to an Object array
      first = toWrapperArray(first);
    }

    // if the second array is a primitive array
    if (isPrimitiveArray(second)) {

      // convert to an Object array
      second = toWrapperArray(second);
    }

    // cast both arrays to Object[] 
    Object[] firstAr = (Object[])first;
    Object[] secondAr = (Object[])second;

    // loop through the first array
    for (int i = 0; i < firstAr.length; i++) {

      // if either array is null, otherwise neither is null
      if ((firstAr[i] == null) || (secondAr[i] == null)) {

        // both must be null
        if ((firstAr[i] == null) && (secondAr[i] == null)) {

          // continue the loop to the next objects in the array
          continue;
        }
        else {

          // both are not null, then arrays not equal return false
          return false;
        }
      }
      else if (!firstAr[i].equals(secondAr[i])) {

        // neither array is null and the two objects are not equal
        // return false
        return false;
      }
    }

    // all objects in each array are either null or equal return true
    return true;
  }

  /**
   * Returns <code>true</code> if both arrays are logically equal but not
   * physically equal, meaning exactly the same memory location.<p>
   *
   * If either of the arrays is <code>null</code> false is returned.<p>
   *
   * <pre>
   *   ArrayUtils.areEqualNotSame(null, null)           = false
   *   ArrayUtils.areEqualNotSame({"1","2"},{"1","3"})  = false
   *   ArrayUtils.areEqualNotSame({1,2}, {3,4})         = false
   *   ArrayUtils.areEqualNotSame({"1"},{"1"})          = true
   *   ArrayUtils.areEqualNotSame({1,2},{1,2})          = true
   *   ArrayUtils.areEqualNotSame(null, {"1"})          = false
   *   String[] same = {"1"};
   *   ArrayUtils.areEqualNotSame(same, same)           = false
   * </pre><p>
   *
   * @param first The first array Object.
   * @param second The second array Object.
   *
   * @return boolean <code>true</code> if both arrays are not null and are
   * logically equal, meaning the objects in both arrays are logically equal,
   * but not physcially equal meaning same memory location.
   */
  public static boolean areEqualNotSame(Object first, Object second) {

    // check if equal and not same memory location
    return areEqual(first, second) && (first != second);
  }

  /**
   * Returns <code>true</code> if the object is an array.<p>
   *
   * If the object is <code>null</code> false is returned.<p>
   *
   * <pre>
   *   ArrayUtils.isArray(null)          = false
   *   ArrayUtils.isArray({"1","2"})     = true
   *   ArrayUtils.isArray({1,2})         = true
   *   ArrayUtils.isArray("1")           = false
   *   ArrayUtils.isArray(new Long(1))   = false
   * </pre><p>
   *
   * @param array The Object to check.
   *
   * @return boolean <code>true</code> If the object is an array.
   *
   * @see Class#isArray()
   */
  public static boolean isArray(Object array) {

    // if the object is null
    if (array == null) {

      // it is not an array type
      return false;
    }

    // it is not null, check if it is an array
    return array.getClass().isArray();
  }

  /**
   * Returns <code>true</code> if the object is a <code>null</code> or empty 
   * array.<p>
   *
   * <pre>
   *   ArrayUtils.isEmpty(null)          = true
   *   ArrayUtils.isEmpty({"1","2"})     = false
   *   ArrayUtils.isEmpty({1,2})         = false
   *   ArrayUtils.isEmpty({})            = true
   * </pre><p>
   *
   * @param array The Object to check.
   *
   * @return boolean <code>true</code> If the object is a <code>null</code> or
   * empty array.
   */
  public static boolean isEmpty(Object array) {

    // if the object is null
    if (array == null) {

      // it is null or empty return true
      return true;
    }

    // check for objects that are not arrays
    if (!isArray(array)) {

      // throw illegal argument exception for objects that are not arrays
      String msg = "Object passed must be an array";
      throw new IllegalArgumentException(msg);
    }

    // get the length of the array
    int length = getArrayLength(array);

    // if the array has a zero length
    if (length == 0) {

      // return true for empty
      return true;
    }

    // the array is not empty or -1 would mean a null array, return false
    return false;
  }

  /**
   * Returns <code>true</code> if the object is NOT an empty array. The opposite
   * of the <code>isEmpty</code> method, here for convienence.<p>
   *
   * If the object is <code>null</code> false is returned.<p>
   *
   * <pre>
   *   ArrayUtils.isNotEmpty(null)          = false
   *   ArrayUtils.isNotEmpty({"1","2"})     = false
   *   ArrayUtils.isNotEmpty({1,2})         = false
   *   ArrayUtils.isNotEmpty({})            = true
   * </pre><p>
   *
   * @param array The Object to check.
   *
   * @return boolean <code>true</code> If the object is NOT am empty array.
   */
  public static boolean isNotEmpty(Object array) {

    // if the object is null
    if (array == null) {

      // empty cannot be determined return false
      return false;
    }

    // return opposite of isEmpty method call
    return !isEmpty(array);
  }

  /**
   * Returns <code>true</code> if the object is a primitive array. <p>
   *
   * If the object is <code>null</code> false is returned.<p>
   *
   * <pre>
   *   ArrayUtils.isPrimitiveArray(null)          = false
   *   ArrayUtils.isPrimitiveArray({"1","2"})     = false
   *   ArrayUtils.isPrimitiveArray({1,2})         = true
   *   ArrayUtils.isPrimitiveArray(int{})         = true
   * </pre><p>
   *
   * @param array The Object to check.
   *
   * @return boolean <code>true</code> If the object is a primitive array.
   */
  public static boolean isPrimitiveArray(Object array) {

    // if the object is null
    if (array == null) {

      // primitive array cannot be determined return false
      return false;
    }

    // check for objects that are not arrays
    if (!isArray(array)) {

      // return not primitive array
      return false;
    }

    // get the primitive class of the array, all primitive classes will be
    // found in the lookups map 
    Class primLookup = (Class)lookups.get(array.getClass().toString());

    // if the primitive class is found 
    if (primLookup != null) {

      // it is a primitive array, return true
      return true;
    }

    // not a primitive array, return false
    return false;
  }

  /**
   * Returns <code>true</code> if the object is a Object array.
   *
   * If the object is <code>null</code> false is returned.<p>
   *
   * All reference arrays by java definitions would be Object arrays.  That is
   * not what this method looks for and reference arrays other than typed Object
   * arrays would return false.<p>
   *
   * By typed Object array we make a distinction to mean an array that was created
   * as an Object array.  For this method a String array passed would return
   * <code>false</code>, while a <code>List</code> of String objects converted
   * to an array by calling the <code>List.toArray()</code> method would return
   * true.  <code>true</code> would also be returned for a  created, not upcast,
   * Object array.<p>
   *
   * The reason we have such a check is because typed Object arrays cannot be
   * downcast even if all of their objects are of the same Class.  ArrayUtils
   * has <code>convert</code> methods which is used to perfom a fast conversion
   * of a typed Object array to it array objects Class type.  Such an array can
   * then be cast appropriately.<p>
   *
   * Below is an example of such a process:<br>
   *
   * <pre>
   *   // List contains only String objects
   *   // String[] strArray = List.toArray() will not compile
   *
   *   Object[] objArray = List.toArray();
   *   String[] strArray = null;
   *
   *   if (ArrayUtils.isObjectArray(objArray) {
   *     strArray = (String[])ArrayUtils.convert(objArray);
   *   }
   * </pre><p>
   *
   * Below is an example of this methods return values:<br>
   *
   * <pre>
   *   ArrayUtils.isTypedObjectArray(null)                           = false
   *   ArrayUtils.isTypedObjectArray(String{"1","2"})                = false
   *   ArrayUtils.isTypedObjectArray((Object[])String{"1","2"})      = false
   *   ArrayUtils.isTypedObjectArray(int{1,2})                       = false
   *   ArrayUtils.isTypedObjectArray(Object{})                       = true
   *   ArrayUtils.isTypedObjectArray(Object{"1","2"})                = true
   *   ArrayUtils.isTypedObjectArray(Object{"1",Long(1)})            = true
   * </pre><p>
   *
   * @param array The Object to check.
   *
   * @return boolean <code>true</code> If the object is a typed Object array.
   */
  public static boolean isTypedObjectArray(Object array) {

    // if the object is null
    if (array == null) {

      // type Object array cannot be determined return false
      return false;
    }

    // check for objects that are not arrays
    if (!isArray(array)) {

      // throw illegal argument exception for objects that are not arrays
      String msg = "Object passed must be an array";
      throw new IllegalArgumentException(msg);
    }

    // get the class of the object
    String arCls = array.getClass().toString();

    // if the class equals a created Object array
    if (arCls.equals("class [Ljava.lang.Object;")) {

      // is a typed Object array, return true
      return true;
    }

    // otherwise either upcast, reference, or primitive array, return false
    return false;
  }

  /**
   * Returns <code>true</code> if the object is a reference array.  Typed
   * object arrays are also considered reference arrays.<p>
   *
   * If the object is <code>null</code> false is returned.<p>
   *
   * <pre>
   *   ArrayUtils.isReferenceArray(null)          = false
   *   ArrayUtils.isReferenceArray({"1","2"})     = true
   *   ArrayUtils.isReferenceArray({1,2})         = false
   *   ArrayUtils.isReferenceArray(Long{})        = true
   *   ArrayUtils.isReferenceArray(Object{"1"})   = true
   * </pre><p>
   *
   * @param array The Object to check.
   *
   * @return boolean <code>true</code> If the object is a primitive array.
   */
  public static boolean isReferenceArray(Object array) {

    // if the object is null
    if (array == null) {

      // type Object array cannot be determined return false
      return false;
    }

    // check for objects that are not arrays
    if (!isArray(array)) {

      // throw illegal argument exception for objects that are not arrays
      String msg = "Object passed must be an array";
      throw new IllegalArgumentException(msg);
    }

    // get the array class and the reference array identifier
    String arCls = array.getClass().toString();
    String arIdent = "class [L";

    // if the class contains the reference array identifier
    if (StringUtils.contains(arCls, arIdent)) {

      // it is a reference array, return true
      return true;
    }

    // otherwise must be a primitive array, return false
    return false;
  }

  /**
   * Returns <code>true</code> if the object is a wrapper array.  A wrapper
   * array is an array that holds one of the primitive wrapper types, a Long
   * or Short for instance.<p>
   *
   * If the object is <code>null</code> false is returned.<p>
   *
   * <pre>
   *   ArrayUtils.isWrapperArray(null)          = false
   *   ArrayUtils.isWrapperArray({"1","2"})     = false
   *   ArrayUtils.isWrapperArray({1,2})         = false
   *   ArrayUtils.isWrapperArray(Long{})        = true
   *   ArrayUtils.isWrapperArray(Short{1,2})   = true
   * </pre><p>
   *
   * @param array The Object to check.
   *
   * @return boolean <code>true</code> If the object is a wrapper array.
   */
  public static boolean isWrapperArray(Object array) {

    // if the object is null
    if (array == null) {

      // type Object array cannot be determined return false
      return false;
    }

    // check for objects that are not arrays
    if (!isArray(array)) {

      // throw illegal argument exception for objects that are not arrays
      String msg = "Object passed must be an array";
      throw new IllegalArgumentException(msg);
    }

    // if the object is not a reference array
    if (!isReferenceArray(array)) {

      // cannot be a wrapper array, return false
      return false;
    }

    // get the array class and try to unbox to primitive class
    Class arCls = getArrayObjectsClass(array);
    Class primCls = PrimitiveUtils.unBox(arCls);

    // if the primitive class if unboxed
    if (primCls != null) {

      // must be a wrapper class, return true
      return true;
    }

    // Object or other non-wrapper class, return false
    return false;
  }

  /**
   * Returns <code>true</code> if the array is an instance of the Class type
   * passed or if the array can be converted to such an instance, meaning the
   * objects in the array are instances of that Class type or <code>null</code>.
   * <p>
   *
   * If either the array or the Class type passed is <code>null</code> false
   * is returned.<p>
   *
   * <pre>
   *   ArrayUtils.isInstance(null, null)                         = false
   *   ArrayUtils.isInstance({"1","2"}, int.class)               = false
   *   ArrayUtils.isInstance({1,2}, String.class)                = false
   *   ArrayUtils.isInstance({"1","2"}, String.class)            = false
   *   ArrayUtils.isInstance({"1","2"}, Serializable.class)      = true
   *   ArrayUtils.isInstance(Long{}, Long.class)                 = true
   *   ArrayUtils.isInstance({1,2}, int.class)                   = true
   * </pre><p>
   *
   * @param array The Object to check.
   * @param cls The Class type to check is instance.
   *
   * @return boolean <code>true</code> If the array is an instance of the
   * given Class type or can be converted to the given Class type.
   */
  public static boolean isInstance(Object array, Class cls) {

    // if the object is null or the class is null
    if ((array == null) || (cls == null)) {

      // instance of cannot be determined return false
      return false;
    }

    // check for objects that are not arrays
    if (!isArray(array)) {

      // throw illegal argument exception for objects that are not arrays
      String msg = "Object passed must be an array";
      throw new IllegalArgumentException(msg);
    }

    // get the class and all of its superclasses
    Class arObjCls = getArrayObjectsClass(array);
    Class[] arClasses = ClassUtils.getAllTypes(arObjCls);

    // if the check Class equals the class for the array
    if (cls.equals(arObjCls)) {

      // it is an instance, return true
      return true;
    }

    // loop through the superclasses
    for (int i = 0; i < arClasses.length; i++) {

      // if the check Class equals the current superclass
      if (cls.equals(arClasses[i])) {

        // it is an instance return true
        return true;
      }
    }

    // otherwise doesn't equal the class, not an instance return false
    return false;
  }

  /**
   * Returns a primitive array from the wrapper array passed.<p>
   *
   * If the array passed is <code>null</code> then a <code>null</code> is
   * returned.  If the object passed is not an array, an exception is thrown.<p>
   *
   * <pre>
   *   ArrayUtils.toPrimitiveArray(null)            = null
   *   ArrayUtils.toPrimitiveArray(Integer{1,2})    = int{1,2}
   *   ArrayUtils.toPrimitiveArray(Short{3,4})      = short{1,2}
   *   ArrayUtils.toPrimitiveArray(String{"1")      = Exception
   * </pre><p>
   *
   * @param array The primitive array to convert to a wrapper array.
   */
  public static Object toPrimitiveArray(Object array) {

    // if the object is null
    if (array == null) {

      // primitive cannot be determined, return null
      return null;
    }

    // if the array is not a wrapper array
    if (!isWrapperArray(array)) {

      // throw an exception because must be a wrapper array to have a 
      // primitive class
      String message = "Array must be a wrapper array";
      throw new IllegalArgumentException(message);
    }

    // otherwise it is a wrapper array, get the primitive array Class,
    // and the array length
    Class primType = PrimitiveUtils.unBox(getArrayObjectsClass(array));
    int arrayLength = getArrayLength(array);

    // create a new wrapper array of the correct length
    Object primArray = getArray(primType, arrayLength);

    // loop through through the primitive array
    for (int i = 0; i < arrayLength; i++) {

      // copy over wrapper values to primitive values in the primitive array
      Array.set(primArray, i, Array.get(array, i));
    }

    // return the new primitive array
    return primArray;
  }

  /**
   * Returns a wrapper array from the primitive array passed.<p>
   *
   * If the array passed is <code>null</code> then a <code>null</code> is
   * returned.  If the object passed is not an array, an exception is thrown.<p>
   *
   * <pre>
   *   ArrayUtils.toWrapperArray(null)            = null
   *   ArrayUtils.toWrapperArray({1,2})           = Integer{1,2}
   *   ArrayUtils.toWrapperArray(short{3,4})      = Short{1,2}
   *   ArrayUtils.toWrapperArray(String{"1")      = Exception
   * </pre><p>
   *
   * @param array The primitive array to convert to a wrapper array.
   */
  public static Object toWrapperArray(Object array) {

    // if the object is null
    if (array == null) {

      // wrapper cannot be determined, return null
      return null;
    }

    // if the array is not a primitive array
    if (!isPrimitiveArray(array)) {

      // throw an exception because must be a primitive array to have a 
      // wrapper class
      String message = "Array must be a primative array";
      throw new IllegalArgumentException(message);
    }

    // otherwise it is a primitive array, get the wrapper array Class
    // and the array length
    Class wrapperType = PrimitiveUtils.box(getPrimitiveArrayClass(array));
    int arrayLength = getArrayLength(array);

    // create a new wrapper array of the correct length
    Object wrapperArray = getArray(wrapperType, arrayLength);

    // loop through through the primitive array
    for (int i = 0; i < arrayLength; i++) {

      // copy over primitive values to wrapper values in the wrapper array
      Array.set(wrapperArray, i, Array.get(array, i));
    }

    // return the new wrapper array
    return wrapperArray;
  }

  /**
   * Returns an Object array from the array passed.<p>
   *
   * The main use of the <code>toObjectArray</code> method would be instances
   * where an object array is needed and you are dealing with both primitive
   * and reference arrays.
   *
   * If the array passed is <code>null</code> then a <code>null</code> is
   * returned.  If the object passed is not an array, an exception is thrown.<p>
   *
   * <pre>
   *   ArrayUtils.toObjectArray(null)            = null
   *   ArrayUtils.toObjectArray({1,2})           = Object{1,2}
   *   ArrayUtils.toObjectArray({"3","4"})       = Ojbect{"3","4"}
   * </pre><p>
   *
   * @param array The array to convert to an object array.
   */
  public static Object[] toObjectArray(Object array) {

    // if the object is null
    if (array == null) {

      // type Object array cannot be determined return false
      return null;
    }

    // check for objects that are not arrays
    if (!isArray(array)) {

      // throw illegal argument exception for objects that are not arrays
      String msg = "Object passed must be an array";
      throw new IllegalArgumentException(msg);
    }

    // if the object is a reference array, otherwise primitive array
    if (isReferenceArray(array)) {

      // just cast and return
      return (Object[])array;
    }
    else {

      // primitive array, convert to wrapper and then cast
      Object[] wrapper = (Object[])toWrapperArray(array);

      // return the wrapper array cast to an object array
      return wrapper;
    }
  }

  /**
   * Returns a String array from the array passed.<p>
   *
   * If the array passed is <code>null</code> then a <code>null</code> is
   * returned.  If the array is a String array, the original array is returned.
   * If the object passed is not an array, an exception is thrown.<p>
   *
   * <pre>
   *   ArrayUtils.toStringArray(null)            = null
   *   ArrayUtils.toStringArray({1,2})           = Object{1,2}
   *   ArrayUtils.toStringArray({"3","4"})       = Ojbect{"3","4"}
   * </pre><p>
   *
   * @param array The array to convert to an object array.
   */
  public static String[] toStringArray(Object array) {

    // if the object is null
    if (array == null) {

      // type Object array cannot be determined return false
      return null;
    }

    // check for objects that are not arrays
    if (!isArray(array)) {

      // throw illegal argument exception for objects that are not arrays
      String msg = "Object passed must be an array";
      throw new IllegalArgumentException(msg);
    }

    // if the array is already a String array, otherwise if it can be converted
    // to a String array
    if (isReferenceArray(array)
      && getReferenceArrayClass(array).equals(String.class)) {

      // cast and return the original array
      return (String[])array;
    }
    else if (isInstance(array, String.class)) {

      // can be converted, so convert, cast and return
      return (String[])convert(array, String.class);
    }

    // get the array as an object array and create a new String array of the
    // same length to hold the output Strings
    Object[] objects = toObjectArray(array);
    String[] out = new String[objects.length];

    // loop through the objects in the array
    for (int i = 0; i < objects.length; i++) {

      // get the current object and covert it to a String or to null
      Object curobj = objects[i];
      out[i] = (curobj != null) ? curobj.toString() : null;
    }

    // return the new String array
    return out;
  }

  /**
   * Returns a copy of the array passed extended or chopped to the length.<p>
   *
   * If the array is <code>null</code> <code>null</code> is returned.  If the
   * Object passed is not an array, an exception is thrown.  If the length is
   * <= 0 then a copy of the original array is returned.<p>
   *
   * <pre>
   *   ArrayUtils.create(null, 5)                    = null
   *   ArrayUtils.create({"1","2"}, 1)            = {"1"}
   *   ArrayUtils.create({1,2}, 2)                = {1,2}
   *   ArrayUtils.create({1,2,3}, 0)              = {1,2,3}
   *   ArrayUtils.create({1,2,3}, -2)             = {1,2,3}
   *   ArrayUtils.create({1,2,3}, 5)              = {1,2,3,0,0}
   * </pre><p>
   *
   * @param src The source array.
   * @param length The length of the output array.
   *
   * @return Object A copy of the src array extended or trimmed to the length
   * passed.
   */
  public static Object create(Object src, int length) {

    // check for null input arrays
    if (src == null) {

      // return null
      return null;
    }

    // check for objects that are not arrays
    if (!isArray(src)) {

      // throw illegal argument exception for objects that are not arrays
      String msg = "Object passed must be an array";
      throw new IllegalArgumentException(msg);
    }

    // if the length is negative or 0
    if (length <= 0) {

      // reutrn a copy of the original array
      return copy(src);
    }

    // get the length of the current array and its Class type
    int srcLength = getArrayLength(src);
    Class arrayType = getArrayObjectsClass(src);

    // create an array of the appropriate type and length
    Object created = getArray(arrayType, length);

    // get the number of object to copy to the new array
    int numEntries = (srcLength <= length) ? srcLength : length;

    // fast copy the objects to the new array
    System.arraycopy(src, 0, created, 0, numEntries);

    // return the array
    return created;
  }

  /**
   * Returns a new array of the lowest common array Class type with the append
   * array appended to the src array.<p>
   *
   * If either array is <code>null</code> <code>null</code> is returned.  If
   * either Object passed is not an array, an exception is thrown.<p>
   *
   * <pre>
   *   ArrayUtils.append(null, {"1","2"})         = null
   *   ArrayUtils.append({"1","2"}, null)         = null
   *   ArrayUtils.append({"1","2"}, {"1","2"})    = {"1","2","1","2"}
   *   ArrayUtils.append({1,2}, {2})              = {1,2,2}
   *   ArrayUtils.append({1,2,3}, {})             = {1,2,3}
   *   ArrayUtils.append({}, {1,2,3})             = {1,2,3}
   * </pre><p>
   *
   * @param src The source array.
   * @param append The array to append.
   *
   * @return Object A new array of the with the append array appended to the
   * src array.
   */
  public static Object append(Object src, Object append) {

    // check for null input arrays
    if ((src == null) || (append == null)) {

      // return null
      return null;
    }

    // check for objects that are not arrays
    if (!isArray(src) || !isArray(append)) {

      // throw illegal argument exception for objects that are not arrays
      String msg = "Object passed must be an array";
      throw new IllegalArgumentException(msg);
    }

    // get the lengths of the src and append arrays
    int srcLength = getArrayLength(src);
    int appendLength = getArrayLength(append);

    // get the common Class type of the arrays
    Class arrayType = getArraysClass(src, append);

    // get a new array of the appropriate type and length
    Object complete = getArray(arrayType, srcLength + appendLength);

    // copy the src and append arrays to the new array
    System.arraycopy(src, 0, complete, 0, srcLength);
    System.arraycopy(append, 0, complete, srcLength, appendLength);

    // return the new array
    return complete;
  }

  /**
   * Returns a new array holding the Objects of the src array padded on both
   * sides of the array with length indices.<p>
   *
   * If the array is <code>null</code> <code>null</code> is returned.  If the
   * Object passed is not an array, an exception is thrown.  If the length is
   * <= 0 then a copy of the original array is returned.<p>
   *
   * <pre>
   *   ArrayUtils.pad(null, 5)                 = null
   *   ArrayUtils.pad({"1","2"}, 1)            = {null,"1",null}
   *   ArrayUtils.pad({1,2}, 2)                = {0,0,1,2,0,0}
   *   ArrayUtils.pad({1,2,3}, 0)              = {1,2,3}
   *   ArrayUtils.pad({1,2,3}, -2)             = {1,2,3}
   * </pre><p>
   *
   * @param src The source array.
   * @param length The length to pad the array.
   *
   * @return Object A new array holding the objects of the src array padded on
   * both side with length indices.
   */
  public static Object pad(Object src, int length) {

    // if the length to pad is <= 0
    if (length <= 0) {

      // return a copy of the original array
      return copy(src);
    }

    // right and left pad the src array with length indices
    Object rpad = rightPad(src, length);
    Object lpad = leftPad(rpad, length);

    // return the padded array
    return lpad;
  }

  /**
   * Returns a new array holding the Objects of the src array right padded with
   * length indices.<p>
   *
   * If the array is <code>null</code> <code>null</code> is returned.  If the
   * Object passed is not an array, an exception is thrown.  If the length is
   * <= 0 then a copy of the original array is returned.<p>
   *
   * <pre>
   *   ArrayUtils.rightpad(null, 5)                 = null
   *   ArrayUtils.rightpad({"1","2"}, 1)            = {"1",null}
   *   ArrayUtils.rightpad({1,2}, 2)                = {1,2,0,0}
   *   ArrayUtils.rightpad({1,2,3}, 0)              = {1,2,3}
   *   ArrayUtils.rightpad({1,2,3}, -2)             = {1,2,3}
   * </pre><p>
   *
   * @param src The source array.
   * @param length The length to right pad the array.
   *
   * @return Object A new array holding the objects of the src array right
   * padded with length indices.
   */
  public static Object rightPad(Object src, int length) {

    // if the array is null or length is a negative or 0
    if ((src == null) || (length <= 0)) {

      // return  a copy of the original array
      return copy(src);
    }

    // check for objects that are not arrays
    if (!isArray(src)) {

      // throw illegal argument exception for objects that are not arrays
      String msg = "Object passed must be an array";
      throw new IllegalArgumentException(msg);
    }

    // get the length and Class type of the src array
    int srcLength = getArrayLength(src);
    Class arrayType = getArrayClass(src);

    // create a new array of the correct length and type
    Object rpad = getArray(arrayType, srcLength + length);

    // copy the src array objects to the new array
    System.arraycopy(src, 0, rpad, 0, srcLength);

    // return the new array
    return rpad;
  }

  /**
   * Returns a new array holding the Objects of the src array left padded with
   * length indices.<p>
   *
   * If the array is <code>null</code> <code>null</code> is returned.  If the
   * Object passed is not an array, an exception is thrown.  If the length is
   * <= 0 then  a copy of the original array is returned.<p>
   *
   * <pre>
   *   ArrayUtils.leftpad(null, 5)                 = null
   *   ArrayUtils.leftpad({"1","2"}, 1)            = {"1",null}
   *   ArrayUtils.leftpad({1,2}, 2)                = {1,2,0,0}
   *   ArrayUtils.leftpad({1,2,3}, 0)              = {1,2,3}
   *   ArrayUtils.leftpad({1,2,3}, -2)             = {1,2,3}
   * </pre><p>
   *
   * @param src The source array.
   * @param length The length to left pad the array.
   *
   * @return Object A new array holding the objects of the src array left
   * padded with length indices.
   */
  public static Object leftPad(Object src, int length) {

    // if the array is null or length is a negative or 0
    if ((src == null) || (length <= 0)) {

      // return  a copy of the original array
      return copy(src);
    }

    // check for objects that are not arrays
    if (!isArray(src)) {

      // throw illegal argument exception for objects that are not arrays
      String msg = "Object passed must be an array";
      throw new IllegalArgumentException(msg);
    }

    // get the length and Class type of the src array
    int srcLength = getArrayLength(src);
    Class arrayType = getArrayClass(src);

    // create a new array of the correct length and type
    Object lpad = getArray(arrayType, srcLength + length);

    // copy the src array objects to the new array
    System.arraycopy(src, 0, lpad, length, srcLength);

    // return the new array
    return lpad;
  }

  /**
   * Returns a new array holding the Objects of the src array chopped on both
   * sides of the array length indices.<p>
   *
   * If the array is <code>null</code> <code>null</code> is returned.  If the
   * Object passed is not an array, an exception is thrown.  If the length is
   * <= 0 then a copy of the original array is returned.  If the chop length
   * is >= to the number of elements in the array, an empty array is returned.
   * <p>
   *
   * <pre>
   *   ArrayUtils.chop(null, 5)                 = null
   *   ArrayUtils.chop({"1","2","3"}, 1)            = {"2"}
   *   ArrayUtils.chop({1,2}, 2)                = {}
   *   ArrayUtils.chop({1,2,3}, 0)              = {1,2,3}
   *   ArrayUtils.chop({1,2,3}, -2)             = {1,2,3}
   *   ArrayUtils.chop({}, 2)                   = {}
   * </pre><p>
   *
   * @param src The source array.
   * @param length The length to chop the array.
   *
   * @return Object A new array holding the objects of the src array chopped
   * on both side length indices.
   */
  public static Object chop(Object src, int length) {

    // if the length to chop is <= 0
    if (length <= 0) {

      // return a copy of the original array
      return copy(src);
    }

    // right and left chop the src array with length indices
    Object rchop = rightChop(src, length);
    Object lchop = leftChop(rchop, length);

    // return the chopped array
    return lchop;
  }

  /**
   * Returns a new array holding the Objects of the src array right chopped
   * length indices.<p>
   *
   * If the array is <code>null</code> <code>null</code> is returned.  If the
   * Object passed is not an array, an exception is thrown.  If the length is
   * <= 0 then a copy of the original array is returned.  If the chop length
   * is >= to the number of elements in the array, an empty array is returned.
   * <p>
   *
   * <pre>
   *   ArrayUtils.rightChop(null, 5)                 = null
   *   ArrayUtils.rightChop({"1","2","3"}, 1)            = {"1","2"}
   *   ArrayUtils.rightChop({1,2}, 2)                = {}
   *   ArrayUtils.rightChop({1,2,3}, 0)              = {1,2,3}
   *   ArrayUtils.rightChop({1,2,3}, -2)             = {1,2,3}
   *   ArrayUtils.rightChop({}, 2)                   = {}
   * </pre><p>
   *
   * @param src The source array.
   * @param length The length to chop the array.
   *
   * @return Object A new array holding the objects of the src array right
   * chopped length indices.
   */
  public static Object rightChop(Object src, int length) {

    // if the array is null or length is a negative or 0
    if ((src == null) || (length <= 0)) {

      // return the original array
      return copy(src);
    }

    // check for objects that are not arrays
    if (!isArray(src)) {

      // throw illegal argument exception for objects that are not arrays
      String msg = "Object passed must be an array";
      throw new IllegalArgumentException(msg);
    }

    // get the length of the new array and its Class 
    int srcLength = getArrayLength(src) - length;
    Class arrayType = getArrayClass(src);

    // check for chop to empty array
    if (length >= getArrayLength(src)) {

      return getArray(arrayType, 0);
    }

    // create the chopped array
    Object rchop = getArray(arrayType, srcLength);

    // copy the objects from the source array
    System.arraycopy(src, 0, rchop, 0, srcLength);

    // return the right chopped array
    return rchop;
  }

  /**
   * Returns a new array holding the Objects of the src array left chopped
   * length indices.<p>
   *
   * If the array is <code>null</code> <code>null</code> is returned.  If the
   * Object passed is not an array, an exception is thrown.  If the length is
   * <= 0 then a copy of the original array is returned.  If the chop length
   * is >= to the number of elements in the array, an empty array is returned.
   * <p>
   *
   * <pre>
   *   ArrayUtils.leftChop(null, 5)                 = null
   *   ArrayUtils.leftChop({"1","2","3"}, 1)            = {"2","3"}
   *   ArrayUtils.leftChop({1,2}, 2)                = {}
   *   ArrayUtils.leftChop({1,2,3}, 0)              = {1,2,3}
   *   ArrayUtils.leftChop({1,2,3}, -2)             = {1,2,3}
   *   ArrayUtils.leftChop({}, 2)                   = {}
   * </pre><p>
   *
   * @param src The source array.
   * @param length The length to chop the array.
   *
   * @return Object A new array holding the objects of the src array left
   * chopped length indices.
   */
  public static Object leftChop(Object src, int length) {

    // if the array is null or length is a negative or 0
    if ((src == null) || (length <= 0)) {

      // return the original array
      return copy(src);
    }

    // check for objects that are not arrays
    if (!isArray(src)) {

      // throw illegal argument exception for objects that are not arrays
      String msg = "Object passed must be an array";
      throw new IllegalArgumentException(msg);
    }

    // get the length of the new array and its Class 
    int srcLength = getArrayLength(src) - length;
    Class arrayType = getArrayClass(src);

    // check for chop to empty array
    if (length >= getArrayLength(src)) {

      return getArray(arrayType, 0);
    }

    // create the chopped array
    Object lchop = getArray(arrayType, srcLength);

    // copy the objects from the source array
    System.arraycopy(src, length, lchop, 0, srcLength);

    // return the left chopped array
    return lchop;
  }

  /**
   * Returns a new array holding the Objects of the src array trimmed of
   * <code>null</code> objects on both sides of the array.<p>
   *
   * If the array is <code>null</code> <code>null</code> is returned.  If the
   * Object passed is not an array, an exception is thrown.<p>
   *
   * <pre>
   *   ArrayUtils.trim(null)                = null
   *   ArrayUtils.trim({"1","2",null})      = {"1","2"}
   *   ArrayUtils.trim({null,"1","2"})      = {"1","2"}
   *   ArrayUtils.trim({})                  = {}
   * </pre><p>
   *
   * @param src The source array.
   *
   * @return Object A new array holding the objects of the src array trimmed
   * of <code>null</code> objects on both sides of the array.
   */
  public static Object trim(Object src) {

    // if the array is a primitve array
    if (isPrimitiveArray(src)) {

      // has no null objects, return copy of original array
      return copy(src);
    }

    // return the trimmed array
    return trim(src, null);
  }

  /**
   * Returns a new array holding the Objects of the src array right trimmed of
   * <code>null</code> objects<p>
   *
   * If the array is <code>null</code> <code>null</code> is returned.  If the
   * Object passed is not an array, an exception is thrown.<p>
   *
   * <pre>
   *   ArrayUtils.rightTrim(null)                 = null
   *   ArrayUtils.rightTrim({"1","2",null})       = {"1","2"}
   *   ArrayUtils.rightTrim({null,"2",null})      = {null,"2"}
   *   ArrayUtils.rightTrim({})                   = {}
   * </pre><p>
   *
   * @param src The source array.
   *
   * @return Object A new array holding the objects of the src array right
   * trimmed of <code>null</code> objects.
   */
  public static Object rightTrim(Object src) {

    // if the array is a primitve array
    if (isPrimitiveArray(src)) {

      // has no null objects, return copy of original array
      return copy(src);
    }

    // return a right trimmed array
    return rightTrim(src, null);
  }

  /**
   * Returns a new array holding the Objects of the src array left trimmed of
   * <code>null</code> objects<p>
   *
   * If the array is <code>null</code> <code>null</code> is returned.  If the
   * Object passed is not an array, an exception is thrown.<p>
   *
   * <pre>
   *   ArrayUtils.leftTrim(null)                 = null
   *   ArrayUtils.leftTrim({"1","2",null})       = {"1","2",null}
   *   ArrayUtils.leftTrim({null,"2",null})      = {"2",null}
   *   ArrayUtils.leftTrim({})                   = {}
   * </pre><p>
   *
   * @param src The source array.
   *
   * @return Object A new array holding the objects of the src array left
   * trimmed of <code>null</code> objects.
   */
  public static Object leftTrim(Object src) {

    // if the array is a primitve array
    if (isPrimitiveArray(src)) {

      // has no null objects, return copy of original array
      return copy(src);
    }

    // return a left trimmed array
    return leftTrim(src, null);
  }

  /**
   * Returns a new array holding the Objects of the src array trimmed of
   * <code>null</code> objects on both sides of the array.<p>
   *
   * If the array is <code>null</code> <code>null</code> is returned.  If the
   * Object passed is not an array, an exception is thrown.<p>
   *
   * <pre>
   *   ArrayUtils.trim(null, "1")                 = null
   *   ArrayUtils.trim({"1","2",null}, null)      = {"1","2"}
   *   ArrayUtils.trim({"1","2",null}, "1")       = {"2", null}
   *   ArrayUtils.trim({"1","2"}, "1")            = {"2"}
   *   ArrayUtils.trim({})                        = {}
   * </pre><p>
   *
   * @param src The source array.
   *
   * @return Object A new array holding the objects of the src array trimmed
   * of <code>null</code> objects on both sides of the array.
   */
  public static Object trim(Object src, Object toTrim) {

    // if the object is null
    if (src == null) {

      // type Object array cannot be determined return false
      return null;
    }

    // check for objects that are not arrays
    if (!isArray(src)) {

      // throw illegal argument exception for objects that are not arrays
      String msg = "Object passed must be an array";
      throw new IllegalArgumentException(msg);
    }

    // right and left trim the src array
    Object rtrim = rightTrim(src, toTrim);
    Object ltrim = leftTrim(rtrim, toTrim);

    // return the trimmed array
    return ltrim;
  }

  /**
   * Returns a new array holding the Objects of the src array right trimmed of
   * <code>null</code> objects<p>
   *
   * If the array is <code>null</code> <code>null</code> is returned.  If the
   * Object passed is not an array, an exception is thrown.<p>
   *
   * <pre>
   *   ArrayUtils.rightTrim(null, "1")                = null
   *   ArrayUtils.rightTrim({"1","2",null}, null)     = {"1","2"}
   *   ArrayUtils.rightTrim({"1","2",null}, "1")      = {"1", "2", null}
   *   ArrayUtils.rightTrim({"1","2"}, "1")           = {"1", "2"}
   *   ArrayUtils.rightTrim({}, "1")                  = {}
   * </pre><p>
   *
   * @param src The source array.
   *
   * @return Object A new array holding the objects of the src array right
   * trimmed of <code>null</code> objects.
   */
  public static Object rightTrim(Object src, Object toTrim) {

    // if the object is null
    if (src == null) {

      // type Object array cannot be determined return false
      return null;
    }

    // get the array as an object array
    Object[] objects = toObjectArray(src);

    // loop through the array backwards
    for (int i = (objects.length - 1); i >= 0; i--) {

      // if the object is not the trim object
      if ((objects[i] == null && toTrim != null)
        || (objects[i] != null && !(objects[i].equals(toTrim)))) {

        // return a copy of the source array from 0 to the index
        return copy(src, 0, i + 1);
      }
    }

    // return an empty array of the correct type and length
    return getArray(getArrayObjectsClass(src), getArrayLength(src));
  }

  /**
   * Returns a new array holding the Objects of the src array left trimmed of
   * <code>null</code> objects<p>
   *
   * If the array is <code>null</code> <code>null</code> is returned.  If the
   * Object passed is not an array, an exception is thrown.<p>
   *
   * <pre>
   *   ArrayUtils.leftTrim(null, "1")                = null
   *   ArrayUtils.leftTrim({null,"1","2"}, null)     = {"1","2"}
   *   ArrayUtils.leftTrim({"1","2",null}, "1")      = {"2", null}
   *   ArrayUtils.leftTrim({"1","2"}, "1")           = {"1", "2"}
   *   ArrayUtils.leftTrim({}, "1")                  = {}
   * </pre><p>
   *
   * @param src The source array.
   *
   * @return Object A new array holding the objects of the src array left
   * trimmed of <code>null</code> objects.
   */
  public static Object leftTrim(Object src, Object toTrim) {

    // if the object is null
    if (src == null) {

      // type Object array cannot be determined return false
      return null;
    }

    // get the array as an object array
    Object[] objects = toObjectArray(src);

    // loop through the array backwards
    for (int i = 0; i < objects.length; i++) {

      // if the object is not the trim object
      if ((objects[i] == null && toTrim != null)
        || (objects[i] != null && !(objects[i].equals(toTrim)))) {

        // return a copy of the source array from the index to the end of
        // the array
        return copy(src, i);
      }
    }

    // return an empty array of the correct type and length
    return getArray(getArrayObjectsClass(src), getArrayLength(src));
  }

  /**
   * Inserts one array inside of another array at the given position, returning
   * a new array.<p>
   *
   * If either array is <code>null</code> <code>null</code> is returned.  If
   * either Object passed is not an array, an exception is thrown.  If no common
   * Class can be found between the array, an exception is thrown.<p>
   *
   * If the src position is < 0, the start position will be 0, or the beginning
   * of the array.<p>
   *
   * <pre>
   *   ArrayUtils.insert(null, {1,2}, 1)                = null
   *   ArrayUtils.insert({1,2,3}, null, 1)              = null
   *   ArrayUtils.insert({"1","2","3"}, {1,2}, 1)       = Exception
   *   ArrayUtils.insert({1,2,3}, {1,2}, -1)            = {1,2,1,2,3}
   *   ArrayUtils.insert({1,2,3}, {1,2}, 5)             = {1,2,3,1,2}
   *   ArrayUtils.insert({1,2,3}, {1,2}, -1)            = {1,2,3}
   *   ArrayUtils.insert({1,2,3}, {1,2}, -1)            = {1,2,1,2,3}
   *   ArrayUtils.insert({1,2,3}, {1,2}, 3)             = {1,2,3,1,2}
   *   ArrayUtils.insert({1,2,3}, {1,2}, 1)             = {1,1,2,2,3}
   * </pre><p>
   *
   * @param src The source array.
   * @param toInsert The array to insert.
   * @param srcPos The index in the src array to insert the array.
   *
   * @return Object A new array holding the src array with the toInsert array
   * inserted or <code>null</code> if either array is <code>null</code>.
   */
  public static Object insert(Object src, Object toInsert, int srcPos) {

    // get the length of the array to insert
    int insertLength = getArrayLength(toInsert);

    // call the overloaded method and return the array
    return insert(src, toInsert, srcPos, insertLength);
  }

  /**
   * Inserts the length number of elements of one array inside of another array
   * at the given position, returning a new array.<p>
   *
   * If either array is <code>null</code> <code>null</code> is returned.  If
   * either Object passed is not an array, an exception is thrown.  If no common
   * Class can be found between the array, an exception is thrown.<p>
   *
   * If the src position is < 0, the start position will be 0, or the beginning
   * of the array.  If it is > the length of the src array, the position is set
   * to the length of the src array or the end of the array.  If the length to
   * insert is <= 0 then a copy of the original array is returned.  If the
   * length is > the number of elements in the insert array, the entire array
   * is inserted.<p>
   *
   * <pre>
   *   ArrayUtils.insert(null, {1,2}, 1, 2)                = null
   *   ArrayUtils.insert({1,2,3}, null, 1, 2)              = null
   *   ArrayUtils.insert({"1","2","3"}, {1,2}, 1, 2)       = Exception
   *   ArrayUtils.insert({1,2,3}, {1,2}, -1, 2)            = {1,2,1,2,3}
   *   ArrayUtils.insert({1,2,3}, {1,2}, 5, 2)             = {1,2,3,1,2}
   *   ArrayUtils.insert({1,2,3}, {1,2}, -1, -1)           = {1,2,3}
   *   ArrayUtils.insert({1,2,3}, {1,2}, -1, 2)            = {1,2,1,2,3}
   *   ArrayUtils.insert({1,2,3}, {1,2}, 3, 5)             = {1,2,3,1,2}
   *   ArrayUtils.insert({1,2,3}, {1,2}, 1, 1)             = {1,1,2,3}
   * </pre><p>
   *
   * @param src The source array.
   * @param toInsert The array to insert.
   * @param srcPos The index in the src array to insert the array starting at 0.
   * @param length The number of elements from the toInsert array to insert.
   *
   * @return Object A new array holding the src array with length number of
   * elements from the toInsert array inserted or <code>null</code> if either
   * array is <code>null</code>.
   */
  public static Object insert(Object src, Object toInsert, int srcPos,
    int length) {

    // if either array is null
    if ((src == null) || (toInsert == null)) {

      // return the original array
      return null;
    }

    // check for objects that are not arrays
    if (!isArray(src) || !isArray(toInsert)) {

      // throw illegal argument exception for objects that are not arrays
      String msg = "Objects passed must be an array";
      throw new IllegalArgumentException(msg);
    }

    // get the length and class type of the src array
    int srcLength = getArrayLength(src);
    int insertLength = getArrayLength(toInsert);
    Class arrayType = getArraysClass(src, toInsert);

    // is a common class type could not be found
    if (arrayType == null) {

      // throw illegal argument exception for no common class between arrays
      String msg = "No common class type, cannot insert array";
      throw new IllegalArgumentException(msg);
    }

    // if the src position is > the length of the src array
    if (srcPos > srcLength) {

      // set the insert position to the end of the src array
      srcPos = srcLength;
    }

    // if the src position is < 0
    if (srcPos < 0) {

      // set the insert position to the beginning of the src array
      srcPos = 0;
    }

    // if the number of elements to insert is > the number of elements in 
    // the insert array
    if (length > insertLength) {

      // set the number of elements to the number in the insert array
      length = insertLength;
    }

    // if the number of elements to insert is <= 0
    if (length <= 0) {

      // no action, return the original array
      return copy(src);
    }

    // get an array to hold the src array and the elements to insert
    Object complete = getArray(arrayType, srcLength + length);

    // copy the elements of the src array from 0 to the start position
    System.arraycopy(src, 0, complete, 0, srcPos);

    // copy length number of elements from the array to insert
    System.arraycopy(toInsert, 0, complete, srcPos, length);

    // copy the rest of the elements from the src array
    System.arraycopy(src, srcPos, complete, srcPos + length, srcLength - srcPos);

    // return the new array
    return complete;
  }

  /**
   * Replaces elments of one array with the elements of another array starting
   * at the given position.  No new object is returned, the original src array
   * is modified.<p>
   *
   * The elements are replaced starting at the srcPos index and the 0 index of
   * the toReplace array and continuing until the end of the either the src or
   * the toReplace array.<p>
   *
   * If either array is <code>null</code>, then no elements in the src array are
   * replaced.  If either Object passed is not an array, an exception is thrown.
   * If the replacement elements are of the wrong Class to be inserted into the
   * src array, an exception is thrown.<p>
   *
   * If the src position is < 0, the start position will be 0, or the beginning
   * of the array.  If the src position is >= the length of the array, then no
   * elements are replaced.<p>
   *
   * <pre>
   *   // nothing returned, values are original array
   *   ArrayUtils.replace(null, {1,2}, 1)                = null
   *   ArrayUtils.replace({1,2,3}, null, 1)              = {1,2,3}
   *   ArrayUtils.replace({"1","2","3"}, {1,2}, 1)       = Exception
   *   ArrayUtils.replace({1,2,3}, {1,2}, -1)            = {1,2,3}
   *   ArrayUtils.replace({1,2,3}, {1,2}, 5)             = {1,2,3}
   *   ArrayUtils.replace({1,2,3}, {1,2}, -1)            = {1,2,3}
   *   ArrayUtils.replace({3,2,1}, {1,2}, -1)            = {1,2,1}
   *   ArrayUtils.replace({1,2,3}, {1,2}, 2)             = {1,2,1}
   *   ArrayUtils.replace({1,2,3}, {1,2}, 1)             = {1,1,3}
   * </pre><p>
   *
   * @param src The source array.
   * @param toReplace The replacement elements array.
   * @param srcPos The index in the src array to replace the elements.
   */
  public static void replace(Object src, Object toReplace, int srcPos) {

    // get the length of the replacement array
    int replaceLength = getArrayLength(toReplace);

    // call the overloaded method to replace the elements of the src array
    replace(src, toReplace, srcPos, replaceLength);
  }

  /**
   * Replaces elments of one array with the elements of another array starting
   * at the given position for length number of elements.  No new object is
   * returned, the original src array is modified.<p>
   *
   * The elements are replaced starting at the srcPos index and the 0 index of
   * the toReplace array and continuing until the end of the either the src or
   * the length number of elements.<p>
   *
   * If either array is <code>null</code>, then no elements in the src array are
   * replaced.  If either Object passed is not an array, an exception is thrown.
   * If the replacement elements are of the wrong Class to be inserted into the
   * src array, an exception is thrown.<p>
   *
   * If the src position is < 0, the start position will be 0, or the beginning
   * of the array.  If the src position is >= the length of the array, then no
   * elements are replaced.  If the length to replace is <= 0 then no elements
   * are replaced.  If the length is > the number of elements in the replace
   * array, the entire array is used as replacement elements.  If the srcPos +
   * length is >= the length of the src array, the number of elements replaced
   * will be the length of the src array - srcPos.<p>
   *
   * <pre>
   *   // nothing returned, values are original array
   *   ArrayUtils.replace(null, {1,2}, 1, 2)                = null
   *   ArrayUtils.replace({1,2,3}, null, 1, 2)              = {1,2,3}
   *   ArrayUtils.replace({"1","2","3"}, {1,2}, 1, 2)       = Exception
   *   ArrayUtils.replace({1,2,3}, {1,2}, -1, 2)            = {1,2,3}
   *   ArrayUtils.replace({1,2,3}, {1,2}, 5, 2)             = {1,2,3}
   *   ArrayUtils.replace({1,2,3}, {1,2}, -1, -1)           = {1,2,3}
   *   ArrayUtils.replace({3,2,1}, {1,2}, -1, 2)            = {1,2,1}
   *   ArrayUtils.replace({1,2,3}, {1,2}, 2, 5)             = {1,2,1}
   *   ArrayUtils.replace({1,2,3}, {1,2}, 1, 1)             = {1,1,3}
   * </pre><p>
   *
   * @param src The source array.
   * @param toReplace The replacement elements array.
   * @param srcPos The index in the src array to replace the elements.
   * @param length The number of elements to replace.
   */
  public static void replace(Object src, Object toReplace, int srcPos,
    int length) {

    // if either array is null
    if ((src == null) || (toReplace == null)) {

      // return the original array
      return;
    }

    // check for objects that are not arrays
    if (!isArray(src) || !isArray(toReplace)) {

      // throw illegal argument exception for objects that are not arrays
      String msg = "Objects passed must be an array";
      throw new IllegalArgumentException(msg);
    }

    // get the Class type of the src array and its length, and the length of 
    // the replacement array
    Class srcClass = getArrayObjectsClass(src);
    int srcLength = getArrayLength(src);
    int replaceLength = getArrayLength(toReplace);

    // check for objects that are the wrong Class type
    if (!isInstance(toReplace, srcClass)) {

      // throw illegal argument exception for objects that are not arrays
      String msg = "Objects cannot be inserted into array, wrong Class type";
      throw new IllegalArgumentException(msg);
    }

    // if the src position is > the length of the src array or the number of 
    // elements to replace is <= 0
    if ((srcPos > srcLength) || (length <= 0)) {

      // don't replace any elements
      return;
    }

    // if the src position is < 0
    if (srcPos < 0) {

      // set the replace position to the beginning of the src array
      srcPos = 0;
    }

    // if the number of elements to replace is > the number of elements in 
    // the replacement array
    if (length > replaceLength) {

      // set the number of elements to the number in the replacement array
      length = replaceLength;
    }

    // if the elements to replace go beyond the end of the src array
    if ((srcPos + length) >= srcLength) {

      // only go to the end of the src array
      length = srcLength - srcPos;
    }

    // replace the elements of the src array with the elements of the 
    // replacement array
    System.arraycopy(toReplace, 0, src, srcPos, length);
  }

  /**
   * Replaces elments of one array with the elements of another array starting
   * at the given position. A new array is returned.  The src array is not
   * modified.<p>
   *
   * The elements are replaced starting at the srcPos index and the 0 index of
   * the toReplace array and continuing until the end of the either the src or
   * the toReplace array.<p>
   *
   * If the src array is <code>null</code>, <code>null</code> is returned.  If
   * the replacement array is <code>null</code>, a copy of the unmodified src
   * array is returned.  If either Object passed is not an array, an exception
   * is thrown.  If the replacement elements are of the wrong Class to be
   * inserted into the src array, an exception is thrown.<p>
   *
   * If the src position is < 0, the start position will be 0, or the beginning
   * of the array.  If the src position is >= the length of the array, then the
   * original src array is returned.<p>
   *
   * <pre>
   *   ArrayUtils.copyReplace(null, {1,2}, 1)                = null
   *   ArrayUtils.copyReplace({1,2,3}, null, 1)              = {1,2,3}
   *   ArrayUtils.copyReplace({"1","2","3"}, {1,2}, 1)       = Exception
   *   ArrayUtils.copyReplace({1,2,3}, {1,2}, -1)            = {1,2,3}
   *   ArrayUtils.copyReplace({1,2,3}, {1,2}, 5)             = {1,2,3}
   *   ArrayUtils.copyReplace({1,2,3}, {1,2}, -1)            = {1,2,3}
   *   ArrayUtils.copyReplace({3,2,1}, {1,2}, -1)            = {1,2,1}
   *   ArrayUtils.copyReplace({1,2,3}, {1,2}, 2)             = {1,2,1}
   *   ArrayUtils.copyReplace({1,2,3}, {1,2}, 1)             = {1,1,3}
   * </pre><p>
   *
   * @param src The source array.
   * @param toReplace The replacement elements array.
   * @param srcPos The index in the src array to replace the elements.
   *
   * @return Object A new array holding the objects of the src array with the
   * elements replaced by the elements of the replacement array.
   */
  public static Object copyReplace(Object src, Object toReplace, int srcPos) {

    // get the length of the replacement array
    int replaceLength = getArrayLength(toReplace);

    // call the overloaded method to replace the elements of the src array and
    // return the replaced array
    return copyReplace(src, toReplace, srcPos, replaceLength);
  }

  /**
   * Replaces elments of one array with the elements of another array starting
   * at the given position for length number of elements.  A new array is returned.
   * The src array is not modified.<p>
   *
   * The elements are replaced starting at the srcPos index and the 0 index of
   * the toReplace array and continuing until the end of the either the src or
   * the toReplace array.<p>
   *
   * If the src array is <code>null</code>, <code>null</code> is returned.  If
   * the replacement array is <code>null</code>, a copy of the unmodified src
   * array is returned.  If either Object passed is not an array, an exception
   * is thrown.  If the replacement elements are of the wrong Class to be
   * inserted into the src array, an exception is thrown.<p>
   *
   * If the src position is < 0, the start position will be 0, or the beginning
   * of the array.  If the src position is >= the length of the array, then no
   * elements are replaced.  If the length to replace is <= 0 then no elements
   * are replaced.  If the length is > the number of elements in the replace
   * array, the entire array is used as replacement elements.  If the srcPos +
   * length is >= the length of the src array, the number of elements replaced
   * will be the length of the src array - srcPos.<p>
   *
   * <pre>
   *   ArrayUtils.copyReplace(null, {1,2}, 1, 2)                = null
   *   ArrayUtils.copyReplace({1,2,3}, null, 1, 2)              = {1,2,3}
   *   ArrayUtils.copyReplace({"1","2","3"}, {1,2}, 1, 2)       = Exception
   *   ArrayUtils.copyReplace({1,2,3}, {1,2}, -1, 2)            = {1,2,3}
   *   ArrayUtils.copyReplace({1,2,3}, {1,2}, 5, 2)             = {1,2,3}
   *   ArrayUtils.copyReplace({1,2,3}, {1,2}, -1, -1)           = {1,2,3}
   *   ArrayUtils.copyReplace({3,2,1}, {1,2}, -1, 2)            = {1,2,1}
   *   ArrayUtils.copyReplace({1,2,3}, {1,2}, 2, 5)             = {1,2,1}
   *   ArrayUtils.copyReplace({1,2,3}, {1,2}, 1, 1)             = {1,1,3}
   * </pre><p>
   *
   * @param src The source array.
   * @param toReplace The replacement elements array.
   * @param srcPos The index in the src array to replace the elements.
   *
   * @return Object A new array holding the objects of the src array with the
   * elements replaced by the elements of the replacement array.
   */
  public static Object copyReplace(Object src, Object toReplace, int srcPos,
    int length) {

    // get a copy of the src array and call the replace method with it
    Object srccopy = copy(src, 0);
    replace(srccopy, toReplace, srcPos, length);

    // return the copy of the src array with its elements replaced
    return srccopy;
  }

  /**
   * Returns a new array holding the Objects of the src array with the Object
   * at the given position deleted.<p>
   *
   * If the src array is <code>null</code>, <code>null</code> is returned.  If
   * the Object passed is not an array, an exception is thrown.<p>
   *
   * If the position is < 0 or >= the length of the src array, a copy of the
   * src array is returned.<p>
   *
   * <pre>
   *   ArrayUtils.delete(null, 1)                = null
   *   ArrayUtils.delete({1,2,3}, 1)             = {1,3}
   *   ArrayUtils.delete({1,2,3}, -1)            = {1,2,3}
   *   ArrayUtils.delete({1,2,3}, 5)             = {1,2,3}
   * </pre><p>
   *
   * @param src The source array.
   * @param position The position to delete.
   *
   * @return Object A new array holding the objects of the src array with the
   * position deleted.
   */
  public static Object delete(Object src, int position) {

    // call the overloaded method and return the array with the postition
    // deleted
    return delete(src, position, 1);
  }

  /**
   * Returns a new array holding the Objects of the src array with the Objects
   * starting at the given position for length number of objects deleted.<p>
   *
   * If the src array is <code>null</code>, <code>null</code> is returned.  If
   * the Object passed is not an array, an exception is thrown.<p>
   *
   * If the position is < 0 or >= the length of the src array, or the length to
   * delete is <= 0, a copy of the src array is returned. If the position +
   * length is >= the length of the src array, the number of elements deleted
   * will be the length of the src array - position, starting at the position.
   * <p>
   *
   * <pre>
   *   ArrayUtils.delete(null, 1, 2)                = null
   *   ArrayUtils.delete({1,2,3}, 1, 2)             = {1}
   *   ArrayUtils.delete({1,2,3}, -1, 2)            = {1,2,3}
   *   ArrayUtils.delete({1,2,3}, 5, 2)             = {1,2,3}
   *   ArrayUtils.delete({1,2,3}, 1, -1)            = {1,2,3}
   *   ArrayUtils.delete({3,2,1}, 0, 5)             = {}
   *   ArrayUtils.delete({1,2,3}, 2, 4)             = {1,2}
   * </pre><p>
   *
   * @param src The source array.
   * @param position The position to delete.
   * @param length The number of elements to delete.
   *
   * @return Object A new array holding the objects of the src array with the
   * length number of elements deleted, starting at the position.
   */
  public static Object delete(Object src, int position, int length) {

    // if the array is null or length is a negative or 0
    if ((src == null) || (length <= 0)) {

      // return the original array
      return copy(src);
    }

    // check for objects that are not arrays
    if (!isArray(src)) {

      // throw illegal argument exception for objects that are not arrays
      String msg = "Object passed must be an array";
      throw new IllegalArgumentException(msg);
    }

    // check for invalid position
    if ((position < 0) || (position >= getArrayLength(src)) || isEmpty(src)) {

      // return a copy of the src array
      return copy(src);
    }

    // get the length of the new array and its Class 
    int srcLength = getArrayLength(src);
    Class arrayType = getArrayClass(src);

    // if the elements to delete go beyond the end of the src array
    if ((position + length) >= srcLength) {

      // only go to the end of the src array
      length = srcLength - position;
    }

    // get an array of the correct type and length
    Object deleted = getArray(arrayType, srcLength - length);

    // copy the src array object from 0 to the start of the delete position
    System.arraycopy(src, 0, deleted, 0, position);

    // copy the src array objects are the delete portion
    System.arraycopy(src, position + length, deleted, position, srcLength
      - (position + length));

    // return the array with the objects deleted
    return deleted;
  }

  /**
   * Returns a copy of the array passed.<p>
   *
   * If the array is <code>null</code> <code>null</code> is returned.  If
   * the Object passed is not an array, an exception is thrown.<p>
   *
   * <pre>
   *   ArrayUtils.copy(null)                = null
   *   ArrayUtils.copy({})                  = {}
   *   ArrayUtils.copy({1,2})               = {1,2}
   * </pre><p>
   *
   * @param src The source array.
   *
   * @return Object A new array holding a copy of the src array objects or
   * <code>null</code> if either array is <code>null</code>.
   */
  public static Object copy(Object src) {

    // get the length of the src array
    int srcLength = getArrayLength(src);

    // call the overloaded method and return the copied array
    return copy(src, 0, srcLength);
  }

  /**
   * Returns a copy of the array passed from the position to the end of the
   * array.<p>
   *
   * If the array is <code>null</code> <code>null</code> is returned.  If the
   * Object passed is not an array, an exception is thrown.  If the position
   * is < 0 then the position is set to 0 or the beginning of the array.  If
   * the position is >= the length of the array an empty array of the correct
   * class type is returned.<p>
   *
   * <pre>
   *   ArrayUtils.copy(null, 1)                = null
   *   ArrayUtils.copy({}, 1)                  = {}
   *   ArrayUtils.copy({1,2}, 0)               = {1,2}
   *   ArrayUtils.copy({1,2}, 1)               = {2}
   *   ArrayUtils.copy({1,2}, 3)               = {}
   *   ArrayUtils.copy({1,2}, -2)              = {1,2}
   * </pre><p>
   *
   * @param src The source array.
   *
   * @return Object A new array holding a copy of the src array objects or
   * <code>null</code> if either array is <code>null</code>.
   */
  public static Object copy(Object src, int position) {

    // get the length of the src array
    int srcLength = getArrayLength(src);

    // call the overloaded method and return the copied array
    return copy(src, position, srcLength);
  }

  /**
   * Returns a copy of the array passed from the position holding the length
   * number of elements.<p>
   *
   * If the array is <code>null</code> <code>null</code> is returned.  If the
   * Object passed is not an array, an exception is thrown.  If the position
   * is < 0 then the position is set to 0 or the beginning of the array.  If
   * the position is >= the length of the array or lenth <= 0, an empty array
   * of the correct class type is returned.  If the position + length is >= the
   * length of the src array, the number of elements copied will be the length
   * of the src array - position, starting at the position.<p>
   *
   * <pre>
   *   ArrayUtils.copy(null, 1, 1)                = null
   *   ArrayUtils.copy({}, 1, 1)                  = {}
   *   ArrayUtils.copy({1,2}, 0, 1)               = {1,2}
   *   ArrayUtils.copy({1,2}, 1, 1)               = {2}
   *   ArrayUtils.copy({1,2,3,4}, 0, 4)           = {1,2,3,4}
   *   ArrayUtils.copy({1,2}, 1, 0)               = {}
   *   ArrayUtils.copy({1,2}, 1, -3)              = {}
   *   ArrayUtils.copy({1,2}, -2, 1)              = {1}
   * </pre><p>
   *
   * @param src The source array.
   *
   * @return Object A new array holding a copy of the src array objects or
   * <code>null</code> if either array is <code>null</code>.
   */
  public static Object copy(Object src, int pos, int length) {

    // if the array is nul
    if (src == null) {

      // return null
      return null;
    }

    // check for objects that are not arrays
    if (!isArray(src)) {

      // throw illegal argument exception for objects that are not arrays
      String msg = "Object passed must be an array";
      throw new IllegalArgumentException(msg);
    }

    int srcLength = getArrayLength(src);
    Class arrayType = getArrayClass(src);

    // if the src position is > the length of the src array
    if ((pos >= srcLength) || (length <= 0)) {

      return getArray(arrayType, 0);
    }

    // if the src position is < 0
    if (pos < 0) {

      // set the insert position to the beginning of the src array
      pos = 0;
    }

    // if the number of elements to insert is > the number of elements in 
    // the insert array
    if ((pos + length) >= srcLength) {

      // set the number of elements to the number in the insert array
      length = (srcLength - pos);
    }

    Object copy = getArray(arrayType, length);
    System.arraycopy(src, pos, copy, 0, length);

    return copy;
  }

  /**
   * Converts an array to the Class given.  See <code>convert(Object,Class)</code>
   * for a full explanation.<p>
   *
   * If the source array is <code>null</code>, <code>null</code> is returned.
   * If the Class type of the array can only be converted to a generic Object,
   * a copy of the source array is returned.<p>
   *
   * This method is most useful when you need to convert a generic Object array
   * holding all of the same Class of objects to an array of that Class.<p>
   *
   * <pre>
   *   ArrayUtils.convert(null)                = null
   *   ArrayUtils.convert(String{"1","2"})     = String{"1","2"}
   *   ArrayUtils.convert(Object{"1","2"})     = String{"1","2"}
   * </pre><p>
   *
   * @param source The Object array to convert.
   *
   * @return Object The newly created array holding the elements of the source
   * converted to the new Class or <code>null</code> if the source array is
   * <code>null</code>.
   */
  public static Object convert(Object source) {

    // if the array is null
    if (source == null) {

      // cannot be converted return null
      return null;
    }

    // get the Class of the array
    Class sourceType = getArrayObjectsClass(source);

    // if the Class is null, means cannot be determined
    if (sourceType == null) {

      // cannot be converted return null
      return null;
    }

    // if generic Object array
    if (sourceType.equals(Object.class)) {

      // conversion won't help, return copy of the source array
      return copy(source);
    }

    // return the converted array, call the overloaded method
    return convert(source, sourceType);
  }

  /**
   * Converts an array to the Class given.<p>
   *
   * Because of casting restrictions of Object arrays, an array created as an
   * Object array, even if it holds all the same type of objects cannot be cast
   * to the specific array type.  For example, A String array that has been
   * assigned to an Object array can be recast to a String array but an array
   * that has been created as an Object array and then filled with String objects
   * cannot be cast to a String array.<p>
   *
   * If the objects in the source array are not instances of the given Class
   * an exception is thrown.  If either the source array or the array Class is
   * <code>null</code>, <code>null</code> is returned.<p>
   *
   * A generic Object Class is returned.  This Object must be cast to the
   * correct array type to be used upon return.<p>
   *
   * Below is an example of how to use this utility method.
   * <pre>
   *
   *   Object[] objects = new Object[]{"String one", "String two"};
   *   // String[] strings = (String[])objects; -- will cause exception
   *
   *   String[] strings =
   *      (String[])ArrayUtils.convertArray(objects, String.class);
   *      // could also be written as (objects, new String.getClass())
   *
   * </pre><p>
   *
   * Below are examples of what this method should return.
   *
   * <pre>
   *   ArrayUtils.convert(null, 5)                         = null
   *   ArrayUtils.convert({"1","2"}, null)                 = null
   *   ArrayUtils.convert({"1","2"}, Serializable.class)   = Serializable{"1","2"}
   *   ArrayUtils.convert(Object{"1","2"}, String.class)   = String{"1","2"}
   * </pre><p>
   *
   * As you will notice in the example the array type passed is the type of
   * base object that will be stored in the array.  For example a String array
   * holds String objects and not String array objects.  Therefore the class type
   * passed would be String <code>String.class</code> and not String array
   * <code>String[].class</code>
   *
   * @param source The Object array to convert.
   * @param arrayType The Class of objects that will be held in the new array.
   *
   * @return Object The newly created array holding the elements of the source
   * converted to the new Class or <code>null</code> if either the source array
   * or the arrayType is <code>null</code>.
   */
  public static Object convert(Object source, Class arrayType) {

    // check for null array and Class
    if ((source == null) || (arrayType == null)) {

      // array cannot be converted, return null
      return null;
    }

    // check for objects that are not arrays
    if (!isArray(source)) {

      // throw illegal argument exception for objects that are not arrays
      String msg = "Object passed must be an array";
      throw new IllegalArgumentException(msg);
    }

    // get the length of the source array
    int length = ArrayUtils.getArrayLength(source);

    // create an array of the correct type and length
    Object dest = Array.newInstance(arrayType, length);

    // copy the objects to the new array
    System.arraycopy(source, 0, dest, 0, length);

    // return the converted array
    return dest;
  }

  /**
   * Returns a new array will all <code>null</code> objects removed.<p>
   *
   * If the array is <code>null</code> <code>null</code> is returned.  If the
   * Object passed is not a reference array, an exception is thrown.<p>
   *
   * <pre>
   *   ArrayUtils.removeNulls(null)                 = null
   *   ArrayUtils.removeNulls({"1", null, "2"})     = {"1","2"}
   *   ArrayUtils.removeNulls({null, null, "2"})    = {"2"}
   *   ArrayUtils.removeNulls({1,2})                = Exception
   * </pre><p>
   *
   * @param array The source array.
   *
   * @return Object A new array holding the objects of the src array with
   * <code>null</code> objects removed.
   */
  public static Object removeNulls(Object array) {

    // if the array is null
    if (array == null) {

      // return the original array
      return null;
    }

    // check for objects that are not arrays
    if (!isReferenceArray(array)) {

      // throw illegal argument exception for objects that are not arrays
      String msg = "Object passed must be a reference array";
      throw new IllegalArgumentException(msg);
    }

    // get an object array and a list to hold the non null objects
    Object[] objects = toObjectArray(array);
    ArrayList objList = new ArrayList();

    // loop through the objects
    for (int i = 0; i < objects.length; i++) {

      // get the current object
      Object arObj = objects[i];

      // if it is a non null object
      if (arObj != null) {

        // add it to the list
        objList.add(arObj);
      }
    }

    // convert the complete list
    Object converted = convert(objList.toArray());

    // return the converted array
    return converted;
  }

  public static Object remove(Object array, Object toRemove) {

    return remove(array, toRemove, 0);
  }

  public static Object remove(Object array, Object toRemove, int position) {

    // check for objects that are not arrays
    if (!isArray(array)) {

      // throw illegal argument exception for objects that are not arrays
      String msg = "Objects passed must be an array";
      throw new IllegalArgumentException(msg);
    }

    // if the array is null
    if (isEmpty(array)) {

      // return the original array
      return array;
    }

    // if the object to remove is null
    if (toRemove == null) {

      // remove null by calling static method
      return removeNulls(array);
    }

    // set the flag if it is a primitive array
    boolean isPrimitive = false;
    if (isPrimitiveArray(array)) {
      isPrimitive = true;
    }

    // get the length of the array we are removing objects from
    int length = getArrayLength(array);

    // if the position to start is past the end of the array
    if (position >= length) {

      // make no changes to the original array
      return array;
    }

    // if the position is negative
    if (position < 0) {

      // set the start position to 0;
      position = 0;
    }

    // get an object array and a list to hold the non null objects
    Object[] objects = toObjectArray(array);
    ArrayList objList = new ArrayList();

    // loop through the objects
    for (int i = position; i < objects.length; i++) {

      // get the current object
      Object arObj = objects[i];

      // if the object is not the object to remove
      if (!arObj.equals(toRemove)) {

        // add it to the list
        objList.add(arObj);
      }
    }

    // convert the complete list
    Object converted = convert(objList.toArray());

    // if it was originally a primitive array
    if (isPrimitive) {

      // convert it back to a primitive array
      converted = toPrimitiveArray(converted);
    }

    // return the converted array
    return converted;
  }

  public static Object removeAll(Object array, Object removeAr) {

    return removeAll(array, removeAr, 0);
  }

  public static Object removeAll(Object array, Object removeAr, int position) {

    // check for objects that are not arrays
    if (!isArray(array) || !isArray(removeAr)) {

      // throw illegal argument exception for objects that are not arrays
      String msg = "Objects passed must be an array";
      throw new IllegalArgumentException(msg);
    }

    // if the array is null
    if (isEmpty(array) || isEmpty(removeAr)) {

      // return the original array
      return array;
    }

    // set the flag if it is a primitive array
    boolean isPrimitive = false;
    if (isPrimitiveArray(array)) {
      isPrimitive = true;
    }

    // get the length of the array we are removing objects from
    int length = getArrayLength(array);

    // if the position to start is past the end of the array
    if (position >= length) {

      // make no changes to the original array
      return array;
    }

    // if the position is negative
    if (position < 0) {

      // set the start position to 0;
      position = 0;
    }

    // get an object array and a list to hold the non null objects
    Object[] objects = toObjectArray(array);
    ArrayList objList = new ArrayList();

    // loop through the objects
    for (int i = position; i < objects.length; i++) {

      // get the current object
      Object arObj = objects[i];

      // if the object is not one of the objects to remove
      if (!contains(removeAr, arObj)) {

        // add it to the list
        objList.add(arObj);
      }
    }

    // convert the complete list
    Object converted = convert(objList.toArray());

    // if it was originally a primitive array
    if (isPrimitive) {

      // convert it back to a primitive array
      converted = toPrimitiveArray(converted);
    }

    // return the converted array
    return converted;
  }

  /**
   * Returns a new array will the objects in reverse order.<p>
   *
   * If the array is <code>null</code> <code>null</code> is returned.<p>
   *
   * <pre>
   *   ArrayUtils.reverse(null)             = null
   *   ArrayUtils.reverse({"1", "2"})       = {"2","1"}
   *   ArrayUtils.reverse({"2"})            = {"2"}
   *   ArrayUtils.reverse({1,2})            = {2,1}
   * </pre><p>
   *
   * @param array The source array.
   *
   * @return Object A new array holding the objects of the src array in
   * reverse order.
   */
  public static Object reverse(Object array) {

    // if the array is null
    if (array == null) {

      // cannot be reversed return null
      return null;
    }

    // check for objects that are not arrays
    if (!isArray(array)) {

      // throw illegal argument exception for objects that are not arrays
      String msg = "Object passed must be an array";
      throw new IllegalArgumentException(msg);
    }

    // get an object array from the array passed and check if primtive array
    Object[] objects = toObjectArray(array);
    boolean isPrimitive = isPrimitiveArray(array);

    // create a new Object array to hold reversed objects
    Object[] newobjs = new Object[objects.length];

    // loop backwards through the array
    for (int i = (objects.length - 1), j = 0; (i >= 0) && (j < objects.length); i--, j++) {

      // add the reversed objects
      newobjs[j] = objects[i];
    }

    // convert the reversed array
    Object converted = convert(newobjs);

    // if it was primitive, convert to primitive array and return, otherwise
    // just return the converted array
    return (isPrimitive) ? toPrimitiveArray(converted) : converted;
  }

  /**
   * Returns <code>true</code> if the Object passed is contained in the array.<p>
   *
   * If the array is <code>null</code>, false is returned.<p>
   *
   * <pre>
   *   ArrayUtils.contains(null, "1")             = false
   *   ArrayUtils.contains({"1"}, null)           = false
   *   ArrayUtils.contains({"1", null}, null)     = true
   *   ArrayUtils.contains({"1", "2"}, "2")       = true
   *   ArrayUtils.contains({"2"}, "3")            = false
   * </pre><p>
   *
   * @param array The source array.
   * @param toFind The object to find in the array.
   *
   * @return boolean True if the object to find is contained in the array.
   */
  public static boolean contains(Object array, Object toFind) {

    // if the array is null
    if (array == null) {

      // cannot be reversed return false
      return false;
    }

    // check for objects that are not arrays
    if (!isArray(array)) {

      // throw illegal argument exception for objects that are not arrays
      String msg = "Object passed must be an array";
      throw new IllegalArgumentException(msg);
    }

    // if the object is in the array
    if (indexOf(array, toFind) >= 0) {

      // is contained in the array, return true
      return true;
    }

    // otherwise not in the array, return false
    return false;
  }

  /**
   * Returns <code>true</code> if the array contains only objects from the
   * toFind array.<p>
   *
   * If either array is <code>null</code>, false is returned.<p>
   *
   * <pre>
   *   ArrayUtils.containsOnly(null, "1")                     = false
   *   ArrayUtils.containsOnly({"1"}, null)                   = false
   *   ArrayUtils.containsOnly({"1", "2"}, {"2"})             = false
   *   ArrayUtils.containsOnly({"2", null}, {"2", null})      = true
   *   ArrayUtils.containsOnly({"2"}, {"1", "2"})             = true
   * </pre><p>
   *
   * @param array The source array.
   * @param toFind The objects to find array.
   *
   * @return boolean True if the object to find is contained in the array.
   */
  public static boolean containsOnly(Object array, Object toFind) {

    // if either array is null
    if ((array == null) || (toFind == null)) {

      // cannot be reversed return false
      return false;
    }

    // check for objects that are not arrays
    if (!isArray(array) || !isArray(toFind)) {

      // throw illegal argument exception for objects that are not arrays
      String msg = "Objects passed must be an arrays";
      throw new IllegalArgumentException(msg);
    }

    // get the arrays as object arrays
    Object[] objects = toObjectArray(array);
    Object[] toFindObjs = toObjectArray(toFind);

    // loop through the objects beginning at the start position
    for (int i = 0; i < objects.length; i++) {

      // if the object is not in the toFind array
      if (!contains(toFindObjs, objects[i])) {

        // not contains only, return false
        return false;
      }
    }

    // objects all in the toFind array
    return true;
  }

  /**
   * Returns <code>true</code> if the array contains any of the objects from
   * the toFind array.<p>
   *
   * If either array is <code>null</code>, false is returned.<p>
   *
   * <pre>
   *   ArrayUtils.containsAny(null, "1")                     = false
   *   ArrayUtils.containsAny({"1"}, null)                   = false
   *   ArrayUtils.containsAny({"1", "2"}, {"2"})             = true
   *   ArrayUtils.containsAny({"2", null}, {null})           = true
   *   ArrayUtils.containsAny({"2"}, {"1", "3"})             = false
   * </pre><p>
   *
   * @param array The source array.
   * @param toFind The objects to find array.
   *
   * @return boolean True if any of the objects to find are contained in the
   * array.
   */
  public static boolean containsAny(Object array, Object toFind) {

    // if the array is null or the Object to find is null
    if ((array == null) || (toFind == null)) {

      // cannot be reversed return false
      return false;
    }

    // check for objects that are not arrays
    if (!isArray(array) || !isArray(toFind)) {

      // throw illegal argument exception for objects that are not arrays
      String msg = "Objects passed must be an arrays";
      throw new IllegalArgumentException(msg);
    }

    // get the arrays as object arrays
    Object[] objects = toObjectArray(array);
    Object[] toFindObjs = toObjectArray(toFind);

    // get the same in the arrays, should be at least 1 for any
    return (getArrayLength(same(objects, toFindObjs)) > 0);
  }

  /**
   * Returns <code>true</code> if the array contains none of the objects from
   * the toFind array.<p>
   *
   * If either array is <code>null</code>, false is returned.<p>
   *
   * <pre>
   *   ArrayUtils.containsNone(null, "1")                     = false
   *   ArrayUtils.containsNone({"1"}, null)                   = false
   *   ArrayUtils.containsNone({"1", "2"}, {"2"})             = false
   *   ArrayUtils.containsNone({"2", null}, {null})           = false
   *   ArrayUtils.containsNone({"2"}, {"1", "3"})             = true
   * </pre><p>
   *
   * @param array The source array.
   * @param toFind The objects to find array.
   *
   * @return boolean True if none of the objects to find are contained in 
   * the array.
   */
  public static boolean containsNone(Object array, Object toFind) {

    // if the array is null or the Object to find is null
    if ((array == null) || (toFind == null)) {

      // cannot be reversed return false
      return false;
    }

    // check for objects that are not arrays
    if (!isArray(array) || !isArray(toFind)) {

      // throw illegal argument exception for objects that are not arrays
      String msg = "Objects passed must be an arrays";
      throw new IllegalArgumentException(msg);
    }

    // get the arrays as object arrays
    Object[] objects = toObjectArray(array);
    Object[] toFindObjs = toObjectArray(toFind);

    // get the same in the arrays, should be none so length should be 0
    return (getArrayLength(same(objects, toFindObjs)) == 0);
  }

  /**
   * Returns <code>true</code> if the array contains any <code>null</code>
   * Objects.<p>
   *
   * If the array is <code>null</code>, false is returned.<p>
   *
   * <pre>
   *   ArrayUtils.containsNulls(null)                    = false
   *   ArrayUtils.containsNulls({"1"})                   = false
   *   ArrayUtils.containsNulls({"1", null})             = true
   * </pre><p>
   *
   * @param array The source array.
   *
   * @return boolean True if the array contains null objects.
   */
  public static boolean containsNulls(Object array) {

    // primitive array cannot have null values
    if (isPrimitiveArray(array)) {

      // return no null values
      return false;
    }

    // otherwise it is a reference array, check if it contains nulls
    return contains(array, null);
  }

  /**
   * Returns a new array will the objects that are the same in both arrays.<p>
   *
   * If either array is <code>null</code> <code>null</code> is returned. If
   * either object is not an array, an exception is thrown.<p>
   *
   * <pre>
   *   ArrayUtils.same(null, {"1", "2"})       = null
   *   ArrayUtils.same({"1", "2"}, null)       = null
   *   ArrayUtils.same({1, 2}, {2})            = {2}
   *   ArrayUtils.same({"1", "2"}, {"2"})      = {"2"}
   *   ArrayUtils.same({"1", "2"}, {2, 1})     = Object{}
   *   ArrayUtils.same({"1", "2"}, String{})   = String{}
   * </pre><p>
   *
   * @param array The source array.
   *
   * @return Object A new array holding the objects of the src array in
   * reverse order.
   */
  public static Object same(Object first, Object second) {

    // check for null objects passed
    if ((first == null) || (second == null)) {

      // return null class type
      return null;
    }

    // check for objects that are not arrays
    if (!isArray(first) || !isArray(second)) {

      // throw illegal argument exception
      String msg = "Objects passed must be an arrays";
      throw new IllegalArgumentException(msg);
    }

    // get the arrays common Class
    Class outClass = getArraysClass(first, second);

    // if there is no common array class, not even Object it means we got
    // a primitive array and a reference array 
    if (outClass == null) {

      // return an empty object array, none are the same
      return EMPTY_OBJECT_ARRAY;
    }

    // are both arrays primitive arrays
    boolean arePrimitiveArs = isPrimitiveArray(first)
      && isPrimitiveArray(second);

    // get the Object array versions of each array and a set to hold the
    // same objects, no duplicates
    Object[] firstAr = toObjectArray(first);
    Object[] secondAr = toObjectArray(second);
    LinkedHashSet sameObjs = new LinkedHashSet();

    // loop through the first array
    for (int i = 0; i < firstAr.length; i++) {

      // if the second array contains the Object from the first
      if (contains(secondAr, firstAr[i])) {

        // add the Object to the set
        sameObjs.add(firstAr[i]);
      }
    }

    // get all objects from the set
    Object[] sameAr = sameObjs.toArray();

    // if the arrays were originally primitive arrays and the current
    // Object array is a wrapper array
    if (arePrimitiveArs && isWrapperArray(sameAr)) {

      // convert to its primitive array are return
      return toPrimitiveArray(sameAr);
    }

    // otherwise try a best match conversion and return
    return (outClass.equals(Object.class)) ? convert(sameAr) : convert(sameAr,
      outClass);
  }

  /**
   * Returns a new array will the objects that are the different in both arrays.
   * Meaning the objects that are not in both arrays.<p>
   *
   * If either array is <code>null</code> <code>null</code> is returned. If
   * either object is not an array, an exception is thrown.<p>
   *
   * <pre>
   *   ArrayUtils.different(null, {"1", "2"})       = null
   *   ArrayUtils.different({"1", "2"}, null)       = null
   *   ArrayUtils.different({"1", "2"}, {"2"})      = {"1"}
   *   ArrayUtils.different({1, 2}, {2})            = {1}
   *   ArrayUtils.different({"1", "2"}, {2, 1})     = Object{}
   *   ArrayUtils.different({"1", "2"}, String{})   = String{}
   * </pre><p>
   *
   * @param array The source array.
   *
   * @return Object A new array holding the objects of the src array in
   * reverse order.
   */
  public static Object different(Object first, Object second) {

    // check for null objects passed
    if ((first == null) || (second == null)) {

      // return null class type
      return null;
    }

    // check for objects that are not arrays
    if (!isArray(first) || !isArray(second)) {

      // throw illegal argument exception
      String msg = "Objects passed must be an arrays";
      throw new IllegalArgumentException(msg);
    }

    // get the arrays common Class
    Class outClass = getArraysClass(first, second);

    // if there is no common array class, not even Object it means we got
    // a primitive array and a reference array 
    if (outClass == null) {

      // return an empty object array, none are the same
      return EMPTY_OBJECT_ARRAY;
    }

    // are both arrays primitive arrays
    boolean arePrimitiveArs = isPrimitiveArray(first)
      && isPrimitiveArray(second);

    // get the Object array versions of each array and a set to hold the
    // different objects, no duplicates
    Object[] firstAr = toObjectArray(first);
    Object[] secondAr = toObjectArray(second);
    LinkedHashSet sameObjs = new LinkedHashSet();

    // loop through the first array
    for (int i = 0; i < firstAr.length; i++) {

      // if the second array does not contain the Object from the first
      if (!contains(secondAr, firstAr[i])) {

        // add the Object to the set
        sameObjs.add(firstAr[i]);
      }
    }

    // loop through the second array
    for (int i = 0; i < secondAr.length; i++) {

      // if the first array does not contain the Object from the second
      if (!contains(firstAr, secondAr[i])) {

        // add the Object to the set
        sameObjs.add(secondAr[i]);
      }
    }

    // get all of the objects from the set
    Object[] sameAr = sameObjs.toArray();

    // if the arrays were originally primitive arrays and the current
    // Object array is a wrapper array
    if (arePrimitiveArs && isWrapperArray(sameAr)) {

      // convert to its primitive array are return
      return toPrimitiveArray(sameAr);
    }

    // otherwise try a best match conversion and return
    return (outClass.equals(Object.class)) ? convert(sameAr) : convert(sameAr,
      outClass);
  }

  /**
   * Returns the first index in the array that holds the object to find or -1
   * if the object is not in the array.<p>
   *
   * If the array is <code>null</code> -1 is returned.  If the Object to find
   * is <code>null</code> the index of the first <code>null</code> Object will
   * be returned.<p>
   *
   * <pre>
   *   ArrayUtils.indexOf(null, "1")             = -1
   *   ArrayUtils.indexOf({"1"}, null)           = -1
   *   ArrayUtils.indexOf({"1", null}, null)     = 1
   *   ArrayUtils.indexOf({"1", "2"}, "2")       = 1
   *   ArrayUtils.indexOf({"2"}, "3")            = -1
   * </pre><p>
   *
   * @param array The source array.
   * @param toFind The object to find in the array.
   *
   * @return int The index of the object or -1 if the object is not found in
   * the array.
   */
  public static int indexOf(Object array, Object toFind) {

    // call the overloaded method with a start position of 0 and return
    return indexOf(array, toFind, 0);
  }

  /**
   * Returns the first index in the array that holds the object to find starting
   * at the given position or -1 if the object is not in the array.<p>
   *
   * If the array is <code>null</code> -1 is returned.  If the Object to find is
   * <code>null</code> the index of the first <code>null</code> Object starting
   * at the given position will be returned.  If the start position is < 0, start 
   * position will be set to 0, or the beginning of the array.<p>
   *
   * <pre>
   *   ArrayUtils.indexOf(null, "1", 1)                 = -1
   *   ArrayUtils.indexOf({"1"}, null, 1)               = -1
   *   ArrayUtils.indexOf({"1", null}, null, 1)         = 1
   *   ArrayUtils.indexOf({"1", "2","3","2"}, "2", 2)   = 3
   *   ArrayUtils.indexOf({"1", "2","3","2"}, "2", -1)  = 1
   *   ArrayUtils.indexOf({"2"}, "3", 1)                = -1
   * </pre><p>
   *
   * @param array The source array.
   * @param toFind The object to find in the array.
   *
   * @return int The index of the object or -1 if the object is not found in
   * the array.
   */
  public static int indexOf(Object array, Object toFind, int startPos) {

    // if the array is null
    if (array == null) {

      // indexOf cannot be determined
      return -1;
    }

    // check for objects that are not arrays
    if (!isArray(array)) {

      // throw illegal argument exception for objects that are not arrays
      String msg = "Object passed must be an array";
      throw new IllegalArgumentException(msg);
    }

    // check for negative start positions
    if (startPos < 0) {

      // set start position to 0
      startPos = 0;
    }

    // get the array as an object array
    Object[] objects = toObjectArray(array);

    // loop through the objects beginning at the start position
    for (int i = startPos; i < objects.length; i++) {

      // if the current object is null and we want to find nulls or the 
      // current object is the object to find
      if ((objects[i] == null && toFind == null)
        || (objects[i] != null && (objects[i].equals(toFind)))) {

        // return the index
        return i;
      }
    }

    // otherwise not in the array, return -1
    return -1;
  }

  /**
   * Returns the last index in the array that holds the object to find or -1
   * if the object is not in the array.<p>
   *
   * If the array is <code>null</code> -1 is returned.  If the Object to find
   * is <code>null</code> the index of the last <code>null</code> Object will
   * be returned.<p>
   *
   * <pre>
   *   ArrayUtils.lastIndexOf(null, "1")             = -1
   *   ArrayUtils.lastIndexOf({"1"}, null)           = -1
   *   ArrayUtils.lastIndexOf({"1", null}, null)     = 1
   *   ArrayUtils.lastIndexOf({"1", "2", "2"}, "2")  = 2
   *   ArrayUtils.lastIndexOf({"2"}, "3")            = -1
   * </pre><p>
   *
   * @param array The source array.
   * @param toFind The object to find in the array.
   *
   * @return int The index of the object or -1 if the object is not found in
   * the array.
   */
  public static int lastIndexOf(Object array, Object toFind) {

    // if the array is null
    if (array == null) {

      // cannot be determined return false
      return -1;
    }

    // check for objects that are not arrays
    if (!isArray(array)) {

      // throw illegal argument exception for objects that are not arrays
      String msg = "Object passed must be an array";
      throw new IllegalArgumentException(msg);
    }

    // get the array as an object array
    Object[] objects = toObjectArray(array);

    // loop through the array backwards
    for (int i = (objects.length - 1); i >= 0; i--) {

      // if the current object is null and we want to find nulls or the 
      // current object is the object to find
      if ((objects[i] == null && toFind == null)
        || (objects[i] != null && (objects[i].equals(toFind)))) {

        // return the index
        return i;
      }
    }

    // otherwise it is not in the array, return -1
    return -1;
  }

  /**
   * Returns the array passed if the Object is an array and is not null, else
   * a default empty array of the Class type is returned.<p>
   * 
   * If Class type passed is <code>null</code> a generic Object array is 
   * returned.<p>
   *
   * <pre>
   *   ArrayUtils.defaultArray(null, null)                    = Object{}
   *   ArrayUtils.defaultArray(null, int.class)               = int{}
   *   ArrayUtils.defaultArray({"1","2"}, String.class)       = {"1","2"}
   * </pre><p>
   *
   * @param array The Object to check.
   * @param type The Class type of the default array to return.
   *
   * @return Object The original array or a default array of the given Class
   * if the original array is null or is not an array.
   */
  public static Object defaultArray(Object array, Class type) {

    // if the array is not null and is an array, otherwise null it is not
    // an array
    if (array != null && isArray(array)) {

      // return the original array
      return array;
    }
    else if (type == null) {

      // null Class best we can do is an empty object array
      return EMPTY_OBJECT_ARRAY;
    }
    else {

      // get a default array of the class type with a length of 0
      return getArray(type, 0);
    }
  }

  public static List toList(Object array) {

    // if the object is null
    if (array == null) {

      // type Object array cannot be determined return false
      return null;
    }

    // check for objects that are not arrays
    if (!isArray(array)) {

      // throw illegal argument exception for objects that are not arrays
      String msg = "Object passed must be an array";
      throw new IllegalArgumentException(msg);
    }

    Object[] values = (isReferenceArray(array) ? (Object[])array
      : (Object[])toWrapperArray(array));
    List valList = new ArrayList();
    for (int i = 0; i < values.length; i++) {
      valList.add(values[i]);
    }
    
    return valList;
  }
  
  // TODO: join methods
  // TODO: repeat methods
}