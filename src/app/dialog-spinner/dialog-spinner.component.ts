import { Component, OnInit , Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  id: Number;
  nombre: string;
}

@Component({
  selector: 'app-dialog-spinner',
  templateUrl: './dialog-spinner.component.html',
  styleUrls: ['./dialog-spinner.component.css']
})
export class DialogSpinnerComponent  {
  showSpinner = false;

  constructor(public dialogRef: MatDialogRef<DialogSpinnerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {

      this.showSpinner = true;
      this._timeOut();
    }


  closeDialog(){
    this.dialogRef.close({event:'close'});
  }

  _timeOut() : void {
    setTimeout(() => {
      this.showSpinner = false;
      this.closeDialog();
    }, 3000);
  }

}
