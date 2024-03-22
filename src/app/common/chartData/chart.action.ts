import { createAction, props } from "@ngrx/store";

export interface LabelModel{
     ExpenseLabel:string[],
     IncomeLabel:string[]
}

export const setIncomeLabel = createAction('[chart] income',props<{IncomeLabel:string[]}>())
export const setExpenseLabel = createAction('[chart] expense',props<{ExpenseLabel:string[]}>())