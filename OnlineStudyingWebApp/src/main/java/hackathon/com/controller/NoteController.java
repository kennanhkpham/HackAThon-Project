package hackathon.com.controller;

import hackathon.com.dto.UserDTO;
import hackathon.com.jwt.JWTUtil;
import hackathon.com.model.User;
import hackathon.com.request.UserRegistrationRequest;
import hackathon.com.service.PdfAiAnalyzer;
import hackathon.com.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/note")
public class NoteController {

    @PostMapping("/upload")
    public ResponseEntity<?> uploadPdf(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty!");
        }

        String filename = file.getOriginalFilename();
        long size = file.getSize();

        PdfAiAnalyzer analyzer = new PdfAiAnalyzer();
        String summary = analyzer.summarize(file);

        return ResponseEntity.ok("Summary: " + summary);
    }
    @PostMapping("/makeCardsandTopics")
    public ResponseEntity<?> makeCardsandTopics(@RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty!");
        }
    }
}
