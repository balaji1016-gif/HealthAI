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
            // Proper JSON escaping for long reports
            String escaped = insight.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "<br/>");
            return ResponseEntity.ok().body("{\"summary\": \"" + escaped + "\"}");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"summary\": \"AI processing error.\"}");
        }
    }

    @PutMapping("/update-vitals")
    public ResponseEntity<?> updateVitals(@RequestBody Patient updatedData) {
        Optional<Patient> p = patientRepository.findByEmail(updatedData.getEmail().toLowerCase().trim());
        if (p.isPresent()) {
            Patient patient = p.get();
            patient.setBloodPressure(updatedData.getBloodPressure());
            patient.setHeartRate(updatedData.getHeartRate());
            patient.setMedicalHistory(updatedData.getMedicalHistory());
            return ResponseEntity.ok(patientRepository.save(patient));
        }
        return ResponseEntity.status(404).build();
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
