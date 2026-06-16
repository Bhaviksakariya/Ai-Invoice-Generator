// Invoice Generator Application Logic

// Initial State
let invoiceState = {
    companyName: 'Classical Enterprise',
    companyMobile: '9601258120',
    companyEmail: 'Bhaviksakariya67@gmail.com',
    companyAddress: 'Mota Varachha, Surat, Gujarat, 394105',
    upiId: 'sonariyauttam560-1@okicici',
    
    invoiceNo: '3',
    invoiceDate: '2026-05-25T09:00', // Matches 25/05/2026 09:00 AM
    dueDate: '2026-05-27',          // Matches 27/05/2026
    
    customerName: 'Bhargav Dangodra',
    customerMobile: '7041138092',
    
    items: [
        { id: 1, name: 'Japanese Jel', qty: 4, unit: 'PCS', rate: 35, total: 140 },
        { id: 2, name: 'Lable Packaging', qty: '', unit: '', rate: '', total: 10 }
    ],
    
    receivedAmount: 0,
    previousBalance: 32, // Matches the 32 previous balance that makes 150 + 32 = 182
    
    // Default displays
    qrSource: 'dynamic', // 'dynamic' or 'static'
    signatureSource: 'image' // 'image' or 'text'
};

// Available pre-defined products
const PREDEFINED_PRODUCTS = [
    { name: 'Japanese Jel', rate: 35, unit: 'PCS' },
    { name: 'Other Packaging', rate: '', unit: '' },
    { name: 'Lable Packaging', rate: '', unit: '' }
];

// Document Elements
document.addEventListener('DOMContentLoaded', () => {
    initForm();
    renderInvoice();
    
    // Bind Form Controls
    document.getElementById('company-name').addEventListener('input', e => {
        invoiceState.companyName = e.target.value;
        renderInvoice();
    });
    document.getElementById('company-mobile').addEventListener('input', e => {
        invoiceState.companyMobile = e.target.value;
        renderInvoice();
    });
    document.getElementById('company-email').addEventListener('input', e => {
        invoiceState.companyEmail = e.target.value;
        renderInvoice();
    });
    document.getElementById('company-address').addEventListener('input', e => {
        invoiceState.companyAddress = e.target.value;
        renderInvoice();
    });
    document.getElementById('upi-id').addEventListener('input', e => {
        invoiceState.upiId = e.target.value;
        renderInvoice();
    });
    
    document.getElementById('invoice-no').addEventListener('input', e => {
        invoiceState.invoiceNo = e.target.value;
        renderInvoice();
    });
    document.getElementById('invoice-date').addEventListener('input', e => {
        invoiceState.invoiceDate = e.target.value;
        renderInvoice();
    });
    document.getElementById('due-date').addEventListener('input', e => {
        invoiceState.dueDate = e.target.value;
        renderInvoice();
    });
    
    document.getElementById('customer-name').addEventListener('input', e => {
        invoiceState.customerName = e.target.value;
        renderInvoice();
    });
    document.getElementById('customer-mobile').addEventListener('input', e => {
        invoiceState.customerMobile = e.target.value;
        renderInvoice();
    });
    
    document.getElementById('received-amount').addEventListener('input', e => {
        invoiceState.receivedAmount = parseFloat(e.target.value) || 0;
        renderInvoice();
    });
    document.getElementById('previous-balance').addEventListener('input', e => {
        invoiceState.previousBalance = parseFloat(e.target.value) || 0;
        renderInvoice();
    });
    
    // QR & Signature Display Settings
    document.getElementById('qr-source').addEventListener('change', e => {
        invoiceState.qrSource = e.target.value;
        renderInvoice();
    });
    document.getElementById('signature-source').addEventListener('change', e => {
        invoiceState.signatureSource = e.target.value;
        renderInvoice();
    });
    
    // Add Item Button
    document.getElementById('add-item-btn').addEventListener('click', addItem);
    
    // Download PDF Button
    document.getElementById('download-pdf-btn').addEventListener('click', downloadPDF);
    
    // Print Button
    document.getElementById('print-btn').addEventListener('click', () => window.print());
});

// Initialize Form Fields with State
function initForm() {
    document.getElementById('company-name').value = invoiceState.companyName;
    document.getElementById('company-mobile').value = invoiceState.companyMobile;
    document.getElementById('company-email').value = invoiceState.companyEmail;
    document.getElementById('company-address').value = invoiceState.companyAddress;
    document.getElementById('upi-id').value = invoiceState.upiId;
    
    document.getElementById('invoice-no').value = invoiceState.invoiceNo;
    document.getElementById('invoice-date').value = invoiceState.invoiceDate;
    document.getElementById('due-date').value = invoiceState.dueDate;
    
    document.getElementById('customer-name').value = invoiceState.customerName;
    document.getElementById('customer-mobile').value = invoiceState.customerMobile;
    
    document.getElementById('received-amount').value = invoiceState.receivedAmount;
    document.getElementById('previous-balance').value = invoiceState.previousBalance;
    
    document.getElementById('qr-source').value = invoiceState.qrSource;
    document.getElementById('signature-source').value = invoiceState.signatureSource;
    
    renderFormItems();
}

// Render the Items List in the Form
function renderFormItems() {
    const container = document.getElementById('form-items-container');
    container.innerHTML = '';
    
    invoiceState.items.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'grid grid-cols-12 gap-2 p-3 bg-slate-950/40 rounded-lg border border-slate-800/80 items-center mb-2 text-slate-100';
        row.innerHTML = `
            <div class="col-span-1 text-center font-semibold text-slate-400">${index + 1}</div>
            
            <div class="col-span-4">
                <select class="w-full text-xs rounded border-slate-700 bg-slate-900 text-slate-100 focus:border-invoiceGold focus:ring-1 focus:ring-invoiceGold item-name-select">
                    <option value="custom" class="bg-slate-900 text-slate-100" ${!PREDEFINED_PRODUCTS.some(p => p.name === item.name) ? 'selected' : ''}>-- Custom Item --</option>
                    ${PREDEFINED_PRODUCTS.map(p => `
                        <option value="${p.name}" class="bg-slate-900 text-slate-100" ${item.name === p.name ? 'selected' : ''}>${p.name}</option>
                    `).join('')}
                </select>
                <input type="text" class="mt-1 w-full text-xs rounded border-slate-700 bg-slate-900 text-slate-100 focus:border-invoiceGold focus:ring-1 focus:ring-invoiceGold item-name-input ${PREDEFINED_PRODUCTS.some(p => p.name === item.name) ? 'hidden' : ''}" value="${item.name}" placeholder="Enter item name">
            </div>
            
            <div class="col-span-2">
                <input type="number" class="w-full text-xs rounded border-slate-700 bg-slate-900 text-slate-100 focus:border-invoiceGold focus:ring-1 focus:ring-invoiceGold item-qty" value="${item.qty}" placeholder="Qty">
                <input type="text" class="mt-1 w-full text-xs rounded border-slate-700 bg-slate-900 text-slate-100 focus:border-invoiceGold focus:ring-1 focus:ring-invoiceGold item-unit" value="${item.unit}" placeholder="Unit (e.g. PCS)">
            </div>
            
            <div class="col-span-2">
                <input type="number" class="w-full text-xs rounded border-slate-700 bg-slate-900 text-slate-100 focus:border-invoiceGold focus:ring-1 focus:ring-invoiceGold item-rate" value="${item.rate}" placeholder="Rate">
            </div>
            
            <div class="col-span-2">
                <input type="number" class="w-full text-xs rounded item-total focus:border-invoiceGold focus:ring-1 focus:ring-invoiceGold ${item.qty && item.rate ? 'bg-slate-950/50 text-slate-400 border-slate-800' : 'bg-slate-900 text-slate-100 border-slate-700'}" value="${item.total}" ${item.qty && item.rate ? 'readonly' : ''} placeholder="Total">
            </div>
            
            <div class="col-span-1 text-center">
                <button class="text-red-400 hover:text-red-500 remove-item-btn" data-index="${index}">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        `;
        
        container.appendChild(row);
        
        // Add Event Listeners for this row
        const selectEl = row.querySelector('.item-name-select');
        const inputEl = row.querySelector('.item-name-input');
        const qtyEl = row.querySelector('.item-qty');
        const unitEl = row.querySelector('.item-unit');
        const rateEl = row.querySelector('.item-rate');
        const totalEl = row.querySelector('.item-total');
        const removeBtn = row.querySelector('.remove-item-btn');
        
        // Select handler
        selectEl.addEventListener('change', (e) => {
            const val = e.target.value;
            if (val === 'custom') {
                inputEl.classList.remove('hidden');
                item.name = inputEl.value;
            } else {
                inputEl.classList.add('hidden');
                item.name = val;
                const predef = PREDEFINED_PRODUCTS.find(p => p.name === val);
                if (predef) {
                    if (predef.rate !== '') {
                        item.rate = predef.rate;
                        rateEl.value = predef.rate;
                    }
                    if (predef.unit !== '') {
                        item.unit = predef.unit;
                        unitEl.value = predef.unit;
                    }
                }
            }
            calculateRowTotal(item, qtyEl, rateEl, totalEl);
            renderInvoice();
        });
        
        // Input text handler
        inputEl.addEventListener('input', (e) => {
            item.name = e.target.value;
            renderInvoice();
        });
        
        // Qty, unit, rate handlers
        qtyEl.addEventListener('input', (e) => {
            item.qty = e.target.value !== '' ? parseFloat(e.target.value) : '';
            calculateRowTotal(item, qtyEl, rateEl, totalEl);
            renderInvoice();
        });
        
        // unit handler
        unitEl.addEventListener('input', (e) => {
            item.unit = e.target.value;
            renderInvoice();
        });
        
        // rate handler
        rateEl.addEventListener('input', (e) => {
            item.rate = e.target.value !== '' ? parseFloat(e.target.value) : '';
            calculateRowTotal(item, qtyEl, rateEl, totalEl);
            renderInvoice();
        });
        
        // total handler
        totalEl.addEventListener('input', (e) => {
            if (!item.qty || !item.rate) {
                item.total = parseFloat(e.target.value) || 0;
                renderInvoice();
            }
        });
        
        // remove handler
        removeBtn.addEventListener('click', () => {
            invoiceState.items.splice(index, 1);
            renderFormItems();
            renderInvoice();
        });
    });
}

function calculateRowTotal(item, qtyEl, rateEl, totalEl) {
    if (item.qty !== '' && item.rate !== '') {
        item.total = Math.round((item.qty * item.rate) * 100) / 100;
        totalEl.value = item.total;
        totalEl.readOnly = true;
        totalEl.classList.add('bg-slate-950/50', 'text-slate-400', 'border-slate-800');
        totalEl.classList.remove('bg-slate-900', 'text-slate-100', 'border-slate-700');
    } else {
        totalEl.readOnly = false;
        totalEl.classList.remove('bg-slate-950/50', 'text-slate-400', 'border-slate-800');
        totalEl.classList.add('bg-slate-900', 'text-slate-100', 'border-slate-700');
    }
}

function addItem() {
    invoiceState.items.push({
        id: Date.now(),
        name: 'Japanese Jel',
        qty: 1,
        unit: 'PCS',
        rate: 35,
        total: 35
    });
    renderFormItems();
    renderInvoice();
}

// Helper: Format Date from HTML Input (YYYY-MM-DDTHH:MM) to DD/MM/YYYY hh:mm A or DD/MM/YYYY
function formatDate(dateTimeStr, includeTime = false) {
    if (!dateTimeStr) return '';
    try {
        const date = new Date(dateTimeStr);
        if (isNaN(date.getTime())) return dateTimeStr;
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        if (includeTime && dateTimeStr.includes('T')) {
            let hours = date.getHours();
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            const hoursStr = String(hours).padStart(2, '0');
            return `${day}/${month}/${year} ${hoursStr}:${minutes} ${ampm}`;
        }
        
        return `${day}/${month}/${year}`;
    } catch (e) {
        return dateTimeStr;
    }
}

// Convert numbers to English words (Indian system: lakh, crore)
function numberToWords(amount) {
    if (amount <= 0) return "zero";
    
    const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", 
                  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
    const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
    
    function convertLessThanThousand(n) {
        if (n === 0) return "";
        let str = "";
        if (n >= 100) {
            str += ones[Math.floor(n / 100)] + " hundred ";
            n %= 100;
        }
        if (n >= 20) {
            str += tens[Math.floor(n / 10)] + (n % 10 > 0 ? "-" + ones[n % 10] : "") + " ";
        } else if (n > 0) {
            str += ones[n] + " ";
        }
        return str.trim();
    }
    
    let num = Math.floor(amount);
    let words = "";
    
    if (num >= 10000000) {
        words += convertLessThanThousand(Math.floor(num / 10000000)) + " crore ";
        num %= 10000000;
    }
    if (num >= 100000) {
        words += convertLessThanThousand(Math.floor(num / 100000)) + " lakh ";
        num %= 100000;
    }
    if (num >= 1000) {
        words += convertLessThanThousand(Math.floor(num / 1000)) + " thousand ";
        num %= 1000;
    }
    if (num > 0) {
        words += convertLessThanThousand(num);
    }
    
    return words.trim();
}

function amountToWords(amount) {
    let value = parseFloat(amount);
    if (isNaN(value) || value <= 0) return "zero";
    
    let rupees = Math.floor(value);
    let paise = Math.round((value - rupees) * 100);
    
    let rupeewords = numberToWords(rupees);
    let paisewords = paise > 0 ? numberToWords(paise) + " paise" : "";
    
    if (rupeewords && paisewords) {
        return `${rupeewords} and ${paisewords}`;
    } else if (rupeewords) {
        return rupeewords;
    } else {
        return paisewords;
    }
}

// Render invoice preview
function renderInvoice() {
    // 1. Company Info
    document.getElementById('preview-company-name').textContent = invoiceState.companyName;
    document.getElementById('preview-company-mobile').textContent = invoiceState.companyMobile;
    document.getElementById('preview-company-email').textContent = invoiceState.companyEmail;
    document.getElementById('preview-company-address').textContent = invoiceState.companyAddress;
    
    // 2. Invoice Meta
    document.getElementById('preview-invoice-no').textContent = invoiceState.invoiceNo;
    document.getElementById('preview-invoice-date').textContent = formatDate(invoiceState.invoiceDate, true);
    document.getElementById('preview-due-date').textContent = formatDate(invoiceState.dueDate, false);
    
    // 3. Customer Info
    document.getElementById('preview-customer-name').textContent = invoiceState.customerName;
    document.getElementById('preview-customer-mobile').textContent = invoiceState.customerMobile;
    
    // 4. Table Items & Totals
    const tableBody = document.getElementById('preview-table-body');
    tableBody.innerHTML = '';
    
    let totalQty = 0;
    let subtotalAmount = 0;
    
    invoiceState.items.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-slate-100 hover:bg-slate-50 transition-colors duration-150';
        
        const qtyVal = item.qty !== '' ? parseFloat(item.qty) : 0;
        const rateVal = item.rate !== '' ? parseFloat(item.rate) : 0;
        const totalVal = parseFloat(item.total) || 0;
        
        totalQty += qtyVal;
        subtotalAmount += totalVal;
        
        // Format Qty Column: show value and unit if both exist
        const qtyDisplay = item.qty !== '' ? `${item.qty} ${item.unit}`.trim() : '';
        const rateDisplay = item.rate !== '' ? `${item.rate}` : '';
        
        tr.innerHTML = `
            <td class="py-3 px-4 text-sm text-slate-500 font-medium">${index + 1}</td>
            <td class="py-3 px-4 text-sm text-slate-800 font-medium">${item.name}</td>
            <td class="py-3 px-4 text-sm text-slate-600 text-right">${qtyDisplay}</td>
            <td class="py-3 px-4 text-sm text-slate-600 text-right">${rateDisplay}</td>
            <td class="py-3 px-4 text-sm text-slate-800 font-semibold text-right">${totalVal}</td>
        `;
        tableBody.appendChild(tr);
    });
    
    // Fill remaining space in table to keep layout clean (optional, but keep it standard)
    const minRows = 4;
    if (invoiceState.items.length < minRows) {
        for (let i = invoiceState.items.length; i < minRows; i++) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="py-3 px-4 text-sm text-transparent">-</td>
                <td class="py-3 px-4 text-sm text-transparent">-</td>
                <td class="py-3 px-4 text-sm text-transparent">-</td>
                <td class="py-3 px-4 text-sm text-transparent">-</td>
                <td class="py-3 px-4 text-sm text-transparent">-</td>
            `;
            tableBody.appendChild(tr);
        }
    }
    
    // SUBTOTAL Values
    document.getElementById('preview-subtotal-qty').textContent = totalQty > 0 ? totalQty : '';
    document.getElementById('preview-subtotal-amount').textContent = `₹ ${subtotalAmount}`;
    
    // Right Calculation Section
    const grandTotal = subtotalAmount;
    const currentBalance = grandTotal - invoiceState.receivedAmount + invoiceState.previousBalance;
    
    document.getElementById('preview-total-amount').textContent = `₹ ${grandTotal}`;
    document.getElementById('preview-received-amount').textContent = `₹${invoiceState.receivedAmount}`;
    document.getElementById('preview-previous-balance').textContent = `₹${invoiceState.previousBalance}`;
    document.getElementById('preview-current-balance').textContent = `₹${currentBalance}`;
    
    // Amount in Words
    const words = amountToWords(currentBalance);
    document.getElementById('preview-amount-words').textContent = words;
    
    // Signature Panel Names
    document.querySelectorAll('.preview-signature-company').forEach(el => {
        el.textContent = invoiceState.companyName;
    });
    
    // Toggle Signature Type
    const sigTextWrap = document.getElementById('preview-signature-text-wrap');
    const sigImgWrap = document.getElementById('preview-signature-image-wrap');
    if (invoiceState.signatureSource === 'image') {
        sigTextWrap.classList.add('hidden');
        sigImgWrap.classList.remove('hidden');
    } else {
        sigTextWrap.classList.remove('hidden');
        sigImgWrap.classList.add('hidden');
    }

    // Toggle QR Code Type
    const qrDynamic = document.getElementById('preview-qrcode-container');
    const qrStatic = document.getElementById('preview-qrcode-static');
    if (invoiceState.qrSource === 'static') {
        qrDynamic.classList.add('hidden');
        qrStatic.classList.remove('hidden');
    } else {
        qrDynamic.classList.remove('hidden');
        qrStatic.classList.add('hidden');
    }
    
    // Generate UPI QR Code
    generateUPIQRCode(currentBalance);
}

// Generate UPI QR Code using qrcode.js
let upiQRCodeInstance = null;
function generateUPIQRCode(amount) {
    const upiContainer = document.getElementById('preview-qrcode-container');
    upiContainer.innerHTML = '';
    
    // Build UPI Payment URL
    // Format: upi://pay?pa=recipient@upi&pn=RecipientName&am=Amount&cu=INR
    const encodedName = encodeURIComponent(invoiceState.companyName);
    const upiUrl = `upi://pay?pa=${invoiceState.upiId}&pn=${encodedName}&am=${amount}&cu=INR`;
    
    // Display UPI ID underneath
    document.getElementById('preview-upi-id-text').textContent = `UPI ID: ${invoiceState.upiId}`;
    
    // Create new QR Code
    try {
        new QRCode(upiContainer, {
            text: upiUrl,
            width: 100,
            height: 100,
            colorDark: "#0f172a",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.M
        });
    } catch (e) {
        console.error('QR Code generation failed:', e);
        // Fallback placeholder
        upiContainer.innerHTML = `<div class="w-full h-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-400">QR Error</div>`;
    }
}

// Download A4 Invoice as PDF
function downloadPDF() {
    const element = document.getElementById('invoice-pdf-container');
    const invoiceNo = invoiceState.invoiceNo || 'Draft';
    const customer = invoiceState.customerName ? `_${invoiceState.customerName.replace(/\s+/g, '_')}` : '';
    
    const opt = {
        margin: 0,
        filename: `Invoice_${invoiceNo}${customer}.pdf`,
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { 
            scale: 2, 
            useCORS: true,
            logging: false,
            letterRendering: true
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait' 
        },
        pagebreak: { mode: ['avoid-all', 'css'] }
    };
    
    // Select download button and change state
    const btn = document.getElementById('download-pdf-btn');
    const origText = btn.innerHTML;
    btn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Generating...
    `;
    btn.disabled = true;
    
    html2pdf().set(opt).from(element).save().then(() => {
        btn.innerHTML = origText;
        btn.disabled = false;
    }).catch(err => {
        console.error(err);
        btn.innerHTML = origText;
        btn.disabled = false;
        alert('Failed to download PDF. Please try standard print (Ctrl+P) and save as PDF.');
    });
}
