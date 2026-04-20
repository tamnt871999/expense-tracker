package com.expense.tracker.service;

import com.expense.tracker.dto.BudgetSummaryDTO;
import com.expense.tracker.dto.CategoryBudgetSummaryDTO;
import com.expense.tracker.entity.Budget;
import com.expense.tracker.entity.ExpenseType;
import com.expense.tracker.repository.BudgetRepository;
import com.expense.tracker.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;

    public BudgetService(BudgetRepository budgetRepository, ExpenseRepository expenseRepository) {
        this.budgetRepository = budgetRepository;
        this.expenseRepository = expenseRepository;
    }

    public Budget createOrUpdateBudget(Budget requestBudget) {
        if (requestBudget.getLimitAmount() == null || requestBudget.getLimitAmount().signum() <= 0) {
            throw new IllegalArgumentException("Hạn mức (Limit amount) phải lớn hơn 0");
        }
        if (requestBudget.getMonth() == null || requestBudget.getMonth() < 1 || requestBudget.getMonth() > 12) {
            throw new IllegalArgumentException("Tháng không hợp lệ (Khoảng từ 1 đến 12)");
        }
        if (requestBudget.getYear() == null || requestBudget.getYear() <= 2000) {
            throw new IllegalArgumentException("Năm không hợp lệ");
        }

        Optional<Budget> existingBudgetOpt;
        
        // Cơ chế bẻ lái tự động: Phân biệt lưu ngân sách TỔNG hay lưu ngân sách DANH MỤC
        if (requestBudget.getCategory() == null || requestBudget.getCategory().trim().isEmpty()) {
            requestBudget.setCategory(null); // Chuẩn hoá dữ liệu để Database không lưu " "
            existingBudgetOpt = budgetRepository.findByMonthAndYearAndCategoryIsNull(requestBudget.getMonth(), requestBudget.getYear());
        } else {
            existingBudgetOpt = budgetRepository.findByCategoryAndMonthAndYear(requestBudget.getCategory(), requestBudget.getMonth(), requestBudget.getYear());
        }

        if (existingBudgetOpt.isPresent()) {
            Budget existingBudget = existingBudgetOpt.get();
            // Nếu đã tồn tại mốc thời gian đó, chỉ việc nới rộng/bóp hẹp hạn mức lại
            existingBudget.setLimitAmount(requestBudget.getLimitAmount());
            return budgetRepository.save(existingBudget);
        } else {
            return budgetRepository.save(requestBudget);
        }
    }

    public Optional<Budget> getBudgetByMonthAndYear(int month, int year) {
        return budgetRepository.findByMonthAndYearAndCategoryIsNull(month, year);
    }

    public BudgetSummaryDTO getBudgetSummary(int month, int year) {
        // Chỉ lấy ngân sách chung (Tổng)
        Optional<Budget> budgetOpt = budgetRepository.findByMonthAndYearAndCategoryIsNull(month, year);

        if (budgetOpt.isEmpty()) {
            return null;
        }

        BigDecimal limitAmount = budgetOpt.get().getLimitAmount();

        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        BigDecimal totalExpense = expenseRepository.sumAmountByTypeAndDateBetween(
                ExpenseType.EXPENSE, startDate, endDate);

        if (totalExpense == null) {
            totalExpense = BigDecimal.ZERO;
        }

        BigDecimal remaining = limitAmount.subtract(totalExpense);
        boolean exceeded = remaining.signum() < 0; 

        return new BudgetSummaryDTO(month, year, limitAmount, totalExpense, remaining, exceeded);
    }

    public CategoryBudgetSummaryDTO getCategoryBudgetSummary(String category, int month, int year) {
        Optional<Budget> budgetOpt = budgetRepository.findByCategoryAndMonthAndYear(category, month, year);

        if (budgetOpt.isEmpty()) {
            return null;
        }

        BigDecimal limitAmount = budgetOpt.get().getLimitAmount();
        LocalDate[] cycle = ExpenseService.calculateBillingCycle(year, month, 1); // Tránh lỗi biên dịch (Fallback StartDay = 1)
        BigDecimal totalSpent = expenseRepository.sumExpenseByCategoryAndDateBetween(category, cycle[0], cycle[1]);

        if (totalSpent == null) {
            totalSpent = BigDecimal.ZERO;
        }

        BigDecimal remaining = limitAmount.subtract(totalSpent);
        boolean exceeded = remaining.signum() < 0;

        return new CategoryBudgetSummaryDTO(category, month, year, limitAmount, totalSpent, remaining, exceeded);
    }

    // --- NEW ---
    // Gom tất thảy những ngân sách lẻ tẻ có rớt chữ Category vào thành 1 mảng DTO chung
    public List<CategoryBudgetSummaryDTO> getAllCategoryBudgetsSummary(int month, int year, int startDay) {
        LocalDate[] cycle = ExpenseService.calculateBillingCycle(year, month, startDay);
        List<Budget> budgets = budgetRepository.findAllByMonthAndYearAndCategoryIsNotNull(month, year);
        
        // Thuật toán Auto-Clone: Tìm copy dữ liệu từ tháng trước nếu tháng này rỗng
        if (budgets.isEmpty()) {
            YearMonth previousMonth = YearMonth.of(year, month).minusMonths(1);
            List<Budget> prevBudgets = budgetRepository.findAllByMonthAndYearAndCategoryIsNotNull(
                    previousMonth.getMonthValue(), previousMonth.getYear());
            
            if (!prevBudgets.isEmpty()) {
                budgets = prevBudgets.stream().map(prev -> {
                    Budget cloned = new Budget();
                    cloned.setCategory(prev.getCategory());
                    cloned.setMonth(month);
                    cloned.setYear(year);
                    cloned.setLimitAmount(prev.getLimitAmount());
                    return budgetRepository.save(cloned);
                }).collect(Collectors.toList());
            }
        }

        return budgets.stream().map(budget -> {
            String category = budget.getCategory();
            BigDecimal limitAmount = budget.getLimitAmount();
            
            // Query Tổng tiền đã vung tay của Danh mục này dựa trên Chu Kỳ Cá Nhân thực tế
            BigDecimal totalSpent = expenseRepository.sumExpenseByCategoryAndDateBetween(category, cycle[0], cycle[1]);
            if (totalSpent == null) totalSpent = BigDecimal.ZERO;
            
            BigDecimal remaining = limitAmount.subtract(totalSpent);
            boolean exceeded = remaining.signum() < 0;
            
            // Cuốn tất cả kết quả tính toán vào DTO
            return new CategoryBudgetSummaryDTO(category, month, year, limitAmount, totalSpent, remaining, exceeded);
        }).collect(Collectors.toList());
    }

    public void deleteCategoryBudget(String category, int month, int year) {
        budgetRepository.deleteByCategoryAndMonthAndYear(category, month, year);
    }
}
