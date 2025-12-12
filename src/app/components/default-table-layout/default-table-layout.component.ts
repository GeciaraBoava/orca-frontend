import {Component, EventEmitter, Input, Output} from '@angular/core';

export interface ColumnConfig<T extends object> {
  key: keyof T | 'actions';
  label: string;
  searchable?: boolean;
  filterable?: boolean;
  type?: 'text' | 'boolean' | 'actions' | 'toggle';
}

@Component({
  selector: 'app-default-table-layout',
  standalone: true,
  imports: [],
  templateUrl: './default-table-layout.component.html',
  styleUrl: './default-table-layout.component.scss',
})
export class DefaultTableLayoutComponent<T extends object> {
  @Input() data: T[] = [];
  @Input() columns: ColumnConfig<T>[] = [];
  @Input() pageSize = 5;
  @Input() showLoads: boolean = true;

  @Output() editClicked = new EventEmitter<T>();
  @Output() deleteClicked = new EventEmitter<T>();
  @Output() createClicked = new EventEmitter<void>();
  @Output() toggleStatus = new EventEmitter<T>();

  searchTerm = '';
  columnFilters: Record<string, string> = {};
  currentPage = 1;

  sortKey: keyof T | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  isDataKey(key: keyof T | 'actions'): key is keyof T {
    return key !== 'actions';
  }

  getValue(item: T, key: keyof T | 'actions'): any {
    return this.isDataKey(key) ? item[key] : null;
  }

  onEdit(item: any) {
    this.editClicked.emit(item);
  }

  onDelete(item: any) {
    this.deleteClicked.emit(item);
  }

  onCreate() {
    this.createClicked.emit();
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase();
    this.currentPage = 1;
  }

  onFilter(key: keyof T, event: Event) {
    const input = event.target as HTMLInputElement;
    this.columnFilters[key as string] = input.value.toLowerCase();
    this.currentPage = 1;
  }

  onSortClick(key: keyof T | 'actions') {
    if (key === 'actions') return;
    this.toggleSort(key);
  }

  onFilterInput(key: keyof T | 'actions', event: Event) {
    if (key === 'actions') return;
    this.onFilter(key, event);
  }

  toggleSort(key: keyof T) {
    if (key === 'actions') return;

    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortDirection = 'asc';
    }
    this.sortKey = key as keyof T;
  }

  onToggleStatus(item: T) {
    this.toggleStatus.emit(item);
  }

  get filteredData(): T[] {
    return this.data
      .filter(item => {
        // busca geral
        if (this.searchTerm) {
          const hit = Object.values(item)
            .some(v => String(v).toLowerCase().includes(this.searchTerm));
          if (!hit) return false;
        }

        // filtros por coluna
        for (const [col, value] of Object.entries(this.columnFilters)) {
          if (value && !String(item[col as keyof T]).toLowerCase().includes(value)) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (!this.sortKey) return 0;
        const col = this.sortKey;
        const va = String(a[col]).toLowerCase();
        const vb = String(b[col]).toLowerCase();
        if (va < vb) return this.sortDirection === 'asc' ? -1 : 1;
        if (va > vb) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }

  get paginatedData(): T[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredData.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }
}
