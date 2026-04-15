"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function AuthPage() {
  const router = useRouter();
  const [authType, setAuthType] = useState<"signin" | "register" | "admin" | "forgot">("signin");
  const [resetStep, setResetStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      if (authType === "forgot") {
        if (resetStep === 1) {
          // Verify account exists
          const { getAdminUsers } = await import("../lib/api");
          const res = await getAdminUsers();
          if (!res.success) throw new Error("Unable to verify account. Server may be offline.");
          const userExists = res.data.some((u: any) => u.email.toLowerCase() === formData.email.toLowerCase());
          
          if (!userExists) throw new Error("No account found with this email");
          
          setIsLoading(false);
          setResetStep(2);
          return;
        } else {
          // Reset password
          const { resetPassword } = await import("../lib/api");
          const res = await resetPassword(formData.email, formData.password);
          if (!res.success) throw new Error(res.error);
          
          setIsLoading(false);
          setIsSuccess(true);
          setTimeout(() => {
            setIsSuccess(false);
            setAuthType("signin");
            setResetStep(1);
          }, 2000);
          return;
        }
      }

      if (authType === "signin") {
        const { login } = await import("../lib/api");
        const data = await login(formData.email, formData.password);
        
        if (!data.success) {
          throw new Error(data.error || 'Invalid credentials');
        }
        
        setIsLoading(false);
        setIsSuccess(true);
        
        setTimeout(() => {
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("user", JSON.stringify(data.user || {}));
          if (data.role === 'admin') {
            localStorage.setItem("adminToken", data.token);
            router.push("/admin");
          } else {
            router.push("/dashboard");
          }
        }, 1500);
      } else {
        const { register } = await import("../lib/api");
        const data = await register(formData.name, formData.email, formData.password);
        
        if (!data.success) {
          throw new Error(data.error || 'Registration failed');
        }
        
        setIsLoading(false);
        setIsSuccess(true);
        
        setTimeout(() => {
          setIsSuccess(false);
          setAuthType("signin");
        }, 1500);
      }
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="auth-container min-h-screen flex flex-col items-center justify-center p-4">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

        @property --a {
          syntax: "<angle>";
          inherits: false;
          initial-value: 0deg;
        }

        .auth-container {
          background: #252432;
          font-family: "Poppins", sans-serif;
        }

        .box {
          position: relative;
          width: 400px;
          height: 200px;
          background: repeating-conic-gradient(
            from var(--a),
            #ff2770 0%,
            #ff2770 5%,
            transparent 5%,
            transparent 40%,
            #ff2770 50%
          );
          filter: drop-shadow(0 15px 50px #000);
          animation: rotating 4s linear infinite;
          border-radius: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: 0.5s;
        }

        .box.expanded {
          width: 450px;
          height: 500px;
        }

        @keyframes rotating {
          0% { --a: 0deg; }
          100% { --a: 360deg; }
        }

        .box::before {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          background: repeating-conic-gradient(
            from var(--a),
            #45f3ff 0%,
            #45f3ff 5%,
            transparent 5%,
            transparent 40%,
            #45f3ff 50%
          );
          filter: drop-shadow(0 15px 50px #000);
          border-radius: 20px;
          animation: rotating 4s linear infinite;
          animation-delay: -1s;
        }

        .box::after {
          content: "";
          position: absolute;
          inset: 4px;
          background: #2d2d39;
          border-radius: 15px;
          border: 8px solid #25252b;
        }

        .login {
          position: absolute;
          inset: 60px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 10px;
          flex-direction: column;
          background: rgba(0, 0, 0, 0.2);
          z-index: 1000;
          box-shadow: inset 0 10px 20px rgba(0, 0, 0, 0.5);
          border-bottom: 2px solid rgba(255, 255, 255, 0.5);
          transition: 0.5s;
          color: #fff;
          overflow: hidden;
        }

        .box.expanded .login {
          inset: 40px;
        }

        .loginBx {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          transform: translateY(126px);
          gap: 20px;
          width: 80%;
          transition: 0.5s;
        }

        .box.expanded .loginBx {
          transform: translateY(0px);
        }

        .loginBx h2 {
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #fff;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
        }

        .loginBx h2 i {
          color: #ff2770;
          text-shadow: 0 0 5px #ff2770, 0 0 30px #ff2770;
        }

        .loginBx input {
          width: 100%;
          padding: 10px 20px;
          outline: none;
          font-size: 1em;
          color: #fff;
          background: rgba(0, 0, 0, 0.1);
          border: 2px solid #fff;
          border-radius: 30px;
        }

        .loginBx input::placeholder {
          color: #999;
        }

        .loginBx button[type="submit"] {
          width: 100%;
          padding: 10px 20px;
          background: #45f3ff;
          border: none;
          border-radius: 30px;
          font-weight: 500;
          color: #111;
          cursor: pointer;
          transition: 0.5s;
        }

        .loginBx button[type="submit"]:hover {
          box-shadow: 0 0 10px #45f3ff, 0 0 60px #45f3ff;
        }

        .group {
          display: flex;
          width: 100%;
          justify-content: space-between;
          font-size: 0.8em;
        }

        .group a {
          color: #fff;
          text-decoration: none;
        }

        .group a:nth-child(2) {
          color: #ff2770;
          font-weight: 600;
        }

        .error-msg {
          position: absolute;
          top: 20px;
          background: rgba(255, 39, 112, 0.2);
          color: #ff2770;
          padding: 10px 20px;
          border-radius: 10px;
          font-size: 0.8em;
          border: 1px solid #ff2770;
          z-index: 2000;
        }

        .success-overlay {
          position: absolute;
          inset: 0;
          background: #2d2d39;
          z-index: 1001;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 20px;
        }
        .box.register-active {
           background: repeating-conic-gradient(
            from var(--a),
            #00D09C 0%,
            #00D09C 5%,
            transparent 5%,
            transparent 40%,
            #00D09C 50%
          );
          filter: drop-shadow(0 15px 50px rgba(0, 208, 156, 0.4));
        }

        .box.register-active::before {
           background: repeating-conic-gradient(
            from var(--a),
            #adff2f 0%,
            #adff2f 5%,
            transparent 5%,
            transparent 40%,
            #adff2f 50%
          );
        }

        .register-mode h2 {
          color: #00D09C !important;
          text-shadow: 0 0 10px rgba(0, 208, 156, 0.6) !important;
        }

        .register-btn {
          background: #00D09C !important;
          color: #fff !important;
          box-shadow: 0 0 15px rgba(0, 208, 156, 0.4);
        }

        .register-btn:hover {
          box-shadow: 0 0 30px #00D09C !important;
        }

        .box.admin-active {
           background: repeating-conic-gradient(
            from var(--a),
            #ff4d4d 0%,
            #ff4d4d 5%,
            transparent 5%,
            transparent 40%,
            #ff4d4d 50%
          );
          filter: drop-shadow(0 15px 50px rgba(255, 77, 77, 0.4));
        }

        .box.admin-active::before {
           background: repeating-conic-gradient(
            from var(--a),
            #ff944d 0%,
            #ff944d 5%,
            transparent 5%,
            transparent 40%,
            #ff944d 50%
          );
        }

        .admin-mode h2 {
          color: #ff4d4d !important;
          text-shadow: 0 0 10px rgba(255, 77, 77, 0.6) !important;
          animation: pulse-red 2s infinite;
        }

        @keyframes pulse-red {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }

        .admin-btn {
          background: #ff4d4d !important;
          color: #fff !important;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          box-shadow: 0 0 15px rgba(255, 77, 77, 0.4);
        }

        .admin-btn:hover {
          box-shadow: 0 0 30px #ff4d4d !important;
        }

        .admin-link {
          color: #ff4d4d !important;
          font-weight: 700;
          animation: flicker 4s infinite;
        }

        @keyframes flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
          20%, 22%, 24%, 55% { opacity: 0.5; }
        }
      `}</style>
      
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />

      <Link href="/" className="absolute top-8 left-8 text-white/50 hover:text-white flex items-center gap-2 transition-colors z-[2000]">
        <ArrowLeft size={16} /> Back to Home
      </Link>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="error-msg"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`box expanded ${authType === 'admin' ? 'admin-active' : authType === 'register' ? 'register-active' : ''}`}>
        <div className={`login ${authType === 'admin' ? 'admin-mode' : authType === 'register' ? 'register-mode' : ''}`}>
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="success-overlay"
              >
                <CheckCircle size={60} color="#45f3ff" />
                <h2 className="mt-4 text-xl font-bold uppercase tracking-widest text-[#45f3ff]">Success!</h2>
                <p className="mt-2 text-sm opacity-70">Redirecting to StockNova dashboard...</p>
              </motion.div>
            ) : (
              <motion.div key="form" className="loginBx">
                <h2 className={authType === "admin" ? "admin-mode" : authType === "register" ? "register-mode" : authType === "forgot" ? "forgot-mode" : ""}>
                  <i className={`fa-solid ${authType === "admin" ? "fa-user-shield" : authType === "register" ? "fa-user-plus" : authType === "forgot" ? "fa-key" : "fa-right-to-bracket"}`}></i>
                  {authType === "signin" ? "Login" : authType === "register" ? "Register" : authType === "admin" ? "Admin" : "Reset"}
                  <i className="fa-solid fa-heart"></i>
                </h2>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                  {authType === "register" && (
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  )}
                  {!(authType === 'forgot' && resetStep === 2) && (
                    <input 
                      type="email" 
                      placeholder={authType === "admin" ? "Admin Email" : "Email"} 
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  )}
                  {(authType !== 'forgot' || (authType === 'forgot' && resetStep === 2)) && (
                    <div className="relative w-full">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder={authType === 'forgot' ? 'New Password' : 'Password'}
                        required
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 transition-shadow`}
                        style={{ color: authType === 'admin' ? '#ff4d4d' : authType === 'register' ? '#00D09C' : authType === 'forgot' ? '#FFB800' : '#45f3ff' }}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  )}
                  
                  <button type="submit" disabled={isLoading} className={authType === "admin" ? "admin-btn" : authType === "register" ? "register-btn" : authType === "forgot" ? "forgot-btn" : ""}>
                    {isLoading ? "Verifying..." : 
                     authType === "signin" ? "Sign in" : 
                     authType === "register" ? "Sign up" : 
                     authType === "admin" ? "Admin Portal" : 
                     (resetStep === 1 ? "Check Email" : "Reset Password")}
                  </button>
                </form>

                <div className="group">
                  <a href="#" onClick={(e) => { e.preventDefault(); setAuthType("forgot"); setResetStep(1); }}>Forgot Password</a>
                  <div className="flex gap-3">
                    <a href="#" onClick={(e) => { e.preventDefault(); 
                      if (authType === "forgot") {
                        setAuthType("signin");
                      } else {
                        setAuthType(authType === "signin" ? "register" : "signin");
                      }
                    }}>
                      {authType === "signin" ? "Sign up" : "Sign in"}
                    </a>
                    {authType !== "admin" && (
                      <a href="#" onClick={(e) => { e.preventDefault(); setAuthType("admin"); }} style={{ color: '#45f3ff' }}>Admin</a>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
