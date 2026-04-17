// src/app/components/bp-form/bp-form.component.ts
// .......................Handles BOTH create and edit...................
// If route has :id param → edit mode (pre-fills form)
// Otherwise → create mode

import { Component, OnInit }          from '@angular/core';
import { CommonModule }               from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import {
  ReactiveFormsModule, FormBuilder, FormGroup, Validators
} from '@angular/forms';
import { BpService }          from '../../services/bp.service';
import { BusinessPartner }    from '../../models/business-partner.model';

@Component({
  selector: 'app-bp-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './bp-form.component.html',
  styleUrls: ['./bp-form.component.css']
})
export class BpFormComponent implements OnInit {

  form!: FormGroup;
  editId: number | null = null;
  isEditMode = false;
  loading    = false;
  saving     = false;
  error      = '';
  success    = '';

  constructor(
    private fb:    FormBuilder,
    private bpSvc: BpService,
    private router: Router,
    private route:  ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.buildForm();

    // Check if :id param exists (edit mode)
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId    = +id;
      this.isEditMode = true;
      this.loadRecord(this.editId);
    }
  }

  // ── Build reactive form with validators ─────────────────────────────
  buildForm(): void {
    this.form = this.fb.group({
      // Core fields (required)
      bp_name:    ['', [Validators.required, Validators.minLength(2)]],
      email:      ['', [Validators.required, Validators.email]],
      mobile_no:  ['', [Validators.required, Validators.pattern(/^[+\d\s\-()]{8,20}$/)]],
      status:     ['Pending', Validators.required],

      // Optional fields
      customer_group:  [''],
      contact_person:  [''],
      gst_no:          [''],

      // Bill to Address
      city:        [''],
      state:       [''],
      country:     [''],
      postal_code: [''],
      address:     [''],

      // Ship to Address
      ship_city:    [''],
      ship_state:   [''],
      ship_country: [''],
      ship_postal:  [''],
      ship_address: ['']
    });
  }

  // ── Load existing record for edit ───────────────────────────────────
  loadRecord(id: number): void {
    this.loading = true;
    this.bpSvc.getById(id).subscribe({
      next: res => {
        if (res.data) {
          // Patch form values from API data
          this.form.patchValue(res.data);
        }
        this.loading = false;
      },
      error: err => {
        this.error   = err.error?.message || 'Could not load record';
        this.loading = false;
      }
    });
  }

  // ── Form submit ─────────────────────────────────────────────────────
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // highlight all errors
      return;
    }

    this.saving  = true;
    this.error   = '';
    this.success = '';

    const payload: BusinessPartner = this.form.value;

    const request$ = this.isEditMode
      ? this.bpSvc.update(this.editId!, payload)
      : this.bpSvc.create(payload);

    request$.subscribe({
      next: res => {
        this.success = res.message || (this.isEditMode ? 'Updated!' : 'Created!');
        this.saving  = false;
        setTimeout(() => this.router.navigate(['/dashboard']), 1500);
      },
      error: err => {
        this.error  = err.error?.message || 'Save failed. Please try again.';
        this.saving = false;
      }
    });
  }

  // ── Cancel → back to dashboard ──────────────────────────────────────
  cancel(): void {
    this.router.navigate(['/dashboard']);
  }

  // ── Template helper: is a field invalid + touched? ──────────────────
  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }

  getError(field: string): string {
    const c = this.form.get(field);
    if (!c || !c.errors) return '';
    if (c.errors['required'])  return 'This field is required';
    if (c.errors['email'])     return 'Enter a valid email address';
    if (c.errors['minlength']) return `Minimum ${c.errors['minlength'].requiredLength} characters`;
    if (c.errors['pattern'])   return 'Invalid format';
    return 'Invalid value';
  }
}
