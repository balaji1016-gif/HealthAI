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

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Patient newPatient) {
        try {
            // Log incoming data to Render console for debugging
            System.out.println("Registering patient: " + newPatient.getEmail());

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
            e.printStackTrace(); // This prints the error to Render logs
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Database Error: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Patient loginRequest) {
        return patientRepository.findByEmail(loginRequest.getEmail())
                .filter(p -> p.getPassword().equals(loginRequest.getPassword()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials."));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestParam String email) {
        return patientRepository.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}
