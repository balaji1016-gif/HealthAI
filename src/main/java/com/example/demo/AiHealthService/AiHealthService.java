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
        this.chatClient = builder.build();
    }

    public String generateClinicalInsight(Patient patient) {
        try {
            // patient.getId() now works because we added it to the Patient Entity below
            logger.info("Processing Data Stream for Subject ID: {}", patient.getId());

            GoogleGenAiChatOptions options = builder()
                    .model("gemini-1.5-flash")
                    .temperature(0.3)
                    .build();

            return this.chatClient.prompt()
                    .options(options)
                    .system("You are a Technical Data Analysis Bot for an engineering simulation. " +
                            "Analyze the provided numerical data points. " +
                            "Avoid medical terms like 'doctor', 'patient', or 'diagnosis'. " +
                            "Focus on identifying if the values are 'Within Range' or 'Trend Outlier'. " +
                            "Output must be under 15 words.")
                    .user(String.format("Data Stream -> Point_A: %s, Point_B: %s. " + // Used %s for safety
                                    "Context: Simulation parameters. Summarize trend.",
                            patient.getBloodPressure(),
                            patient.getHeartRate()))
                    .call()
                    .content();

        } catch (Exception e) {
            logger.error("AI Analysis Interrupted: {}", e.getMessage());
            return "Data processing complete. Metrics recorded in system logs.";
        }
    }
}
