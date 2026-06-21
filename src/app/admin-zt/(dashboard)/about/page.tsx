'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { convertToWebP } from '@/lib/image-converter';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Portfolio } from '@/types/portfolio';
import { User, Briefcase, Trophy, FileText, CheckCircle, AlertCircle, FolderDot } from 'lucide-react';

type Tab = 'profil' | 'experience' | 'portofolio' | 'sertifikat' | 'konten';

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  image_url: string;
  cert_url: string;
  section: string;
  created_at: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string;
  type: string;
  created_at?: string;
}

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

  // Sertifikat CRUD
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [showCertForm, setShowCertForm] = useState(false);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [certTitle, setCertTitle] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certDate, setCertDate] = useState('');
  const [certImageUrl, setCertImageUrl] = useState('');
  const [certUrl, setCertUrl] = useState('');
  const [certSection, setCertSection] = useState('Lainnya');

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

  // Experience CRUD
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [showExpForm, setShowExpForm] = useState(false);
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [expTitle, setExpTitle] = useState('');
  const [expCompany, setExpCompany] = useState('');
  const [expLocation, setExpLocation] = useState('');
  const [expStartDate, setExpStartDate] = useState('');
  const [expEndDate, setExpEndDate] = useState('Present');
  const [expDescription, setExpDescription] = useState('');
  const [expType, setExpType] = useState('Kerja');

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
        });
      }

      // Load Portfolios
      const { data: ports } = await supabase.from('portfolios').select('*').order('created_at', { ascending: false });
      if (ports) setPortfolios(ports as Portfolio[]);

      // Load Certificates
      const { data: certs } = await supabase.from('certificates').select('*').order('date', { ascending: false });
      if (certs) setCertificates(certs as Certificate[]);

      // Load Experiences
      const { data: exps } = await supabase.from('experiences').select('*').order('created_at', { ascending: false });
      if (exps) setExperiences(exps as Experience[]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void,
    folder = 'covers'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const processedFile = await convertToWebP(file);
      const formData = new FormData();
      formData.append('file', processedFile);
      formData.append('folder', folder);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Upload gagal');
      }
      const { publicUrl } = await res.json();
      setter(publicUrl);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal upload file');
    }
  };

  const handleCertFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true);
    try {
      const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
      let fileToUpload = file;
      let folder = 'documents';

      if (!isPdf) {
        fileToUpload = await convertToWebP(file);
        folder = 'content';
      }

      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('folder', folder);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Upload gagal');
      }
      const { publicUrl } = await res.json();
      setCertUrl(publicUrl);

      if (!isPdf) {
        setCertImageUrl(publicUrl);
      }
      
      setFeedback({ type: 'success', msg: 'File sertifikat berhasil diunggah!' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal upload file');
    } finally {
      setSaving(false);
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

  // === Sertifikat handlers ===
  const resetCertForm = () => {
    setEditingCertId(null);
    setCertTitle(''); setCertIssuer(''); setCertDate('');
    setCertImageUrl(''); setCertUrl('');
    setCertSection('Lainnya');
    setShowCertForm(false);
  };

  const startEditCert = (c: Certificate) => {
    setEditingCertId(c.id);
    setCertTitle(c.title); setCertIssuer(c.issuer); setCertDate(c.date);
    setCertImageUrl(c.image_url); setCertUrl(c.cert_url);
    setCertSection(c.section || 'Lainnya');
    setShowCertForm(true);
  };

  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { 
        title: certTitle, 
        issuer: certIssuer, 
        date: certDate, 
        image_url: certImageUrl, 
        cert_url: certUrl,
        section: certSection || 'Lainnya'
      };
      if (editingCertId) {
        await supabase.from('certificates').update(payload).eq('id', editingCertId);
      } else {
        await supabase.from('certificates').insert([payload]);
      }
      await loadData();
      resetCertForm();
      setFeedback({ type: 'success', msg: 'Sertifikat berhasil disimpan!' });
      setTimeout(() => setFeedback(null), 3000);
    } catch { setFeedback({ type: 'error', msg: 'Gagal menyimpan sertifikat' }); }
    finally { setSaving(false); }
  };

  const handleDeleteCert = async (id: string) => {
    if (!confirm('Hapus sertifikat ini?')) return;
    await supabase.from('certificates').delete().eq('id', id);
    setCertificates(prev => prev.filter(c => c.id !== id));
  };

  // === Experience handlers ===
  const resetExpForm = () => {
    setEditingExpId(null);
    setExpTitle('');
    setExpCompany('');
    setExpLocation('');
    setExpStartDate('');
    setExpEndDate('Present');
    setExpDescription('');
    setExpType('Kerja');
    setShowExpForm(false);
  };

  const startEditExp = (e: Experience) => {
    setEditingExpId(e.id);
    setExpTitle(e.title);
    setExpCompany(e.company);
    setExpLocation(e.location || '');
    setExpStartDate(e.start_date);
    setExpEndDate(e.end_date || 'Present');
    setExpDescription(e.description || '');
    setExpType(e.type || 'Kerja');
    setShowExpForm(true);
  };

  const handleSaveExp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: expTitle,
        company: expCompany,
        location: expLocation,
        start_date: expStartDate,
        end_date: expEndDate,
        description: expDescription,
        type: expType,
      };
      if (editingExpId) {
        const { error } = await supabase.from('experiences').update(payload).eq('id', editingExpId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('experiences').insert([payload]);
        if (error) throw error;
      }
      await loadData();
      resetExpForm();
      setFeedback({ type: 'success', msg: 'Pengalaman berhasil disimpan!' });
      setTimeout(() => setFeedback(null), 3000);
    } catch {
      setFeedback({ type: 'error', msg: 'Gagal menyimpan pengalaman' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExp = async (id: string) => {
    if (!confirm('Hapus pengalaman ini?')) return;
    try {
      const { error } = await supabase.from('experiences').delete().eq('id', id);
      if (error) throw error;
      setExperiences(prev => prev.filter(e => e.id !== id));
      setFeedback({ type: 'success', msg: 'Pengalaman berhasil dihapus!' });
      setTimeout(() => setFeedback(null), 3000);
    } catch {
      setFeedback({ type: 'error', msg: 'Gagal menghapus pengalaman' });
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
          {feedback.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-xl mb-8 w-max admin-card">
        {([
          { id: 'profil', label: 'Profil', icon: User },
          { id: 'experience', label: 'Pengalaman', icon: Briefcase },
          { id: 'portofolio', label: 'Portofolio', icon: FolderDot },
          { id: 'sertifikat', label: 'Sertifikat', icon: Trophy },
          { id: 'konten', label: 'Konten', icon: FileText },
        ] as { id: Tab; label: string; icon: any }[]).map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 text-sm font-semibold rounded-lg capitalize transition-all inline-flex items-center gap-2 ${
                activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
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
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setProfileAvatar, 'avatars')} className="absolute inset-0 opacity-0 cursor-pointer" />
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

            <div className="pt-4 border-t border-gray-100">
              <label className="admin-label block text-sm font-semibold text-gray-700 mb-1">File CV (PDF)</label>
              <div className="flex gap-2 items-center">
                <input type="file" accept=".pdf" onChange={(e) => handleFileUpload(e, setProfileCV, 'documents')} className="text-xs" />
                {profileCV && <a href={profileCV} target="_blank" rel="noreferrer" className="text-xs text-blue-500 underline">Lihat CV</a>}
              </div>
              <p className="text-xs text-gray-400 mt-1 inline-flex items-center gap-1">
                Kelola koleksi sertifikat di tab <Trophy className="w-3.5 h-3.5 text-yellow-500" /> <strong>Sertifikat</strong>
              </p>
            </div>

            <button onClick={handleSaveProfile} disabled={saving} className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl mt-4">
              Simpan Profil
            </button>
          </div>
        )}

        {/* ===================== TAB EXPERIENCE ===================== */}
        {activeTab === 'experience' && (
          <div>
            {!showExpForm ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="admin-title text-xl font-bold">Daftar Pengalaman</h2>
                  <button onClick={() => setShowExpForm(true)} className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-bold">+ Tambah</button>
                </div>
                {experiences.length === 0 ? (
                  <p className="text-gray-500 italic">Belum ada pengalaman.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {experiences.map(e => (
                      <div key={e.id} className="border border-gray-100 p-4 rounded-xl flex flex-col justify-between bg-gray-50 admin-input animate-fade-in">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-gray-900">{e.title}</h3>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                              {e.type}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 font-semibold">{e.company} {e.location ? `· ${e.location}` : ''}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{e.start_date} — {e.end_date}</p>
                          {e.description && (
                            <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed whitespace-pre-line">{e.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2 mt-4 pt-2 border-t border-gray-200/50">
                          <button onClick={() => startEditExp(e)} className="text-blue-600 text-sm hover:underline">Edit</button>
                          <button onClick={() => handleDeleteExp(e.id)} className="text-red-500 text-sm hover:underline">Hapus</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <form onSubmit={handleSaveExp} className="space-y-4 max-w-2xl animate-fade-in">
                <h2 className="admin-title text-xl font-bold mb-6">{editingExpId ? 'Edit Pengalaman' : 'Tambah Pengalaman'}</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="admin-label block text-sm font-semibold mb-1">Judul / Posisi / Jurusan</label>
                    <input required value={expTitle} onChange={e => setExpTitle(e.target.value)} className="admin-input w-full px-4 py-2 border rounded-xl" placeholder="Misal: Full-Stack Developer / Teknik Informatika" />
                  </div>
                  <div>
                    <label className="admin-label block text-sm font-semibold mb-1">Kategori / Section</label>
                    <select value={expType} onChange={e => setExpType(e.target.value)} className="admin-input w-full px-4 py-2 border rounded-xl bg-white">
                      <option value="Kerja">Kerja</option>
                      <option value="Pendidikan">Pendidikan</option>
                      <option value="Volunteers">Volunteers</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="admin-label block text-sm font-semibold mb-1">Perusahaan / Institusi / Organisasi</label>
                    <input required value={expCompany} onChange={e => setExpCompany(e.target.value)} className="admin-input w-full px-4 py-2 border rounded-xl" placeholder="Misal: PT Tech Solutions / Universitas Trunojoyo" />
                  </div>
                  <div>
                    <label className="admin-label block text-sm font-semibold mb-1">Lokasi (opsional)</label>
                    <input value={expLocation} onChange={e => setExpLocation(e.target.value)} className="admin-input w-full px-4 py-2 border rounded-xl" placeholder="Misal: Jakarta / Remote" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="admin-label block text-sm font-semibold mb-1">Bulan Mulai</label>
                    <input required type="month" value={expStartDate} onChange={e => setExpStartDate(e.target.value)} className="admin-input w-full px-4 py-2 border rounded-xl" />
                  </div>
                  <div>
                    <label className="admin-label block text-sm font-semibold mb-1">Bulan Selesai (atau 'Present')</label>
                    <input required value={expEndDate} onChange={e => setExpEndDate(e.target.value)} className="admin-input w-full px-4 py-2 border rounded-xl" placeholder="Misal: 2024-09 atau Present" />
                  </div>
                </div>

                <div>
                  <label className="admin-label block text-sm font-semibold mb-1">Deskripsi / Detail Kegiatan</label>
                  <textarea rows={4} value={expDescription} onChange={e => setExpDescription(e.target.value)} className="admin-textarea w-full px-4 py-2 border rounded-xl" placeholder="Tuliskan tugas, pencapaian, atau apa yang dipelajari..." />
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" disabled={saving} className="px-6 py-2 bg-blue-500 text-white rounded-xl font-bold">Simpan</button>
                  <button type="button" onClick={resetExpForm} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-xl font-bold">Batal</button>
                </div>
              </form>
            )}
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

        {/* ===================== TAB SERTIFIKAT ===================== */}
        {activeTab === 'sertifikat' && (
          <div>
            {!showCertForm ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="admin-title text-xl font-bold">Koleksi Sertifikat</h2>
                    <p className="text-xs text-gray-400 mt-1">Ditampilkan di halaman <a href="/about" target="_blank" className="text-blue-500 underline">/about</a></p>
                  </div>
                  <button onClick={() => setShowCertForm(true)} className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-bold">+ Tambah</button>
                </div>
                {certificates.length === 0 ? (
                  <div className="py-12 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
                    <Trophy className="w-8 h-8 mx-auto mb-2 text-gray-300 animate-pulse" />
                    <p className="font-semibold">Belum ada sertifikat.</p>
                    <p className="text-sm">Klik &quot;+ Tambah&quot; untuk menambahkan.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {certificates.map(c => (
                      <div key={c.id} className="border border-gray-100 rounded-xl p-4 flex gap-3 bg-gray-50">
                        {c.image_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={c.image_url} alt={c.title} className="w-16 h-16 object-cover rounded-lg shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-sm truncate">{c.title}</h3>
                          <p className="text-xs text-gray-500">
                            {c.issuer} · {c.date}
                            <span className="ml-2 inline-block px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold tracking-wide uppercase">
                              {c.section || 'Lainnya'}
                            </span>
                          </p>
                          {c.cert_url && <a href={c.cert_url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 underline">Lihat Sertifikat</a>}
                          <div className="flex gap-2 mt-2">
                            <button onClick={() => startEditCert(c)} className="text-blue-600 text-xs hover:underline">Edit</button>
                            <button onClick={() => handleDeleteCert(c.id)} className="text-red-500 text-xs hover:underline">Hapus</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <form onSubmit={handleSaveCert} className="space-y-4 max-w-xl">
                <h2 className="admin-title text-xl font-bold mb-4">{editingCertId ? 'Edit Sertifikat' : 'Tambah Sertifikat'}</h2>
                <div>
                  <label className="admin-label block text-sm font-semibold mb-1">Judul Sertifikat</label>
                  <input required value={certTitle} onChange={e => setCertTitle(e.target.value)} className="admin-input w-full px-4 py-2 border rounded-xl" placeholder="Misal: AWS Cloud Practitioner" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="admin-label block text-sm font-semibold mb-1">Penerbit / Issuer</label>
                    <input required value={certIssuer} onChange={e => setCertIssuer(e.target.value)} className="admin-input w-full px-4 py-2 border rounded-xl" placeholder="Misal: Amazon" />
                  </div>
                  <div>
                    <label className="admin-label block text-sm font-semibold mb-1">Tanggal</label>
                    <input type="month" value={certDate} onChange={e => setCertDate(e.target.value)} className="admin-input w-full px-4 py-2 border rounded-xl" />
                  </div>
                </div>
                <div>
                  <label className="admin-label block text-sm font-semibold mb-1">Kategori / Section (Folder)</label>
                  <input 
                    required 
                    value={certSection} 
                    onChange={e => setCertSection(e.target.value)} 
                    className="admin-input w-full px-4 py-2 border rounded-xl" 
                    placeholder="Ketik atau pilih kategori..."
                    list="cert-sections"
                  />
                  <datalist id="cert-sections">
                    <option value="Dicoding" />
                    <option value="Canva" />
                    <option value="Coursera" />
                    <option value="Dibimbing" />
                    <option value="Linkedin Learning" />
                    <option value="Mereka-Microsoft-AI_for_My_Future" />
                    <option value="Mereka-Microsoft-Edukator-Elevate" />
                    <option value="Universitas Trunojoyo Madura" />
                    <option value="Lainnya" />
                  </datalist>
                </div>
                <div>
                  <label className="admin-label block text-sm font-semibold mb-1">Upload File Sertifikat (PDF / Gambar)</label>
                  <input 
                    type="file" 
                    accept=".pdf,image/*" 
                    onChange={handleCertFileUpload} 
                    className="text-xs mb-2 w-full p-2 border border-dashed rounded-xl bg-gray-50 cursor-pointer" 
                  />
                  <p className="text-[10px] text-gray-400">PDF asli atau Gambar (otomatis jadi WebP). Jika mengunggah gambar, gambar pratayang akan otomatis diisi.</p>
                </div>
                <div>
                  <label className="admin-label block text-sm font-semibold mb-1">Gambar Pratayang / Thumbnail (opsional)</label>
                  <input type="file" accept="image/*" onChange={e => handleFileUpload(e, setCertImageUrl, 'content')} className="text-xs mb-2" />
                  {certImageUrl && <img src={certImageUrl} alt="preview" className="h-24 rounded-lg border object-cover" />}
                </div>
                <div>
                  <label className="admin-label block text-sm font-semibold mb-1">Link Sertifikat (PDF / URL)</label>
                  <input type="url" value={certUrl} onChange={e => setCertUrl(e.target.value)} className="admin-input w-full px-4 py-2 border rounded-xl" placeholder="https://..." />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving} className="px-6 py-2 bg-blue-500 text-white rounded-xl font-bold">Simpan</button>
                  <button type="button" onClick={resetCertForm} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-xl font-bold">Batal</button>
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
