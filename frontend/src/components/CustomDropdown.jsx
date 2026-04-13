import React, { useState, useRef, useEffect } from 'react';

export default function CustomDropdown({ options, value, onChange, icon, variant = 'glass' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Tắt Dropdown tự động khi người dùng nhấp chuột ra vùng ngoài (click outside)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  // Styling linh hoạt cho khả năng tái sử dụng (Có chế độ Glass cho Header tối màu, và chế độ Solid cho nền trắng)
  const triggerStyles = variant === 'glass' 
    ? "bg-indigo-500/30 hover:bg-indigo-500/50 text-white border-transparent focus:ring-white/30 backdrop-blur-md"
    : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 focus:ring-indigo-500/20";
    
  const iconColor = variant === 'glass' ? "text-indigo-200" : "text-slate-400";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Nút hiển thị */}
      <button 
        type="button"
        className={`flex items-center justify-between gap-3 min-w-[130px] px-4 py-2.5 rounded-xl border shadow-sm transition-all font-semibold focus:outline-none focus:ring-2 ${triggerStyles}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {icon && <span className={iconColor}>{icon}</span>}
          <span>{selectedOption ? selectedOption.label : 'Chọn...'}</span>
        </div>
        <svg 
          className={`w-4 h-4 transition-transform duration-300 ${iconColor} ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      {/* Hiệu ứng Dropdown nổi bọt kiểu iOS (Apple UI) */}
      {isOpen && (
        <div className="absolute right-0 z-50 w-full min-w-[150px] mt-2 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(30,27,75,0.4)] border border-slate-100 py-2 max-h-60 overflow-y-auto transform origin-top-right transition-all animate-in fade-in zoom-in-95 duration-200">
          {options.map((option) => (
            <div 
              key={option.value}
              className={`px-4 py-2.5 cursor-pointer text-sm font-bold transition-all mx-2 rounded-xl mb-0.5
                ${option.value === value 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
