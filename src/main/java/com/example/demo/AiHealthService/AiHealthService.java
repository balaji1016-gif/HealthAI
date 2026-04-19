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
            String bp = (patient.getBloodPressure() != null) ? patient.getBloodPressure() : "Not Provided";
            String hr = (patient.getHeartRate() != null) ? patient.getHeartRate() : "Not Provided";
            String history = (patient.getMedicalHistory() != null) ? patient.getMedicalHistory() : "None";

            String prompt = String.format(
                "Act as a professional Health Analyst. Provide a detailed analysis based on:\n" +
                "BP: %s, Heart Rate: %s, History: %s.\n\n" +
                "Structure the report with these Bold headers:\n" +
                "1. CLINICAL SUMMARY\n2. RISK ASSESSMENT\n3. LIFESTYLE ADVICE\n4. PRECAUTIONS.\n\n" +
                "Write 450 words. Professional tone.",
                bp, hr, history
            );

            return chatModel.call(prompt);
        } catch (Exception e) {
            return "AI Error: Safety filters triggered or API Key invalid. Details: " + e.getMessage();
        }
    }
}
