package com.example.demo.patient;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "patients") // Good practice to name the table
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private int age;

    private String bloodPressure;

    private int heartRate;

    @Column(columnDefinition = "TEXT")
    private String medicalHistory;

    @Column(columnDefinition = "TEXT")
    private String diagnosisSummary; // AI-generated notes storage

    private String role = "PATIENT"; // Default role for security filters
}
