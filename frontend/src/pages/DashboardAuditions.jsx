import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import apiClient from '../api/axios';
import { Sparkles, Calendar, MapPin, CheckCircle, Clock, Award } from 'lucide-react';

const DashboardAuditions = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/user/auditions')
      .then(res => {
        if (res.data.success) setApplications(res.data.applications);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const timelineSteps = ['Submitted', 'Under Review', 'Shortlisted', 'Audition Scheduled', 'Selected'];

  const getStepIndex = (status) => {
    if (status === 'Rejected') return -1;
    return timelineSteps.indexOf(status);
  };

  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans">
      <Navbar />

      <div className="pt-32 pb-24 px-4 max-w-5xl mx-auto">
        
        <div className="mb-8 border-b border-white/10 pb-6">
          <span className="text-xs font-bold text-[#D6A84F] uppercase tracking-widest block mb-1">
            MY ACCOUNT
          </span>
          <h1 className="text-3xl font-extrabold uppercase font-heading text-white">
            AUDITION APPLICATION TRACKER
          </h1>
          <p className="text-xs text-gray-400 mt-1">Track screening status, judge notes, and audition schedule timeline.</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading your applications...</div>
        ) : applications.length === 0 ? (
          <div className="text-center py-20 text-gray-400 cinematic-card p-12 rounded-2xl max-w-xl mx-auto">
            <Sparkles className="w-12 h-12 text-[#D6A84F] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white font-heading mb-2">No Audition Applications Found</h3>
            <p className="text-xs text-gray-400">You haven't submitted any audition applications yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {applications.map(app => {
              const currentStepIdx = getStepIndex(app.status);

              return (
                <div key={app.id} className="cinematic-card p-6 sm:p-8 rounded-2xl border border-white/10 relative space-y-6">
                  
                  {/* Top Metadata Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-extrabold text-[#D6A84F] font-heading">{app.application_no}</span>
                        <span className="px-2.5 py-0.5 rounded bg-white/10 text-white text-xs font-bold uppercase">{app.category}</span>
                      </div>
                      <div className="text-sm font-bold text-white mt-1">{app.audition?.title || app.performance_title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">Applied on: {app.created_at?.split('T')[0]} &bull; City: {app.city}</div>
                    </div>

                    <div className={`px-4 py-1.5 rounded text-xs font-bold uppercase self-start sm:self-auto ${
                      app.status === 'Selected' ? 'bg-green-900 text-green-200 border border-green-700' :
                      app.status === 'Rejected' ? 'bg-red-950 text-red-300 border border-red-800' :
                      'bg-[#B51D2A] text-white'
                    }`}>
                      STATUS: {app.status}
                    </div>
                  </div>

                  {/* Status Timeline Bar */}
                  <div className="py-4">
                    <div className="text-xs font-semibold text-gray-400 uppercase mb-4">SELECTION PIPELINE TIMELINE</div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 relative">
                      {timelineSteps.map((stepName, idx) => {
                        const isDone = currentStepIdx >= idx;
                        const isCurrent = currentStepIdx === idx;

                        return (
                          <div 
                            key={stepName} 
                            className={`p-3 rounded-xl border text-center transition-all ${
                              isDone 
                                ? 'bg-[#B51D2A]/20 border-[#B51D2A] text-white font-bold' 
                                : 'bg-black/40 border-white/10 text-gray-600'
                            }`}
                          >
                            <div className="text-[10px] uppercase tracking-wider mb-1">Step {idx + 1}</div>
                            <div className="text-xs leading-snug">{stepName}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Schedule Box if assigned */}
                  {app.schedule && (
                    <div className="p-4 rounded-xl bg-[#D6A84F]/10 border border-[#D6A84F]/40 text-xs text-gray-200 space-y-2">
                      <div className="font-bold text-[#D6A84F] uppercase text-sm flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" /> AUDITION SCHEDULE ASSIGNED
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div><span className="text-gray-400">DATE:</span> <span className="text-white font-bold">{app.schedule.scheduled_date}</span></div>
                        <div><span className="text-gray-400">TIME:</span> <span className="text-white font-bold">{app.schedule.scheduled_time}</span></div>
                        <div><span className="text-gray-400">LOCATION:</span> <span className="text-white font-bold">{app.schedule.location}</span></div>
                      </div>
                      {app.schedule.notes && <div className="text-gray-400 pt-1 border-t border-white/10">Note: {app.schedule.notes}</div>}
                    </div>
                  )}

                  {/* Judge Notes & Overall Score */}
                  {app.judge_notes && (
                    <div className="p-4 rounded-xl bg-black/60 border border-white/5 text-xs text-gray-300">
                      <span className="font-bold text-white uppercase text-xs block mb-1">JUDGE PANEL FEEDBACK</span>
                      <p className="italic">{app.judge_notes}</p>
                      {app.overall_score && (
                        <div className="mt-2 text-xs font-bold text-[#D6A84F]">
                          Overall Score: {app.overall_score} / 10
                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>

      <Footer />
    </div>
  );
};

export default DashboardAuditions;
