
// Configuration for Supabase
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';

// State variables
let user = null;
let employees = [];
let selectedEmployees = [];
let searchQuery = '';
let filterStatus = 'all'; // 'all', 'printed', or 'not_printed'
let singleEmployee = null;

// DOM Elements
const searchInput = document.getElementById('searchInput');
const filterAllBtn = document.getElementById('filterAll');
const filterPrintedBtn = document.getElementById('filterPrinted');
const filterNotPrintedBtn = document.getElementById('filterNotPrinted');
const selectedBanner = document.getElementById('selectedBanner');
const selectedCount = document.getElementById('selectedCount');
const clearSelectionBtn = document.getElementById('clearSelection');
const bulkPrintBtn = document.getElementById('bulkPrintBtn');
const selectAllCheckbox = document.getElementById('selectAllCheckbox');
const employeesTableBody = document.getElementById('employeesTableBody');
const loadingState = document.getElementById('loadingState');
const singleEmployeePreview = document.getElementById('singleEmployeePreview');
const selectedPrintBtnsWrapper = document.getElementById('selectedPrintBtnsWrapper');
const selectedPrintBtn = document.getElementById('selectedPrintBtn');
const selectedPrintCount = document.getElementById('selectedPrintCount');
const singlePrintView = document.getElementById('singlePrintView');
const batchPrintView = document.getElementById('batchPrintView');
const idCardPreview = document.getElementById('idCardPreview');
const downloadBtn = document.getElementById('downloadBtn');
const printBtn = document.getElementById('printBtn');
const printStatus = document.getElementById('printStatus');

// Check if we're on a specific ID page based on URL parameters
const urlParams = new URLSearchParams(window.location.search);
const singleId = urlParams.get('id');
const isSinglePrint = !!singleId;

// Helper functions
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.classList.add('p-4', 'mb-3', 'rounded-md', 'shadow-md', 'flex', 'items-center', 'justify-between');
  
  if (type === 'success') {
    toast.classList.add('bg-green-100', 'text-green-800');
  } else if (type === 'error') {
    toast.classList.add('bg-red-100', 'text-red-800');
  } else if (type === 'info') {
    toast.classList.add('bg-blue-100', 'text-blue-800');
  }
  
  toast.innerHTML = `
    <div class="flex items-center">
      <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} mr-2"></i>
      <span>${message}</span>
    </div>
    <button class="text-gray-500 hover:text-gray-700">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  const closeButton = toast.querySelector('button');
  closeButton.addEventListener('click', () => {
    toast.remove();
  });
  
  document.getElementById('toastContainer').appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 5000);
}

// Supabase API functions
async function fetchCurrentUser() {
  try {
    // This would normally use Supabase's auth.getUser()
    // For demo, we'll simulate a logged-in user
    user = { id: 'simulated-user-id', email: 'user@example.com' };
    
    // Check if user is logged in
    if (!user) {
      window.location.href = '/auth.html';
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    window.location.href = '/auth.html';
    return null;
  }
}

async function fetchEmployees() {
  try {
    loadingState.style.display = 'block';
    
    // This would use Supabase in a real app
    // For demo, we'll use sample data
    const sampleEmployees = [
      {
        id: '1',
        full_name: 'John Doe',
        employee_id: 'EMP001',
        company_name: 'Acme Inc',
        submission_date: '2023-01-15T10:30:00',
        printed: true,
        printed_at: '2023-01-16T14:20:00'
      },
      {
        id: '2',
        full_name: 'Jane Smith',
        employee_id: 'EMP002',
        company_name: 'Acme Inc',
        submission_date: '2023-01-20T09:45:00',
        printed: false
      },
      {
        id: '3',
        full_name: 'Michael Johnson',
        employee_id: 'EMP003',
        company_name: 'TechCorp',
        submission_date: '2023-02-05T11:15:00',
        printed: true,
        printed_at: '2023-02-06T16:30:00'
      }
    ];
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    employees = sampleEmployees;
    return employees;
  } catch (error) {
    console.error('Error fetching employees:', error);
    showToast('Failed to load employees', 'error');
    return [];
  } finally {
    loadingState.style.display = 'none';
  }
}

async function fetchSingleEmployee(id) {
  try {
    // This would use Supabase in a real app
    // For demo, we'll use sample data
    const employee = {
      id: id,
      full_name: 'John Doe',
      employee_id: 'EMP' + id,
      company_name: 'Acme Inc',
      submission_date: '2023-01-15T10:30:00',
      printed: false
    };
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return employee;
  } catch (error) {
    console.error('Error fetching employee:', error);
    showToast('Failed to load employee details', 'error');
    return null;
  }
}

async function updatePrintStatus(employeeIds, isPrinted = true) {
  try {
    // This would use Supabase in a real app
    // For demo, we'll just log it
    console.log(`Setting printed status to ${isPrinted} for employees:`, employeeIds);
    
    // Update local state for the demo
    employees = employees.map(emp => {
      if (employeeIds.includes(emp.id)) {
        return {
          ...emp,
          printed: isPrinted,
          printed_at: isPrinted ? new Date().toISOString() : emp.printed_at
        };
      }
      return emp;
    });
    
    return true;
  } catch (error) {
    console.error('Error updating print status:', error);
    showToast('Failed to update print status', 'error');
    return false;
  }
}

// UI Rendering functions
function renderEmployeeTable(filteredEmployees) {
  employeesTableBody.innerHTML = '';
  
  if (!filteredEmployees || filteredEmployees.length === 0) {
    const noDataRow = document.createElement('tr');
    noDataRow.innerHTML = `
      <td colspan="7" class="p-3 text-center text-gray-500">
        No employees found matching your criteria
      </td>
    `;
    employeesTableBody.appendChild(noDataRow);
    return;
  }
  
  filteredEmployees.forEach(employee => {
    const isSelected = selectedEmployees.some(e => e.id === employee.id);
    const row = document.createElement('tr');
    row.className = isSelected ? 'bg-blue-50' : '';
    row.innerHTML = `
      <td class="p-3">
        <input type="checkbox" class="employee-checkbox rounded border-gray-300" data-id="${employee.id}" ${isSelected ? 'checked' : ''}>
      </td>
      <td class="p-3 font-medium">${employee.full_name}</td>
      <td class="p-3">${employee.employee_id}</td>
      <td class="p-3">${employee.company_name}</td>
      <td class="p-3">${formatDate(employee.submission_date)}</td>
      <td class="p-3">
        ${employee.printed 
          ? `<span class="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
               <i class="fas fa-check mr-1"></i> Printed
             </span>` 
          : `<span class="inline-flex items-center bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
               <i class="fas fa-times mr-1"></i> Not Printed
             </span>`
        }
      </td>
      <td class="p-3 text-right">
        <button class="preview-print-btn px-3 py-1 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-1 ml-auto"
                data-id="${employee.id}">
          <i class="fas fa-print"></i>
          Preview & Print
        </button>
      </td>
    `;
    
    employeesTableBody.appendChild(row);
  });
  
  // Add event listeners for checkboxes
  document.querySelectorAll('.employee-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const employeeId = this.dataset.id;
      const employee = employees.find(e => e.id === employeeId);
      
      if (this.checked) {
        if (!selectedEmployees.some(e => e.id === employeeId)) {
          selectedEmployees.push(employee);
        }
      } else {
        selectedEmployees = selectedEmployees.filter(e => e.id !== employeeId);
      }
      
      updateSelectionUI();
    });
  });
  
  // Add event listeners for preview buttons
  document.querySelectorAll('.preview-print-btn').forEach(button => {
    button.addEventListener('click', function() {
      const employeeId = this.dataset.id;
      const employee = employees.find(e => e.id === employeeId);
      
      selectedEmployees = [employee];
      updateSelectionUI();
      renderSingleEmployeePreview(employee);
    });
  });
}

function renderSingleEmployeePreview(employee) {
  if (!employee) {
    singleEmployeePreview.classList.add('hidden');
    return;
  }
  
  singleEmployeePreview.innerHTML = `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold">ID Card Preview</h2>
        <div class="space-x-2">
          <button class="download-single-btn px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <i class="fas fa-download"></i> Download PDF
          </button>
          <button class="print-single-btn px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2">
            <i class="fas fa-print"></i> Print ID Card
          </button>
        </div>
      </div>

      <div class="flex justify-center">
        <div class="id-card relative bg-white overflow-hidden shadow-xl print:shadow-none p-6"
             style="width: 2.5cm; height: 5cm; max-width: 100%">
          <div class="flex flex-col items-center justify-between h-full text-center">
            <div class="w-full space-y-4">
              <div class="w-12 h-12 mx-auto bg-blue-600 rounded-lg grid place-items-center">
                <span class="text-2xl font-bold text-white">T</span>
              </div>
              
              <div class="space-y-1">
                <h3 class="font-bold text-lg">${employee.full_name}</h3>
                <p class="font-mono text-sm">${employee.employee_id}</p>
              </div>
              
              <div class="space-y-1">
                <h4 class="text-xl font-bold">Tashil</h4>
                <p class="text-sm text-gray-500">
                  Registered: ${formatDate(employee.submission_date)}
                </p>
              </div>
            </div>

            <div class="space-y-2">
              <div class="w-24 h-24 mx-auto">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${employee.id}" 
                  alt="QR Code"
                  class="w-full h-full object-contain"
                />
              </div>
              
              ${employee.printed ? `
                <div class="flex items-center justify-center text-green-500 text-sm">
                  <i class="fas fa-check mr-1"></i>
                  <span>Printed</span>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  singleEmployeePreview.classList.remove('hidden');
  
  // Add event listeners for the buttons
  const downloadBtn = singleEmployeePreview.querySelector('.download-single-btn');
  const printBtn = singleEmployeePreview.querySelector('.print-single-btn');
  
  downloadBtn.addEventListener('click', () => {
    downloadIdCard(employee);
  });
  
  printBtn.addEventListener('click', async () => {
    await printIdCard(employee);
  });
}

function renderSingleEmployeeFullView(employee) {
  // Update the ID card preview
  idCardPreview.innerHTML = `
    <div class="mx-auto bg-white overflow-hidden shadow-xl print:shadow-none">
      <div class="p-2 flex flex-col items-center justify-between h-full">
        <div class="w-full flex items-center justify-between border-b pb-1 mb-1">
          <div class="flex items-center">
            <img
              src="placeholder.svg"
              alt="Company Logo"
              class="h-6 w-6 mr-1"
            />
            <span class="font-bold text-xs">${employee.company_name || 'Company Name'}</span>
          </div>
          <div class="text-right">
            <p class="text-[8px] text-gray-500">ID: ${employee.employee_id?.substring(0, 8) || 'N/A'}</p>
          </div>
        </div>
        
        <div class="flex w-full items-center mb-1">
          <div class="bg-gray-100 rounded-full p-1 mr-2">
            <i class="fas fa-user text-xs"></i>
          </div>
          <div>
            <h3 class="font-semibold text-xs line-clamp-1">${employee.full_name}</h3>
            <p class="text-[8px] text-gray-500">
              <i class="fas fa-calendar-alt text-xs mr-1"></i>
              ${formatDate(employee.submission_date || new Date().toISOString())}
            </p>
          </div>
        </div>
        
        <div class="w-full flex items-end justify-between">
          <div class="text-[8px] text-gray-500">
            <i class="fas fa-building text-xs mr-1"></i>
            ${employee.company_name || 'Company Name'}
          </div>
          <div>
            <i class="fas fa-qrcode text-blue-600 text-lg"></i>
          </div>
        </div>
      </div>
    </div>
    
    <div class="print-only-details hidden print:block mt-4">
      <h3 class="text-sm font-medium">Employee Details</h3>
      <p class="text-xs">Name: ${employee.full_name}</p>
      <p class="text-xs">ID: ${employee.employee_id || 'N/A'}</p>
      <p class="text-xs">Issue Date: ${formatDate(employee.submission_date || new Date().toISOString())}</p>
      <p class="text-xs">Company: ${employee.company_name || 'Company Name'}</p>
    </div>
  `;
  
  // Show single print view
  singlePrintView.classList.remove('hidden');
  batchPrintView.classList.add('hidden');
  
  // Add event listeners for the buttons
  downloadBtn.addEventListener('click', () => {
    downloadIdCard(employee);
  });
  
  printBtn.addEventListener('click', async () => {
    await printIdCard(employee);
    
    // Update print status
    printStatus.innerHTML = `
      <div class="flex items-center justify-center text-green-500">
        <i class="fas fa-check-circle mr-2 text-xl"></i>
        <span>ID Card printed successfully</span>
      </div>
    `;
    printStatus.classList.remove('hidden');
  });
}

function updateSelectionUI() {
  // Update selected count
  selectedCount.textContent = `${selectedEmployees.length} selected`;
  selectedPrintCount.textContent = selectedEmployees.length;
  
  // Show/hide selection banner
  if (selectedEmployees.length > 0) {
    selectedBanner.classList.remove('hidden');
    selectedPrintBtnsWrapper.classList.remove('hidden');
  } else {
    selectedBanner.classList.add('hidden');
    selectedPrintBtnsWrapper.classList.add('hidden');
    singleEmployeePreview.classList.add('hidden');
  }
  
  // Update selectAll checkbox
  if (employees.length > 0) {
    selectAllCheckbox.checked = selectedEmployees.length === employees.length;
    selectAllCheckbox.indeterminate = selectedEmployees.length > 0 && selectedEmployees.length < employees.length;
  }
  
  // Highlight selected rows
  document.querySelectorAll('.employee-checkbox').forEach(checkbox => {
    const row = checkbox.closest('tr');
    if (checkbox.checked) {
      row.classList.add('bg-blue-50');
    } else {
      row.classList.remove('bg-blue-50');
    }
  });
  
  // Show single employee preview if exactly one is selected
  if (selectedEmployees.length === 1) {
    renderSingleEmployeePreview(selectedEmployees[0]);
  } else {
    singleEmployeePreview.classList.add('hidden');
  }
}

function filterEmployees() {
  if (!employees) return [];
  
  return employees.filter(employee => {
    const matchesSearch = 
      !searchQuery ||
      employee.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.employee_id?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = 
      filterStatus === "all" || 
      (filterStatus === "printed" && employee.printed) ||
      (filterStatus === "not_printed" && !employee.printed);

    return matchesSearch && matchesFilter;
  });
}

// ID Card utilities
async function downloadIdCard(employee) {
  try {
    showToast('Preparing ID card for download...', 'info');
    
    // In a real app, this would use jsPDF and html2canvas
    // For demo, we'll just show a success message
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    showToast('ID Card downloaded successfully', 'success');
    
    if (employee.status === "approved") {
      await updatePrintStatus([employee.id], true);
    }
  } catch (error) {
    console.error('Error downloading ID card:', error);
    showToast('Failed to download ID card', 'error');
  }
}

async function printIdCard(employee) {
  try {
    showToast('Sending ID card to printer...', 'info');
    
    // In a real app, this would open a print window
    // For demo, we'll just show a success message
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update database status
    await updatePrintStatus([employee.id], true);
    
    showToast('ID Card printed successfully', 'success');
    
    return true;
  } catch (error) {
    console.error('Error printing ID card:', error);
    showToast('Failed to print ID card', 'error');
    return false;
  }
}

async function handleBulkPrint() {
  if (selectedEmployees.length === 0) {
    showToast('Please select at least one employee', 'error');
    return;
  }

  try {
    showToast(`Processing ${selectedEmployees.length} ID cards...`, 'info');
    
    // Update print status for all selected employees
    await updatePrintStatus(selectedEmployees.map(emp => emp.id), true);
    
    // Generate combined PDF for all selected employees (simulated)
    for (const employee of selectedEmployees) {
      await downloadIdCard(employee);
    }
    
    showToast(`Successfully processed ${selectedEmployees.length} ID cards`, 'success');
    
    // Clear selection and refresh the display
    selectedEmployees = [];
    updateSelectionUI();
    renderEmployeeTable(filterEmployees());
  } catch (error) {
    console.error('Print error:', error);
    showToast('Failed to process ID cards', 'error');
  }
}

// Event Listeners
function setupEventListeners() {
  // Filter buttons
  filterAllBtn.addEventListener('click', () => {
    filterStatus = 'all';
    filterAllBtn.className = 'px-4 py-2 bg-blue-600 text-white rounded-md';
    filterPrintedBtn.className = 'px-4 py-2 border border-gray-300 rounded-md';
    filterNotPrintedBtn.className = 'px-4 py-2 border border-gray-300 rounded-md';
    renderEmployeeTable(filterEmployees());
  });
  
  filterPrintedBtn.addEventListener('click', () => {
    filterStatus = 'printed';
    filterAllBtn.className = 'px-4 py-2 border border-gray-300 rounded-md';
    filterPrintedBtn.className = 'px-4 py-2 bg-blue-600 text-white rounded-md';
    filterNotPrintedBtn.className = 'px-4 py-2 border border-gray-300 rounded-md';
    renderEmployeeTable(filterEmployees());
  });
  
  filterNotPrintedBtn.addEventListener('click', () => {
    filterStatus = 'not_printed';
    filterAllBtn.className = 'px-4 py-2 border border-gray-300 rounded-md';
    filterPrintedBtn.className = 'px-4 py-2 border border-gray-300 rounded-md';
    filterNotPrintedBtn.className = 'px-4 py-2 bg-blue-600 text-white rounded-md';
    renderEmployeeTable(filterEmployees());
  });
  
  // Search input
  searchInput.addEventListener('input', function() {
    searchQuery = this.value;
    renderEmployeeTable(filterEmployees());
  });
  
  // Select all checkbox
  selectAllCheckbox.addEventListener('change', function() {
    if (this.checked) {
      selectedEmployees = [...employees];
    } else {
      selectedEmployees = [];
    }
    
    // Update all checkboxes
    document.querySelectorAll('.employee-checkbox').forEach(checkbox => {
      checkbox.checked = this.checked;
    });
    
    updateSelectionUI();
  });
  
  // Clear selection button
  clearSelectionBtn.addEventListener('click', () => {
    selectedEmployees = [];
    updateSelectionUI();
    renderEmployeeTable(filterEmployees());
  });
  
  // Bulk print button
  bulkPrintBtn.addEventListener('click', handleBulkPrint);
  selectedPrintBtn.addEventListener('click', handleBulkPrint);
}

// Initialize
async function init() {
  // Check authentication
  const user = await fetchCurrentUser();
  if (!user) return;
  
  setupEventListeners();
  
  if (isSinglePrint) {
    // Single print view
    singleEmployee = await fetchSingleEmployee(singleId);
    if (singleEmployee) {
      renderSingleEmployeeFullView(singleEmployee);
    } else {
      showToast('Employee not found', 'error');
    }
  } else {
    // Batch print view
    singlePrintView.classList.add('hidden');
    batchPrintView.classList.remove('hidden');
    
    employees = await fetchEmployees();
    renderEmployeeTable(employees);
  }
}

// Start the app
init();
