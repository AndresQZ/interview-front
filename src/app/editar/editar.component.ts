import { Component, OnInit, Optional } from '@angular/core';
import {UsersService} from '../services/users.service';
import { ActivatedRoute}  from '@angular/router';
import { Client } from '../model/Client';
import { ClientsComponent } from '../clients/clients.component';
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
  public id: Number;
  public salary:Number;
  public postalCode: Number;
  public fecha: Date;
  showSpinner = false;

  private client : Client;
  private updateRegister : Boolean = false;

  form: FormGroup;
  
  constructor(private usersService : UsersService, 
             @Optional() private route: ActivatedRoute,
              public fb: FormBuilder,
              private location: Location,
              public dialog: MatDialog) {
    
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required , Validators.pattern('[a-zA-Z ]*')]),
      lastName: new FormControl('',[Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      lastMother: new FormControl('',[Validators.pattern('[a-zA-Z ]*')]),
      salary: new FormControl(''),
      postalCode: new FormControl('' ,[Validators.required, Validators.maxLength(6),Validators.minLength(6)]),
      fecha: new FormControl('', [Validators.required]),
      id: new FormControl({disabled : true})
    });
  
   }

  ngOnInit() {
    console.log("inside ngOnInit");
    this. getId();
  }


  getId() {
    const id= +this.route.snapshot.paramMap.get('id');
    console.log(">>> id - client" + id);
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
    console.log(">>> indicator updateRegister" + this.updateRegister);
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
     console.log(JSON.stringify(this.client));
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
      if(result.event == 'ok'){
       
      }
    });
  }
}
