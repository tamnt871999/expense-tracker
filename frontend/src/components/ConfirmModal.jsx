import React from 'react';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
      {/* Lớp nền đen mờ (Overlay) */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onCancel} // Cho phép click bên ngoài để đóng
      ></div>

      {/* Box Nội dung Modal (nhảy Popup) */}
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-sm overflow-hidden z-10 transform transition-all animate-in zoom-in-95 fade-in duration-200">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            {/* Vòng tròn Đỏ Cảnh Báo */}
            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0 border border-rose-200 shadow-inner">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">{title || 'Xác nhận'}</h3>
            </div>
          </div>
          <p className="text-sm text-slate-500 font-medium ml-16 leading-relaxed">
            {message || 'Bạn có chắc chắn muốn tiến hành thao tác này không?'}
          </p>
        </div>
        
        {/* Phần Chân Modal (Footer chứa nút bấm) */}
        <div className="bg-slate-50/80 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
          <button 
            onClick={onCancel}
            className="px-5 py-2.5 font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 bg-white border border-slate-200 shadow-sm rounded-xl transition-all text-sm"
          >
            Hủy Bỏ
          </button>
          <button 
            onClick={onConfirm}
            className="px-5 py-2.5 font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-600/30 rounded-xl transition-all text-sm"
          >
            Đồng Ý Xoá
          </button>
        </div>
      </div>
    </div>
  );
}
