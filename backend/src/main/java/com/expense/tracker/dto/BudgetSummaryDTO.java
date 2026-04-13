package com.expense.tracker.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BudgetSummaryDTO {
    private Integer month;
    private Integer year;
    private BigDecimal limitAmount;
    private BigDecimal totalExpense;
    private BigDecimal remaining;
    private boolean exceeded;
}
