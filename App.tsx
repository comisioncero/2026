
import React, { useState } from 'react';
import { AppView, GeneratedContent, UserGoal } from './types';
import { GOALS, BRAND_STORY } from './constants';
import { generateNeuroCaption, generateNeuralImage } from './services/geminiService';
import NeuralBackground from './components/NeuralBackground';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [userName, setUserName] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<UserGoal | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleStartGeneration = async () => {
    if (!userName || !selectedGoal) return;
    
    setIsGenerating(true);
    setView(AppView.AI_GENERATOR);
    
    try {
      const content = await generateNeuroCaption(selectedGoal.label, userName);
      setGeneratedContent(content);
      
      const imageUrl = await generateNeuralImage(content.suggestedVisual);
      setGeneratedImageUrl(imageUrl);
      
      setView(AppView.AD_PREVIEW);
    } catch (error) {
      alert("Hubo un error al sincronizar con tu biología artificial. Por favor, intenta de nuevo.");
      setView(AppView.LANDING);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadManifestoAsText = () => {
    if (!generatedContent) return;
    const element = document.createElement("a");
    const fileContent = `
MANIFIESTO NEURO-2026 | VIRGINIA GUDINO
---------------------------------------
Para: ${userName}
Objetivo: ${selectedGoal?.label}

${generatedContent.headline.toUpperCase()}

${generatedContent.primaryText}

${generatedContent.hashtags.join(' ')}

Descubre más en: https://virginiagudino.com
Sincronizado con inteligencia biológica.
    `;
    const file = new Blob([fileContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Manifiesto_Neuro2026_${userName}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShare = async () => {
    if (navigator.share && generatedContent) {
      try {
        await navigator.share({
          title: 'Mi Manifiesto Neuro-2026',
          text: `${generatedContent.headline}\n\n${generatedContent.primaryText}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Compartir cancelado o no soportado');
      }
    } else {
      downloadManifestoAsText();
    }
  };

  const renderLanding = () => (
    <div className="max-w-4xl mx-auto px-6 pt-20 pb-12 flex flex-col items-center text-center animate-fade-in">
      <div className="mb-8">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 glow-gold leading-tight">
          Brinda por un 2026 <br/> <span className="text-blue-500 italic">desde tu raíz</span>
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed italic">
          "{BRAND_STORY.headline}"
        </p>
      </div>

      <div className="w-full bg-slate-900/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-2xl mb-12">
        <h3 className="text-2xl font-serif mb-6">Inicia tu Personalización</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="text-left">
            <label className="block text-sm text-slate-400 mb-2 font-medium">¿Cómo te llamas?</label>
            <input 
              type="text" 
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Escribe tu nombre..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all"
            />
          </div>
          <div className="text-left">
            <label className="block text-sm text-slate-400 mb-2 font-medium">Tu objetivo neuro-biológico</label>
            <select 
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition-all appearance-none cursor-pointer"
              onChange={(e) => {
                const goal = GOALS.find(g => g.id === e.target.value);
                if (goal) setSelectedGoal(goal);
              }}
            >
              <option value="">Selecciona un camino...</option>
              {GOALS.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
            </select>
          </div>
        </div>
        
        <button 
          onClick={handleStartGeneration}
          disabled={!userName || !selectedGoal}
          className={`px-8 py-4 rounded-full text-lg font-bold tracking-wide transition-all ${
            !userName || !selectedGoal 
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed shadow-inner' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95'
          }`}
        >
          Sincronizar mi 2026 <i className="fa-solid fa-bolt-lightning ml-2"></i>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        <div className="p-6 bg-slate-900/30 rounded-2xl border border-slate-800/50 hover:bg-slate-900/50 transition-colors">
          <i className="fa-solid fa-microscope text-blue-400 text-2xl mb-4"></i>
          <h4 className="text-lg font-bold mb-2">Ciencia y Conciencia</h4>
          <p className="text-sm text-slate-400 leading-relaxed">Optimización basada en la neurobiología del rendimiento humano.</p>
        </div>
        <div className="p-6 bg-slate-900/30 rounded-2xl border border-slate-800/50 hover:bg-slate-900/50 transition-colors">
          <i className="fa-solid fa-brain text-gold text-2xl mb-4"></i>
          <h4 className="text-lg font-bold mb-2">Simplicidad Poderosa</h4>
          <p className="text-sm text-slate-400 leading-relaxed">Lograr más con menos desgaste, transformando tu energía vital.</p>
        </div>
        <div className="p-6 bg-slate-900/30 rounded-2xl border border-slate-800/50 hover:bg-slate-900/50 transition-colors">
          <i className="fa-solid fa-infinity text-indigo-400 text-2xl mb-4"></i>
          <h4 className="text-lg font-bold mb-2">Ecosistema Biológico</h4>
          <p className="text-sm text-slate-400 leading-relaxed">Sinergia real entre tu biología y la tecnología del futuro.</p>
        </div>
      </div>
    </div>
  );

  const renderLoader = () => (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-pulse">
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <i className="fa-solid fa-dna text-3xl text-blue-400 animate-bounce"></i>
        </div>
      </div>
      <h2 className="text-3xl font-serif mb-4 text-white">Configurando tu neuro-transmisión...</h2>
      <p className="text-slate-400 max-w-md italic text-lg">
        "El nuevo año es una página en blanco para tu neurobiología."
      </p>
      <div className="mt-8 text-blue-500/50 text-xs tracking-widest uppercase">
        Sincronizando con Virginia Gudino
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="max-w-6xl mx-auto px-6 py-12 animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Ad Mockup */}
        <div className="lg:w-1/2 no-print">
          <div className="sticky top-24">
             <div className="bg-white rounded-3xl overflow-hidden shadow-2xl aspect-square relative group">
                <img 
                  src={generatedImageUrl || "https://picsum.photos/1080/1080?blue"} 
                  className="w-full h-full object-cover" 
                  alt="Neuro-2026 Visual"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                  <h2 className="text-3xl font-bold text-white mb-2 leading-tight">
                    {generatedContent?.headline}
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold border border-white/20">VG</div>
                    <span className="text-white/80 text-sm font-medium">virginiagudino.com</span>
                  </div>
                </div>
                <div className="absolute top-6 right-6">
                  <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white text-xs font-bold uppercase tracking-widest shadow-lg">
                    Brindis 2026
                  </div>
                </div>
             </div>
             <div className="mt-6 flex justify-center gap-4">
               <button 
                 onClick={handleShare}
                 className="bg-slate-800 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-slate-700 transition-all flex items-center gap-2"
                >
                 <i className="fa-solid fa-share-nodes"></i> Compartir
               </button>
               <button 
                 onClick={downloadManifestoAsText}
                 className="bg-slate-800 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-slate-700 transition-all flex items-center gap-2"
                >
                 <i className="fa-solid fa-file-arrow-down"></i> Descargar TXT
               </button>
             </div>
          </div>
        </div>

        {/* Content Details */}
        <div className="lg:w-1/2 flex flex-col gap-8">
          <div className="manifesto-card bg-slate-900/50 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-slate-800 shadow-xl transition-all hover:border-slate-700">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-1">Manifiesto Personalizado</h4>
                <h3 className="text-3xl font-serif text-gold leading-tight">Para: {userName}</h3>
              </div>
              <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center">
                <i className="fa-solid fa-feather-pointed text-gold"></i>
              </div>
            </div>
            
            <div className="mb-10">
              <h4 className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-4 pb-2 border-b border-blue-500/20">Propósito 2026</h4>
              <p className="text-xl md:text-2xl text-slate-100 leading-relaxed font-serif italic mb-6">
                "{generatedContent?.headline}"
              </p>
              <p className="text-lg text-slate-300 leading-relaxed whitespace-pre-line font-light">
                {generatedContent?.primaryText}
              </p>
            </div>

            <div className="mb-10 no-print">
              <h4 className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-3">Sinergia Neurobiológica</h4>
              <div className="flex flex-wrap gap-2">
                {generatedContent?.hashtags.map((tag, idx) => (
                  <span key={idx} className="bg-slate-800 text-blue-400 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/10">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 no-print">
              <button 
                onClick={() => window.print()}
                className="flex-1 bg-white text-slate-900 font-bold py-4 rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95"
              >
                <i className="fa-solid fa-file-pdf"></i> Guardar como PDF
              </button>
              <button 
                onClick={() => setView(AppView.LANDING)}
                className="flex-1 bg-slate-800 text-white font-bold py-4 rounded-xl hover:bg-slate-700 transition-all flex items-center justify-center gap-2 border border-slate-700 active:scale-95"
              >
                <i className="fa-solid fa-rotate-right"></i> Nueva Optimización
              </button>
            </div>

            {/* Print Footer */}
            <div className="print-only mt-20 pt-10 border-t border-slate-200 text-center">
               <p className="text-sm font-serif italic text-slate-800">Un brindis por un desempeño con conciencia.</p>
               <p className="text-xs text-slate-500 mt-2">Sincronizado digitalmente en virginiagudino.com</p>
            </div>
          </div>

          <div className="bg-blue-900/10 p-8 rounded-3xl border border-blue-800/20 no-print">
            <h4 className="font-bold text-blue-300 mb-2 flex items-center gap-2">
              <i className="fa-solid fa-circle-info"></i> Próximo paso biológico:
            </h4>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Has iniciado el proceso de reconexión. Para una gestión que vaya a la raíz y optimice tu rendimiento en 2026, agenda una sesión de diagnóstico neuro-productivo con Virginia.
            </p>
            <a 
              href="https://virginiagudino.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-blue-600/20 text-blue-400 border border-blue-500/30 px-6 py-3 rounded-full font-bold hover:bg-blue-600 hover:text-white transition-all text-sm gap-2"
            >
              Visitar Ecosistema Virginia Gudino <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <NeuralBackground />

      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 no-print">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setView(AppView.LANDING)}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center font-bold text-white group-hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all">V</div>
            <span className="font-serif text-lg tracking-wider hidden sm:block">Virginia Gudino</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-8 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400">
            <a href="https://virginiagudino.com" className="hover:text-blue-400 transition-colors hidden md:block">Servicios</a>
            <a href="https://virginiagudino.com" className="hover:text-blue-400 transition-colors hidden md:block">Neuro-Blog</a>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-all shadow-lg active:scale-95">
              Contacto
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-16">
        {view === AppView.LANDING && renderLanding()}
        {view === AppView.AI_GENERATOR && renderLoader()}
        {view === AppView.AD_PREVIEW && renderPreview()}
      </main>

      <footer className="relative z-10 bg-slate-950/50 border-t border-slate-800/50 py-12 mt-20 no-print">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h4 className="font-serif text-2xl mb-2 italic">Virginia Gudino</h4>
            <p className="text-slate-500 text-sm">Gestión neurocientífica del rendimiento & Optimización biológica.</p>
          </div>
          <div className="flex gap-6 text-xl text-slate-400">
            <a href="#" className="hover:text-blue-400 transition-colors"><i className="fa-brands fa-instagram"></i></a>
            <a href="#" className="hover:text-blue-400 transition-colors"><i className="fa-brands fa-linkedin"></i></a>
            <a href="#" className="hover:text-blue-400 transition-colors"><i className="fa-brands fa-facebook"></i></a>
          </div>
          <div className="text-center md:text-right">
            <p className="text-slate-500 text-xs">© 2026 — Un brindis por un desempeño con conciencia.</p>
            <p className="text-slate-600 text-[10px] uppercase tracking-tighter mt-1">Con ciencia y conciencia</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
