import React, { useEffect, useState } from 'react';
import { getPatients } from '../api'; 
import { LogOut, User, Download, Users, FileText, Search } from 'lucide-react';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState(null);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setDoctor(JSON.parse(userData));
      fetchPatients(); // Fetches records on load
    } else {
      window.location.href = '/login';
    }
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await getPatients();
      setPatients(res.data);
    } catch (e) {
      toast.error("Error loading patient records");
    }
  };

  const downloadPDF = (patient) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(0, 51, 153); // Blue Header
    doc.text("PATIENT HEALTH REPORT", 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Patient Name: ${patient.name}`, 20, 40);
    doc.text(`Email: ${patient.email}`, 20, 50);
    doc.text(`Blood Pressure: ${patient.bloodPressure || 'N/A'}`, 20, 60);
    doc.text(`Heart Rate: ${patient.heartRate || 'N/A'}`, 20, 70);
    doc.text("--------------------------------------------------", 20, 80);
    doc.text("Medical History & Analysis:", 20, 90);
    
    // Split text to fit PDF width
    const history = patient.medicalHistory || "No detailed history provided.";
    const splitText = doc.splitTextToSize(history, 170);
    doc.text(splitText, 20, 100);
    
    doc.save(`${patient.name}_Health_Report.pdf`);
    toast.success("PDF Downloaded Successfully");
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (!doctor) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-10">
      {/* HEADER SECTION - FIXED DESIGN */}
      <header className="flex justify-between items-center mb-10 border-b-4 border-blue-600 pb-6">
        <div>
          <h1 className="text-4xl font-black text-blue-900 italic uppercase">Doctor Portal</h1>
          <div className="flex gap-4 mt-2 font-bold uppercase text-xs">
             <span className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-2">
               <User size={14}/> DR. {doctor.name || "BALAJI D"}
             </span>
             <span className="text-blue-400 self-center">{doctor.email}</span>
          </div>
        </div>
        <button onClick={handleLogout} className="bg-red-600 text-white px-6 py-2 rounded-lg font-black flex items-center gap-2 hover:bg-red-700 transition-all shadow-md">
          <LogOut size={18}/> LOGOUT
        </button>
      </header>

      {/* PATIENT RECORDS TABLE SECTION */}
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3 uppercase">
            <Users size={28} className="text-blue-600"/> Registered Patient Records
          </h2>
          <div className="relative w-1/3 font-bold">
            <Search className="absolute left-3 top-3 text-slate-400" size={20}/>
            <input 
              type="text" 
              placeholder="Search patients..." 
              className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-slate-200 outline-blue-600"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-blue-900 text-white uppercase text-sm tracking-widest">
                <th className="p-6">Patient Name</th>
                <th className="p-6">Email Address</th>
                <th className="p-6 text-center">Vitals (BP/HR)</th>
                <th className="p-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map((p, index) => (
                <tr key={index} className="border-b border-slate-50 hover:bg-blue-50 transition-all font-bold">
                  <td className="p-6 text-slate-800">{p.name}</td>
                  <td className="p-6 text-slate-500">{p.email}</td>
                  <td className="p-6 text-center">
                    <span className="text-blue-600">{p.bloodPressure || "N/A"}</span>
                    <span className="text-slate-300 mx-2">|</span>
                    <span className="text-red-500">{p.heartRate || "N/A"} bpm</span>
                  </td>
                  <td className="p-6 text-center">
                    <button 
                      onClick={() => downloadPDF(p)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-black flex items-center gap-2 mx-auto transition-all shadow-sm"
                    >
                      <Download size={16}/> DOWNLOAD PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {patients.length === 0 && (
            <div className="p-20 text-center text-slate-300">
              <FileText size={80} className="mx-auto mb-4 opacity-10"/>
              <p className="font-black uppercase tracking-widest">No patient records found in database</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
