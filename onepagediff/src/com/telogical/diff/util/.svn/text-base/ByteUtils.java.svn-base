package com.telogical.diff.util;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;

public final class ByteUtils {

  public ByteUtils() {

  }

  public static boolean toBoolean(byte[] bytes) {

    if (bytes == null || bytes.length == 0) {
      return false;
    }

    return (bytes[0] > 0);
  }

  public static byte[] fromBoolean(boolean boolval) {

    byte[] booleanBytes = new byte[1];
    booleanBytes[0] = (boolval) ? (byte)1 : (byte)0;

    return booleanBytes;
  }

  public static short toShort(byte[] bytes) {
    return toShort(bytes, 0);
  }

  public static short toShort(byte[] bytes, int start) {

    if (bytes == null || bytes.length == 0 || start >= bytes.length) {
      return 0;
    }

    int numCopy = ((start + 2) <= bytes.length) ? 2 : (bytes.length - start);
    short bShort = 0;

    for (int i = 0; i < numCopy; i++) {
      bShort += (short)(bytes[numCopy - (1 + i)] & 0xFF) << (8 * i);
    }

    return bShort;
  }

  public static byte[] fromShort(short shortval) {

    byte[] bytes = new byte[2];
    bytes[1] = (byte)shortval;

    shortval >>>= 8;
    bytes[0] = (byte)shortval;

    return bytes;
  }

  public static char toChar(byte[] bytes) {
    return toChar(bytes, 0);
  }

  public static char toChar(byte[] bytes, int start) {

    if (bytes == null || bytes.length == 0 || start >= bytes.length) {
      return '\u0000';
    }

    int numCopy = ((start + 2) <= bytes.length) ? 2 : (bytes.length - start);
    char bChar = 0;

    for (int i = 0; i < numCopy; i++) {
      bChar += (char)(bytes[numCopy - (1 + i)] & 0xFF) << (8 * i);
    }

    return bChar;
  }

  public static byte[] fromChar(char charval) {

    byte[] bytes = new byte[2];
    bytes[1] = (byte)charval;

    charval >>>= 8;
    bytes[0] = (byte)charval;

    return bytes;
  }

  public static int toInt(byte[] bytes) {
    return toInt(bytes, 0);
  }

  public static int toInt(byte[] bytes, int start) {

    if (bytes == null || bytes.length == 0 || start >= bytes.length) {
      return 0;
    }

    int numCopy = ((start + 4) <= bytes.length) ? 4 : (bytes.length - start);
    int bInt = 0;

    for (int i = 0; i < numCopy; i++) {
      bInt += (bytes[numCopy - (1 + i)] & 0xFF) << (8 * i);
    }

    return bInt;
  }

  public static byte[] fromInt(int intval) {

    byte[] bytes = new byte[4];
    bytes[3] = (byte)intval;

    for (int i = 2; i >= 0; i--) {
      intval >>>= 8;
      bytes[i] = (byte)intval;
    }

    return bytes;
  }

  public static long toLong(byte[] bytes) {
    return toLong(bytes, 0);
  }

  public static long toLong(byte[] bytes, int start) {

    if (bytes == null || bytes.length == 0 || start >= bytes.length) {
      return 0;
    }

    int numCopy = ((start + 8) <= bytes.length) ? 8 : (bytes.length - start);
    long bLong = 0;

    for (int i = 0; i < numCopy; i++) {
      bLong += (bytes[numCopy - (1 + i)] & 0xFF) << (8 * i);
    }

    return bLong;
  }

  public static byte[] fromLong(long longval) {

    byte[] bytes = new byte[8];
    bytes[7] = (byte)longval;

    for (int i = 6; i >= 0; i--) {
      longval >>>= 8;
      bytes[i] = (byte)longval;
    }

    return bytes;
  }

  public static float toFloat(byte[] bytes) {
    return toFloat(bytes, 0);
  }

  public static float toFloat(byte[] bytes, int start) {

    int floatIntBits = toInt(bytes, start);
    float bFloat = Float.intBitsToFloat(floatIntBits);

    return bFloat;
  }

  public static byte[] fromFloat(float toBytes) {

    int floatIntBits = Float.floatToIntBits(toBytes);
    byte[] floatBytes = fromInt(floatIntBits);

    return floatBytes;
  }

  public static double toDouble(byte[] bytes) {
    return toDouble(bytes, 0);
  }

  public static double toDouble(byte[] bytes, int start) {

    long doubleLongBits = toLong(bytes, start);
    double bDouble = Double.longBitsToDouble(doubleLongBits);

    return bDouble;
  }

  public static byte[] fromDouble(double toBytes) {

    long doubleLongBits = Double.doubleToLongBits(toBytes);
    byte[] doubleBytes = fromLong(doubleLongBits);

    return doubleBytes;
  }

  public static String toString(byte[] bytes) {
    return null;
  }

  public static byte[] fromString(String input) {
    return null;
  }

  public static Object toObject(byte[] bytes)
    throws IOException, ClassNotFoundException {

    return toObject(bytes, 0);
  }

  public static Object toObject(byte[] bytes, int start)
    throws IOException, ClassNotFoundException {

    if (bytes == null || bytes.length == 0 || start >= bytes.length) {
      return null;
    }

    ByteArrayInputStream bais = new ByteArrayInputStream(bytes);
    bais.skip(start);
    ObjectInputStream ois = new ObjectInputStream(bais);

    Object bObject = ois.readObject();

    bais.close();
    ois.close();

    return bObject;
  }

  public static byte[] fromObject(Serializable toBytes)
    throws IOException {

    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    ObjectOutputStream oos = new ObjectOutputStream(baos);

    oos.writeObject(toBytes);
    oos.flush();

    byte[] objBytes = baos.toByteArray();

    baos.close();
    oos.close();

    return objBytes;
  }
}
