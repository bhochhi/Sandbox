/*  Copyright (c) 2006-2007, Vladimir Nikic
    All rights reserved.

    Redistribution and use of this software in source and binary forms,
    with or without modification, are permitted provided that the following
    conditions are met:

    * Redistributions of source code must retain the above
      copyright notice, this list of conditions and the
      following disclaimer.

    * Redistributions in binary form must reproduce the above
      copyright notice, this list of conditions and the
      following disclaimer in the documentation and/or other
      materials provided with the distribution.

    * The name of HtmlCleaner may not be used to endorse or promote
      products derived from this software without specific prior
      written permission.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
    AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
    ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
    CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
    SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
    INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
    CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
    ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
    POSSIBILITY OF SUCH DAMAGE.

    You can contact Vladimir Nikic by sending e-mail to
    nikic_vladimir@yahoo.com. Please include the word "HtmlCleaner" in the
    subject line.
*/

package org.htmlcleaner;

import java.io.IOException;
import java.io.Writer;
import java.util.*;

/**
 * <p>Compact XML serializer - creates resulting XML by stripping whitespaces.</p>
 *
 * Created by: Vladimir Nikic<br/>
 * Date: November, 2006.
 */
public class CompactXmlSerializer extends XmlSerializer {

	public CompactXmlSerializer(CleanerProperties props) {
		super(props);
	}

    protected void serialize(TagNode tagNode, Writer writer) throws IOException {
        serializeOpenTag(tagNode, writer, false);

        List tagChildren = tagNode.getChildren();
        if ( !isMinimizedTagSyntax(tagNode) ) {
            ListIterator childrenIt = tagChildren.listIterator();
            while ( childrenIt.hasNext() ) {
                Object item = childrenIt.next();
                if (item != null) {
                    if ( item instanceof ContentToken ) {
                    	String content = ((ContentToken) item).getContent().trim();
                        writer.write( dontEscape(tagNode) ? content.replaceAll("]]>", "]]&gt;") : escapeXml(content) );

                        if (childrenIt.hasNext()) {
                            if ( !Utils.isWhitespaceString(childrenIt.next()) ) {
                                writer.write("\n");
                            }
                            childrenIt.previous();
                        }
                    } else if (item instanceof CommentToken) {
                    	String content = ((CommentToken) item).getCommentedContent().trim();
                    	writer.write(content);
                    } else {
                    	((BaseToken)item).serialize(this, writer);
                    }
                }
            }

            serializeEndTag(tagNode, writer, false);
        }
	}

}