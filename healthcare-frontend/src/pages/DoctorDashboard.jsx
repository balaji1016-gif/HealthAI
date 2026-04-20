import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LogOut, User, Download, Users, AlertTriangle, Clock } from 'lucide-react';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get('https://health-ai-backend-q09o.onrender.com/api/auth/patients');
      setPatients(res.data);
    } catch (e) { toast.error("Error fetching patient data"); }
  };

  const downloadPDF = (p) => {
    const doc = new jsPDF();
    doc.setFillColor(30, 58, 138); doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255); doc.setFontSize(22); doc.text("PATIENT CLINICAL RECORD", 20, 25);
    
    doc.setTextColor(0, 0, 0); doc.setFontSize(12);
    doc.text(`Patient Name: ${p.name}`, 20, 50);
    doc.text(`Vitals: BP ${p.bloodPressure || 'N/A'} | HR ${p.heartRate || 'N/A'} BPM`, 20, 60);
    doc.text(`Stated Doubts: ${p.doubts || 'None'}`, 20, 70);
    
    doc.setFont("helvetica", "bold");
    doc.text(`AI Recommendation: ${p.aiRecommendation || 'Awaiting'}`, 20, 85);
    
    doc.setFont("helvetica", "normal");
    const content = (p.medicalHistory || "").replace(/<br\s*\/?>/gi, '\n').replace(/<b>|<\/b>/gi, '');
    const splitText = doc.splitTextToSize(content, 170);
    doc.text(splitText, 20, 100);
    
    doc.save(`${p.name}_Medical_Report.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <header className="flex justify-between items-center mb-10 border-b-4 border-blue-600 pb-6 uppercase font-black italic">
        <h1 className="text-4xl text-blue-900">Doctor Portal</h1>
        <button onClick={() => window.location.href='/login'} className="bg-red-600 text-white px-8 py-2 rounded-xl">LOGOUT</button>
      </header>

      <div className="bg-white rounded-3xl shadow-2xl border-2 border-blue-50 overflow-hidden">
        <div className="p-8 flex justify-between items-center bg-blue-50/30">
          <h2 className="text-2xl font-black text-blue-900 flex items-center gap-2 uppercase"><Users/> Patient Roster</h2>
          <input type="text" placeholder="Search Patient Name..." className="p-3 border-2 rounded-xl w-1/3 font-bold" onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <table className="w-full">
          <thead className="bg-blue-900 text-white uppercase text-sm">
            <tr>
              <th className="p-6">Patient</th>
              <th className="p-6">Latest Vitals</th>
              <th className="p-6">Symptoms/Doubts</th>
              <th className="p-6">Report Action</th>
            </tr>
          </thead>
          <tbody>
            {patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map((p, i) => (
              <tr key={i} className={`border-b hover:bg-blue-50 transition-colors ${p.highPriority ? 'bg-red-50/50' : ''}`}>
                <td className="p-6 font-black uppercase text-slate-800">
                  {p.name}
                  {p.highPriority && <span className="ml-2 bg-red-600 text-white text-[10px] px-2 py-1 rounded-full animate-pulse flex items-center w-fit gap-1 mt-1"><AlertTriangle size={10}/> URGENT ATTENTION</span>}
                </td>
                <td className="p-6 font-bold text-center">
                  <div className="text-blue-600">BP: {p.bloodPressure}</div>
                  <div className="text-red-500">HR: {p.heartRate} BPM</div>
                </td>
                <td className="p-6 italic font-medium text-slate-600 text-sm max-w-xs">{p.doubts || "No specific doubts logged"}</td>
                <td className="p-6 text-center">
                  <button onClick={() => downloadPDF(p)} className="bg-emerald-600 text-white px-5 py-2 rounded-xl font-black flex items-center gap-2 hover:bg-emerald-700 shadow-lg mx-auto">
                    <Download size={16}/> DOWNLOAD PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorDashboard;
