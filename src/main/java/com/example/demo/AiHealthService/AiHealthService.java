package com.example.demo.AiHealthService;

import com.example.demo.patient.Patient;
import org.springframework.ai.google.genai.GoogleGenAiChatModel;
import org.springframework.ai.google.genai.GoogleGenAiChatOptions;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AiHealthService {

    @Autowired
    private GoogleGenAiChatModel chatModel;

    public String generateClinicalInsight(Patient patient) {
        try {
            // Updated to match Spring AI 1.1.4 syntax
            GoogleGenAiChatOptions options = GoogleGenAiChatOptions.builder()
                .model("gemini-1.5-flash") // Removed "with" prefix
                .temperature(0.7)
                .safetySettings(List.of(
                    // Using internal static class correctly for your version
                    new GoogleGenAiChatOptions.SafetySetting(
                        GoogleGenAiChatOptions.SafetySetting.HarmCategory.HATE_SPEECH, 
                        GoogleGenAiChatOptions.SafetySetting.HarmBlockThreshold.BLOCK_NONE),
                    new GoogleGenAiChatOptions.SafetySetting(
                        GoogleGenAiChatOptions.SafetySetting.HarmCategory.HARASSMENT, 
                        GoogleGenAiChatOptions.SafetySetting.HarmBlockThreshold.BLOCK_NONE),
                    new GoogleGenAiChatOptions.SafetySetting(
                        GoogleGenAiChatOptions.SafetySetting.HarmCategory.DANGEROUS_CONTENT, 
                        GoogleGenAiChatOptions.SafetySetting.HarmBlockThreshold.BLOCK_NONE),
                    new GoogleGenAiChatOptions.SafetySetting(
                        GoogleGenAiChatOptions.SafetySetting.HarmCategory.SEXUALLY_EXPLICIT, 
                        GoogleGenAiChatOptions.SafetySetting.HarmBlockThreshold.BLOCK_NONE)
                ))
                .build();

            String promptText = String.format(
                "Write a professional health analysis report for a user with:\n" +
                "Blood Pressure: %s, Heart Rate: %s, Medical History: %s.\n\n" +
                "The report must include these BOLD headers:\n" +
                "1. CLINICAL SUMMARY\n2. RISK ASSESSMENT\n3. PHYSIOLOGICAL IMPACT\n4. LIFESTYLE ADVICE\n5. PRECAUTIONS.\n\n" +
                "Use a professional medical tone and provide at least 450 words.",
                patient.getBloodPressure() != null ? patient.getBloodPressure() : "120/80",
                patient.getHeartRate() != null ? patient.getHeartRate() : "72",
                patient.getMedicalHistory() != null ? patient.getMedicalHistory() : "General checkup"
            );

            // Using getText() as required by AssistantMessage in your version
            return chatModel.call(new Prompt(promptText, options))
                            .getResult()
                            .getOutput()
                            .getText(); 

        } catch (Exception e) {
            return "AI Error: Failed to generate report. " + e.getMessage();
        }
    }
}
