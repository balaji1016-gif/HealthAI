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
        String prompt = String.format(
            "Act as a professional Clinical Cardiologist. Generate a detailed, FULL-PAGE medical analysis report based on these CURRENT vitals:\n\n" +
            "Blood Pressure: %s\n" +
            "Heart Rate: %s BPM\n" +
            "Symptoms/History: %s\n\n" +
            "The report MUST include these sections in bold:\n" +
            "1. CLINICAL SUMMARY: Detailed interpretation of these specific numbers.\n" +
            "2. CARDIOVASCULAR RISK ASSESSMENT: Analyze the correlation between BP and Heart Rate.\n" +
            "3. PHYSIOLOGICAL IMPACT: How these metrics affect organ health.\n" +
            "4. LIFESTYLE & DIETARY INTERVENTIONS: Specific, actionable advice.\n" +
            "5. MEDICAL PRECAUTIONS: Necessary follow-up steps.\n\n" +
            "Write at least 450 words. Use a professional medical tone. If BP > 140/90 or HR > 100, provide a high-priority warning.",
            patient.getBloodPressure(),
            patient.getHeartRate(),
            patient.getMedicalHistory()
        );

        return chatModel.call(prompt);
    }
}
