
import React, { useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Invoice, InvoiceStatus } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import Navbar from './components/Navbar';
import InvoiceList from './components/InvoiceList';
import InvoiceForm from './components/InvoiceForm';
import InvoiceView from './components/InvoiceView';

// Initial mock data function
const getInitialInvoices = (): Invoice[] => [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    clientName: 'Tech Solutions Inc.',
    clientEmail: 'contact@techsolutions.com',
    invoiceDate: '2024-07-01',
    dueDate: '2024-07-31',
    items: [
      { id: 'item-1-1', description: 'Website Development (Phase 1)', quantity: 1, unitPrice: 2500, total: 2500 },
      { id: 'item-1-2', description: 'SEO Consulting', quantity: 10, unitPrice: 150, total: 1500 },
    ],
    subTotal: 4000,
    taxRate: 0.08, // 8%
    taxAmount: 320,
    grandTotal: 4320,
    status: InvoiceStatus.SENT,
    notes: 'Payment due within 30 days. Thank you for your business!',
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    clientName: 'Creative Designs Co.',
    clientEmail: 'hello@creativedesigns.co',
    invoiceDate: '2024-07-15',
    dueDate: '2024-08-14',
    items: [
      { id: 'item-2-1', description: 'Logo Design Package', quantity: 1, unitPrice: 800, total: 800 },
      { id: 'item-2-2', description: 'Business Card Design (250 units)', quantity: 1, unitPrice: 150, total: 150 },
    ],
    subTotal: 950,
    taxRate: 0.05, // 5%
    taxAmount: 47.50,
    grandTotal: 997.50,
    status: InvoiceStatus.PAID,
  },
   {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    clientName: 'Global Logistics Ltd.',
    clientEmail: 'accounts@globallogistics.com',
    invoiceDate: '2024-06-20',
    dueDate: '2024-07-20',
    items: [
      { id: 'item-3-1', description: 'Freight Forwarding Services', quantity: 1, unitPrice: 1200, total: 1200 },
    ],
    subTotal: 1200,
    taxRate: 0.00, // 0%
    taxAmount: 0,
    grandTotal: 1200,
    status: InvoiceStatus.OVERDUE,
    notes: 'Urgent: Payment overdue. Please remit promptly.',
  }
];


const App: React.FC = () => {
  const [invoices, setInvoices] = useLocalStorage<Invoice[]>('invoices', getInitialInvoices);
  const [invoiceCounter, setInvoiceCounter] = useLocalStorage<number>('invoiceCounter', getInitialInvoices().length + 1);

  const generateInvoiceNumber = useCallback((): string => {
    const newCounter = invoiceCounter;
    // Increment for next time, but use current for this invoice.
    // This is a simple counter, real systems might have more complex logic.
    setInvoiceCounter(prev => prev + 1);
    return `INV-${new Date().getFullYear()}-${String(newCounter).padStart(3, '0')}`;
  }, [invoiceCounter, setInvoiceCounter]);


  const addInvoice = (invoice: Invoice) => {
    setInvoices(prevInvoices => [...prevInvoices, invoice]);
  };

  const updateInvoice = (updatedInvoice: Invoice) => {
    setInvoices(prevInvoices =>
      prevInvoices.map(inv => (inv.id === updatedInvoice.id ? updatedInvoice : inv))
    );
  };
  
  const updateInvoiceStatus = (id: string, status: InvoiceStatus) => {
    setInvoices(prevInvoices =>
      prevInvoices.map(inv => (inv.id === id ? { ...inv, status } : inv))
    );
  };

  const deleteInvoice = (id: string) => {
    if(window.confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
        setInvoices(prevInvoices => prevInvoices.filter(inv => inv.id !== id));
    }
  };

  const getInvoiceById = (id: string): Invoice | undefined => {
    return invoices.find(inv => inv.id === id);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<InvoiceList invoices={invoices} onDeleteInvoice={deleteInvoice} />} />
          <Route 
            path="/new" 
            element={
              <InvoiceForm 
                addInvoice={addInvoice} 
                updateInvoice={updateInvoice} // Not used in /new directly but good for consistency
                getInvoiceById={getInvoiceById}
                generateInvoiceNumber={generateInvoiceNumber} 
              />
            } 
          />
          <Route 
            path="/invoice/:id/edit" 
            element={
              <InvoiceForm 
                addInvoice={addInvoice} // Not used in /edit directly
                updateInvoice={updateInvoice} 
                getInvoiceById={getInvoiceById} 
                generateInvoiceNumber={generateInvoiceNumber} // Not typically used for edit, but good to pass
              />
            } 
          />
          <Route path="/invoice/:id" element={<InvoiceView invoices={invoices} onUpdateInvoiceStatus={updateInvoiceStatus} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="bg-gray-800 text-white text-center py-4 text-sm">
        © {new Date().getFullYear()} SOP'Africa. All rights reserved.
      </footer>
    </div>
  );
};

export default App;