import { Component, OnInit, Optional } from '@angular/core';
import {UsersService} from '../services/users.service';
import { ActivatedRoute}  from '@angular/router';
import { Client } from '../model/Client';
import { Location}  from '@angular/common';
import {FormControl, Validators, FormGroup , FormBuilder} from '@angular/forms';
import { DialogSpinnerComponent } from '../dialog-spinner/dialog-spinner.component';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {

  public name: String;
  public lastName:String;
  public lastMother: String;
  public id: number;
  public salary:number;
  public postalCode: number;
  public fecha: Date;
  showSpinner = false;
  minDate = new Date(1920, 0, 1);
  maxDate = this._getDateBeginning();

  private client : Client;
  private updateRegister : Boolean = false;

  form: FormGroup;
  
  constructor(private usersService : UsersService, 
             @Optional() private route: ActivatedRoute,
              public fb: FormBuilder,
              private location: Location,
              public dialog: MatDialog) {
    
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required , Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*')]),
      lastName: new FormControl('',[Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*')]),
      lastMother: new FormControl('',[Validators.pattern('[a-zA-ZñÑ ]*')]),
      salary: new FormControl(''),
      postalCode: new FormControl('' ,[Validators.maxLength(6),Validators.minLength(6), Validators.required, Validators.pattern("^[0-9]*$")]),
      fecha: new FormControl('', [Validators.required]),
      id: new FormControl({value: '', disabled: true})
    });
  
   }

  ngOnInit() {
    console.log("inside ngOnInit");
    this. getId();
  }


  getId() {
    const id= +this.route.snapshot.paramMap.get('id');
    console.log(">>> id - client " + id);
    if(id !=null && id !== undefined && id !== 0) {
      this.updateRegister = true;
      this.getUser(id);
    } else {
      this.updateRegister = false;
    }
  }


  public getUser(id: Number) {
    this.usersService.getUserById(id).subscribe(response => {
      this.client = response;
      console.log("client obtenied from getUserById");
      console.log(response);
      this.mappingClient(response);
    })
  }

  public update(){
    this.showSpinner = true;
    this.usersService.updateUser(this.client).subscribe(response => {
      console.log("user updated");
    });
  }

  public saveOrUpdated() : void {
    this.openDialog();
    console.log(">>> indicator updateRegister :" + this.updateRegister);
    if(this.updateRegister) {
      this.buildObjectclient();
      this.update();
    } else {
      this.buildObjectclient();
      this.usersService.saveUser(this.client).subscribe(response => {
      console.log("user saved");
      });
    }
  }

  private buildObjectclient() {
     this.client  = new Client();
     this.client.apellidoMaterno = this.lastMother;
     this.client.apellidoPaterno = this.lastName;
     this.client.ingresos = this.salary;
     this.client.nombre = this.name;
     this.client.codigoPostal = this.postalCode;
     this.client.fechaNacimiento = this.fecha;
     this.client.id = this.id;
  }


  private mappingClient(client : Client) : void {
   this.name = client.nombre;
   this.lastName = client.apellidoPaterno;
   this.lastMother = client.apellidoMaterno;
   this.id = client.id;
   this.salary = client.ingresos;
   this.postalCode = client.codigoPostal;
   this.fecha = client.fechaNacimiento;
  }


  openDialog() {
    const dialogRef = this.dialog.open(DialogSpinnerComponent, {
      width: '500px',
      data: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.location.back();
    });
  }

  onSubmit() {
    console.log(this.form.value);
  }


    /**
   * @param
   * @name _getDateBeginning
   * @returns Date with format yyyy-mm-dd
   */
  _getDateBeginning() {
    let currentDate = this._getDateCurent();
    let [...partOfDate] = this._getPartsOfDate(currentDate);
    let [day, month, year] = partOfDate;
    return `${year}-${month}-${day}`
  }

  /**
   * @name _getDateExpiration
   * @param {yearsToIncrease} number to increment to a year current
   * @returns Date with format yyyy-mm-dd
   */
  _getDateExpiration(yearsToIncrease) {
    let currentDate = this._getDateCurent();
    let [...partOfDate] = this._getPartsOfDate(currentDate);
    let [day, month, year] = partOfDate;
    return `${year+yearsToIncrease}-${month}-${day}`;
  }

  /**
   * @name _getDateCurent
   * @returns Data with formart standart
   */
  _getDateCurent() : Date{
    var dateToday = new Date();
    return dateToday
  }


  /**
   * @name _getPartsOfDate
   * @param {Date} currentDate
   * @returns Array with format
   */
  _getPartsOfDate(currentDate) {
    let partOfDate = [];
    partOfDate.push(String(currentDate.getDate()).padStart(2, '0'));
    partOfDate.push(String(currentDate.getMonth() + 1).padStart(2, '0'));
    partOfDate.push(currentDate.getFullYear());
    return partOfDate;
  }
}
