import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

  markControlsAsDirtyAndTouched(control: AbstractControl): void {
    if (control.invalid) {
      control.markAsDirty();
      control.markAsTouched();
      control.updateValueAndValidity();
    }

    if (control instanceof FormGroup) {
      Object.values(control.controls).forEach(childControl =>
        this.markControlsAsDirtyAndTouched(childControl)
      );
    } else if (control instanceof FormArray) {
      control.controls.forEach(childControl =>
        this.markControlsAsDirtyAndTouched(childControl)
      );
    }
  }

  getFormValidationErrors(form: AbstractControl): number {
        let errorCount = 0;

        if (form instanceof FormGroup || form instanceof FormArray) {
            Object.keys(form.controls).forEach(key => {
                const control = form.get(key);
                if (control) {
                    errorCount += this.getFormValidationErrors(control);
                }
            });
        } else if (form instanceof FormControl && form.errors) {
            errorCount += Object.keys(form.errors).length;
        }

        return errorCount;
    }
}
