import React, { useEffect, useState } from 'react';
import { getPatients } from '../api'; 
import { LogOut, User, Download, Users, Search } from 'lucide-react';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) fetchPatients();
    else window.location.href = '/login';
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await getPatients();
      setPatients(Array.isArray(res.data) ? res.data : []);
    } catch (e) { toast.error("Fetch Error"); }
  };

  const downloadPDF = (patient) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(30, 58, 138);
    doc.text("HEALTH ASSESSMENT REPORT", 20, 20);
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Patient: ${patient.name || "N/A"}`, 20, 40);
    doc.text(`Vitals: BP ${patient.bloodPressure || 'N/A'} | HR ${patient.heartRate || 'N/A'} bpm`, 20, 50);
    doc.text("-----------------------------------------------------------------------------------------", 20, 60);

    const reportContent = patient.medicalHistory || "No generated report available.";
    const cleanReport = reportContent.replace(/<br\s*\/?>/gi, '\n').replace(/<b>/gi, '').replace(/<\/b>/gi, '');
    const splitReport = doc.splitTextToSize(cleanReport, 170);
    doc.text(splitReport, 20, 70);

    doc.save(`${patient.name}_Report.pdf`);
    toast.success("PDF Downloaded");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-10 font-sans">
      <header className="flex justify-between items-center mb-10 border-b-4 border-blue-600 pb-6">
        <h1 className="text-4xl font-black text-blue-900 italic uppercase">Doctor Dashboard</h1>
        <button onClick={() => { localStorage.removeItem('user'); window.location.href='/login'; }} className="bg-red-600 text-white px-8 py-2 rounded-xl font-black">LOGOUT</button>
      </header>

      <div className="bg-white rounded-3xl shadow-2xl border overflow-hidden">
        <div className="p-8 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-2xl font-black text-slate-800 uppercase">Registered Patients</h2>
          <input type="text" placeholder="Search..." className="w-1/3 p-3 rounded-2xl border-2 font-bold focus:border-blue-600" onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <table className="w-full text-left">
          <thead className="bg-blue-900 text-white uppercase text-xs">
            <tr>
              <th className="p-6">Patient Name</th>
              <th className="p-6 text-center">Vitals</th>
              <th className="p-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {patients.filter(p => (p.name || "").toLowerCase().includes(searchTerm.toLowerCase())).map((p, index) => (
              <tr key={index} className="hover:bg-blue-50 border-b">
                <td className="p-6 font-bold uppercase">{p.name || "Unnamed"}</td>
                <td className="p-6 text-center text-xs font-bold">
                  <div className="text-blue-600">BP: {p.bloodPressure || "N/A"}</div>
                  <div className="text-red-500">HR: {p.heartRate || "N/A"} bpm</div>
                </td>
                <td className="p-6 text-center">
                  <button onClick={() => downloadPDF(p)} className="bg-emerald-600 text-white px-5 py-2 rounded-xl font-black text-xs flex items-center gap-2 mx-auto">
                    <Download size={14}/> DOWNLOAD FULL REPORT
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
