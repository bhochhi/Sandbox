package com.telogical.diff.util;

import java.io.IOException;
import java.io.StringWriter;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang.math.NumberUtils;
import org.htmlcleaner.SpecialEntities;
import org.jdom.Document;
import org.jdom.output.Format;


public class XMLUtils {

  /**
   * Changes a non-ascii string into an HTML encoded ascii string.
   *
   * @param notAscii The string to change.
   *
   * @return The converted string.
   */
  public static String toAscii(String notAscii) {

    StringBuilder builder = new StringBuilder();
    char[] charArray = notAscii.toCharArray();
    for (int i = 0; i < charArray.length; ++i) {
      char a = charArray[i];
      if ((int)a > 255) {
        builder.append("&#" + (int)a + ";");
      }
      else {
        builder.append(a);
      }
    }
    return builder.toString();
  }
  /**
   * Changes extend ASCII and non ASCII into HTML encoded ascii string.
   * @param notAscii the string to change
   * @return  the converted string
   */
  public static String toExtendedAscii(String notAscii) {

	    StringBuilder builder = new StringBuilder();
	    char[] charArray = notAscii.toCharArray();
	    for (int i = 0; i < charArray.length; ++i) {
	      char a = charArray[i];
	      if ((int)a > 127) {
	        builder.append("&#" + (int)a + ";");
	      }
	      else {
	        builder.append(a);
	      }
	    }
	    return builder.toString();
	  }

  public static String unescapeXmlEntityCodes(String s) {

    s = toAscii(s);
    int len = s.length();
    StringBuffer builder = new StringBuffer(len);
    for (int i = 0; i < len; i++) {
      char ch = s.charAt(i);
      if (ch == '&' && (s.charAt(i + 1) == '#')) {
        int code = 0;
        if (s.charAt(i + 5) == ';') {
          code = NumberUtils.toInt(s.substring(i + 2, i + 5), 0);
          i += 5;
        }
        else if (s.charAt(i + 6) == ';') {
          code = NumberUtils.toInt(s.substring(i + 2, i + 6), 0);
          i += 6;
        }
        if (code > 0) {
          String htmlEntity = (String)SpecialEntities.codes.get(code);
          builder.append("&" + htmlEntity + ";");
        }
      }
      else {
        builder.append(ch);
      }
    }
    return builder.toString();
  }

  /**
   * Converts an XML Document object to HTML. This includes pretty printing the
   * document and adding the appropriate DocType headers.
   */
  public static String toHtml(Document doc, String encoding)
    throws IOException {

    // write out the xml to a string, without the xml declaration and use the
    // HTML outputter to add in an html doctype
    StringWriter writer = new StringWriter();
    Format format = Format.getPrettyFormat();
    format.setExpandEmptyElements(true);
    format.setOmitDeclaration(true);
    format.setEncoding(encoding);
    HTMLOutputter out = new HTMLOutputter(format);
    out.output(doc, writer);

    // xml processing will escape out certain characters that are legal in html
    // we convert those characters back here to html entity codes instead of
    // xml entitity codes.  We also replace unicodeish characters to their html
    // entity equivalents. This helps in displaying with people don't have the
    // correct charset packs installed
    String output = unescapeXmlEntityCodes(writer.toString());
    String htmlstr = StringEscapeUtils.unescapeXml(output);
    writer.close();

    return htmlstr;
  }

public static String stripNonValidXMLCharacters(String in) {
	 StringBuffer out = new StringBuffer(); // Used to hold the output.
	    char current; // Used to reference the current character.

	    if (in == null || ("".equals(in)))
	      return ""; // vacancy test.
	    for (int i = 0; i < in.length(); i++) {
	      current = in.charAt(i); // NOTE: No IndexOutOfBoundsException caught here;
	                              // it should not happen.
	      if ((current == 0x9) || (current == 0xA) || (current == 0xD)
	        || ((current >= 0x20) && (current <= 0xD7FF))
	        || ((current >= 0xE000) && (current <= 0xFFFD))
	        || ((current >= 0x10000) && (current <= 0x10FFFF)))
	        out.append(current);
	    }
	    return out.toString();
}
}
