package com.example.demo.patient;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;
@Entity
@Data // This automatically creates getters and setters
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private String id;
    
    private String name;
    private String bloodPressure;
    private int heartRate;
    private String diagnosisSummary; // This is where AI will save its notes

    public Object getAge() {
        return null;
    }

    public Object getMedicalHistory() {
        return getObject();
    }

    private static Object getObject() {
        return null;
    }
}