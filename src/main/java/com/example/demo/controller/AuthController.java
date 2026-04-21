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
// REMOVED @CrossOrigin here because it is handled in WebConfig.java
public class AuthController {
    @Autowired private PatientRepository patientRepository;
    @Autowired private AiHealthService aiHealthService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Patient patient) {
        try {
            if (patientRepository.findByEmail(patient.getEmail().toLowerCase().trim()).isPresent()) {
                return ResponseEntity.status(400).body(Map.of("message", "Email already registered"));
            }
            patient.setEmail(patient.getEmail().toLowerCase().trim());
            patient.setVitalsHistory(""); 
            return ResponseEntity.status(201).body(patientRepository.save(patient));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Patient l) {
        Optional<Patient> p = patientRepository.findByEmail(l.getEmail().toLowerCase().trim());
        if (p.isPresent() && p.get().getPassword().equals(l.getPassword())) {
            return ResponseEntity.ok(p.get());
        }
        return ResponseEntity.status(401).build();
    }

    @PostMapping("/diagnose")
    public ResponseEntity<?> runDiagnostic(@RequestBody Patient pData) {
        try {
            String fullReport = aiHealthService.generateClinicalInsight(pData);
            boolean isRisk = fullReport.toUpperCase().contains("CONTACT DOCTOR") || fullReport.toUpperCase().contains("EMERGENCY");
            String rec = isRisk ? "Contact Doctor Immediately" : "Self-Treat Yourself";

            Optional<Patient> opt = patientRepository.findByEmail(pData.getEmail());
            if (opt.isPresent()) {
                Patient p = opt.get();
                p.setBloodPressure(pData.getBloodPressure());
                p.setHeartRate(pData.getHeartRate());
                p.setDoubts(pData.getDoubts());
                p.setMedicalHistory(fullReport);
                p.setAiRecommendation(rec);
                p.setHighPriority(isRisk);

                String entry = pData.getHeartRate() + "," + System.currentTimeMillis() + "|";
                p.setVitalsHistory((p.getVitalsHistory() == null ? "" : p.getVitalsHistory()) + entry);

                return ResponseEntity.ok(patientRepository.save(p));
            }
            return ResponseEntity.status(404).build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/patients")
    public ResponseEntity<List<Patient>> getAll() { 
        return ResponseEntity.ok(patientRepository.findAll()); 
    }
}
