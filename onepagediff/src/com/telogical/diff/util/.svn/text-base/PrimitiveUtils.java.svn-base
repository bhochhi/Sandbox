package com.telogical.diff.util;

import java.util.HashMap;
import java.util.Map;


/**
 * Utility methods for working with primatives.
 * <p>
 * The <code>wrap</code> and <code>unwrap</code> utility methods are static
 * overloaded methods that convert between primatives and their Object wrapper
 * values.  This provides a single entry point for primative conversions.
 */
public final class PrimitiveUtils {
   
   private static final Map wrappers;
   private static final Map primitives;
   
   static {
      
      HashMap wrapmap = new HashMap();
      wrapmap.put(Byte.class, byte.class);
      wrapmap.put(Short.class, short.class);
      wrapmap.put(Character.class, char.class);
      wrapmap.put(Integer.class, int.class);
      wrapmap.put(Boolean.class, boolean.class);
      wrapmap.put(Float.class, float.class);
      wrapmap.put(Long.class, long.class);
      wrapmap.put(Double.class, double.class);
      
      HashMap primmap = new HashMap();
      primmap.put(byte.class, Byte.class);
      primmap.put(short.class, Short.class);
      primmap.put(char.class, Character.class);
      primmap.put(int.class, Integer.class);
      primmap.put(boolean.class, Boolean.class);
      primmap.put(float.class, Float.class);
      primmap.put(long.class, Long.class);
      primmap.put(double.class, Double.class);
      
      wrappers = wrapmap;
      primitives = primmap;
   }
   

   /**
    * The PrimitiveUtils class should not be instantiated.  The methods in the
    * class should be called as static methods.<p>
    *
    * The PrimitiveUtils class has a public constructor to allow tools that create
    * JavaBean instances to use this class.
    */
   public PrimitiveUtils() {

   }

   /**
    * Converts the boolean value to a Boolean object.
    *
    * @param toBoolean The boolean value.
    *
    * @return Boolean The Boolean object holding the toBoolean boolean value.
    */
   public static Boolean wrap(boolean toBoolean) {

      // converts boolean value to Boolean object
      return new Boolean(toBoolean);
   }

   /**
    * Converts the char value to a Character object.
    *
    * @param toCharacter The char value.
    *
    * @return Character The Character object holding the toCharacter
    * char value.
    */
   public static Character wrap(char toCharacter) {

      // converts char value to Charactger object
      return new Character(toCharacter);
   }

   /**
    * Converts the byte value to a Byte object.
    *
    * @param toByte The byte value.
    *
    * @return Byte The Byte object holding the toByte byte value.
    */
   public static Byte wrap(byte toByte) {

      // converts byte value to Byte object
      return new Byte(toByte);
   }

   /**
    * Converts the short value to a Short object.
    *
    * @param toShort The short value.
    *
    * @return Short The Short object holding the toShort short value.
    */
   public static Short wrap(short toShort) {

      // converts short value to Short object
      return new Short(toShort);
   }

   /**
    * Converts the int value to a Integer object.
    *
    * @param toInteger The int value.
    *
    * @return Integer The Integer object holding the toInteger int value.
    */
   public static Integer wrap(int toInteger) {

      // converts int value to Integer object
      return new Integer(toInteger);
   }

   /**
    * Converts the float value to a Float object.
    *
    * @param toFloat The float value.
    *
    * @return Float The Float object holding the toFloat float value.
    */
   public static Float wrap(float toFloat) {

      // converts float value to Float object
      return new Float(toFloat);
   }

   /**
    * Converts the long value to a Long object.
    *
    * @param toLong The long value.
    *
    * @return Long The Long object holding the toLong long value.
    */
   public static Long wrap(long toLong) {

      // converts long value to Long object
      return new Long(toLong);
   }

   /**
    * Converts the double value to a Double object.
    *
    * @param toDouble The double value.
    *
    * @return Double The Double object holding the toDouble double value.
    */
   public static Double wrap(double toDouble) {

      // converts double value to Double object
      return new Double(toDouble);
   }

   /**
    * Converts the Boolean object to a boolean value.  If the object passed
    * is null then a boolean value of false is returned.
    *
    * @param toPrimative The Boolean object.
    *
    * @return boolean The boolean value of the object passed or false if the
    * object is null.
    */
   public static boolean unwrap(Boolean toPrimative) {

      // converts Boolean object to boolean value
      return (toPrimative != null) ? toPrimative.booleanValue()
                                   : false;
   }

   /**
    * Converts the Character object to a char value.  If the object passed
    * is null then a char value of '\0' is returned.
    *
    * @param toPrimative The Character object.
    *
    * @return char The char value of the object passed or '\0' if the
    * object is null.
    */
   public static char unwrap(Character toPrimative) {

      // converts Character object to char value
      return (toPrimative != null) ? toPrimative.charValue()
                                   : '\0';
   }

   /**
    * Converts the Byte object to a byte value.  If the object passed
    * is null then a byte value of '0' is returned.
    *
    * @param toPrimative The Byte object.
    *
    * @return byte The byte value of the object passed or '-1' if the
    * object is null.
    */
   public static byte unwrap(Byte toPrimative) {

      // converts Byte object to byte value
      return (toPrimative != null) ? toPrimative.byteValue()
                                   : (byte)-1;
   }

   /**
    * Converts the Short object to a short value.  If the object passed
    * is null then a short value of '0' is returned.
    *
    * @param toPrimative The Short object.
    *
    * @return short The short value of the object passed or '-1' if the
    * object is null.
    */
   public static short unwrap(Short toPrimative) {

      // converts Short object to short value
      return (toPrimative != null) ? toPrimative.shortValue()
                                   : (short)-1;
   }

   /**
    * Converts the Integer object to a int value.  If the object passed
    * is null then a int value of '-1' is returned.
    *
    * @param toPrimative The Integer object.
    *
    * @return int The int value of the object passed or '-1' if the
    * object is null.
    */
   public static int unwrap(Integer toPrimative) {

      // converts Integer object to int value
      return (toPrimative != null) ? toPrimative.intValue()
                                   : (-1);
   }

   /**
    * Converts the Float object to a float value.  If the object passed
    * is null then a float value of '-1F' is returned.
    *
    * @param toPrimitive The Float object.
    *
    * @return float The float value of the object passed or '-1F' if the
    * object is null.
    */
   public static float unwrap(Float toPrimitive) {

      // converts Float object to float value
      return (toPrimitive != null) ? toPrimitive.floatValue()
                                   : (-1F);
   }

   /**
    * Converts the Long object to a long value.  If the object passed
    * is null then a long value of '-1L' is returned.
    *
    * @param toPrimitive The Long object.
    *
    * @return long The long value of the object passed or '-1L' if the
    * object is null.
    */
   public static long unwrap(Long toPrimitive) {

      // converts Long object to long value
      return (toPrimitive != null) ? toPrimitive.longValue()
                                   : (-1L);
   }

   /**
    * Converts the Double object to a double value.  If the object passed
    * is null then a double value of '-1D' is returned.
    *
    * @param toPrimitive The Double object.
    *
    * @return boolean The double value of the object passed or '-1D' if the
    * object is null.
    */
   public static double unwrap(Double toPrimitive) {

      // converts Double object to double value
      return (toPrimitive != null) ? toPrimitive.doubleValue()
                                   : (-1D);
   }

   public static Class box(Class type) {
      
      return (Class)primitives.get(type);
   }
   
   public static Class unBox(Class type) {

      return (Class)wrappers.get(type);      
   }
}