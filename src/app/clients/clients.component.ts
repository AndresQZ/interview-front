import { Component, OnInit , Inject } from '@angular/core';
import { Client} from '../model/Client';
import {Clients} from '../mocks/clients'
import {MatTableDataSource} from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {UsersService} from '../services/users.service';

export interface DialogData {
  id: Number;
  nombre: string;
}

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {


  public clients: Client[];
  dataSource = new MatTableDataSource(this.clients);
  public columnsToDisplay : string[]  = [ 'id', 'nombre', 'apellidoPaterno' , 'ingresos', 'fechaNacimiento' , 'Edit' , 'Delete'];
  public columnsToDisplays : string[]  = [ 'id', 'nombre'];


  constructor(private usersService: UsersService, public dialog: MatDialog) { }

  ngOnInit() {
  this.getUser();
  }

  getUser(): void {
    this.usersService.getUser().subscribe(response =>{ 
      this.clients = response
      this.dataSource = new MatTableDataSource(this.clients);
     });
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(action,obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '300px',
      data:obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'ok'){
       console.log(result.data.id);
       this.usersService.deleteUser(result.data.id).subscribe( response => {
         this.handlerUserDelete();
       });
      
      }else if(result.event == 'Update'){
       // this.updateRowData(result.data);
      }
    });
  }


  handlerUserDelete() : void {
   console.log("user deleted >>>");
   this.getUser();
  }

  public setClients(Clients : Client[]) : void{
    this.clients = Clients;
  }

}



@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog-content-example-dialog.html',
})
export class DialogOverviewExampleDialog { 

  private localData : any;
  constructor (public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      console.log(data);
      this.localData = data;
    }

    doAction(){
      this.dialogRef.close({event: 'ok' , data :this.localData});
    }
  
    closeDialog(){
      this.dialogRef.close({event:'Cancel'});
    }
 }