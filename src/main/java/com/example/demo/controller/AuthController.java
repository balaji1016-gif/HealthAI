package com.example.demo.controller;

import com.example.demo.patient.Patient;
import com.example.demo.PatientRepository;
import com.example.demo.AiHealthService.AiHealthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(originPatterns = "*", allowCredentials = "true", allowedHeaders = "*")
public class AuthController {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AiHealthService aiHealthService;

    @PutMapping("/update-vitals")
    public ResponseEntity<?> updateVitals(@RequestBody Patient updatedData) {
        try {
            if (updatedData.getEmail() == null) return ResponseEntity.badRequest().body("Email missing");
            
            String searchEmail = updatedData.getEmail().toLowerCase().trim();
            Optional<Patient> existing = patientRepository.findByEmail(searchEmail);

            if (existing.isPresent()) {
                Patient p = existing.get();
                p.setBloodPressure(updatedData.getBloodPressure());
                p.setHeartRate(updatedData.getHeartRate());
                p.setMedicalHistory(updatedData.getMedicalHistory());
                return ResponseEntity.ok(patientRepository.save(p));
            }
            return ResponseEntity.status(404).body("Patient not found");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/diagnose")
    public ResponseEntity<?> runDiagnostic(@RequestBody Patient patientData) {
        try {
            // Uses current data from request body to ensure AI sees new values immediately
            String insight = aiHealthService.generateClinicalInsight(patientData);
            String formattedInsight = insight.replace("\n", "<br/>");
            return ResponseEntity.ok().body("{\"summary\": \"" + formattedInsight + "\"}");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"summary\": \"AI Error: " + e.getMessage() + "\"}");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Patient loginRequest) {
        Optional<Patient> p = patientRepository.findByEmail(loginRequest.getEmail().toLowerCase().trim());
        if (p.isPresent() && p.get().getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.ok(p.get());
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Patient newPatient) {
        newPatient.setEmail(newPatient.getEmail().toLowerCase().trim());
        return ResponseEntity.ok(patientRepository.save(newPatient));
    }
}
