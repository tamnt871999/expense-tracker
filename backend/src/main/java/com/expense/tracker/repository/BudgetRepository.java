package com.expense.tracker.repository;

import com.expense.tracker.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {

    // Lấy Ngân sách Chung (Category bắt buộc là null theo thiết kế)
    Optional<Budget> findByMonthAndYearAndCategoryIsNull(Integer month, Integer year);

    // Lấy Danh sách các Ngân sách Danh mục (Tất cả những Budget có gán tên Category)
    List<Budget> findAllByMonthAndYearAndCategoryIsNotNull(Integer month, Integer year);

    // Lấy Budget dựa trên đúng hạng mục cụ thể đó
    Optional<Budget> findByCategoryAndMonthAndYear(String category, Integer month, Integer year);

    // Xoá sổ riêng một Budget danh mục
    @Modifying
    @Transactional
    void deleteByCategoryAndMonthAndYear(String category, Integer month, Integer year);
}
