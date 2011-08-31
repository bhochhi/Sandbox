/*
 * Copyright 2007 Guy Van den Broeck
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.outerj.daisy.diff.html.ancestor;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.io.FileUtils;

public class ChangeText {

  private int maxNbCharsPerLine;

  private StringBuilder txt = new StringBuilder();
  public final static String NEWLINE = "<br/>";

  private int charsThisLine = 0;

  public ChangeText(int maxNbCharsPerLine) {
    this.maxNbCharsPerLine = maxNbCharsPerLine;
  }

  private String[] splitByWhiteSpacePreseve(String content) {

    List<String> splits = new ArrayList<String>();
    char[] contentChars = content.toCharArray();
    int prevIndex = 0;
    int numChars = contentChars.length;
    boolean inWhite = false;
    for (int i = 0; i < numChars; i++) {
      char cur = contentChars[i];
      boolean isWhitespace = Character.isWhitespace(cur);
      if (isWhitespace) {
        if (!inWhite) {
          splits.add(new String(contentChars, prevIndex, i - prevIndex) + " ");
          inWhite = true;
        }
        prevIndex = i + 1;
      }
      else if (i == (numChars - 1)) {
        if (prevIndex < numChars) {
          splits.add(new String(contentChars, prevIndex, numChars - prevIndex));
        }
      }
      else if (!isWhitespace) {
        inWhite = false;
      }
    }
    return splits.toArray(new String[splits.size()]);
  }

  public synchronized void addText(String text) {

    text = clean(text);
    String[] split = splitByWhiteSpacePreseve(text);
    for (int i = 0; i < split.length; i++) {
      String block = split[i];
      int curBlockSize = block.length();
      int index = 0;
      while ((curBlockSize + charsThisLine) > maxNbCharsPerLine) {
        int numCharsInBlock = Math.min(curBlockSize, maxNbCharsPerLine
          - charsThisLine);
        txt.append(block.substring(0, numCharsInBlock));
        txt.append(NEWLINE);
        charsThisLine = 0;
        index = numCharsInBlock;
        block = (index < block.length()) ? block.substring(index, block
          .length()) : "";
        curBlockSize = block.length();
      }
      if (curBlockSize > 0) {
        txt.append(block);
        charsThisLine += curBlockSize;
      }
    }

  }

  public synchronized void addHtml(String s) {
    txt.append(s);
    if (s.contains("</li>") || s.contains("</ol>") || s.contains("</ul>")) {
      charsThisLine = 0;
    }
  }

  public synchronized void addNewLine() {
    addHtml(NEWLINE);
    charsThisLine = 0;
  }

  @Override
  public String toString() {
    return txt.toString();
  }

  private String clean(String s) {
    return s.replaceAll("\n", "").replaceAll("\r", "").replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;").replaceAll("'", "&#39;").replaceAll("\"",
        "&#34;");
  }

  public static void main(String[] args)
    throws Exception {

    String filename = "/home/dennis/testtext";
    String contents = FileUtils.readFileToString(new File(filename));
    ChangeText change = new ChangeText(5);
    change.addText(contents);
    System.out.println(change.toString());

  }
}
