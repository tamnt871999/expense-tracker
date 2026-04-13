package com.expense.tracker.controller;

import com.expense.tracker.dto.ApiResponse;
import com.expense.tracker.dto.ExpenseSummaryDTO;
import com.expense.tracker.entity.Expense;
import com.expense.tracker.service.ExpenseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    // Constructor Injection (Không dùng @Autowired)
    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Expense>> createExpense(@RequestBody Expense expense) {
        Expense createdExpense = expenseService.createExpense(expense);
        // Trả về HTTP 201 (Created) khi tạo thành công tài nguyên mới
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, createdExpense, "success"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Expense>>> getAllExpenses() {
        List<Expense> expenses = expenseService.getAllExpenses();
        // Trả về HTTP 200 (OK)
        return ResponseEntity.ok(new ApiResponse<>(true, expenses, "success"));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<ExpenseSummaryDTO>> getExpenseSummary(
            @RequestParam("month") int month,
            @RequestParam("year") int year) {
            
        ExpenseSummaryDTO summary = expenseService.getSummaryByMonth(year, month);
        return ResponseEntity.ok(new ApiResponse<>(true, summary, "success"));
    }

    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<List<Expense>>> getExpensesByMonth(
            @RequestParam("month") int month,
            @RequestParam("year") int year) {
            
        List<Expense> expenses = expenseService.getExpensesByMonth(month, year);
        return ResponseEntity.ok(new ApiResponse<>(true, expenses, "success"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExpense(@PathVariable("id") Long id) {
        try {
            expenseService.deleteExpense(id);
            return ResponseEntity.ok(new ApiResponse<>(true, null, "Xóa giao dịch thành công"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, null, e.getMessage()));
        }
    }
}
