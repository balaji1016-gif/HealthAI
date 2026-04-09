package com.example.demo.controller;

import com.example.demo.model.Appointment;
import com.example.demo.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "https://healthai-nx8q.onrender.com")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @PostMapping("/request")
    public ResponseEntity<?> requestAppointment(@RequestBody Appointment appointment) {
        appointment.setRequestedAt(LocalDateTime.now());
        appointment.setStatus("PENDING");
        return ResponseEntity.ok(appointmentRepository.save(appointment));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentRepository.findAll());
    }

    @PostMapping("/approve/{id}")
    public ResponseEntity<?> approveAppointment(@PathVariable Long id) {
        return appointmentRepository.findById(id)
                .map(app -> {
                    app.setStatus("APPROVED");
                    return ResponseEntity.ok(appointmentRepository.save(app));
                }).orElse(ResponseEntity.notFound().build());
    }
}
