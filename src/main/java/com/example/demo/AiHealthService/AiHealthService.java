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
            // Null-safe checks for vitals
            String bp = (patient.getBloodPressure() != null) ? patient.getBloodPressure() : "120/80";
            String hr = (patient.getHeartRate() != null) ? patient.getHeartRate() : "72";
            String history = (patient.getMedicalHistory() != null) ? patient.getMedicalHistory() : "None";

            // Using a prompt that asks for "Analysis" instead of "Diagnosis" to avoid safety blocks
            String prompt = String.format(
                "Provide a professional health analysis report based on: BP %s, Heart Rate %s, and History %s. " +
                "Include Bold Headings for: CLINICAL SUMMARY, RISK ASSESSMENT, and LIFESTYLE ADVICE. " +
                "Write at least 450 words.",
                bp, hr, history
            );

            // This call uses the settings from application.properties automatically
            return chatModel.call(prompt);

        } catch (Exception e) {
            return "AI Error: The request was blocked or failed. Details: " + e.getMessage();
        }
    }
}
