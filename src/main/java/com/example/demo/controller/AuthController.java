package com.example.demo.auth;

import com.example.demo.patient.Patient;
import com.example.demo.patient.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Allows your React app on Vercel to connect
public class AuthController {

    @Autowired
    private PatientRepository patientRepository;

    // 1. LOGIN ENDPOINT
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Patient loginRequest) {
        Optional<Patient> patient = patientRepository.findByEmail(loginRequest.getEmail());

        if (patient.isPresent() && patient.get().getPassword().equals(loginRequest.getPassword())) {
            // In a real project, you'd return a JWT token here.
            // For your MVP, we return the patient object containing the role and fullName.
            return ResponseEntity.ok(patient.get());
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
    }

    // 2. PROFILE ENDPOINT (The fix for the 404 error)
    // React calls this via API.get('/auth/me')
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestParam(required = false) String email) {
        // NOTE: In production, you would get the email from the JWT Token.
        // For your Final Year Project demo, we can pass email as a param or 
        // use a simplified session check.
        
        if (email == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User email is required");
        }

        Optional<Patient> patient = patientRepository.findByEmail(email);
        
        if (patient.isPresent()) {
            return ResponseEntity.ok(patient.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }
}
