package com.example.demo.controller;

import com.example.demo.patient.Patient;
import com.example.demo.PatientRepository;
import com.example.demo.AiHealthService.AiHealthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired private PatientRepository patientRepository;
    @Autowired private AiHealthService aiHealthService;

    @PostMapping("/diagnose")
    public ResponseEntity<?> runDiagnostic(@RequestBody Patient patientData) {
        try {
            String insight = aiHealthService.generateClinicalInsight(patientData);
            // Robust escaping for JSON safety to prevent "Process Failed"
            String escaped = insight.replace("\\", "\\\\")
                                   .replace("\"", "\\\"")
                                   .replace("\n", "<br/>")
                                   .replace("\r", "");
            return ResponseEntity.ok().body("{\"summary\": \"" + escaped + "\"}");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"summary\": \"AI Error: Please check vitals and try again.\"}");
        }
    }

    @PutMapping("/update-vitals")
    public ResponseEntity<?> updateVitals(@RequestBody Patient updatedData) {
        // Cleaning input to prevent 404s due to whitespace or casing
        String cleanEmail = updatedData.getEmail().toLowerCase().trim();
        Optional<Patient> p = patientRepository.findByEmail(cleanEmail);
        if (p.isPresent()) {
            Patient patient = p.get();
            patient.setBloodPressure(updatedData.getBloodPressure());
            patient.setHeartRate(updatedData.getHeartRate());
            patient.setMedicalHistory(updatedData.getMedicalHistory());
            return ResponseEntity.ok(patientRepository.save(patient));
        }
        return ResponseEntity.status(404).body("{\"message\": \"Patient not found\"}");
    }

    @GetMapping("/patients")
    public ResponseEntity<List<Patient>> getAll() { 
        // Explicitly ensuring an array is returned for the Doctor Dashboard table
        return ResponseEntity.ok(patientRepository.findAll()); 
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Patient l) {
        String cleanEmail = l.getEmail().toLowerCase().trim();
        Optional<Patient> p = patientRepository.findByEmail(cleanEmail);
        if (p.isPresent() && p.get().getPassword().equals(l.getPassword())) {
            return ResponseEntity.ok(p.get());
        }
        return ResponseEntity.status(401).build();
    }
}
