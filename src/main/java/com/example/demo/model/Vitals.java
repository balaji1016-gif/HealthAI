package com.example.demo.model;

import jakarta.persistence.*;
        import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Vitals {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String bloodPressure;
    private int heartRate;

    @Column(length = 500)
    private String aiInsight;

    private LocalDateTime timestamp;

    // Link to the Patient
    private String patientId;
}
