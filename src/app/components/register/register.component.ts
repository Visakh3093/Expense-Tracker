import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputField } from '../../model/register.interface';
import { isEmpty } from 'lodash';
import { AuthService } from '../../services/auth.service';
import { Firestore, collection } from '@angular/fire/firestore';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  emailRegex: RegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  passwordRegex: RegExp = /.{6,}/
  errorObj: { [key: string]: string } = {}
  credential:boolean = false
  constructor(private formbuilder: FormBuilder,private auth:AuthService,private router:Router,private firestore:Firestore) {
    if(localStorage.getItem("token"))
    {
      this.router.navigate(['dashboard'])
    }
   }

  register = new FormGroup({})

  inputField: InputField[] = [
    { label: "Name", key: "name", type: "text", placeholder: 'Enter Your Name', value: '', pattern: [Validators.required] },
    { label: "Email Address", key: "email", type: "text", placeholder: 'Enter Your Email Address', value: '', pattern: [Validators.required, Validators.pattern(this.emailRegex)] },
    { label: "Password", key: "password", type: "password", placeholder: 'Enter Password', value: '', pattern: [Validators.required,Validators.pattern(this.passwordRegex)] },
    { label: "Confirm Password", key: "c_password", type: "password", placeholder: 'Enter Confirm Password', value: '', pattern: [Validators.required] }
  ]

  ngOnInit(): void {
    this.inputField.map(item => {
      const controller = this.formbuilder.control(item.value, item.pattern);
      this.register.addControl(item.key, controller)
    })
    this.handleOnchanges()

  }

  handleValidate() {
    this.errorObj = {}
    this.inputField.forEach((item: InputField) => {
      if (this.register.get(item.key)?.errors?.['required']) {
        this.errorObj[item.key] = item.label + " is required"
      }
      if (this.register.get(item.key)?.errors?.['pattern']) {
        if(item.key == 'password')
        {
          this.errorObj[item.key] = "Password should be at least 6 characters"
        }
        else
        {

          this.errorObj[item.key] = "Invalid " + item.label
        }
      }
    })

    const password = this.register.get('password')
    const c_password = this.register.get('c_password')
    if (password?.value !== c_password?.value) {
      this.errorObj['c_password'] = "password mismatch"
    }

    return this.errorObj
  }

  handleClose()
  {
    this.credential = false
  }
  isEmptyCheck(e: any) {
    if (!isEmpty(e)) {
      return true
    }
    return false

  }

  handleSubmit() {
    this.errorObj = {}
    this.handleValidate()
    if (isEmpty(this.errorObj)) {
      const email = this.register.get('email')?.value
      const password = this.register.get('password')?.value
      const username = this.register.get('name')?.value
      // const formData = this.register.getRawValue()
  
     
      if(email && password && username)
      {
       
        
        this.auth.register(email,username,password).subscribe((res)=>{
          console.log("Res: ",res);
         
          this.router.navigateByUrl('/login')
        },err=>{
          console.log("RegisetrError: ",err);
          this.credential = true
          setTimeout(()=>{
          this.credential = false
          },4000)
        })
      }
    }

  }

  handleOnchanges() {
    this.register.valueChanges.subscribe((val: any) => {


      Object.keys(val).map((item: any) => {


        if (isEmpty(this.register.get(item)?.errors)) {

          delete this.errorObj[item]
          if (!isEmpty(this.errorObj)) {
            this.handleValidate()
          }

        }
      })
    })
    return this.errorObj
  }


}
