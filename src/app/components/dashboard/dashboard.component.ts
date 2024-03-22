import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { isEmpty } from 'lodash';
import { FireStoreService } from '../../services/fire-store.service';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ExpenseModal } from '../../model/common.interface';

import { DoughnutChartComponent } from '../doughnut-chart/doughnut-chart.component';
import { Store } from '@ngrx/store';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData } from 'chart.js';
import { ChartEvent } from 'chart.js/dist/core/core.plugins';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DoughnutChartComponent, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  amountRegex: RegExp = /^\d+$/
  errorObj: { [key: string]: string } = {}
  item$: Observable<any[]>
  firebaseData: ExpenseModal[] = []
  balance: number = 0
  income: number = 0
  expense: number = 0
  update: string = ''

  public IncomedoughnutChartData: ChartData<'doughnut'> = {
    labels: ["click_1","click_2"],
    datasets: [
      { data: [10,10] ,
        // borderWidth:0,
        backgroundColor: [
          'RGB(100, 100, 255)',   // Blue
          'RGB(100, 100, 100)',   // Dark Gray
          'RGB(255, 255, 0)',     // Yellow
          'RGB(128, 0, 128)',     // Purple
          'RGB(255, 0, 0)',       // Red
          'RGB(0, 128, 0)',       // Green
          'RGB(0, 0, 255)',       // Blue
          'RGB(255, 165, 0)',     // Orange
          'RGB(0, 255, 255)',     // Cyan
          'RGB(255, 192, 203)',   // Pink
          'RGB(0, 255, 0)',       // Lime Green
          'RGB(255, 69, 0)',      // Red-Orange
          'RGB(0, 255, 127)',     // Spring Green
          'RGB(70, 130, 180)',    // Steel Blue
          'RGB(218, 112, 214)', 
          'RGB(100, 100, 255)',   // Blue
          'RGB(100, 100, 100)',   // Dark Gray
          'RGB(255, 255, 0)',   // Orchid
        ]
        
      }
    ],
  };

  

  public ExpensedoughnutChartData: ChartData<'doughnut'> = {
    labels: ["click_1","click_2"],
    datasets: [
      { data: [10,10],
      // borderWidth:0,
        backgroundColor: [
          'RGB(0, 255, 255)',     // Cyan
          'RGB(255, 0, 255)',     // Magenta
          'RGB(255, 140, 0)',     // Dark Orange
          'RGB(173, 255, 47)',    // Green-Yellow
          'RGB(0, 128, 128)',     // Teal
          'RGB(218, 112, 214)',   // Orchid
          'RGB(255, 192, 203)',   // Pink
          'RGB(0, 0, 139)',       // Dark Blue
          'RGB(128, 128, 0)',     // Olive
          'RGB(255, 69, 0)',      // Red-Orange
        ]
        
       }
    ],
  };


    
  

  constructor(private cdr: ChangeDetectorRef, private auth: AuthService, private router: Router, private firestoreService: FireStoreService, private store: Store) {
    this.item$ = firestoreService.getExpense()

  }

  ngOnInit(): void {
    this.item$.subscribe(res => {
      this.balance = 0;
      this.income = 0;
      this.expense = 0;
      this.IncomedoughnutChartData.labels= []
      this.ExpensedoughnutChartData.labels =[]
      this.ExpensedoughnutChartData.datasets[0].data = []
      this.IncomedoughnutChartData.datasets[0].data = []

      if (res) {
        this.firebaseData = res;
        this.firebaseData.forEach((item) => {
          if (item.type == "income") {
            const isAvailable = this.IncomedoughnutChartData.labels?.forEach(element => {
              element == item.category
            });
            if(!isAvailable)
            {
              this.IncomedoughnutChartData.labels?.push(item.category)
            }
            this.IncomedoughnutChartData.datasets[0].data.push(parseInt(item.amount))
            this.income += parseInt(item.amount);
            this.balance += parseInt(item.amount);
          } else {

            
            const isAvailable = this.ExpensedoughnutChartData.labels?.forEach(element => {
              console.log(element);
              
              element == item.category
            });
            console.log(isAvailable);
            
            if(isAvailable == undefined)
            {
              this.ExpensedoughnutChartData.labels?.push(item.category)
            }
            this.ExpensedoughnutChartData.datasets[0].data.push(parseInt(item.amount))
            this.expense += parseInt(item.amount);
            this.balance -= parseInt(item.amount);
          }
        });
        this.cdr.detectChanges();
      }
    });
    console.log("ExpenseChartData:  ", this.ExpensedoughnutChartData);
    console.log("IncomeChartData:  ", this.IncomedoughnutChartData);

  }

  public chartClicked({
    event,
    active,
  }: {
    event: ChartEvent;
    active: object[];
  }): void {
    console.log("Clicked");
    
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event: ChartEvent;
    active: object[];
  }): void {
    console.log("hover: ", event, active);
  }


 


  handleLogOut() {
    this.auth.logout().subscribe(() => {
      localStorage.removeItem("token")
      this.router.navigateByUrl('/login')
    })
  }

  formData = new FormGroup({
    type: new FormControl("income", [Validators.required]),
    category: new FormControl("", [Validators.required]),
    amount: new FormControl("", [Validators.required, Validators.pattern(this.amountRegex)]),
    date: new FormControl("", [Validators.required])
  })

  initialState: ExpenseModal = {
    amount: '',
    category: '',
    date: '',
    type: 'income'
  }

  handleValidate() {
    Object.keys(this.formData.value).forEach((item) => {
      if (this.formData.get(item)?.errors?.['required']) {
        this.errorObj[item] = item + " is required"
      }
      if (this.formData.get(item)?.errors?.['pattern']) {
        this.errorObj[item] = "invalid " + item
      }
    })
    return this.errorObj;
  }

  handleSubmit() {

    this.errorObj = {}
    this.handleValidate()

    if (isEmpty(this.errorObj)) {
      const value = this.formData.getRawValue()
      if (value) {
        console.log(value);

        this.firestoreService.addExpense(value as ExpenseModal).subscribe((res) => {
          this.formData.reset(this.initialState)
        }, err => {
          console.log("setError: ", err);

        })
      }
    }
  }

  handleUpdate(id: string) {

    this.firebaseData.forEach((item: ExpenseModal) => {
      if (item.id == id) {
        this.update = id
        Object.keys(this.formData.value).forEach(data => {
          this.formData.get(data)?.patchValue(item[data])
        })
      }
    })
  }

  updateFunction() {
    console.log("update Triger");
    console.log('this.formData.getRawValue(): ', this.formData.getRawValue());
    this.firestoreService.updateExpense(this.update, this.formData.getRawValue() as ExpenseModal).subscribe((res) => {
      this.formData.reset(this.initialState)
      this.update = ''
      console.log("FormData_last: ", this.formData.value);

    })
  }


  handleDlt(id: string) {
    this.firebaseData.forEach((item) => {
      if (item.id == id) {
        this.firestoreService.dltExpense(id).subscribe((res) => {
          console.log("Dlt");
          
        }, err => {
          console.log("Error: ", err);

        })
      }
    })
  }

}
