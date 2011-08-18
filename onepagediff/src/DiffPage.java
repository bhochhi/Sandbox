import java.awt.Container;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.net.URL;
import java.util.Locale;

import javax.jnlp.BasicService;
import javax.jnlp.ServiceManager;
import javax.jnlp.UnavailableServiceException;
import javax.swing.JButton;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JProgressBar;
import javax.swing.JTextField;
import javax.swing.SwingUtilities;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.sax.SAXTransformerFactory;
import javax.xml.transform.sax.TransformerHandler;
import javax.xml.transform.stream.StreamResult;

import org.outerj.daisy.diff.HtmlCleaner;
import org.outerj.daisy.diff.XslFilter;
import org.outerj.daisy.diff.html.HTMLDiffer;
import org.outerj.daisy.diff.html.HtmlSaxDiffOutput;
import org.outerj.daisy.diff.html.TextNodeComparator;
import org.outerj.daisy.diff.html.dom.DomTreeBuilder;
import org.xml.sax.ContentHandler;
import org.xml.sax.InputSource;
import org.xml.sax.helpers.AttributesImpl;

import com.telogical.diff.core.HtmlDiffEngine;

public class DiffPage implements ActionListener {
	JFrame appFrame;
	JLabel newLabel, oldLabel, loadLabel;
	JTextField newText, oldText;
	JButton newButton, oldButton, diffButton;
	Container cPane;
	HDiffService diffService;

	public static void main(String[] args) {
		new DiffPage();
	}

	public DiffPage() {
		createGUI();
		diffService = new HDiffService();
	}

	private void createGUI() {
		appFrame = new JFrame("Single Page HTML Differ");
		cPane = appFrame.getContentPane();
		cPane.setLayout(new GridBagLayout());
		arrangeComponents();
		appFrame.setLocationRelativeTo(null);
		appFrame.setSize(400, 150);
		appFrame.setResizable(false);
		appFrame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		appFrame.pack();
		appFrame.setVisible(true);
	}

	private void arrangeComponents() {
		newLabel = new JLabel("New  Page: ");
		oldLabel = new JLabel("Old Page: ");
		newText = new JTextField(20);
		oldText = new JTextField(20);
		oldButton = new JButton("add...");
		newButton = new JButton("add...");
		diffButton = new JButton("StartDiff");
		oldButton.addActionListener(this);
		newButton.addActionListener(this);
		diffButton.addActionListener(this);
		newText.setText("C:\\tmp\\new.html");
		oldText.setText("C:\\tmp\\old.html");

		GridBagConstraints gbc1 = new GridBagConstraints();
		gbc1.gridx = 0;
		gbc1.gridy = 0;
		gbc1.insets = new Insets(5, 5, 5, 5);
		cPane.add(oldLabel, gbc1);

		GridBagConstraints gbc2 = new GridBagConstraints();
		gbc2.gridx = 1;
		gbc2.gridy = 0;
		gbc2.insets = new Insets(5, 5, 5, 5);
		cPane.add(oldText, gbc2);

		GridBagConstraints gbc3 = new GridBagConstraints();
		gbc3.gridx = 2;
		gbc3.gridy = 0;
		gbc3.insets = new Insets(5, 5, 5, 5);
		cPane.add(oldButton, gbc3);

		GridBagConstraints gbc4 = new GridBagConstraints();
		gbc4.gridx = 0;
		gbc4.gridy = 1;
		gbc4.insets = new Insets(5, 5, 5, 5);
		cPane.add(newLabel, gbc4);

		GridBagConstraints gbc5 = new GridBagConstraints();
		gbc5.gridx = 1;
		gbc5.gridy = 1;
		gbc5.insets = new Insets(5, 5, 5, 5);
		cPane.add(newText, gbc5);

		GridBagConstraints gbc6 = new GridBagConstraints();
		gbc6.gridx = 2;
		gbc6.gridy = 1;
		gbc6.insets = new Insets(5, 5, 5, 5);
		cPane.add(newButton, gbc6);

		GridBagConstraints gbc7 = new GridBagConstraints();
		gbc7.gridx = 1;
		gbc7.gridy = 2;
		gbc7.insets = new Insets(5, 5, 5, 5);
		cPane.add(diffButton, gbc7);

	}

	@Override
	public void actionPerformed(ActionEvent e) {
		if (e.getSource() == oldButton) {
			JFileChooser fc = new JFileChooser();
			fc.setCurrentDirectory(new File("c:\\tmp"));
			int returnVal = fc.showOpenDialog(null);
			if (returnVal == JFileChooser.APPROVE_OPTION) {
				File oldFile = fc.getSelectedFile();
				oldText.setText(oldFile.getAbsolutePath());

			}
		} else if (e.getSource() == newButton) {
			JFileChooser fc = new JFileChooser();
			fc.setCurrentDirectory(new File("c:\\tmp"));
			int returnVal = fc.showOpenDialog(null);
			if (returnVal == JFileChooser.APPROVE_OPTION) {
				File newFile = fc.getSelectedFile();
				newText.setText(newFile.getAbsolutePath());
			}
		} else if (e.getSource() == diffButton) {
			diffButton.setText("Diffing...");
			appFrame.pack();
			diffButton.setEnabled(false);
			SwingUtilities.invokeLater(new Runnable() {
				@Override
				public void run() {
					try {
						if(newText.getText().isEmpty() || oldText.getText().isEmpty()){
							loadLabel.setText("Invalid input parameters");
							loadLabel.setVisible(true);
							diffButton.setEnabled(true);
							diffButton.setText("StartDiff");
							return;
						}
						else if (!new File(newText.getText()).exists() || !new File(oldText.getText()).exists()){
							loadLabel.setText("Input page doesn't exist");
							diffButton.setEnabled(true);
							diffButton.setText("StartDiff");
							return;
						}

						diffService.startDiff(newText.getText(),
								oldText.getText());
			
						diffButton.setEnabled(true);
						diffButton.setText("StartDiff");
					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			});

		}
	}
	
	

}
