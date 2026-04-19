package com.example.demo.AiHealthService;

import com.example.demo.patient.Patient;
import org.springframework.ai.google.genai.GoogleGenAiChatModel;
import org.springframework.ai.google.genai.GoogleGenAiChatOptions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AiHealthService {

    @Autowired
    private GoogleGenAiChatModel chatModel;

    public String generateClinicalInsight(Patient patient) {
        try {
            // MANUALLY OVERRIDE SAFETY FILTERS IN CODE
            GoogleGenAiChatOptions options = GoogleGenAiChatOptions.builder()
                .withModel("gemini-1.5-flash")
                .withTemperature(0.7)
                // This tells Google NOT to block medical/clinical content for this request
                .withSafetySettings(List.of(
                    new GoogleGenAiChatOptions.SafetySetting("HATE", "BLOCK_NONE"),
                    new GoogleGenAiChatOptions.SafetySetting("HARASSMENT", "BLOCK_NONE"),
                    new GoogleGenAiChatOptions.SafetySetting("DANGEROUS_CONTENT", "BLOCK_NONE"),
                    new GoogleGenAiChatOptions.SafetySetting("SEXUALLY_EXPLICIT", "BLOCK_NONE")
                ))
                .build();

            String prompt = String.format(
                "Write a professional health analysis report for a user with:\n" +
                "Blood Pressure: %s, Heart Rate: %s, Medical History: %s.\n\n" +
                "The report must include these BOLD headers:\n" +
                "1. CLINICAL SUMMARY\n2. RISK ASSESSMENT\n3. PHYSIOLOGICAL IMPACT\n4. LIFESTYLE ADVICE\n5. PRECAUTIONS.\n\n" +
                "Use a professional tone and provide at least 450 words of detailed analysis.",
                patient.getBloodPressure(),
                patient.getHeartRate(),
                patient.getMedicalHistory()
            );

            // Call the model with the explicit safety-disabled options
            return chatModel.call(new org.springframework.ai.chat.prompt.Prompt(prompt, options))
                            .getResult()
                            .getOutput()
                            .getContent();

        } catch (Exception e) {
            System.err.println("Gemini Error: " + e.getMessage());
            return "AI SYSTEM ERROR: Safety filters or API issues are preventing report generation. " +
                   "Error details: " + e.getMessage();
        }
    }
}
