package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String patientId;
    private String patientName;
    private String doctorId;
    private String reason; // e.g., "Follow up on high BP"
    private String status; // PENDING, APPROVED, COMPLETED
    private LocalDateTime appointmentDate;

    public void setRequestedAt(LocalDateTime now) {
    }
}