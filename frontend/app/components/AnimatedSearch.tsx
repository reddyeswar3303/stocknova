"use client";

import React, { useState, useRef, useEffect } from 'react';

interface AnimatedSearchProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export default function AnimatedSearch({ value, onChange, onFocus, onKeyDown, placeholder }: AnimatedSearchProps) {
  const [isActive, setIsActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isActive) {
      setIsActive(true);
      setTimeout(() => inputRef.current?.focus(), 300);
      if (onFocus) onFocus();
    }
  };

  const closeSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsActive(false);
    const event = { target: { value: '' } } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
  };

  return (
    <div className={`search-container ${isActive ? 'active' : ''}`}>
      <style jsx>{`
        .search-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          height: 48px;
        }

        .input-holder {
          height: 42px;
          width: 42px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border-radius: 50px;
          position: relative;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(0, 208, 156, 0.1);
          display: flex;
          align-items: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }

        .active .input-holder {
          width: 340px;
          border-radius: 14px;
          background: #fff;
          border-color: #00D09C;
          box-shadow: 0 10px 25px rgba(0, 208, 156, 0.15), 0 0 0 1px rgba(0, 208, 156, 0.1);
          backdrop-filter: none;
        }

        .search-input {
          width: 100%;
          height: 40px;
          padding: 0 80px 0 16px;
          opacity: 0;
          background: transparent;
          border: none;
          outline: none;
          font-family: inherit;
          font-size: 14px;
          font-weight: 600;
          color: #231F20;
          transform: translateX(-20px);
          transition: all 0.4s ease;
          transition-delay: 0.1s;
        }

        .active .search-input {
          opacity: 1;
          transform: translateX(0);
        }

        .search-icon {
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 50%;
          background: #fff;
          padding: 0;
          outline: none;
          position: absolute;
          right: 0;
          z-index: 2;
          cursor: pointer;
          transition: all 0.4s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .active .search-icon {
          width: 32px;
          height: 32px;
          right: 5px;
          background: #00D09C;
          box-shadow: 0 4px 12px rgba(0, 208, 156, 0.3);
        }

        .search-icon span {
          width: 18px;
          height: 18px;
          display: inline-block;
          position: relative;
          transition: all .4s ease;
        }

        .search-icon span::before,
        .search-icon span::after {
          position: absolute;
          content: '';
          background: #00D09C;
          transition: all 0.4s ease;
        }

        .active .search-icon span::before,
        .active .search-icon span::after {
          background: #fff;
        }

        .search-icon span::before {
          width: 2px;
          height: 8px;
          left: 14px;
          top: 14px;
          border-radius: 2px;
          transform: rotate(-45deg);
        }

        .search-icon span::after {
          width: 13px;
          height: 13px;
          left: 0;
          top: 0;
          border-radius: 50%;
          border: 2px solid #00D09C;
          background: transparent;
        }

        .active .search-icon span::after {
          border-color: #fff;
        }

        .close {
          position: absolute;
          z-index: 3;
          top: 11px;
          right: 12px;
          width: 20px;
          height: 20px;
          cursor: pointer;
          opacity: 0;
          pointer-events: none;
          transform: scale(0.5) rotate(-90deg);
          transition: all .4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .active .close {
          opacity: 0.8;
          pointer-events: auto;
          right: 42px;
          transform: scale(1) rotate(0deg);
          transition-delay: 0.3s;
        }

        .active .close:hover {
          opacity: 1;
        }

        .close::before,
        .close::after {
          position: absolute;
          content: '';
          background: #EB5B3C;
          border-radius: 2px;
          left: 9px;
          top: 2px;
        }

        .close::before {
          width: 2px;
          height: 16px;
          transform: rotate(45deg);
        }

        .close::after {
          width: 2px;
          height: 16px;
          transform: rotate(-45deg);
        }
      `}</style>
      <div className="input-holder">
        <input 
          ref={inputRef}
          type="text" 
          className="search-input" 
          placeholder={placeholder || "Type to search"} 
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
        />
        <button className="search-icon" onClick={toggleSearch}><span></span></button>
        <span className="close" onClick={closeSearch}></span>
      </div>
    </div>
  );
}
