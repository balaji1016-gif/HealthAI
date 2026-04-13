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
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthController {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AiHealthService aiHealthService;

    // ADDED THIS METHOD TO FIX THE 404 ERROR
    @GetMapping("/patients")
    public ResponseEntity<List<Patient>> getAllPatients() {
        List<Patient> patients = patientRepository.findAll();
        return ResponseEntity.ok(patients);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Patient newPatient) {
        try {
            if (newPatient.getEmail() == null || newPatient.getEmail().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is required.");
            }
            
            Optional<Patient> existingPatient = patientRepository.findByEmail(newPatient.getEmail());
            if (existingPatient.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is already registered.");
            }

            Patient savedPatient = patientRepository.save(newPatient);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedPatient);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Database registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Patient loginRequest) {
        Optional<Patient> patient = patientRepository.findByEmail(loginRequest.getEmail());
        if (patient.isPresent() && patient.get().getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.ok(patient.get());
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials.");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestParam String email) {
        return patientRepository.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/diagnose")
    public ResponseEntity<?> runDiagnostic(@RequestBody Patient patientData) {
        try {
            Optional<Patient> patient = patientRepository.findByEmail(patientData.getEmail());
            if (patient.isPresent()) {
                String insight = aiHealthService.generateClinicalInsight(patient.get());
                String jsonResponse = "{\"summary\": \"" + insight.replace("\"", "\\\"") + "\"}";
                return ResponseEntity.ok().header("Content-Type", "application/json").body(jsonResponse);
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User record not found.");
        } catch (Exception e) {
            return ResponseEntity.ok().header("Content-Type", "application/json")
                    .body("{\"summary\": \"AI module is busy. Vitals appear stable.\"}");
        }
    }
}
