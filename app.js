// -------------------------------------------------------------
// INVOICIFLY - APPLICATION CORE ENGINE
// -------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // State management
    let invoiceItems = [
        { id: 1, description: 'Premium Web Application Development', qty: 1, rate: 15000 },
        { id: 2, description: 'Modern UI/UX Glassmorphism Styling', qty: 1, rate: 5000 }
    ];

    let savedClients = JSON.parse(localStorage.getItem('invoicifly_clients')) || [
        {
            id: 'client-1',
            name: 'Vipul Sharma',
            email: 'vipul@gmail.com',
            phone: '+91 88888 77777',
            address: 'Flat 202, Heights Apartment, Andheri East, Mumbai - 400069'
        },
        {
            id: 'client-2',
            name: 'TechSolutions Inc.',
            email: 'billing@techsolutions.com',
            phone: '+1 (555) 019-2834',
            address: 'Suite 500, Innovation Drive, Silicon Valley, CA - 94025'
        }
    ];

    let activeLedgerClientId = null;
    let savedInvoices = JSON.parse(localStorage.getItem('invoicifly_invoices')) || [];

    // Core DOM elements
    const htmlElement = document.documentElement;
    const themeSelect = document.getElementById('themeSelect');
    const templateSelect = document.getElementById('templateSelect');
    const printBtn = document.getElementById('printBtn');
    
    // Form Inputs
    const invNumberInput = document.getElementById('invNumber');
    const invCurrencySelect = document.getElementById('invCurrency');
    const invDateInput = document.getElementById('invDate');
    const invDueInput = document.getElementById('invDue');
    
    const senderNameInput = document.getElementById('senderName');
    const senderEmailInput = document.getElementById('senderEmail');
    const senderPhoneInput = document.getElementById('senderPhone');
    const senderAddressInput = document.getElementById('senderAddress');
    const senderSignatureInput = document.getElementById('senderSignature');
    const unlockBusinessBtn = document.getElementById('unlockBusinessBtn');
    
    const clientNameInput = document.getElementById('clientName');
    const clientEmailInput = document.getElementById('clientEmail');
    const clientPhoneInput = document.getElementById('clientPhone');
    const clientAddressInput = document.getElementById('clientAddress');
    
    const discountRateInput = document.getElementById('discountRate');
    const taxRateInput = document.getElementById('taxRate');
    const invNotesInput = document.getElementById('invNotes');
    const taxTypeSelect = document.getElementById('taxType');
    const taxRateGroup = document.getElementById('taxRateGroup');
    const prevTaxRowsContainer = document.getElementById('prevTaxRowsContainer');
    
    // Live Preview elements
    const invoicePaper = document.getElementById('invoicePaper');
    const prevSenderName = document.getElementById('prevSenderName');
    const prevSenderEmail = document.getElementById('prevSenderEmail');
    const prevSenderPhone = document.getElementById('prevSenderPhone');
    const prevSenderAddress = document.getElementById('prevSenderAddress');
    const prevSignatureText = document.getElementById('prevSignatureText');
    
    const prevInvNumber = document.getElementById('prevInvNumber');
    const prevInvDate = document.getElementById('prevInvDate');
    const prevInvDue = document.getElementById('prevInvDue');
    
    const prevClientName = document.getElementById('prevClientName');
    const prevClientEmail = document.getElementById('prevClientEmail');
    const prevClientPhone = document.getElementById('prevClientPhone');
    const prevClientAddress = document.getElementById('prevClientAddress');
    
    const prevItemsBody = document.getElementById('prevItemsBody');
    const itemsContainer = document.getElementById('itemsContainer');
    const addItemBtn = document.getElementById('addItemBtn');
    
    const prevSubtotal = document.getElementById('prevSubtotal');
    const prevDiscount = document.getElementById('prevDiscount');
    const prevDiscountLabel = document.getElementById('prevDiscountLabel');
    const prevTax = document.getElementById('prevTax');
    const prevTaxLabel = document.getElementById('prevTaxLabel');
    const prevGrandTotal = document.getElementById('prevGrandTotal');
    const prevNotes = document.getElementById('prevNotes');

    // CRM / Modal elements
    const loadClientBtn = document.getElementById('loadClientBtn');
    const clientModal = document.getElementById('clientModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalCrmList = document.getElementById('modalCrmList');
    const crmForm = document.getElementById('crmForm');
    const crmListContainer = document.getElementById('crmListContainer');

    // Tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    // -------------------------------------------------------------
    // INITIALIZATION & DATES
    // -------------------------------------------------------------
    function initializeDates() {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const dateString = `${yyyy}-${mm}-${dd}`;
        
        invDateInput.value = dateString;
        prevInvDate.textContent = dateString;

        // Default due date: Today + 15 Days
        const dueDate = new Date();
        dueDate.setDate(today.getDate() + 15);
        const d_yyyy = dueDate.getFullYear();
        const d_mm = String(dueDate.getMonth() + 1).padStart(2, '0');
        const d_dd = String(dueDate.getDate()).padStart(2, '0');
        const dueDateString = `${d_yyyy}-${d_mm}-${d_dd}`;
        
        invDueInput.value = dueDateString;
        prevInvDue.textContent = dueDateString;
    }

    // Save initial load
    initializeDates();
    renderCrmList();

    // -------------------------------------------------------------
    // TAB NAVIGATION SWITCHING
    // -------------------------------------------------------------
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            btn.classList.add('active');
            const targetTab = btn.getAttribute('data-tab');
            document.getElementById(`${targetTab}Tab`).classList.add('active');

            if (targetTab === 'dashboard') {
                renderDashboard();
            }
        });
    });

    // -------------------------------------------------------------
    // THEME AND TEMPLATE SELECTORS
    // -------------------------------------------------------------
    themeSelect.addEventListener('change', (e) => {
        htmlElement.setAttribute('data-theme', e.target.value);
    });

    templateSelect.addEventListener('change', (e) => {
        invoicePaper.setAttribute('data-layout', e.target.value);
    });

    // -------------------------------------------------------------
    // SECRET ADMIN PIN LOCK LOGIC (Default: 1234)
    // -------------------------------------------------------------
    const adminPIN = "1234";
    const senderInputs = [senderNameInput, senderEmailInput, senderPhoneInput, senderAddressInput, senderSignatureInput];
    
    // PIN Modal Elements
    const pinModal = document.getElementById('pinModal');
    const closePinModalBtn = document.getElementById('closePinModalBtn');
    const pinInput = document.getElementById('pinInput');
    const pinErrorMessage = document.getElementById('pinErrorMessage');
    const submitPinBtn = document.getElementById('submitPinBtn');

    unlockBusinessBtn.addEventListener('click', () => {
        const isLocked = senderNameInput.hasAttribute('readonly');
        
        if (isLocked) {
            // Open custom PIN modal instead of using browser prompt()
            pinInput.value = '';
            pinErrorMessage.style.display = 'none';
            pinModal.classList.add('active');
            setTimeout(() => pinInput.focus(), 100);
        } else {
            // Lock it back
            senderInputs.forEach(input => {
                input.setAttribute('readonly', 'true');
                input.style.background = 'rgba(255, 255, 255, 0.03)';
                input.style.cursor = 'not-allowed';
            });
            unlockBusinessBtn.innerHTML = "🔒 Locked (Click to Edit)";
            unlockBusinessBtn.style.background = "rgba(239, 68, 68, 0.1)";
            unlockBusinessBtn.style.color = "#ef4444";
            unlockBusinessBtn.style.borderColor = "rgba(239, 68, 68, 0.2)";
        }
    });

    // Handle PIN Modal Closing
    closePinModalBtn.addEventListener('click', () => {
        pinModal.classList.remove('active');
    });

    // Verify PIN action
    function verifyAdminPIN() {
        const enteredPIN = pinInput.value.trim();
        if (enteredPIN === adminPIN) {
            senderInputs.forEach(input => {
                input.removeAttribute('readonly');
                input.style.background = 'transparent';
                input.style.cursor = 'text';
            });
            unlockBusinessBtn.innerHTML = "🔓 Unlocked (Edit Mode)";
            unlockBusinessBtn.style.background = "rgba(16, 185, 129, 0.1)";
            unlockBusinessBtn.style.color = "#10b981";
            unlockBusinessBtn.style.borderColor = "rgba(16, 185, 129, 0.2)";
            pinModal.classList.remove('active');
        } else {
            pinErrorMessage.style.display = 'block';
            pinInput.value = '';
            pinInput.focus();
        }
    }

    submitPinBtn.addEventListener('click', verifyAdminPIN);
    
    // Press Enter to submit PIN
    pinInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            verifyAdminPIN();
        }
    });

    // Close modals if user clicks outside content
    window.addEventListener('click', (e) => {
        if (e.target === clientModal) {
            clientModal.classList.remove('active');
        }
        if (e.target === pinModal) {
            pinModal.classList.remove('active');
        }
    });

    // -------------------------------------------------------------
    // SYNC TEXT INPUTS -> LIVE PREVIEW
    // -------------------------------------------------------------
    const syncText = (input, element) => {
        input.addEventListener('input', () => {
            element.textContent = input.value || '---';
        });
    };

    syncText(invNumberInput, prevInvNumber);
    syncText(senderNameInput, prevSenderName);
    syncText(senderEmailInput, prevSenderEmail);
    syncText(senderPhoneInput, prevSenderPhone);
    syncText(senderAddressInput, prevSenderAddress);
    
    // Sync signature cursive ink or hide if blank for physical signature
    senderSignatureInput.addEventListener('input', () => {
        prevSignatureText.textContent = senderSignatureInput.value;
        if (senderSignatureInput.value.trim() === '') {
            prevSignatureText.style.display = 'none';
        } else {
            prevSignatureText.style.display = 'inline-block';
        }
    });
    // Set initial signature text on load
    prevSignatureText.textContent = senderSignatureInput.value;
    syncText(clientNameInput, prevClientName);
    syncText(clientEmailInput, prevClientEmail);
    syncText(clientPhoneInput, prevClientPhone);
    syncText(clientAddressInput, prevClientAddress);

    // Notes syncing with newline formatting preserved
    invNotesInput.addEventListener('input', () => {
        prevNotes.textContent = invNotesInput.value || 'Thank you for your business!';
    });

    // Date inputs
    invDateInput.addEventListener('change', () => {
        prevInvDate.textContent = invDateInput.value;
    });
    invDueInput.addEventListener('change', () => {
        prevInvDue.textContent = invDueInput.value;
    });

    // Currency selector listener
    invCurrencySelect.addEventListener('change', () => {
        calculateInvoice();
    });

    // Adjustments listeners
    discountRateInput.addEventListener('input', () => {
        calculateInvoice();
    });
    taxRateInput.addEventListener('input', () => {
        calculateInvoice();
    });
    taxTypeSelect.addEventListener('change', () => {
        if (taxTypeSelect.value === 'none') {
            taxRateGroup.style.display = 'none';
        } else {
            taxRateGroup.style.display = 'block';
        }
        calculateInvoice();
    });

    // -------------------------------------------------------------
    // DYNAMIC LINE ITEMS MANAGEMENT
    // -------------------------------------------------------------
    function renderItemsEditor() {
        itemsContainer.innerHTML = '';
        invoiceItems.forEach((item, index) => {
            const row = document.createElement('div');
            row.className = 'item-row';
            row.innerHTML = `
                <div class="form-group">
                    ${index === 0 ? '<label>Description</label>' : ''}
                    <input type="text" class="item-desc" data-index="${index}" value="${item.description}" placeholder="Description">
                </div>
                <div class="form-group">
                    ${index === 0 ? '<label>Qty</label>' : ''}
                    <input type="number" class="item-qty" data-index="${index}" min="1" value="${item.qty}">
                </div>
                <div class="form-group">
                    ${index === 0 ? '<label>Rate</label>' : ''}
                    <input type="number" class="item-rate" data-index="${index}" min="0" step="0.01" value="${item.rate}">
                </div>
                <button type="button" class="btn-delete" data-index="${index}" title="Remove Item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
            `;
            itemsContainer.appendChild(row);
        });

        // Add event listeners for dynamic inputs
        document.querySelectorAll('.item-desc').forEach(input => {
            input.addEventListener('input', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                invoiceItems[idx].description = e.target.value;
                updatePreviewItems();
            });
        });

        document.querySelectorAll('.item-qty').forEach(input => {
            input.addEventListener('input', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                invoiceItems[idx].qty = parseInt(e.target.value) || 0;
                calculateInvoice();
            });
        });

        document.querySelectorAll('.item-rate').forEach(input => {
            input.addEventListener('input', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                invoiceItems[idx].rate = parseFloat(e.target.value) || 0;
                calculateInvoice();
            });
        });

        // Delete button listeners
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const button = e.currentTarget;
                const idx = parseInt(button.getAttribute('data-index'));
                if (invoiceItems.length > 1) {
                    invoiceItems.splice(idx, 1);
                    renderItemsEditor();
                    calculateInvoice();
                } else {
                    alert("Invoice must have at least one line item.");
                }
            });
        });
    }

    // Add item row event
    addItemBtn.addEventListener('click', () => {
        invoiceItems.push({
            id: Date.now(),
            description: 'Custom Service / Consultation',
            qty: 1,
            rate: 2500
        });
        renderItemsEditor();
        calculateInvoice();
    });

    // -------------------------------------------------------------
    // CALCULATIONS & LIVE PREVIEW UPDATING
    // -------------------------------------------------------------
    function formatCurrency(amount) {
        const symbol = invCurrencySelect.value;
        return `${symbol}${amount.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    }

    function updatePreviewItems() {
        prevItemsBody.innerHTML = '';
        invoiceItems.forEach(item => {
            const tr = document.createElement('tr');
            const itemTotal = item.qty * item.rate;
            tr.innerHTML = `
                <td class="col-desc">
                    <div class="item-desc-bold">${item.description || 'Description'}</div>
                </td>
                <td class="col-qty text-center">${item.qty}</td>
                <td class="col-rate text-right">${formatCurrency(item.rate)}</td>
                <td class="col-total text-right font-semibold">${formatCurrency(itemTotal)}</td>
            `;
            prevItemsBody.appendChild(tr);
        });
    }

    function calculateInvoice() {
        let subtotal = 0;
        invoiceItems.forEach(item => {
            subtotal += item.qty * item.rate;
        });

        const discountRate = parseFloat(discountRateInput.value) || 0;
        const discountAmount = subtotal * (discountRate / 100);
        
        const taxableAmount = subtotal - discountAmount;
        
        // Calculate tax based on selected Tax Type
        const taxType = taxTypeSelect.value;
        let taxRate = 0;
        let taxAmount = 0;
        
        if (taxType !== 'none') {
            taxRate = parseFloat(taxRateInput.value) || 0;
            taxAmount = taxableAmount * (taxRate / 100);
        }

        const grandTotal = taxableAmount + taxAmount;

        // Render preview texts
        prevSubtotal.textContent = formatCurrency(subtotal);
        prevDiscountLabel.textContent = `Discount (${discountRate}%):`;
        prevDiscount.textContent = `-${formatCurrency(discountAmount)}`;
        
        // Render dynamic tax rows breakdown
        prevTaxRowsContainer.innerHTML = '';
        if (taxType === 'gst' && taxRate > 0) {
            // Local GST: splits into CGST and SGST
            const halfRate = taxRate / 2;
            const halfAmount = taxAmount / 2;
            
            const cgstRow = document.createElement('div');
            cgstRow.className = 'total-row';
            cgstRow.innerHTML = `<span>CGST (${halfRate}%):</span><span>+${formatCurrency(halfAmount)}</span>`;
            prevTaxRowsContainer.appendChild(cgstRow);
            
            const sgstRow = document.createElement('div');
            sgstRow.className = 'total-row';
            sgstRow.innerHTML = `<span>SGST (${halfRate}%):</span><span>+${formatCurrency(halfAmount)}</span>`;
            prevTaxRowsContainer.appendChild(sgstRow);
        } else if (taxType === 'igst' && taxRate > 0) {
            // Inter-state GST
            const igstRow = document.createElement('div');
            igstRow.className = 'total-row';
            igstRow.innerHTML = `<span>IGST (${taxRate}%):</span><span>+${formatCurrency(taxAmount)}</span>`;
            prevTaxRowsContainer.appendChild(igstRow);
        } else if (taxType === 'vat' && taxRate > 0) {
            // VAT / Flat Tax
            const vatRow = document.createElement('div');
            vatRow.className = 'total-row';
            vatRow.innerHTML = `<span>VAT (${taxRate}%):</span><span>+${formatCurrency(taxAmount)}</span>`;
            prevTaxRowsContainer.appendChild(vatRow);
        }

        prevGrandTotal.textContent = formatCurrency(grandTotal);

        updatePreviewItems();
    }

    // Initial calculations render
    renderItemsEditor();
    calculateInvoice();

    // -------------------------------------------------------------
    // CRM CLIENT LIST & SAVE LOGIC
    // -------------------------------------------------------------
    crmForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const clientName = document.getElementById('crmName').value;
        const clientEmail = document.getElementById('crmEmail').value;
        const clientPhone = document.getElementById('crmPhone').value;
        const clientAddress = document.getElementById('crmAddress').value;

        const newClient = {
            id: 'client-' + Date.now(),
            name: clientName,
            email: clientEmail,
            phone: clientPhone,
            address: clientAddress
        };

        savedClients.unshift(newClient);
        localStorage.setItem('invoicifly_clients', JSON.stringify(savedClients));
        
        crmForm.reset();
        renderCrmList();
    });
    function renderCrmList() {
        crmListContainer.innerHTML = '';
        if (savedClients.length === 0) {
            crmListContainer.innerHTML = `<p class="empty-state-text">No clients saved yet. Add a client above to begin building your CRM database!</p>`;
            return;
        }

        savedClients.forEach(client => {
            // Compute balances dynamically
            const clientInvoices = savedInvoices.filter(inv => (inv.clientName || '').trim().toLowerCase() === client.name.trim().toLowerCase());
            const outstandingBalance = clientInvoices
                .filter(inv => inv.status === 'Pending')
                .reduce((sum, inv) => sum + inv.grandTotal, 0);

            const card = document.createElement('div');
            card.className = 'crm-card';
            card.innerHTML = `
                <div class="crm-card-info">
                    <h4>${client.name}</h4>
                    <p>${client.email || 'No Email'} • ${client.phone || 'No Phone'}</p>
                    <div class="crm-balance-badge ${outstandingBalance > 0 ? 'debt' : 'clear'}">
                        ${outstandingBalance > 0 ? `⚠️ Debt: ${formatCurrency(outstandingBalance)}` : `✅ Clear (${formatCurrency(0)})`}
                    </div>
                </div>
                <div class="crm-card-actions">
                    <button class="btn btn-secondary btn-xs select-client-btn" data-id="${client.id}">Apply</button>
                    <button class="btn btn-secondary btn-xs ledger-client-btn" data-id="${client.id}">Ledger</button>
                    <button class="btn btn-secondary btn-xs delete-client-btn" data-id="${client.id}" style="color: var(--color-danger); border-color: rgba(239, 68, 68, 0.1);">Delete</button>
                </div>
            `;
            crmListContainer.appendChild(card);
        });

        // Add action listeners
        document.querySelectorAll('.select-client-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                applyClientData(id);
            });
        });

        document.querySelectorAll('.ledger-client-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                renderClientLedger(id);
            });
        });

        document.querySelectorAll('.delete-client-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                deleteClient(id);
            });
        });
    }

    function applyClientData(clientId) {
        const client = savedClients.find(c => c.id === clientId);
        if (client) {
            clientNameInput.value = client.name;
            prevClientName.textContent = client.name;

            clientEmailInput.value = client.email;
            prevClientEmail.textContent = client.email || '';

            clientPhoneInput.value = client.phone;
            prevClientPhone.textContent = client.phone || '';

            clientAddressInput.value = client.address;
            prevClientAddress.textContent = client.address || '';
            
            // Highlight success visual feedback
            invoicePaper.classList.add('flash-highlight');
            setTimeout(() => invoicePaper.classList.remove('flash-highlight'), 500);
        }
    }

    function deleteClient(clientId) {
        if (confirm("Are you sure you want to delete this client from CRM?")) {
            savedClients = savedClients.filter(c => c.id !== clientId);
            localStorage.setItem('invoicifly_clients', JSON.stringify(savedClients));
            
            // If the deleted client was active in the ledger, close the ledger
            if (activeLedgerClientId === clientId) {
                document.getElementById('crmLedgerSection').style.display = 'none';
                activeLedgerClientId = null;
            }
            
            renderCrmList();
        }
    }

    // Customer Credit Ledger (Khata Book) Systems
    function renderClientLedger(clientId) {
        const client = savedClients.find(c => c.id === clientId);
        if (!client) return;

        activeLedgerClientId = clientId;
        document.getElementById('ledgerClientName').textContent = client.name;
        
        // Find matching invoices
        const clientInvoices = savedInvoices.filter(inv => (inv.clientName || '').trim().toLowerCase() === client.name.trim().toLowerCase());
        
        const outstandingBalance = clientInvoices
            .filter(inv => inv.status === 'Pending')
            .reduce((sum, inv) => sum + inv.grandTotal, 0);
            
        const totalBilled = clientInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
        
        document.getElementById('ledgerOutstandingBalance').textContent = formatCurrency(outstandingBalance);
        document.getElementById('ledgerTotalBilled').textContent = formatCurrency(totalBilled);
        
        const ledgerHistoryBody = document.getElementById('ledgerHistoryBody');
        ledgerHistoryBody.innerHTML = '';
        
        if (clientInvoices.length === 0) {
            ledgerHistoryBody.innerHTML = `
                <tr>
                    <td colspan="4" class="empty-state-text">No invoices found for this client.</td>
                </tr>
            `;
        } else {
            clientInvoices.forEach(inv => {
                const tr = document.createElement('tr');
                const formattedAmount = `${inv.currency || '₹'}${inv.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
                const statusClass = inv.status.toLowerCase();
                
                tr.innerHTML = `
                    <td><strong>${inv.invNumber}</strong></td>
                    <td><strong>${formattedAmount}</strong></td>
                    <td><span class="status-badge ${statusClass}" data-id="${inv.id}">${inv.status}</span></td>
                    <td>
                        ${inv.status === 'Pending' ? 
                            `<button class="btn btn-secondary btn-xs record-payment-btn" data-id="${inv.id}">Record Payment</button>` : 
                            `<span style="color: var(--color-success); font-size: 11px; font-weight: 600;">✅ Paid</span>`
                        }
                    </td>
                `;
                ledgerHistoryBody.appendChild(tr);
            });
            
            // Add listeners for status badges in the ledger to toggle them
            document.querySelectorAll('#ledgerHistoryBody .status-badge').forEach(badge => {
                badge.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    toggleInvoiceStatus(id);
                });
            });
            
            document.querySelectorAll('#ledgerHistoryBody .record-payment-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    recordLedgerPayment(id, clientId);
                });
            });
        }
        
        // Show ledger panel
        const ledgerSection = document.getElementById('crmLedgerSection');
        ledgerSection.style.display = 'block';
    }

    function recordLedgerPayment(invoiceId, clientId) {
        const inv = savedInvoices.find(i => i.id === invoiceId);
        if (inv) {
            inv.status = 'Paid';
            localStorage.setItem('invoicifly_invoices', JSON.stringify(savedInvoices));
            showToast(`Payment received for ${inv.invNumber}! Marked as Paid.`);
            renderDashboard(); // This also refreshes crm list and ledger
        }
    }

    // Hook Close Ledger button
    const closeLedgerBtn = document.getElementById('closeLedgerBtn');
    if (closeLedgerBtn) {
        closeLedgerBtn.addEventListener('click', () => {
            document.getElementById('crmLedgerSection').style.display = 'none';
            activeLedgerClientId = null;
        });
    }
    // -------------------------------------------------------------
    // MODAL SYSTEM FOR LOAD CLIENTS
    // -------------------------------------------------------------
    loadClientBtn.addEventListener('click', () => {
        renderModalCrmList();
        clientModal.classList.add('active');
    });

    closeModalBtn.addEventListener('click', () => {
        clientModal.classList.remove('active');
    });

    // Close modal if user clicks outside content
    window.addEventListener('click', (e) => {
        if (e.target === clientModal) {
            clientModal.classList.remove('active');
        }
    });

    function renderModalCrmList() {
        modalCrmList.innerHTML = '';
        if (savedClients.length === 0) {
            modalCrmList.innerHTML = `<p class="empty-state-text">No clients saved. Close this modal and add some in the "Clients CRM" tab first!</p>`;
            return;
        }

        savedClients.forEach(client => {
            const item = document.createElement('div');
            item.className = 'modal-client-item';
            item.innerHTML = `
                <div class="crm-card-info">
                    <h4>${client.name}</h4>
                    <p>${client.email || 'No Email'}</p>
                </div>
                <button class="btn btn-primary btn-xs select-modal-client" data-id="${client.id}">Select</button>
            `;
            modalCrmList.appendChild(item);
        });

        document.querySelectorAll('.select-modal-client').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                applyClientData(id);
                clientModal.classList.remove('active');
            });
        });
    }

    // -------------------------------------------------------------
    // SALES DASHBOARD & LOCALSTORAGE INVOICE MANAGER
    // -------------------------------------------------------------

    const saveInvoiceBtn = document.getElementById('saveInvoiceBtn');
    const kpiTotalEarnings = document.getElementById('kpiTotalEarnings');
    const kpiPaidCount = document.getElementById('kpiPaidCount');
    const kpiPendingCount = document.getElementById('kpiPendingCount');
    const historyListBody = document.getElementById('historyListBody');
    let salesChartInstance = null;

    // -------------------------------------------------------------
    // DATABASE BACKUP & RESTORE (JSON EXPORT/IMPORT)
    // -------------------------------------------------------------
    const exportBackupBtn = document.getElementById('exportBackupBtn');
    const importBackupBtn = document.getElementById('importBackupBtn');
    const backupFileInput = document.getElementById('backupFileInput');

    if (exportBackupBtn && importBackupBtn && backupFileInput) {
        // Export Backup
        exportBackupBtn.addEventListener('click', () => {
            const backupData = {
                version: '1.0',
                timestamp: new Date().toISOString(),
                clients: JSON.parse(localStorage.getItem('invoicifly_clients')) || savedClients,
                invoices: JSON.parse(localStorage.getItem('invoicifly_invoices')) || savedInvoices
            };

            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 4));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            const dateStr = new Date().toISOString().slice(0, 10);
            downloadAnchor.setAttribute("download", `billcraft_backup_${dateStr}.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
            showToast("Backup downloaded successfully!");
        });

        // Import Backup - Click file input
        importBackupBtn.addEventListener('click', () => {
            backupFileInput.click();
        });

        // Handle File Selection and Parsing
        backupFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(evt) {
                try {
                    const importedData = JSON.parse(evt.target.result);
                    
                    // Simple Validation
                    if (!importedData.clients || !importedData.invoices) {
                        throw new Error("Invalid backup file format. Missing tables.");
                    }

                    // Restore to LocalStorage
                    localStorage.setItem('invoicifly_clients', JSON.stringify(importedData.clients));
                    localStorage.setItem('invoicifly_invoices', JSON.stringify(importedData.invoices));

                    // Sync variables in active memory
                    savedClients = importedData.clients;
                    savedInvoices = importedData.invoices;

                    // Reload everything in UI
                    renderCrmList();
                    calculateInvoice();
                    renderDashboard();
                    
                    showToast("Database restored successfully!");
                    
                    // Reset input
                    backupFileInput.value = '';
                } catch (err) {
                    showToast("Failed to restore: " + err.message, "error");
                    backupFileInput.value = '';
                }
            };
            reader.readAsText(file);
        });
    }

    // Custom Toast Notification System
    function showToast(message, type = 'success') {
        const existingToasts = document.querySelectorAll('.app-toast');
        existingToasts.forEach(t => t.remove());

        const toast = document.createElement('div');
        toast.className = 'app-toast';
        toast.style.position = 'fixed';
        toast.style.bottom = '24px';
        toast.style.right = '24px';
        toast.style.padding = '12px 20px';
        toast.style.borderRadius = '10px';
        toast.style.backdropFilter = 'blur(12px)';
        toast.style.zIndex = '9999';
        toast.style.display = 'flex';
        toast.style.alignItems = 'center';
        toast.style.gap = '8px';
        toast.style.fontWeight = '600';
        toast.style.fontSize = '13px';
        toast.style.border = '1px solid';
        toast.style.boxShadow = 'var(--shadow-premium)';
        toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';

        if (type === 'success') {
            toast.style.background = 'rgba(16, 185, 129, 0.9)';
            toast.style.color = '#ffffff';
            toast.style.borderColor = 'rgba(16, 185, 129, 0.4)';
            toast.innerHTML = `<span>✅</span> ${message}`;
        } else {
            toast.style.background = 'rgba(239, 68, 68, 0.9)';
            toast.style.color = '#ffffff';
            toast.style.borderColor = 'rgba(239, 68, 68, 0.4)';
            toast.innerHTML = `<span>❌</span> ${message}`;
        }

        document.body.appendChild(toast);
        
        // Trigger reflow & animate in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 10);

        // Animate out and remove
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Dynamic Chart rendering matching colors
    function getPrimaryColor() {
        return getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#a855f7';
    }

    // Lazy load Chart.js to optimize load performance on mobile networks
    function loadChartJS(callback) {
        if (typeof Chart !== 'undefined') {
            if (callback) callback();
            return;
        }
        let script = document.querySelector('script[src*="chart.js"]');
        if (!script) {
            script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.async = true;
            document.head.appendChild(script);
        }
        const oldOnload = script.onload;
        script.onload = () => {
            if (oldOnload) oldOnload();
            if (callback) callback();
        };
    }

    function renderSalesChart() {
        const canvas = document.getElementById('salesChart');
        if (!canvas) return;

        if (typeof Chart === 'undefined') {
            // Lazy load when needed
            loadChartJS(() => {
                renderSalesChart();
            });
            return;
        }

        const ctx = canvas.getContext('2d');
        
        // Filter paid invoices and sort by date chronologically
        const paidInvoices = savedInvoices
            .filter(inv => inv.status === 'Paid')
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        // Group revenue by date for cleaner line chart points
        const revenueByDate = {};
        paidInvoices.forEach(inv => {
            const dateStr = inv.date || 'No Date';
            revenueByDate[dateStr] = (revenueByDate[dateStr] || 0) + inv.grandTotal;
        });

        const sortedDates = Object.keys(revenueByDate).sort((a, b) => new Date(a) - new Date(b));
        
        let cumulativeTotal = 0;
        const labels = ['Start'];
        const dataPoints = [0];

        sortedDates.forEach(date => {
            cumulativeTotal += revenueByDate[date];
            labels.push(date);
            dataPoints.push(cumulativeTotal);
        });

        const primaryColor = getPrimaryColor();

        if (salesChartInstance) {
            salesChartInstance.destroy();
        }

        salesChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Cumulative Sales',
                    data: dataPoints,
                    borderColor: primaryColor,
                    backgroundColor: primaryColor + '15',
                    fill: true,
                    tension: 0.3,
                    borderWidth: 3,
                    pointBackgroundColor: primaryColor,
                    pointHoverRadius: 6,
                    pointRadius: dataPoints.length > 15 ? 2 : 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return ` Cumulative Revenue: ₹${context.raw.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: 'var(--text-muted)' }
                    },
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: 'var(--text-muted)' }
                    }
                }
            }
        });
    }

    // Render Dashboard KPIs & History list
    function renderDashboard() {
        // Compute metrics
        let totalPaid = 0;
        let paidCount = 0;
        let pendingCount = 0;

        savedInvoices.forEach(inv => {
            if (inv.status === 'Paid') {
                totalPaid += inv.grandTotal;
                paidCount++;
            } else {
                pendingCount++;
            }
        });

        // Set KPI Cards values
        kpiTotalEarnings.textContent = `₹${totalPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
        kpiPaidCount.textContent = paidCount;
        kpiPendingCount.textContent = pendingCount;

        // Render Invoices Table
        historyListBody.innerHTML = '';
        if (savedInvoices.length === 0) {
            historyListBody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state-text">No invoices saved yet. Save your first invoice to view history!</td>
                </tr>
            `;
            // Clear chart
            if (salesChartInstance) {
                salesChartInstance.destroy();
                salesChartInstance = null;
            }
            return;
        }

        savedInvoices.forEach(inv => {
            const tr = document.createElement('tr');
            const formattedTotal = `${inv.currency || '₹'}${inv.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
            const statusClass = inv.status.toLowerCase();
            
            tr.innerHTML = `
                <td><strong>${inv.invNumber}</strong></td>
                <td>${inv.clientName || 'N/A'}</td>
                <td>${inv.date}</td>
                <td><strong>${formattedTotal}</strong></td>
                <td>
                    <span class="status-badge ${statusClass}" data-id="${inv.id}">
                        ${inv.status}
                    </span>
                </td>
                <td>
                    <div class="history-actions">
                        <button class="btn btn-secondary btn-xs load-inv-btn" data-id="${inv.id}">Load</button>
                        <button class="btn btn-secondary btn-xs delete-inv-btn" data-id="${inv.id}" style="color: var(--color-danger); border-color: rgba(239, 68, 68, 0.1);">Delete</button>
                    </div>
                </td>
            `;
            historyListBody.appendChild(tr);
        });

        // Add history event listeners
        document.querySelectorAll('.status-badge').forEach(badge => {
            badge.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                toggleInvoiceStatus(id);
            });
        });

        document.querySelectorAll('.load-inv-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                loadInvoice(id);
            });
        });

        document.querySelectorAll('.delete-inv-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                deleteInvoice(id);
            });
        });

        // Update sales growth chart
        renderSalesChart();

        // Sync CRM list UI so outstanding balances recalculate
        renderCrmList();

        // Sync ledger if it is open
        if (activeLedgerClientId) {
            const exists = savedClients.some(c => c.id === activeLedgerClientId);
            if (!exists) {
                const ledgerSec = document.getElementById('crmLedgerSection');
                if (ledgerSec) ledgerSec.style.display = 'none';
                activeLedgerClientId = null;
            } else {
                renderClientLedger(activeLedgerClientId);
            }
        }
    }

    // Save current state as invoice record
    saveInvoiceBtn.addEventListener('click', () => {
        const invNumber = invNumberInput.value.trim() || 'INV-000';
        
        // Calculations for total
        let subtotal = 0;
        invoiceItems.forEach(item => {
            subtotal += item.qty * item.rate;
        });

        const discountRate = parseFloat(discountRateInput.value) || 0;
        const discountAmount = subtotal * (discountRate / 100);
        const taxableAmount = subtotal - discountAmount;
        const taxRate = parseFloat(taxRateInput.value) || 0;
        const taxAmount = taxableAmount * (taxRate / 100);
        const grandTotal = taxableAmount + taxAmount;

        const invoiceRecord = {
            id: 'inv-' + Date.now(),
            invNumber: invNumber,
            currency: invCurrencySelect.value,
            date: invDateInput.value,
            dueDate: invDueInput.value,
            
            senderName: senderNameInput.value,
            senderEmail: senderEmailInput.value,
            senderPhone: senderPhoneInput.value,
            senderAddress: senderAddressInput.value,
            senderSignature: senderSignatureInput.value,
            
            clientName: clientNameInput.value,
            clientEmail: clientEmailInput.value,
            clientPhone: clientPhoneInput.value,
            clientAddress: clientAddressInput.value,
            
            items: JSON.parse(JSON.stringify(invoiceItems)),
            discountRate: discountRate,
            taxType: taxTypeSelect.value,
            taxRate: taxRate,
            notes: invNotesInput.value,
            grandTotal: grandTotal,
            status: 'Pending', // Default status for new invoice records
            createdAt: new Date().toISOString()
        };

        // Check if invoice # already exists to allow update
        const existingIdx = savedInvoices.findIndex(inv => inv.invNumber === invNumber);
        if (existingIdx !== -1) {
            if (confirm(`Invoice number "${invNumber}" already exists in history. Overwrite?`)) {
                // Keep the existing status when overwriting
                invoiceRecord.status = savedInvoices[existingIdx].status;
                invoiceRecord.id = savedInvoices[existingIdx].id;
                savedInvoices[existingIdx] = invoiceRecord;
                localStorage.setItem('invoicifly_invoices', JSON.stringify(savedInvoices));
                showToast(`Invoice ${invNumber} updated in history!`);
                renderDashboard();
            }
            return;
        }

        savedInvoices.unshift(invoiceRecord);
        localStorage.setItem('invoicifly_invoices', JSON.stringify(savedInvoices));
        showToast(`Invoice ${invNumber} saved to history!`);
        
        // Flash preview card and render
        invoicePaper.classList.add('flash-highlight');
        setTimeout(() => invoicePaper.classList.remove('flash-highlight'), 500);

        renderDashboard();
    });

    // Toggle Paid/Pending state
    function toggleInvoiceStatus(id) {
        const inv = savedInvoices.find(i => i.id === id);
        if (inv) {
            inv.status = inv.status === 'Paid' ? 'Pending' : 'Paid';
            localStorage.setItem('invoicifly_invoices', JSON.stringify(savedInvoices));
            showToast(`Invoice ${inv.invNumber} marked as ${inv.status}.`);
            renderDashboard();
        }
    }

    // Load invoice details back into editor inputs
    function loadInvoice(id) {
        const inv = savedInvoices.find(i => i.id === id);
        if (!inv) return;

        invNumberInput.value = inv.invNumber;
        prevInvNumber.textContent = inv.invNumber;

        invCurrencySelect.value = inv.currency || '₹';
        invDateInput.value = inv.date;
        prevInvDate.textContent = inv.date;
        
        invDueInput.value = inv.dueDate;
        prevInvDue.textContent = inv.dueDate;

        // Sender details
        senderNameInput.value = inv.senderName || '';
        prevSenderName.textContent = inv.senderName || '---';
        
        senderEmailInput.value = inv.senderEmail || '';
        prevSenderEmail.textContent = inv.senderEmail || '---';
        
        senderPhoneInput.value = inv.senderPhone || '';
        prevSenderPhone.textContent = inv.senderPhone || '---';
        
        senderAddressInput.value = inv.senderAddress || '';
        prevSenderAddress.textContent = inv.senderAddress || '---';
        
        senderSignatureInput.value = inv.senderSignature || '';
        prevSignatureText.textContent = inv.senderSignature || '';
        if ((inv.senderSignature || '').trim() === '') {
            prevSignatureText.style.display = 'none';
        } else {
            prevSignatureText.style.display = 'inline-block';
        }

        // Client details
        clientNameInput.value = inv.clientName || '';
        prevClientName.textContent = inv.clientName || '---';
        
        clientEmailInput.value = inv.clientEmail || '';
        prevClientEmail.textContent = inv.clientEmail || '';
        
        clientPhoneInput.value = inv.clientPhone || '';
        prevClientPhone.textContent = inv.clientPhone || '';
        
        clientAddressInput.value = inv.clientAddress || '';
        prevClientAddress.textContent = inv.clientAddress || '';

        // Items and adjusters
        invoiceItems = JSON.parse(JSON.stringify(inv.items));
        discountRateInput.value = inv.discountRate;
        taxTypeSelect.value = inv.taxType || 'none';
        taxRateInput.value = inv.taxRate;

        // Toggle tax rate group visibility depending on taxType
        if (taxTypeSelect.value === 'none') {
            taxRateGroup.style.display = 'none';
        } else {
            taxRateGroup.style.display = 'block';
        }

        invNotesInput.value = inv.notes || '';
        prevNotes.textContent = inv.notes || 'Thank you for your business!';

        // Trigger editors and math preview updates
        renderItemsEditor();
        calculateInvoice();

        // Switch Tab to Invoice Builder
        tabButtons.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));
        
        const builderTabBtn = document.querySelector('.tab-btn[data-tab="builder"]');
        if (builderTabBtn) builderTabBtn.classList.add('active');
        
        const builderTabPane = document.getElementById('builderTab');
        if (builderTabPane) builderTabPane.classList.add('active');

        showToast(`Invoice ${inv.invNumber} loaded into builder!`);
        
        // Highlight preview
        invoicePaper.classList.add('flash-highlight');
        setTimeout(() => invoicePaper.classList.remove('flash-highlight'), 500);
    }

    // Delete invoice from record list
    function deleteInvoice(id) {
        const inv = savedInvoices.find(i => i.id === id);
        if (!inv) return;

        if (confirm(`Are you sure you want to delete invoice ${inv.invNumber} from history?`)) {
            savedInvoices = savedInvoices.filter(i => i.id !== id);
            localStorage.setItem('invoicifly_invoices', JSON.stringify(savedInvoices));
            showToast(`Invoice deleted successfully.`, 'error');
            renderDashboard();
        }
    }

    // Initial Dashboard stats rendering on load
    renderDashboard();

    // -------------------------------------------------------------
    // SAVING / PRINTING INVOICE (window.print)
    // -------------------------------------------------------------
    printBtn.addEventListener('click', () => {
        window.print();
    });
});
