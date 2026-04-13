package com.expense.tracker.dto;

import java.math.BigDecimal;

public class CategoryBudgetSummaryDTO {
    private String category;
    private int month;
    private int year;
    private BigDecimal limitAmount;
    private BigDecimal totalSpent;
    private BigDecimal remaining;
    private boolean exceeded;

    public CategoryBudgetSummaryDTO() {
    }

    public CategoryBudgetSummaryDTO(String category, int month, int year, BigDecimal limitAmount, BigDecimal totalSpent, BigDecimal remaining, boolean exceeded) {
        this.category = category;
        this.month = month;
        this.year = year;
        this.limitAmount = limitAmount;
        this.totalSpent = totalSpent;
        this.remaining = remaining;
        this.exceeded = exceeded;
    }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public int getMonth() { return month; }
    public void setMonth(int month) { this.month = month; }

    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }

    public BigDecimal getLimitAmount() { return limitAmount; }
    public void setLimitAmount(BigDecimal limitAmount) { this.limitAmount = limitAmount; }

    public BigDecimal getTotalSpent() { return totalSpent; }
    public void setTotalSpent(BigDecimal totalSpent) { this.totalSpent = totalSpent; }

    public BigDecimal getRemaining() { return remaining; }
    public void setRemaining(BigDecimal remaining) { this.remaining = remaining; }

    public boolean isExceeded() { return exceeded; }
    public void setExceeded(boolean exceeded) { this.exceeded = exceeded; }
}
