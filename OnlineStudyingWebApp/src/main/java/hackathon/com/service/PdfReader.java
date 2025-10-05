package hackathon.com.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;

import org.springframework.web.multipart.MultipartFile;


public class PdfReader {
    public static String extractTextWithFile(MultipartFile file){
        try(InputStream is = file.getInputStream();
            PDDocument document = PDDocument.load(is)) {

            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static String extractTextWithPath(String pdfPath) throws IOException {
        PDDocument document = PDDocument.load(new File(pdfPath));
        PDFTextStripper stripper = new PDFTextStripper();
        String text = stripper.getText(document);
        document.close();
        return text;
    }

    public static void main(String[] args) throws IOException {
        String pdfText = extractTextWithPath("example.pdf");
        System.out.println(pdfText.substring(0, Math.min(500, pdfText.length()))); // Preview first 500 chars
    }
}
