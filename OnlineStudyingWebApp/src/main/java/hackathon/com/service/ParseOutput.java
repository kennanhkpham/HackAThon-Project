package hackathon.com.service;
import java.util.List;
import com.google.gson.*;
import hackathon.com.model.FlashCard;
import hackathon.com.model.Topic;

public class ParseOutput {
    public static void parseOutput(String input, List<Topic> topics, List<FlashCard> vocabs) {
        /*Gson gson = new Gson();
        JsonObject jsonObject = JsonParser.parseString(jsonInput).getAsJsonObject();

        if (jsonObject.has("topics")) {
            JsonArray topicArray = jsonObject.getasJsonArray("topics");
            for (JsonElement elem : topicArray) {
                String topicName = elem.getAsString();
                topics.add(new Topic(topicName));
            }
        }
        if (jsonObject.has("vocab")) {
            JsonArray vocabArray = jsonObject.getAsJsonArray("vocab");
            for (JsonElement elem : vocabArray) {
                JsonObjecct vocabItem = elem.getAsJsonObject();

                if (vocabItem.has("term") && vocabItem.has("definition")) {
                    String term = vocabItem.get("term").getAsString().trim();
                    String definition = vocabItem.get("definition").getAsString().trim();

                    if (!term.isempty() && !definition.isEmpty()) {
                        vocabs.add(new FlashCard(term, definition));

                    }

                }
            }
        }*/
    }
}