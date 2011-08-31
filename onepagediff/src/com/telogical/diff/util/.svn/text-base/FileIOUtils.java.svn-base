package com.telogical.diff.util;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Map;
import java.util.Set;

import org.apache.commons.io.FileUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class FileIOUtils {

  public static Log LOG = LogFactory.getLog(FileIOUtils.class);

  /**
   * Copies all documents in the Map to the specified folder. Does not remove
   * the original files from the folder. If any file errors during copy it will
   * be logged but the copy process will continue for the other files.
   * 
   * @param docMap The files to copy.
   * @param folder The folder to copy the files to.
   */
  public static void copyDocuments(Map<String, File> docMap, String folder) {
    moveDocuments(docMap, folder, null);
  }

  /**
   * Moves all documents in the Map to the specified folder, removing the
   * original files from the folder. If any file errors during move it will be
   * logged but the move process will continue for the other files.
   * 
   * @param docMap The files to move.
   * @param folder The folder to move the files to.
   */
  public static void moveDocuments(Map<String, File> docMap, String folder) {
    for (String path : docMap.keySet()) {
      File doc = docMap.get(path);
      try {
        FileUtils.copyFile(doc, new File(folder + path));
        FileUtils.deleteQuietly(doc);
      }
      catch (Exception e) {
        LOG.error("Couldn't write file to error folder: " + path);
      }
    }
  }

  /**
   * Copies all documents in the Map to the specified folder, removing only the
   * original files that are in the deleteOnMove set. If any file errors during
   * move or copy it will be logged but the process will continue for the other
   * files.
   * 
   * @param docMap The files to move.
   * @param folder The folder to move the files to.
   */
  public static void moveDocuments(Map<String, File> docMap, String folder,
    Set<File> deleteOnMove) {
    for (String path : docMap.keySet()) {
      File doc = docMap.get(path);
      try {
        FileUtils.copyFile(doc, new File(folder + path));
        if (deleteOnMove != null && deleteOnMove.contains(doc)) {
          FileUtils.deleteQuietly(doc);
          deleteOnMove.remove(doc);
        }
      }
      catch (Exception e) {
        LOG.error("Couldn't write file to error folder: " + path);
      }
    }
  }

  /**
   * Attempt to read a file for a given amount of time and if it takes longer
   * than that time, abort and return an empty byte array.
   * 
   * @param file The file to read.
   * @param timeoutInSeconds The amount of time in seconds to try and read the
   * file before aborting.
   * 
   * @return The file bytes or an empty byte array if timeout is reached.
   * 
   * @throws IOException If there is an error reading the file.
   */
  public static byte[] readOrTimeout(File file, int timeoutInSeconds)
    throws IOException {

    FileInputStream fis = new FileInputStream(file);
    long fileSize = file.length();
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    byte[] buffer = new byte[4096];
    long starttime = System.currentTimeMillis();
    int totalBytes = 0;

    while (true) {

      // read any available bytes
      int available = fis.available();
      if (available > 0) {
        int read = fis.read(buffer);
        if (read > 0) {
          baos.write(buffer, 0, read);
          totalBytes += read;
        }
      }

      // read the whole file
      if (totalBytes >= fileSize) {
        break;
      }

      // check for timeout reached, if timeout return null
      long time = System.currentTimeMillis();
      if (((time - starttime) / 1000) > timeoutInSeconds) {
        fis.close();
        baos.close();
        return new byte[0];
      }
    }

    fis.close();
    baos.close();

    return baos.toByteArray();
  }

}
