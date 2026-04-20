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
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AiHealthService aiHealthService;

    @PostMapping("/diagnose")
    public ResponseEntity<?> runDiagnostic(@RequestBody Patient patientData) {
        try {
            String insight = aiHealthService.generateClinicalInsight(patientData);
            String escapedInsight = insight.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "<br/>");
            return ResponseEntity.ok().body("{\"summary\": \"" + escapedInsight + "\"}");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"summary\": \"Error processing report.\"}");
        }
    }

    @PutMapping("/update-vitals")
    public ResponseEntity<?> updateVitals(@RequestBody Patient updatedData) {
        Optional<Patient> p = patientRepository.findByEmail(updatedData.getEmail().toLowerCase().trim());
        if (p.isPresent()) {
            Patient patient = p.get();
            patient.setBloodPressure(updatedData.getBloodPressure());
            patient.setHeartRate(updatedData.getHeartRate());
            patient.setMedicalHistory(updatedData.getMedicalHistory());
            return ResponseEntity.ok(patientRepository.save(patient));
        }
        return ResponseEntity.status(404).body("User not found");
    }

    @GetMapping("/patients")
    public ResponseEntity<List<Patient>> getAllPatients() {
        return ResponseEntity.ok(patientRepository.findAll());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Patient loginRequest) {
        Optional<Patient> p = patientRepository.findByEmail(loginRequest.getEmail().toLowerCase().trim());
        if (p.isPresent() && p.get().getPassword().equals(loginRequest.getPassword())) return ResponseEntity.ok(p.get());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }
}
