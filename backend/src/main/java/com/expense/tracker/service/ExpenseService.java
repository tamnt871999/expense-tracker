package com.expense.tracker.service;

import com.expense.tracker.dto.ExpenseSummaryDTO;
import com.expense.tracker.entity.Expense;
import com.expense.tracker.entity.ExpenseType;
import com.expense.tracker.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    // Constructor Injection: Spring Boot sẽ tự động inject repository vào đây
    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public Expense createExpense(Expense expense) {
        // Bonus: Logic Validate để đảm bảo an toàn toàn vẹn dữ liệu
        if (expense.getType() == null) {
            throw new IllegalArgumentException("Loại giao dịch (Thu/Chi) không được bỏ trống");
        }
        if (expense.getAmount() == null || expense.getAmount().signum() <= 0) {
            throw new IllegalArgumentException("Số tiền không hợp lệ (Bắt buộc phải lơn hơn 0)");
        }
        if (expense.getDate() == null) {
            throw new IllegalArgumentException("Ngày của giao dịch không được bỏ trống");
        }

        return expenseRepository.save(expense);
    }

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    public List<Expense> getExpensesByMonth(int month, int year) {
        List<Expense> expenses = expenseRepository.findByMonthAndYear(month, year);
        
        // Xử lý an toàn: Tránh trả về null dễ gây lỗi NullPointerException ở vòng lặp
        if (expenses == null) {
            return java.util.Collections.emptyList();
        }
        
        return expenses;
    }

    public void deleteExpense(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw new IllegalArgumentException("Không tìm thấy giao dịch này");
        }
        expenseRepository.deleteById(id);
    }

    // Lấy thống kê theo một ngày cụ thể
    public ExpenseSummaryDTO getSummaryByDate(LocalDate date) {
        return calculateSummary(date, date);
    }

    // Lấy thống kê theo cả tháng
    public ExpenseSummaryDTO getSummaryByMonth(int year, int month) {
        // YearMonth là class cực hay của Java 8+ giúp dễ dàng tìm ngày đầu/cuối của bất kỳ tháng nào
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();
        
        return calculateSummary(startDate, endDate);
    }

    // Hàm private dùng chung để tính toán (tránh lặp lại code)
    private ExpenseSummaryDTO calculateSummary(LocalDate startDate, LocalDate endDate) {
        BigDecimal totalIncome = expenseRepository.sumAmountByTypeAndDateBetween(
                ExpenseType.INCOME, startDate, endDate);
        if (totalIncome == null) {
            totalIncome = BigDecimal.ZERO;
        }
                
        BigDecimal totalExpense = expenseRepository.sumAmountByTypeAndDateBetween(
                ExpenseType.EXPENSE, startDate, endDate);
        if (totalExpense == null) {
            totalExpense = BigDecimal.ZERO;
        }
                
        // Tính số dư (Balance)
        BigDecimal balance = totalIncome.subtract(totalExpense);
        
        return new ExpenseSummaryDTO(totalIncome, totalExpense, balance);
    }
}
