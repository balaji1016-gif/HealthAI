package com.example.demo;

import com.example.demo.patient.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// THIS IS THE MISSING LINE:
import java.util.Optional; 

@Repository
public interface PatientRepository extends JpaRepository<Patient, String> {
    
    // Now the compiler will recognize "Optional" here
    Optional<Patient> findByEmail(String email);
}
