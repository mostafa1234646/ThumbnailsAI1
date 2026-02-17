import React, { useState, useRef, ChangeEvent } from 'react';
import { Upload, Wand2, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import Header from './components/Header';
import Button from './components/Button';
import Input from './components/Input';
import ThumbnailCard from './components/ThumbnailCard';
import Pricing from './components/Pricing';
import Checkout from './components/Checkout';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { generateThumbnails } from './services/gemini';
import { ThumbnailStyle, GenerationRequest } from './types';

type ViewState = 'home' | 'pricing' | 'checkout' | 'admin-login' | 'admin-dashboard';

function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<ViewState>('home');

  // Generator State
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<ThumbnailStyle>(ThumbnailStyle.MR_BEAST);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Image Upload State
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<{ base64: string, mimeType: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handlers
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    // Validate size (max 5MB approx)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image is too large. Please upload an image under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPreviewUrl(result);
      setImageFile({
        base64: result,
        mimeType: file.type
      });
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setPreviewUrl(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerate = async () => {
    if (!title.trim()) {
      setError("Please enter a video title");
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const request: GenerationRequest = {
        title,
        prompt: prompt || title, // Use title as fallback prompt
        style,
        referenceImage: imageFile?.base64,
        referenceImageMimeType: imageFile?.mimeType
      };

      const generatedImages = await generateThumbnails(request, 3);
      setResults(generatedImages);
    } catch (err: any) {
      console.error(err);
      setError("Failed to generate thumbnails. " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'admin-login':
        return (
          <AdminLogin 
            onLogin={() => setCurrentView('admin-dashboard')} 
            onBack={() => setCurrentView('home')} 
          />
        );
      case 'admin-dashboard':
        return <AdminDashboard onLogout={() => setCurrentView('home')} />;
      case 'checkout':
        return (
          <Checkout 
            onBack={() => setCurrentView('pricing')} 
            onSuccess={() => setCurrentView('home')} 
          />
        );
      case 'pricing':
        return <Pricing onCheckout={() => setCurrentView('checkout')} />;
      case 'home':
      default:
        return (
          <main className="max-w-7xl mx-auto px-4 py-8 lg:py-12 animate-[fadeIn_0.5s_ease-out]">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Left Column: Controls */}
              <div className="lg:col-span-4 space-y-8">
                <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 shadow-xl backdrop-blur-sm">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 rounded-full bg-indigo-500 block"></span>
                    Configuration
                  </h2>

                  <div className="space-y-6">
                    {/* Title Input */}
                    <Input 
                      label="Video Title" 
                      placeholder="e.g. I Spent 24 Hours in a Bunker" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />

                    {/* Additional Prompt */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300 ml-1">
                        Additional Details (Optional)
                      </label>
                      <textarea
                        className="w-full bg-slate-800/50 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-500 resize-none h-24 custom-scrollbar"
                        placeholder="Describe specific elements, colors, or emotions..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                      />
                    </div>

                    {/* Style Selector */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300 ml-1">
                        Thumbnail Style
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.values(ThumbnailStyle).map((s) => (
                          <button
                            key={s}
                            onClick={() => setStyle(s)}
                            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                              style === s
                                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Face Upload */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300 ml-1 flex justify-between">
                        <span>Face Reference (Optional)</span>
                        <span className="text-xs text-slate-500 font-normal">Your face in the thumbnail</span>
                      </label>
                      
                      {!previewUrl ? (
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all group"
                        >
                          <div className="p-3 bg-slate-800 rounded-full group-hover:bg-slate-700 transition-colors">
                            <Upload className="text-slate-400 group-hover:text-indigo-400 transition-colors" size={20} />
                          </div>
                          <p className="text-sm text-slate-400 group-hover:text-slate-300">Click to upload photo</p>
                        </div>
                      ) : (
                        <div className="relative rounded-xl overflow-hidden border border-slate-700 group">
                          <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                          <button 
                            onClick={clearImage}
                            className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-red-500/80 transition-colors backdrop-blur-sm"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                        {error}
                      </div>
                    )}

                    {/* Generate Button */}
                    <Button 
                      className="w-full py-4 text-lg" 
                      onClick={handleGenerate}
                      isLoading={loading}
                      icon={<Wand2 size={20} />}
                    >
                      {loading ? 'Generating Magic...' : 'Generate Thumbnails'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Column: Results */}
              <div className="lg:col-span-8">
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <span className="w-1 h-6 rounded-full bg-indigo-500 block"></span>
                      Results
                    </h2>
                    {results.length > 0 && (
                      <span className="text-sm text-slate-400">
                        Generated 3 variations based on {style} style
                      </span>
                    )}
                  </div>

                  {results.length === 0 && !loading ? (
                    <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center bg-slate-900/30 rounded-2xl border-2 border-dashed border-slate-800 text-slate-500">
                      <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <ImageIcon size={32} className="opacity-50" />
                      </div>
                      <p className="text-lg font-medium">No thumbnails yet</p>
                      <p className="text-sm opacity-60">Fill out the form and hit generate to start</p>
                    </div>
                  ) : loading ? (
                     <div className="flex-1 min-h-[400px] grid md:grid-cols-2 gap-6">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="aspect-video bg-slate-800/50 rounded-xl animate-pulse border border-slate-700/50 flex items-center justify-center relative overflow-hidden">
                             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-700/10 to-transparent animate-[shimmer_2s_infinite] -translate-x-full" style={{ animationDelay: `${i * 0.2}s`}}></div>
                             <Loader2 className="animate-spin text-slate-600" />
                          </div>
                        ))}
                     </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6 animate-[fadeIn_0.5s_ease-out]">
                      {results.map((url, index) => (
                        <ThumbnailCard key={index} imageUrl={url} index={index} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        );
    }
  };

  // If we are in Admin mode (login or dashboard), render without the standard header/footer layout structure
  if (currentView === 'admin-login' || currentView === 'admin-dashboard') {
    return renderContent();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 flex flex-col">
      <Header 
        currentView={currentView === 'checkout' ? 'pricing' : (currentView as 'home' | 'pricing')} 
        onNavigate={(view) => setCurrentView(view)} 
      />
      
      {renderContent()}

      {/* Footer with Secret Admin Link */}
      <footer className="w-full py-8 border-t border-slate-900 mt-auto bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-slate-600 text-sm">
           <p>© 2024 ThumbGen AI. All rights reserved.</p>
           <div className="flex gap-4 items-center">
              <span>Terms</span>
              <span>Privacy</span>
              <button 
                onClick={() => setCurrentView('admin-login')}
                className="opacity-10 hover:opacity-100 transition-opacity text-xs"
              >
                Admin
              </button>
           </div>
        </div>
      </footer>
    </div>
  );
}

export default App;