"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CardFormProps {
  cardData: {
    number: string;
    name: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
  };
  onUpdate: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  price: number;
}

export default function InteractiveCardForm({ cardData, onUpdate, onSubmit, price }: CardFormProps) {
  const [isCvvFocused, setIsCvvFocused] = useState(false);
  const [focusElementStyle, setFocusElementStyle] = useState<any>(null);
  const [isFocused, setIsFocused] = useState(false);
  
  const cardYearRef = useRef<HTMLDivElement>(null);
  const cardNumberRef = useRef<HTMLDivElement>(null);
  const cardNameRef = useRef<HTMLDivElement>(null);
  const cardDateRef = useRef<HTMLDivElement>(null);

  const updateFocus = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      const { offsetTop, offsetLeft, offsetWidth, offsetHeight } = ref.current;
      setFocusElementStyle({
        top: `${offsetTop}px`,
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`,
        height: `${offsetHeight}px`
      });
      setIsFocused(true);
    } else {
      setIsFocused(false);
    }
  };

  const getCardType = (number: string) => {
    let re = new RegExp("^4");
    if (number.match(re) != null) return "visa";

    re = new RegExp("^(34|37)");
    if (number.match(re) != null) return "amex";

    re = new RegExp("^5[1-5]");
    if (number.match(re) != null) return "mastercard";

    re = new RegExp("^6011");
    if (number.match(re) != null) return "discover";
    
    re = new RegExp('^9792')
    if (number.match(re) != null) return 'troy'

    return "visa"; // Default
  };

  if (!cardData) return null;
  const cardType = getCardType(cardData.number || '');

  return (
    <div className="wrapper">
      <style jsx>{`
        .wrapper {
          min-height: auto;
          display: flex;
          padding: 20px 0;
          font-family: "Source Sans Pro", sans-serif;
        }

        .card-form {
          max-width: 570px;
          margin: auto;
          width: 100%;
        }

        .card-form__inner {
          background: #fff;
          box-shadow: 0 15px 35px rgba(0, 208, 156, 0.1);
          border-radius: 20px;
          padding: 35px;
          padding-top: 150px;
          border: 1px solid #E8FBF6;
        }

        .card-input {
          margin-bottom: 20px;
        }

        .card-input__label {
          font-size: 13px;
          margin-bottom: 8px;
          font-weight: 700;
          color: #231F20;
          width: 100%;
          display: block;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .card-input__input {
          width: 100%;
          height: 50px;
          border-radius: 12px;
          border: 1px solid #ced6e0;
          transition: all 0.3s ease-in-out;
          font-size: 16px;
          padding: 5px 15px;
          background: #F9FDFB;
          color: #1a3b5d;
        }

        .card-input__input:focus {
          border-color: #00D09C;
          background: #fff;
          box-shadow: 0 5px 15px rgba(0, 208, 156, 0.1);
          outline: none;
        }

        .card-form__row {
          display: flex;
          gap: 20px;
        }

        .card-form__col {
          flex: 1;
        }

        .card-form__group {
          display: flex;
          gap: 10px;
        }

        .card-form__button {
          width: 100%;
          height: 55px;
          background: #00D09C;
          border: none;
          border-radius: 15px;
          font-size: 20px;
          font-weight: 800;
          color: #fff;
          margin-top: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 20px rgba(0, 208, 156, 0.2);
        }

        .card-form__button:hover {
          background: #00A87D;
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(0, 208, 156, 0.3);
        }

        /* Card Visual */
        .card-item {
          max-width: 430px;
          height: 270px;
          margin-left: auto;
          margin-right: auto;
          position: relative;
          z-index: 10;
          width: 100%;
          margin-bottom: -130px;
        }

        .card-item__side {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(14, 42, 90, 0.4);
          transform-style: preserve-3d;
          transition: all 0.8s cubic-bezier(0.71, 0.03, 0.56, 0.85);
          backface-visibility: hidden;
          height: 100%;
          position: relative;
          background-color: #231F20;
        }

        .card-item__side.-back {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          transform: perspective(2000px) rotateY(-180deg);
        }

        .card-item.-active .card-item__side.-front {
          transform: perspective(1000px) rotateY(180deg);
        }

        .card-item.-active .card-item__side.-back {
          transform: perspective(1000px) rotateY(0deg);
        }

        .card-item__cover {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .card-item__bg {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.8;
          background: linear-gradient(135deg, #231F20 0%, #00D09C 100%);
        }

        .card-item__wrapper {
          padding: 25px;
          position: relative;
          z-index: 5;
          height: 100%;
          display: flex;
          flex-direction: column;
          color: #fff;
        }

        .card-item__top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
        }

        .card-item__chip {
          width: 50px;
        }

        .card-item__type {
          height: 40px;
        }

        .card-item__number {
          font-size: 24px;
          font-weight: 600;
          letter-spacing: 2px;
          margin-bottom: 30px;
          font-family: "Source Code Pro", monospace;
        }

        .card-item__info {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .card-item__holder-label {
          font-size: 11px;
          opacity: 0.7;
          text-transform: uppercase;
          margin-bottom: 5px;
          display: block;
        }

        .card-item__name {
          font-size: 16px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .card-item__date {
          text-align: right;
        }

        .card-item__date-label {
          font-size: 11px;
          opacity: 0.7;
          text-transform: uppercase;
          margin-bottom: 5px;
          display: block;
        }

        .card-item__dateItem {
          font-size: 16px;
          font-weight: 700;
        }

        .card-item__band {
          background: #000;
          width: 100%;
          height: 50px;
          margin-top: 30px;
        }

        .card-item__cvv {
          text-align: right;
          padding: 15px;
        }

        .card-item__cvvBand {
          height: 45px;
          background: #fff;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 15px;
          color: #231F20;
          font-weight: 700;
          border-radius: 4px;
        }

        /* Focus Frame */
        .card-item__focus {
          position: absolute;
          z-index: 3;
          border-radius: 5px;
          border: 2px solid rgba(255, 255, 255, 0.5);
          transition: all 0.35s cubic-bezier(0.71, 0.03, 0.56, 0.85);
          pointer-events: none;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(2px);
        }

        @media (max-width: 480px) {
          .card-item {
            max-width: 320px;
            height: 200px;
            margin-bottom: -100px;
          }
          .card-form__inner {
            padding-top: 120px;
            padding-left: 15px;
            padding-right: 15px;
          }
          .card-item__number {
            font-size: 18px;
          }
        }
      `}</style>

      <div className="card-form">
        <div className={`card-item ${isCvvFocused ? '-active' : ''}`}>
          <div className="card-item__side -front">
            {isFocused && focusElementStyle && (
              <div className="card-item__focus" style={focusElementStyle}></div>
            )}
            <div className="card-item__cover">
              <div className="card-item__bg"></div>
            </div>
            <div className="card-item__wrapper">
              <div className="card-item__top">
                <img src="https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/chip.png" className="card-item__chip" alt="chip" />
                <div className="card-item__type">
                   <img src={`https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/${cardType}.png`} alt="" className="card-item__typeImg" />
                </div>
              </div>
              <div className="card-item__number" ref={cardNumberRef}>
                {cardData.number ? cardData.number : '#### #### #### ####'}
              </div>
              <div className="card-item__info">
                <div className="card-item__holder" ref={cardNameRef}>
                  <span className="card-item__holder-label">Card Holder</span>
                  <div className="card-item__name">
                    {cardData.name ? cardData.name : 'FULL NAME'}
                  </div>
                </div>
                <div className="card-item__date" ref={cardDateRef}>
                  <span className="card-item__date-label">Expires</span>
                  <div className="card-item__dateItem">
                    {cardData.expiryMonth || 'MM'}/{cardData.expiryYear || 'YY'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-item__side -back">
            <div className="card-item__cover">
              <div className="card-item__bg"></div>
            </div>
            <div className="card-item__band"></div>
            <div className="card-item__cvv">
              <div className="card-item__cvvTitle">CVV</div>
              <div className="card-item__cvvBand">
                {cardData.cvv ? cardData.cvv : '***'}
              </div>
              <div className="card-item__type">
                 <img src={`https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/${cardType}.png`} alt="" className="card-item__typeImg" />
              </div>
            </div>
          </div>
        </div>

        <div className="card-form__inner">
          <div className="card-input">
            <label className="card-input__label">Card Number</label>
            <input 
              type="text" 
              className="card-input__input" 
              value={cardData.number}
              onChange={(e) => onUpdate({ ...cardData, number: e.target.value })}
              onFocus={() => updateFocus(cardNumberRef)}
              onBlur={() => setIsFocused(false)}
            />
          </div>
          <div className="card-input">
            <label className="card-input__label">Card Holders</label>
            <input 
              type="text" 
              className="card-input__input" 
              value={cardData.name}
              onChange={(e) => onUpdate({ ...cardData, name: e.target.value })}
              onFocus={() => updateFocus(cardNameRef)}
              onBlur={() => setIsFocused(false)}
            />
          </div>
          <div className="card-form__row">
            <div className="card-form__col">
              <div className="card-form__group">
                <div className="card-input">
                  <label className="card-input__label">Expiration Date</label>
                  <select 
                    className="card-input__input -select" 
                    value={cardData.expiryMonth}
                    onChange={(e) => onUpdate({ ...cardData, expiryMonth: e.target.value })}
                    onFocus={() => updateFocus(cardDateRef)}
                    onBlur={() => setIsFocused(false)}
                  >
                    <option value="" disabled>Month</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                        {String(i + 1).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="card-input">
                  <label className="card-input__label" style={{ opacity: 0 }}>Year</label>
                  <select 
                    className="card-input__input -select" 
                    value={cardData.expiryYear}
                    onChange={(e) => onUpdate({ ...cardData, expiryYear: e.target.value })}
                    onFocus={() => updateFocus(cardDateRef)}
                    onBlur={() => setIsFocused(false)}
                  >
                    <option value="" disabled>Year</option>
                    {Array.from({ length: 11 }, (_, i) => (
                      <option key={2024 + i} value={String(2024 + i).slice(-2)}>
                        {2024 + i}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="card-form__col -cvv">
              <div className="card-input">
                <label className="card-input__label">CVV</label>
                <input 
                  type="text" 
                  className="card-input__input" 
                  maxLength={4}
                  value={cardData.cvv}
                  onChange={(e) => onUpdate({ ...cardData, cvv: e.target.value })}
                  onFocus={() => setIsCvvFocused(true)}
                  onBlur={() => setIsCvvFocused(false)}
                />
              </div>
            </div>
          </div>

          <button type="submit" className="card-form__button">
            Proceed to Pay ₹{price.toLocaleString()}
          </button>
        </div>
      </div>
    </div>
  );
}
