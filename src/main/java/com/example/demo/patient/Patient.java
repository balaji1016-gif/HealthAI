package com.example.demo.patient;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "patients")
@Data
public class Patient {
    @Id
    private String email; 
    private String name;
    private String password;
    private int age;
    private String bloodPressure;
    private String heartRate;
    
    @Column(columnDefinition = "TEXT")
    private String medicalHistory;

    @Column(columnDefinition = "TEXT")
    private String doubts;

    @Column(columnDefinition = "TEXT")
    private String vitalsHistory = ""; // Initialize as empty string

    private String aiRecommendation; 
    
    // Using Boolean (Object) ensures no primitive "null" crashes
    private Boolean highPriority = false; 
    private String role = "PATIENT";

    // Standard Getters/Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
    public String getBloodPressure() { return bloodPressure; }
    public void setBloodPressure(String bloodPressure) { this.bloodPressure = bloodPressure; }
    public String getHeartRate() { return heartRate; }
    public void setHeartRate(String heartRate) { this.heartRate = heartRate; }
    public String getMedicalHistory() { return medicalHistory; }
    public void setMedicalHistory(String medicalHistory) { this.medicalHistory = medicalHistory; }
    public String getDoubts() { return doubts; }
    public void setDoubts(String doubts) { this.doubts = doubts; }
    public String getVitalsHistory() { return vitalsHistory; }
    public void setVitalsHistory(String vitalsHistory) { this.vitalsHistory = vitalsHistory; }
    public String getAiRecommendation() { return aiRecommendation; }
    public void setAiRecommendation(String aiRecommendation) { this.aiRecommendation = aiRecommendation; }
    public Boolean isHighPriority() { return highPriority; }
    public void setHighPriority(Boolean highPriority) { this.highPriority = highPriority; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
