package hackathon.com.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import hackathon.com.model.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AIService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Generate flashcards from extracted text
     */
    public List<FlashCard> generateFlashcards(String text, Note note) {
        String prompt = buildFlashcardPrompt(text);
        String aiResponse = callGeminiAPI(prompt);
        return parseFlashcardResponse(aiResponse, note);
    }

    /**
     * Extract topics from text
     */
    public List<Topic> extractTopics(String text, Note note) {
        String prompt = buildTopicExtractionPrompt(text);
        String aiResponse = callGeminiAPI(prompt);
        return parseTopicResponse(aiResponse, note);
    }

    /**
     * Generate quiz from flashcards and topics
     */
    public Quiz generateQuiz(Note note, List<FlashCard> flashcards, List<Topic> topics) {
        String prompt = buildQuizPrompt(note, flashcards, topics);
        String aiResponse = callGeminiAPI(prompt);
        return parseQuizResponse(aiResponse, note, flashcards);
    }

    /**
     * Call Gemini API with the given prompt
     */
    private String callGeminiAPI(String prompt) {
        try {
            // Build the URL with API key
            String urlWithKey = geminiApiUrl + "?key=" + geminiApiKey;

            // Prepare headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Build request body for Gemini API
            Map<String, Object> requestBody = new HashMap<>();

            // Add contents array with parts
            List<Map<String, Object>> contents = new ArrayList<>();
            Map<String, Object> content = new HashMap<>();

            List<Map<String, String>> parts = new ArrayList<>();
            Map<String, String> part = new HashMap<>();
            part.put("text", prompt);
            parts.add(part);

            content.put("parts", parts);
            contents.add(content);
            requestBody.put("contents", contents);

            // Add generation config
            Map<String, Object> generationConfig = new HashMap<>();
            generationConfig.put("temperature", 0.7);
            generationConfig.put("topK", 40);
            generationConfig.put("topP", 0.95);
            generationConfig.put("maxOutputTokens", 2048);
            requestBody.put("generationConfig", generationConfig);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // Make the API call
            ResponseEntity<String> response = restTemplate.exchange(
                    urlWithKey,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            // Parse the response
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());

            // Extract text from Gemini response structure
            String generatedText = root
                    .path("candidates").get(0)
                    .path("content")
                    .path("parts").get(0)
                    .path("text").asText();

            return generatedText;

        } catch (Exception e) {
            throw new RuntimeException("Failed to call Gemini API: " + e.getMessage(), e);
        }
    }

    /**
     * Build prompt for flashcard generation
     */
    private String buildFlashcardPrompt(String text) {
        return String.format("""
            You are an expert educational assistant. Based on the following text, generate flashcards in JSON format.
            
            Requirements:
            - Generate 10-15 flashcards covering the most important concepts
            - Each flashcard must have: term, definition, example, and difficultyLevel (1-5)
            - Make definitions clear and concise
            - Provide practical examples
            - Rate difficulty objectively
            
            Text to analyze:
            %s
            
            IMPORTANT: Return ONLY a valid JSON array, no additional text or markdown:
            [
              {
                "term": "concept name",
                "definition": "clear definition",
                "example": "practical example",
                "difficultyLevel": 3
              }
            ]
            """, text);
    }

    /**
     * Build prompt for topic extraction
     */
    private String buildTopicExtractionPrompt(String text) {
        return String.format("""
            You are an expert educational assistant. Analyze the following text and extract the main topics.
            
            Requirements:
            - Identify 5-10 main topics or themes
            - Rate each topic's importance on a scale of 1-10
            - Consider frequency, depth, and relevance
            
            Text to analyze:
            %s
            
            IMPORTANT: Return ONLY a valid JSON array, no additional text or markdown:
            [
              {
                "name": "Topic Name",
                "importanceScore": 8
              }
            ]
            """, text);
    }

    /**
     * Build prompt for quiz generation
     */
    private String buildQuizPrompt(Note note, List<FlashCard> flashcards, List<Topic> topics) {
        StringBuilder flashcardsSummary = new StringBuilder();
        for (int i = 0; i < Math.min(flashcards.size(), 15); i++) {
            FlashCard f = flashcards.get(i);
            flashcardsSummary.append(String.format("%d. %s: %s\n", i+1, f.getTerm(), f.getDefinition()));
        }

        String topicsList = topics.stream()
                .map(Topic::getName)
                .collect(Collectors.joining(", "));

        return String.format("""
            You are an expert educational assistant. Create a comprehensive quiz based on these flashcards.
            
            Topics covered: %s
            
            Flashcards:
            %s
            
            Requirements:
            - Create exactly 10 multiple-choice questions
            - Each question must have exactly 4 options
            - Questions should test understanding, not just memorization
            - Include one correct answer and three plausible distractors
            - Vary difficulty levels
            - Cover different topics proportionally
            
            IMPORTANT: Return ONLY a valid JSON object, no additional text or markdown:
            {
              "title": "Quiz on [Main Topic]",
              "questions": [
                {
                  "questionText": "What is...?",
                  "options": ["Option A", "Option B", "Option C", "Option D"],
                  "correctAnswerIndex": 2
                }
              ]
            }
            """, topicsList, flashcardsSummary.toString());
    }

    /**
     * Parse flashcard response from Gemini
     */
    private List<FlashCard> parseFlashcardResponse(String aiResponse, Note note) {
        ObjectMapper mapper = new ObjectMapper();
        List<FlashCard> flashcards = new ArrayList<>();

        try {
            // Clean the response - remove markdown code blocks if present
            String cleanedResponse = aiResponse.trim();
            if (cleanedResponse.startsWith("```json")) {
                cleanedResponse = cleanedResponse.substring(7);
            }
            if (cleanedResponse.startsWith("```")) {
                cleanedResponse = cleanedResponse.substring(3);
            }
            if (cleanedResponse.endsWith("```")) {
                cleanedResponse = cleanedResponse.substring(0, cleanedResponse.length() - 3);
            }
            cleanedResponse = cleanedResponse.trim();

            JsonNode root = mapper.readTree(cleanedResponse);

            for (JsonNode node : root) {
                FlashCard flashcard = new FlashCard();
                flashcard.setTerm(node.get("term").asText());
                flashcard.setDefinition(node.get("definition").asText());
                flashcard.setExample(node.has("example") ? node.get("example").asText() : "");
                flashcard.setDifficultyLevel(node.get("difficultyLevel").asInt());
                flashcard.setNote(note);
                flashcards.add(flashcard);
            }

            return flashcards;

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse flashcard response: " + e.getMessage() + "\nResponse: " + aiResponse, e);
        }
    }

    /**
     * Parse topic response from Gemini
     */
    private List<Topic> parseTopicResponse(String aiResponse, Note note) {
        ObjectMapper mapper = new ObjectMapper();
        List<Topic> topics = new ArrayList<>();

        try {
            // Clean the response
            String cleanedResponse = aiResponse.trim();
            if (cleanedResponse.startsWith("```json")) {
                cleanedResponse = cleanedResponse.substring(7);
            }
            if (cleanedResponse.startsWith("```")) {
                cleanedResponse = cleanedResponse.substring(3);
            }
            if (cleanedResponse.endsWith("```")) {
                cleanedResponse = cleanedResponse.substring(0, cleanedResponse.length() - 3);
            }
            cleanedResponse = cleanedResponse.trim();

            JsonNode root = mapper.readTree(cleanedResponse);

            for (JsonNode node : root) {
                Topic topic = new Topic();
                topic.setName(node.get("name").asText());
                topic.setImportantScore(node.get("importanceScore").asInt());
                topic.setNote(note);
                topics.add(topic);
            }

            return topics;

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse topic response: " + e.getMessage() + "\nResponse: " + aiResponse, e);
        }
    }

    /**
     * Parse quiz response from Gemini
     */
    private Quiz parseQuizResponse(String aiResponse, Note note, List<FlashCard> flashcards) {
        ObjectMapper mapper = new ObjectMapper();

        try {
            // Clean the response
            String cleanedResponse = aiResponse.trim();
            if (cleanedResponse.startsWith("```json")) {
                cleanedResponse = cleanedResponse.substring(7);
            }
            if (cleanedResponse.startsWith("```")) {
                cleanedResponse = cleanedResponse.substring(3);
            }
            if (cleanedResponse.endsWith("```")) {
                cleanedResponse = cleanedResponse.substring(0, cleanedResponse.length() - 3);
            }
            cleanedResponse = cleanedResponse.trim();

            JsonNode root = mapper.readTree(cleanedResponse);

            Quiz quiz = new Quiz();
            quiz.setTitle(root.get("title").asText());
            quiz.setDateCreated(LocalDateTime.now());
            quiz.setScore(0.0);
            quiz.setNote(note);

            List<QuizQuestion> questions = new ArrayList<>();
            JsonNode questionsNode = root.get("questions");

            for (JsonNode qNode : questionsNode) {
                QuizQuestion question = new QuizQuestion();
                question.setQuestion(qNode.get("questionText").asText());

                List<String> options = new ArrayList<>();
                JsonNode optionsNode = qNode.get("options");
                for (JsonNode optNode : optionsNode) {
                    options.add(optNode.asText());
                }
                question.setOptions(options);

                question.setCorrectAnswerIndex(qNode.get("correctAnswerIndex").asInt());
                question.setSelectedAnswerIndex(-1); // Not answered yet
                question.setQuiz(quiz);

                questions.add(question);
            }

            quiz.setQuizQuestions(questions);
            return quiz;

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse quiz response: " + e.getMessage() + "\nResponse: " + aiResponse, e);
        }
    }
}