-- Updated to use snake_case naming convention
INSERT INTO vitals (patient_id, blood_pressure, heart_rate, ai_insight, timestamp) 
VALUES 
('2', '120/80', 72, 'Stable: Parameters are within the optimal clinical range.', '2026-04-01 10:00:00'),
('2', '118/79', 70, 'Stable: Parameters are within the optimal clinical range.', '2026-04-03 10:00:00'),
('3', '145/95', 105, 'Warning: Vital signs are outside normal range. High risk of hypertension.', '2026-04-07 14:00:00');

-- Trying appointment_date instead of requested_at
INSERT INTO appointment (patient_id, patient_name, reason, status, appointment_date) 
VALUES 
('3', 'Priya Sharma', 'Follow up on high BP warning', 'PENDING', '2026-04-07 15:00:00'),
('2', 'Rahul Kumar', 'Routine checkup', 'APPROVED', '2026-04-05 11:00:00');