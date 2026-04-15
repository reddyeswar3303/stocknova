"use client";

import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function RedirectLoader() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // When the path or search params change, it means navigation has COMPLETED.
    // We stop the loader.
    setLoading(false);
  }, [pathname, searchParams]);

  // We can't easily detect "Navigation Started" in App Router without intercepting clicks.
  // BUT, we can provide a global function via window or context to trigger it.
  
  useEffect(() => {
    const handleNavigationTrigger = () => {
      setLoading(true);
    };

    window.addEventListener('navigation-start', handleNavigationTrigger);
    return () => window.removeEventListener('navigation-start', handleNavigationTrigger);
  }, []);

  if (!loading) return null;

  return (
    <div className="loader-container">
      <style jsx>{`
        .loader-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: #f1c40f;
          z-index: 99999;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        h1 {
          position: absolute;
          font-family: "Open Sans", sans-serif;
          font-weight: 700;
          font-size: 14px;
          text-transform: uppercase;
          color: #000;
          letter-spacing: 2px;
          top: 60%;
          animation: fade 1s ease-in-out infinite alternate;
        }

        @keyframes fade {
          from { opacity: 0.5; }
          to { opacity: 1; }
        }

        .speeder-body {
          position: relative;
          width: 100px;
          height: 50px;
          animation: speeder 0.4s linear infinite;
        }

        .speeder-body > span {
          height: 5px;
          width: 35px;
          background: #000;
          position: absolute;
          top: -19px;
          left: 60px;
          border-radius: 2px 10px 1px 0;
        }

        .base span {
          position: absolute;
          width: 0;
          height: 0;
          border-top: 6px solid transparent;
          border-right: 100px solid #000;
          border-bottom: 6px solid transparent;
        }

        .base span:before {
          content: "";
          height: 22px;
          width: 22px;
          border-radius: 50%;
          background: #000;
          position: absolute;
          right: -110px;
          top: -16px;
        }

        .base span:after {
          content: "";
          position: absolute;
          width: 0;
          height: 0;
          border-top: 0 solid transparent;
          border-right: 55px solid #000;
          border-bottom: 16px solid transparent;
          top: -16px;
          right: -98px;
        }

        .face {
          position: absolute;
          height: 12px;
          width: 20px;
          background: #000;
          border-radius: 20px 20px 0 0;
          transform: rotate(-40deg);
          right: -125px;
          top: -15px;
        }

        .face:after {
          content: "";
          height: 12px;
          width: 12px;
          background: #000;
          right: 4px;
          top: 7px;
          position: absolute;
          transform: rotate(40deg);
          transform-origin: 50% 50%;
          border-radius: 0 0 0 2px;
        }

        .speeder-body > span > span:nth-child(1),
        .speeder-body > span > span:nth-child(2),
        .speeder-body > span > span:nth-child(3),
        .speeder-body > span > span:nth-child(4) {
          width: 30px;
          height: 1px;
          background: #000;
          position: absolute;
          animation: fazer1 0.2s linear infinite;
        }

        .speeder-body > span > span:nth-child(2) { top: 3px; animation: fazer2 0.4s linear infinite; }
        .speeder-body > span > span:nth-child(3) { top: 1px; animation: fazer3 0.4s linear infinite; animation-delay: -1s; }
        .speeder-body > span > span:nth-child(4) { top: 4px; animation: fazer4 1s linear infinite; animation-delay: -1s; }

        @keyframes fazer1 { 0% { left: 0; } 100% { left: -80px; opacity: 0; } }
        @keyframes fazer2 { 0% { left: 0; } 100% { left: -100px; opacity: 0; } }
        @keyframes fazer3 { 0% { left: 0; } 100% { left: -50px; opacity: 0; } }
        @keyframes fazer4 { 0% { left: 0; } 100% { left: -150px; opacity: 0; } }

        @keyframes speeder {
          0% { transform: translate(2px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -3px) rotate(-1deg); }
          20% { transform: translate(-2px, 0px) rotate(1deg); }
          30% { transform: translate(1px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 3px) rotate(-1deg); }
          60% { transform: translate(-1px, 1px) rotate(0deg); }
          70% { transform: translate(3px, 1px) rotate(-1deg); }
          80% { transform: translate(-2px, -1px) rotate(1deg); }
          90% { transform: translate(2px, 1px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }

        .longfazers {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }

        .longfazers span {
          position: absolute;
          height: 2px;
          width: 20%;
          background: rgba(0, 0, 0, 0.1);
        }

        .longfazers span:nth-child(1) { top: 20%; animation: lf 0.6s linear infinite; animation-delay: -5s; }
        .longfazers span:nth-child(2) { top: 40%; animation: lf2 0.8s linear infinite; animation-delay: -1s; }
        .longfazers span:nth-child(3) { top: 60%; animation: lf3 0.6s linear infinite; }
        .longfazers span:nth-child(4) { top: 80%; animation: lf4 0.5s linear infinite; animation-delay: -3s; }

        @keyframes lf { 0% { left: 200%; } 100% { left: -200%; opacity: 0; } }
        @keyframes lf2 { 0% { left: 200%; } 100% { left: -200%; opacity: 0; } }
        @keyframes lf3 { 0% { left: 200%; } 100% { left: -100%; opacity: 0; } }
        @keyframes lf4 { 0% { left: 200%; } 100% { left: -100%; opacity: 0; } }
      `}</style>
      
      <div className='longfazers'>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className='speeder-body'>
        <span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </span>
        <div className='base'>
          <span></span>
          <div className='face'></div>
        </div>
      </div>

      <h1>Redirecting</h1>
    </div>
  );
}
