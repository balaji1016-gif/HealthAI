package com.example.demo.repository;

import com.example.demo.model.Vitals;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VitalsRepository extends JpaRepository<Vitals, Long> {
    // This allows the Doctor to see the history for one specific patient
    List<Vitals> findByPatientIdOrderByTimestampDesc(String patientId);
}