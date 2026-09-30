import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import apiClient from '../api/axios';
import { useSettings } from '../context/SettingsContext';
import { CheckCircle2, ArrowRight, ArrowLeft, Upload, Sparkles, AlertCircle } from 'lucide-react';

const AuditionApply = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { settings } = useSettings();

  const [step, setStep] = useState(1);
  const [audition, setAudition] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedApp, setSubmittedApp] = useState(null);

  const [formData, setFormData] = useState({
    full_name: '',
    dob: '',
    gender: 'Male',
    mobile: '',
    email: '',
    city: '',
    state: 'Bihar',
    category: 'Comedy',
    experience: '1-3 Years',
    languages: 'Bhojpuri, Hindi',
    bio: '',
    performance_title: '',
    performance_description: '',
    duration: '3 Mins',
    youtube_url: '',
    instagram_url: '',
    terms_accepted: false
  });

  useEffect(() => {
    if (id) {
      apiClient.get(`/auditions/${id}`)
        .then(res => {
          if (res.data.success) {
            setAudition(res.data.audition);
            setFormData(prev => ({ ...prev, category: res.data.audition.category }));
          }
        })
        .catch(console.error);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (step === 1) {
      if (!formData.full_name || !formData.mobile || !formData.email || !formData.city) {
        setErrorMsg('Please fill all required personal information fields.');
        return;
      }
    } else if (step === 2) {
      if (!formData.category) {
        setErrorMsg('Please select a performance category.');
        return;
      }
    } else if (step === 3) {
      if (!formData.performance_title) {
        setErrorMsg('Please provide a performance title.');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.terms_accepted) {
      setErrorMsg('Please accept the audition terms and conditions to proceed.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await apiClient.post(`/auditions/${id || 1}/apply`, formData);
      if (res.data.success) {
        setSubmittedApp(res.data.application);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit application. Please check your inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans">
      <Navbar />

      <div className="pt-32 pb-24 px-4 max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-[#D6A84F] uppercase tracking-widest block mb-1">
            OFFICIAL AUDITION APPLICATION
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold uppercase font-heading">
            {audition ? audition.title : 'Talent Audition Form'}
          </h1>
        </div>

        {/* Success Screen */}
        {submittedApp ? (
          <div className="cinematic-card p-10 rounded-2xl text-center max-w-2xl mx-auto border border-[#B51D2A]/40 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-[#B51D2A]/20 text-[#B51D2A] border border-[#B51D2A] flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h2 className="text-3xl font-extrabold font-heading text-white mb-2 uppercase">
              APPLICATION SUBMITTED SUCCESSFULLY!
            </h2>
            <p className="text-gray-300 text-sm mb-6">
              Your audition submission has been registered and sent to the production panel for review.
            </p>

            <div className="p-4 rounded-xl bg-black/60 border border-white/10 mb-8 inline-block text-left text-xs space-y-2">
              <div><span className="text-gray-400">APPLICATION ID:</span> <span className="text-[#D6A84F] font-bold text-base ml-2">{submittedApp.application_no}</span></div>
              <div><span className="text-gray-400">APPLICANT NAME:</span> <span className="text-white font-semibold ml-2">{submittedApp.full_name}</span></div>
              <div><span className="text-gray-400">CATEGORY:</span> <span className="text-white font-semibold ml-2">{submittedApp.category}</span></div>
              <div><span className="text-gray-400">STATUS:</span> <span className="px-2 py-0.5 rounded bg-[#B51D2A] text-white font-bold ml-2">{submittedApp.status}</span></div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/dashboard/auditions" className="btn-primary py-3 px-6 text-xs">
                VIEW IN USER DASHBOARD
              </Link>
              <Link to="/auditions" className="btn-outline py-3 px-6 text-xs border-white/20">
                BROWSE OTHER AUDITIONS
              </Link>
            </div>
          </div>
        ) : (
          <div className="cinematic-card p-6 sm:p-10 rounded-2xl border border-white/10">
            
            {/* Step Wizard Progress Bar */}
            <div className="grid grid-cols-4 gap-2 mb-8 border-b border-white/10 pb-6 text-center text-xs font-bold uppercase tracking-wider">
              <div className={`pb-2 border-b-2 ${step >= 1 ? 'border-[#B51D2A] text-[#B51D2A]' : 'border-transparent text-gray-600'}`}>
                1. Personal
              </div>
              <div className={`pb-2 border-b-2 ${step >= 2 ? 'border-[#B51D2A] text-[#B51D2A]' : 'border-transparent text-gray-600'}`}>
                2. Talent
              </div>
              <div className={`pb-2 border-b-2 ${step >= 3 ? 'border-[#B51D2A] text-[#B51D2A]' : 'border-transparent text-gray-600'}`}>
                3. Performance
              </div>
              <div className={`pb-2 border-b-2 ${step >= 4 ? 'border-[#B51D2A] text-[#B51D2A]' : 'border-transparent text-gray-600'}`}>
                4. Confirm
              </div>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* STEP 1: Personal Information */}
            {step === 1 && (
              <form onSubmit={handleNext} className="space-y-6">
                <h3 className="text-xl font-bold font-heading text-white mb-4">STEP 1: PERSONAL INFORMATION</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Full Name *</label>
                    <input 
                      type="text" 
                      name="full_name" 
                      value={formData.full_name} 
                      onChange={handleChange}
                      placeholder="e.g. Rahul Kumar"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:border-[#B51D2A] focus:outline-none" 
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Date of Birth</label>
                    <input 
                      type="date" 
                      name="dob" 
                      value={formData.dob} 
                      onChange={handleChange}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:border-[#B51D2A] focus:outline-none" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Gender</label>
                    <select 
                      name="gender" 
                      value={formData.gender} 
                      onChange={handleChange}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:border-[#B51D2A] focus:outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Mobile Number *</label>
                    <input 
                      type="tel" 
                      name="mobile" 
                      value={formData.mobile} 
                      onChange={handleChange}
                      placeholder="+91 9876543210"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:border-[#B51D2A] focus:outline-none" 
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address *</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:border-[#B51D2A] focus:outline-none" 
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">City *</label>
                    <input 
                      type="text" 
                      name="city" 
                      value={formData.city} 
                      onChange={handleChange}
                      placeholder="e.g. Patna"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:border-[#B51D2A] focus:outline-none" 
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-300 mb-1">State</label>
                    <input 
                      type="text" 
                      name="state" 
                      value={formData.state} 
                      onChange={handleChange}
                      placeholder="e.g. Bihar"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:border-[#B51D2A] focus:outline-none" 
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button type="submit" className="btn-primary py-3 px-8 text-xs">
                    NEXT: TALENT DETAILS &rarr;
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Talent */}
            {step === 2 && (
              <form onSubmit={handleNext} className="space-y-6">
                <h3 className="text-xl font-bold font-heading text-white mb-4">STEP 2: TALENT &amp; EXPERIENCE</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Performance Category *</label>
                    <select 
                      name="category" 
                      value={formData.category} 
                      onChange={handleChange}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:border-[#B51D2A] focus:outline-none"
                    >
                      <option value="Comedy">Comedy / Standup</option>
                      <option value="Acting">Acting / Stage Play</option>
                      <option value="Singing">Folk / Vocal Singing</option>
                      <option value="Mimicry">Voice Mimicry</option>
                      <option value="Anchoring">Stage Anchoring</option>
                      <option value="Poetry">Poetry / Standup Shayari</option>
                      <option value="Other">Other Talent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Stage Experience</label>
                    <input 
                      type="text" 
                      name="experience" 
                      value={formData.experience} 
                      onChange={handleChange}
                      placeholder="e.g. 2 Years, Fresher, College Fest"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:border-[#B51D2A] focus:outline-none" 
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Performance Languages</label>
                    <input 
                      type="text" 
                      name="languages" 
                      value={formData.languages} 
                      onChange={handleChange}
                      placeholder="e.g. Bhojpuri, Hindi, Maithili"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:border-[#B51D2A] focus:outline-none" 
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Artist Bio / About Yourself</label>
                    <textarea 
                      name="bio" 
                      rows="3" 
                      value={formData.bio} 
                      onChange={handleChange}
                      placeholder="Tell the judges brief background about your stage journey..."
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:border-[#B51D2A] focus:outline-none" 
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button type="button" onClick={handlePrev} className="btn-outline py-3 px-6 text-xs">
                    &larr; BACK
                  </button>
                  <button type="submit" className="btn-primary py-3 px-8 text-xs">
                    NEXT: PERFORMANCE MEDIA &rarr;
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Performance */}
            {step === 3 && (
              <form onSubmit={handleNext} className="space-y-6">
                <h3 className="text-xl font-bold font-heading text-white mb-4">STEP 3: PERFORMANCE DETAILS</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Performance Title *</label>
                    <input 
                      type="text" 
                      name="performance_title" 
                      value={formData.performance_title} 
                      onChange={handleChange}
                      placeholder="e.g. Gramin Panchayat Standup Comedy"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:border-[#B51D2A] focus:outline-none" 
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Duration</label>
                    <input 
                      type="text" 
                      name="duration" 
                      value={formData.duration} 
                      onChange={handleChange}
                      placeholder="e.g. 3 Mins"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:border-[#B51D2A] focus:outline-none" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">YouTube Video Link</label>
                    <input 
                      type="url" 
                      name="youtube_url" 
                      value={formData.youtube_url} 
                      onChange={handleChange}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:border-[#B51D2A] focus:outline-none" 
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Instagram Video Link</label>
                    <input 
                      type="url" 
                      name="instagram_url" 
                      value={formData.instagram_url} 
                      onChange={handleChange}
                      placeholder="https://instagram.com/reel/..."
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:border-[#B51D2A] focus:outline-none" 
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Performance Summary / Script Notes</label>
                    <textarea 
                      name="performance_description" 
                      rows="3" 
                      value={formData.performance_description} 
                      onChange={handleChange}
                      placeholder="Briefly describe what happens in your performance video..."
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:border-[#B51D2A] focus:outline-none" 
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button type="button" onClick={handlePrev} className="btn-outline py-3 px-6 text-xs">
                    &larr; BACK
                  </button>
                  <button type="submit" className="btn-primary py-3 px-8 text-xs">
                    NEXT: FINAL REVIEW &rarr;
                  </button>
                </div>
              </form>
            )}

            {/* STEP 4: Confirmation & Consent */}
            {step === 4 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-xl font-bold font-heading text-white mb-4">STEP 4: CONFIRMATION &amp; TERMS</h3>

                <div className="p-4 rounded-xl bg-black/50 border border-white/10 text-xs space-y-3">
                  <h4 className="font-bold text-white uppercase text-sm mb-2">APPLICATION SUMMARY</h4>
                  <div className="grid grid-cols-2 gap-2 text-gray-300">
                    <div>Applicant: <span className="text-white font-semibold">{formData.full_name}</span></div>
                    <div>Category: <span className="text-white font-semibold">{formData.category}</span></div>
                    <div>Mobile: <span className="text-white font-semibold">{formData.mobile}</span></div>
                    <div>City: <span className="text-white font-semibold">{formData.city}</span></div>
                    <div className="col-span-2">Performance: <span className="text-[#D6A84F] font-semibold">{formData.performance_title}</span></div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="terms_accepted" 
                      checked={formData.terms_accepted} 
                      onChange={handleChange}
                      className="mt-1 accent-[#B51D2A] w-4 h-4" 
                      required
                    />
                    <span className="text-xs text-gray-300 leading-relaxed">
                      I declare that all submitted performance details and personal information are accurate. I grant {settings?.site_title || "the show"} production rights to review my performance video for audition evaluation and broadcasting considerations.
                    </span>
                  </label>
                </div>

                <div className="pt-6 flex items-center justify-between border-t border-white/10">
                  <button type="button" onClick={handlePrev} className="btn-outline py-3 px-6 text-xs">
                    &larr; BACK
                  </button>
                  <button 
                    type="submit" 
                    disabled={submitting} 
                    className="btn-primary py-3.5 px-8 text-sm disabled:opacity-50"
                  >
                    {submitting ? 'SUBMITTING APPLICATION...' : 'SUBMIT AUDITION APPLICATION'}
                  </button>
                </div>
              </form>
            )}

          </div>
        )}

      </div>

      <Footer />
    </div>
  );
};

export default AuditionApply;
