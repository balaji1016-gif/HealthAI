package com.example.demo.patientservice;
import com.example.demo.controller.PatientController;
import com.example.demo.PatientRepository;
import com.example.demo.patient.Patient;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class PatientService {
    @Autowired
    private PatientRepository repository;

    public List<Patient> getAllPatients() {
        return repository.findAll();
    }

    public Patient createPatient(Patient patient) {
        return repository.save(patient);
    }
}
