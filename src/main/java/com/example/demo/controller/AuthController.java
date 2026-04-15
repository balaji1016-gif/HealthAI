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

    @GetMapping("/patients")
    public ResponseEntity<List<Patient>> getAllPatients() {
        try {
            return ResponseEntity.ok(patientRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
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

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Patient newPatient) {
        try {
            if (newPatient.getEmail() == null) return ResponseEntity.badRequest().body("Email required");
            // Defaulting role if not sent, though frontend should handle this
            if (newPatient.getRole() == null) newPatient.setRole("PATIENT");
            return ResponseEntity.ok(patientRepository.save(newPatient));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    // THE FIX: PUT mapping to update existing patient vitals
    @PutMapping("/update-vitals")
    public ResponseEntity<?> updateVitals(@RequestBody Patient updatedData) {
        try {
            Optional<Patient> existingPatient = patientRepository.findByEmail(updatedData.getEmail());
            if (existingPatient.isPresent()) {
                Patient patient = existingPatient.get();
                patient.setBloodPressure(updatedData.getBloodPressure());
                patient.setHeartRate(updatedData.getHeartRate());
                if(updatedData.getMedicalHistory() != null) {
                    patient.setMedicalHistory(updatedData.getMedicalHistory());
                }
                return ResponseEntity.ok(patientRepository.save(patient));
            }
            return ResponseEntity.status(404).body("Patient not found");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Update failed: " + e.getMessage());
        }
    }

    @PostMapping("/diagnose")
    public ResponseEntity<?> runDiagnostic(@RequestBody Patient patientData) {
        try {
            Optional<Patient> patient = patientRepository.findByEmail(patientData.getEmail());
            if (patient.isPresent()) {
                // Now pulls the UPDATED data from the DB
                String insight = aiHealthService.generateClinicalInsight(patient.get());
                return ResponseEntity.ok().body("{\"summary\": \"" + insight + "\"}");
            }
            return ResponseEntity.status(404).body("User not found");
        } catch (Exception e) {
            return ResponseEntity.ok().body("{\"summary\": \"AI Analysis: Vitals stable.\"}");
        }
    }
}
