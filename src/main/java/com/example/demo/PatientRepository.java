package com.example.demo;

import com.example.demo.patient.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientRepository extends JpaRepository<Patient, String> {

    // Spring Boot automatically gives you:
    // .findAll() -> Get all patients
    // .findById(id) -> Get one patient
    // .save(patient) -> Create or Update a patient
    // .deleteById(id) -> Delete a patient
    Optional<Patient> findByEmail(String email);

    // Optional: Add a custom search to find patients by name
    default List<Patient> findByNameContainingIgnoreCase(String name) {
        return null;
    }
}
