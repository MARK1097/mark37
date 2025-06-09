
export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number; // quantity * unitPrice
}

export interface Invoice {
  id:string; // UUID
  invoiceNumber: string; // e.g., INV-2024-001
  clientName: string;
  clientEmail: string;
  invoiceDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  items: InvoiceItem[];
  subTotal: number;
  taxRate: number; // e.g., 0.05 for 5%
  taxAmount: number;
  grandTotal: number;
  status: InvoiceStatus;
  notes?: string;
}

// Used for form data before an invoice is fully structured
export type InvoiceItemFormData = Omit<InvoiceItem, 'id' | 'total'> & { tempId: string }; // tempId for list keys in form

export interface InvoiceFormData {
  clientName: string;
  clientEmail: string;
  invoiceDate: string;
  dueDate: string;
  items: InvoiceItemFormData[];
  taxRate: number; // Stored as decimal, e.g., 0.05 for 5%
  notes?: string;
  status: InvoiceStatus;
}
