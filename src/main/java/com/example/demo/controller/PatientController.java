package com.example.demo.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import com.example.demo.patient.Patient;
import com.example.demo.PatientRepository;
import com.example.demo.AiHealthService.AiHealthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patients")
// This line is CRITICAL to fix the "Blank Dashboard" issue
@CrossOrigin(origins = "https://healthai-nx8q.onrender.com")
public class PatientController {

    @Autowired
    private PatientRepository repository;

    @Autowired
    private AiHealthService aiService;

    public PatientController(PatientRepository repository) {
        this.repository = repository;
    }

    // 1. GET ALL PATIENTS (For the Dashboard Grid)
    @GetMapping
    public List<Patient> getAllPatients() {
        return repository.findAll();
    }

    // 2. GET AI ANALYSIS (Phase 3: The "Analyze" Button)
    @GetMapping("/{id}/analyze")
    public ResponseEntity<Map<String,String>> analyzePatient(@PathVariable String id) {
        // Find the patient in the database
        Patient patient = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + id));

        // Call the AI Service to get medical insights
        String insight = aiService.generateClinicalInsight(patient);

        // Return as a JSON object so React can read it easily
        return ResponseEntity.ok(Map.of("insight", insight));
    }

    // 3. ADD NEW PATIENT (Optional: For testing data)
    @PostMapping
    public Patient createPatient(@RequestBody Patient patient) {
        return repository.save(patient);
    }
}
