import React, { useState, useEffect } from 'react';
import SummaryCards from './components/SummaryCards';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import CustomDropdown from './components/CustomDropdown';
import CategoryBudgetsList from './components/CategoryBudgetsList';
function App() {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const [summaryData, setSummaryData] = useState({ income: 0, expense: 0, balance: 0 });
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Biến trạng thái để báo hiệu tải lại data

  // Load Dữ liệu tóm tắt thu chi phụ thuộc vào Filter
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsLoadingSummary(true);
        // Gọi API Backend Spring Boot
        const response = await fetch(`http://localhost:8080/expenses/summary?month=${selectedMonth}&year=${selectedYear}`);
        const result = await response.json();
        
        if (result.success) {
          setSummaryData({
             income: result.data.totalIncome || 0,
             expense: result.data.totalExpense || 0,
             balance: result.data.balance || 0
          });
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu tổng quan:", error);
      } finally {
        setTimeout(() => setIsLoadingSummary(false), 500); 
      }
    };

    fetchSummary();
  }, [refreshTrigger, selectedMonth, selectedYear]); // Kích hoạt lại Effect này bất cứ khi nào CẦN TẢI LẠI hoặc người dùng TÙY CHỈNH THÁNG NĂM

  // Options sinh động cho Dropdown mới
  const monthOptions = [...Array(12)].map((_, i) => ({ value: i + 1, label: `Tháng ${i + 1}` }));
  const yearOptions = [2024, 2025, 2026, 2027, 2028].map(y => ({ value: y, label: `Năm ${y}` }));

  return (
    <div className="min-h-screen bg-slate-50/80 font-sans text-slate-900 pb-12">
      <header className="bg-indigo-600 text-white shadow-md sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white p-1.5 rounded-lg shadow-sm hidden sm:block">
              <span className="text-xl leading-none block">💰</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight">Trình Quản Lý Chi Tiêu</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <CustomDropdown 
              options={monthOptions}
              value={selectedMonth}
              onChange={setSelectedMonth}
              icon="📅"
              variant="glass"
            />
            <CustomDropdown 
              options={yearOptions}
              value={selectedYear}
              onChange={setSelectedYear}
              variant="glass"
            />
          </div>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Top Widget Section */}
        <div className="mb-8 space-y-6">
          <SummaryCards 
            income={summaryData.income} 
            expense={summaryData.expense} 
            balance={summaryData.balance} 
            isLoading={isLoadingSummary}
          />
          <CategoryBudgetsList 
            month={selectedMonth}
            year={selectedYear}
            refreshTrigger={refreshTrigger}
            onBudgetCreated={() => setRefreshTrigger(prev => prev + 1)}
          />
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 lg:sticky lg:top-24">
            <ExpenseForm onSuccess={() => setRefreshTrigger(prev => prev + 1)} />
          </div>
          <div className="lg:col-span-2">
            <ExpenseList 
              refreshTrigger={refreshTrigger}
              month={selectedMonth}
              year={selectedYear}
              onDeleteSuccess={() => setRefreshTrigger(prev => prev + 1)}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
