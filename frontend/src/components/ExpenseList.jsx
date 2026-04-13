import React, { useState, useEffect } from 'react';
import ConfirmModal from './ConfirmModal'; // 1. Nhúng Modal siêu phẩm vừa chế tạo

export default function ExpenseList({ refreshTrigger, month, year, onDeleteSuccess }) {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Chế tạo State riêng để nuôi Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  // Hook nạp dữ liệu thật. Mảng dependency giúp nó tự động chạy lại nếu prop thay đổi
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch(`http://localhost:8080/expenses/filter?month=${month}&year=${year}`);
        const result = await response.json();
        
        if (result.success) {
          setExpenses(result.data);
        }
      } catch (error) {
        console.error("Lỗi Tải Bảng Giao Dịch:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, [refreshTrigger, month, year]);

  // Hành động 1: Mở Pop-up chứ không xoá liền
  const requestDelete = (item) => {
    setExpenseToDelete(item);
    setIsModalOpen(true);
  };

  // Hành động 2: Đồng Ý xoá từ Modal
  const executeDelete = async () => {
    if (!expenseToDelete) return;
    
    // Đóng Modal dứt khoát trước cả khi gọi đường truyền (UX xịn)
    setIsModalOpen(false);

    try {
      const response = await fetch(`http://localhost:8080/expenses/${expenseToDelete.id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        if (onDeleteSuccess) {
          onDeleteSuccess(); // Kéo cò refreshTrigger ở Tầng Cha
        }
      } else {
        alert('Có lỗi xảy ra, server từ chối xoá!');
      }
    } catch (error) {
      console.error(error);
      alert('Lệch đường truyền, không thể kết nối tới Backend.');
    } finally {
      // Đổ rác khỏi bộ nhớ Modal
      setExpenseToDelete(null); 
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800">Lịch sử Giao Dịch</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold border-b border-slate-100">Ngày</th>
                <th className="p-4 font-semibold border-b border-slate-100">Danh mục</th>
                <th className="p-4 font-semibold border-b border-slate-100">Loại</th>
                <th className="p-4 font-semibold border-b border-slate-100 text-right">Số tiền</th>
                <th className="p-4 font-semibold border-b border-slate-100 text-center w-12">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400 font-medium animate-pulse">
                    Đang đồng bộ dữ liệu...
                  </td>
                </tr>
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-slate-400 font-medium">
                    Hiện bạn chưa có giao dịch nào. Hãy thêm ở form nhé.
                  </td>
                </tr>
              ) : (
                expenses.map((item) => (
                  <tr key={item.id} className="hover:bg-indigo-50/60 transition-colors group">
                    <td className="p-4 text-sm text-slate-500">{formatDate(item.date)}</td>
                    <td className="p-4 font-medium text-slate-800">{item.category}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.type === 'INCOME' 
                          ? 'bg-emerald-100/80 text-emerald-700' 
                          : 'bg-rose-100/80 text-rose-600'
                      }`}>
                        {item.type === 'INCOME' ? 'THU NHẬP' : 'CHI TIÊU'}
                      </span>
                    </td>
                    <td className={`p-4 text-right font-bold text-lg tracking-tight ${
                        item.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                      {item.type === 'INCOME' ? '+' : '-'}{formatCurrency(item.amount)}
                    </td>
                    <td className="p-4 text-center items-center justify-center">
                      <button 
                        onClick={() => requestDelete(item)} // Gọi State Modal thay vì Browser Alert
                        className="text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-all p-2 rounded-full opacity-0 group-hover:opacity-100"
                        title="Xoá hoá đơn này"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Tích hợp Component Modal (Tàng hình nằm im chờ sự kiện isOpen=true) */}
      <ConfirmModal 
        isOpen={isModalOpen}
        title="Cảnh báo gỡ dữ liệu"
        message={expenseToDelete ? `Bạn có chắc chắn muốn xoá vĩnh viễn hoá đơn: "${expenseToDelete.category}" với số tiền ${formatCurrency(expenseToDelete.amount)} không?` : ''}
        onCancel={() => {
          setIsModalOpen(false);
          setExpenseToDelete(null);
        }}
        onConfirm={executeDelete}
      />
    </>
  );
}
