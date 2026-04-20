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
@CrossOrigin(origins = "*")
public class AuthController {
    @Autowired private PatientRepository patientRepository;
    @Autowired private AiHealthService aiHealthService;

    @PostMapping("/diagnose")
    public ResponseEntity<?> runDiagnostic(@RequestBody Patient pData) {
        try {
            String fullReport = aiHealthService.generateClinicalInsight(pData);
            
            // Logic for Recommendation & Priority
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

                // Chart Tracking: format "BPM,Timestamp|"
                String entry = pData.getHeartRate() + "," + System.currentTimeMillis() + "|";
                String history = p.getVitalsHistory() == null ? "" : p.getVitalsHistory();
                p.setVitalsHistory(history + entry);

                Patient saved = patientRepository.save(p);
                return ResponseEntity.ok(saved);
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

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Patient l) {
        Optional<Patient> p = patientRepository.findByEmail(l.getEmail().toLowerCase().trim());
        if (p.isPresent() && p.get().getPassword().equals(l.getPassword())) return ResponseEntity.ok(p.get());
        return ResponseEntity.status(401).build();
    }
}
