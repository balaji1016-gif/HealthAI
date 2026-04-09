package com.example.demo.controller;

import com.example.demo.model.Vitals;
import com.example.demo.repository.VitalsRepository;
import com.example.demo.service.HealthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/vitals")
@CrossOrigin(origins = "health-ai-flame.vercel.app") // Enables connection with your Vite/React frontend
public class VitalsController {

    @Autowired
    private VitalsRepository vitalsRepository;

    @Autowired
    private HealthService healthService;

    /**
     * POST: Adds a new health record for a patient.
     * Triggered when the Patient clicks "Run AI Diagnostic".
     */
    @PostMapping("/add")
    public ResponseEntity<?> addVitals(@RequestBody Vitals vitals) {
        try {
            // 1. Generate the AI Insight using the logic in HealthService
            String insight = healthService.generateAIInsight(
                    vitals.getBloodPressure(),
                    vitals.getHeartRate()
            );
            vitals.setAiInsight(insight);

            // 2. Attach the current server timestamp
            vitals.setTimestamp(LocalDateTime.now());

            // 3. Save to database and return the saved object (including the insight)
            Vitals savedVitals = vitalsRepository.save(vitals);
            return ResponseEntity.ok(savedVitals);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error processing clinical data: " + e.getMessage());
        }
    }

    /**
     * GET: Fetches the full history for a specific patient.
     * Triggered when the Doctor clicks "Review History".
     */
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Vitals>> getPatientHistory(@PathVariable String patientId) {
        // Fetches all logs for this ID, ordered by the newest first
        List<Vitals> history = vitalsRepository.findByPatientIdOrderByTimestampDesc(patientId);
        return ResponseEntity.ok(history);
    }

    /**
     * GET: Fetches ALL vitals (Optional - useful for a general admin view)
     */
    @GetMapping("/all")
    public ResponseEntity<List<Vitals>> getAllVitals() {
        return ResponseEntity.ok(vitalsRepository.findAll());
    }
}
