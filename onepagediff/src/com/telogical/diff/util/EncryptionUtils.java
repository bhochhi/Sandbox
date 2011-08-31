package com.telogical.diff.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.spec.AlgorithmParameterSpec;
import java.security.spec.KeySpec;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.PBEParameterSpec;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang.StringUtils;

public class EncryptionUtils {

  private static Cipher createKeyedCipher(String key, int mode)
    throws Exception {

    byte[] salt = {(byte)0xA9, (byte)0x9B, (byte)0xC8, (byte)0x32, (byte)0x56,
      (byte)0x35, (byte)0xE3, (byte)0x03};

    int itcount = 18;

    KeySpec keySpec = new PBEKeySpec(key.toCharArray(), salt, itcount);
    SecretKey secret = SecretKeyFactory.getInstance("PBEWithMD5AndDES").generateSecret(
      keySpec);

    AlgorithmParameterSpec paramSpec = new PBEParameterSpec(salt, itcount);

    Cipher cipher = null;

    if (mode == Cipher.ENCRYPT_MODE) {

      Cipher ecipher = Cipher.getInstance(secret.getAlgorithm());
      ecipher.init(mode, secret, paramSpec);
      cipher = ecipher;
    }
    else if (mode == Cipher.DECRYPT_MODE) {

      Cipher dcipher = Cipher.getInstance(secret.getAlgorithm());
      dcipher.init(Cipher.DECRYPT_MODE, secret, paramSpec);
      cipher = dcipher;
    }

    return cipher;
  }

  public static byte[] encrypt(String key, String input)
    throws Exception {

    Cipher ecipher = createKeyedCipher(key, Cipher.ENCRYPT_MODE);
    byte[] enc = ecipher.doFinal(input.getBytes());

    return enc;
  }

  public static byte[] decrypt(String key, byte[] encbytes)
    throws Exception {

    Cipher dcipher = createKeyedCipher(key, Cipher.DECRYPT_MODE);
    byte[] decr = dcipher.doFinal(encbytes);

    return decr;
  }

  public static String hexEncrypt(String key, String input)
    throws Exception {

    byte[] enc = encrypt(key, input);
    String hex = StringUtils.remove(ByteStringUtils.toHexadecimalString(enc),
      ' ');

    return hex;
  }

  public static String hexDecrypt(String key, String hex)
    throws Exception {

    byte[] hexBytes = ByteStringUtils.fromHexadecimalString(hex);
    byte[] dec = decrypt(key, hexBytes);

    return new String(dec);
  }

  public static String hexHash(String value) {

    byte[] digest = createHash(value);
    String hex = StringUtils.remove(
      ByteStringUtils.toHexadecimalString(digest), ' ');
    return hex;
  }

  public static String base64Hash(String value) {

    byte[] digest = createHash(value);
    String hex = new String(Base64.encodeBase64(digest));
    return hex;
  }

  public static byte[] createHash(String value) {

    MessageDigest md5 = null;
    try {
      md5 = MessageDigest.getInstance("MD5");
    }
    catch (NoSuchAlgorithmException nsae) {
      // do nothing
    }

    if (StringUtils.isEmpty(value)) {
      throw new IllegalArgumentException("Must have a value to create a hash");
    }

    byte[] valBytes = value.getBytes();
    for (int i = 0; i < valBytes.length; i++) {
      md5.update(valBytes[i]);
    }

    return md5.digest();
  }
}
