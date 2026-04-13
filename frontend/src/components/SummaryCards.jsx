import React from 'react';

export default function SummaryCards({ income, expense, balance, isLoading }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        <div className="bg-slate-200 h-32 rounded-2xl"></div>
        <div className="bg-slate-200 h-32 rounded-2xl"></div>
        <div className="bg-indigo-200 h-32 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Income Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between transition hover:shadow-md">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">Tổng Thu</p>
          <h3 className="text-2xl font-bold text-emerald-600">{formatCurrency(income)}</h3>
        </div>
        <div className="h-12 w-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center text-xl">
          ↓
        </div>
      </div>

      {/* Expense Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between transition hover:shadow-md">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">Tổng Chi</p>
          <h3 className="text-2xl font-bold text-rose-500">{formatCurrency(expense)}</h3>
        </div>
        <div className="h-12 w-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center text-xl">
          ↑
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between text-white transition hover:shadow-md">
        <div>
          <p className="text-sm font-medium text-blue-100 mb-1">Số dư hiện tại</p>
          <h3 className="text-2xl font-bold">{formatCurrency(balance)}</h3>
        </div>
        <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center text-xl">
          =
        </div>
      </div>
    </div>
  );
}
