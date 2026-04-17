// src/app/components/dashboard/dashboard.component.ts
// Dashboard: shows table of all business partners with search, filter, delete

import { Component, OnInit }      from '@angular/core';
import { CommonModule }           from '@angular/common';
import { Router, RouterModule }   from '@angular/router';
import { FormsModule }            from '@angular/forms';
import { BpService }              from '../../services/bp.service';
import { BusinessPartner }        from '../../models/business-partner.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  partners: BusinessPartner[] = [];
  loading   = false;
  error     = '';
  success   = '';
  searchTerm = '';
  statusFilter = '';
  deletingId: number | null = null;

  // Pagination
  currentPage = 1;
  pageSize    = 10;

  constructor(private bpService: BpService, private router: Router) {}

  ngOnInit(): void {
    this.loadPartners();
  }

  // ── Fetch all partners ──────────────────────────────────────────────
  loadPartners(): void {
    this.loading = true;
    this.error   = '';

    this.bpService.getAll(this.searchTerm, this.statusFilter).subscribe({
      next: res => {
        this.partners    = res.data || [];
        this.loading     = false;
        this.currentPage = 1;
      },
      error: err => {
        this.error   = err.error?.message || 'Failed to load records. Is the backend running?';
        this.loading = false;
      }
    });
  }

  // ── Navigate to create form ──────────────────────────────────────────
  addNew(): void {
    this.router.navigate(['/bp/new']);
  }

  // ── Navigate to edit form ────────────────────────────────────────────
  edit(id: number): void {
    this.router.navigate(['/bp/edit', id]);
  }

  // ── Delete with confirmation ─────────────────────────────────────────
  delete(id: number, name: string): void {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;

    this.deletingId = id;
    this.bpService.delete(id).subscribe({
      next: res => {
        this.success    = res.message || 'Deleted successfully';
        this.deletingId = null;
        this.partners   = this.partners.filter(p => p.id !== id);
        setTimeout(() => this.success = '', 3000);
      },
      error: err => {
        this.error      = err.error?.message || 'Delete failed';
        this.deletingId = null;
        setTimeout(() => this.error = '', 3000);
      }
    });
  }

  // ── Search/filter handler ────────────────────────────────────────────
  onSearch(): void {
    this.loadPartners();
  }

  clearSearch(): void {
    this.searchTerm   = '';
    this.statusFilter = '';
    this.loadPartners();
  }

  // ── Pagination helpers ───────────────────────────────────────────────
  get pagedPartners(): BusinessPartner[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.partners.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.partners.length / this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(p: number): void {
    if (p >= 1 && p <= this.totalPages) this.currentPage = p;
  }

  // ── Status badge class ───────────────────────────────────────────────
  statusClass(status: string): string {
    return {
      'Approved': 'badge-approved',
      'Rejected': 'badge-rejected',
      'Pending' : 'badge-pending'
    }[status] || 'badge-pending';
  }

  // ── Avatar initials + colour ─────────────────────────────────────────
  initials(name: string): string {
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  }

  avatarColor(name: string): string {
    const colors = ['#4361ee','#3a0ca3','#7209b7','#f72585','#4cc9f0','#06d6a0','#fb8500'];
    let hash = 0;
    for (const c of name) hash = c.charCodeAt(0) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  }
}
