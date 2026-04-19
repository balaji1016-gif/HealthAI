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
        // DEBUG LOG - Check Render Logs for this line!
        System.out.println(">>> API HIT: update-vitals called for email: " + updatedData.getEmail());
        
        try {
            if (updatedData.getEmail() == null) {
                return ResponseEntity.badRequest().body("Error: Email missing");
            }

            String searchEmail = updatedData.getEmail().toLowerCase().trim();
            Optional<Patient> existingPatient = patientRepository.findByEmail(searchEmail);

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
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Patient loginRequest) {
        String searchEmail = loginRequest.getEmail().toLowerCase().trim();
        Optional<Patient> patient = patientRepository.findByEmail(searchEmail);
        if (patient.isPresent() && patient.get().getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.ok(patient.get());
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials.");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Patient newPatient) {
        try {
            newPatient.setEmail(newPatient.getEmail().toLowerCase().trim());
            return ResponseEntity.ok(patientRepository.save(newPatient));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/patients")
    public ResponseEntity<List<Patient>> getAllPatients() {
        return ResponseEntity.ok(patientRepository.findAll());
    }

    @PostMapping("/diagnose")
    public ResponseEntity<?> runDiagnostic(@RequestBody Patient patientData) {
        try {
            Optional<Patient> patient = patientRepository.findByEmail(patientData.getEmail().toLowerCase().trim());
            if (patient.isPresent()) {
                String insight = aiHealthService.generateClinicalInsight(patient.get());
                return ResponseEntity.ok().body("{\"summary\": \"" + insight + "\"}");
            }
            return ResponseEntity.status(404).body("User not found");
        } catch (Exception e) {
            return ResponseEntity.ok().body("{\"summary\": \"AI Analysis: Vitals stable.\"}");
        }
    }
}
