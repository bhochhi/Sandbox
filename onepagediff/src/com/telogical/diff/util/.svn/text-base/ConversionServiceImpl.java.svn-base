package com.telogical.diff.util;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.util.HashMap;

import org.apache.commons.exec.CommandLine;
import org.apache.commons.exec.DefaultExecutor;
import org.apache.commons.exec.ExecuteWatchdog;
import org.apache.commons.exec.PumpStreamHandler;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * An implementation of the ConversionService for converting files.
 */
public class ConversionServiceImpl
  implements ConversionService {

  private static Log LOG = LogFactory.getLog(ConversionServiceImpl.class);

  private String pdfCommand;
  private int timeoutInSeconds;
  private boolean printCommandOutput;

  public void setPdfCommand(String pdfCommand) {
    this.pdfCommand = pdfCommand;
  }

  public void setTimeoutInSeconds(int timeoutInSeconds) {
    this.timeoutInSeconds = timeoutInSeconds;
  }

  public void setPrintCommandOutput(boolean printCommandOutput) {
    this.printCommandOutput = printCommandOutput;
  }

  /**
   * Converts a pdf to html file by calling an external command. The inputfile
   * and outputfile names are passed to the external command. The command should
   * be of the form:
   * 
   * <pre>/usr/bin/pdf2html "${inputfile}" "${outputfile}"</pre>
   * 
   * The input and output file sections will get replaced and the command will
   * be executed directly. The pdfCommand is the command that will be called.
   * 
   * @return True if the document was successfully converted
   */
  public boolean convertPdfToHtml(File pdfFile, File htmlFile) {

    // call the external pdf conversion command
    try {

      CommandLine commandLine;
      HashMap params = new HashMap();
      params.put("inputfile", pdfFile.getAbsolutePath());
      params.put("outputfile", htmlFile.getAbsolutePath());
      commandLine = CommandLine.parse(pdfCommand, params);

      LOG.info("Running pdf convert command: " + commandLine.toString());
      ExecuteWatchdog watchdog = new ExecuteWatchdog(timeoutInSeconds * 1000);
      DefaultExecutor executor = new DefaultExecutor();
      executor.setWatchdog(watchdog);

      ByteArrayOutputStream baos = new ByteArrayOutputStream();
      PumpStreamHandler streamHandler = new PumpStreamHandler(baos);
      executor.setStreamHandler(streamHandler);

      int exitValue = executor.execute(commandLine);
      boolean failed = executor.isFailure(exitValue);
      if (failed && watchdog.killedProcess()) {
        LOG.info("Command was killed for timeout: " + commandLine.toString()
          + " timeout=" + timeoutInSeconds);
      }
      
      if (printCommandOutput ) {
        LOG.info("Command output:\n" + baos.toString());
      }

      return !failed;
    }
    catch (Exception e) {
      e.printStackTrace();
      return false;
    }
  }
}
