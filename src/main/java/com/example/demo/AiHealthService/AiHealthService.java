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
            // Safe null checks for patient data
            String bp = (patient.getBloodPressure() != null) ? patient.getBloodPressure() : "120/80";
            String hr = (patient.getHeartRate() != null) ? patient.getHeartRate() : "72";
            String history = (patient.getMedicalHistory() != null) ? patient.getMedicalHistory() : "General Checkup";

            String prompt = String.format(
                "Act as a professional Health Analyst. Generate a 500-word full-page clinical report for:\n" +
                "Blood Pressure: %s, Heart Rate: %s, Medical History: %s.\n\n" +
                "Use BOLD headings for these sections:\n" +
                "1. CLINICAL SUMMARY\n2. RISK ASSESSMENT\n3. PHYSIOLOGICAL IMPACT\n4. LIFESTYLE ADVICE\n5. PRECAUTIONS.\n\n" +
                "Tone: Professional and clinical.",
                bp, hr, history
            );

            // This direct call uses the safety settings from your application.properties automatically
            return chatModel.call(prompt);

        } catch (Exception e) {
            return "AI Error: Failed to generate report. Details: " + e.getMessage();
        }
    }
}
