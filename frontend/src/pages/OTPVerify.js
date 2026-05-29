import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { sendOTP, verifyOTP } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function OTPVerify() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Enter your email');
    setLoading(true);
    try {
      await sendOTP(email);
      toast.success('OTP sent! Check console (demo mode)');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (idx, val) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[idx] = val.slice(-1);
    setOtp(newOtp);
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleOtpKey = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) inputRefs.current[idx - 1]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) return toast.error('Enter complete OTP');
    setLoading(true);
    try {
      const { data } = await verifyOTP(email, code);
      login(data.token, data.user);
      toast.success('Verified successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>DMart</h1>
        </div>
        {step === 1 ? (
          <>
            <h2 className="auth-title">Verify Email</h2>
            <p className="auth-subtitle">Enter your email to receive OTP</p>
            <form onSubmit={handleSendOTP}>
              <div className="form-group">
                <label>Email Address</label>
                <input className="form-input" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? '⏳ Sending...' : '📨 Send OTP'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="auth-title">Enter OTP</h2>
            <p className="auth-subtitle">OTP sent to {email}</p>
            <form onSubmit={handleVerify}>
              <div className="otp-inputs">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={el => inputRefs.current[idx] = el}
                    className="otp-input"
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(idx, e.target.value)}
                    onKeyDown={e => handleOtpKey(idx, e)}
                  />
                ))}
              </div>
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? '⏳ Verifying...' : '✅ Verify OTP'}
              </button>
            </form>
            <div className="auth-link">
              <a href="#resend" onClick={(e) => { e.preventDefault(); setStep(1); }}>Resend OTP</a>
            </div>
          </>
        )}
        <div className="auth-link" style={{ marginTop: 16 }}>
          <Link to="/login">← Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
