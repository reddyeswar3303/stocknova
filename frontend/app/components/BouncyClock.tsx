"use client";

import React, { useState, useEffect } from 'react';

function Digit({ current, previous, bouncing, isMini, delayClass = "" }: { 
  current: string, 
  previous: string, 
  bouncing: boolean, 
  isMini: boolean,
  delayClass?: string
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (bouncing) {
      setIsAnimating(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    }
  }, [bouncing, current]);

  return (
    <div className={`clock-block ${delayClass} ${isAnimating ? 'bounce-trigger' : ''}`}>
      <style jsx>{`
        .clock-block {
          background-color: #fff;
          border-radius: ${isMini ? "0.4rem" : "0.5rem"};
          box-shadow: 0 ${isMini ? "0.4rem 0.8rem" : "1rem 2rem"} rgba(0, 208, 156, 0.15);
          font-size: ${isMini ? "1.8rem" : "2.5rem"};
          line-height: ${isMini ? "1.6" : "2"};
          overflow: hidden;
          text-align: center;
          width: ${isMini ? "2.8rem" : "5rem"};
          height: ${isMini ? "2.8rem" : "5rem"};
          position: relative;
          border: 1px solid #eee;
        }
        .clock-digit-group {
          display: flex;
          flex-direction: column-reverse;
          /* Idle state is at 0 (Top Child = CURRENT) */
          transform: translateY(0);
          width: 100%;
        }
        .clock-digits {
          width: 100%;
          height: ${isMini ? "2.8rem" : "5rem"};
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          color: #231F20;
        }
        .bounce-trigger {
          animation: bounce 0.8s ease-in-out forwards;
        }
        .bounce-trigger .clock-digit-group {
          animation: roll 0.8s ease-in-out forwards;
        }
        @keyframes bounce {
          from, to { transform: translateY(0); }
          50% { transform: translateY(${isMini ? "5px" : "12px"}); }
        }
        @keyframes roll {
          from { transform: translateY(-50%); } /* START showing previous (Bottom) */
          to { transform: translateY(0); }      /* END showing current (Top) */
        }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
      `}</style>
      <div className="clock-digit-group">
        {/* Child 2 (Top) = Current Digit */}
        <div className="clock-digits">{current}</div>
        {/* Child 1 (Bottom) = Previous Digit */}
        <div className="clock-digits">{previous}</div>
      </div>
    </div>
  );
}

export default function BouncyClock({ size = "normal" }: { size?: "normal" | "mini" }) {
  const [data, setData] = useState({
    curr: ["00", "00", "00", "AM"],
    prev: ["00", "00", "00", "AM"],
    bouncing: [false, false, false, false]
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const date = new Date();
      let h = date.getHours();
      const m = date.getMinutes();
      const s = date.getSeconds();
      const ap = h < 12 ? "AM" : "PM";

      if (h === 0) h = 12;
      if (h > 12) h -= 12;

      const newCurr = [
        (h < 10 ? `0${h}` : `${h}`),
        (m < 10 ? `0${m}` : `${m}`),
        (s < 10 ? `0${s}` : `${s}`),
        ap
      ];

      setData(d => {
        const newBouncing = newCurr.map((c, i) => c !== d.curr[i]);
        return {
          prev: d.curr,
          curr: newCurr,
          bouncing: newBouncing
        };
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isMini = size === "mini";
  if (!mounted) return null;

  return (
    <div className={`clock-container flex items-center justify-center gap-2 ${isMini ? "p-0" : "p-4 scale-75 md:scale-100"}`}>
      <style jsx>{`
        .clock {
          display: flex;
          align-items: center;
          gap: ${isMini ? "0.4rem" : "0.5rem"};
        }
        .clock-colon {
          font-size: ${isMini ? "1.4rem" : "2rem"};
          font-weight: 800;
          color: #00D09C;
          opacity: 0.5;
          margin-bottom: ${isMini ? "0.2rem" : "0.5rem"};
        }
        .clock-block-small-wrap :global(.clock-block) {
          border-radius: 0.25rem;
          box-shadow: 0 ${isMini ? "0.2rem 0.6rem" : "0.5rem 1.5rem"} rgba(0, 208, 156, 0.1);
          width: ${isMini ? "2.2rem" : "3rem"};
          height: ${isMini ? "2.2rem" : "3rem"};
          font-size: ${isMini ? "0.8rem" : "1rem"};
          line-height: ${isMini ? "2.5" : "3"};
          margin-left: ${isMini ? "0.2rem" : "0.25rem"};
        }
        .clock-block-small-wrap :global(.clock-digits) {
          height: ${isMini ? "2.2rem" : "3rem"};
          font-size: ${isMini ? "0.75rem" : "0.9rem"};
          color: #00D09C;
        }
      `}</style>
      
      <div className="clock">
        <Digit current={data.curr[0]} previous={data.prev[0]} bouncing={data.bouncing[0]} isMini={isMini} delayClass="delay-2" />
        <div className="clock-colon theme-colon">:</div>
        <Digit current={data.curr[1]} previous={data.prev[1]} bouncing={data.bouncing[1]} isMini={isMini} delayClass="delay-1" />
        <div className="clock-colon theme-colon text-gray-300">:</div>
        <Digit current={data.curr[2]} previous={data.prev[2]} bouncing={data.bouncing[2]} isMini={isMini} />
        <div className="clock-block-small-wrap">
          <Digit current={data.curr[3]} previous={data.prev[3]} bouncing={data.bouncing[3]} isMini={isMini} delayClass="delay-2" />
        </div>
      </div>
    </div>
  );
}
