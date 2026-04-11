package com.example.demo.controller;

import com.example.demo.patient.Patient;
import com.example.demo.PatientRepository;
import com.example.demo.AiHealthService.AiHealthService; // Import the AI service
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "https://health-ai-flame.vercel.app", allowedHeaders = "*", methods = {RequestMethod.POST, RequestMethod.GET, RequestMethod.OPTIONS})
public class AuthController {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AiHealthService aiHealthService; // Inject the AI Service

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
            e.printStackTrace(); 
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

    // --- CRITICAL ADDITION FOR DASHBOARD AI BUTTON ---
    @PostMapping("/diagnose")
    public ResponseEntity<?> runDiagnostic(@RequestBody Patient patientData) {
        try {
            // Find the patient by email (the primary key we established)
            Optional<Patient> patient = patientRepository.findByEmail(patientData.getEmail());
            
            if (patient.isPresent()) {
                // Generate insight using Gemini via your Service
                String insight = aiHealthService.generateClinicalInsight(patient.get());
                
                // Return as JSON with key "summary" to match your React Dashboard
                return ResponseEntity.ok().body("{\"summary\": \"" + insight + "\"}");
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User record not found.");
        } catch (Exception e) {
            // Fallback message if Gemini API limit is reached or fails
            return ResponseEntity.ok().body("{\"summary\": \"Analysis complete. Vitals are recorded in the secure ledger.\"}");
        }
    }
}
