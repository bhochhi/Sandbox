package com.telogical.diff.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.jar.JarEntry;
import java.util.zip.ZipOutputStream;

public class ArchiveUtils {

  private static final int BUFFER = 4096;
  public static final int MAX_ARCHIVE_ENTRIES = 65500;

  private static void populateToBeJared(File dir, List<File> toJarList) {

    // look through the children of the directory
    File[] children = dir.listFiles();
    for (int i = 0; i < children.length; i++) {

      // add files that exist to the jar list, if directory then recurse
      File child = children[i];
      if (child != null && child.exists()) {
        if (!child.isDirectory()) {
          toJarList.add(new File(child.getPath()));
        }
        else {
          populateToBeJared(child, toJarList);
        }
      }
    }
  }

  public static void archive(File dir, String outputPrefix)
    throws IOException {
    archive(dir, outputPrefix, MAX_ARCHIVE_ENTRIES);
  }

  public static void archive(File dir, String outputPrefix, int maxFilesPerPart)
    throws IOException {

    // max zip file entries is 65536, I leave a little room
    if (maxFilesPerPart > MAX_ARCHIVE_ENTRIES) {
      maxFilesPerPart = MAX_ARCHIVE_ENTRIES;
    }

    // if the directory to jar doesn't exist or isn't a directory
    if (dir == null || !dir.isDirectory()) {
      throw new IllegalArgumentException("Input must be an existing directory.");
    }

    // get a listing of the files to be jared
    List<File> toBeJared = new ArrayList<File>();
    populateToBeJared(dir, toBeJared);
    int numTotalFiles = toBeJared.size();

    List<List<File>> archiveFileList = new ArrayList<List<File>>();

    int start = 0;
    int end = 0;
    while (start < numTotalFiles) {
      end += maxFilesPerPart;
      if (end > numTotalFiles) {
        end = numTotalFiles;
      }
      List<File> curFileList = toBeJared.subList(start, end);
      archiveFileList.add(curFileList);
      start = end;
    }

    String archivePrefix = outputPrefix;
    if (archivePrefix.endsWith(".jar") || archivePrefix.endsWith(".zip")) {
      archivePrefix = archivePrefix.substring(0, (archivePrefix.length() - 4));
    }
    int numArchives = archiveFileList.size();

    for (int i = 0; i < numArchives; i++) {

      List<File> curArchive = archiveFileList.get(i);
      String curArchiveName = archivePrefix
        + (numArchives == 1 ? ".zip" : ".part." + i + ".zip");
      byte buffer[] = new byte[BUFFER];
      FileOutputStream stream = new FileOutputStream(curArchiveName);
      ZipOutputStream out = new ZipOutputStream(stream);

      // loop through the files
      for (int k = 0; k < curArchive.size(); k++) {

        // for each entry create the correct jar path name
        File toArchive = curArchive.get(k);
        File current = toArchive;
        String currentPath = null;
        while (!current.toString().equals(dir.toString())) {
          currentPath = current.getName()
            + (currentPath == null ? "" : File.separator + currentPath);
          current = current.getParentFile();
        }

        // Add entry to the jar
        JarEntry jarAdd = new JarEntry(currentPath);
        jarAdd.setTime(toArchive.lastModified());
        out.putNextEntry(jarAdd);

        // Write file to archive
        FileInputStream in = new FileInputStream(toArchive);
        while (true) {
          int nRead = in.read(buffer, 0, buffer.length);
          if (nRead <= 0) {
            break;
          }
          out.write(buffer, 0, nRead);
        }

        in.close();
      }

      out.close();
      stream.close();
    }
  }
}
