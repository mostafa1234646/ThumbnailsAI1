import React from 'react';
import { Check, Sparkles, Zap, Shield, Crown } from 'lucide-react';
import Button from './Button';

interface PricingProps {
  onCheckout: () => void;
}

const Pricing: React.FC<PricingProps> = ({ onCheckout }) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 animate-[fadeIn_0.5s_ease-out]">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-3xl md:text-5xl font-bold text-white">
          Simple, Transparent <span className="text-indigo-500">Pricing</span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Start generating viral thumbnails for free, or upgrade for professional API access and ultra-realistic output.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Free Plan */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 flex flex-col hover:border-slate-700 transition-all duration-300">
          <div className="mb-8">
            <h3 className="text-xl font-medium text-slate-300 mb-2">Starter</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">$0</span>
              <span className="text-slate-500">/month</span>
            </div>
            <p className="text-slate-400 mt-4 text-sm">Perfect for new creators just starting their journey.</p>
          </div>

          <div className="flex-1 space-y-4 mb-8">
            <Feature text="Standard Quality Thumbnails" />
            <Feature text="3 Daily Generations" />
            <Feature text="Basic Styles (Vlog, Gaming)" />
            <Feature text="Standard Support" />
            <Feature text="Community Access" />
          </div>

          <Button variant="secondary" className="w-full">
            Get Started Free
          </Button>
        </div>

        {/* Pro Plan */}
        <div className="relative bg-slate-900/80 border border-indigo-500/50 rounded-3xl p-8 flex flex-col shadow-2xl shadow-indigo-500/10 scale-105 z-10">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1">
            <Crown size={12} />
            Most Popular
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-medium text-indigo-400 mb-2 flex items-center gap-2">
              Pro Creator <Sparkles size={16} />
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">$10</span>
              <span className="text-slate-500">/month</span>
            </div>
            <p className="text-slate-400 mt-4 text-sm">For professional YouTubers who need viral results.</p>
          </div>

          <div className="flex-1 space-y-4 mb-8">
            <Feature text="Ultra-Realistic 8K Output" highlighted />
            <Feature text="Unlimited Generations" highlighted />
            <Feature text="Full API Access" highlighted />
            <Feature text="All Premium Styles" />
            <Feature text="No Watermarks" />
            <Feature text="Priority 24/7 Support" />
          </div>

          <Button variant="primary" className="w-full" onClick={onCheckout}>
            Upgrade to Pro
          </Button>
        </div>
      </div>

      <div className="mt-20 grid md:grid-cols-3 gap-8 text-center">
        <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800/50">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-indigo-400">
            <Zap size={24} />
          </div>
          <h4 className="text-white font-semibold mb-2">Fast Generation</h4>
          <p className="text-sm text-slate-400">Get your thumbnails in seconds, not minutes.</p>
        </div>
        <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800/50">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-indigo-400">
            <Shield size={24} />
          </div>
          <h4 className="text-white font-semibold mb-2">Commercial Rights</h4>
          <p className="text-sm text-slate-400">Own 100% of every thumbnail you generate.</p>
        </div>
        <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800/50">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-indigo-400">
            <Crown size={24} />
          </div>
          <h4 className="text-white font-semibold mb-2">Viral Styles</h4>
          <p className="text-sm text-slate-400">Trained on the best performing videos on YouTube.</p>
        </div>
      </div>
    </div>
  );
};

const Feature = ({ text, highlighted = false }: { text: string; highlighted?: boolean }) => (
  <div className="flex items-center gap-3">
    <div className={`p-1 rounded-full ${highlighted ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-400'}`}>
      <Check size={14} />
    </div>
    <span className={`text-sm ${highlighted ? 'text-white font-medium' : 'text-slate-300'}`}>{text}</span>
  </div>
);

export default Pricing;