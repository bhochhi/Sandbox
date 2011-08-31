package com.telogical.diff.util;

import java.io.PrintWriter;
import java.io.StringWriter;

public class ExceptionUtils {

  public static String stringifyException(Throwable e) {
    StringWriter stm = new StringWriter();
    PrintWriter wrt = new PrintWriter(stm);
    e.printStackTrace(wrt);
    wrt.close();
    return stm.toString();
  }
}
