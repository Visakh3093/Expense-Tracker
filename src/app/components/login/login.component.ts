import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { InputField } from '../../model/register.interface';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { isEmpty } from 'lodash';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,RouterLink,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  emailRegex: RegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  errorObj: { [key: string]: string } = {}
  credential:boolean = false
  constructor(private auth:AuthService , private router:Router) {
    if(localStorage.getItem("token"))
    {
      this.router.navigate(['dashboard'])
    }
  }
  loginForm = new FormGroup({
    email: new FormControl('',[Validators.required,Validators.pattern(this.emailRegex)]),
    password: new FormControl('',[Validators.required])
  })
  ngOnInit(): void {
    this.handleOnchanges()
   
  }

  handleValidate()
  {
    Object.keys(this.loginForm.value).forEach(item=>{
      if(this.loginForm.get(item)?.errors?.['required'])
      {
        this.errorObj[item] = item + " is required"
      }
      if(this.loginForm.get(item)?.errors?.['pattern'])
      {
        this.errorObj[item] = "Invalid " + item
      }
    })
    return this.errorObj
  }

  handleClose()
  {
    this.credential = false
  }

  handleSubmit() {
    this.credential = false
    this.errorObj = {}
    this.handleValidate()
    
    if(isEmpty(this.errorObj))
    {
      
      const email = this.loginForm.get('email')
      const password = this.loginForm.get('password')
      if(email?.value  && password?.value)
      {
        this.auth.login(email.value,password.value).subscribe(()=>{
          this.router.navigateByUrl('/dashboard')
          localStorage.setItem("token","true")
        },err=>{
          this.errorObj["user"] = "invalid-credential"
          console.log("Login Error: ",err);
          this.credential = true
          setTimeout(()=>{
            this.credential = false
          },4000)
        })
   
       
      }
    }

  }


  handleOnchanges()
  {
    this.loginForm.valueChanges.subscribe((val:any)=>{


      Object.keys(val).map((item:any)=>{
        
        
        if(isEmpty(this.loginForm.get(item)?.errors))
        {
          
          delete this.errorObj[item]
          if(!isEmpty(this.errorObj))
          {
            this.handleValidate()
          }
          
        }
      })
    })
    return this.errorObj
  }
 
}
