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
@CrossOrigin(origins = "https://health-ai-flame.vercel.app", allowedHeaders = "*", methods = {RequestMethod.POST, RequestMethod.GET, RequestMethod.OPTIONS"}) 
public class AuthController {

    @Autowired
    private PatientRepository patientRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Patient loginRequest) {
        Optional<Patient> patient = patientRepository.findByEmail(loginRequest.getEmail());

        if (patient.isPresent() && patient.get().getPassword().equals(loginRequest.getPassword())) {
            // Return the full patient object so React can store the email/role
            return ResponseEntity.ok(patient.get());
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    // FIXES THE 404 ERROR
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestParam String email) {
        return patientRepository.findByEmail(email)
                .map(patient -> ResponseEntity.ok(patient))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}
