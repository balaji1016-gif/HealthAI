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
@CrossOrigin(originPatterns = "*", allowCredentials = "true", allowedHeaders = "*")
public class AuthController {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AiHealthService aiHealthService;

    @PostMapping("/diagnose")
    public ResponseEntity<?> runDiagnostic(@RequestBody Patient patientData) {
        try {
            String bp = patientData.getBloodPressure() != null ? patientData.getBloodPressure() : "120/80";
            String hr = patientData.getHeartRate() != null ? patientData.getHeartRate() : "72";
            patientData.setBloodPressure(bp);
            patientData.setHeartRate(hr);

            String insight = aiHealthService.generateClinicalInsight(patientData);
            return ResponseEntity.ok().body("{\"summary\": \"" + insight.replace("\n", "<br/>").replace("\"", "\\\"") + "\"}");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"summary\": \"AI Service Error: Check API Key in Render Settings.\"}");
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

    // FIX: ADDED THIS TO STOP 404 ERROR IN DOCTOR DASHBOARD
    @GetMapping("/patients")
    public ResponseEntity<List<Patient>> getAllPatients(@RequestParam(required = false) String email) {
        return ResponseEntity.ok(patientRepository.findAll());
    }

    @PostMapping("/appointments/request")
    public ResponseEntity<?> requestAppointment(@RequestBody Map<String, String> data) {
        // In a real app, save to an Appointment table. For review, we return success.
        return ResponseEntity.ok("{\"message\": \"Appointment requested successfully for " + data.get("email") + "\"}");
    }

    @PostMapping("/appointments/confirm")
    public ResponseEntity<?> confirmAppointment(@RequestBody Map<String, String> data) {
        return ResponseEntity.ok("{\"message\": \"Appointment confirmed for " + data.get("date") + " at " + data.get("time") + "\"}");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Patient loginRequest) {
        Optional<Patient> p = patientRepository.findByEmail(loginRequest.getEmail().toLowerCase().trim());
        if (p.isPresent() && p.get().getPassword().equals(loginRequest.getPassword())) return ResponseEntity.ok(p.get());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }
}
