package com.telogical.diff.util;

public final class ByteStringUtils {

  public static char[] hexDigits = "0123456789ABCDEF".toCharArray();
  public static char[] octDigits = "01234567".toCharArray();

  public ByteStringUtils() {

  }

  /**
   * Converts a hexadecimal character to its corresponding nibble, 4 bit or half
   * byte, value. This method is used while converting hexadecimal string values
   * to bytes.
   * 
   * @param hexChar The hexadecimal character to convert to nibble value
   * 
   * @return int The nibble value in the form of an int.
   */
  private static int charToNibble(char hexChar) {

    // translate the character to upper case to avoid extra work
    hexChar = Character.toUpperCase(hexChar);

    // if the character is 0-9, else A-F, else its an invalid character
    if ((hexChar >= '0') && (hexChar <= '9')) {

      // '0'-'9' have a high nibble of 0011, subtraction of chars makes the
      // characters into numbers 0-9. This keeps the low nibble but clears
      // the high nibble into 0000.
      return hexChar - '0';
    }
    else if ((hexChar >= 'A') && (hexChar <= 'F')) {

      // 'A'-'F' have a high nibble of 0100, subtraction of chars makes the
      // characters into 0-6 to which we add 10 to get the corresponding
      // deciaml value. This set the low nibble correctly but clears the
      // high nibble into 0000.
      return hexChar - 'A' + 10;
    }
    else {

      // not a valid hexadecimal character throw IllegalArgumentException
      String message = "Invalid hexadecimal character: " + hexChar;
      throw new IllegalArgumentException(message);
    }
  }

  public static String toBinaryString(byte bits) {

    // create a StringBuffer for eight bits
    StringBuffer bitBuffer = new StringBuffer(8);

    // loop through and write out bits is reverse order
    for (int i = 7; i >= 0; i--) {

      // shift the 0000 0001 i times to the left and perform an & operation
      // with the byte passed. Then shift that result back i times to the
      // right and check against 0000 0001. If the bit is 1 it will equal
      // 0000 0001 else it is 0 and will not equal.
      if (((bits & (0x01 << i)) >> i) == 0x01) {

        // append 1 to buffer
        bitBuffer.append('1');
      }
      else {

        // append 0 to buffer
        bitBuffer.append('0');
      }
    }

    // convert the buffer to a String and return
    return bitBuffer.toString();
  }

  /**
   * Returns a String displaying the binary representation of the byte array
   * passed. Bytes are formatted to diplay 8 bits with a space as the separator.
   * An IllegalArgumentException is thrown if the byte array passed is null.
   * <p>
   * The bytes array passed is not modified by this method.
   * 
   * @param bytes The byte array to convert to a binary string.
   * 
   * @return String The binary string representation of the byte array or null
   * if the byte array passed is null.
   */
  public static String toBinaryString(byte[] bytes) {

    // check for a null byte array
    if (bytes == null) {

      return null;
    }

    // create a buffer for all bytes in the byte array
    StringBuffer byteBuffer = new StringBuffer();

    // loop through the byte array
    for (int i = 0; i < bytes.length; i++) {

      // call toBinaryString for each byte and append it to the buffer
      byteBuffer.append(toBinaryString(bytes[i]));

      // if not the last byte then append a space
      if (i < (bytes.length - 1)) {

        byteBuffer.append(' ');
      }
    }

    // convert the buffer to a String and return
    return byteBuffer.toString();
  }

  /**
   * Returns a byte array containing the byte representation of the binary
   * string passed. The binary string can only contain the chars 1, 0, and
   * whitespace.
   * 
   * @param binaryString The binary String to be converted.
   * 
   * @return byte[] The byte array containg the byte representation of the
   * binary string passed or null if the binary string passed is null.
   * 
   * @throws IllegalArgumentException If the binary string contains characters
   * other than 1, 0, or whitespace, or if the binary string does not contain
   * blocks of 8 characters not including whitespace.
   */
  public static byte[] fromBinaryString(String binaryString) {

    // check for a null binary string
    if (binaryString == null) {

      return null;
    }

    // convert the binary string to a char array and create a buffer for
    // triming whitespace
    char[] binaryChars = binaryString.trim().toCharArray();
    StringBuffer trimBuffer = new StringBuffer();

    // loop through the char array
    for (int i = 0; i < binaryChars.length; i++) {

      // get the current char
      char charByte = binaryChars[i];

      // if the char is '1' or '0' then append it to the buffer, otherwise
      // if it is not whitespace throw an IllegalArgumentException
      if ((charByte == '1') || (charByte == '0')) {

        // good character append
        trimBuffer.append(charByte);
      }
      else if (!Character.isWhitespace(charByte)) {

        // not whitespace throw IllegalArgumentException with message
        String message = "Binary string can only contain 1, 0,"
          + " and whitespace";

        throw new IllegalArgumentException(message);
      }
    }

    // make sure there are 8 char blocks in the trimmed array for converting
    // to bytes, if not throw IllegalArgumentException
    if ((trimBuffer.length() % 8) != 0) {

      String message = "Binary string must contain an 8 char blocks "
        + "of 1, 0 to create bytes";

      throw new IllegalArgumentException(message);
    }

    // convert trimmed buffer to a character array
    char[] stringBytes = trimBuffer.toString().toCharArray();

    // get the number of bytes to be output by the conversion and create a
    // new byte array of that size
    int numBytes = (stringBytes.length / 8);
    byte[] fromString = new byte[numBytes];

    // for the number of bytes to be output
    for (int i = 0; i < numBytes; i++) {

      // the byte to be output and the byte count delta used in getting the
      // char position in the trimmed binary char array
      byte out = (byte)0;
      int byteCount = i * 8;

      // for eight characters, should be eight bits in one byte
      for (int j = 0; j < 8; j++) {

        // get the current character using the delta plus placement
        char curChar = stringBytes[byteCount + j];

        // if the character is '1' set the bit to 1, else '0' set the
        // bit to 0, no other character should make it through to here.
        // we call the set bit method for 8 - j bit starting from left
        if (curChar == '1') {

          out = BitUtils.setBit(out, 8 - j);
        }
        else if (curChar == '0') {

          out = BitUtils.clearBit(out, 8 - j);
        }
      }

      // put the new byte into a the byte array
      fromString[i] = out;
    }

    // return the byte array
    return fromString;
  }

  /**
   * Returns a String displaying the hexadecimal representation of the byte
   * passed.
   * 
   * @param bits The byte to convert to a hexadecimal string.
   * 
   * @return String The hexadecimal string representation of the byte.
   */
  public static String toHexadecimalString(byte bits) {

    // create a buffer for the hex string of two characters for one byte
    StringBuffer hexBuffer = new StringBuffer(2);

    // get the high and low nibbles as ints which tell us the number in the
    // hexDigits char array to append 0-9,A-F, to the buffer
    int highCharIdx = BitUtils.getNibble(bits, BitUtils.HIGH_NIBBLE,
      BitUtils.LOW_NIBBLE);
    int lowCharIdx = BitUtils.getNibble(bits, BitUtils.LOW_NIBBLE,
      BitUtils.LOW_NIBBLE);

    // append the chars the the hexadecimal String buffer
    hexBuffer.append(hexDigits[highCharIdx]);
    hexBuffer.append(hexDigits[lowCharIdx]);

    // return the buffer as a String
    return hexBuffer.toString();
  }

  /**
   * Returns a String displaying the hexadecimal representation of the byte
   * array passed. Bytes are formatted to diplay 8 bits with a space as the
   * separator. An IllegalArgumentException is thrown if the byte array passed
   * is null.
   * <p>
   * The bytes array passed is not modified by this method.
   * 
   * @param bytes The byte array to convert to a hexadecimal string.
   * 
   * @return String The hexadecimal string representation of the byte array
   * passed or null if the byte array passed is null.
   */
  public static String toHexadecimalString(byte[] bytes) {

    // check for a null byte array
    if (bytes == null) {

      return null;
    }

    // create a buffer to hold the hexadecimal characters
    StringBuffer hexBuffer = new StringBuffer();

    // loop through the byte array passed
    for (int i = 0; i < bytes.length; i++) {

      // call toHexadecimalString for each byte and append it to the buffer
      hexBuffer.append(toHexadecimalString(bytes[i]));

      // if not the last byte then append a space
      if (i < (bytes.length - 1)) {

        hexBuffer.append(' ');
      }
    }

    // convert the buffer to a String and return
    return hexBuffer.toString();
  }

  /**
   * Returns a byte array containing the byte representation of the hexadecimal
   * string passed. The hexadecimal string can only contain the chars 0-9, A-F,
   * and whitespace.
   * 
   * @param hexString The hexadecimal String to be converted.
   * 
   * @return byte[] The byte array containg the byte representation of the
   * hexadecimal string passed or null if the hexadecimal string passed is null.
   * 
   * @throws IllegalArgumentException If the hexadecimal string contains
   * characters other than 0-9 or A-F, or whitespace, or if the hexadecimal
   * string does not contain an even number of characters not including
   * whitespace.
   */
  public static byte[] fromHexadecimalString(String hexString) {

    // check for a null hex string
    if (hexString == null) {

      return null;
    }

    // convert the hex string to a char arrayin uppercase and create a buffer
    // for triming whitespace
    char[] hexChars = hexString.toUpperCase().trim().toCharArray();
    StringBuffer trimBuffer = new StringBuffer();

    // loop through the char array
    for (int i = 0; i < hexChars.length; i++) {

      // get the current char
      char charByte = hexChars[i];

      // if the char is between '0' and '9' or between 'A' and 'F' then
      // append it to the buffer, otherwise if it is not whitespace throw
      // an IllegalArgumentException
      if (((charByte >= '0') && (charByte <= '9'))
        || ((charByte >= 'A') && (charByte <= 'F'))) {

        // good character append
        trimBuffer.append(charByte);
      }
      else if (!Character.isWhitespace(charByte)) {

        // not whitespace throw IllegalArgumentException with message
        String message = "Hexadecimal string can only contain A-F, 0-9, "
          + " and whitespace";

        throw new IllegalArgumentException(message);
      }
    }

    // make sure there are an even number of characters in the trimmed array
    // for converting to bytes, if not throw IllegalArgumentException
    if ((trimBuffer.length() % 2) != 0) {

      String message = "Hexadecimal string must contain an even number "
        + "of characters";

      throw new IllegalArgumentException(message);
    }

    // convert the trimmed hex string to a char array
    char[] stringBytes = trimBuffer.toString().toCharArray();

    // get the number of bytes to be output by the conversion and create a
    // new byte array of that size
    int numBytes = (stringBytes.length / 2);
    byte[] fromString = new byte[numBytes];

    // for the number of bytes to be output
    for (int i = 0; i < numBytes; i++) {

      // the byte count delta used in getting the char position in the
      // trimmed hex char array
      int byteCount = i * 2;

      // the high and low hex characters converted to nibbles using the
      // charToNibble method
      int highChar = charToNibble(stringBytes[byteCount]);
      int lowChar = charToNibble(stringBytes[byteCount + 1]);

      // shift the high char into high byte postion and create the byte
      // as high char | low char which is set into the byte array
      fromString[i] = (byte)((highChar << 4) | lowChar);
    }

    // return the byte array
    return fromString;
  }

  /**
   * Converts the binary string to a hexadecimal string.
   * 
   * @param binaryString The binary String object.
   * 
   * @return String The hexadecimal string representation of the byte values
   * represented by the binary string or null if the binary string is null.
   * 
   * @throws IllegalArgumentException If the binary string passed is not a valid
   * binary string.
   */
  public static String binaryToHex(String binaryString) {

    // convert the binary string to bytes and pass bytes as a parameter
    // to toHexadecimalString method
    return toHexadecimalString(fromBinaryString(binaryString));
  }

  /**
   * Converts the hexadecimal string to a binary string.
   * 
   * @param hexString The hexadecimal String object.
   * 
   * @return String The binary string representation of the byte values
   * represented by the hexadecimal string or null if the hexadecimal string is
   * null.
   * 
   * @throws IllegalArgumentException If the hexadecimal string passed is not a
   * valid hexadecimal string.
   */
  public static String hexToBinary(String hexString) {

    // convert the hex string to bytes and pass bytes as a parameter
    // to toBinaryString method
    return toBinaryString(fromHexadecimalString(hexString));
  }

  public static void main(String[] args) {
    String hex = toHexadecimalString((byte)124);
    System.out.println(hex);
  }

}
