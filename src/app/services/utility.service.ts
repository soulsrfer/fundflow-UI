import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { FilterMetadata } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  constructor() {}

  markControlsAsDirtyAndTouched(control: AbstractControl): void {
    if (control.invalid) {
      control.markAsDirty();
      control.markAsTouched();
      control.updateValueAndValidity();
    }

    if (control instanceof FormGroup) {
      Object.values(control.controls).forEach((childControl) =>
        this.markControlsAsDirtyAndTouched(childControl)
      );
    } else if (control instanceof FormArray) {
      control.controls.forEach((childControl) =>
        this.markControlsAsDirtyAndTouched(childControl)
      );
    }
  }

  getFormValidationErrors(form: AbstractControl): number {
    let errorCount = 0;

    if (form instanceof FormGroup || form instanceof FormArray) {
      Object.keys(form.controls).forEach((key) => {
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

  adjustDate(date: Date) {
    return new Date(
      date.getTime() + Math.abs(date.getTimezoneOffset() * 60000)
    );
  }

  tableLazyLoadEventToHttpParams(event: TableLazyLoadEvent): HttpParams {
    const first = event.first ?? 0;
    const rows = event.rows ?? 10;
    const safeRows = rows <= 0 ? 10 : rows; // avoid divide-by-zero
    const page = Math.floor(first / safeRows);

    // Handle sorting parameters
    const sortField = event.sortField ?? 'id';
    const sortOrder = event.sortOrder === 1 ? 'asc' : 'desc';

    const paramsObj: Record<string, string | string[]> = {
      page: String(page),
      rows: String(safeRows),
      sortField,
      sortOrder,
    };

    //Handle filter parameters
    if (event.filters) {
      for (const [field, meta] of Object.entries(event.filters)) {
        if (!meta) continue;

        // Case 1: array of FilterMetadata
        if (Array.isArray(meta)) {
          const values = meta
            .map((m: FilterMetadata) => m.value)
            .filter((v) => v !== null && v !== undefined && v !== '');
          if (values.length > 0) {
            paramsObj[field] = values.map((v) => String(v));
          }
        }
        // Case 2: single FilterMetadata
        else if ((meta as FilterMetadata).value !== undefined) {
          const val = (meta as FilterMetadata).value;
          if (val !== null && val !== '') {
            paramsObj[field] = String(val);
          }
        }
      }
    }

    return new HttpParams({ fromObject: paramsObj });
  }

  createLazyLoadEvent(
    first?: number,
    rows?: number,
    sortField?: string,
    sortOrder?: number
  ): TableLazyLoadEvent {
    return {
      first: first ?? 0,
      rows: rows ?? 10,
      sortField: sortField ?? 'id',
      sortOrder: sortOrder ?? 1,
      filters: {},
    } as TableLazyLoadEvent;
  }
}
