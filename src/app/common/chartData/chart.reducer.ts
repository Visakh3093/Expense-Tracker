import { createReducer, on } from "@ngrx/store";
import { LabelModel, setExpenseLabel, setIncomeLabel,  } from "./chart.action";


const initialState:LabelModel = {
    ExpenseLabel:["test_1","test_2","test_3","test_4"],
    IncomeLabel:["Test_5","test_6","test_7"]
}


export const labelReducer = createReducer(
    initialState,
    on(setIncomeLabel,(state,{IncomeLabel})=>({...state,IncomeLabel})),
    on(setExpenseLabel,(state,{ExpenseLabel})=>({...state,ExpenseLabel}))

)
