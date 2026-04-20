package com.expense.tracker.repository;

import com.expense.tracker.entity.Expense;
import com.expense.tracker.entity.ExpenseType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    // Bonus: Tìm danh sách giao dịch theo Loại (Thu hoặc Chi)
    List<Expense> findByType(ExpenseType type);

    // Bonus: Tìm danh sách giao dịch trong một khoảng thời gian cụ thể (rất hữu ích để tính tổng)
    List<Expense> findByDateBetween(LocalDate startDate, LocalDate endDate);

    // 1. Tính tổng tiền theo type (Thu hoặc Chi)
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.type = :type")
    BigDecimal sumAmountByType(@Param("type") ExpenseType type);

    // 2. Tính tổng tiền theo khoảng thời gian
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.date BETWEEN :startDate AND :endDate")
    BigDecimal sumAmountByDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // 3. Kết hợp tính tổng tiền theo cả type và khoảng thời gian
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.type = :type AND e.date BETWEEN :startDate AND :endDate")
    BigDecimal sumAmountByTypeAndDateBetween(
            @Param("type") ExpenseType type, 
            @Param("startDate") LocalDate startDate, 
            @Param("endDate") LocalDate endDate
    );

    // 4. Lấy danh sách giao dịch theo Khoảng Thời Gian (sắp xếp mới nhất lên đầu)
    @Query("SELECT e FROM Expense e WHERE e.date BETWEEN :startDate AND :endDate ORDER BY e.date DESC")
    List<Expense> findByDateBetweenSorted(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // 5. Tính tổng chi tiêu (EXPENSE) theo Danh mục trong chu kỳ giới hạn
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.type = com.expense.tracker.entity.ExpenseType.EXPENSE AND e.category = :category AND e.date BETWEEN :startDate AND :endDate")
    BigDecimal sumExpenseByCategoryAndDateBetween(@Param("category") String category, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
