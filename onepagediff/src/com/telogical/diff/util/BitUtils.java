package com.telogical.diff.util;

/**
 * <p>
 * The BitUtils class provides static utility methods for working with bits and
 * nibbles (half bytes) inside of a java <code>byte</code>.
 * </p>
 * 
 * <p>
 * All <code>byte<code> values are condsidered to have 8 bits with 1 being
 * the rightmost bit and 8 being the leftmost bit.  All bit indexes must be
 * between 1 and 8 inclusive.  For speed these bit methods do NOT validate
 * parameter values or throw exceptions.  If bit index parameters are not
 * between 1 and 8 inclusive then the behavior is undefined.
 * </p>
 */
public final class BitUtils {

  /**
   * Constant defining the lower nibble, 4 bits of a byte, used within the
   * getNibble and setNibble methods.
   */
  public static final int LOW_NIBBLE = 0;

  /**
   * Constant defining the higher nibble, 4 bits of a byte, used within the
   * getNibble and setNibble methods.
   */
  public static final int HIGH_NIBBLE = 1;

  /**
   * Public constructor to support reflection of methods.
   */
  public BitUtils() {

  }

  /**
   * Returns <code>true</code> if the bit at the give index is set, false if it
   * is not set. The bitIdx parameter values must be between 1 and 8 inclusive
   * or the behavior is undefined.
   * 
   * @param source The source <code>byte</code>.
   * @param bitIdx The index of the bit to test.
   * 
   * @return <code>true</code> if the bit at the index is set.
   */
  public static boolean getBit(byte source, int bitIdx) {

    // Use the number 1 (0000 0001) as a bitmask and shift the rightmost bit
    // left to be aligned with the bit we are testing. Then perform an AND
    // operation and if the value returned is not 0 (0000 0000) then the bit
    // must have been set and we return true.
    return (source & (0x01 << (bitIdx - 1))) != 0x00;
  }

  /**
   * Returns a byte that is a copy of the source <code>byte</code> with the
   * index bit set.
   * 
   * @param source The source <code>byte</code>.
   * @param bitIdx The index of the bit to set.
   * 
   * @return A copy of the source <code>byte</code> with the index set.
   */
  public static byte setBit(byte source, int bitIdx) {

    // Use the number 1 (0000 0001) as a bitmask and shift the rightmost bit
    // left to be aligned with the bit we are setting. Then perform an OR
    // operation to return a byte with the target bit set and the other bits
    // exactly as they were.
    return (byte)(source | (0x01 << (bitIdx - 1)));
  }

  public static byte setBit(byte source, int startIdx, int endIdx) {

    // Create a copy of the source byte.
    byte setter = source;

    // Loop through and set the bits from the start to the end indexes.
    for (int i = startIdx; i < (endIdx + 1); i++) {
      setter = (byte)(setter | (0x01 << (i - 1)));
    }

    // return the byte with the range of bits set
    return setter;
  }

  public static byte clearBit(byte source, int bitIdx) {

    // Use the number 1 (0000 0001) as a bitmask and shift the rightmost bit
    // left to be aligned with the bit we are clearing. Then perform a bitwise
    // complement operation which will create a mask of 1 bits with only the
    // bit we are clearing cleared. Then perform an AND operation with the new
    // 1 filled bitmask to return a byte with the target bit cleared and the
    // other bits exactly as they were.
    return (byte)(source & (~(0x01 << (bitIdx - 1))));
  }

  public static byte clearBit(byte source, int startIdx, int endIdx) {

    // Create a copy of the source byte.
    byte clearer = source;

    // Loop through and set the bits from the start to the end indexes.
    for (int i = startIdx; i < (endIdx + 1); i++) {
      clearer = (byte)(clearer & (~(0x01 << (i - 1))));
    }

    // return the byte with the range of bits set
    return clearer;
  }

  public static byte flipBit(byte source, int bitIdx) {

    // User the number 1 (0000 0001) as a bitmask and shift the rightmost bit
    // left to be aligned with the bit we are flipping. Then perform an XOR
    // operation to give us the source byte with the bit flipped.
    return (byte)(source ^ (0x01 << (bitIdx - 1)));
  }

  public static byte copyBit(byte source, int copyIdx, int pasteIdx) {

    // Check if the copy bit is set, if so then set the paste bit otherwise
    // clear the paste bit
    return (getBit(source, copyIdx) ? setBit(source, pasteIdx) : clearBit(
      source, pasteIdx));
  }

  public static byte moveBit(byte source, int startIdx, int moveIdx) {

    // First copy the bit from the start to the move position. Then since we
    // are moving the bit we clear the start bit.
    byte copied = copyBit(source, startIdx, moveIdx);
    return clearBit(copied, startIdx);
  }

  public static byte leftMoveBit(byte source, int startIdx, int numMoves) {

    // Move the bit the number of moves to the left.
    return moveBit(source, startIdx, startIdx + numMoves);
  }

  public static byte rightMoveBit(byte source, int startIdx, int numMoves) {

    // Move the bit the number of moves to the right.
    return moveBit(source, startIdx, startIdx - numMoves);
  }

  public static byte leftRotateBit(byte source, int numRots) {

    // First we promote the byte to an int and clear the highest 3 bytes
    // because they are sign bit filled. Then we perform an OR operation
    // between the source int shifted left the number of rotations and the
    // source int shifted right 8 - number of rotations. What this does is
    // when a bit rotates off the left side it essentially puts it back on the
    // right side of the byte.
    int srcInt = (source & 0x000000FF);
    return (byte)((srcInt << numRots) | (srcInt >>> (8 - numRots)));
  }

  public static byte rightRotateBit(byte source, int numRots) {

    // First we promote the byte to an int and clear the highest 3 bytes
    // because they are sign bit filled. Then we perform an OR operation
    // between the source int shifted right the number of rotations and the
    // source int shifted left 8 - number of rotations. What this does is
    // when a bit rotates off the right side it essentially puts it back on the
    // left side of the byte.
    int srcInt = (source & 0x000000FF);
    return (byte)((srcInt >> numRots) | (srcInt << (8 - numRots)));
  }

  public static int cardinality(byte source) {

    // set the number of set bits to 0 initially
    int card = 0;

    // loop through the bits in the source byte
    for (int i = 1; i <= 8; i++) {
      card += getBit(source, i) ? 1 : 0;
    }

    // return the number of set bits
    return card;
  }

  /**
   * Returns a byte containing the nibble, half-byte or 4 bits, in the nibble's
   * order. The constants HIGH_NIBBLE and LOW_NIBBLE can be used to specify the
   * nibble order.
   * <p>
   * The nibble order specifies whether the lower 4 bits of the byte or the
   * higher 4 bits of the byte will be returned. If the LOW_NIBBLE is returned
   * the nibble will be in the lower 4 bits of the byte. If the HIGH_NIBBLE is
   * returned the nibble will be in the higher 4 bits.
   * <p>
   * For example getNibble((byte)-1, LOW_NIBBLE) gets the lower 4 bits of the
   * byte value 1111 1111 and returns a byte value of 0000 1111. If we had used
   * HIGH_NIBBLE, the upper 4 bits, 1111 0000 would have been returned.
   * <p>
   * If the nibGet is > 0 then HIGH_NIBBLE will be assumed, if it is <= 0 then
   * LOW_NIBBLE will be assumed.
   * 
   * @param source The byte value used to get the nibble.
   * @param nibGet The nibble to get defined by the constants HIGH_NIBBLE and
   * LOW_NIBBLE.
   * 
   * @return byte The new byte containing the nibble.
   */
  public static byte getNibble(byte source, int nibGet) {

    // call getNibble method where the nibble to get is the same as the
    // nibble order
    return getNibble(source, nibGet, nibGet);
  }

  /**
   * Returns a byte containing the nibble, half-byte or 4 bits, in the nibble
   * order specified. The constants HIGH_NIBBLE and LOW_NIBBLE can be used to
   * specify both the get and the put nibble order.
   * <p>
   * The nibGet specifies whether the lower 4 bits of the byte or the higher 4
   * bits of the byte will be returned. The nibPut specifies whether the nibble
   * returned will be in the lower or higher 4 bits of the byte. If the nibPut
   * is LOW_NIBBLE, then the nibble will be in the lower 4 bits of the byte. If
   * HIGH_NIBBLE, the nibble will be in the higher 4 bits.
   * <p>
   * For example getNibble((byte)47, LOW_NIBBLE, HIGH_NIBBLE) gets the lower 4
   * bits of the byte value 0010 1111, or 1111 and returns the nibble in the
   * higher 4 bits of the byte for the byte value 1111 0000. If we had used
   * HIGH_NIBBLE for the nibGet and LOW_NIBBLE for the nibPut, we would get the
   * upper 4 bits, 0010, returned in the lower 4 bits of the byte for the byte
   * value 0000 0010.
   * <p>
   * If the nibGet or nibPut is > 0 then HIGH_NIBBLE will be assumed, if it is
   * <= 0 then LOW_NIBBLE will be assumed.
   * 
   * @param source The byte value used to get the nibble.
   * @param nibGet The nibble to get defined by the constants HIGH_NIBBLE and
   * LOW_NIBBLE.
   * @param nibPut The nibble to put defined by the constants HIGH_NIBBLE and
   * LOW_NIBBLE.
   * 
   * @return byte The new byte containing the nibble.
   */
  public static byte getNibble(byte source, int nibGet, int nibPut) {

    // if LOW_NIBBLE perform & operation with source byte using the bitmask
    // FULL_LOW_NIBBLE_MASK, or 0000 1111. This effectively clears the upper
    // 4 bits of the byte. If HIGH_NIBBLE, we use the FULL_HIGH_NIBBLE_MASK,
    // that clears the lower 4 bits of the byte
    int nibble = (nibGet <= 0) ? (source & 0x0F) : (source & 0xF0);

    // if putting into LOW_NIBBLE and getting from HIGH_NIBBLE else if putting
    // into HIGH_NIBBLE and getting from LOW_NIBBLE. If not one of those two
    // then no changes are necessary to the nibble already cleared of bits
    if ((nibPut <= 0) && (nibGet > 0)) {

      // shift the high nibble into the low nibble
      nibble >>>= 4;
    }
    else if ((nibPut > 0) && (nibGet <= 0)) {

      // shift the low nibble into the high nibble
      nibble <<= 4;
    }

    // return the nibble
    return (byte)nibble;
  }

  /**
   * Returns a byte containing the specified source nibble relaced with the
   * nibble passed. The constants HIGH_NIBBLE and LOW_NIBBLE can be used to
   * specify both the get and the put nibble order.
   * <p>
   * The nibble we are setting is always assumed to be in the lower 4 bits,
   * LOW_NIBBLE, of the nibble byte. We can set the nibble into either the lower
   * or higher 4 bits of the byte specified by the nibPut int.
   * <p>
   * For example setNibble((byte)35, (byte)15, HIGH_NIBBLE) sets the lower 4
   * bits of the 15 byte value 0000 1111, or 1111 into the higher 4 bits of the
   * 47 byte value 0010 0011, occupied by 0010, and returns a byte value of 1111
   * 0011. If LOW_NIBBLE were used, the nibble would have been set into the
   * lower 4 bits occupied by 0011, returning 0010 1111.
   * <p>
   * If the nibPut is > 0 then HIGH_NIBBLE will be assumed, if it is <= 0 then
   * LOW_NIBBLE will be assumed.
   * 
   * @param source The byte value used to set the nibble.
   * @param nibble The nibble value to set contained in the lower 4 bits of a
   * byte value.
   * @param nibPut The nibble to put defined by the constants HIGH_NIBBLE and
   * LOW_NIBBLE.
   * 
   * @return byte The new byte with the nibble set and the remaining nibble the
   * same as the source byte value.
   */
  public static byte setNibble(byte source, byte nibble, int nibPut) {

    // the byte value to return
    byte nibbledByte = 0;

    // if we are putting to LOW_NIBBLE then we get the low nibble from the
    // nibble byte, otherwise we are putting to HIGH_NIBBLE so we get the
    // low nibble and shift it 4 places to the left to occupy the high nibble
    nibble = (nibPut <= 0) ? getNibble(nibble, LOW_NIBBLE) : (byte)(getNibble(
      nibble, LOW_NIBBLE) << 4);

    // if putting to LOW_NIBBLE get the high nibble from the source byte, if
    // HIGH_NIBBLE get the low nibble. We are clearning the source byte of
    // the unused nibble
    byte srcNib = (nibPut <= 0) ? getNibble(source, HIGH_NIBBLE) : getNibble(
      source, LOW_NIBBLE);

    // byte to return is cleared source nibble | nibble
    nibbledByte = (byte)(srcNib | nibble);

    // return the nibbled byte value
    return nibbledByte;
  }
}
