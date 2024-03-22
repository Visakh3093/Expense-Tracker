import { createFeatureSelector, createSelector } from "@ngrx/store";
import { LabelModel } from "./chart.action";



const selctorState = createFeatureSelector<LabelModel>('labelReducer')

export const SelectIncomeLabel = createSelector(
    selctorState,
    (state)=>(state.IncomeLabel)
)
export const SelectExpenseLabel = createSelector(
    selctorState,
    (state)=>(state.ExpenseLabel)
)