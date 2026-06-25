package com.example.demo.repository;

import com.example.demo.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    /**
     * Finds all appointments associated with a specific patient.
     * This allows the Patient Dashboard to show the status of their own requests.
     */
    List<Appointment> findByPatientId(String patientId);

    /**
     * Finds all appointments with a specific status (e.g., PENDING).
     * Useful for the Doctor Dashboard to filter new requests.
     */
    List<Appointment> findByStatus(String status);
}