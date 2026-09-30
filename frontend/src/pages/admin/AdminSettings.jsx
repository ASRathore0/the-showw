import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { useSettings } from '../../context/SettingsContext';
import { getMediaUrl } from '../../utils/formatUrl';
import apiClient from '../../api/axios';
import { Save, Image as ImageIcon, Video, Sparkles, Layout, Info, Layers, CheckCircle2, AlertCircle, Upload, Loader2, FileVideo } from 'lucide-react';

const AdminSettings = () => {
  const { settings, saveSettings } = useSettings();
  const [formData, setFormData] = useState({ ...settings });
  const [activeTab, setActiveTab] = useState('branding');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingField, setUploadingField] = useState(null);

  useEffect(() => {
    setFormData({ ...settings });
  }, [settings]);

  const handleChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleFileUpload = async (e, fieldKey) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingField(fieldKey);
    setError(null);

    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const response = await apiClient.post('/admin/upload', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success && response.data.url) {
        handleChange(fieldKey, response.data.url);
      } else {
        setError("File upload failed. Please try again.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.message || "Error uploading file to server.");
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const success = await saveSettings(formData);
      if (success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 4000);
      } else {
        setError("Failed to save settings. Please check server logs.");
      }
    } catch (err) {
      console.error(err);
      setError("Error saving settings.");
    } finally {
      setSaving(false);
    }
  };

  // Helper component for Media Input with File Upload
  const MediaField = ({ label, fieldKey, placeholder, accept = "image/*", isVideo = false }) => {
    const isUploading = uploadingField === fieldKey;
    const value = formData[fieldKey] || '';

    return (
      <div className="space-y-2">
        <label className="block text-gray-300 font-bold text-xs">{label}</label>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input 
            type="text" 
            value={value} 
            onChange={e => handleChange(fieldKey, e.target.value)}
            className="flex-1 bg-[#161C2A] border border-[#263148] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#D6A84F]"
            placeholder={placeholder}
          />

          <label className={`cursor-pointer inline-flex items-center justify-center gap-2 py-3 px-5 text-xs font-semibold rounded-lg transition-all border ${
            isUploading 
              ? 'bg-[#1E2638] text-gray-400 border-[#263148]' 
              : 'bg-[#1E2638] text-white hover:bg-[#28354F] border-[#323E59] hover:border-[#D6A84F]'
          }`}>
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 text-[#D6A84F] animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 text-[#D6A84F]" />
                <span>Choose & Upload File</span>
              </>
            )}
            <input 
              type="file" 
              accept={accept}
              disabled={isUploading}
              onChange={(e) => handleFileUpload(e, fieldKey)}
              className="hidden"
            />
          </label>
        </div>

        {/* Media Preview Box */}
        {value && !isVideo && (
          <div className="mt-2 p-2 bg-black/60 rounded-lg border border-white/10 flex items-center gap-3 w-fit">
            <img 
              src={getMediaUrl(value)} 
              alt="Uploaded Preview" 
              className="h-10 w-auto object-contain rounded bg-[#080808]"
              onError={(e) => { 
                e.target.onerror = null;
                e.target.style.display = 'none'; 
              }}
            />
            <span className="text-[11px] text-gray-400 truncate max-w-xs">{value}</span>
          </div>
        )}

        {value && isVideo && (
          <div className="mt-2 p-2 bg-black/60 rounded-lg border border-white/10 flex items-center gap-3 w-fit">
            <FileVideo className="w-6 h-6 text-[#B51D2A]" />
            <span className="text-[11px] text-gray-400 truncate max-w-xs">{value}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#0A0D14] text-gray-200 min-h-screen flex font-sans">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader title="Platform Settings & CMS Customization" />

        <main className="p-8 space-y-6 max-w-6xl">

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0F131C] p-6 rounded-xl border border-[#1E2638]">
            <div>
              <h1 className="text-xl font-bold text-white font-heading uppercase flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D6A84F]" /> Customize Website Content & Branding
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Upload files manually or enter URL paths for logo, video background, about images, and experience pillars.
              </p>
            </div>
            
            <button 
              onClick={handleSave} 
              disabled={saving}
              className="btn-primary py-3 px-6 text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#B51D2A]/20"
            >
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>

          {saved && (
            <div className="p-4 rounded-xl bg-green-950/80 border border-green-700/80 text-green-300 text-sm font-semibold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
              Platform settings & layout updated successfully! Changes are live across the website.
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-950/80 border border-red-700/80 text-red-300 text-sm font-semibold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Tabs Navigation */}
          <div className="flex items-center gap-2 border-b border-[#1E2638] overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setActiveTab('branding')}
              className={`py-3 px-5 text-xs font-bold rounded-t-lg flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === 'branding' 
                  ? 'bg-[#161C2A] text-[#D6A84F] border-t-2 border-[#D6A84F]' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" /> Platform Logo & Branding
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('hero')}
              className={`py-3 px-5 text-xs font-bold rounded-t-lg flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === 'hero' 
                  ? 'bg-[#161C2A] text-[#D6A84F] border-t-2 border-[#D6A84F]' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Video className="w-4 h-4" /> Hero Banner & Video
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('about')}
              className={`py-3 px-5 text-xs font-bold rounded-t-lg flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === 'about' 
                  ? 'bg-[#161C2A] text-[#D6A84F] border-t-2 border-[#D6A84F]' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Info className="w-4 h-4" /> About Section
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('experience')}
              className={`py-3 px-5 text-xs font-bold rounded-t-lg flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === 'experience' 
                  ? 'bg-[#161C2A] text-[#D6A84F] border-t-2 border-[#D6A84F]' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" /> Experience Pillars (4 Cards)
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSave} className="space-y-6">

            {/* TAB 1: BRANDING & LOGO */}
            {activeTab === 'branding' && (
              <div className="bg-[#0F131C] p-8 rounded-xl border border-[#1E2638] space-y-6 animate-fadeIn">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[#D6A84F]">
                  1. BRANDING & LOGO SETTINGS
                </h3>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-gray-300 font-bold mb-2 text-xs">Platform Brand Title</label>
                    <input 
                      type="text" 
                      value={formData.site_title || ''} 
                      onChange={e => handleChange('site_title', e.target.value)}
                      className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#D6A84F]"
                      placeholder="THE JP YADAV SHOW"
                      required
                    />
                  </div>

                  <MediaField 
                    label="Platform Logo Image (Upload or Path URL)" 
                    fieldKey="logo_url" 
                    placeholder="/assets/images/jp-yadav-show-logo.png"
                    accept="image/*"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div>
                    <label className="block text-gray-300 font-bold mb-2 text-xs">Support Phone Number</label>
                    <input 
                      type="text" 
                      value={formData.support_phone || ''} 
                      onChange={e => handleChange('support_phone', e.target.value)}
                      className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#D6A84F]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-bold mb-2 text-xs">Support Desk Email</label>
                    <input 
                      type="email" 
                      value={formData.support_email || ''} 
                      onChange={e => handleChange('support_email', e.target.value)}
                      className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#D6A84F]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: HERO BANNER & VIDEO */}
            {activeTab === 'hero' && (
              <div className="bg-[#0F131C] p-8 rounded-xl border border-[#1E2638] space-y-6 animate-fadeIn">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[#D6A84F]">
                  2. HERO BANNER & VIDEO SETTINGS
                </h3>

                <div>
                  <label className="block text-gray-300 font-bold mb-2 text-xs">Hero Section Heading (Title)</label>
                  <input 
                    type="text" 
                    value={formData.hero_title || ''} 
                    onChange={e => handleChange('hero_title', e.target.value)}
                    className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#D6A84F]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 font-bold mb-2 text-xs">Hindi Tagline</label>
                    <input 
                      type="text" 
                      value={formData.hero_tagline || ''} 
                      onChange={e => handleChange('hero_tagline', e.target.value)}
                      className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#D6A84F]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-bold mb-2 text-xs">English Subtitle</label>
                    <input 
                      type="text" 
                      value={formData.hero_subtitle || ''} 
                      onChange={e => handleChange('hero_subtitle', e.target.value)}
                      className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#D6A84F]"
                    />
                  </div>
                </div>

                <MediaField 
                  label="Hero Background Video File / URL" 
                  fieldKey="hero_video_url" 
                  placeholder="/assets/videos/jp-yadav-show-hero.mp4"
                  accept="video/mp4,video/webm,video/ogg,video/quicktime"
                  isVideo={true}
                />

                <div className="pt-4 border-t border-[#1E2638]">
                  <h4 className="text-xs font-bold text-gray-300 uppercase mb-4">Hero Next Tour Announcement Pill</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">Next Show City</label>
                      <input 
                        type="text" 
                        value={formData.hero_next_city || ''} 
                        onChange={e => handleChange('hero_next_city', e.target.value)}
                        className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">Next Show Date</label>
                      <input 
                        type="text" 
                        value={formData.hero_next_date || ''} 
                        onChange={e => handleChange('hero_next_date', e.target.value)}
                        className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">Next Show Time</label>
                      <input 
                        type="text" 
                        value={formData.hero_next_time || ''} 
                        onChange={e => handleChange('hero_next_time', e.target.value)}
                        className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ABOUT SECTION */}
            {activeTab === 'about' && (
              <div className="bg-[#0F131C] p-8 rounded-xl border border-[#1E2638] space-y-6 animate-fadeIn">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[#D6A84F]">
                  3. ABOUT SECTION CONTENT
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 font-bold mb-2 text-xs">Section Tagline</label>
                    <input 
                      type="text" 
                      value={formData.about_tagline || ''} 
                      onChange={e => handleChange('about_tagline', e.target.value)}
                      className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#D6A84F]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-bold mb-2 text-xs">Main Section Heading</label>
                    <input 
                      type="text" 
                      value={formData.about_heading || ''} 
                      onChange={e => handleChange('about_heading', e.target.value)}
                      className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#D6A84F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-2 text-xs">Featured Quote / Mission Statement</label>
                  <textarea 
                    rows={2}
                    value={formData.about_quote || ''} 
                    onChange={e => handleChange('about_quote', e.target.value)}
                    className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#D6A84F]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-2 text-xs">Paragraph 1 (Primary Description)</label>
                  <textarea 
                    rows={3}
                    value={formData.about_p1 || ''} 
                    onChange={e => handleChange('about_p1', e.target.value)}
                    className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#D6A84F]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-2 text-xs">Paragraph 2 (Secondary Description / Vision)</label>
                  <textarea 
                    rows={3}
                    value={formData.about_p2 || ''} 
                    onChange={e => handleChange('about_p2', e.target.value)}
                    className="w-full bg-[#161C2A] border border-[#263148] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#D6A84F]"
                  />
                </div>

                <MediaField 
                  label="About Section Image (Upload File or URL)" 
                  fieldKey="about_image_url" 
                  placeholder="https://images.unsplash.com/..."
                  accept="image/*"
                />
              </div>
            )}

            {/* TAB 4: EXPERIENCE PILLARS */}
            {activeTab === 'experience' && (
              <div className="bg-[#0F131C] p-8 rounded-xl border border-[#1E2638] space-y-8 animate-fadeIn">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[#D6A84F]">
                  4. FOUR EXPERIENCE PILLARS (HOMEPAGE CARDS)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Pillar 1 */}
                  <div className="p-5 bg-[#161C2A] border border-[#263148] rounded-xl space-y-4">
                    <div className="text-xs font-bold text-[#B51D2A] uppercase">Pillar 1 (Comedy)</div>
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">Title</label>
                      <input 
                        type="text" 
                        value={formData.pillar1_title || ''} 
                        onChange={e => handleChange('pillar1_title', e.target.value)}
                        className="w-full bg-[#0F131C] border border-[#263148] rounded p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">Description</label>
                      <input 
                        type="text" 
                        value={formData.pillar1_desc || ''} 
                        onChange={e => handleChange('pillar1_desc', e.target.value)}
                        className="w-full bg-[#0F131C] border border-[#263148] rounded p-2 text-xs text-white"
                      />
                    </div>
                    <MediaField 
                      label="Pillar 1 Image" 
                      fieldKey="pillar1_image" 
                      placeholder="https://..."
                      accept="image/*"
                    />
                  </div>

                  {/* Pillar 2 */}
                  <div className="p-5 bg-[#161C2A] border border-[#263148] rounded-xl space-y-4">
                    <div className="text-xs font-bold text-[#D6A84F] uppercase">Pillar 2 (Talent)</div>
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">Title</label>
                      <input 
                        type="text" 
                        value={formData.pillar2_title || ''} 
                        onChange={e => handleChange('pillar2_title', e.target.value)}
                        className="w-full bg-[#0F131C] border border-[#263148] rounded p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">Description</label>
                      <input 
                        type="text" 
                        value={formData.pillar2_desc || ''} 
                        onChange={e => handleChange('pillar2_desc', e.target.value)}
                        className="w-full bg-[#0F131C] border border-[#263148] rounded p-2 text-xs text-white"
                      />
                    </div>
                    <MediaField 
                      label="Pillar 2 Image" 
                      fieldKey="pillar2_image" 
                      placeholder="https://..."
                      accept="image/*"
                    />
                  </div>

                  {/* Pillar 3 */}
                  <div className="p-5 bg-[#161C2A] border border-[#263148] rounded-xl space-y-4">
                    <div className="text-xs font-bold text-[#B51D2A] uppercase">Pillar 3 (Music)</div>
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">Title</label>
                      <input 
                        type="text" 
                        value={formData.pillar3_title || ''} 
                        onChange={e => handleChange('pillar3_title', e.target.value)}
                        className="w-full bg-[#0F131C] border border-[#263148] rounded p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">Description</label>
                      <input 
                        type="text" 
                        value={formData.pillar3_desc || ''} 
                        onChange={e => handleChange('pillar3_desc', e.target.value)}
                        className="w-full bg-[#0F131C] border border-[#263148] rounded p-2 text-xs text-white"
                      />
                    </div>
                    <MediaField 
                      label="Pillar 3 Image" 
                      fieldKey="pillar3_image" 
                      placeholder="https://..."
                      accept="image/*"
                    />
                  </div>

                  {/* Pillar 4 */}
                  <div className="p-5 bg-[#161C2A] border border-[#263148] rounded-xl space-y-4">
                    <div className="text-xs font-bold text-[#D6A84F] uppercase">Pillar 4 (Live Audience)</div>
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">Title</label>
                      <input 
                        type="text" 
                        value={formData.pillar4_title || ''} 
                        onChange={e => handleChange('pillar4_title', e.target.value)}
                        className="w-full bg-[#0F131C] border border-[#263148] rounded p-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">Description</label>
                      <input 
                        type="text" 
                        value={formData.pillar4_desc || ''} 
                        onChange={e => handleChange('pillar4_desc', e.target.value)}
                        className="w-full bg-[#0F131C] border border-[#263148] rounded p-2 text-xs text-white"
                      />
                    </div>
                    <MediaField 
                      label="Pillar 4 Image" 
                      fieldKey="pillar4_image" 
                      placeholder="https://..."
                      accept="image/*"
                    />
                  </div>

                </div>
              </div>
            )}

            {/* Bottom Save Action Bar */}
            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                disabled={saving}
                className="btn-primary py-3 px-8 text-xs flex items-center gap-2 shadow-xl shadow-[#B51D2A]/30"
              >
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Configuration'}
              </button>
            </div>
          </form>

        </main>
      </div>
    </div>
  );
};

export default AdminSettings;
