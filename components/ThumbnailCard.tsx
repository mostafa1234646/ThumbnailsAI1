import React from 'react';
import { Download, Maximize2 } from 'lucide-react';

interface ThumbnailCardProps {
  imageUrl: string;
  index: number;
}

const ThumbnailCard: React.FC<ThumbnailCardProps> = ({ imageUrl, index }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `thumbnail-generated-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="group relative w-full aspect-video rounded-xl overflow-hidden bg-slate-800 border border-slate-700 shadow-xl transition-all duration-300 hover:shadow-indigo-500/20 hover:border-indigo-500/50">
      <img 
        src={imageUrl} 
        alt={`Generated Thumbnail ${index + 1}`} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      
      {/* Overlay Actions */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4 backdrop-blur-sm">
        <button 
          onClick={handleDownload}
          className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all transform hover:scale-110 border border-white/10"
          title="Download"
        >
          <Download size={20} />
        </button>
        <button 
          onClick={() => window.open(imageUrl, '_blank')}
          className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all transform hover:scale-110 border border-white/10"
          title="View Full Size"
        >
          <Maximize2 size={20} />
        </button>
      </div>
      
      <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 rounded text-xs text-white font-medium border border-white/10">
        Var {index + 1}
      </div>
    </div>
  );
};

export default ThumbnailCard;