package hackathon.com.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import java.io.File;
import java.io.IOException;


public class PdfReader {
    public static String extractText(String pdfPath) throws IOException {
        PDDocument document = PDDocument.load(new File(pdfPath));
        PDFTextStripper stripper = new PDFTextStripper();
        String text = stripper.getText(document);
        document.close();
        return text;
    }

    public static void main(String[] args) throws IOException {
        String pdfText = extractText("example.pdf");
        System.out.println(pdfText.substring(0, Math.min(500, pdfText.length()))); // Preview first 500 chars
    }
}
