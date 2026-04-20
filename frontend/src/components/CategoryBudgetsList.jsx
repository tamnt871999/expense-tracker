import React, { useState, useEffect } from 'react';
import ConfirmModal from './ConfirmModal';

export default function CategoryBudgetsList({ month, year, startDay, refreshTrigger, onBudgetCreated }) {
  const [categoryBudgets, setCategoryBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Trạng thái Quản lý Form nhập
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newLimit, setNewLimit] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Trạng thái Xoá Danh Mục
  const [deleteData, setDeleteData] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchCategoryBudgets = async () => {
      try {
        const response = await fetch(`http://localhost:8080/budgets/categories?month=${month}&year=${year}&startDay=${startDay}`);
        const result = await response.json();
        
        if (result.success) {
          setCategoryBudgets(result.data);
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách ngân sách danh mục", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategoryBudgets();
  }, [month, year, startDay, refreshTrigger]);

  const handleCreateBudget = async (e) => {
    e.preventDefault();
    if (!newCategory.trim() || !newLimit) return;
    setIsSubmitting(true);
    
    const payload = {
        month: Number(month),
        year: Number(year),
        limitAmount: Number(newLimit.toString().replace(/,/g, '')),
        category: newCategory.trim()
    };
    
    try {
        const response = await fetch('http://localhost:8080/budgets', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(payload)
        });
        const result = await response.json();
        
        if (result.success) {
            setNewCategory('');
            setNewLimit('');
            setIsFormOpen(false); // Thành công thì đóng khép lại Form
            if (onBudgetCreated) onBudgetCreated(); // Giật dây kéo cả Website Update
        }
    } catch (err) {
        console.error("Lỗi:", err);
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDeleteBudget = async () => {
      if (!deleteData) return;
      setIsDeleting(true);
      try {
          const response = await fetch(`http://localhost:8080/budgets/categories?category=${deleteData.category}&month=${deleteData.month}&year=${deleteData.year}`, {
              method: 'DELETE'
          });
          const result = await response.json();
          if (result.success) {
              setDeleteData(null);
              if (onBudgetCreated) onBudgetCreated();
          }
      } catch (err) {
          console.error("Lỗi xoá", err);
      } finally {
          setIsDeleting(false);
      }
  };

  const handleEdit = (b) => {
      setNewCategory(b.category);
      setNewLimit(b.limitAmount.toString());
      setIsFormOpen(true);
      // Cuộn lên phần Form để người dùng thấy rõ
  };

  const formatCurrency = (value) => 
     new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  // Tính tổng cộng quỹ của tất cả các danh mục để báo cáo góc trên
  const totalAllocated = categoryBudgets.reduce((acc, curr) => acc + curr.limitAmount, 0);
  const totalSpentAcrossCategories = categoryBudgets.reduce((acc, curr) => acc + curr.totalSpent, 0);

  return (
    <div className="bg-white/80 rounded-2xl shadow-sm border border-slate-100 p-6 mt-8 relative">
      <div className="flex justify-between items-center mb-6">
         <div>
           <h2 className="text-xl font-bold text-slate-800">
             🚥 Kiểm soát Ngân Sách Danh Mục
           </h2>
           {!isLoading && categoryBudgets.length > 0 && (
             <p className="text-sm text-slate-500 font-medium mt-1.5 flex items-center gap-2">
                Tổng cấp: <span className="text-indigo-600 font-bold">{formatCurrency(totalAllocated)}</span> 
                <span className="text-slate-300">|</span> 
                Đã tiêu: <span className="text-slate-700 font-bold">{formatCurrency(totalSpentAcrossCategories)}</span>
             </p>
           )}
         </div>
         <button 
           onClick={() => setIsFormOpen(!isFormOpen)}
           className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm border border-indigo-100"
         >
           {isFormOpen ? '✖ Đóng' : '+ Cấp Ngân Sách Mới'}
         </button>
      </div>

      {/* Giao diện Form thêm mới Ngân sách con */}
      {isFormOpen && (
        <form onSubmit={handleCreateBudget} className="mb-8 p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex flex-wrap gap-4 items-end animate-in fade-in slide-in-from-top-2 duration-300 relative z-20">
           <div className="flex-1 min-w-[200px]">
             <label className="block text-xs font-bold text-indigo-900/60 uppercase tracking-wider mb-2">
                Tên Danh Mục
             </label>
             <input required type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Ví dụ: Ăn uống, Xăng xe..." className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-3 outline-none font-medium shadow-sm transition-all"/>
           </div>
           <div className="flex-1 min-w-[200px]">
             <label className="block text-xs font-bold text-indigo-900/60 uppercase tracking-wider mb-2">
                Giới hạn chi tiêu (VNĐ)
             </label>
             <input required type="number" min="1000" value={newLimit} onChange={e => setNewLimit(e.target.value)} placeholder="Nhập hạn mức..." className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-3 outline-none font-bold shadow-sm transition-all"/>
           </div>
           <button disabled={isSubmitting} type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 rounded-xl shadow-md transition-colors disabled:opacity-50 h-[46px] border border-indigo-500 text-sm">
              Lưu Thiết Lập
           </button>
        </form>
      )}

      {/* Hiển thị Mảng Progress Bar */}
      {isLoading ? (
         <div className="h-20 bg-slate-100 rounded-xl animate-pulse"></div>
      ) : categoryBudgets.length === 0 ? (
         <div className="text-center p-10 bg-slate-50/50 rounded-2xl border border-slate-100/50 text-slate-400 font-medium">
            Tháng này chưa từng cấp Ngân sách cho danh mục lẻ nào. Điền thử rồi chuyển tháng để xem sự kỳ diệu nhé!
         </div>
      ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 relative z-10">
            {categoryBudgets.map((b) => {
               // Thuật toán phần trăm an toàn không vượt quá 100 UI
               const percent = b.limitAmount > 0 ? (b.totalSpent / b.limitAmount) * 100 : 0;
               const UIwidth = percent > 100 ? 100 : percent;

               return (
                 <div key={b.category} className="bg-white border border-slate-100 hover:border-slate-200 hover:shadow-md rounded-2xl p-5 shadow-sm transition-all group relative overflow-hidden">
                   
                   {/* Background Gradient đỏ thẫm nhẹ ở dưới cùng nếu bị vượt mức */}
                   {b.exceeded && <div className="absolute inset-0 bg-gradient-to-t from-rose-50/50 to-transparent pointer-events-none"></div>}

                   <div className="flex justify-between items-end mb-5 relative z-10">
                      <div>
                        <div className="flex items-center gap-3 mb-0.5">
                          <h3 className="font-extrabold text-slate-800 text-lg tracking-tight group-hover:text-indigo-600 transition-colors">
                              {b.category}
                          </h3>
                          {/* Action Buttons (Edit/Delete) - Nút kề sát tiêu đề */}
                          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => handleEdit(b)} title="Chỉnh sửa hạn mức" className="p-1.5 bg-slate-100 hover:bg-indigo-100 text-slate-500 hover:text-indigo-600 rounded-lg transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                   <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                </svg>
                             </button>
                             <button onClick={() => setDeleteData({ category: b.category, month, year })} title="Xoá Danh Mục" className="p-1.5 bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 rounded-lg transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                   <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                             </button>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-slate-500">
                            Đã chi: <span className="text-slate-700">{formatCurrency(b.totalSpent)}</span> 
                            <span className="mx-1 text-slate-300">/</span> 
                            {formatCurrency(b.limitAmount)}
                        </p>
                      </div>
                      
                      {/* Huy hiệu nhãn dán Cảnh báo/An toàn */}
                      <div className={`text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm border ${
                          b.exceeded 
                            ? 'bg-rose-50 text-rose-700 border-rose-100' 
                            : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      }`}>
                        {b.exceeded ? (
                            <span className="flex items-center gap-1">⚠ VƯỢT {formatCurrency(b.remaining * -1)}</span>
                        ) : (
                            <span className="flex items-center gap-1">✓ DƯ {formatCurrency(b.remaining)}</span>
                        )}
                      </div>
                   </div>
                   
                   {/* Thanh Progress Bar 2 lớp chuẩn Design System */}
                   <div className="relative w-full h-3.5 bg-slate-100/80 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
                     <div 
                        className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out flex items-center justify-end pr-2 ${
                            b.exceeded 
                              ? 'bg-gradient-to-r from-rose-400 to-rose-500' 
                              : 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                        }`}
                        style={{ width: `${UIwidth}%` }}
                     >
                        <div className="absolute inset-0 bg-white/20 w-1/4 h-full -skew-x-12 translate-x-[-200%] group-hover:animate-[shimmer_1.5s_infinite]"></div>
                     </div>
                   </div>

                 </div>
               )
            })}
         </div>
      )}

      {/* Model Xác Nhận Xoá */}
      <ConfirmModal 
        isOpen={deleteData !== null}
        title="Huỷ Ngân Sách Danh Mục"
        message={`Bạn có chắc chắn muốn ngừng cấp ngân sách cho danh mục "${deleteData?.category}" trong tháng ${deleteData?.month}/${deleteData?.year} này không? (Hành động này không xoá các giao dịch thuộc danh mục đó)`}
        onConfirm={handleDeleteBudget}
        onCancel={() => setDeleteData(null)}
        isLoading={isDeleting}
      />
    </div>
  )
}
