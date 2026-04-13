import React, { useState } from 'react';

export default function ExpenseForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    type: 'EXPENSE',
    amount: '',
    category: '',
    date: '',
    note: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
    // Xoá lỗi khi user bắt đầu gõ lại
    if (errorMsg) setErrorMsg('');
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); // Chặn hành vi F5 reload của trình duyệt mặc định

    // 1. Validate cơ bản
    if (!formData.amount || !formData.category || !formData.date) {
      setErrorMsg('Vui lòng nhập đủ Số tiền, Danh mục và Ngày!');
      return;
    }
    
    if (formData.amount <= 0) {
      setErrorMsg('Số tiền phải lớn hơn 0!');
      return;
    }

    setIsSubmitting(true);
    
    // 2. Gọi POST API Lưu
    try {
      const response = await fetch('http://localhost:8080/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // 3. Reset Form Trống về vạch xuất phát
        setFormData({ type: 'EXPENSE', amount: '', category: '', date: '', note: '' });
        
        // 4. Bắn tín hiệu "onSuccess" để Component Cha báo cho các Box khác Reload lấy dữ liệu mới
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setErrorMsg('Không thể lưu giao dịch lúc này.');
      }
    } catch (error) {
      console.error(error);
      setErrorMsg('Lỗi kết nối tới Backend Máy chủ!');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Thêm Giao Dịch</h2>
      
      {/* Hiển thị lỗi đỏ nếu Validation rớt */}
      {errorMsg && (
        <div className="mb-4 p-3 bg-rose-50 text-rose-600 text-sm font-medium rounded-lg">
          ⚠️ {errorMsg}
        </div>
      )}
      
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Type Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${formData.type === 'EXPENSE' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setFormData({...formData, type: 'EXPENSE'})}
          >
            Khoản Chi
          </button>
          <button 
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${formData.type === 'INCOME' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setFormData({...formData, type: 'INCOME'})}
          >
            Khoản Thu
          </button>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Số tiền (VNĐ)</label>
          <input 
            type="number" 
            name="amount"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium"
            placeholder="Ví dụ: 50000"
            value={formData.amount}
            onChange={handleChange}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Danh mục</label>
          <input 
            type="text" 
            name="category"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium text-slate-700"
            placeholder="Ví dụ: Ăn uống, Thuê nhà"
            value={formData.category}
            onChange={handleChange}
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Ngày diễn ra</label>
          <input 
            type="date" 
            name="date"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium text-slate-700"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Ghi chú thêm</label>
          <textarea 
            name="note"
            rows="3"
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none text-sm text-slate-700"
            placeholder="Diễn giải thêm..."
            value={formData.note}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Submit */}
        <button 
          type="submit"
          disabled={isSubmitting}
          className={`w-full font-bold py-3 text-sm rounded-xl transition-all mt-2 
            ${isSubmitting 
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30'}`}
        >
          {isSubmitting ? 'ĐANG LƯU DỮ LIỆU...' : 'LƯU GIAO DỊCH'}
        </button>
      </form>
    </div>
  );
}
