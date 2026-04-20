package com.expense.tracker.controller;

import com.expense.tracker.dto.ApiResponse;
import com.expense.tracker.dto.BudgetSummaryDTO;
import com.expense.tracker.dto.CategoryBudgetSummaryDTO;
import com.expense.tracker.entity.Budget;
import com.expense.tracker.service.BudgetService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@CrossOrigin("*")
@RestController
@RequestMapping("/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    // Constructor Injection
    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Budget>> createOrUpdateBudget(@RequestBody Budget budget) {
        Budget savedBudget = budgetService.createOrUpdateBudget(budget);
        return ResponseEntity.ok(new ApiResponse<>(true, savedBudget, "success"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Budget>> getBudgetByMonthAndYear(
            @RequestParam("month") int month,
            @RequestParam("year") int year) {

        Optional<Budget> budgetOpt = budgetService.getBudgetByMonthAndYear(month, year);
        
        if (budgetOpt.isPresent()) {
            return ResponseEntity.ok(new ApiResponse<>(true, budgetOpt.get(), "success"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse<>(false, null, "Không tìm thấy dữ liệu ngân sách"));
        }
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<BudgetSummaryDTO>> getBudgetSummary(
            @RequestParam("month") int month,
            @RequestParam("year") int year) {

        BudgetSummaryDTO summary = budgetService.getBudgetSummary(month, year);

        // Xử lý nều tháng này chưa từng được đặt ngân sách
        if (summary == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse<>(false, null, "Không có dữ liệu ngân sách để tổng hợp"));
        }

        return ResponseEntity.ok(new ApiResponse<>(true, summary, "success"));
    }

    @GetMapping("/category")
    public ResponseEntity<ApiResponse<CategoryBudgetSummaryDTO>> getCategoryBudgetSummary(
            @RequestParam("category") String category,
            @RequestParam("month") int month,
            @RequestParam("year") int year) {

        CategoryBudgetSummaryDTO summary = budgetService.getCategoryBudgetSummary(category, month, year);

        if (summary == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse<>(false, null, "Chưa thiết lập ngân sách cho danh mục " + category));
        }

        return ResponseEntity.ok(new ApiResponse<>(true, summary, "success"));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategoryBudgetSummaryDTO>>> getCategoryBudgetsSummary(
            @RequestParam("month") int month,
            @RequestParam("year") int year,
            @RequestParam(value = "startDay", defaultValue = "1") int startDay) {
            
        List<CategoryBudgetSummaryDTO> list = budgetService.getAllCategoryBudgetsSummary(month, year, startDay);
        return ResponseEntity.ok(new ApiResponse<>(true, list, "success"));
    }

    @DeleteMapping("/categories")
    public ResponseEntity<ApiResponse<Void>> deleteCategoryBudget(
            @RequestParam("category") String category,
            @RequestParam("month") int month,
            @RequestParam("year") int year) {
            
        budgetService.deleteCategoryBudget(category, month, year);
        return ResponseEntity.ok(new ApiResponse<>(true, null, "Đã xoá danh mục vĩnh viễn"));
    }
}
