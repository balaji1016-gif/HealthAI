import React, { useEffect, useState, useRef } from 'react';
import { getPatients, getAiAssessment, updateVitals, bookAppointment } from '../api';
import { Activity, BrainCircuit, Heart, Thermometer, RefreshCw, Calendar, Save, MessageSquare } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const PatientDashboard = () => {
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('summary'); 
  const [analysis, setAnalysis] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [vitalsForm, setVitalsForm] = useState({ bp: '', hr: '', doubt: '' });

  useEffect(() => {
    const loadInitialData = async () => {
      const storedData = localStorage.getItem('user');
      if (!storedData) {
        toast.error("Session expired. Please login again.");
        window.location.href = '/login';
        return;
      }

      const user = JSON.parse(storedData);
      setPatient(user);
      setVitalsForm({ 
        bp: user.bloodPressure || '', 
        hr: user.heartRate || '', 
        doubt: user.medicalHistory || '' 
      });

      try {
        // Fetch fresh data from backend to ensure we have the latest vitals
        const res = await getPatients(user.email);
        if (res.data) {
          setPatient(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        }
      } catch (err) {
        console.log("Using cached profile data...");
      }

      setTimeout(() => setIsReady(true), 500);
    };

    loadInitialData();
  }, []);

  const handleUpdateVitals = async () => {
    try {
      // THE FIX: Mapping frontend 'bp' and 'hr' to backend 'bloodPressure' and 'heartRate'
      const res = await updateVitals({ 
        email: patient.email, 
        bloodPressure: vitalsForm.bp, 
        heartRate: vitalsForm.hr,
        medicalHistory: vitalsForm.doubt 
      });

      if (res.status === 200 || res.status === 201) {
        toast.success("Health updates saved to Database!");
        
        // Update local state so UI reflects changes immediately
        const updatedUser = { 
            ...patient, 
            bloodPressure: vitalsForm.bp, 
            heartRate: vitalsForm.hr,
            medicalHistory: vitalsForm.doubt
        };
        setPatient(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setActiveTab('summary');
      }
    } catch (e) {
      toast.error("Failed to update vitals. Check if backend is running.");
    }
  };

  const handleRequestAppointment = async () => {
    try {
      await bookAppointment({ 
        email: patient.email, 
        name: patient.name, 
        reason: vitalsForm.doubt || "Routine Checkup" 
      });
      toast.success("Appointment request sent to doctor!");
    } catch (e) {
      toast.error("Could not send request");
    }
  };

  const handleAiCheck = async () => {
    setLoadingAi(true);
    setAnalysis(""); 
    try {
      const res = await getAiAssessment(patient.email);
      if (res.data && res.data.summary) {
        setAnalysis(res.data.summary);
        toast.success("AI Analysis Complete");
      }
    } catch (err) {
      setAnalysis("The AI Engine is processing your latest vitals. Please try again in a moment.");
    } finally {
      setLoadingAi(false);
    }
  };

  const trendData = [
    { name: '08:00', hr: 70 },
    { name: '10:00', hr: 75 },
    { name: '12:00', hr: 82 },
    { name: '14:00', hr: 74 },
    { name: '16:00', hr: 78 }
  ];

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <RefreshCw className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div className="flex items-center gap-3">
            <Activity className="text-indigo-600" size={32} />
            <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Patient Portal</h1>
          </div>
          <button 
            onClick={handleRequestAppointment}
            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
          >
            <Calendar size={20} /> REQUEST APPOINTMENT
          </button>
        </header>

        <div className="flex gap-2 mb-8 bg-slate-200/50 p-1.5 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab('summary')} 
            className={`px-8 py-3 rounded-xl font-black text-sm uppercase transition-all ${activeTab === 'summary' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Vitals Summary
          </button>
          <button 
            onClick={() => setActiveTab('update')} 
            className={`px-8 py-3 rounded-xl font-black text-sm uppercase transition-all ${activeTab === 'update' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Update Details
          </button>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden mb-8">
          {activeTab === 'summary' ? (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100">
                  <span className="text-[10px] font-black text-blue-500 uppercase flex items-center gap-1 mb-1">
                    <Thermometer size={14} /> Blood Pressure
                  </span>
                  <p className="text-3xl font-mono font-black text-slate-800">{patient.bloodPressure || 'N/A'}</p>
                </div>
                <div className="bg-red-50/50 p-8 rounded
