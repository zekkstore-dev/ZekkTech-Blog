'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Portfolio } from '@/types/portfolio';

type Tab = 'profil' | 'portofolio' | 'konten';

export default function AdminAboutPage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<Tab>('profil');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Markdown Content
  const [content, setContent] = useState('');

  // Profile Settings
  const [profileName, setProfileName] = useState('');
  const [profileJob, setProfileJob] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [profileTechs, setProfileTechs] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');
  const [profileAvatar, setProfileAvatar] = useState('');
  const [profileCV, setProfileCV] = useState('');
  const [profileCert, setProfileCert] = useState('');

  // Portfolios
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [editingPortfolioId, setEditingPortfolioId] = useState<string | null>(null);
  
  // Portfolio Form State
  const [portTitle, setPortTitle] = useState('');
  const [portDesc, setPortDesc] = useState('');
  const [portImage, setPortImage] = useState('');
  const [portDemo, setPortDemo] = useState('');
  const [portRepo, setPortRepo] = useState('');
  const [portTags, setPortTags] = useState<string[]>([]);
  const [portTagInput, setPortTagInput] = useState('');

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadData() {
    try {
      // Load site_settings for profile & content
      const { data: settings } = await supabase.from('site_settings').select('key, value');
      if (settings) {
        settings.forEach(s => {
          if (s.key === 'about_content') setContent(s.value);
          if (s.key === 'profile_name') setProfileName(s.value);
          if (s.key === 'profile_job') setProfileJob(s.value);
          if (s.key === 'profile_bio') setProfileBio(s.value);
          if (s.key === 'profile_techs') setProfileTechs(JSON.parse(s.value || '[]'));
          if (s.key === 'profile_avatar') setProfileAvatar(s.value);
          if (s.key === 'profile_cv') setProfileCV(s.value);
          if (s.key === 'profile_cert') setProfileCert(s.value);
        });
      }

      // Load Portfolios
      const { data: ports } = await supabase.from('portfolios').select('*').order('created_at', { ascending: false });
      if (ports) {
        setPortfolios(ports as Portfolio[]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload gagal');
      const { publicUrl } = await res.json();
      setter(publicUrl);
    } catch (err) {
      alert('Gagal upload file');
    }
  };

  const saveSettings = async (keys: { key: string, value: string }[]) => {
    try {
      for (const item of keys) {
        const { error } = await supabase.from('site_settings').upsert(
          { key: item.key, value: item.value },
          { onConflict: 'key' }
        );
        if (error) throw error;
      }
    } catch (error) {
      throw error;
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      await saveSettings([
        { key: 'profile_name', value: profileName },
        { key: 'profile_job', value: profileJob },
        { key: 'profile_bio', value: profileBio },
        { key: 'profile_techs', value: JSON.stringify(profileTechs) },
        { key: 'profile_avatar', value: profileAvatar },
        { key: 'profile_cv', value: profileCV },
        { key: 'profile_cert', value: profileCert },
      ]);
      setFeedback({ type: 'success', msg: 'Profil berhasil diperbarui!' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (e) {
      setFeedback({ type: 'error', msg: 'Gagal menyimpan profil.' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveContent = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      await saveSettings([{ key: 'about_content', value: content }]);
      setFeedback({ type: 'success', msg: 'Konten Markdown berhasil disimpan!' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (e) {
      setFeedback({ type: 'error', msg: 'Gagal menyimpan konten.' });
    } finally {
      setSaving(false);
    }
  };

  const resetPortfolioForm = () => {
    setEditingPortfolioId(null);
    setPortTitle('');
    setPortDesc('');
    setPortImage('');
    setPortDemo('');
    setPortRepo('');
    setPortTags([]);
    setShowPortfolioForm(false);
  };

  const startEditPortfolio = (p: Portfolio) => {
    setEditingPortfolioId(p.id);
    setPortTitle(p.title);
    setPortDesc(p.description);
    setPortImage(p.image_url);
    setPortDemo(p.demo_url);
    setPortRepo(p.repo_url);
    setPortTags(p.tags || []);
    setShowPortfolioForm(true);
  };

  const handleSavePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: portTitle,
        description: portDesc,
        image_url: portImage,
        demo_url: portDemo,
        repo_url: portRepo,
        tags: portTags
      };

      if (editingPortfolioId) {
        await supabase.from('portfolios').update(payload).eq('id', editingPortfolioId);
      } else {
        await supabase.from('portfolios').insert([payload]);
      }
      
      await loadData();
      resetPortfolioForm();
      setFeedback({ type: 'success', msg: 'Portofolio berhasil disimpan!' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      setFeedback({ type: 'error', msg: 'Gagal menyimpan portofolio' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePortfolio = async (id: string) => {
    if (!confirm('Yakin ingin menghapus proyek ini?')) return;
    try {
      await supabase.from('portfolios').delete().eq('id', id);
      setPortfolios(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      alert('Gagal menghapus portofolio');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading setelan About...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="admin-title text-2xl font-bold text-gray-900">Kelola Halaman About</h1>
          <p className="admin-subtitle-text text-sm text-gray-500 mt-1">
            Atur profil, keahlian, file CV, hingga grid Portofolio Anda.
          </p>
        </div>
      </div>

      {feedback && (
        <div className={`mb-6 p-4 rounded-xl border text-sm font-medium flex items-center gap-3 ${
          feedback.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <span>{feedback.type === 'success' ? '✅' : '🚨'}</span> {feedback.msg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-xl mb-8 w-max admin-card">
        {(['profil', 'portofolio', 'konten'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 text-sm font-semibold rounded-lg capitalize transition-all ${
              activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="admin-card bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        {/* ===================== TAB PROFIL ===================== */}
        {activeTab === 'profil' && (
          <div className="space-y-6 max-w-3xl">
            <h2 className="admin-title text-xl font-bold mb-4">Pengaturan Profil</h2>
            
            <div className="flex gap-6 items-start">
              <div className="w-32">
                <label className="admin-label block text-sm font-semibold text-gray-700 mb-2">Foto / Ilustrasi</label>
                <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 relative group flex items-center justify-center">
                  {profileAvatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profileAvatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-sm">Upload</span>
                  )}
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setProfileAvatar)} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <label className="admin-label block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                  <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} className="admin-input w-full px-4 py-2 border rounded-xl" placeholder="Misal: ZakariaMP" />
                </div>
                <div>
                  <label className="admin-label block text-sm font-semibold text-gray-700 mb-1">Jabatan / Role</label>
                  <input type="text" value={profileJob} onChange={(e) => setProfileJob(e.target.value)} className="admin-input w-full px-4 py-2 border rounded-xl" placeholder="Misal: Full-Stack Developer" />
                </div>
              </div>
            </div>

            <div>
              <label className="admin-label block text-sm font-semibold text-gray-700 mb-1">Bio Singkat</label>
              <textarea value={profileBio} onChange={(e) => setProfileBio(e.target.value)} rows={3} className="admin-textarea w-full px-4 py-3 border rounded-xl resize-none" placeholder="Deskripsi singkat diri Anda..." />
            </div>

            <div>
              <label className="admin-label block text-sm font-semibold text-gray-700 mb-1">Tech Stack (Keahlian)</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {profileTechs.map(tech => (
                  <span key={tech} className="bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2">
                    {tech} <button onClick={() => setProfileTechs(prev => prev.filter(t => t !== tech))} className="text-red-500 hover:text-red-700">&times;</button>
                  </span>
                ))}
              </div>
              <input 
                type="text" 
                value={techInput} 
                onChange={(e) => setTechInput(e.target.value)} 
                onKeyDown={(e) => { 
                  if(e.key === 'Enter') { 
                    e.preventDefault(); 
                    if(techInput && !profileTechs.includes(techInput)) setProfileTechs([...profileTechs, techInput]);
                    setTechInput(''); 
                  } 
                }} 
                className="admin-input w-full px-4 py-2 border rounded-xl" 
                placeholder="Ketik lalu Enter..." 
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div>
                <label className="admin-label block text-sm font-semibold text-gray-700 mb-1">File CV (PDF)</label>
                <div className="flex gap-2 items-center">
                  <input type="file" accept=".pdf" onChange={(e) => handleFileUpload(e, setProfileCV)} className="text-xs" />
                  {profileCV && <a href={profileCV} target="_blank" rel="noreferrer" className="text-xs text-blue-500 underline">Lihat CV</a>}
                </div>
              </div>
              <div>
                <label className="admin-label block text-sm font-semibold text-gray-700 mb-1">File Sertifikat Utama</label>
                <div className="flex gap-2 items-center">
                  <input type="file" accept=".pdf,image/*" onChange={(e) => handleFileUpload(e, setProfileCert)} className="text-xs" />
                  {profileCert && <a href={profileCert} target="_blank" rel="noreferrer" className="text-xs text-blue-500 underline">Lihat Sertifikat</a>}
                </div>
              </div>
            </div>

            <button onClick={handleSaveProfile} disabled={saving} className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl mt-4">
              Simpan Profil
            </button>
          </div>
        )}

        {/* ===================== TAB PORTOFOLIO ===================== */}
        {activeTab === 'portofolio' && (
          <div>
            {!showPortfolioForm ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="admin-title text-xl font-bold">Daftar Portofolio</h2>
                  <button onClick={() => setShowPortfolioForm(true)} className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-bold">+ Tambah</button>
                </div>
                {portfolios.length === 0 ? (
                  <p className="text-gray-500 italic">Belum ada portofolio.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {portfolios.map(p => (
                      <div key={p.id} className="border border-gray-100 p-4 rounded-xl flex gap-4 bg-gray-50 admin-input">
                        {p.image_url && <div className="w-24 h-24 shrink-0 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${p.image_url})` }} />}
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">{p.title}</h3>
                          <div className="flex gap-2 mt-2">
                            <button onClick={() => startEditPortfolio(p)} className="text-blue-600 text-sm hover:underline">Edit</button>
                            <button onClick={() => handleDeletePortfolio(p.id)} className="text-red-500 text-sm hover:underline">Hapus</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <form onSubmit={handleSavePortfolio} className="space-y-4 max-w-2xl">
                <h2 className="admin-title text-xl font-bold mb-6">{editingPortfolioId ? 'Edit Portofolio' : 'Tambah Portofolio'}</h2>
                
                <div>
                  <label className="admin-label block text-sm font-semibold mb-1">Thumbnail Preview</label>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setPortImage)} className="text-sm border p-2 rounded-lg w-full mb-2 bg-white" />
                  {portImage && <div className="h-32 w-48 bg-cover bg-center rounded-lg border" style={{ backgroundImage: `url(${portImage})` }} />}
                </div>

                <div>
                  <label className="admin-label block text-sm font-semibold mb-1">Judul Portofolio</label>
                  <input required value={portTitle} onChange={e => setPortTitle(e.target.value)} className="admin-input w-full px-4 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="admin-label block text-sm font-semibold mb-1">Deskripsi Singkat</label>
                  <textarea rows={3} value={portDesc} onChange={e => setPortDesc(e.target.value)} className="admin-textarea w-full px-4 py-2 border rounded-xl" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="admin-label block text-sm font-semibold mb-1">Tags (Pisahkan Enter)</label>
                    <div className="flex flex-wrap gap-1 mb-1">
                      {portTags.map(t => (
                        <span key={t} className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex items-center justify-center gap-1">
                          {t}
                          <button type="button" onClick={() => setPortTags(prev => prev.filter(tag => tag !== t))} className="text-blue-500 hover:text-blue-900 font-bold ml-1 text-[12px] leading-none focus:outline-none">&times;</button>
                        </span>
                      ))}
                    </div>
                    <input type="text" value={portTagInput} onChange={e=>setPortTagInput(e.target.value)} onKeyDown={(e) => { 
                      if(e.key === 'Enter') { e.preventDefault(); if(portTagInput) setPortTags([...portTags, portTagInput]); setPortTagInput(''); } 
                    }} className="admin-input w-full px-3 py-1.5 text-sm border rounded-xl" />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="admin-label block text-sm font-semibold mb-1">Link Demo Website</label>
                      <input type="url" value={portDemo} onChange={e => setPortDemo(e.target.value)} className="admin-input w-full px-3 py-1.5 text-sm border rounded-xl" placeholder="https://" />
                    </div>
                    <div>
                      <label className="admin-label block text-sm font-semibold mb-1">Link Github Repo</label>
                      <input type="url" value={portRepo} onChange={e => setPortRepo(e.target.value)} className="admin-input w-full px-3 py-1.5 text-sm border rounded-xl" placeholder="https://" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" disabled={saving} className="px-6 py-2 bg-blue-500 text-white rounded-xl font-bold">Simpan</button>
                  <button type="button" onClick={resetPortfolioForm} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-xl font-bold">Batal</button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ===================== TAB KONTEN ===================== */}
        {activeTab === 'konten' && (
          <div className="space-y-4">
             <div className="flex justify-between">
               <h2 className="admin-title text-xl font-bold">Bercerita (Markdown)</h2>
               <button onClick={handleSaveContent} disabled={saving} className="px-6 py-2 bg-blue-500 text-white font-bold rounded-xl">Simpan Konten</button>
             </div>
             <textarea value={content} onChange={e => setContent(e.target.value)} rows={12} className="admin-textarea w-full p-4 border rounded-xl font-mono text-sm leading-relaxed focus:ring-2 focus:ring-blue-100 outline-none" />
          </div>
        )}
      </div>
    </div>
  );
}
