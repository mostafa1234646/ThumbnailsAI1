import React, { useState, useEffect, useRef } from 'react';
import { Smartphone, Check, ArrowLeft, ShieldCheck, Copy, Upload, RefreshCw, X, FileText, AlertCircle } from 'lucide-react';
import Button from './Button';
import Input from './Input';

interface CheckoutProps {
  onBack: () => void;
  onSuccess: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onBack, onSuccess }) => {
  const [step, setStep] = useState<'payment' | 'success'>('payment');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Exchange Rate State
  const [exchangeRate, setExchangeRate] = useState<number>(50); // Fallback default
  const [rateLoading, setRateLoading] = useState(true);

  // Form State
  const [phone, setPhone] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [receipt, setReceipt] = useState<File | null>(null);
  
  // Validation Errors
  const [errors, setErrors] = useState<{phone?: string; tid?: string; receipt?: string}>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const VODAFONE_NUMBER = "01097439804";
  const PLAN_PRICE_USD = 10;

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        if (data && data.rates && data.rates.EGP) {
          setExchangeRate(data.rates.EGP);
        }
      } catch (error) {
        console.error('Failed to fetch exchange rate:', error);
      } finally {
        setRateLoading(false);
      }
    };

    fetchExchangeRate();
  }, []);

  const egpTotal = Math.ceil(PLAN_PRICE_USD * exchangeRate);

  const handleCopy = () => {
    navigator.clipboard.writeText(VODAFONE_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Basic validation for file type and size (max 5MB)
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, receipt: "Please upload an image file (JPG, PNG)" }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, receipt: "Image size must be less than 5MB" }));
        return;
      }
      
      setReceipt(file);
      setErrors(prev => ({ ...prev, receipt: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: {phone?: string; tid?: string; receipt?: string} = {};
    let isValid = true;

    // Validate Egyptian Phone Number
    const phoneRegex = /^01[0125][0-9]{8}$/;
    if (!phone) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = "Please enter a valid 11-digit Vodafone Cash number";
      isValid = false;
    }

    // Validate Transaction ID (Assuming simplified check for length)
    if (!transactionId) {
      newErrors.tid = "Transaction ID is required";
      isValid = false;
    } else if (transactionId.length < 6) {
      newErrors.tid = "Please enter a valid Transaction ID";
      isValid = false;
    }

    // Validate Receipt
    if (!receipt) {
      newErrors.receipt = "Payment receipt screenshot is required for verification";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simulate constructing FormData for a real API call
      const formData = new FormData();
      formData.append('wallet_number', phone);
      formData.append('transaction_id', transactionId);
      formData.append('amount', egpTotal.toString());
      if (receipt) {
        formData.append('receipt_image', receipt);
      }

      // Simulate API Network Request delay
      // In a real app: await fetch('/api/payments/verify', { method: 'POST', body: formData });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStep('success');
    } catch (error) {
      console.error("Payment submission error", error);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 animate-[fadeIn_0.5s_ease-out]">
        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6 text-green-500 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
          <Check size={48} />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Request Submitted Successfully</h2>
        <p className="text-slate-400 max-w-md mb-8">
          Our team is verifying your transaction. Your account will be upgraded to <strong className="text-indigo-400">Pro Creator</strong> status automatically within 24 hours.
        </p>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-8 text-left max-w-sm w-full">
            <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500">Transaction ID:</span>
                <span className="text-white font-mono">{transactionId}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-slate-500">Status:</span>
                <span className="text-yellow-500 flex items-center gap-1"><RefreshCw size={12} className="animate-spin" /> Pending Verification</span>
            </div>
        </div>
        <Button onClick={onSuccess}>Return to Home</Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12 animate-[fadeIn_0.5s_ease-out]">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={18} />
        Back to Pricing
      </button>

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Payment Form */}
        <div className="lg:col-span-8">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1 h-6 rounded-full bg-red-600 block"></span>
              Vodafone Cash Payment
            </h2>

            <div className="bg-gradient-to-br from-red-900/20 to-slate-900 border border-red-500/20 rounded-xl p-6 mb-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Smartphone size={100} />
               </div>
               
               <p className="text-slate-300 text-sm mb-2">Send <strong className="text-white text-lg">{egpTotal} EGP</strong> to the following wallet:</p>
               <div className="flex items-center gap-4 bg-slate-950/50 p-4 rounded-lg border border-red-500/10 max-w-md">
                 <div className="p-2 bg-red-600 rounded-lg text-white">
                    <Smartphone size={24} />
                 </div>
                 <div className="flex-1">
                   <p className="text-xs text-slate-400">Vodafone Cash Number</p>
                   <p className="text-xl font-mono font-bold text-white tracking-wider">
                     {VODAFONE_NUMBER.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3')}
                   </p>
                 </div>
                 <button 
                   onClick={handleCopy}
                   className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white relative"
                   title="Copy Number"
                 >
                   {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                 </button>
               </div>
               <p className="mt-4 text-xs text-slate-500 flex items-center gap-1">
                 <ShieldCheck size={12} />
                 Official Business Account
               </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                 <Input 
                   label="Your Wallet Number"
                   placeholder="010 xxxx xxxx"
                   required
                   value={phone}
                   onChange={(e) => setPhone(e.target.value)}
                   error={errors.phone}
                 />
                 <Input 
                   label="Transaction ID (from SMS)"
                   placeholder="e.g. 12345678"
                   required
                   value={transactionId}
                   onChange={(e) => setTransactionId(e.target.value)}
                   error={errors.tid}
                 />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1 flex items-center justify-between">
                    <span>Upload Payment Receipt <span className="text-red-500">*</span></span>
                    <span className="text-xs text-slate-500">Screenshot of success SMS or app</span>
                </label>
                
                {!receipt ? (
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group ${
                            errors.receipt 
                                ? 'border-red-500/50 bg-red-500/5' 
                                : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/50'
                        }`}
                    >
                        <Upload size={24} className={errors.receipt ? 'text-red-400' : 'text-slate-400 group-hover:text-white'} />
                        <span className={`text-sm ${errors.receipt ? 'text-red-400' : 'text-slate-400 group-hover:text-white'}`}>
                            Click to upload screenshot
                        </span>
                    </div>
                ) : (
                    <div className="border border-slate-700 bg-slate-800/50 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                                <FileText size={20} />
                            </div>
                            <div>
                                <p className="text-sm text-white font-medium truncate max-w-[200px]">{receipt.name}</p>
                                <p className="text-xs text-slate-500">{(receipt.size / 1024).toFixed(1)} KB</p>
                            </div>
                        </div>
                        <button 
                            type="button"
                            onClick={() => setReceipt(null)}
                            className="p-2 hover:bg-red-500/20 hover:text-red-400 text-slate-400 rounded-lg transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}
                
                {errors.receipt && (
                    <div className="flex items-center gap-2 text-red-400 text-xs mt-1 ml-1">
                        <AlertCircle size={12} />
                        <span>{errors.receipt}</span>
                    </div>
                )}
                
                <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />
              </div>

              <div className="pt-4">
                 <Button 
                   type="submit" 
                   className="w-full py-4 text-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-lg shadow-red-900/20 border-0"
                   isLoading={loading}
                 >
                   Submit Payment Verification
                 </Button>
                 <p className="text-center text-xs text-slate-500 mt-4">
                   Your payment details are secure. Falsifying payment proof may lead to account suspension.
                 </p>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-24">
            <h3 className="text-lg font-bold text-white mb-6">Order Summary</h3>
            
            <div className="flex items-start gap-4 mb-6 pb-6 border-b border-slate-800">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-inner">
                Pro
              </div>
              <div>
                <h4 className="font-bold text-white">Pro Creator Plan</h4>
                <p className="text-sm text-slate-400">Monthly Subscription</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Subtotal</span>
                <span className="text-white">${PLAN_PRICE_USD.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span className="text-slate-400">Exchange Rate</span>
                <div className="flex items-center gap-1 text-slate-300">
                  {rateLoading ? (
                    <RefreshCw size={12} className="animate-spin" />
                  ) : (
                    <span>1 USD ≈ {exchangeRate.toFixed(2)} EGP</span>
                  )}
                </div>
              </div>
              <div className="flex justify-between text-sm pt-3 border-t border-slate-800">
                <span className="text-white font-bold">Total (EGP)</span>
                <span className="text-xl font-bold text-red-500">
                  {rateLoading ? "..." : `${egpTotal} EGP`}
                </span>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
               <div className="flex items-center gap-3 mb-2">
                 <ShieldCheck size={16} className="text-indigo-500" />
                 <span className="text-sm font-medium text-white">Money Back Guarantee</span>
               </div>
               <p className="text-xs text-slate-500 leading-relaxed">
                 If you're not satisfied with the results in the first 7 days, we'll refund your payment in full.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;