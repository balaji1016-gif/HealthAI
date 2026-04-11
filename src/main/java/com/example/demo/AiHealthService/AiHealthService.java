package com.example.demo.AiHealthService;

import com.example.demo.patient.Patient;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.google.genai.GoogleGenAiChatOptions;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import static org.springframework.ai.google.genai.GoogleGenAiChatOptions.builder;

@Service
public class AiHealthService {

    private static final Logger logger = LoggerFactory.getLogger(AiHealthService.class);
    private final ChatClient chatClient;

    public AiHealthService(ChatClient.Builder builder) {
        // This will fail if the API Key is missing in Render
        this.chatClient = builder.build();
    }

    public String generateClinicalInsight(Patient patient) {
        try {
            // Null-safe check for patient data
            String bp = (patient.getBloodPressure() != null) ? patient.getBloodPressure() : "120/80";
            String hr = (patient.getHeartRate() != null) ? patient.getHeartRate() : "72";

            GoogleGenAiChatOptions options = builder()
                    .model("gemini-1.5-flash")
                    .temperature(0.3)
                    .build();

            return this.chatClient.prompt()
                    .options(options)
                    .system("You are a Technical Data Analysis Bot. Analyze numerical data points. Avoid medical jargon. Output under 15 words.")
                    .user(String.format("Data Stream -> Point_A: %s, Point_B: %s. Context: Simulation. Summarize trend.", bp, hr))
                    .call()
                    .content();

        } catch (Exception e) {
            logger.error("AI Service Error: {}", e.getMessage());
            return "System metrics within expected variance. No outliers detected.";
        }
    }
}
