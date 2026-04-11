package com.example.demo.controller;

import com.example.demo.patient.Patient;
import com.example.demo.PatientRepository;
import com.example.demo.AiHealthService.AiHealthService;
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
    private AiHealthService aiHealthService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Patient newPatient) {
        try {
            if (newPatient.getEmail() == null || newPatient.getEmail().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is required.");
            }
            if (patientRepository.findByEmail(newPatient.getEmail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is already registered.");
            }
            Patient savedPatient = patientRepository.save(newPatient);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedPatient);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Database Error: " + e.getMessage());
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
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping("/diagnose")
    public ResponseEntity<?> runDiagnostic(@RequestBody Patient patientData) {
        try {
            Optional<Patient> patient = patientRepository.findByEmail(patientData.getEmail());
            if (patient.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User record not found.");
            }
            
            // This calls your Gemini logic
            String insight = aiHealthService.generateClinicalInsight(patient.get());
            return ResponseEntity.ok().body("{\"summary\": \"" + insight + "\"}");
        } catch (Exception e) {
            // If AI fails, we return a 200 with a fallback message instead of a 500 error
            return ResponseEntity.ok().body("{\"summary\": \"AI analysis is currently refreshing. Please check back in a moment.\"}");
        }
    }
}
