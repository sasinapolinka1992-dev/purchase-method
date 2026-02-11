
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', ...props }) => {
  const base = "px-4 py-2 rounded-[6px] transition-all duration-200 font-medium text-sm flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-[#69C] text-white hover:bg-[#58a0b0] shadow-sm",
    secondary: "bg-[#EAEAEA] text-[#333] hover:bg-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600",
    outline: "border border-[#69C] text-[#69C] hover:bg-[#69C]/10"
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => (
  <input
    className={`w-full border border-gray-300 rounded-[4px] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#69C] ${className}`}
    {...props}
  />
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ children, className = '', ...props }) => (
  <select
    className={`w-full border border-gray-300 rounded-[4px] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#69C] bg-white ${className}`}
    {...props}
  >
    {children}
  </select>
);

export const Toggle: React.FC<{ checked: boolean; onChange: () => void; label?: string }> = ({ checked, onChange, label }) => (
  <label className="inline-flex items-center cursor-pointer">
    <div className="relative">
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      <div className={`block w-10 h-6 rounded-full transition-colors ${checked ? 'bg-[#69C]' : 'bg-gray-300'}`}></div>
      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`}></div>
    </div>
    {label && <span className="ml-3 text-sm text-gray-700">{label}</span>}
  </label>
);
