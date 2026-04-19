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
      const parsedUser = JSON.parse(userData);
      setDoctor(parsedUser);
      // FIX: Passing the email directly from the source to prevent 'undefined' error
      if (parsedUser.email) {
        fetchPatients(parsedUser.email);
      }
    } else {
      window.location.href = '/login';
    }
  }, []);

  const fetchPatients = async (email) => {
    try {
      // Logic to fetch patients assigned to or registered with this doctor
      const res = await getPatients(email);
      setPatients(res.data);
    } catch (e) {
      console.error("404/Fetch Error:", e);
      toast.error("Records Not Found");
    }
  };

  const downloadPDF = (patient) => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.setTextColor(30, 58, 138); // Matching your blue theme
      doc.text("HEALTH ASSESSMENT REPORT", 20, 20);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
      doc.text("--------------------------------------------------", 20, 35);
      
      doc.setFont("helvetica", "bold");
      doc.text("PATIENT INFORMATION", 20, 45);
      doc.setFont("helvetica", "normal");
      doc.text(`Name: ${patient.name}`, 20, 55);
      doc.text(`Email: ${patient.email}`, 20, 65);
      
      doc.setFont("helvetica", "bold");
      doc.text("VITAL SIGNS", 20, 80);
      doc.setFont("helvetica", "normal");
      doc.text(`Blood Pressure: ${patient.bloodPressure || '120/80'}`, 20, 90);
      doc.text(`Heart Rate: ${patient.heartRate || '72'} bpm`, 20, 100);
      
      doc.text("--------------------------------------------------", 20, 110);
      doc.setFont("helvetica", "bold");
      doc.text("MEDICAL HISTORY & NOTES:", 20, 120);
      doc.setFont("helvetica", "normal");
      
      const history = patient.medicalHistory || "No significant medical history recorded.";
      const splitText = doc.splitTextToSize(history, 170);
      doc.text(splitText, 20, 130);
      
      doc.save(`${patient.name}_Report.pdf`);
      toast.success("PDF Downloaded");
    } catch (err) {
      toast.error("PDF Generation Failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (!doctor) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-10 font-sans">
      {/* HEADER - RETAINING ORIGINAL BLUE BORDER & DESIGN */}
      <header className="flex justify-between items-center mb-10 border-b-4 border-blue-600 pb-6">
        <div>
          <h1 className="text-4xl font-black text-blue-900 italic uppercase tracking-tighter">Doctor Dashboard</h1>
          <div className="flex gap-4 mt-2 font-bold uppercase text-xs">
             <span className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-2">
               <User size={14}/> DR. {doctor.name || "BALAJI D"}
             </span>
             <span className="text-blue-400 self-center tracking-widest">{doctor.email}</span>
          </div>
        </div>
        <button onClick={handleLogout} className="bg-red-600 text-white px-8 py-2 rounded-xl font-black flex items-center gap-2 hover:bg-red-700 transition-all shadow-lg">
          <LogOut size={18}/> LOGOUT
        </button>
      </header>

      {/* PATIENT RECORDS TABLE */}
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3 uppercase">
            <Users size={30} className="text-blue-600"/> Registered Patient Records
          </h2>
          <div className="relative w-1/3">
            <Search className="absolute left-4 top-3 text-slate-400" size={18}/>
            <input 
              type="text" 
              placeholder="Search by name..." 
              className="w-full pl-12 pr-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-blue-600 outline-none font-bold transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-blue-900 text-white uppercase text-xs tracking-[0.2em]">
                <th className="p-6">Patient Name</th>
                <th className="p-6">Contact Email</th>
                <th className="p-6 text-center">Health Metrics</th>
                <th className="p-6 text-center">Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map((p, index) => (
                <tr key={index} className="hover:bg-blue-50/50 transition-colors group">
                  <td className="p-6">
                    <p className="font-black text-slate-800 text-lg uppercase">{p.name}</p>
                  </td>
                  <td className="p-6 font-bold text-slate-500">{p.email}</td>
                  <td className="p-6 text-center">
                    <div className="flex justify-center gap-3 font-black text-sm">
                      <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded">BP: {p.bloodPressure || "120/80"}</span>
                      <span className="text-red-500 bg-red-50 px-2 py-1 rounded">HR: {p.heartRate || "72"}</span>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <button 
                      onClick={() => downloadPDF(p)}
                      className="bg-emerald-600 text-white px-5 py-2 rounded-xl font-black text-xs flex items-center gap-2 mx-auto hover:bg-emerald-700 shadow-md group-hover:scale-105 transition-all"
                    >
                      <Download size={14}/> DOWNLOAD PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {patients.length === 0 && (
            <div className="p-32 text-center text-slate-300">
              <FileText size={100} className="mx-auto mb-6 opacity-10"/>
              <p className="font-black uppercase tracking-[0.3em] text-sm">Database Empty</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
