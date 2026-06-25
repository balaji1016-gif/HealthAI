import React, { useState, useEffect } from 'react';
import { getPatients, getAiAnalysis } from '../services/api';

const Dashboard = () => {
    const [patients, setPatients] = useState([]); // State for the list
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // This runs automatically when the page loads
        getPatients().then(data => {
            setPatients(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div>Loading Hospital Data...</div>;

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold mb-6">Physician Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {patients.map(patient => (
                    <div key={patient.id} className="border p-4 rounded-lg shadow">
                        <h2 className="text-xl font-bold">{patient.name}</h2>
                        <p>Vitals: {patient.bloodPressure} BP | {patient.heartRate} HR</p>
                        <button 
                            className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
                            onClick={() => alert("AI Feature Coming in Phase 3!")}
                        >
                            Analyze with AI
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
const handleAnalyze = async (id) => {
                             setLoading(true);
                             try {
                                 const response = await axios.get(`http://localhost:8080/api/patients/${id}/analyze`);
                                 setAiResult(response.data.insight);
                             } catch (error) {
                                 console.error("AI Analysis failed", error);
                             }
                             setLoading(false);
                         };