package com.example.demo.controller;

import com.example.demo.patient.Patient;
import com.example.demo.PatientRepository;
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

    /**
     * Handles User Registration
     * Fixes the 404 (Not Found) error for /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Patient newPatient) {
        try {
            // Check if a patient with this email already exists
            Optional<Patient> existingPatient = patientRepository.findByEmail(newPatient.getEmail());
            if (existingPatient.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is already registered.");
            }

            // Save the new user to the database
            Patient savedPatient = patientRepository.save(newPatient);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedPatient);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Registration failed: " + e.getMessage());
        }
    }

    /**
     * Handles User Login
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Patient loginRequest) {
        Optional<Patient> patient = patientRepository.findByEmail(loginRequest.getEmail());

        if (patient.isPresent() && patient.get().getPassword().equals(loginRequest.getPassword())) {
            // Returns the full patient object for React state management
            return ResponseEntity.ok(patient.get());
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password.");
    }

    /**
     * Hydrates User Data (Fixes the 404 on Dashboard reload)
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestParam String email) {
        return patientRepository.findByEmail(email)
                .map(patient -> ResponseEntity.ok(patient))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    /**
     * AI Diagnostic Endpoint (Mock Analysis)
     */
    @PostMapping("/diagnose")
    public ResponseEntity<?> runDiagnostic(@RequestBody String patientData) {
        try {
            String aiResponse = "AI Analysis: Vitals within normal range. " +
                                "Heart rate indicates good cardiovascular health. " +
                                "Continue regular monitoring.";
            
            return ResponseEntity.ok().body("{\"summary\": \"" + aiResponse + "\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("AI Service currently unavailable.");
        }
    }
}
