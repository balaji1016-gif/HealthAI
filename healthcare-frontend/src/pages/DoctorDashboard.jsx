import React, { useEffect, useState } from 'react';
import { LogOut, User, Calendar, Clock, ClipboardList, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState(null);
  const [activeTab, setActiveTab] = useState('appointments'); // Tab control
  
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setDoctor(JSON.parse(userData));
    } else {
      window.location.href = '/login';
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (!doctor) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-10">
      {/* HEADER SECTION - Matching Patient Dashboard */}
      <header className="flex justify-between items-center mb-10 border-b-4 border-blue-600 pb-6">
        <div>
          <h1 className="text-4xl font-black text-blue-900 italic uppercase">Doctor Portal</h1>
          <div className="flex gap-4 mt-2 font-bold">
             <span className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-2">
               <User size={16}/> DR. {doctor.name || "BALAJI D"}
             </span>
             <span className="text-blue-400 self-center uppercase text-sm">Specialist Dashboard</span>
          </div>
        </div>
        <button onClick={handleLogout} className="bg-red-600 text-white px-6 py-2 rounded-lg font-black flex items-center gap-2 shadow-lg hover:bg-red-700">
          <LogOut size={18}/> LOGOUT
        </button>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {/* TABS FOR APPOINTMENT MANAGEMENT */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          <div className="flex border-b border-slate-200 bg-slate-50">
            <button 
              onClick={() => setActiveTab('appointments')}
              className={`flex-1 p-6 font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${activeTab === 'appointments' ? 'bg-white text-blue-600 border-t-4 border-blue-600' : 'text-slate-400'}`}
            >
              <Calendar size={20}/> Appointments
            </button>
            <button 
              onClick={() => setActiveTab('schedule')}
              className={`flex-1 p-6 font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${activeTab === 'schedule' ? 'bg-white text-blue-600 border-t-4 border-blue-600' : 'text-slate-400'}`}
            >
              <Clock size={20}/> Date & Time Slots
            </button>
            <button 
              onClick={() => setActiveTab('patients')}
              className={`flex-1 p-6 font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${activeTab === 'patients' ? 'bg-white text-blue-600 border-t-4 border-blue-600' : 'text-slate-400'}`}
            >
              <ClipboardList size={20}/> Patient Records
            </button>
          </div>

          <div className="p-10 min-h-[500px]">
            {activeTab === 'appointments' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-slate-800 uppercase">Upcoming Consultations</h2>
                {/* Your existing mapping of appointments goes here */}
                <div className="p-6 border-2 border-slate-100 rounded-2xl flex justify-between items-center">
                  <div>
                    <p className="font-black text-blue-900 text-xl uppercase">Sample Patient</p>
                    <p className="text-slate-500 font-bold">Time: 10:30 AM | Date: Today</p>
                  </div>
                  <button className="bg-emerald-500 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2">
                    <CheckCircle size={18}/> Accept
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-slate-800 uppercase">Manage Availability</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                    <p className="font-bold text-slate-400 text-center uppercase">Configure Time Slots for Today</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'patients' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-slate-800 uppercase">Registered Patients</h2>
                <p className="text-slate-400 italic">Patient history and AI assessment reports are synced here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
