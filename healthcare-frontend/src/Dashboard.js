import React, { useEffect, useState } from 'react';
import { getPatients, getAiAssessment } from './api';
import { Activity, User, BrainCircuit } from 'lucide-react';

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [analysis, setAnalysis] = useState("");

  useEffect(() => {
    getPatients().then(res => setPatients(res.data));
  }, []);

  const handleAiCheck = (id) => {
    setAnalysis("AI is thinking...");
    getAiAssessment(id).then(res => setAnalysis(res.data.assessment));
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Activity className="text-blue-600" /> Clinical Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map(patient => (
          <div key={patient.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-semibold">{patient.name}</h2>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">Age: {patient.age}</span>
            </div>
            <p className="text-gray-600 text-sm">BP: {patient.bloodPressure} | HR: {patient.heartRate} bpm</p>
            <button
              onClick={() => handleAiCheck(patient.id)}
              className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700"
            >
              <BrainCircuit size={18} /> Get AI Insights
            </button>
          </div>
        ))}
      </div>

      {analysis && (
        <div className="mt-8 p-6 bg-indigo-50 border border-indigo-200 rounded-xl">
          <h3 className="font-bold text-indigo-900 mb-2">AI Clinical Summary:</h3>
          <p className="text-indigo-800 italic">{analysis}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;