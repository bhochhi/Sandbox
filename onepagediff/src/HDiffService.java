import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.Reader;
import java.io.StringReader;
import java.io.StringWriter;
import java.net.URL;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import javax.jnlp.BasicService;
import javax.jnlp.ServiceManager;
import javax.jnlp.UnavailableServiceException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.sax.SAXTransformerFactory;
import javax.xml.transform.sax.TransformerHandler;
import javax.xml.transform.stream.StreamResult;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringEscapeUtils;
import org.htmlcleaner.CleanerProperties;
import org.htmlcleaner.HtmlCleaner;
import org.htmlcleaner.JDomSerializer;
import org.htmlcleaner.TagNode;
import org.jdom.Attribute;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.input.SAXBuilder;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;
import org.outerj.daisy.diff.html.HTMLDiffer;
import org.outerj.daisy.diff.html.HtmlSaxDiffOutput;
import org.outerj.daisy.diff.html.TextNodeComparator;
import org.outerj.daisy.diff.html.dom.DomTreeBuilder;
import org.xml.sax.ContentHandler;
import org.xml.sax.InputSource;

import com.ibm.icu.text.CharsetDetector;
import com.telogical.diff.util.EncodingUtils;
import com.telogical.diff.util.HtmlUtils;
import com.telogical.diff.util.XMLUtils;

public class HDiffService {
	File newFile, oldFile;

	public void startDiff(String newfileName, String oldfileName) {
		try {
			newFile = new File(newfileName);
			oldFile = new File(oldfileName);

			byte[] newBytes = null;
			newBytes = FileUtils.readFileToByteArray(newFile);
			CharsetDetector charDetect = new CharsetDetector();
			charDetect.setText(newBytes);
			String charSet = charDetect.detect().getName();
			String newContent = EncodingUtils.getEncodedString(newBytes,
					charSet);
			newContent = XMLUtils.stripNonValidXMLCharacters(newContent);
			newContent = XMLUtils.toExtendedAscii(newContent);
			newContent = HtmlUtils.removeSpecialCharacters(newContent);
			newContent = HtmlUtils.removeContiguousWhitespace(newContent);
			newContent = HtmlUtils.removeComments(newContent);
			byte[] oldBytes = null;
			oldBytes = FileUtils.readFileToByteArray(oldFile);
			CharsetDetector charDetect1 = new CharsetDetector();
			charDetect1.setText(oldBytes);
			String charSet1 = charDetect1.detect().getName();
			String oldContent = EncodingUtils.getEncodedString(oldBytes,
					charSet1);
			oldContent = XMLUtils.stripNonValidXMLCharacters(oldContent);
			oldContent = XMLUtils.toExtendedAscii(oldContent);
			oldContent = HtmlUtils.removeSpecialCharacters(oldContent);
			oldContent = HtmlUtils.removeContiguousWhitespace(oldContent);
			oldContent = HtmlUtils.removeComments(oldContent);
			if (oldContent.hashCode() != newContent.hashCode()) {
				Class thisClass = HDiffService.class;
				InputStream is = thisClass.getResourceAsStream("diff.css");
				String diffStyles;

				if (is != null) {
					StringWriter stylesWriter = new StringWriter();
					IOUtils.copy(is, stylesWriter);
					diffStyles = stylesWriter.toString();
					diffStyles = diffStyles.replaceAll("\\s+", " ");
					IOUtils.closeQuietly(is);
					IOUtils.closeQuietly(stylesWriter);

					HtmlCleaner cleaner = new HtmlCleaner();
					CleanerProperties cleanerProps = cleaner.getProperties();
					cleanerProps.setUseCdataForScriptAndStyle(false);
					cleanerProps.setOmitUnknownTags(true);
					cleanerProps.setOmitDoctypeDeclaration(true);
					cleanerProps.setRecognizeUnicodeChars(false);
					cleanerProps.setAdvancedXmlEscape(true);
					cleanerProps.setNamespacesAware(false);
					cleanerProps.setAllowHtmlInsideAttributes(true);
					cleanerProps.setAllowMultiWordAttributes(true);
					cleanerProps.setTranslateSpecialEntities(false);
					cleanerProps.setOmitXmlDeclaration(true);

					TagNode newNodes = cleaner.clean(newContent);

					TagNode oldNodes = cleaner.clean(oldContent);

					Document newDoc = new JDomSerializer(cleanerProps, true)
							.createJDom(newNodes);
					Document oldDoc = new JDomSerializer(cleanerProps, true)
							.createJDom(oldNodes);
					Document tempDoc = new Document();
					tempDoc.addContent(newDoc.cloneContent());

					String xPath = "/html/body";

					XPath xpath = XPath.newInstance(xPath);
					Element newElem = (Element) xpath.selectSingleNode(newDoc);
					cleanInvalidAttributes(newNodes);
					Element oldElem = (Element) xpath.selectSingleNode(oldDoc);
					cleanInvalidAttributes(oldNodes);
					Element tempElem = (Element) xpath
							.selectSingleNode(tempDoc);

					String newStr = createStringRepr(newElem, false, charSet);
					String oldStr = createStringRepr(oldElem, false, charSet1);
					newContent = StringEscapeUtils.unescapeXml(newStr);
					oldContent = StringEscapeUtils.unescapeXml(oldStr);

					// daisy
					org.outerj.daisy.diff.HtmlCleaner newCleaner = null;
					org.outerj.daisy.diff.HtmlCleaner oldCleaner = null;

					StringReader newReader = new StringReader(newContent);
					StringReader oldReader = new StringReader(oldContent);

					StringWriter writer = new StringWriter();
					SAXTransformerFactory tf = (SAXTransformerFactory) TransformerFactory
							.newInstance();
					TransformerHandler result = tf.newTransformerHandler();
					result.setResult(new StreamResult(writer));
					ContentHandler postProcess = result;

					DomTreeBuilder newHandler = new DomTreeBuilder();
					newCleaner = new org.outerj.daisy.diff.HtmlCleaner();
					newCleaner.cleanAndParse(new InputSource(newReader),
							newHandler);
					TextNodeComparator rightComparator = new TextNodeComparator(
							newHandler, Locale.US);
					DomTreeBuilder oldHandler = new DomTreeBuilder();
					oldCleaner = new org.outerj.daisy.diff.HtmlCleaner();
					oldCleaner.cleanAndParse(new InputSource(oldReader),
							oldHandler);
					TextNodeComparator leftComparator = new TextNodeComparator(
							oldHandler, Locale.US);
					HtmlSaxDiffOutput output = new HtmlSaxDiffOutput(
							postProcess, "diff");

					HTMLDiffer differ = new HTMLDiffer(output);
					differ.diff(leftComparator, rightComparator);

					int numCurDiffs = differ.getNumDifferences();
					if (numCurDiffs > 0) {
						XPath headPath = XPath.newInstance("/html/head");
						Element headElem = (Element) headPath
								.selectSingleNode(tempDoc);
						if (headElem == null) {
							Element htmlElem = tempDoc.getRootElement();
							headElem = new Element("head");
							htmlElem.addContent(headElem);
						}
						Element diffStylesElem = new Element("style");
						diffStylesElem.setAttribute(new Attribute("type",
								"text/css"));
						diffStylesElem.setText("<!-- " + diffStyles + " -->");
						List headContent = headElem.cloneContent();
						headContent.add(0, diffStylesElem);
						headElem.setContent(headContent);

						SAXBuilder builder = new SAXBuilder();
						Reader in = new StringReader(writer.toString());
						Document newRegionDoc = builder.build(in);
						List newRegionContent = newRegionDoc.cloneContent();
						tempElem.setContent(newRegionContent);
						in.close();

						String htmlOutput = XMLUtils.toHtml(tempDoc, charSet);
						File outputFile = new File("c:\\tmp\\output.html");
						FileUtils.writeStringToFile(outputFile, htmlOutput);
						Runtime.getRuntime().exec(
								"rundll32 url.dll,FileProtocolHandler "
										+ outputFile.toURI().toURL());
					}
					writer.close();
					oldCleaner = null;
					newCleaner = null;
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			return;
		}
	}

	private void cleanInvalidAttributes(TagNode parent) {
		List nodes = parent.getChildren();
		if (nodes != null) {
			for (int i = 0; i < nodes.size(); i++) {
				Object curChild = nodes.get(i);
				if (curChild instanceof TagNode) {
					TagNode curNode = (TagNode) curChild;
					Map attrMap = curNode.getAttributes();
					Set<String> toRemove = new HashSet<String>();
					for (Object entryObj : attrMap.entrySet()) {
						Entry entry = (Entry) entryObj;
						String attrName = (String) entry.getKey();
						if (!HtmlUtils.isValidAttribute(attrName)) {
							toRemove.add(attrName);
						}
					}
					for (String remove : toRemove) {
						curNode.removeAttribute(remove);
					}
					cleanInvalidAttributes(curNode);
				}
			}
		}
	}

	private String createStringRepr(Element elem, boolean prettyPrint,

	String encoding) throws IOException {

		// write out the xml to a string
		StringWriter writer = new StringWriter();
		Format format = Format.getPrettyFormat();
		format.setExpandEmptyElements(true);
		format.setOmitDeclaration(true);
		format.setEncoding(encoding);
		XMLOutputter out = new XMLOutputter(format);
		out.output(elem, writer);

		// wrap it with a region of interest div
		String xmlstr = writer.toString();
		String region = "<div class=\"region-of-interest\">" + xmlstr
				+ "</div>";
		writer.close();
		return region;
	}
}
