"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, 
  ChevronLeft, 
  CheckCircle, 
  ShieldCheck, 
  Lock, 
  Info,
  Smartphone,
  Building2,
  TicketPercent,
  AlertCircle,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { verifyPayment } from "../lib/api";
import InteractiveCardForm from "../components/InteractiveCardForm";

// --- Types & Constants ---
type PaymentMethod = "card" | "upi" | "netbanking";

const VALID_COUPONS: Record<string, number> = {
  "SPECIAL99": 0.99,
  "TRADEFREE": 1.0,
  "HALFOFF": 0.5,
  "SAVE25": 0.25,
};

const BANKS = [
  "HDFC Bank", "ICICI Bank", "SBI", "Axis Bank", "Kotak Bank", "HDFC Bank", "Standard Chartered"
];

// --- Sub-components ---

const StepIndicator = ({ step }: { step: number }) => (
  <div className="flex items-center gap-2 mb-8">
    {[1, 2, 3].map((s) => (
      <div key={s} className="flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
          s <= step ? "bg-[#00D09C] text-white" : "bg-gray-200 text-gray-500"
        }`}>
          {s < step ? <CheckCircle className="w-4 h-4" /> : s}
        </div>
        {s < 3 && <div className={`w-12 h-1 ${s < step ? "bg-[#00D09C]" : "bg-gray-200"}`} />}
      </div>
    ))}
  </div>
);

const SuccessState = ({ tierName, amount }: { tierName: string; amount: number }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }} 
    animate={{ opacity: 1, scale: 1 }}
    className="text-center py-12 px-6"
  >
    <div className="relative inline-block mb-6">
      <motion.div 
        animate={{ scale: [1, 1.2, 1] }} 
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute inset-0 bg-emerald-100 rounded-full blur-xl" 
      />
      <CheckCircle className="w-20 h-20 text-[#00D09C] relative z-10" />
    </div>
    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Payment Successful!</h2>
    <p className="text-gray-500 mb-8 max-w-sm mx-auto">
      Your <strong>{tierName}</strong> plan is now active. We've added your virtual capital to your dashboard.
    </p>
    <div className="bg-emerald-50 rounded-2xl p-4 mb-8 inline-block">
      <p className="text-sm font-bold text-emerald-700">Ref ID: SN-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
    </div>
    <div className="flex flex-col gap-3">
      <p className="text-xs text-gray-400 animate-pulse">Redirecting to your dashboard...</p>
      <Link href="/dashboard" className="text-[#00D09C] font-bold hover:underline">
        Go to Dashboard now →
      </Link>
    </div>
  </motion.div>
);

const GatewaySimulation = ({ isOpen, step, error, onConfirm, price }: { isOpen: boolean; step: 'processing' | 'verifying' | 'failed' | 'waiting'; error?: string; onConfirm: () => void; price: number }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl text-center"
      >
        {step === 'processing' && (
          <>
            <Loader2 className="w-16 h-16 text-[#00D09C] animate-spin mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Connecting to Secure Gateway</h3>
            <p className="text-gray-500">Communicating with your financial provider...</p>
          </>
        )}
        {step === 'waiting' && (
          <>
            <div className="w-32 h-32 bg-white mx-auto mb-4 rounded-2xl flex items-center justify-center p-3 shadow-inner border border-gray-100">
               <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=8374641439@ybl&pn=Eswar Reddy&am=${price}&cu=INR`)}`}
                  alt="Scan to Pay"
                  className="w-full h-full object-contain"
                />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Awaiting Scan</h3>
            <p className="text-gray-500 mb-4 font-medium text-[10px] uppercase tracking-wider">A grand total of ₹{price.toLocaleString()} is ready.</p>
            
            <div className="text-left mb-6 space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Step 2: Enter Transaction ID (UTR)</label>
               <input 
                  type="text" 
                  placeholder="12-digit UTR Number"
                  maxLength={12}
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00D09C] focus:bg-white outline-none transition-all font-mono text-sm"
                  onChange={(e) => (window as any)._setUTR?.(e.target.value)}
                />
                <p className="text-[9px] text-gray-400 text-center">Found in your bank/UPI app after payment</p>
            </div>

            <button 
              id="confirm-btn"
              onClick={onConfirm}
              className="w-full py-4 bg-[#00D09C] text-white font-bold rounded-2xl hover:bg-[#00A87D] transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
              disabled={!(window as any)._utrValid}
            >
              Verify & Activate Account
            </button>
          </>
        )}
        {step === 'verifying' && (
          <>
            <ShieldCheck className="w-16 h-16 text-blue-500 animate-pulse mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Verifying Real-time Transaction</h3>
            <p className="text-gray-500">Our systems are checking the transaction status with your bank...</p>
          </>
        )}
        {step === 'failed' && (
          <>
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-red-600 mb-2">Payment Verification Failed</h3>
            <p className="text-gray-500 mb-6">{error || "The bank was unable to verify your payment. Please ensure the scan was successful."}</p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all"
            >
              Go Back and Retry
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
};

// --- Main Content ---

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const tierName = searchParams.get("tier") || "Beginner";
  const initialPrice = parseInt(searchParams.get("price") || "199");
  
  const [price, setPrice] = useState(initialPrice);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [coupon, setCoupon] = useState("");
  const [activeCoupon, setActiveCoupon] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [gatewayOpen, setGatewayOpen] = useState(false);
  const [gatewayStep, setGatewayStep] = useState<'processing' | 'verifying' | 'failed' | 'waiting'>('processing');
  const [paymentError, setPaymentError] = useState("");
  const [utr, setUtr] = useState("");
  const [canProceed, setCanProceed] = useState(false);

  // Expose setUtr to global for GatewaySimulation (hack for simplicity in this structure)
  useEffect(() => {
    (window as any)._setUTR = (val: string) => setUtr(val);
    (window as any)._utrValid = utr.length >= 10;
  }, [utr]);

  const [cardData, setCardData] = useState({ 
    number: "", 
    name: "FULL NAME", 
    expiryMonth: "", 
    expiryYear: "", 
    cvv: "" 
  });
  const [selectedBank, setSelectedBank] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) router.push("/auth");
  }, [router]);

  const handleApplyCoupon = (e?: React.FormEvent) => {
    e?.preventDefault();
    const code = coupon.toUpperCase().trim();
    
    if (!code) return; // Silent return if empty

    if (VALID_COUPONS[code]) {
      const discount = VALID_COUPONS[code];
      const newPrice = Math.max(0, Math.floor(initialPrice * (1 - discount)));
      setPrice(newPrice);
      setActiveCoupon(code);
      setCoupon(""); // Clear input after success
    } else {
      alert("Invalid coupon code. Try 'SPECIAL99', 'HALFOFF', or 'SAVE25'.");
      setCoupon("");
    }
  };

  const startVerification = async () => {
    setGatewayStep('verifying');
    
    try {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      
      const response = await verifyPayment({
        paymentId: price === 0 ? "FREE_ACCESS" : (utr || "TXN_" + Math.random().toString(36).substr(2, 9).toUpperCase()),
        amount: price,
        userId: user?.id || user?._id,
        tierName: tierName
      });

      // Simulation of a realistic verification time
      await new Promise((r) => setTimeout(r, 2000));

      if (response.success) {
        if (response.data?.updatedBalance) {
          localStorage.setItem("availableFunds", response.data.updatedBalance.toString());
        }
        localStorage.setItem("traderLevel", tierName);
        
        await new Promise((r) => setTimeout(r, 500));
        setGatewayOpen(false);
        setIsSuccess(true);
        
        setTimeout(() => {
          window.location.assign("/dashboard");
        }, 3000);
      } else {
        throw new Error(response.error || "Payment verification failed. Please check your balance.");
      }
    } catch (err: any) {
      setPaymentError(err.message || "Failed to verify transaction");
      setGatewayStep('failed');
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (price > 0) {
      if (paymentMethod === "card") {
        const { number, name, cvv } = cardData;
        if (!number || !name || !cvv) {
          alert("Card details are incomplete. Please fill all fields.");
          return;
        }
      }
      if (paymentMethod === "netbanking" && !selectedBank) {
        alert("Please select your bank.");
        return;
      }
    }

    setGatewayOpen(true);
    setGatewayStep('processing');
    setPaymentError("");
    
    // Initial connection simulation
    await new Promise((r) => setTimeout(r, 2000));
    
    if (price === 0) {
      // If free, skip the waiting phase
      startVerification();
    } else {
      // If payment required, wait for user to 'scan' and confirm
      setGatewayStep('waiting');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] py-20 px-4">
      <GatewaySimulation 
        isOpen={gatewayOpen} 
        step={gatewayStep} 
        error={paymentError} 
        onConfirm={startVerification}
        price={price}
      />
      
      <div className="max-w-6xl mx-auto">
        <Link 
          href="/dashboard"
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8 font-medium"
        >
          <ChevronLeft className="w-5 h-5" /> Back to Dashboard
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Checkout Panel */}
          <div className="lg:col-span-8">
            <motion.div 
              layout
              className="bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-100/50 border border-emerald-50 overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <SuccessState tierName={tierName} amount={price} />
                ) : (
                  <div className="p-8 lg:p-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                      <div>
                        <h1 className="text-3xl font-black text-gray-900 mb-1">Secure Checkout</h1>
                        <p className="text-gray-500 font-medium">Complete your subscription to unlock {tierName} features.</p>
                      </div>
                      <StepIndicator step={2} />
                    </div>

                    {/* Payment Method Tabs */}
                    <div className="grid grid-cols-3 gap-3 mb-8 bg-gray-50 p-2 rounded-2xl">
                      {(['card', 'upi', 'netbanking'] as PaymentMethod[]).map((m) => (
                        <button
                          key={m}
                          onClick={() => setPaymentMethod(m)}
                          className={`py-3 rounded-[1rem] flex flex-col items-center justify-center gap-2 transition-all ${
                            paymentMethod === m 
                              ? "bg-white text-[#00D09C] shadow-sm font-bold" 
                              : "text-gray-400 font-medium hover:text-gray-600"
                          }`}
                        >
                          {m === 'card' && <CreditCard className="w-5 h-5" />}
                          {m === 'upi' && <Smartphone className="w-5 h-5" />}
                          {m === 'netbanking' && <Building2 className="w-5 h-5" />}
                          <span className="text-[10px] uppercase tracking-wider">{m}</span>
                        </button>
                      ))}
                    </div>

                    {/* Method Content */}
                    <form onSubmit={handlePayment} className="space-y-6">
                      <AnimatePresence mode="wait">
                        {paymentMethod === "card" && (
                          <motion.div 
                            key="card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="col-span-2"
                          >
                             <InteractiveCardForm 
                               cardData={cardData}
                               onUpdate={setCardData}
                               onSubmit={handlePayment}
                               price={price}
                             />
                          </motion.div>
                        )}

                        {paymentMethod === "upi" && (
                          <motion.div key="upi" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                            <div className="p-8 border-2 border-dashed border-gray-100 rounded-[2.5rem] text-center bg-gray-50/50 relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-24 h-24 bg-[#00D09C] rounded-full blur-[60px] opacity-10 -mr-12 -mt-12" />
                              
                              <div className="w-48 h-48 bg-white mx-auto mb-6 rounded-3xl flex items-center justify-center p-6 shadow-xl border border-gray-100 relative z-10">
                                <img 
                                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=8374641439@ybl&pn=Eswar Reddy&am=${price}&cu=INR`)}`}
                                  alt="Payment QR Code"
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              
                              <div className="inline-block px-4 py-2 bg-white rounded-full shadow-sm mb-4 border border-gray-50">
                                <p className="text-[10px] font-black text-gray-900 tracking-widest uppercase">UPI ID: 8374641439@ybl</p>
                              </div>
                              
                              <p className="text-sm font-black text-gray-900 mb-1">Scan QR with any UPI app</p>
                              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Payments are processed securely via encrypted gateway</p>
                            </div>
                          </motion.div>
                        )}

                        {paymentMethod === "netbanking" && (
                          <motion.div key="nb" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                            <div className="grid grid-cols-2 gap-4">
                              {BANKS.map((bank) => (
                                <button
                                  key={bank}
                                  type="button"
                                  onClick={() => setSelectedBank(bank)}
                                  className={`p-4 rounded-xl border text-sm font-bold transition-all text-left ${
                                    selectedBank === bank ? "border-[#00D09C] bg-emerald-50 text-[#00D09C]" : "border-gray-100 hover:border-gray-300"
                                  }`}
                                >
                                  {bank}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {paymentMethod !== 'card' && (
                        <div className="pt-6 border-t border-gray-100">
                          <button
                            type="submit"
                            className="w-full py-5 rounded-[1.25rem] font-black text-lg text-white shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
                            style={{ backgroundColor: "#00D09C" }}
                          >
                            <span className="relative z-10">
                              {price === 0 ? "ACTIVATE FREE ACCESS" : `PROCEED TO PAY ₹${price.toLocaleString()}`}
                            </span>
                            <Lock className="w-5 h-5 opacity-50 relative z-10" />
                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                          </button>
                          <p className="text-center text-[10px] text-gray-400 mt-4 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Fully Encrypted • PCI-DSS Compliant • Secure Gateway
                          </p>
                        </div>
                      )}
                    </form>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Sidebar Order Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              
              <div className="bg-gray-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00D09C] rounded-full blur-[80px] opacity-20 -mr-16 -mt-16" />
                
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <TicketPercent className="w-6 h-6 text-[#00D09C]" /> Order Summary
                </h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center opacity-70">
                    <span className="text-sm">Base Plan ({tierName})</span>
                    <span className="font-mono">₹{initialPrice}</span>
                  </div>
                  {activeCoupon && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex justify-between items-center text-[#00D09C]">
                      <span className="text-sm font-bold">Discount Applied</span>
                      <span className="font-mono font-bold">-₹{initialPrice - price}</span>
                    </motion.div>
                  )}
                  <div className="h-px bg-white/10 my-4" />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Grand Total</span>
                    <span className="text-2xl font-black text-[#00D09C]">₹{price.toLocaleString()}</span>
                  </div>
                </div>

                {/* Optional Promo Code Box */}
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Info className="w-3 h-3" /> Coupons (Optional)
                  </p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="ENTER CODE"
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold tracking-widest focus:outline-none focus:border-[#00D09C] transition-all"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleApplyCoupon(); } }}
                    />
                    <button 
                      onClick={() => handleApplyCoupon()}
                      className="px-4 py-3 bg-[#00D09C]/10 text-[#00D09C] rounded-xl text-xs font-black hover:bg-[#00D09C]/20 transition-all border border-[#00D09C]/30"
                    >
                      APPLY
                    </button>
                  </div>
                </div>
              </div>

              {/* Trust badges */}
              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-[#00D09C]" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900">Money Back Guarantee</p>
                    <p className="text-xs text-gray-500">Full refund within 7 days if not satisfied.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center"><Loader2 className="w-10 h-10 text-[#00D09C] animate-spin" /></div>}>
      <PaymentContent />
    </Suspense>
  );
}
