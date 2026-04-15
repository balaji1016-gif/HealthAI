// ... (imports remain the same)

const handleUpdateVitals = async () => {
    try {
        // Correcting the object keys to match your backend Patient.java
        const res = await updateVitals({ 
            email: patient.email, 
            bloodPressure: vitalsForm.bp, 
            heartRate: vitalsForm.hr,
            medicalHistory: vitalsForm.doubt // mapping doubt to history for storage
        });
        
        if (res.status === 200) {
            toast.success("Health updates saved!");
            
            // THE FIX: Update local state so Summary Tab changes immediately
            const updatedPatient = { 
                ...patient, 
                bloodPressure: vitalsForm.bp, 
                heartRate: vitalsForm.hr 
            };
            setPatient(updatedPatient);
            localStorage.setItem('user', JSON.stringify(updatedPatient));
            setActiveTab('summary'); // Switch back to see result
        }
    } catch (e) {
        toast.error("Failed to update vitals");
    }
};

// ... (rest of the file remains the same)
