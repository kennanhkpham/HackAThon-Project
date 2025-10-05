package hackathon.com.service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public class PdfAiAnalyzer {
    Client client = Client.builder().apiKey("AIzaSyCAwPlZIm0DWGGPlnJRrgKoDUhKbgEtzS8").build();

    public String parseInput(String input){
        String prompt = "Please create a JSON style output that gives 1)Vocab terms and 2)Key concepts. Make key concepts one String that is just the topic, but vocab is term and definition\nOutput only the data for the json file in plain text\n\n" + input;
        GenerateContentResponse response = client.models.generateContent("gemini-2.5-flash", prompt, null);
        return response.text();
    }

    public String summarize(MultipartFile file){
        String fileOutput = PdfReader.extractTextWithFile(file);
        String prompt = "Please summarize these notes. Keep it short\n\n" + fileOutput;

        GenerateContentResponse response = client.models.generateContent("gemini-2.5-flash", prompt, null);
        return response.text();
    }

    public static void main(String[] args) throws IOException {
        PdfAiAnalyzer analyzer = new PdfAiAnalyzer();
        String inputFile = "example.pdf";
        String inputString = PdfReader.extractTextWithPath(inputFile);
        String studyables = analyzer.parseInput(inputString);
        System.out.println(studyables);
    }
}
