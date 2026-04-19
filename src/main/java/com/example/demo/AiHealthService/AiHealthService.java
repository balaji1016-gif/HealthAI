package com.example.demo.AiHealthService;

import com.example.demo.patient.Patient;
import org.springframework.ai.google.genai.GoogleGenAiChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AiHealthService {

    @Autowired
    private GoogleGenAiChatModel chatModel;

    public String generateClinicalInsight(Patient patient) {
        try {
            // Keep the prompt professional but safe to avoid Google's auto-block
            String prompt = "Provide a health analysis report for: BP " + patient.getBloodPressure() + 
                            ", Heart Rate " + patient.getHeartRate() + 
                            ", History: " + patient.getMedicalHistory() + ". " +
                            "Use BOLD headers for: SUMMARY, RISK ASSESSMENT, and ADVICE.";

            // This direct call uses your application.properties for safety settings
            return chatModel.call(prompt);
        } catch (Exception e) {
            return "AI Error: Safety block triggered. Check BLOCK_NONE in properties. " + e.getMessage();
        }
    }
}
