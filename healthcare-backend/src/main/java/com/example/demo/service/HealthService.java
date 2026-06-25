package com.example.demo.service;

import org.springframework.stereotype.Service;

@Service
public class HealthService {

    public String generateAIInsight(String bp, int hr) {
        // Logic for Blood Pressure (Simplified for Project)
        String[] bpParts = bp.split("/");
        int systolic = Integer.parseInt(bpParts[0]);

        if (systolic > 140 || hr > 100) {
            return "Warning: Vital signs are outside normal range. High risk of hypertension/tachycardia. Clinical review recommended.";
        } else if (systolic < 90 || hr < 60) {
            return "Observation: Low vital parameters detected. Ensure patient is hydrated and monitor for dizziness.";
        } else {
            return "Stable: Parameters are within the optimal clinical range. Continue regular monitoring.";
        }
    }
}