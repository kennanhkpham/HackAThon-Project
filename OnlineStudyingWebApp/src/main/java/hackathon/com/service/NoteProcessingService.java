package hackathon.com.service;

import hackathon.com.model.*;
import hackathon.com.repository.*;
import hackathon.com.response.NoteUploadResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class NoteProcessingService {
    private final NoteRepository noteRepository;

    private final FlashcardRepository flashcardRepository;

    private final QuizRepository quizRepository;

    private final TopicRepository topicRepository;

    private final UserRepository userRepository;

    private final AIService aiService;

    private final PDFExtractionService pdfExtractionService;

    public NoteUploadResponse processNoteUpload(MultipartFile file, Long userId) throws Exception {

        // Get user entity
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Step 1: Extract text from PDF
        String extractedText = pdfExtractionService.extractTextFromPDF(file);

        // Step 2: Save Note entity
        Note note = new Note();
        note.setFileName(file.getOriginalFilename());
        note.setFileSource(saveFileAndGetPath(file));
        note.setUploadDate(LocalDateTime.now());
        note.setProcessed(false);
        note.setUser(user);
        note = noteRepository.save(note);

        // Step 3: Generate flashcards using AI
        List<FlashCard> flashcards = aiService.generateFlashcards(extractedText, note);
        Note finalNote = note;
        flashcards.forEach(f -> f.setNote(finalNote));
        flashcardRepository.saveAll(flashcards);

        // Step 4: Extract topics using AI
        List<Topic> topics = aiService.extractTopics(extractedText, note);
        Note finalNote1 = note;
        topics.forEach(t -> t.setNote(finalNote1));
        topicRepository.saveAll(topics);

        // Step 5: Generate quiz using AI
        Quiz quiz = aiService.generateQuiz(note, flashcards, topics);
        quiz.setUser(user);
        quiz.setNote(note);
        quiz.getQuizQuestions().forEach(q -> q.setQuiz(quiz));
        quizRepository.save(quiz);

        // Step 6: Update note as processed
        note.setProcessed(true);
        noteRepository.save(note);

        return new NoteUploadResponse(
                note.getId(),
                "Note processed successfully",
                flashcards.size(),
                topics.size(),
                quiz.getId()
        );
    }

    public Optional<Note> getNoteById(Long noteId) {
        return noteRepository.findById(noteId);
    }

    public List<Note> getNotesByUserEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return noteRepository.findByUser(user);
    }

    private String saveFileAndGetPath(MultipartFile file) throws IOException, IOException {
        String uploadDir = "uploads/notes/";
        Path filePath = Paths.get(uploadDir + System.currentTimeMillis() + "_" + file.getOriginalFilename());
        Files.createDirectories(filePath.getParent());
        Files.write(filePath, file.getBytes());
        return filePath.toString();
    }
}