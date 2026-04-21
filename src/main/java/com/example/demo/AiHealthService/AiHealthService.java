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
        String bp = patient.getBloodPressure();
        String hr = patient.getHeartRate();
        String doubts = patient.getDoubts();
        
        try {
            // Refined prompt to ensure long-form HTML content and professional medical tone
            String prompt = "Act as a Senior Medical Consultant. Provide an 800-word highly detailed Clinical Analysis report for a patient with " +
                            "Blood Pressure: " + bp + ", Heart Rate: " + hr + " BPM, and reported symptoms: '" + doubts + "'. " +
                            "FORMATTING RULES: Use <b> tags for section headers and <br/> tags for line breaks. " +
                            "Sections must include: 1. Vitals Assessment, 2. Physiological Implications, 3. Risk Factor Analysis, 4. Strategic Recommendations. " +
                            "The response must be long enough to fill a full page and look like a formal clinical document.";
            
            return chatModel.call(prompt);
        } catch (Exception e) {
            // Dynamic fallback that still respects the HTML structure for the frontend
            return "<b>1. DATA SUMMARY</b><br/>Analysis for BP: " + bp + " and HR: " + hr + ".<br/><br/>" +
                   "<b>2. CLINICAL STATUS</b><br/>The system is currently experiencing high traffic. However, based on your vitals, " +
                   "your Blood Pressure of " + bp + " and Heart Rate of " + hr + " indicate a need for professional review.<br/><br/>" +
                   "<b>3. RECOMMENDATION</b><br/>Please consult with your assigned doctor immediately using the appointment request feature.";
        }
    }
}
