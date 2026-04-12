import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, UserCircle, UserPlus, Stethoscope } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full text-center">
        {/* ICON & TITLE SECTION */}
        <div className="flex flex-col items-center mb-12">
          <div className="bg-indigo-600 p-4 rounded-3xl shadow-2xl shadow-indigo-200 mb-6 animate-bounce-slow">
            <Activity size={60} className="text-white" />
          </div>
          
          {/* ENHANCED TITLE: Large, Bold, and Gradient */}
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500">
              AI HEALTHCARE
            </span>
            <br />
            <span className="text-slate-800">SERVICES</span>
          </h1>
          
          <p className="text-slate-500 text-lg max-w-lg mx-auto font-medium">
            Next-generation clinical intelligence and patient management powered by Generative AI.
          </p>
        </div>

        {/* NAVIGATION CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* DOCTOR CARD */}
          <button 
            onClick={() => navigate('/login')}
            className="group bg-white p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all border border-slate-100 flex flex-col items-center hover:-translate-y-2"
          >
            <div className="bg-blue-50 p-5 rounded-2xl group-hover:bg-blue-600 transition-colors mb-4">
              <Stethoscope size={32} className="text-blue-600 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Doctor Portal</h3>
            <p className="text-slate-400 text-sm mt-2">Access clinical tools</p>
          </button>

          {/* PATIENT CARD */}
          <button 
            onClick={() => navigate('/login')}
            className="group bg-white p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all border border-slate-100 flex flex-col items-center hover:-translate-y-2"
          >
            <div className="bg-indigo-50 p-5 rounded-2xl group-hover:bg-indigo-600 transition-colors mb-4">
              <UserCircle size={32} className="text-indigo-600 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Patient Portal</h3>
            <p className="text-slate-400 text-sm mt-2">View health vitals</p>
          </button>

          {/* REGISTER CARD */}
          <button 
            onClick={() => navigate('/register')}
            className="group bg-slate-900 p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all flex flex-col items-center hover:-translate-y-2"
          >
            <div className="bg-slate-800 p-5 rounded-2xl group-hover:bg-indigo-500 transition-colors mb-4 border border-slate-700">
              <UserPlus size={32} className="text-slate-300 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Join Us</h3>
            <p className="text-slate-400 text-sm mt-2">Register new account</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
