package com.telogical.diff.util;

import java.io.File;

/**
 * A service interface for performing conversion between different file types,
 * PDF to HTML for example.
 */
public interface ConversionService {

  /**
   * Convert the file from PDF format to HTMl format.
   * 
   * @param pdfFile The input pdf file.
   * @param htmlFile The output html file.
   * 
   * @return true If the conversion completes successfully.
   */
  public boolean convertPdfToHtml(File pdfFile, File htmlFile);
}
