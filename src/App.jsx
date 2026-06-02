import React, { useState, useEffect } from 'react';
import { 
  Calendar, Users, Clock, Award, Compass, MapPin, 
  Lock, Settings, FileText, Plus, Trash, Check, X, 
  Gift, AlertCircle, DollarSign, IndianRupee, CheckCircle, Eye, 
  LogOut, Shield, ChevronLeft, ChevronRight, UserPlus, 
  Edit3, RotateCcw, Search, Cake, HardDrive, Key, CheckSquare, AlertTriangle, Menu, Sun, Moon, Bell,
  Mail, Phone
} from 'lucide-react';
import { supabase, resolveIdentifierToEmail } from './supabase';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// WhatsApp icon SVG component
const WhatsAppIcon = ({ size = 12, style }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 448 512" 
    width={size} 
    height={size} 
    style={{ fill: 'currentColor', ...style }}
  >
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
  </svg>
);

// ==========================================
// SEED DATA FOR DEMO MODE (FALLBACK)
// ==========================================
const DEFAULT_HOLIDAYS = [
  { id: 'h1', date: '2026-01-26', name: 'Republic Day' },
  { id: 'h2', date: '2026-05-01', name: 'May Day' },
  { id: 'h3', date: '2026-08-15', name: 'Independence Day' },
  { id: 'h4', date: '2026-09-05', name: 'Onam' },
  { id: 'h5', date: '2026-12-25', name: 'Christmas' }
];

const INITIAL_EMPLOYEES = [
  {
    id: 'emp-1',
    employee_number: 'KSC001',
    username: 'root_admin',
    full_name: 'KSC Root Administrator',
    designation: 'Root Admin',
    employment_category: 'Permanent',
    functional_role: 'Administration',
    additional_charges: ['System Administrator'],
    reporting_officers: ['Director'],
    dob: '1985-01-01',
    joining_date: '2015-06-01',
    gender: 'Male',
    blood_group: 'O+Pos',
    mobile_number: '+91-9876543210',
    email: 'root_admin@ksc.local',
    address: 'Kerala Science City Main Campus, TVM',
    emergency_contact: { name: 'Emergency Admin', relation: 'Spouse', phone: '+91-9876543211' },
    educational_qualification: 'M.Tech Computer Science',
    role: 'Root Admin',
    is_archived: false,
    is_hidden: true,
    weekly_off_eligible: true,
    weekly_off_day: 'Monday',
    daily_wage_rate: 0,
    max_working_days: 0,
    cl_eligible: true, cl_limit_type: 'Annual', cl_limit: 15, cl_balance: 15,
    ml_eligible: true, ml_limit_type: 'Annual', ml_limit: 15, ml_balance: 15,
    el_eligible: true, el_limit_type: 'Annual', el_limit: 20, el_balance: 20,
    sl_eligible: true, sl_limit_type: 'Annual', sl_limit: 10, sl_balance: 10
  },
  {
    id: 'emp-2',
    employee_number: 'KSC012',
    username: 'anil_kumar',
    full_name: 'Anil Kumar S.',
    designation: 'Scientific Officer',
    employment_category: 'Permanent',
    functional_role: 'Technical',
    additional_charges: ['Technical In-Charge'],
    reporting_officers: ['KSC Root Administrator'],
    dob: '1990-06-15',
    joining_date: '2018-02-10',
    gender: 'Male',
    blood_group: 'A+Pos',
    mobile_number: '+91-9988776655',
    email: 'anil_kumar@ksc.local',
    address: 'Vikas Nagar, Trivandrum',
    emergency_contact: { name: 'Saritha P.', relation: 'Wife', phone: '+91-9988776644' },
    educational_qualification: 'Ph.D in Physics',
    role: 'Admin',
    is_archived: false,
    weekly_off_eligible: true,
    weekly_off_day: 'Monday',
    daily_wage_rate: 0,
    max_working_days: 0,
    cl_eligible: true, cl_limit_type: 'Annual', cl_limit: 12, cl_balance: 12,
    ml_eligible: true, ml_limit_type: 'Annual', ml_limit: 10, ml_balance: 10,
    el_eligible: true, el_limit_type: 'Annual', el_limit: 15, el_balance: 15,
    sl_eligible: true, sl_limit_type: 'Annual', sl_limit: 8, sl_balance: 8
  },
  {
    id: 'emp-3',
    employee_number: 'KSC033',
    username: 'reshma_nair',
    full_name: 'Reshma Nair',
    designation: 'Lab Assistant',
    employment_category: 'Daily Wage',
    functional_role: 'Technical',
    additional_charges: [],
    reporting_officers: ['Anil Kumar S.'],
    dob: '1995-10-22',
    joining_date: '2023-01-05',
    gender: 'Female',
    blood_group: 'B+Pos',
    mobile_number: '+91-9444555666',
    email: 'reshma_nair@ksc.local',
    address: 'Science City Staff Quarters, TVM',
    emergency_contact: { name: 'K. Nair', relation: 'Father', phone: '+91-9444555667' },
    educational_qualification: 'B.Sc Chemistry',
    role: 'Employee',
    is_archived: false,
    weekly_off_eligible: false,
    weekly_off_day: 'Monday',
    daily_wage_rate: 900,
    max_working_days: 25,
    cl_eligible: true, cl_limit_type: 'Annual', cl_limit: 10, cl_balance: 10,
    ml_eligible: true, ml_limit_type: 'Annual', ml_limit: 10, ml_balance: 10,
    el_eligible: false, el_limit_type: 'Annual', el_limit: 0, el_balance: 0,
    sl_eligible: false, sl_limit_type: 'Annual', sl_limit: 0, sl_balance: 0
  }
];

// Date formatter to convert yyyy-mm-dd to dd-mm-yyyy
function formatDateDMY(dateStr) {
  if (!dateStr) return 'N/A';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateStr;
}

// Visual status style for printed attendance sheet
function getAttStatusStyle(status) {
  if (!status || status === '-' || status === 'AB') return {};
  const s = status.toUpperCase();
  if (s === 'P' || s === 'OD' || s === 'TR') {
    return { color: '#0f5132', fontWeight: 'bold' }; // Dark green for presence
  }
  if (s === 'CL' || s === 'ML' || s === 'EL' || s === 'SL' || s === 'FH' || s === 'SH' || s === 'CO' || s === 'TO') {
    return { color: '#842029', fontWeight: 'bold' }; // Crimson red for leaves
  }
  if (s === 'A' || s === 'LOP') {
    return { color: '#b91c1c', fontWeight: 'bold' }; // Deep red for absent / LOP
  }
  if (s === 'WO' || s === 'H') {
    return { color: '#084298', fontWeight: 'bold' }; // Blue for Weekly Off / Holiday
  }
  return {};
}

// Indian English number to words converter
function convertNumberToWords(num) {
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num === 0) return 'Zero';

  function count(n, suffix) {
    if (n === 0) return '';
    let str = '';
    if (n > 19) {
      str += b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    } else {
      str += a[n];
    }
    return str + (suffix ? ' ' + suffix : '');
  }

  let words = '';
  const crore = Math.floor(num / 10000000);
  let rem = num % 10000000;
  const lakh = Math.floor(rem / 100000);
  rem %= 100000;
  const thousand = Math.floor(rem / 1000);
  rem %= 1000;
  const hundred = Math.floor(rem / 100);
  const remaining = rem % 100;

  if (crore > 0) {
    words += count(crore, 'Crore') + ' ';
  }
  if (lakh > 0) {
    words += count(lakh, 'Lakh') + ' ';
  }
  if (thousand > 0) {
    words += count(thousand, 'Thousand') + ' ';
  }
  if (hundred > 0) {
    words += count(hundred, 'Hundred') + ' ';
  }
  if (remaining > 0) {
    if (words !== '') {
      words += 'and ';
    }
    words += count(remaining, '') + ' ';
  }

  return words.trim();
}

// Maps 31-day rows into a single table with 11 rows and 3 parallel sections (Days 1-10, 11-20, 21-31)
function renderDailyWageTableRows(dayRows) {
  const rows = [];
  for (let i = 0; i < 11; i++) {
    const d1 = i + 1; // 1 to 10
    const d2 = i + 11; // 11 to 20
    const d3 = i + 21; // 21 to 31

    const r1 = dayRows.find(r => r.day === d1);
    const r2 = dayRows.find(r => r.day === d2);
    const r3 = dayRows.find(r => r.day === d3);

    rows.push({
      d1: r1 ? r1.day : '',
      fn1: r1 ? r1.fnStatus : '',
      an1: r1 ? r1.anStatus : '',
      d2: r2 ? r2.day : '',
      fn2: r2 ? r2.fnStatus : '',
      an2: r2 ? r2.anStatus : '',
      d3: r3 ? r3.day : '',
      fn3: r3 ? r3.fnStatus : '',
      an3: r3 ? r3.anStatus : ''
    });
  }
  return rows;
}

export default function App() {
  // Light/Dark Theme State
  const [theme, setTheme] = useState(() => localStorage.getItem('ksc_theme') || 'dark');

  // Login Screen Switcher Lock
  const [showLoginSettings, setShowLoginSettings] = useState(false);

  // Broadcast Announcements
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState('');
  const [newAnnouncementMessage, setNewAnnouncementMessage] = useState('');
  const [newAnnouncementTarget, setNewAnnouncementTarget] = useState('All'); // 'All' or 'Specific'
  const [newAnnouncementSelectedUsers, setNewAnnouncementSelectedUsers] = useState([]);

  // Malayalam Leave Request Form Modal States
  const [showLeaveFormModal, setShowLeaveFormModal] = useState(false);
  const [leaveFormEmp, setLeaveFormEmp] = useState(null);
  const [leaveFormType, setLeaveFormType] = useState('Casual Leave (CL)');
  const [leaveFormFrom, setLeaveFormFrom] = useState('');
  const [leaveFormTo, setLeaveFormTo] = useState('');
  const [leaveFormTotalDays, setLeaveFormTotalDays] = useState('1');
  const [leaveFormReason, setLeaveFormReason] = useState('');
  const [leaveFormAddress, setLeaveFormAddress] = useState('');
  const [leaveFormPhone, setLeaveFormPhone] = useState('');
  const [leaveFormAppDate, setLeaveFormAppDate] = useState(() => new Date().toISOString().split('T')[0]);
  // Auto-calculate total days for leave application form
  useEffect(() => {
    if (leaveFormFrom && leaveFormTo) {
      const fromD = new Date(leaveFormFrom);
      const toD = new Date(leaveFormTo);
      if (!isNaN(fromD.getTime()) && !isNaN(toD.getTime())) {
        const diffTime = toD.getTime() - fromD.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        if (diffDays > 0) {
          setLeaveFormTotalDays(String(diffDays));
        } else {
          setLeaveFormTotalDays('0');
        }
      }
    }
  }, [leaveFormFrom, leaveFormTo]);

  // Database Mode State
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false);

  // Effect to toggle light/dark theme class on document element
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
    localStorage.setItem('ksc_theme', theme);
  }, [theme]);

  // App & Authentication States
  const [currentUser, setCurrentUser] = useState(null);
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);

  // Core Data Lists (Unified state for either Supabase or Demo mode)
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState({});
  const [cOffCredits, setCOffCredits] = useState([]);
  const [tourRecords, setTourRecords] = useState([]);
  const [locks, setLocks] = useState([]);
  const [wageBreaks, setWageBreaks] = useState([]);
  const [profileRequests, setProfileRequests] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // UI Interactive States (Modals, dates)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1); // 1-12
  const [reportYear, setReportYear] = useState(new Date().getFullYear());
  const [reportMonth, setReportMonth] = useState(new Date().getMonth() + 1); // 1-12
  const [printData, setPrintData] = useState(null);
  const [selectedBatchWagers, setSelectedBatchWagers] = useState([]);
  
  // Dashboard mini calendar active selection states
  const [dashYear, setDashYear] = useState(new Date().getFullYear());
  const [dashMonth, setDashMonth] = useState(new Date().getMonth() + 1);
  const [selectedDashDate, setSelectedDashDate] = useState(new Date().toISOString().split('T')[0]);

  // Modals Toggles
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  
  // Detailed events list for calendar overlay details modal
  const [calendarDateEvents, setCalendarDateEvents] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Requests/Forms states
  const [reqDate, setReqDate] = useState('');
  const [reqStatus, setReqStatus] = useState('P');
  const [reqRemarks, setReqRemarks] = useState('');
  const [selectedCOffCreditId, setSelectedCOffCreditId] = useState('');

  // V1.9 RBAC & Delegate View States
  const [viewedEmployeeId, setViewedEmployeeId] = useState('');
  const [selectedEmpDetails, setSelectedEmpDetails] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const viewedEmployee = employees.find(e => e.id === viewedEmployeeId) || currentUser || {};
  
  // Password modification forms
  const [pwOld, setPwOld] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [pwTargetEmp, setPwTargetEmp] = useState(null); // For Admin password reset
  const [pwTargetNew, setPwTargetNew] = useState('');

  // Self Profile proposed edits
  const [profileEditForm, setProfileEditForm] = useState({
    mobile_number: '',
    email: '',
    address: '',
    gender: 'Male',
    blood_group: '',
    educational_qualification: '',
    emergency_name: '',
    emergency_relation: '',
    emergency_phone: ''
  });

  // Search filter
  const [auditSearch, setAuditSearch] = useState('');
  const [employeeSearch, setEmployeeSearch] = useState('');

  // Selected employee for editing
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Employee creation/edit form state
  const [empForm, setEmpForm] = useState({
    employee_number: '',
    username: '',
    full_name: '',
    designation: '',
    employment_category: 'Permanent',
    functional_role: 'Technical',
    additional_charges: '',
    reporting_officers: '',
    dob: '',
    joining_date: '',
    gender: 'Male',
    blood_group: 'O+Pos',
    mobile_number: '',
    email: '',
    address: '',
    emergency_name: '',
    emergency_relation: '',
    emergency_phone: '',
    educational_qualification: '',
    role: 'Employee',
    is_hidden: false,
    weekly_off_eligible: true,
    weekly_off_day: 'Monday',
    daily_wage_rate: 0,
    max_working_days: 25,
    // Leaves configuration eligibility
    cl_eligible: true, cl_limit_type: 'Annual', cl_limit: 15,
    ml_eligible: true, ml_limit_type: 'Annual', ml_limit: 15,
    el_eligible: true, el_limit_type: 'Annual', el_limit: 20,
    sl_eligible: true, sl_limit_type: 'Annual', sl_limit: 10,
    od_eligible: true,
    tr_eligible: true,
    to_eligible: true,
    co_eligible: true,
    co_limit: 15,
    fh_eligible: true,
    sh_eligible: true,
    a_eligible: true,
    p_eligible: true,
    password: ''
  });

  // Holiday creation form
  const [newHolidayDate, setNewHolidayDate] = useState('');
  const [newHolidayName, setNewHolidayName] = useState('');

  const isSecondSaturday = (dateStr) => {
    if (!dateStr) return false;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return false;
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    const dateObj = new Date(y, m - 1, d);
    if (dateObj.getDay() !== 6) return false; // 6 is Saturday
    return d > 7 && d <= 14;
  };

  const getSundayMondayDates = (dateStr) => {
    if (!dateStr) return { sundayStr: '', mondayStr: '' };
    const parts = dateStr.split('-');
    if (parts.length !== 3) return { sundayStr: '', mondayStr: '' };
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    const dObj = new Date(y, m - 1, d);
    const day = dObj.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    const sunday = new Date(dObj);
    sunday.setDate(dObj.getDate() - day);
    
    const monday = new Date(sunday);
    monday.setDate(sunday.getDate() + 1);
    
    const formatLocalDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    return {
      sundayStr: formatLocalDate(sunday),
      mondayStr: formatLocalDate(monday)
    };
  };

  const checkAndCreditHolidayCOff = async (employeeId, dateStr, status = 'P') => {
    if (dateStr < '2026-04-01') return; // Enforce April 2026 cutoff for C-Off credits
    const emp = employees.find(e => e.id === employeeId);
    if (!emp || !emp.co_eligible) return;

    if (emp.joining_date && dateStr < emp.joining_date) return;

    const isPresent = ['P', 'OD', 'TR', 'FH', 'SH'].includes(status);
    const isHol = holidays.some(h => h.date === dateStr) || isSecondSaturday(dateStr);

    if (!isPresent || !isHol) {
      // Purge any existing credit for this holiday date
      if (isDemoMode) {
        const coffList = JSON.parse(localStorage.getItem('ksc_c_off') || '[]');
        const filteredList = coffList.filter(c => !(c.employee_id === employeeId && c.date_worked === dateStr));
        if (coffList.length !== filteredList.length) {
          localStorage.setItem('ksc_c_off', JSON.stringify(filteredList));
          loadDemoData();
        }
      } else {
        try {
          await supabase
            .from('c_off_credits')
            .delete()
            .eq('employee_id', employeeId)
            .eq('date_worked', dateStr);
          loadSupabaseData();
        } catch (err) {
          console.error("Failed to delete invalid holiday C-Off credit:", err);
        }
      }
      return;
    }

    const yearStr = dateStr.split('-')[0];

    const parts = dateStr.split('-');
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    const dObj = new Date(y, m - 1, d);
    const expDate = new Date(dObj);
    expDate.setMonth(expDate.getMonth() + 3);
    
    const formatLocalDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    const expiryStr = formatLocalDate(expDate);

    const remarks = `C-Off generated for duty on holiday ${dateStr}`;

    if (isDemoMode) {
      const coffList = JSON.parse(localStorage.getItem('ksc_c_off') || '[]');
      if (coffList.some(c => c.employee_id === employeeId && c.date_worked === dateStr)) return;
      
      const currentYearCredits = coffList.filter(c => c.employee_id === employeeId && c.date_worked.startsWith(yearStr)).length;
      const limit = emp.co_limit ?? 15;
      if (currentYearCredits >= limit) {
        console.log(`C-Off limit reached for this year (${currentYearCredits}/${limit})`);
        return;
      }

      const newCredit = {
        id: `coff-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        employee_id: employeeId,
        date_worked: dateStr,
        expiry_date: expiryStr,
        status: 'Available',
        remarks: remarks,
        created_at: new Date().toISOString()
      };
      
      coffList.push(newCredit);
      localStorage.setItem('ksc_c_off', JSON.stringify(coffList));
      addDemoAuditLog('C-Off Earned', `Employee ${emp.full_name} earned 1 C-Off credit for working on holiday ${dateStr}.`);
      loadDemoData();
    } else {
      try {
        // Query Supabase directly to prevent duplicate credits under any race condition
        const { data: existing, error: existError } = await supabase
          .from('c_off_credits')
          .select('id')
          .eq('employee_id', employeeId)
          .eq('date_worked', dateStr);
        if (existError) throw existError;
        if (existing && existing.length > 0) {
          console.log(`C-Off credit already exists on Supabase for ${dateStr}`);
          return;
        }

        // Enforce limits by querying Supabase directly for the current year
        const { data: yrCredits, error: limitError } = await supabase
          .from('c_off_credits')
          .select('id')
          .eq('employee_id', employeeId)
          .gte('date_worked', `${yearStr}-01-01`)
          .lte('date_worked', `${yearStr}-12-31`);
        if (limitError) throw limitError;
        const limit = emp.co_limit ?? 15;
        if (yrCredits && yrCredits.length >= limit) {
          console.log(`C-Off limit reached for this year (${yrCredits.length}/${limit})`);
          return;
        }

        const { error } = await supabase
          .from('c_off_credits')
          .insert({
            employee_id: employeeId,
            date_worked: dateStr,
            expiry_date: expiryStr,
            status: 'Available',
            remarks: remarks
          });
        if (error) throw error;
        
        await supabase.from('audit_logs').insert({
          actor_id: currentUser?.id || employeeId,
          actor_name: currentUser?.full_name || emp.full_name,
          action: 'C-Off Earned',
          details: `Employee ${emp.full_name} earned 1 C-Off credit for working on holiday ${dateStr}.`
        });
        loadSupabaseData();
      } catch (err) {
        console.error("Failed to insert C-Off credit to Supabase:", err);
      }
    }
  };

  const checkAndCreditSundayMondayCOff = async (employeeId, dateStr, tempAttendanceList = null) => {
    if (dateStr < '2026-04-01') return; // Enforce April 2026 cutoff for C-Off credits
    const emp = employees.find(e => e.id === employeeId);
    if (!emp || !emp.co_eligible) return;

    const { sundayStr, mondayStr } = getSundayMondayDates(dateStr);

    if (emp.joining_date && (sundayStr < emp.joining_date || mondayStr < emp.joining_date)) return;

    const getStatus = (targetDate) => {
      if (tempAttendanceList) {
        const rec = tempAttendanceList.find(a => a.employee_id === employeeId && a.date === targetDate);
        if (rec && rec.approval_status !== 'Rejected') return rec.status;
      }
      const rec = attendance.find(a => a.employee_id === employeeId && a.date === targetDate);
      if (rec && rec.approval_status !== 'Rejected') return rec.status;
      
      // Default to Weekly Off (WO) if no attendance record exists. Do NOT assume P.
      return 'WO';
    };

    const sunStatus = getStatus(sundayStr);
    const monStatus = getStatus(mondayStr);

    const isSunWorking = ['P', 'OD', 'TR'].includes(sunStatus);
    const isMonWorking = ['P', 'OD', 'TR'].includes(monStatus);

    if (!isSunWorking || !isMonWorking) {
      // Purge any existing credit for this Sunday/Monday week
      if (isDemoMode) {
        const coffList = JSON.parse(localStorage.getItem('ksc_c_off') || '[]');
        const filteredList = coffList.filter(c => !(c.employee_id === employeeId && (c.date_worked === sundayStr || c.date_worked === mondayStr)));
        if (coffList.length !== filteredList.length) {
          localStorage.setItem('ksc_c_off', JSON.stringify(filteredList));
          loadDemoData();
        }
      } else {
        try {
          await supabase
            .from('c_off_credits')
            .delete()
            .eq('employee_id', employeeId)
            .in('date_worked', [sundayStr, mondayStr]);
          loadSupabaseData();
        } catch (err) {
          console.error("Failed to delete invalid Sunday/Monday C-Off credits:", err);
        }
      }
      return;
    }

    const yearStr = mondayStr.split('-')[0];

    const parts = mondayStr.split('-');
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    const dObj = new Date(y, m - 1, d);
    const expDate = new Date(dObj);
    expDate.setMonth(expDate.getMonth() + 3);
    
    const formatLocalDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    const expiryStr = formatLocalDate(expDate);

    const remarks = `C-Off generated for Sunday/Monday dual working (Sunday ${sundayStr} and Monday ${mondayStr})`;

    if (isDemoMode) {
      const coffList = JSON.parse(localStorage.getItem('ksc_c_off') || '[]');
      if (coffList.some(c => c.employee_id === employeeId && c.date_worked === mondayStr)) return;
      
      const currentYearCredits = coffList.filter(c => c.employee_id === employeeId && c.date_worked.startsWith(yearStr)).length;
      const limit = emp.co_limit ?? 15;
      if (currentYearCredits >= limit) {
        console.log(`C-Off limit reached for this year (${currentYearCredits}/${limit})`);
        return;
      }

      const newCredit = {
        id: `coff-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        employee_id: employeeId,
        date_worked: mondayStr,
        expiry_date: expiryStr,
        status: 'Available',
        remarks: remarks,
        created_at: new Date().toISOString()
      };
      
      coffList.push(newCredit);
      localStorage.setItem('ksc_c_off', JSON.stringify(coffList));
      addDemoAuditLog('C-Off Earned', `Employee ${emp.full_name} earned 1 C-Off credit for Sunday/Monday dual working on ${sundayStr} & ${mondayStr}.`);
      loadDemoData();
    } else {
      try {
        // Query database directly to prevent duplicate inserts
        const { data: existing, error: existError } = await supabase
          .from('c_off_credits')
          .select('id')
          .eq('employee_id', employeeId)
          .eq('date_worked', mondayStr);
        if (existError) throw existError;
        if (existing && existing.length > 0) {
          console.log(`C-Off credit already exists on Supabase for ${mondayStr}`);
          return;
        }

        // Limit verification query
        const { data: yrCredits, error: limitError } = await supabase
          .from('c_off_credits')
          .select('id')
          .eq('employee_id', employeeId)
          .gte('date_worked', `${yearStr}-01-01`)
          .lte('date_worked', `${yearStr}-12-31`);
        if (limitError) throw limitError;
        const limit = emp.co_limit ?? 15;
        if (yrCredits && yrCredits.length >= limit) {
          console.log(`C-Off limit reached for this year (${yrCredits.length}/${limit})`);
          return;
        }

        const { error } = await supabase
          .from('c_off_credits')
          .insert({
            employee_id: employeeId,
            date_worked: mondayStr,
            expiry_date: expiryStr,
            status: 'Available',
            remarks: remarks
          });
        if (error) throw error;

        await supabase.from('audit_logs').insert({
          actor_id: currentUser?.id || employeeId,
          actor_name: currentUser?.full_name || emp.full_name,
          action: 'C-Off Earned',
          details: `Employee ${emp.full_name} earned 1 C-Off credit for Sunday/Monday dual working on ${sundayStr} & ${mondayStr}.`
        });
        loadSupabaseData();
      } catch (err) {
        console.error("Failed to insert C-Off credit to Supabase:", err);
      }
    }
  };

  const refreshCOffForDate = async (employeeId, dateStr, tempAttendanceList = null) => {
    const emp = employees.find(e => e.id === employeeId);
    if (!emp || !emp.co_eligible) return;

    const listToUse = tempAttendanceList || attendance;
    const rec = listToUse.find(a => a.employee_id === employeeId && a.date === dateStr);
    const isApproved = rec && rec.approval_status === 'Approved';
    const status = isApproved ? rec.status : 'A';

    await checkAndCreditHolidayCOff(employeeId, dateStr, status);
    await checkAndCreditSundayMondayCOff(employeeId, dateStr, listToUse);
  };

  const runPassiveCOffBackfill = async (employeeId) => {
    const emp = employees.find(e => e.id === employeeId);
    if (!emp || !emp.co_eligible) return;

    let anyUpdated = false;

    // Fetch the absolute latest C-Off credits directly to bypass any stale React state
    let latestCredits = [];
    if (isDemoMode) {
      latestCredits = JSON.parse(localStorage.getItem('ksc_c_off') || '[]');
    } else {
      try {
        const { data, error } = await supabase
          .from('c_off_credits')
          .select('*')
          .eq('employee_id', employeeId);
        if (!error && data) {
          latestCredits = data;
        }
      } catch (err) {
        console.error("Failed to load latest C-Off credits for backfill:", err);
      }
    }

    // 1. Purge duplicate C-Off credits (keep only one per date_worked)
    const uniqueCredits = [];
    const seenDates = new Set();
    const duplicateIdsToDelete = [];

    latestCredits.forEach(c => {
      if (c.employee_id === employeeId) {
        if (seenDates.has(c.date_worked)) {
          duplicateIdsToDelete.push(c.id);
        } else {
          seenDates.add(c.date_worked);
          uniqueCredits.push(c);
        }
      } else {
        uniqueCredits.push(c);
      }
    });

    if (duplicateIdsToDelete.length > 0) {
      console.log(`Purging duplicate C-Off credits for employee ${employeeId}:`, duplicateIdsToDelete);
      if (isDemoMode) {
        const updatedList = latestCredits.filter(c => !duplicateIdsToDelete.includes(c.id));
        localStorage.setItem('ksc_c_off', JSON.stringify(updatedList));
        latestCredits = updatedList;
      } else {
        try {
          await supabase
            .from('c_off_credits')
            .delete()
            .in('id', duplicateIdsToDelete);
          // Reload latest list from DB after deletion
          const { data } = await supabase
            .from('c_off_credits')
            .select('*')
            .eq('employee_id', employeeId);
          latestCredits = data || [];
        } catch (err) {
          console.error("Failed to delete duplicates from Supabase:", err);
        }
      }
      anyUpdated = true;
    }

    // 2. Purge any C-Off credits before joining date OR before April 1, 2026
    if (isDemoMode) {
      const filteredList = latestCredits.filter(c => !(c.employee_id === employeeId && (c.date_worked < '2026-04-01' || (emp.joining_date && c.date_worked < emp.joining_date))));
      if (latestCredits.length !== filteredList.length) {
        localStorage.setItem('ksc_c_off', JSON.stringify(filteredList));
        latestCredits = filteredList;
        anyUpdated = true;
      }
    } else {
      try {
        let deletedCount = 0;
        if (emp.joining_date && emp.joining_date.trim()) {
          const { data } = await supabase
            .from('c_off_credits')
            .delete()
            .eq('employee_id', employeeId)
            .lt('date_worked', emp.joining_date)
            .select();
          if (data && data.length > 0) deletedCount += data.length;
        }
        const { data } = await supabase
          .from('c_off_credits')
          .delete()
          .eq('employee_id', employeeId)
          .lt('date_worked', '2026-04-01')
          .select();
        if (data && data.length > 0) deletedCount += data.length;
        
        if (deletedCount > 0) {
          // Reload latest list from DB after deletion
          const { data: refreshed } = await supabase
            .from('c_off_credits')
            .select('*')
            .eq('employee_id', employeeId);
          latestCredits = refreshed || [];
          anyUpdated = true;
        }
      } catch (err) {
        console.error("Failed to delete pre-April 2026 C-Off credits:", err);
      }
    }

    const today = new Date();
    const sundayDates = [];
    
    for (let i = 0; i <= 60; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      if (d.getDay() === 0) {
        const formatLocalDate = (date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };
        const dateStr = formatLocalDate(d);
        if (!sundayDates.includes(dateStr)) {
          sundayDates.push(dateStr);
        }
      }
    }

    // 1. Check Sundays & Mondays
    for (const sundayStr of sundayDates) {
      if (sundayStr < '2026-04-01') continue; // Enforce April 2026 cutoff
      if (emp.joining_date && sundayStr < emp.joining_date) continue;

      const parts = sundayStr.split('-');
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      const d = parseInt(parts[2], 10);
      const dObj = new Date(y, m - 1, d);
      
      const nextMon = new Date(dObj);
      nextMon.setDate(dObj.getDate() + 1);
      
      const formatLocalDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      const mondayStr = formatLocalDate(nextMon);

      if (emp.joining_date && mondayStr < emp.joining_date) continue;

      const getStatus = (targetDate) => {
        const rec = attendance.find(a => a.employee_id === employeeId && a.date === targetDate);
        if (rec && rec.approval_status !== 'Rejected') return rec.status;
        
        // Sundays are weekly off (WO) or standard off by default.
        // We should NOT assume they worked unless there is a record.
        return 'WO';
      };

      const sunStatus = getStatus(sundayStr);
      const monStatus = getStatus(mondayStr);

      const isSunWorking = ['P', 'OD', 'TR'].includes(sunStatus);
      const isMonWorking = ['P', 'OD', 'TR'].includes(monStatus);

      if (isSunWorking && isMonWorking) {
        const alreadyCredited = latestCredits.some(c => c.employee_id === employeeId && c.date_worked === mondayStr);
        if (!alreadyCredited) {
          const yearStr = mondayStr.split('-')[0];
          const currentYearCredits = latestCredits.filter(c => c.employee_id === employeeId && c.date_worked.startsWith(yearStr)).length;
          const limit = emp.co_limit ?? 15;
          
          if (currentYearCredits < limit) {
            const expDate = new Date(nextMon);
            expDate.setMonth(expDate.getMonth() + 3);
            const expiryStr = formatLocalDate(expDate);
            const remarks = `Passive C-Off backfill for Sunday/Monday dual working (Sunday ${sundayStr} and Monday ${mondayStr})`;

            if (isDemoMode) {
              const coffList = JSON.parse(localStorage.getItem('ksc_c_off') || '[]');
              if (!coffList.some(c => c.employee_id === employeeId && c.date_worked === mondayStr)) {
                const newCredit = {
                  id: `coff-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  employee_id: employeeId,
                  date_worked: mondayStr,
                  expiry_date: expiryStr,
                  status: 'Available',
                  remarks: remarks,
                  created_at: new Date().toISOString()
                };
                coffList.push(newCredit);
                localStorage.setItem('ksc_c_off', JSON.stringify(coffList));
                addDemoAuditLog('C-Off Earned', `Employee ${emp.full_name} earned 1 C-Off credit via startup backfill for ${sundayStr} & ${mondayStr}.`);
                anyUpdated = true;
              }
            } else {
              try {
                const { error } = await supabase
                  .from('c_off_credits')
                  .insert({
                    employee_id: employeeId,
                    date_worked: mondayStr,
                    expiry_date: expiryStr,
                    status: 'Available',
                    remarks: remarks
                  });
                if (!error) {
                  await supabase.from('audit_logs').insert({
                    actor_id: employeeId,
                    actor_name: emp.full_name,
                    action: 'C-Off Earned',
                    details: `Employee ${emp.full_name} earned 1 C-Off credit via startup backfill for ${sundayStr} & ${mondayStr}.`
                  });
                  anyUpdated = true;
                }
              } catch (err) {
                console.error("Supabase backfill insert failed:", err);
              }
            }
          }
        }
      } else {
        // Purge if it was previously credited but now one of them is WO/leave!
        const invalidCredits = latestCredits.filter(c => c.employee_id === employeeId && (c.date_worked === sundayStr || c.date_worked === mondayStr));
        if (invalidCredits.length > 0) {
          console.log(`Purging invalid Sunday/Monday C-Off credits for ${sundayStr}/${mondayStr} because they are not both working`);
          if (isDemoMode) {
            const coffList = JSON.parse(localStorage.getItem('ksc_c_off') || '[]');
            const filteredList = coffList.filter(c => !(c.employee_id === employeeId && (c.date_worked === sundayStr || c.date_worked === mondayStr)));
            localStorage.setItem('ksc_c_off', JSON.stringify(filteredList));
          } else {
            try {
              await supabase
                .from('c_off_credits')
                .delete()
                .eq('employee_id', employeeId)
                .in('date_worked', [sundayStr, mondayStr]);
            } catch (err) {
              console.error("Failed to delete invalid Sunday/Monday C-Off credits:", err);
            }
          }
          anyUpdated = true;
        }
      }
    }

    // 2. Check holidays
    for (let i = 0; i <= 60; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const formatLocalDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      const dateStr = formatLocalDate(d);
      
      if (dateStr < '2026-04-01') continue; // Enforce April 2026 cutoff for C-Off credits
      if (emp.joining_date && dateStr < emp.joining_date) continue;

      const isHol = holidays.some(h => h.date === dateStr) || isSecondSaturday(dateStr);
      if (isHol) {
        const getStatus = (targetDate) => {
          const rec = attendance.find(a => a.employee_id === employeeId && a.date === targetDate);
          if (rec && rec.approval_status !== 'Rejected') return rec.status;
          
          // Holidays are 'H' by default. We should NOT assume they worked unless there is a record.
          return 'H';
        };

        const status = getStatus(dateStr);
        const isPresent = ['P', 'OD', 'TR'].includes(status);
        if (isPresent) {
          const alreadyCredited = latestCredits.some(c => c.employee_id === employeeId && c.date_worked === dateStr);
          if (!alreadyCredited) {
            const yearStr = dateStr.split('-')[0];
            const currentYearCredits = latestCredits.filter(c => c.employee_id === employeeId && c.date_worked.startsWith(yearStr)).length;
            const limit = emp.co_limit ?? 15;
            
            if (currentYearCredits < limit) {
              const expDate = new Date(d);
              expDate.setMonth(expDate.getMonth() + 3);
              const expiryStr = formatLocalDate(expDate);
              const remarks = `Passive C-Off backfill for working on holiday ${dateStr}`;

              if (isDemoMode) {
                const coffList = JSON.parse(localStorage.getItem('ksc_c_off') || '[]');
                if (!coffList.some(c => c.employee_id === employeeId && c.date_worked === dateStr)) {
                  const newCredit = {
                    id: `coff-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    employee_id: employeeId,
                    date_worked: dateStr,
                    expiry_date: expiryStr,
                    status: 'Available',
                    remarks: remarks,
                    created_at: new Date().toISOString()
                  };
                  coffList.push(newCredit);
                  localStorage.setItem('ksc_c_off', JSON.stringify(coffList));
                  addDemoAuditLog('C-Off Earned', `Employee ${emp.full_name} earned 1 C-Off credit via startup backfill for holiday ${dateStr}.`);
                  anyUpdated = true;
                }
              } else {
                try {
                  const { error } = await supabase
                    .from('c_off_credits')
                    .insert({
                      employee_id: employeeId,
                      date_worked: dateStr,
                      expiry_date: expiryStr,
                      status: 'Available',
                      remarks: remarks
                    });
                  if (!error) {
                    await supabase.from('audit_logs').insert({
                      actor_id: employeeId,
                      actor_name: emp.full_name,
                      action: 'C-Off Earned',
                      details: `Employee ${emp.full_name} earned 1 C-Off credit via startup backfill for holiday ${dateStr}.`
                    });
                    anyUpdated = true;
                  }
                } catch (err) {
                  console.error("Supabase holiday backfill insert failed:", err);
                }
              }
            }
          }
        } else {
          // Purge if it was previously credited but now they are not present on the holiday!
          const invalidCredits = latestCredits.filter(c => c.employee_id === employeeId && c.date_worked === dateStr);
          if (invalidCredits.length > 0) {
            console.log(`Purging invalid holiday C-Off credits for ${dateStr} because employee is not present`);
            if (isDemoMode) {
              const coffList = JSON.parse(localStorage.getItem('ksc_c_off') || '[]');
              const filteredList = coffList.filter(c => !(c.employee_id === employeeId && c.date_worked === dateStr));
              localStorage.setItem('ksc_c_off', JSON.stringify(filteredList));
            } else {
              try {
                await supabase
                  .from('c_off_credits')
                  .delete()
                  .eq('employee_id', employeeId)
                  .eq('date_worked', dateStr);
              } catch (err) {
                console.error("Failed to delete invalid holiday C-Off credit:", err);
              }
            }
            anyUpdated = true;
          }
        }
      }
    }

    if (anyUpdated) {
      if (isDemoMode) loadDemoData();
      else loadSupabaseData();
    }
  };

  // ==========================================
  // INITIALIZATION & DATABASE CHECK
  // ==========================================
  useEffect(() => {
    const hasKeys = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (hasKeys) {
      setIsSupabaseConfigured(true);
      setIsDemoMode(false);
    } else {
      setIsSupabaseConfigured(false);
      setIsDemoMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDemoMode) {
      loadDemoData();
    } else {
      loadSupabaseData();
    }
  }, [isDemoMode]);

  useEffect(() => {
    if (currentUser && currentUser.joining_date) {
      const parts = currentUser.joining_date.split('-');
      const joinY = parseInt(parts[0]);
      const joinM = parseInt(parts[1]);
      if (currentYear < joinY || (currentYear === joinY && currentMonth < joinM)) {
        setCurrentMonth(joinM);
        setCurrentYear(joinY);
      }
    }
  }, [currentUser, currentYear, currentMonth]);

  useEffect(() => {
    if (currentUser && !loading && employees.length > 0) {
      runPassiveCOffBackfill(currentUser.id);
    }
  }, [currentUser?.id, loading, employees.length]);

  useEffect(() => {
    if (currentUser) {
      setViewedEmployeeId(currentUser.id);
    } else {
      setViewedEmployeeId('');
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (printData) {
      // Trigger printing after 800ms to allow DOM rendering to stabilize
      const printTimer = setTimeout(() => {
        window.print();
      }, 800);

      // Keep print component mounted for 10 seconds to allow async mobile print previews to generate
      const clearTimer = setTimeout(() => {
        setPrintData(null);
      }, 10000);

      return () => {
        clearTimeout(printTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [printData]);

  // Load Seed / LocalStorage Data for Demo Mode
  const loadDemoData = () => {
    setLoading(true);
    
    // Get or Set Employees
    let storedEmployees = localStorage.getItem('ksc_employees');
    if (!storedEmployees) {
      localStorage.setItem('ksc_employees', JSON.stringify(INITIAL_EMPLOYEES));
      storedEmployees = JSON.stringify(INITIAL_EMPLOYEES);
    }
    const parsedEmployees = JSON.parse(storedEmployees);
    setEmployees(parsedEmployees);

    // Get or Set Holidays
    let storedHolidays = localStorage.getItem('ksc_holidays');
    if (!storedHolidays) {
      localStorage.setItem('ksc_holidays', JSON.stringify(DEFAULT_HOLIDAYS));
      storedHolidays = JSON.stringify(DEFAULT_HOLIDAYS);
    }
    setHolidays(JSON.parse(storedHolidays));

    // Get or Set Locks
    let storedLocks = localStorage.getItem('ksc_locks');
    if (!storedLocks) {
      localStorage.setItem('ksc_locks', JSON.stringify([]));
      storedLocks = JSON.stringify([]);
    }
    setLocks(JSON.parse(storedLocks));

    // Get or Set Attendance
    let storedAttendance = localStorage.getItem('ksc_attendance');
    if (!storedAttendance) {
      localStorage.setItem('ksc_attendance', JSON.stringify([]));
      storedAttendance = JSON.stringify([]);
    }
    setAttendance(JSON.parse(storedAttendance));

    // Get or Set COff Credits
    // Get or Set COff Credits (Only April 2026 onwards)
    let storedCOff = localStorage.getItem('ksc_c_off');
    if (!storedCOff) {
      localStorage.setItem('ksc_c_off', JSON.stringify([]));
      storedCOff = JSON.stringify([]);
    }
    setCOffCredits((JSON.parse(storedCOff) || []).filter(c => c.date_worked >= '2026-04-01'));

    // Get or Set Announcements
    let storedAnns = localStorage.getItem('ksc_announcements');
    if (!storedAnns) {
      localStorage.setItem('ksc_announcements', JSON.stringify([]));
      storedAnns = JSON.stringify([]);
    }
    setAnnouncements(JSON.parse(storedAnns));

    // Get or Set Tour Records
    let storedTours = localStorage.getItem('ksc_tours');
    if (!storedTours) {
      localStorage.setItem('ksc_tours', JSON.stringify([]));
      storedTours = JSON.stringify([]);
    }
    setTourRecords(JSON.parse(storedTours));

    // Get or Set Daily wage breaks
    let storedBreaks = localStorage.getItem('ksc_breaks');
    if (!storedBreaks) {
      localStorage.setItem('ksc_breaks', JSON.stringify([]));
      storedBreaks = JSON.stringify([]);
    }
    setWageBreaks(JSON.parse(storedBreaks));

    // Get or Set Profile update Requests Queue
    let storedRequests = localStorage.getItem('ksc_profile_requests');
    if (!storedRequests) {
      localStorage.setItem('ksc_profile_requests', JSON.stringify([]));
      storedRequests = JSON.stringify([]);
    }
    setProfileRequests(JSON.parse(storedRequests));

    // Get or Set Audit Logs
    let storedAudits = localStorage.getItem('ksc_audits');
    if (!storedAudits) {
      const initialLogs = [{
        id: 'audit-1',
        actor_id: 'emp-1',
        actor_name: 'KSC Root Administrator',
        action: 'System Initialization',
        details: 'Simulated Local Storage Database seeded successfully with Rupee styling and verification triggers.',
        created_at: new Date().toISOString()
      }];
      localStorage.setItem('ksc_audits', JSON.stringify(initialLogs));
      storedAudits = JSON.stringify(initialLogs);
    }
    setAuditLogs(JSON.parse(storedAudits));

    setLoading(false);
  };

  // Load Database Data from Supabase
  const loadSupabaseData = async () => {
    setLoading(true);
    try {
      const { data: empData, error: empErr } = await supabase
        .from('employees')
        .select('*')
        .order('full_name', { ascending: true });
      if (empErr) throw empErr;
      setEmployees(empData || []);

      const { data: holData, error: holErr } = await supabase
        .from('holidays')
        .select('*')
        .order('date', { ascending: true });
      if (holErr) throw holErr;
      
      if (holData && holData.length > 0) {
        setHolidays(holData);
      } else {
        // Seed DEFAULT_HOLIDAYS to live database table asynchronously
        setHolidays(DEFAULT_HOLIDAYS);
        Promise.all(DEFAULT_HOLIDAYS.map(h => 
          supabase.from('holidays').insert({ date: h.date, name: h.name })
        )).then(() => {
          // Re-fetch to get correct generated database UUIDs
          supabase.from('holidays').select('*').order('date', { ascending: true })
            .then(({ data }) => { if (data && data.length > 0) setHolidays(data); });
        }).catch(err => console.error("Error seeding holidays:", err));
      }

      const { data: lockData, error: lockErr } = await supabase
        .from('attendance_locks')
        .select('*');
      if (lockErr) throw lockErr;
      setLocks(lockData || []);

      const { data: attData, error: attErr } = await supabase
        .from('attendance')
        .select('*')
        .order('date', { ascending: false });
      if (attErr) throw attErr;
      setAttendance(attData || []);

      const { data: coffData, error: coffErr } = await supabase
        .from('c_off_credits')
        .select('*')
        .order('date_worked', { ascending: false });
      if (coffErr) throw coffErr;
      setCOffCredits((coffData || []).filter(c => c.date_worked >= '2026-04-01'));

      // Get Announcements
      let announcementsData = [];
      try {
        const { data, error } = await supabase
          .from('announcements')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error) announcementsData = data || [];
        else console.warn("Announcements table might not exist in Supabase yet:", error.message);
      } catch (e) {
        console.warn("Failed to query announcements from Supabase:", e);
      }
      setAnnouncements(announcementsData);

      const { data: tourData, error: tourErr } = await supabase
        .from('tour_records')
        .select('*')
        .order('start_date', { ascending: false });
      if (tourErr) throw tourErr;
      setTourRecords(tourData || []);

      const { data: breakData, error: breakErr } = await supabase
        .from('daily_wage_breaks')
        .select('*');
      if (breakErr) throw breakErr;
      setWageBreaks(breakData || []);

      const { data: reqData, error: reqErr } = await supabase
        .from('profile_update_requests')
        .select('*')
        .order('submitted_at', { ascending: false });
      if (!reqErr) setProfileRequests(reqData || []);

      const { data: leaveData, error: leaveErr } = await supabase
        .from('leave_balances')
        .select('*');
      if (leaveErr) throw leaveErr;
      const leaveMap = {};
      if (leaveData) {
        leaveData.forEach(item => {
          leaveMap[item.employee_id] = item;
        });
      }
      setLeaveBalances(leaveMap);

      if (currentUser?.role === 'Root Admin') {
        const { data: auditData, error: auditErr } = await supabase
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false });
        if (!auditErr) setAuditLogs(auditData || []);
      }
    } catch (err) {
      console.error('Supabase query failed, switching back to demo fallback.', err);
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  const addDemoAuditLog = (action, details) => {
    const logs = JSON.parse(localStorage.getItem('ksc_audits') || '[]');
    const newLog = {
      id: `audit-${Date.now()}`,
      actor_id: currentUser ? currentUser.id : 'anonymous',
      actor_name: currentUser ? currentUser.full_name : 'Guest User',
      action: action,
      details: details,
      created_at: new Date().toISOString()
    };
    const updatedLogs = [newLog, ...logs];
    localStorage.setItem('ksc_audits', JSON.stringify(updatedLogs));
    setAuditLogs(updatedLogs);
  };

  // ==========================================
  // AUTHENTICATION LOGIC
  // ==========================================
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    if (!loginIdentifier || !loginPassword) {
      setLoginError('Please enter credentials.');
      return;
    }

    if (isDemoMode) {
      const matchedUser = employees.find(
        emp => (emp.username === loginIdentifier.trim() || emp.employee_number === loginIdentifier.trim()) && !emp.is_archived
      );

      if (matchedUser) {
        if (loginPassword === 'KSCAdminPassword123!' || loginPassword.length >= 6) {
          setCurrentUser(matchedUser);
          addDemoAuditLog('Login', `User ${matchedUser.full_name} logged in (Demo Mode).`);
        } else {
          setLoginError('Invalid password. Default demo password is: KSCAdminPassword123!');
        }
      } else {
        setLoginError('Employee not found or archived.');
      }
    } else {
      setLoading(true);
      try {
        const resolvedEmail = await resolveIdentifierToEmail(loginIdentifier.trim());
        if (!resolvedEmail) {
          setLoginError('Identifier mapping failed.');
          setLoading(false);
          return;
        }

        const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
          email: resolvedEmail,
          password: loginPassword
        });

        if (authErr) throw authErr;

        if (authData.user) {
          const { data: empRecord, error: empErr } = await supabase
            .from('employees')
            .select('*')
            .eq('id', authData.user.id)
            .single();

          if (empErr || !empRecord) {
            setLoginError('Employee profile details missing.');
            await supabase.auth.signOut();
          } else if (empRecord.is_archived) {
            setLoginError('This account has been archived.');
            await supabase.auth.signOut();
          } else {
            setCurrentUser(empRecord);
            await supabase.from('audit_logs').insert({
              actor_id: empRecord.id,
              actor_name: empRecord.full_name,
              action: 'Login',
              details: `User logged in securely via Supabase Auth.`
            });
            loadSupabaseData();
          }
        }
      } catch (err) {
        setLoginError(err.message || 'Login failed.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLogout = async () => {
    if (isDemoMode) {
      addDemoAuditLog('Logout', `User ${currentUser.full_name} logged out.`);
      setCurrentUser(null);
      setActiveTab('dashboard');
    } else {
      setLoading(true);
      try {
        await supabase.from('audit_logs').insert({
          actor_id: currentUser.id,
          actor_name: currentUser.full_name,
          action: 'Logout',
          details: `User logged out.`
        });
        await supabase.auth.signOut();
        setCurrentUser(null);
        setActiveTab('dashboard');
      } catch (err) {
        console.error('Logout log failed', err);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    }
  };

  // ==========================================
  // CHANGE PASSWORD (SELF SERVICE & ADMIN)
  // ==========================================
  const handleOwnPasswordChange = async (e) => {
    e.preventDefault();
    if (pwNew !== pwConfirm) { alert("Passwords do not match."); return; }
    if (pwNew.length < 6) { alert("Minimum 6 characters."); return; }

    if (isDemoMode) {
      addDemoAuditLog('Password Modification', `Changed own password.`);
      alert("Password updated!");
      setShowPasswordModal(false);
      setPwOld(''); setPwNew(''); setPwConfirm('');
    } else {
      setLoading(true);
      try {
        const { error } = await supabase.rpc('change_own_password', {
          p_current_password: pwOld,
          p_new_password: pwNew
        });
        if (error) throw error;
        alert("Password changed successfully!");
        setShowPasswordModal(false);
        setPwOld(''); setPwNew(''); setPwConfirm('');
      } catch (err) {
        alert(err.message || "Failed to update password.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAdminResetPassword = async (e) => {
    e.preventDefault();
    if (!pwTargetNew || pwTargetNew.length < 6) { alert("Minimum 6 characters."); return; }

    if (isDemoMode) {
      addDemoAuditLog('Password Reset', `Reset password for: ${pwTargetEmp.full_name}`);
      alert(`Password for ${pwTargetEmp.full_name} reset to: ${pwTargetNew}`);
      setShowResetPasswordModal(false);
      setPwTargetEmp(null);
      setPwTargetNew('');
    } else {
      setLoading(true);
      try {
        const { error } = await supabase.rpc('reset_employee_password', {
          p_employee_id: pwTargetEmp.id,
          p_new_password: pwTargetNew
        });
        if (error) throw error;
        alert("Password successfully reset!");
        setShowResetPasswordModal(false);
        setPwTargetEmp(null);
        setPwTargetNew('');
      } catch (err) {
        alert(err.message || "Failed to reset password.");
      } finally {
        setLoading(false);
      }
    }
  };

  // ==========================================
  // EMPLOYEE ADD / EDIT / ARCHIVE (CRUD)
  // ==========================================
  const openNewEmployeeModal = () => {
    setEditingEmployee(null);
    setEmpForm({
      employee_number: `KSC${String(employees.length + 1).padStart(3, '0')}`,
      username: '',
      full_name: '',
      designation: '',
      employment_category: 'Permanent',
      functional_role: 'Technical',
      additional_charges: '',
      reporting_officers: '',
      dob: '',
      joining_date: new Date().toISOString().split('T')[0],
      gender: 'Male',
      blood_group: 'O+Pos',
      mobile_number: '',
      email: '',
      address: '',
      emergency_name: '',
      emergency_relation: '',
      emergency_phone: '',
      educational_qualification: '',
      role: 'Employee',
      weekly_off_eligible: true,
      weekly_off_day: 'Monday',
      daily_wage_rate: 0,
      max_working_days: 25,
      // Default eligibility configurations
      cl_eligible: true, cl_limit_type: 'Annual', cl_limit: 15,
      ml_eligible: true, ml_limit_type: 'Annual', ml_limit: 15,
      el_eligible: true, el_limit_type: 'Annual', el_limit: 20,
      sl_eligible: true, sl_limit_type: 'Annual', sl_limit: 10,
      od_eligible: true,
      tr_eligible: true,
      to_eligible: true,
      co_eligible: true,
      co_limit: 15,
      fh_eligible: true,
      sh_eligible: true,
      a_eligible: true,
      p_eligible: true,
      is_hidden: false,
      password: 'TemporaryPass123!'
    });
    setShowEmployeeModal(true);
  };

  const openEditEmployeeModal = (emp) => {
    setEditingEmployee(emp);
    
    const balance = isDemoMode 
      ? { 
          cl_eligible: emp.cl_eligible ?? true, cl_limit_type: emp.cl_limit_type ?? 'Annual', cl_limit: emp.cl_limit ?? 15,
          ml_eligible: emp.ml_eligible ?? true, ml_limit_type: emp.ml_limit_type ?? 'Annual', ml_limit: emp.ml_limit ?? 15,
          el_eligible: emp.el_eligible ?? true, el_limit_type: emp.el_limit_type ?? 'Annual', el_limit: emp.el_limit ?? 20,
          sl_eligible: emp.sl_eligible ?? true, sl_limit_type: emp.sl_limit_type ?? 'Annual', sl_limit: emp.sl_limit ?? 10
        }
      : { 
          cl_eligible: leaveBalances[emp.id]?.cl_eligible ?? true,
          cl_limit_type: leaveBalances[emp.id]?.cl_limit_type ?? 'Annual',
          cl_limit: leaveBalances[emp.id]?.cl_limit ?? 15,

          ml_eligible: leaveBalances[emp.id]?.ml_eligible ?? true,
          ml_limit_type: leaveBalances[emp.id]?.ml_limit_type ?? 'Annual',
          ml_limit: leaveBalances[emp.id]?.ml_limit ?? 15,

          el_eligible: leaveBalances[emp.id]?.el_eligible ?? true,
          el_limit_type: leaveBalances[emp.id]?.el_limit_type ?? 'Annual',
          el_limit: leaveBalances[emp.id]?.el_limit ?? 20,

          sl_eligible: leaveBalances[emp.id]?.sl_eligible ?? true,
          sl_limit_type: leaveBalances[emp.id]?.sl_limit_type ?? 'Annual',
          sl_limit: leaveBalances[emp.id]?.sl_limit ?? 10
        };

    setEmpForm({
      employee_number: emp.employee_number,
      username: emp.username, // Admin can edit username!
      full_name: emp.full_name,
      designation: emp.designation,
      employment_category: emp.employment_category,
      functional_role: emp.functional_role,
      additional_charges: emp.additional_charges?.join(', ') || '',
      reporting_officers: emp.reporting_officers?.join(', ') || '',
      dob: emp.dob || '',
      joining_date: emp.joining_date,
      gender: emp.gender || 'Male',
      blood_group: emp.blood_group || 'O+Pos',
      mobile_number: emp.mobile_number || '',
      email: emp.email || '',
      address: emp.address || '',
      emergency_name: emp.emergency_contact?.name || '',
      emergency_relation: emp.emergency_contact?.relation || '',
      emergency_phone: emp.emergency_contact?.phone || '',
      educational_qualification: emp.educational_qualification || '',
      role: emp.role,
      weekly_off_eligible: emp.weekly_off_eligible,
      weekly_off_day: emp.weekly_off_day,
      daily_wage_rate: emp.daily_wage_rate || 0,
      max_working_days: emp.max_working_days || 25,
      // Leave Configs
      cl_eligible: balance.cl_eligible, cl_limit_type: balance.cl_limit_type, cl_limit: balance.cl_limit,
      ml_eligible: balance.ml_eligible, ml_limit_type: balance.ml_limit_type, ml_limit: balance.ml_limit,
      el_eligible: balance.el_eligible, el_limit_type: balance.el_limit_type, el_limit: balance.el_limit,
      sl_eligible: balance.sl_eligible, sl_limit_type: balance.sl_limit_type, sl_limit: balance.sl_limit,
      od_eligible: emp.od_eligible ?? true,
      tr_eligible: emp.tr_eligible ?? true,
      to_eligible: emp.to_eligible ?? true,
      co_eligible: emp.co_eligible ?? true,
      co_limit: emp.co_limit ?? 15,
      fh_eligible: emp.fh_eligible ?? true,
      sh_eligible: emp.sh_eligible ?? true,
      a_eligible: emp.a_eligible ?? true,
      p_eligible: emp.p_eligible ?? true,
      is_hidden: emp.is_hidden ?? false,
      password: ''
    });
    setShowEmployeeModal(true);
  };

  const handleSaveEmployee = async (e) => {
    e.preventDefault();
    
    const chargesArray = empForm.additional_charges.split(',').map(s => s.trim()).filter(Boolean);
    const officersArray = empForm.reporting_officers.split(',').map(s => s.trim()).filter(Boolean);
    const emergencyObj = {
      name: empForm.emergency_name.trim(),
      relation: empForm.emergency_relation.trim(),
      phone: empForm.emergency_phone.trim()
    };

    if (isDemoMode) {
      let storedList = JSON.parse(localStorage.getItem('ksc_employees') || '[]');
      
      if (editingEmployee) {
        // Edit Existing (Username editable!)
        const updatedList = storedList.map(emp => {
          if (emp.id === editingEmployee.id) {
            return {
              ...emp,
              employee_number: empForm.employee_number,
              username: empForm.username, // Saved successfully!
              full_name: empForm.full_name,
              designation: empForm.designation,
              employment_category: empForm.employment_category,
              functional_role: empForm.functional_role,
              additional_charges: chargesArray,
              reporting_officers: officersArray,
              dob: empForm.dob || null,
              joining_date: empForm.joining_date,
              gender: empForm.gender,
              blood_group: empForm.blood_group,
              mobile_number: empForm.mobile_number,
              email: empForm.email || `${empForm.username.toLowerCase()}@ksc.local`,
              address: empForm.address,
              emergency_contact: emergencyObj,
              educational_qualification: empForm.educational_qualification,
              role: empForm.role,
              weekly_off_eligible: empForm.weekly_off_eligible,
              weekly_off_day: empForm.weekly_off_day,
              daily_wage_rate: parseFloat(empForm.daily_wage_rate),
              max_working_days: parseInt(empForm.max_working_days),
              // Leave Configs
              cl_eligible: empForm.cl_eligible, cl_limit_type: empForm.cl_limit_type, cl_limit: parseFloat(empForm.cl_limit), cl_balance: parseFloat(empForm.cl_limit),
              ml_eligible: empForm.ml_eligible, ml_limit_type: empForm.ml_limit_type, ml_limit: parseFloat(empForm.ml_limit), ml_balance: parseFloat(empForm.ml_limit),
              el_eligible: empForm.el_eligible, el_limit_type: empForm.el_limit_type, el_limit: parseFloat(empForm.el_limit), el_balance: parseFloat(empForm.el_limit),
              sl_eligible: empForm.sl_eligible, sl_limit_type: empForm.sl_limit_type, sl_limit: parseFloat(empForm.sl_limit), sl_balance: parseFloat(empForm.sl_limit),
              od_eligible: empForm.od_eligible,
              tr_eligible: empForm.tr_eligible,
              to_eligible: empForm.to_eligible,
              co_eligible: empForm.co_eligible,
              co_limit: parseInt(empForm.co_limit) || 15,
              fh_eligible: empForm.fh_eligible,
              sh_eligible: empForm.sh_eligible,
              a_eligible: empForm.a_eligible,
              p_eligible: empForm.p_eligible,
              is_hidden: empForm.is_hidden || false
            };
          }
          return emp;
        });
        // Clean up pre-joining C-Off credits
        if (empForm.joining_date && empForm.joining_date.trim()) {
          const coffList = JSON.parse(localStorage.getItem('ksc_c_off') || '[]');
          const filteredCOff = coffList.filter(c => !(c.employee_id === editingEmployee.id && c.date_worked < empForm.joining_date));
          if (coffList.length !== filteredCOff.length) {
            localStorage.setItem('ksc_c_off', JSON.stringify(filteredCOff));
          }
        }
        localStorage.setItem('ksc_employees', JSON.stringify(updatedList));
        addDemoAuditLog('Employee Update', `Updated employee username and parameters: ${empForm.full_name}`);
      } else {
        // Create New
        const newEmp = {
          id: `emp-${Date.now()}`,
          employee_number: empForm.employee_number,
          username: empForm.username,
          full_name: empForm.full_name,
          designation: empForm.designation,
          employment_category: empForm.employment_category,
          functional_role: empForm.functional_role,
          additional_charges: chargesArray,
          reporting_officers: officersArray,
          dob: empForm.dob || null,
          joining_date: empForm.joining_date,
          gender: empForm.gender,
          blood_group: empForm.blood_group,
          mobile_number: empForm.mobile_number,
          email: empForm.email || `${empForm.username.toLowerCase()}@ksc.local`,
          address: empForm.address,
          emergency_contact: emergencyObj,
          educational_qualification: empForm.educational_qualification,
          role: empForm.role,
          is_archived: false,
          weekly_off_eligible: empForm.weekly_off_eligible,
          weekly_off_day: empForm.weekly_off_day,
          daily_wage_rate: parseFloat(empForm.daily_wage_rate),
          max_working_days: parseInt(empForm.max_working_days),
          // Leave Configs
          cl_eligible: empForm.cl_eligible, cl_limit_type: empForm.cl_limit_type, cl_limit: parseFloat(empForm.cl_limit), cl_balance: parseFloat(empForm.cl_limit),
          ml_eligible: empForm.ml_eligible, ml_limit_type: empForm.ml_limit_type, ml_limit: parseFloat(empForm.ml_limit), ml_balance: parseFloat(empForm.ml_limit),
          el_eligible: empForm.el_eligible, el_limit_type: empForm.el_limit_type, el_limit: parseFloat(empForm.el_limit), el_balance: parseFloat(empForm.el_limit),
          sl_eligible: empForm.sl_eligible, sl_limit_type: empForm.sl_limit_type, sl_limit: parseFloat(empForm.sl_limit), sl_balance: parseFloat(empForm.sl_limit),
          od_eligible: empForm.od_eligible,
          tr_eligible: empForm.tr_eligible,
          to_eligible: empForm.to_eligible,
          co_eligible: empForm.co_eligible,
          co_limit: parseInt(empForm.co_limit) || 15,
          fh_eligible: empForm.fh_eligible,
          sh_eligible: empForm.sh_eligible,
          a_eligible: empForm.a_eligible,
          p_eligible: empForm.p_eligible,
          is_hidden: empForm.is_hidden || false
        };
        storedList.push(newEmp);
        localStorage.setItem('ksc_employees', JSON.stringify(storedList));
        addDemoAuditLog('Employee Creation', `Created employee profile: ${newEmp.full_name}`);
      }
      
      loadDemoData();
      setShowEmployeeModal(false);
    } else {
      setLoading(true);
      try {
        if (editingEmployee) {
          const { error: profileErr } = await supabase
            .from('employees')
            .update({
              employee_number: empForm.employee_number,
              username: empForm.username, // Saved successfully!
              full_name: empForm.full_name,
              designation: empForm.designation,
              employment_category: empForm.employment_category,
              functional_role: empForm.functional_role,
              additional_charges: chargesArray,
              reporting_officers: officersArray,
              dob: empForm.dob || null,
              joining_date: empForm.joining_date,
              gender: empForm.gender,
              blood_group: empForm.blood_group,
              mobile_number: empForm.mobile_number,
              email: empForm.email || `${empForm.username.toLowerCase()}@ksc.local`,
              address: empForm.address,
              emergency_contact: emergencyObj,
              educational_qualification: empForm.educational_qualification,
              role: empForm.role,
              weekly_off_eligible: empForm.weekly_off_eligible,
              weekly_off_day: empForm.weekly_off_day,
              daily_wage_rate: parseFloat(empForm.daily_wage_rate),
              max_working_days: parseInt(empForm.max_working_days),
              od_eligible: empForm.od_eligible,
              tr_eligible: empForm.tr_eligible,
              to_eligible: empForm.to_eligible,
              co_eligible: empForm.co_eligible,
              co_limit: parseInt(empForm.co_limit) || 15,
              fh_eligible: empForm.fh_eligible,
              sh_eligible: empForm.sh_eligible,
              a_eligible: empForm.a_eligible,
              p_eligible: empForm.p_eligible,
              is_hidden: empForm.is_hidden || false
            })
            .eq('id', editingEmployee.id);
          
          if (profileErr) throw profileErr;

          // Update Configurations
          const { error: leaveErr } = await supabase
            .from('leave_balances')
            .upsert({
              employee_id: editingEmployee.id,
              cl_eligible: empForm.cl_eligible, cl_limit_type: empForm.cl_limit_type, cl_limit: parseFloat(empForm.cl_limit),
              ml_eligible: empForm.ml_eligible, ml_limit_type: empForm.ml_limit_type, ml_limit: parseFloat(empForm.ml_limit),
              el_eligible: empForm.el_eligible, el_limit_type: empForm.el_limit_type, el_limit: parseFloat(empForm.el_limit),
              sl_eligible: empForm.sl_eligible, sl_limit_type: empForm.sl_limit_type, sl_limit: parseFloat(empForm.sl_limit)
            }, { onConflict: 'employee_id' });

          if (leaveErr) throw leaveErr;
          // Clean up pre-joining C-Off credits
          if (empForm.joining_date && empForm.joining_date.trim()) {
            await supabase
              .from('c_off_credits')
              .delete()
              .eq('employee_id', editingEmployee.id)
              .lt('date_worked', empForm.joining_date);
          }
          alert("Saved successfully!");
        } else {
          const { data: newUid, error: createErr } = await supabase.rpc('create_new_employee', {
            p_employee_number: empForm.employee_number,
            p_username: empForm.username,
            p_full_name: empForm.full_name,
            p_designation: empForm.designation,
            p_employment_category: empForm.employment_category,
            p_functional_role: empForm.functional_role,
            p_additional_charges: chargesArray,
            p_reporting_officers: officersArray,
            p_dob: empForm.dob || null,
            p_joining_date: empForm.joining_date,
            p_gender: empForm.gender,
            p_blood_group: empForm.blood_group,
            p_mobile_number: empForm.mobile_number,
            p_address: empForm.address,
            p_emergency_contact: emergencyObj,
            p_educational_qualification: empForm.educational_qualification,
            p_role: empForm.role,
            p_weekly_off_eligible: empForm.weekly_off_eligible,
            p_weekly_off_day: empForm.weekly_off_day,
            p_daily_wage_rate: parseFloat(empForm.daily_wage_rate),
            p_max_working_days: parseInt(empForm.max_working_days),
            // Leaves Config
            p_cl_eligible: empForm.cl_eligible, p_cl_limit_type: empForm.cl_limit_type, p_cl_limit: parseFloat(empForm.cl_limit),
            p_ml_eligible: empForm.ml_eligible, p_ml_limit_type: empForm.ml_limit_type, p_ml_limit: parseFloat(empForm.ml_limit),
            p_el_eligible: empForm.el_eligible, p_el_limit_type: empForm.el_limit_type, p_el_limit: parseFloat(empForm.el_limit),
            p_sl_eligible: empForm.sl_eligible, p_sl_limit_type: empForm.sl_limit_type, p_sl_limit: parseFloat(empForm.sl_limit),
            p_password: empForm.password
          });

          if (createErr) throw createErr;

          // Backwards-compatible patch for the granular status eligibility columns
          const { error: patchErr } = await supabase
            .from('employees')
            .update({
              od_eligible: empForm.od_eligible,
              tr_eligible: empForm.tr_eligible,
              to_eligible: empForm.to_eligible,
              co_eligible: empForm.co_eligible,
              co_limit: parseInt(empForm.co_limit) || 15,
              fh_eligible: empForm.fh_eligible,
              sh_eligible: empForm.sh_eligible,
              a_eligible: empForm.a_eligible,
              p_eligible: empForm.p_eligible,
              is_hidden: empForm.is_hidden || false,
              email: empForm.email || `${empForm.username.toLowerCase()}@ksc.local`
            })
            .eq('id', newUid);

          if (patchErr) throw patchErr;

          alert(`Employee registered successfully!`);
        }

        setShowEmployeeModal(false);
        loadSupabaseData();
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleArchiveToggle = async (emp) => {
    const actionLabel = emp.is_archived ? 'Restore' : 'Archive';
    if (!window.confirm(`Are you sure you want to ${actionLabel} ${emp.full_name}?`)) return;

    if (isDemoMode) {
      const stored = JSON.parse(localStorage.getItem('ksc_employees') || '[]');
      const updated = stored.map(item => {
        if (item.id === emp.id) return { ...item, is_archived: !item.is_archived };
        return item;
      });
      localStorage.setItem('ksc_employees', JSON.stringify(updated));
      addDemoAuditLog('Employee Archive Toggle', `${actionLabel}d employee: ${emp.full_name}`);
      loadDemoData();
    } else {
      setLoading(true);
      try {
        const { error } = await supabase
          .from('employees')
          .update({ is_archived: !emp.is_archived })
          .eq('id', emp.id);

        if (error) throw error;
        alert(`Employee ${actionLabel}d successfully.`);
        loadSupabaseData();
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteEmployee = async (emp) => {
    const confirmDelete = window.confirm(`⚠️ WARNING: Are you sure you want to COMPLETELY and permanently delete employee "${emp.full_name}" from the database?\n\nThis action cannot be undone and will permanently remove all their attendance, leave balances, and logs!`);
    if (!confirmDelete) return;

    if (isDemoMode) {
      // 1. Delete employee
      let storedList = JSON.parse(localStorage.getItem('ksc_employees') || '[]');
      const filteredList = storedList.filter(e => e.id !== emp.id);
      localStorage.setItem('ksc_employees', JSON.stringify(filteredList));

      // 2. Delete attendance records
      let storedAtt = JSON.parse(localStorage.getItem('ksc_attendance') || '[]');
      const filteredAtt = storedAtt.filter(a => a.employee_id !== emp.id);
      localStorage.setItem('ksc_attendance', JSON.stringify(filteredAtt));

      // 3. Delete C-Off credits
      let storedCOff = JSON.parse(localStorage.getItem('ksc_c_off') || '[]');
      const filteredCOff = storedCOff.filter(c => c.employee_id !== emp.id);
      localStorage.setItem('ksc_c_off', JSON.stringify(filteredCOff));

      // 4. Delete tours
      let storedTours = JSON.parse(localStorage.getItem('ksc_tours') || '[]');
      const filteredTours = storedTours.filter(t => t.employee_id !== emp.id);
      localStorage.setItem('ksc_tours', JSON.stringify(filteredTours));

      addDemoAuditLog('Employee Deletion', `Permanently deleted employee: ${emp.full_name}`);
      loadDemoData();
      alert("Employee permanently deleted!");
    } else {
      setLoading(true);
      try {
        const { error } = await supabase
          .from('employees')
          .delete()
          .eq('id', emp.id);
        if (error) throw error;

        await supabase.from('audit_logs').insert({
          actor_id: currentUser.id,
          actor_name: currentUser.full_name,
          action: 'Employee Deletion',
          details: `Permanently deleted employee: ${emp.full_name}`
        });

        alert("Employee permanently deleted!");
        loadSupabaseData();
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOpenDetailsModal = (emp) => {
    setSelectedEmpDetails(emp);
    setShowDetailsModal(true);
  };

  // ==========================================
  // PROFILE VERIFICATION REQUEST WORKFLOW
  // ==========================================
  const openProfileEditModal = () => {
    setProfileEditForm({
      mobile_number: currentUser.mobile_number || '',
      email: currentUser.email || '',
      address: currentUser.address || '',
      gender: currentUser.gender || 'Male',
      blood_group: currentUser.blood_group || '',
      educational_qualification: currentUser.educational_qualification || '',
      emergency_name: currentUser.emergency_contact?.name || '',
      emergency_relation: currentUser.emergency_contact?.relation || '',
      emergency_phone: currentUser.emergency_contact?.phone || ''
    });
    setShowProfileEditModal(true);
  };

  const handleProfileUpdateRequestSubmit = async (e) => {
    e.preventDefault();
    
    const emergencyObj = {
      name: profileEditForm.emergency_name.trim(),
      relation: profileEditForm.emergency_relation.trim(),
      phone: profileEditForm.emergency_phone.trim()
    };

    const pendingDataObj = {
      mobile_number: profileEditForm.mobile_number.trim(),
      email: profileEditForm.email.trim(),
      address: profileEditForm.address.trim(),
      gender: profileEditForm.gender,
      blood_group: profileEditForm.blood_group.trim(),
      educational_qualification: profileEditForm.educational_qualification.trim(),
      emergency_contact: emergencyObj
    };

    if (isDemoMode) {
      const stored = JSON.parse(localStorage.getItem('ksc_profile_requests') || '[]');
      
      const newRequest = {
        id: `req-${Date.now()}`,
        employee_id: currentUser.id,
        pending_data: pendingDataObj,
        status: 'Pending',
        submitted_at: new Date().toISOString()
      };

      stored.push(newRequest);
      localStorage.setItem('ksc_profile_requests', JSON.stringify(stored));
      addDemoAuditLog('Profile Update Request', `Employee ${currentUser.full_name} submitted profile modifications for official verification.`);
      
      loadDemoData();
      setShowProfileEditModal(false);
      alert("Proposed modifications submitted successfully. Awaiting Admin verification!");
    } else {
      setLoading(true);
      try {
        const { error } = await supabase
          .from('profile_update_requests')
          .insert({
            employee_id: currentUser.id,
            pending_data: pendingDataObj,
            status: 'Pending'
          });
        
        if (error) throw error;
        alert("Proposed modifications submitted successfully. Awaiting Admin verification!");
        setShowProfileEditModal(false);
        loadSupabaseData();
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleVerifyProfileRequest = async (request, action) => {
    // Safety check: only Root Admin or one of the assigned reporting officers can verify
    const filer = employees.find(e => e.id === request.employee_id);
    const isRepOfficer = filer && filer.reporting_officers && filer.reporting_officers.includes(currentUser.full_name);
    if (currentUser.role !== 'Root Admin' && !isRepOfficer) {
      alert("Unauthorized: Only Root Admin or an assigned Reporting Officer can verify this request.");
      return;
    }

    const actionLabel = action === 'Approved' ? 'Verify & Approve' : 'Reject';
    if (!window.confirm(`Are you sure you want to ${actionLabel} this request?`)) return;

    if (isDemoMode) {
      const storedRequests = JSON.parse(localStorage.getItem('ksc_profile_requests') || '[]');
      const storedEmployees = JSON.parse(localStorage.getItem('ksc_employees') || '[]');
      
      const updatedRequests = storedRequests.map(r => {
        if (r.id === request.id) {
          return { ...r, status: action, reviewed_by: currentUser.id, reviewed_at: new Date().toISOString() };
        }
        return r;
      });
      localStorage.setItem('ksc_profile_requests', JSON.stringify(updatedRequests));

      if (action === 'Approved') {
        const updatedEmployees = storedEmployees.map(emp => {
          if (emp.id === request.employee_id) {
            return {
              ...emp,
              mobile_number: request.pending_data.mobile_number,
              email: request.pending_data.email,
              address: request.pending_data.address,
              gender: request.pending_data.gender,
              blood_group: request.pending_data.blood_group,
              educational_qualification: request.pending_data.educational_qualification,
              emergency_contact: request.pending_data.emergency_contact
            };
          }
          return emp;
        });
        localStorage.setItem('ksc_employees', JSON.stringify(updatedEmployees));
      }

      const empObj = storedEmployees.find(e => e.id === request.employee_id);
      addDemoAuditLog('Profile Verification', `${action} proposed profile updates for employee: ${empObj ? empObj.full_name : 'Unknown'}`);
      loadDemoData();
      alert(`Request officially ${action.toLowerCase()}!`);
    } else {
      setLoading(true);
      try {
        if (action === 'Approved') {
          const { error } = await supabase.rpc('approve_profile_update', {
            p_request_id: request.id,
            p_admin_id: currentUser.id
          });
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('profile_update_requests')
            .update({
              status: 'Rejected',
              reviewed_by: currentUser.id,
              reviewed_at: new Date().toISOString()
            })
            .eq('id', request.id);
          if (error) throw error;
        }

        alert(`Request officially ${action.toLowerCase()}!`);
        loadSupabaseData();
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // ==========================================
  // ATTENDANCE CALENDAR OVERLAY EVENTS HANDLER
  // ==========================================
  const handleOpenCalendarDayEvents = (dateStr) => {
    setReqDate(dateStr);
    setReqRemarks('');
    setSelectedCOffCreditId('');
    
    // Check locked months
    const dObj = new Date(dateStr);
    const y = dObj.getFullYear();
    const m = dObj.getMonth() + 1;
    const isLocked = locks.some(lock => lock.year === y && lock.month === m && lock.is_locked);
    
    // Compile active events on this date
    const eventsList = [];
    const dayOfWeek = dObj.getDay();
    
    // 1. Custom Holidays
    const matchingHols = holidays.filter(h => h.date === dateStr);
    matchingHols.forEach(h => eventsList.push(`Public Holiday: ${h.name}`));
    
    // 2. Sundays & Mondays
    if (dayOfWeek === 0) {
      eventsList.push("Weekly Off: Sunday");
    }
    if (dayOfWeek === 1) {
      eventsList.push("Centre Closed: Monday Off");
    }
    
    // 3. Second Saturday
    if (isSecondSaturday(dateStr)) {
      eventsList.push("System Holiday: Second Saturday");
    }

    setCalendarDateEvents(eventsList);

    const viewedEmployeeIdVal = viewedEmployee.id || currentUser.id;
    const viewedEmployeeEligibility = isDemoMode
      ? {
          cl: viewedEmployee.cl_eligible ?? true,
          ml: viewedEmployee.ml_eligible ?? true,
          el: viewedEmployee.el_eligible ?? true,
          sl: viewedEmployee.sl_eligible ?? true,
          wo: viewedEmployee.weekly_off_eligible ?? true,
          od: viewedEmployee.od_eligible ?? true,
          tr: viewedEmployee.tr_eligible ?? true,
          to: viewedEmployee.to_eligible ?? true,
          co: viewedEmployee.co_eligible ?? true,
          fh: viewedEmployee.fh_eligible ?? true,
          sh: viewedEmployee.sh_eligible ?? true,
          a: viewedEmployee.a_eligible ?? true,
          p: viewedEmployee.p_eligible ?? true
        }
      : {
          cl: leaveBalances[viewedEmployeeIdVal]?.cl_eligible ?? true,
          ml: leaveBalances[viewedEmployeeIdVal]?.ml_eligible ?? true,
          el: leaveBalances[viewedEmployeeIdVal]?.el_eligible ?? true,
          sl: leaveBalances[viewedEmployeeIdVal]?.sl_eligible ?? true,
          wo: viewedEmployee.weekly_off_eligible ?? true,
          od: viewedEmployee.od_eligible ?? true,
          tr: viewedEmployee.tr_eligible ?? true,
          to: viewedEmployee.to_eligible ?? true,
          co: viewedEmployee.co_eligible ?? true,
          fh: viewedEmployee.fh_eligible ?? true,
          sh: viewedEmployee.sh_eligible ?? true,
          a: viewedEmployee.a_eligible ?? true,
          p: viewedEmployee.p_eligible ?? true
        };

    // Look for existing record to pre-populate selection
    const record = attendance.find(a => a.employee_id === viewedEmployeeIdVal && a.date === dateStr);
    if (record) {
      setReqStatus(record.status);
      setReqRemarks(record.remarks || '');
      if (record.status === 'CO') {
        const usedCredit = cOffCredits.find(c => c.employee_id === viewedEmployeeIdVal && c.used_date === dateStr && c.status === 'Used');
        if (usedCredit) {
          setSelectedCOffCreditId(usedCredit.id);
        } else {
          setSelectedCOffCreditId('');
        }
      } else {
        setSelectedCOffCreditId('');
      }
    } else {
      setSelectedCOffCreditId('');
      if (viewedEmployeeEligibility.p) {
        setReqStatus('P'); // Default status
      } else {
        const firstEligible = ['P', 'CL', 'ML', 'EL', 'SL', 'FH', 'SH', 'WO', 'OD', 'TR', 'TO', 'CO', 'A'].find(status => {
          const key = status.toLowerCase();
          return viewedEmployeeEligibility[key];
        });
        setReqStatus(firstEligible || 'P');
      }
    }

    setShowRequestModal(true);
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    const dObj = new Date(reqDate);
    const y = dObj.getFullYear();
    const m = dObj.getMonth() + 1;

    const isLocked = locks.some(lock => lock.year === y && lock.month === m && lock.is_locked);
    if (isLocked) { alert("Month is locked."); return; }

    let baseRemarks = reqRemarks || '';
    // Strip " (Using C-Off earned on YYYY-MM-DD)"
    baseRemarks = baseRemarks.replace(/\s*\(Using C-Off earned on \d{4}-\d{2}-\d{2}\)/g, '');
    // Strip leading "Using C-Off earned on YYYY-MM-DD" if it matches exactly
    baseRemarks = baseRemarks.replace(/^Using C-Off earned on \d{4}-\d{2}-\d{2}$/g, '');

    let finalRemarks = baseRemarks;
    const viewedEmployeeIdVal = viewedEmployee.id || currentUser.id;
    const isSelf = (viewedEmployeeIdVal === currentUser.id);

    if (reqStatus === 'CO' && selectedCOffCreditId) {
      const chosenCredit = cOffCredits.find(c => c.id === selectedCOffCreditId);
      if (chosenCredit) {
        finalRemarks = baseRemarks 
          ? `${baseRemarks.trim()} (Using C-Off earned on ${chosenCredit.date_worked})` 
          : `Using C-Off earned on ${chosenCredit.date_worked}`;
      }
    }

    const approvalStatusVal = !isSelf ? 'Approved' : (currentUser.role === 'Employee' ? 'Pending' : 'Approved');
    const approvedByVal = approvalStatusVal === 'Approved' ? currentUser.id : null;
    const approvedAtVal = approvalStatusVal === 'Approved' ? new Date().toISOString() : null;

    if (isDemoMode) {
      const stored = JSON.parse(localStorage.getItem('ksc_attendance') || '[]');
      const existingIdx = stored.findIndex(att => att.employee_id === viewedEmployeeIdVal && att.date === reqDate);
      
      const newRecord = {
        id: existingIdx !== -1 ? stored[existingIdx].id : `att-${Date.now()}`,
        employee_id: viewedEmployeeIdVal,
        date: reqDate,
        status: reqStatus,
        remarks: finalRemarks,
        submitted_by: currentUser.id,
        approval_status: approvalStatusVal,
        approved_by: approvedByVal,
        approved_at: approvedAtVal
      };

      if (existingIdx !== -1) stored[existingIdx] = newRecord;
      else stored.push(newRecord);

      // Release any previously used credit on this request date and mark new selection as Used
      const coffList = JSON.parse(localStorage.getItem('ksc_c_off') || '[]');
      let coffUpdated = false;
      coffList.forEach(c => {
        if (c.employee_id === viewedEmployeeIdVal && c.used_date === reqDate) {
          c.status = 'Available';
          c.used_date = null;
          coffUpdated = true;
        }
      });
      
      if (reqStatus === 'CO' && selectedCOffCreditId) {
        const creditIdx = coffList.findIndex(c => c.id === selectedCOffCreditId);
        if (creditIdx !== -1) {
          coffList[creditIdx].status = 'Used';
          coffList[creditIdx].used_date = reqDate;
          coffUpdated = true;
        }
      }
      if (coffUpdated) {
        localStorage.setItem('ksc_c_off', JSON.stringify(coffList));
      }

      // Trigger C-Off credit checks & refresh
      if (viewedEmployee.co_eligible) {
        await refreshCOffForDate(viewedEmployeeIdVal, reqDate, stored);
      }

      localStorage.setItem('ksc_attendance', JSON.stringify(stored));
      addDemoAuditLog('Attendance Request', `Filed attendance status ${reqStatus} for ${reqDate} on behalf of ${viewedEmployee.full_name}`);
      
      loadDemoData();
      setShowRequestModal(false);
    } else {
      setLoading(true);
      try {
        const recordData = {
          employee_id: viewedEmployeeIdVal,
          date: reqDate,
          status: reqStatus,
          remarks: finalRemarks,
          submitted_by: currentUser.id,
          approval_status: approvalStatusVal,
          approved_by: approvedByVal,
          approved_at: approvedAtVal
        };

        const existing = attendance.find(a => a.employee_id === viewedEmployeeIdVal && a.date === reqDate);
        if (existing) recordData.id = existing.id;

        const { error } = await supabase
          .from('attendance')
          .upsert(recordData);

        if (error) throw error;

        // Release any previously used credit on this request date
        await supabase
          .from('c_off_credits')
          .update({ status: 'Available', used_date: null })
          .eq('employee_id', viewedEmployeeIdVal)
          .eq('used_date', reqDate)
          .eq('status', 'Used');

        // Handle C-Off credit redemption marking it Used
        if (reqStatus === 'CO' && selectedCOffCreditId) {
          const { error: coffErr } = await supabase
            .from('c_off_credits')
            .update({ status: 'Used', used_date: reqDate })
            .eq('id', selectedCOffCreditId);
          if (coffErr) throw coffErr;
        }

        // Trigger C-Off credit checks & refresh
        if (viewedEmployee.co_eligible) {
          await refreshCOffForDate(viewedEmployeeIdVal, reqDate, [
            ...attendance.filter(a => !(a.employee_id === viewedEmployeeIdVal && a.date === reqDate)),
            recordData
          ]);
        }

        alert("Attendance submitted.");
        setShowRequestModal(false);
        loadSupabaseData();
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleApproveStatus = async (item, action) => {
    // Safety check: only Root Admin or one of the assigned reporting officers can approve
    const filer = employees.find(e => e.id === item.employee_id);
    const isRepOfficer = filer && filer.reporting_officers && filer.reporting_officers.includes(currentUser.full_name);
    if (currentUser.role !== 'Root Admin' && !isRepOfficer) {
      alert("Unauthorized: Only Root Admin or an assigned Reporting Officer can approve/reject this request.");
      return;
    }

    if (isDemoMode) {
      const stored = JSON.parse(localStorage.getItem('ksc_attendance') || '[]');
      const updated = stored.map(att => {
        if (att.id === item.id) {
          return {
            ...att,
            approval_status: action,
            approved_by: currentUser.id,
            approved_at: new Date().toISOString()
          };
        }
        return att;
      });
      
      const emp = employees.find(e => e.id === item.employee_id);
      if (emp && emp.co_eligible) {
        await refreshCOffForDate(item.employee_id, item.date, updated);
      }

      if (action === 'Rejected' && item.status === 'CO') {
        const coffList = JSON.parse(localStorage.getItem('ksc_c_off') || '[]');
        const creditIdx = coffList.findIndex(c => c.employee_id === item.employee_id && c.used_date === item.date && c.status === 'Used');
        if (creditIdx !== -1) {
          coffList[creditIdx].status = 'Available';
          coffList[creditIdx].used_date = null;
          localStorage.setItem('ksc_c_off', JSON.stringify(coffList));
        }
      }

      localStorage.setItem('ksc_attendance', JSON.stringify(updated));
      addDemoAuditLog('Attendance Approval', `${action} request for ${item.employee_id} on ${item.date}`);
      loadDemoData();
    } else {
      setLoading(true);
      try {
        const { error } = await supabase
          .from('attendance')
          .update({
            approval_status: action,
            approved_by: currentUser.id,
            approved_at: new Date().toISOString()
          })
          .eq('id', item.id);

        if (error) throw error;

        const emp = employees.find(e => e.id === item.employee_id);
        if (emp && emp.co_eligible) {
          const updatedList = [
            ...attendance.filter(a => a.id !== item.id),
            { ...item, approval_status: action }
          ];
          await refreshCOffForDate(item.employee_id, item.date, updatedList);
        }

        if (action === 'Rejected' && item.status === 'CO') {
          const { error: releaseErr } = await supabase
            .from('c_off_credits')
            .update({ status: 'Available', used_date: null })
            .eq('employee_id', item.employee_id)
            .eq('used_date', item.date)
            .eq('status', 'Used');
          if (releaseErr) throw releaseErr;
        }

        alert(`Request ${action} successfully.`);
        loadSupabaseData();
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // ==========================================
  // HOLIDAY MANAGEMENT
  // ==========================================
  const handleAddHoliday = async (e) => {
    e.preventDefault();
    if (!newHolidayDate || !newHolidayName) return;

    if (isDemoMode) {
      const list = JSON.parse(localStorage.getItem('ksc_holidays') || '[]');
      list.push({ id: `hol-${Date.now()}`, date: newHolidayDate, name: newHolidayName });
      localStorage.setItem('ksc_holidays', JSON.stringify(list));
      addDemoAuditLog('Holiday Settings Change', `Added holiday: ${newHolidayName} on ${newHolidayDate}`);
      setNewHolidayDate('');
      setNewHolidayName('');
      loadDemoData();
    } else {
      setLoading(true);
      try {
        const { error } = await supabase.from('holidays').insert({ date: newHolidayDate, name: newHolidayName });
        if (error) throw error;
        setNewHolidayDate('');
        setNewHolidayName('');
        loadSupabaseData();
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRemoveHoliday = async (id, name) => {
    if (!window.confirm(`Remove holiday: ${name}?`)) return;

    if (isDemoMode) {
      const list = JSON.parse(localStorage.getItem('ksc_holidays') || '[]');
      const filtered = list.filter(h => h.id !== id);
      localStorage.setItem('ksc_holidays', JSON.stringify(filtered));
      addDemoAuditLog('Holiday Removal', `Removed holiday: ${name}`);
      loadDemoData();
    } else {
      setLoading(true);
      try {
        const { error } = await supabase.from('holidays').delete().eq('id', id);
        if (error) throw error;
        loadSupabaseData();
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!newAnnouncementTitle || !newAnnouncementMessage) return;

    const payload = {
      title: newAnnouncementTitle,
      message: newAnnouncementMessage,
      created_by_name: currentUser.full_name,
      target_type: newAnnouncementTarget,
      target_users: newAnnouncementTarget === 'Specific' ? newAnnouncementSelectedUsers : null
    };

    if (isDemoMode) {
      const list = JSON.parse(localStorage.getItem('ksc_announcements') || '[]');
      const newAnn = {
        id: `ann-${Date.now()}`,
        ...payload,
        created_at: new Date().toISOString()
      };
      list.push(newAnn);
      localStorage.setItem('ksc_announcements', JSON.stringify(list));
      addDemoAuditLog('Announcement Broadcast', `Broadcast announcement: ${newAnnouncementTitle}`);
      setNewAnnouncementTitle('');
      setNewAnnouncementMessage('');
      setNewAnnouncementSelectedUsers([]);
      loadDemoData();
    } else {
      setLoading(true);
      try {
        const { error } = await supabase
          .from('announcements')
          .insert(payload);
        if (error) throw error;
        setNewAnnouncementTitle('');
        setNewAnnouncementMessage('');
        setNewAnnouncementSelectedUsers([]);
        loadSupabaseData();
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteAnnouncement = async (annId) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;

    if (isDemoMode) {
      const list = JSON.parse(localStorage.getItem('ksc_announcements') || '[]');
      const filtered = list.filter(a => a.id !== annId);
      localStorage.setItem('ksc_announcements', JSON.stringify(filtered));
      loadDemoData();
    } else {
      setLoading(true);
      try {
        const { error } = await supabase
          .from('announcements')
          .delete()
          .eq('id', annId);
        if (error) throw error;
        loadSupabaseData();
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleMonthLock = async (y, m, currentLockState) => {
    const actionLabel = currentLockState ? 'Unlock' : 'Lock';
    if (!window.confirm(`Are you sure you want to ${actionLabel} attendance for ${y}-${m}?`)) return;

    if (isDemoMode) {
      const storedLocks = JSON.parse(localStorage.getItem('ksc_locks') || '[]');
      const existingIdx = storedLocks.findIndex(l => l.year === y && l.month === m);
      const newLock = {
        id: existingIdx !== -1 ? storedLocks[existingIdx].id : `lock-${Date.now()}`,
        year: y, month: m, is_locked: !currentLockState,
        locked_by: currentUser.id, locked_at: new Date().toISOString()
      };

      if (existingIdx !== -1) storedLocks[existingIdx] = newLock;
      else storedLocks.push(newLock);

      localStorage.setItem('ksc_locks', JSON.stringify(storedLocks));
      addDemoAuditLog('Attendance Lock Change', `${actionLabel}ed month: ${y}-${m}`);
      loadDemoData();
    } else {
      setLoading(true);
      try {
        const existing = locks.find(l => l.year === y && l.month === m);
        const lockData = {
          year: y, month: m, is_locked: !currentLockState,
          locked_by: currentUser.id, locked_at: new Date().toISOString()
        };

        if (existing) lockData.id = existing.id;
        const { error } = await supabase.from('attendance_locks').upsert(lockData);
        if (error) throw error;
        loadSupabaseData();
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // ==========================================
  // REPORTS GENERATOR (PDF SHEETS WITH RUPEE)
  // ==========================================
  const generateEmployeeAttendancePDF = (targetEmp, year = currentYear, month = currentMonth) => {
    const doc = new jsPDF();
    const targetMonthStr = `${year}-${String(month).padStart(2, '0')}`;
    const empAttRecords = attendance.filter(
      att => att.employee_id === targetEmp.id && att.date.startsWith(targetMonthStr) && att.approval_status === 'Approved'
    );

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.text("KERALA SCIENCE CITY", 105, 15, { align: "center" });
    
    doc.setFontSize(13);
    doc.text("Monthly Employee Attendance Report", 105, 22, { align: "center" });
    
    doc.setFontSize(10);
    doc.setFont("Helvetica", "normal");
    doc.text(`Month/Year: ${String(month).padStart(2, '0')} / ${year}`, 105, 27, { align: "center" });
    doc.line(20, 30, 190, 30);

    // Profile Details
    doc.text(`Employee Name: ${targetEmp.full_name}`, 20, 38);
    doc.text(`Employee Number: ${targetEmp.employee_number}`, 20, 44);
    doc.text(`Employment Type: ${targetEmp.employment_category}`, 120, 38);
    doc.text(`Designation: ${targetEmp.designation}`, 120, 44);

    const numDays = new Date(year, month, 0).getDate();
    const tableData = [];
    const summary = { P: 0, CL: 0, ML: 0, EL: 0, SL: 0, FH: 0, SH: 0, OD: 0, TR: 0, TO: 0, CO: 0, WO: 0, H: 0, A: 0 };
    
    // Strict threshold logic
    const today = new Date();
    today.setHours(0,0,0,0);

    for (let day = 1; day <= numDays; day++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const record = empAttRecords.find(a => a.date === dateStr);
      const dayOfWeek = new Date(year, month - 1, day).getDay();
      const cellDate = new Date(year, month - 1, day);
      
      let dayStatus = '';
      let remarks = '';

      const isSunday = dayOfWeek === 0;
      const isMonday = dayOfWeek === 1;
      const isSecSat = isSecondSaturday(dateStr);
      const matchedHols = holidays.filter(h => h.date === dateStr);
      const isFuture = cellDate > today;

      if (record) {
        dayStatus = getStatusFullName(record.status);
        remarks = record.remarks || '';
        summary[record.status] = (summary[record.status] || 0) + 1;
      } else if (!isFuture) {
        // Defaults to Present up to TODAY for all working days
        dayStatus = 'Present (P) [Default]';
        summary['P'] = (summary['P'] || 0) + 1;
      } else {
        // Future working days remain blank
        dayStatus = '-';
      }

      tableData.push([
        day,
        new Date(year, month - 1, day).toLocaleDateString('en-US', { weekday: 'short' }),
        dayStatus,
        remarks
      ]);
    }

    autoTable(doc, {
      head: [['Day', 'Weekday', 'Attendance Status', 'Remarks']],
      body: tableData,
      startY: 50,
      theme: 'grid',
      styles: { fontSize: 8 }
    });

    let finalY = doc.previousAutoTable.finalY + 12;
    if (finalY > 240) { doc.addPage(); finalY = 20; }

    const calculatedLeavesCount = summary.CL + summary.ML + summary.EL + summary.SL + (summary.FH * 0.5) + (summary.SH * 0.5);
    const calculatedPresentCount = summary.P + summary.OD + summary.TR + (summary.FH * 0.5) + (summary.SH * 0.5);

    doc.setFont("Helvetica", "bold");
    doc.text("Tally Summary", 20, finalY);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Calculated Present Days: ${calculatedPresentCount}`, 20, finalY + 6);
    doc.text(`Total Formulated Leaves: ${calculatedLeavesCount}`, 20, finalY + 11);
    doc.text(`System Holidays & Weekly Offs: ${summary.H + summary.WO}`, 110, finalY + 6);

    doc.text("Reporting Officer", 20, finalY + 35);
    doc.text("Administrative Officer", 120, finalY + 35);
    doc.line(20, finalY + 31, 70, finalY + 31);
    doc.line(120, finalY + 31, 170, finalY + 31);

    doc.save(`KSC_Attendance_${targetEmp.employee_number}_${targetMonthStr}.pdf`);
  };

  const getStatusFullName = (code) => {
    switch (code) {
      case 'P': return 'Present (P)';
      case 'ML': return 'Medical Leave (ML)';
      case 'CL': return 'Casual Leave (CL)';
      case 'EL': return 'Earned Leave (EL)';
      case 'SL': return 'Special Leave (SL)';
      case 'FH': return 'First Half Leave (FH)';
      case 'SH': return 'Second Half Leave (SH)';
      case 'OD': return 'Outdoor Duty (OD)';
      case 'TR': return 'Tour (TR)';
      case 'TO': return 'Tour Off (TO)';
      case 'CO': return 'Compensatory Off (CO)';
      case 'WO': return 'Weekly Off (WO)';
      case 'H': return 'Holiday (H)';
      case 'A': return 'Absent (A)';
      default: return code;
    }
  };

  const generateDailyWageReportPDF = (year = currentYear, month = currentMonth) => {
    const doc = new jsPDF();
    
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.text("KERALA SCIENCE CITY", 105, 15, { align: "center" });

    doc.setFontSize(13);
    doc.text("Daily Wage Calculations & Salary Statement", 105, 22, { align: "center" });
    
    const targetMonthStr = `${year}-${String(month).padStart(2, '0')}`;
    doc.setFontSize(10);
    doc.setFont("Helvetica", "normal");
    doc.text(`Month/Year: ${String(month).padStart(2, '0')} / ${year}`, 105, 27, { align: "center" });
    doc.line(20, 30, 190, 30);

    const isRepOfficerRole = employees.some(e => e.reporting_officers?.includes(currentUser?.full_name));
    const wageStaff = employees.filter(emp => {
      if (emp.employment_category !== 'Daily Wage' || emp.is_archived) return false;
      if (currentUser.role === 'Root Admin' || currentUser.role === 'Admin') return true;
      if (isRepOfficerRole) {
        return emp.reporting_officers && emp.reporting_officers.includes(currentUser.full_name);
      }
      return false;
    });
    const tableData = [];

    // Strict threshold logic
    const today = new Date();
    today.setHours(0,0,0,0);

    wageStaff.forEach((emp, index) => {
      const numDays = new Date(year, month, 0).getDate();
      let workedDays = 0;
      let clDaysTaken = 0;

      for (let day = 1; day <= numDays; day++) {
        const dateStr = `${targetMonthStr}-${String(day).padStart(2, '0')}`;
        const record = attendance.find(a => a.employee_id === emp.id && a.date === dateStr && a.approval_status === 'Approved');
        
        const dayOfWeek = new Date(year, month - 1, day).getDay();
        const isSunday = dayOfWeek === 0;
        const isMonday = dayOfWeek === 1;
        const isSecSat = isSecondSaturday(dateStr);
        const hasCustomHol = holidays.some(h => h.date === dateStr);
        const cellDate = new Date(year, month - 1, day);
        const isFuture = cellDate > today;

        if (record) {
          if (record.status === 'P' || record.status === 'OD' || record.status === 'TR') workedDays += 1.0;
          else if (record.status === 'FH' || record.status === 'SH') workedDays += 0.5;
          else if (record.status === 'CL') clDaysTaken += 1.0;
        } else if (!isFuture) {
          // Defaults to Present only on non-future working days
          workedDays += 1.0;
        }
      }

      const clLimit = isDemoMode
        ? (emp.cl_limit ?? 3)
        : (leaveBalances[emp.id]?.cl_limit ?? 3);

      const paidLeaves = Math.min(clLimit, clDaysTaken);
      const rate = emp.daily_wage_rate || 900;
      const maxDays = emp.max_working_days || 25;
      const totalPaidDays = workedDays + paidLeaves;
      const payableDays = Math.min(totalPaidDays, maxDays);
      const totalWage = payableDays * rate;

      tableData.push([
        index + 1,
        emp.employee_number,
        emp.full_name,
        emp.designation,
        `Rs. ${rate}/day`,
        `${workedDays} + ${paidLeaves} CL (${totalPaidDays}d)`,
        `${payableDays} days (Max ${maxDays})`,
        `Rs. ${totalWage.toLocaleString()}`
      ]);
    });

    autoTable(doc, {
      head: [['#', 'Emp No', 'Employee Name', 'Designation', 'Wage Rate', 'Present Days', 'Payable Days', 'Total Salary']],
      body: tableData,
      startY: 35,
      theme: 'grid'
    });

    const finalY = doc.previousAutoTable.finalY + 30;
    doc.text("Accounts Clerk", 20, finalY);
    doc.text("Administrative Officer Approval", 120, finalY);

    doc.save(`KSC_DailyWage_Report_${targetMonthStr}.pdf`);
  };

  const calculateSingleEmployeeWages = (emp, year, month) => {
    const targetMonthStr = `${year}-${String(month).padStart(2, '0')}`;
    const empAttRecords = attendance.filter(
      att => att.employee_id === emp.id && att.date.startsWith(targetMonthStr) && att.approval_status === 'Approved'
    );
    const numDays = new Date(year, month, 0).getDate();
    const today = new Date();
    today.setHours(0,0,0,0);

    let workedDays = 0;
    let clDaysTaken = 0;
    const dayRows = [];

    for (let day = 1; day <= numDays; day++) {
      const dateStr = `${targetMonthStr}-${String(day).padStart(2, '0')}`;
      const record = empAttRecords.find(a => a.date === dateStr);
      const cellDate = new Date(year, month - 1, day);
      const isFuture = cellDate > today;

      let fnStatus = 'AB';
      let anStatus = 'AB';

      if (record) {
        if (record.status === 'P' || record.status === 'OD' || record.status === 'TR') {
          workedDays += 1.0;
          fnStatus = 'P';
          anStatus = 'P';
        } else if (record.status === 'FH') {
          workedDays += 0.5;
          fnStatus = 'P';
          anStatus = 'AB';
        } else if (record.status === 'SH') {
          workedDays += 0.5;
          fnStatus = 'AB';
          anStatus = 'P';
        } else if (record.status === 'CL') {
          clDaysTaken += 1.0;
          fnStatus = 'CL';
          anStatus = 'CL';
        } else if (record.status === 'WO') {
          fnStatus = 'WO';
          anStatus = 'WO';
        } else if (record.status === 'H') {
          fnStatus = 'H';
          anStatus = 'H';
        }
      } else if (!isFuture) {
        workedDays += 1.0;
        fnStatus = 'P';
        anStatus = 'P';
      } else {
        fnStatus = '-';
        anStatus = '-';
      }

      dayRows.push({
        day,
        fnStatus,
        anStatus
      });
    }

    const clLimit = isDemoMode ? (emp.cl_limit ?? 3) : (leaveBalances[emp.id]?.cl_limit ?? 3);
    const paidLeaves = Math.min(clLimit, clDaysTaken);
    const rate = emp.daily_wage_rate || 0;
    const maxDays = emp.max_working_days || 25;
    const totalPaidDays = workedDays + paidLeaves;
    const payableDays = Math.min(totalPaidDays, maxDays);
    const totalSalary = payableDays * rate;
    const totalSalaryInWords = convertNumberToWords(totalSalary);

    return {
      employee: emp,
      dayRows,
      workedDays,
      payableDays,
      rate,
      maxDays,
      totalSalary,
      totalSalaryInWords
    };
  };

  const printDailyWageReportSingle = (emp, year = currentYear, month = currentMonth) => {
    const report = calculateSingleEmployeeWages(emp, year, month);
    setPrintData({
      type: 'wages',
      year,
      month,
      report
    });
  };

  const printEmployeeAttendance = (targetEmp, year = currentYear, month = currentMonth) => {
    const targetMonthStr = `${year}-${String(month).padStart(2, '0')}`;
    const empAttRecords = attendance.filter(
      att => att.employee_id === targetEmp.id && att.date.startsWith(targetMonthStr) && att.approval_status === 'Approved'
    );
    const numDays = new Date(year, month, 0).getDate();
    const today = new Date();
    today.setHours(0,0,0,0);

    const summary = { P: 0, CL: 0, ML: 0, EL: 0, SL: 0, FH: 0, SH: 0, OD: 0, TR: 0, TO: 0, CO: 0, WO: 0, H: 0, A: 0 };
    const rows = [];

    for (let day = 1; day <= numDays; day++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const record = empAttRecords.find(a => a.date === dateStr);
      const cellDate = new Date(year, month - 1, day);
      const isFuture = cellDate > today;

      let fnStatus = '-';
      let anStatus = '-';
      let statusShort = '';

      if (record) {
        statusShort = record.status;
        summary[record.status] = (summary[record.status] || 0) + 1;
      } else if (!isFuture) {
        statusShort = 'P';
        summary['P'] = (summary['P'] || 0) + 1;
      }

      if (statusShort) {
        if (statusShort === 'P' || statusShort === 'OD' || statusShort === 'TR') {
          fnStatus = 'P';
          anStatus = 'P';
        } else if (statusShort === 'FH') {
          fnStatus = 'P';
          anStatus = 'AB';
        } else if (statusShort === 'SH') {
          fnStatus = 'AB';
          anStatus = 'P';
        } else if (statusShort === 'A' || statusShort === 'LOP') {
          fnStatus = 'AB';
          anStatus = 'AB';
        } else {
          fnStatus = statusShort;
          anStatus = statusShort;
        }
      }

      rows.push({
        day,
        weekday: new Date(year, month - 1, day).toLocaleDateString('en-IN', { weekday: 'short' }),
        fnStatus,
        anStatus,
        remarks: record?.remarks || ''
      });
    }

    const empAllRecords = attendance.filter(
      att => att.employee_id === targetEmp.id && att.date.startsWith(String(year)) && att.approval_status === 'Approved'
    );
    const clTaken = empAllRecords.filter(a => a.status === 'CL').length;
    const mlTaken = empAllRecords.filter(a => a.status === 'ML').length;
    const elTaken = empAllRecords.filter(a => a.status === 'EL').length;
    const slTaken = empAllRecords.filter(a => a.status === 'SL').length;

    const clLimit = isDemoMode ? (targetEmp.cl_limit ?? 15) : (leaveBalances[targetEmp.id]?.cl_limit ?? 15);
    const mlLimit = isDemoMode ? (targetEmp.ml_limit ?? 15) : (leaveBalances[targetEmp.id]?.ml_limit ?? 15);
    const elLimit = isDemoMode ? (targetEmp.el_limit ?? 20) : (leaveBalances[targetEmp.id]?.el_limit ?? 20);
    const slLimit = isDemoMode ? (targetEmp.sl_limit ?? 10) : (leaveBalances[targetEmp.id]?.sl_limit ?? 10);

    const cl_balance = Math.max(0, clLimit - clTaken);
    const ml_balance = Math.max(0, mlLimit - mlTaken);
    const el_balance = Math.max(0, elLimit - elTaken);
    const sl_balance = Math.max(0, slLimit - slTaken);

    const cl_eligible = isDemoMode ? (targetEmp.cl_eligible ?? true) : (leaveBalances[targetEmp.id]?.cl_eligible ?? true);
    const ml_eligible = isDemoMode ? (targetEmp.ml_eligible ?? true) : (leaveBalances[targetEmp.id]?.ml_eligible ?? true);
    const el_eligible = isDemoMode ? (targetEmp.el_eligible ?? true) : (leaveBalances[targetEmp.id]?.el_eligible ?? true);
    const sl_eligible = isDemoMode ? (targetEmp.sl_eligible ?? true) : (leaveBalances[targetEmp.id]?.sl_eligible ?? true);

    const calculatedLeavesCount = summary.CL + summary.ML + summary.EL + summary.SL + (summary.FH * 0.5) + (summary.SH * 0.5);
    const calculatedPresentCount = summary.P + summary.OD + summary.TR + (summary.FH * 0.5) + (summary.SH * 0.5);

    let lopCount = 0;
    for (let day = 1; day <= numDays; day++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const record = empAttRecords.find(a => a.date === dateStr);
      const cellDate = new Date(year, month - 1, day);
      const isHol = holidays.some(h => h.date === dateStr) || isSecondSaturday(dateStr) || cellDate.getDay() === 0;
      
      const statusShort = record ? record.status : '';
      if (statusShort === 'LOP') {
        lopCount += 1;
      } else if (statusShort === 'A') {
        if (targetEmp.employment_category === 'Permanent' && isHol) {
          // Permanent employees do not get LOP on holidays/weekends
        } else {
          lopCount += 1;
        }
      }
    }

    if (targetEmp.employment_category === 'Daily Wage') {
      const clLimitDW = isDemoMode ? (targetEmp.cl_limit ?? 3) : (leaveBalances[targetEmp.id]?.cl_limit ?? 3);
      const clTakenInMonth = summary.CL || 0;
      const excessCL = Math.max(0, clTakenInMonth - clLimitDW);
      lopCount += excessCL;
      lopCount += (summary.ML || 0) + (summary.EL || 0) + (summary.SL || 0);
    }

    setPrintData({
      type: 'attendance',
      targetEmp,
      year,
      month,
      targetMonthStr,
      rows,
      summary,
      calculatedPresentCount,
      calculatedLeavesCount,
      lopCount,
      cl_balance,
      el_balance,
      sl_balance,
      ml_balance,
      cl_eligible,
      el_eligible,
      sl_eligible,
      ml_eligible
    });
  };

  const printDailyWageReport = (year = currentYear, month = currentMonth) => {
    if (selectedBatchWagers.length === 0) {
      alert("Please select at least one daily wage employee for the report.");
      return;
    }
    const reports = selectedBatchWagers.map(id => {
      const emp = employees.find(e => e.id === id);
      return calculateSingleEmployeeWages(emp, year, month);
    });
    setPrintData({
      type: 'batch-wages',
      year,
      month,
      reports
    });
  };

  // ==========================================

  // HELPERS FOR CALCULATING METRICS
  // ==========================================
  const getBirthdayStatus = () => {
    if (!currentUser || !currentUser.dob) return null;
    const today = new Date();
    const [by, bm, bd] = currentUser.dob.split('-');
    return today.getMonth() + 1 === parseInt(bm) && today.getDate() === parseInt(bd);
  };

  const getUpcomingBirthdays = () => {
    const today = new Date();
    const tMonth = today.getMonth() + 1;
    
    return employees
      .filter(emp => !emp.is_archived && !emp.is_hidden && emp.dob)
      .filter(emp => {
        const [y, m, d] = emp.dob.split('-');
        return parseInt(m) === tMonth;
      })
      .map(emp => {
        const [y, m, d] = emp.dob.split('-');
        return { name: emp.full_name, dateStr: `${new Date().getFullYear()}-${m}-${d}`, dob: emp.dob };
      })
      .sort((a, b) => new Date(a.dateStr) - new Date(b.dateStr));
  };

  const getDailyWageBreakAlerts = () => {
    const dailyWagers = employees.filter(emp => emp.employment_category === 'Daily Wage' && !emp.is_archived);
    const alerts = [];

    dailyWagers.forEach(emp => {
      const joinDate = new Date(emp.joining_date);
      const today = new Date();
      const diffMonths = (today.getFullYear() - joinDate.getFullYear()) * 12 + (today.getMonth() - joinDate.getMonth());
      const currentCycle = Math.floor(diffMonths / 6);
      
      if (currentCycle > 0) {
        const targetBreakStart = new Date(joinDate);
        targetBreakStart.setMonth(joinDate.getMonth() + currentCycle * 6);
        const rejoining = new Date(targetBreakStart);
        rejoining.setDate(targetBreakStart.getDate() + 3);

        const daysDiff = Math.ceil((targetBreakStart - today) / (1000 * 60 * 60 * 24));
        if (daysDiff <= 30 && daysDiff >= -5) {
          alerts.push({
            employee: emp,
            break_date: targetBreakStart.toISOString().split('T')[0],
            rejoin_date: rejoining.toISOString().split('T')[0],
            daysRemaining: daysDiff
          });
        }
      }
    });

    return alerts;
  };

  // Compile detailed holidays & events for mini calendar click
  const compileDayEventsList = (dateStr) => {
    const list = [];
    const d = new Date(dateStr);
    const dayOfWeek = d.getDay();

    // Custom Holidays
    const hols = holidays.filter(h => h.date === dateStr);
    hols.forEach(h => list.push(`Holiday: ${h.name}`));

    // Sundays
    if (dayOfWeek === 0) list.push("Weekly Off (Sunday)");

    // Second Saturday
    if (isSecondSaturday(dateStr)) list.push("System Holiday (Second Saturday)");

    // Staff Birthdays on this date
    employees.filter(e => !e.is_archived && !e.is_hidden && e.dob).forEach(emp => {
      const [ey, em, ed] = emp.dob.split('-');
      if (parseInt(em) === (d.getMonth() + 1) && parseInt(ed) === d.getDate()) {
        list.push(`🎂 Staff Birthday: ${emp.full_name}`);
      }
    });

    return list;
  };

  // ==========================================
  // VIEW RENDER SHARDS
  // ==========================================
  const renderDashboard = () => {
    const isBday = getBirthdayStatus();
    
    // Stats Calculations for the ACTUAL current month (so it snaps to June 1st instead of calendar navigation month!)
    const actualYear = new Date().getFullYear();
    const actualMonth = new Date().getMonth() + 1;
    const currentMonthStr = `${actualYear}-${String(actualMonth).padStart(2, '0')}`;
    
    // Filter approved attendance records for the active logged-in employee
    const myAtts = attendance.filter(a => a.employee_id === currentUser.id && a.date.startsWith(currentMonthStr) && a.approval_status === 'Approved');
    
    let presentDays = 0;
    let leaveDays = 0;
    
    const today = new Date();
    today.setHours(0,0,0,0);

    const numDays = new Date(actualYear, actualMonth, 0).getDate();
    for (let day = 1; day <= numDays; day++) {
      const dateStr = `${currentMonthStr}-${String(day).padStart(2, '0')}`;
      const record = myAtts.find(a => a.date === dateStr);
      
      const dayOfWeek = new Date(actualYear, actualMonth - 1, day).getDay();
      const isSunday = dayOfWeek === 0;
      const isMonday = dayOfWeek === 1;
      const isSecSat = isSecondSaturday(dateStr);
      const hasCustomHol = holidays.some(h => h.date === dateStr);
      const cellDate = new Date(actualYear, actualMonth - 1, day);
      const isFuture = cellDate > today;

      if (record) {
        if (record.status === 'P' || record.status === 'OD' || record.status === 'TR') presentDays += 1.0;
        else if (record.status === 'FH' || record.status === 'SH') {
          presentDays += 0.5;
          leaveDays += 0.5;
        } else if (['CL', 'ML', 'EL', 'SL'].includes(record.status)) {
          leaveDays += 1.0;
        }
      } else if (!isFuture) {
        presentDays += 1.0; // Defaults to Present up to today!
      }
    }

    const pendingRequests = attendance.filter(a => {
      if (a.approval_status !== 'Pending') return false;
      if (a.employee_id === currentUser.id) return true; // Filer always sees their own request
      
      if (currentUser.role === 'Root Admin') return true; // Root Admin sees all pending
      
      // Check if current user is an assigned reporting officer for this employee
      const filer = employees.find(e => e.id === a.employee_id);
      const isRep = filer && filer.reporting_officers && filer.reporting_officers.includes(currentUser.full_name);
      return !!isRep;
    });
    const pendingProfileRequests = profileRequests.filter(r => {
      if (r.status !== 'Pending') return false;
      if (currentUser.role === 'Root Admin') return true;
      const filer = employees.find(e => e.id === r.employee_id);
      const isRep = filer && filer.reporting_officers && filer.reporting_officers.includes(currentUser.full_name);
      return !!isRep;
    });

    // Calculate leaves taken (Pending + Approved are deducted; Rejected are ignored)
    const myAllRecords = attendance.filter(a => a.employee_id === currentUser.id && a.approval_status !== 'Rejected');
    const isMonthlyReset = currentUser.employment_category === 'Daily Wage';

    // Filter records for the target month
    const targetMonthRecords = myAllRecords.filter(a => a.date.startsWith(currentMonthStr));

    const clTaken = isMonthlyReset
      ? targetMonthRecords.filter(a => a.status === 'CL').length + (targetMonthRecords.filter(a => a.status === 'FH').length * 0.5) + (targetMonthRecords.filter(a => a.status === 'SH').length * 0.5)
      : myAllRecords.filter(a => a.status === 'CL').length + (myAllRecords.filter(a => a.status === 'FH').length * 0.5) + (myAllRecords.filter(a => a.status === 'SH').length * 0.5);

    const mlTaken = isMonthlyReset
      ? targetMonthRecords.filter(a => a.status === 'ML').length
      : myAllRecords.filter(a => a.status === 'ML').length;

    const elTaken = isMonthlyReset
      ? targetMonthRecords.filter(a => a.status === 'EL').length
      : myAllRecords.filter(a => a.status === 'EL').length;

    const slTaken = isMonthlyReset
      ? targetMonthRecords.filter(a => a.status === 'SL').length
      : myAllRecords.filter(a => a.status === 'SL').length;

    const balance = isDemoMode
      ? { 
          cl_eligible: currentUser.cl_eligible ?? true, cl_limit: currentUser.cl_limit ?? 15, cl_balance: Math.max(0, (currentUser.cl_limit ?? 15) - clTaken),
          ml_eligible: currentUser.ml_eligible ?? true, ml_limit: currentUser.ml_limit ?? 15, ml_balance: Math.max(0, (currentUser.ml_limit ?? 15) - mlTaken),
          el_eligible: currentUser.el_eligible ?? true, el_limit: currentUser.el_limit ?? 20, el_balance: Math.max(0, (currentUser.el_limit ?? 20) - elTaken),
          sl_eligible: currentUser.sl_eligible ?? true, sl_limit: currentUser.sl_limit ?? 10, sl_balance: Math.max(0, (currentUser.sl_limit ?? 10) - slTaken)
        }
      : {
          cl_eligible: leaveBalances[currentUser.id]?.cl_eligible ?? true,
          cl_limit: leaveBalances[currentUser.id]?.cl_limit ?? 15,
          cl_balance: Math.max(0, (leaveBalances[currentUser.id]?.cl_limit ?? 15) - clTaken),

          ml_eligible: leaveBalances[currentUser.id]?.ml_eligible ?? true,
          ml_limit: leaveBalances[currentUser.id]?.ml_limit ?? 15,
          ml_balance: Math.max(0, (leaveBalances[currentUser.id]?.ml_limit ?? 15) - mlTaken),

          el_eligible: leaveBalances[currentUser.id]?.el_eligible ?? true,
          el_limit: leaveBalances[currentUser.id]?.el_limit ?? 20,
          el_balance: Math.max(0, (leaveBalances[currentUser.id]?.el_limit ?? 20) - elTaken),

          sl_eligible: leaveBalances[currentUser.id]?.sl_eligible ?? true,
          sl_limit: leaveBalances[currentUser.id]?.sl_limit ?? 10,
          sl_balance: Math.max(0, (leaveBalances[currentUser.id]?.sl_limit ?? 10) - slTaken)
        };

    const upcomingHols = holidays.filter(h => new Date(h.date) >= new Date()).slice(0, 3);
    const bdays = getUpcomingBirthdays();
    const breakAlerts = getDailyWageBreakAlerts();
    const myPendingProfileRequest = profileRequests.find(r => r.employee_id === currentUser.id && r.status === 'Pending');

    // Mini Dashboard Interactive Calendar Calculations
    const dashNumDays = new Date(dashYear, dashMonth, 0).getDate();
    const dashFirstDayIdx = new Date(dashYear, dashMonth - 1, 1).getDay();
    const dashCells = [];
    
    for (let i = 0; i < dashFirstDayIdx; i++) {
      dashCells.push(<div key={`dash-pad-${i}`} style={{ opacity: 0.1 }}></div>);
    }

    const dashMonthStr = `${dashYear}-${String(dashMonth).padStart(2, '0')}`;

    for (let dNum = 1; dNum <= dashNumDays; dNum++) {
      const dStr = `${dashMonthStr}-${String(dNum).padStart(2, '0')}`;
      const dOfWeek = new Date(dashYear, dashMonth - 1, dNum).getDay();
      
      const isSun = dOfWeek === 0;
      const isSec = isSecondSaturday(dStr);
      const isCust = holidays.some(h => h.date === dStr);
      
      let borderGlow = 'none';
      let textClr = 'var(--text-primary)';
      let cellBg = 'rgba(255,255,255,0.01)';
      
      if (isSun) { cellBg = 'rgba(244, 63, 94, 0.15)'; textClr = 'var(--accent-rose)'; }
      else if (isCust || isSec) { cellBg = 'rgba(245, 158, 11, 0.15)'; textClr = 'var(--accent-amber)'; }

      if (selectedDashDate === dStr) {
        borderGlow = '1.5px solid var(--accent-blue)';
      }

      dashCells.push(
        <div 
          key={`dash-day-${dNum}`} 
          onClick={() => setSelectedDashDate(dStr)}
          style={{ 
            aspectRatio: '1', 
            borderRadius: '50%', 
            background: cellBg, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '11px', 
            cursor: 'pointer',
            border: borderGlow,
            color: textClr,
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
        >
          {dNum}
        </div>
      );
    }

    const selectedDayEvents = compileDayEventsList(selectedDashDate);

    const activeAnnouncements = announcements.filter(ann => {
      if (ann.target_type === 'All') return true;
      if (ann.target_users && ann.target_users.includes(currentUser.id)) return true;
      return false;
    });

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {/* Birthday Festive Banner */}
        {isBday && (
          <div className="birthday-celebration-banner">
            <div>
              <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                🎉 Happy Birthday, {currentUser.full_name}! 🎂
              </h2>
              <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>
                Kerala Science City values your dedication! Have a stellar day.
              </p>
            </div>
            <Cake size={48} />
          </div>
        )}

        {/* Profile Warning */}
        {myPendingProfileRequest && (
          <div className="notification-banner info" style={{ borderRadius: 'var(--radius-md)' }}>
            <AlertTriangle size={20} />
            <div>
              <strong>Proposed Profile Modifications Awaiting Admin Verification</strong>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>
                Your emergency contact, address, or mobile details will reflect officially once verified by the Admin.
              </div>
            </div>
          </div>
        )}

        {/* Active Announcements Notice Board */}
        {activeAnnouncements.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
            {activeAnnouncements.map(ann => (
              <div key={ann.id} className="announcement-attention-card">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.12)' }}>
                    <Bell size={20} className="announcement-bell" style={{ color: '#ef4444' }} />
                    <span style={{ position: 'absolute', top: '2px', right: '2px', display: 'block', width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', border: '2.5px solid var(--bg-secondary)', animation: 'dot-pulse 1.5s infinite cubic-bezier(0.66, 0, 0, 1)' }} />
                  </div>
                </div>
                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <div className="announcement-badge">
                        <span className="pulse-dot" /> അടിയന്തിര അറിയിപ്പ് / Broadcast Announcement
                      </div>
                      <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                        {ann.title}
                      </h4>
                    </div>
                    {currentUser.role === 'Root Admin' && (
                      <button 
                        onClick={() => handleDeleteAnnouncement(ann.id)} 
                        className="btn-text-delete"
                        style={{ background: 'rgba(239, 68, 68, 0.08)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '4px 8px', color: '#ef4444', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.2s' }}
                      >
                        <Trash size={12} /> Delete
                      </button>
                    )}
                  </div>
                  <p style={{ margin: '12px 0 0 0', fontSize: '13.5px', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: '1.6', fontWeight: '500' }}>
                    {ann.message}
                  </p>
                  <div style={{ marginTop: '14px', fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                    <span>Broadcasted by: <strong style={{ color: 'var(--text-secondary)' }}>{ann.created_by_name}</strong></span>
                    <span>{new Date(ann.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })} at {new Date(ann.created_at).toLocaleTimeString('en-IN', { timeStyle: 'short' })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Widgets counters */}
        <div className="widgets-grid">
          <div className="glass-card widget-card">
            <div className="widget-icon blue"><Clock /></div>
            <div className="widget-info">
              <span className="widget-value">{presentDays}</span>
              <span className="widget-label">Present (Month)</span>
            </div>
          </div>
          <div className="glass-card widget-card">
            <div className="widget-icon emerald"><CheckCircle /></div>
            <div className="widget-info">
              <span className="widget-value">{leaveDays}</span>
              <span className="widget-label">Leaves Count</span>
            </div>
          </div>
          <div className="glass-card widget-card">
            <div className="widget-icon amber"><AlertCircle /></div>
            <div className="widget-info">
              <span className="widget-value">{pendingRequests.length + pendingProfileRequests.length}</span>
              <span className="widget-label">Pending Approvals</span>
            </div>
          </div>
          {currentUser.employment_category === 'Daily Wage' && (
            <div className="glass-card widget-card">
              <div className="widget-icon rose"><IndianRupee /></div>
              <div className="widget-info">
                <span className="widget-value">₹ {currentUser.daily_wage_rate}/day</span>
                <span className="widget-label">Wage Rate</span>
              </div>
            </div>
          )}
        </div>

        <div className="dashboard-layout">
          {/* Left Column */}
          <div className="dashboard-column">
            {currentUser.role === 'Root Admin' && (
              <div className="glass-card">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-blue)', marginBottom: '15px' }}>
                  <Bell size={20} /> Broadcast New Message 📢
                </h3>
                <form onSubmit={handleCreateAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '5px' }}>Message Title / Subject</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Server Maintenance Notice" 
                      value={newAnnouncementTitle} 
                      onChange={e => setNewAnnouncementTitle(e.target.value)} 
                      required 
                    />
                  </div>
                  
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '5px' }}>Message Body</label>
                    <textarea 
                      className="form-control" 
                      rows="4" 
                      placeholder="Write your broadcast message details here..." 
                      value={newAnnouncementMessage} 
                      onChange={e => setNewAnnouncementMessage(e.target.value)} 
                      required 
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '5px' }}>Target Audience</label>
                    <div style={{ display: 'flex', gap: '15px', marginTop: '5px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                        <input 
                          type="radio" 
                          name="announcementTarget" 
                          checked={newAnnouncementTarget === 'All'} 
                          onChange={() => setNewAnnouncementTarget('All')} 
                        />
                        All Staff
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                        <input 
                          type="radio" 
                          name="announcementTarget" 
                          checked={newAnnouncementTarget === 'Specific'} 
                          onChange={() => setNewAnnouncementTarget('Specific')} 
                        />
                        Specific Staff
                      </label>
                    </div>
                  </div>

                  {newAnnouncementTarget === 'Specific' && (
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '5px' }}>Select Recipients</label>
                      <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', padding: '10px', background: 'rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {employees
                          .filter(emp => !emp.is_archived && emp.id !== currentUser.id)
                          .map(emp => {
                            const isChecked = newAnnouncementSelectedUsers.includes(emp.id);
                            return (
                              <label key={emp.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', color: isChecked ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                <input 
                                  type="checkbox" 
                                  checked={isChecked} 
                                  onChange={e => {
                                    if (e.target.checked) {
                                      setNewAnnouncementSelectedUsers([...newAnnouncementSelectedUsers, emp.id]);
                                    } else {
                                      setNewAnnouncementSelectedUsers(newAnnouncementSelectedUsers.filter(id => id !== emp.id));
                                    }
                                  }}
                                />
                                {emp.full_name} ({emp.designation})
                              </label>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary" style={{ height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plus size={16} style={{ marginRight: '6px' }} /> Broadcast Message
                  </button>
                </form>
              </div>
            )}
            
            {breakAlerts.length > 0 && currentUser.role !== 'Employee' && (
              <div className="glass-card" style={{ borderColor: 'var(--accent-rose)', background: 'rgba(244, 63, 94, 0.08)' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-rose)', marginBottom: '15px' }}><AlertCircle size={20} /> Daily Wage Break Alerts</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {breakAlerts.map(alert => (
                    <div key={alert.employee.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                      <div>
                        <strong>{alert.employee.full_name}</strong> ({alert.employee.employee_number})
                        <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Break Start: {alert.break_date} | Rejoining: {alert.rejoin_date}</div>
                      </div>
                      <span className="badge-status A" style={{ minWidth: '80px' }}>{alert.daysRemaining <= 0 ? 'Due Now' : `${alert.daysRemaining} days`}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentUser.employment_category !== 'Daily Wage' && (
              <div className="glass-card">
                <h3 style={{ marginBottom: '20px' }}>Your Leave Balance Summary</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
                  {balance.cl_eligible && (
                    <div className="leave-progress-container">
                      <div className="leave-progress-label">
                        <span>Casual Leave (CL)</span>
                        <strong>{balance.cl_balance} / {balance.cl_limit}</strong>
                      </div>
                      <div className="leave-progress-bar-bg">
                        <div className="leave-progress-bar-fill cl" style={{ width: `${(balance.cl_balance / Math.max(balance.cl_limit, 1)) * 100}%` }}></div>
                      </div>
                    </div>
                  )}
                  {balance.ml_eligible && (
                    <div className="leave-progress-container">
                      <div className="leave-progress-label">
                        <span>Medical Leave (ML)</span>
                        <strong>{balance.ml_balance} / {balance.ml_limit}</strong>
                      </div>
                      <div className="leave-progress-bar-bg">
                        <div className="leave-progress-bar-fill ml" style={{ width: `${(balance.ml_balance / Math.max(balance.ml_limit, 1)) * 100}%` }}></div>
                      </div>
                    </div>
                  )}
                  {balance.el_eligible && (
                    <div className="leave-progress-container">
                      <div className="leave-progress-label">
                        <span>Earned Leave (EL)</span>
                        <strong>{balance.el_balance} / {balance.el_limit}</strong>
                      </div>
                      <div className="leave-progress-bar-bg">
                        <div className="leave-progress-bar-fill el" style={{ width: `${(balance.el_balance / Math.max(balance.el_limit, 1)) * 100}%` }}></div>
                      </div>
                    </div>
                  )}
                  {balance.sl_eligible && (
                    <div className="leave-progress-container">
                      <div className="leave-progress-label">
                        <span>Special Leave (SL)</span>
                        <strong>{balance.sl_balance} / {balance.sl_limit}</strong>
                      </div>
                      <div className="leave-progress-bar-bg">
                        <div className="leave-progress-bar-fill sl" style={{ width: `${(balance.sl_balance / Math.max(balance.sl_limit, 1)) * 100}%` }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Profile Requests Queue */}
            {(currentUser.role === 'Root Admin' || employees.some(e => e.reporting_officers?.includes(currentUser?.full_name))) && pendingProfileRequests.length > 0 && (
              <div className="glass-card" style={{ borderColor: 'var(--accent-blue)' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-blue)', marginBottom: '15px' }}><Shield size={20} /> Profile Verification Queue</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {pendingProfileRequests.map(req => {
                    const emp = employees.find(e => e.id === req.employee_id);
                    return (
                      <div key={req.id} style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '15px', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.01)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <strong>{emp ? emp.full_name : 'Unknown'}</strong> ({emp ? emp.employee_number : ''})
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Submitted: {new Date(req.submitted_at).toLocaleString()}</div>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn btn-success" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => handleVerifyProfileRequest(req, 'Approved')}><Check size={14} /> Approve</button>
                            <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => handleVerifyProfileRequest(req, 'Rejected')}><X size={14} /> Reject</button>
                          </div>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          <strong>Changes:</strong>
                          <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                            {Object.keys(req.pending_data).map(key => {
                              const original = emp ? (typeof emp[key] === 'object' ? JSON.stringify(emp[key]) : emp[key]) : '-';
                              const proposed = typeof req.pending_data[key] === 'object' ? JSON.stringify(req.pending_data[key]) : req.pending_data[key];
                              if (original === proposed) return null;
                              return (
                                <li key={key}>
                                  <span style={{ textTransform: 'capitalize' }}>{key.replace('_', ' ')}</span>: 
                                  <span style={{ color: 'var(--accent-rose)', textDecoration: 'line-through', marginLeft: '5px' }}>{original || '[Blank]'}</span>
                                  <span style={{ color: 'var(--accent-emerald)', marginLeft: '10px' }}>→ {proposed || '[Blank]'}</span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Attendance Queue */}
            {(currentUser.role === 'Root Admin' || employees.some(e => e.reporting_officers?.includes(currentUser?.full_name))) && (
              <div className="glass-card">
                <h3 style={{ marginBottom: '15px' }}>Attendance & Leave Requests Queue</h3>
                {pendingRequests.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>No pending requests.</p>
                ) : (
                  <div className="table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Employee</th>
                          <th>Request Date</th>
                          <th>Status</th>
                          <th>Remarks</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingRequests.map(item => {
                          const emp = employees.find(e => e.id === item.employee_id);
                          return (
                            <tr key={item.id}>
                              <td>{emp ? emp.full_name : 'Unknown'}</td>
                              <td>{item.date}</td>
                              <td><span className={`badge-status ${item.status}`}>{item.status}</span></td>
                              <td>{item.remarks || '-'}</td>
                              <td style={{ display: 'flex', gap: '8px' }}>
                                <button className="btn btn-success" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => handleApproveStatus(item, 'Approved')}><Check size={14} /></button>
                                <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => handleApproveStatus(item, 'Rejected')}><X size={14} /></button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Employee Welcome & Quick Balance Hub */}
            {currentUser && (
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '15px' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold', color: '#ffffff', flexShrink: 0 }}>
                    {currentUser.full_name?.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>Welcome, {currentUser.full_name}!</h3>
                    <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>{currentUser.designation} — KSC Employee Space</p>
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                  <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', fontSize: '12px' }}>
                    <span style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '3px', textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.05em' }}>Joining Date</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{currentUser.joining_date || 'Not provided'}</strong>
                  </div>
                  <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', fontSize: '12px' }}>
                    <span style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '3px', textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.05em' }}>Employment Type</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{currentUser.employment_category}</strong>
                  </div>
                  <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', fontSize: '12px' }}>
                    <span style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '3px', textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.05em' }}>Functional Role</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{currentUser.functional_role || 'General Staff'}</strong>
                  </div>
                  <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', fontSize: '12px' }}>
                    <span style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '3px', textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.05em' }}>Reporting Officers</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{currentUser.reporting_officers?.join(', ') || 'None'}</strong>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '15px' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '6px' }}><Award size={14} /> Quick Balance Sheet</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {balance.cl_eligible && (
                      <span className="badge-status CL" style={{ scale: '0.9', padding: '4px 10px' }}>Casual Leaves: {balance.cl_balance} CL Remaining</span>
                    )}
                    {currentUser.co_eligible && (
                      <span className="badge-status CO" style={{ scale: '0.9', padding: '4px 10px' }}>Comp Offs: {cOffCredits.filter(c => c.employee_id === currentUser.id && c.status === 'Available').length} Available</span>
                    )}
                    {!balance.cl_eligible && !currentUser.co_eligible && (
                      <span className="badge-status P" style={{ scale: '0.9', padding: '4px 10px' }}>Standard Working Status Active</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Upcoming Public Holidays Card */}
            {(() => {
              const todayStr = new Date().toISOString().split('T')[0];
              const upcomingHols = holidays
                .filter(h => h.date >= todayStr)
                .sort((a, b) => a.date.localeCompare(b.date))
                .slice(0, 3);
              if (upcomingHols.length === 0) return null;
              return (
                <div className="glass-card" style={{ marginBottom: '20px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)', fontSize: '15px', marginBottom: '15px', marginTop: 0 }}>
                    <Calendar size={18} /> Upcoming Public Holidays
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                    {upcomingHols.map(h => (
                      <div key={h.id || h.date} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-emerald)', width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', lineHeight: '1' }}>
                            {new Date(h.date).toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                          <span style={{ fontSize: '13px', fontWeight: 'bold', lineHeight: '1', marginTop: '2px' }}>
                            {new Date(h.date).getDate()}
                          </span>
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                          <strong style={{ display: 'block', fontSize: '12px', color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} title={h.name}>
                            {h.name}
                          </strong>
                          <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                            {new Date(h.date).toLocaleDateString('en-US', { weekday: 'long' })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Right Column / Interactive Calendar Widget */}
          <div className="dashboard-column">
            
            {/* Interactive Dashboard Mini-Calendar */}
            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ fontSize: '16px' }}>Calendar</h3>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => {
                    if (dashMonth === 1) { setDashMonth(12); setDashYear(dashYear - 1); }
                    else setDashMonth(dashMonth - 1);
                  }}><ChevronLeft size={12} /></button>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', minWidth: '80px', textAlign: 'center', paddingTop: '2px' }}>
                    {new Date(dashYear, dashMonth - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                  <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => {
                    if (dashMonth === 12) { setDashMonth(1); setDashYear(dashYear + 1); }
                    else setDashMonth(dashMonth + 1);
                  }}><ChevronRight size={12} /></button>
                </div>
              </div>

              {/* Grid Layout mini calendar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textItems: 'center', textAlign: 'center', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
                {dashCells}
              </div>

              {/* Day Events details display */}
              <div style={{ marginTop: '15px', borderTop: '1px solid var(--glass-border)', paddingTop: '10px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Events for: {new Date(selectedDashDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</div>
                {selectedDayEvents.length === 0 ? (
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>No scheduled holidays or birthdays on this day.</div>
                ) : (
                  <ul style={{ paddingLeft: '15px', marginTop: '6px', fontSize: '12px', color: 'var(--accent-amber)', listStyleType: 'circle' }}>
                    {selectedDayEvents.map((ev, i) => (
                      <li key={i} style={{ marginTop: '2px' }}>{ev}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="glass-card birthday-widget">
              <h3>Month Birthdays 🎂</h3>
              {bdays.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '15px' }}>No birthdays this month.</p>
              ) : (
                <div className="birthday-list">
                  {bdays.map((bday, i) => (
                    <div key={i} className="birthday-item">
                      <div className="birthday-avatar"><Cake size={14} /></div>
                      <div className="birthday-details">
                        <span className="birthday-name">{bday.name}</span>
                        <span className="birthday-date">{new Date(bday.dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAttendanceCalendar = () => {
    const firstDayIndex = new Date(currentYear, currentMonth - 1, 1).getDay();
    const numDays = new Date(currentYear, currentMonth, 0).getDate();
    const cells = [];
    
    // Tally monthly leaves (Pending + Approved are counted; Rejected are ignored)
    const monthStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
    const viewedEmployeeIdVal = viewedEmployee.id || currentUser.id;
    const myAllRecords = attendance.filter(a => a.employee_id === viewedEmployeeIdVal && a.approval_status !== 'Rejected');
    const isMonthlyReset = viewedEmployee.employment_category === 'Daily Wage';

    // Target month records
    const targetMonthRecords = myAllRecords.filter(a => a.date.startsWith(monthStr));
    const coBalance = cOffCredits.filter(c => c.employee_id === viewedEmployeeIdVal && c.status === 'Available').length;

    const counts = { CL: 0, ML: 0, EL: 0, SL: 0, FH: 0, SH: 0, OD: 0, TR: 0, TO: 0, CO: 0, WO: 0 };
    targetMonthRecords.forEach(r => {
      if (counts[r.status] !== undefined) {
        counts[r.status]++;
      }
    });

    const today = new Date();
    today.setHours(0,0,0,0);

    let presentDaysThisMonth = 0;
    let totalWorkingDaysThisMonth = 0;

    for (let day = 1; day <= numDays; day++) {
      const dateStr = `${monthStr}-${String(day).padStart(2, '0')}`;
      const isBeforeJoining = viewedEmployee.joining_date && dateStr < viewedEmployee.joining_date;
      
      if (isBeforeJoining) continue;

      const dayOfWeek = new Date(currentYear, currentMonth - 1, day).getDay();
      const isSunday = dayOfWeek === 0;
      const isMonday = dayOfWeek === 1;
      const isSecSat = isSecondSaturday(dateStr);
      const isCustomHoliday = holidays.some(h => h.date === dateStr);

      const record = targetMonthRecords.find(a => a.date === dateStr);
      const cellDateObj = new Date(currentYear, currentMonth - 1, day);
      const isFuture = cellDateObj > today;

      const isScheduledWorkingDay = true; // Everyday is a working day by default

      if (isScheduledWorkingDay) {
        totalWorkingDaysThisMonth++;
      }

      if (record) {
        if (record.status === 'P' || record.status === 'OD' || record.status === 'TR' || record.status === 'CO') {
          presentDaysThisMonth += 1.0;
        } else if (record.status === 'FH' || record.status === 'SH') {
          presentDaysThisMonth += 0.5;
        }
      } else if (isScheduledWorkingDay && !isFuture) {
        presentDaysThisMonth += 1.0;
      }
    }

    const clTaken = isMonthlyReset
      ? targetMonthRecords.filter(a => a.status === 'CL').length + (targetMonthRecords.filter(a => a.status === 'FH').length * 0.5) + (targetMonthRecords.filter(a => a.status === 'SH').length * 0.5)
      : myAllRecords.filter(a => a.status === 'CL').length + (myAllRecords.filter(a => a.status === 'FH').length * 0.5) + (myAllRecords.filter(a => a.status === 'SH').length * 0.5);

    const mlTaken = isMonthlyReset
      ? targetMonthRecords.filter(a => a.status === 'ML').length
      : myAllRecords.filter(a => a.status === 'ML').length;

    const elTaken = isMonthlyReset
      ? targetMonthRecords.filter(a => a.status === 'EL').length
      : myAllRecords.filter(a => a.status === 'EL').length;

    const slTaken = isMonthlyReset
      ? targetMonthRecords.filter(a => a.status === 'SL').length
      : myAllRecords.filter(a => a.status === 'SL').length;

    const balance = isDemoMode
      ? { 
          cl_eligible: viewedEmployee.cl_eligible ?? true, cl_limit: viewedEmployee.cl_limit ?? 15, cl_balance: Math.max(0, (viewedEmployee.cl_limit ?? 15) - clTaken),
          ml_eligible: viewedEmployee.ml_eligible ?? true, ml_limit: viewedEmployee.ml_limit ?? 15, ml_balance: Math.max(0, (viewedEmployee.ml_limit ?? 15) - mlTaken),
          el_eligible: viewedEmployee.el_eligible ?? true, el_limit: viewedEmployee.el_limit ?? 20, el_balance: Math.max(0, (viewedEmployee.el_limit ?? 20) - elTaken),
          sl_eligible: viewedEmployee.sl_eligible ?? true, sl_limit: viewedEmployee.sl_limit ?? 10, sl_balance: Math.max(0, (viewedEmployee.sl_limit ?? 10) - slTaken)
        }
      : {
          cl_eligible: leaveBalances[viewedEmployeeIdVal]?.cl_eligible ?? true,
          cl_limit: leaveBalances[viewedEmployeeIdVal]?.cl_limit ?? 15,
          cl_balance: Math.max(0, (leaveBalances[viewedEmployeeIdVal]?.cl_limit ?? 15) - clTaken),

          ml_eligible: leaveBalances[viewedEmployeeIdVal]?.ml_eligible ?? true,
          ml_limit: leaveBalances[viewedEmployeeIdVal]?.ml_limit ?? 15,
          ml_balance: Math.max(0, (leaveBalances[viewedEmployeeIdVal]?.ml_limit ?? 15) - mlTaken),

          el_eligible: leaveBalances[viewedEmployeeIdVal]?.el_eligible ?? true,
          el_limit: leaveBalances[viewedEmployeeIdVal]?.el_limit ?? 20,
          el_balance: Math.max(0, (leaveBalances[viewedEmployeeIdVal]?.el_limit ?? 20) - elTaken),

          sl_eligible: leaveBalances[viewedEmployeeIdVal]?.sl_eligible ?? true,
          sl_limit: leaveBalances[viewedEmployeeIdVal]?.sl_limit ?? 10,
          sl_balance: Math.max(0, (leaveBalances[viewedEmployeeIdVal]?.sl_limit ?? 10) - slTaken)
        };

    const getPrevMonthYear = () => {
      let prevM = currentMonth - 1;
      let prevY = currentYear;
      if (prevM === 0) {
        prevM = 12;
        prevY = currentYear - 1;
      }
      return { year: prevY, month: prevM };
    };

    const getJoinMonthYear = () => {
      if (!viewedEmployee || !viewedEmployee.joining_date) return null;
      const parts = viewedEmployee.joining_date.split('-');
      return { year: parseInt(parts[0]), month: parseInt(parts[1]) };
    };

    const isPrevDisabled = () => {
      const join = getJoinMonthYear();
      if (!join) return false;
      const prev = getPrevMonthYear();
      if (prev.year < join.year) return true;
      if (prev.year === join.year && prev.month < join.month) return true;
      return false;
    };

    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(<div key={`pad-${i}`} className="calendar-cell other-month"></div>);
    }

    const currentMonthStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
    
    // Strict threshold check

    for (let day = 1; day <= numDays; day++) {
      const dateStr = `${currentMonthStr}-${String(day).padStart(2, '0')}`;
      const record = attendance.find(a => a.employee_id === viewedEmployeeIdVal && a.date === dateStr);
      
      const dayOfWeek = new Date(currentYear, currentMonth - 1, day).getDay();
      
      const isSunday = dayOfWeek === 0;
      const isMonday = dayOfWeek === 1;
      const isSecSat = isSecondSaturday(dateStr);
      const matchingHols = holidays.filter(h => h.date === dateStr);
      const cellDateObj = new Date(currentYear, currentMonth - 1, day);
      const isFuture = cellDateObj > today;

      let badgeCode = '';
      let approvalLabel = '';
      
      const isBeforeJoining = viewedEmployee.joining_date && dateStr < viewedEmployee.joining_date;

      if (isBeforeJoining) {
        // Render empty / disabled for days before joining date
        badgeCode = '';
      } else if (record) {
        badgeCode = record.status;
        approvalLabel = record.approval_status;
      } else if (!isFuture) {
        // Everyday defaults to Present (P) up to today by default
        badgeCode = 'P';
      }

      const isToday = new Date().toDateString() === new Date(currentYear, currentMonth - 1, day).toDateString();

      const cellStyle = {};
      let dateColor = {};

      if (isBeforeJoining) {
        cellStyle.cursor = 'not-allowed';
        cellStyle.opacity = 0.3;
      } else if (matchingHols.length > 0) {
        // Holiday highlight: Green/emerald tint
        cellStyle.background = 'rgba(16, 185, 129, 0.06)';
        cellStyle.borderColor = 'rgba(16, 185, 129, 0.35)';
        cellStyle.borderStyle = 'dotted';
        dateColor = { color: 'rgba(52, 211, 153, 0.95)' };
      } else if (isSecSat) {
        // Second Saturday highlight: Amber/gold tint
        cellStyle.background = 'rgba(245, 158, 11, 0.06)';
        cellStyle.borderColor = 'rgba(245, 158, 11, 0.35)';
        cellStyle.borderStyle = 'dashed';
        dateColor = { color: 'rgba(251, 191, 36, 0.95)' };
      } else if (isMonday) {
        // Monday highlight: Indigo/violet tint
        cellStyle.background = 'rgba(99, 102, 241, 0.06)';
        cellStyle.borderColor = 'rgba(99, 102, 241, 0.35)';
        cellStyle.borderStyle = 'dashed';
        dateColor = { color: 'rgba(165, 180, 252, 0.95)' };
      } else if (isSunday) {
        // Sunday highlight: Light rose tint
        cellStyle.background = 'rgba(239, 68, 68, 0.04)';
        cellStyle.borderColor = 'rgba(239, 68, 68, 0.25)';
        dateColor = { color: 'rgba(244, 63, 94, 0.9)' };
      }

      cells.push(
        <div 
          key={`day-${day}`} 
          className={`calendar-cell ${isToday ? 'today' : ''} ${isBeforeJoining ? 'other-month' : ''} ${isSecSat ? 'second-sat-cell' : ''} ${isSunday ? 'sunday-cell' : ''} ${isMonday ? 'monday-cell' : ''} ${matchingHols.length > 0 ? 'holiday-cell' : ''}`}
          style={cellStyle}
          onClick={() => {
            if (isBeforeJoining) return;
            handleOpenCalendarDayEvents(dateStr);
          }}
        >
          <span className="calendar-cell-date" style={isBeforeJoining ? {} : dateColor}>{day}</span>
          
          {/* Context sub-labels for holidays/saturdays */}
          {!isBeforeJoining && matchingHols.length > 0 && (
            <div style={{ fontSize: '8px', fontWeight: '600', color: 'rgba(52, 211, 153, 0.85)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '100%', padding: '0 2px' }} title={matchingHols.map(h=>h.name).join(', ')}>
              {matchingHols[0].name}
            </div>
          )}
          {!isBeforeJoining && isSecSat && (
            <span style={{ fontSize: '8px', fontWeight: '600', color: 'rgba(251, 191, 36, 0.85)' }}>Second Sat</span>
          )}

          {badgeCode && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
              <span className={`badge-status ${badgeCode}`} style={{ scale: '0.85' }}>{badgeCode}</span>
              {approvalLabel && (
                <span style={{ fontSize: '9px', color: approvalLabel === 'Approved' ? 'var(--accent-emerald)' : approvalLabel === 'Pending' ? 'var(--accent-amber)' : 'var(--accent-rose)' }}>
                  {approvalLabel}
                </span>
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="dashboard-layout">
        {/* Left Column - Attendance Calendar Grid */}
        <div className="glass-card" style={{ flexGrow: 1 }}>
          <div className="calendar-container">
            <div className="calendar-header" style={{ flexWrap: 'wrap', gap: '15px' }}>
              <div>
                <h3>Filing Attendance & Status Registry</h3>
                {viewedEmployee.id !== currentUser.id && (
                  <span style={{ fontSize: '12px', color: 'var(--accent-amber)', fontWeight: '600' }}>
                    Acting as Delegate for {viewedEmployee.full_name}
                  </span>
                )}
              </div>

              {/* Delegate Selector Dropdown */}
              {(currentUser.role === 'Root Admin' || employees.some(e => e.reporting_officers?.includes(currentUser?.full_name))) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Filing For:</span>
                  <select 
                    className="form-control" 
                    value={viewedEmployeeId} 
                    onChange={(e) => setViewedEmployeeId(e.target.value)}
                    style={{ padding: '6px 12px', fontSize: '13px', minWidth: '200px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
                  >
                    <option value={currentUser.id} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Myself ({currentUser.full_name})</option>
                    {employees
                      .filter(emp => currentUser.role === 'Root Admin' || (emp.reporting_officers && emp.reporting_officers.includes(currentUser.full_name)))
                      .filter(emp => emp.id !== currentUser.id)
                      .filter(emp => currentUser.role === 'Root Admin' || !emp.is_hidden)
                      .map(emp => (
                        <option key={emp.id} value={emp.id} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                          {emp.full_name} ({emp.designation})
                        </option>
                      ))
                    }
                  </select>
                </div>
              )}
              <div className="calendar-month-nav">
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '6px 12px', opacity: isPrevDisabled() ? 0.4 : 1, cursor: isPrevDisabled() ? 'not-allowed' : 'pointer' }}
                  disabled={isPrevDisabled()}
                  onClick={() => {
                    if (currentMonth === 1) { setCurrentMonth(12); setCurrentYear(currentYear - 1); }
                    else { setCurrentMonth(currentMonth - 1); }
                  }}
                >
                  <ChevronLeft size={16} />
                </button>
                
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: '700', minWidth: '120px', textAlign: 'center' }}>
                  {new Date(currentYear, currentMonth - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>

                <button className="btn btn-secondary" style={{ padding: '6px 12px' }} onClick={() => {
                  if (currentMonth === 12) { setCurrentMonth(1); setCurrentYear(currentYear + 1); }
                  else { setCurrentMonth(currentMonth + 1); }
                }}><ChevronRight size={16} /></button>
              </div>
            </div>
            
            <div className="calendar-days-header">
              <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
            </div>
            
            <div className="calendar-grid">
              {cells}
            </div>
          </div>
        </div>

        {/* Right Column - Leaves Summary & Balance Panel */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h4 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-blue)' }}>
              <Clock size={18} /> Month Summary
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '15px' }}>
              Leaves and duties taken in {new Date(currentYear, currentMonth - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.
            </p>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
              <div style={{ flex: 1, background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', padding: '10px', textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Present Days</span>
                <strong style={{ fontSize: '18px', color: 'var(--accent-teal)' }}>{presentDaysThisMonth} Days</strong>
              </div>
              <div style={{ flex: 1, background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', padding: '10px', textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Working Days</span>
                <strong style={{ fontSize: '18px', color: 'var(--text-primary)' }}>{totalWorkingDaysThisMonth} Days</strong>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Calculate dynamic leave tallies */}
              {(() => {
                const clLimit = balance.cl_limit;
                const mlLimit = balance.ml_limit;
                const elLimit = balance.el_limit;
                const slLimit = balance.sl_limit;

                // Monthly taken leaves
                const clTakenThisMonth = counts.CL + counts.FH * 0.5 + counts.SH * 0.5;
                const mlTakenThisMonth = counts.ML;
                const elTakenThisMonth = counts.EL;
                const slTakenThisMonth = counts.SL;

                let lopCLThisMonth = 0;
                let lopMLThisMonth = 0;
                let lopELThisMonth = 0;
                let lopSLThisMonth = 0;

                if (isMonthlyReset) {
                  lopCLThisMonth = Math.max(0, clTakenThisMonth - clLimit);
                  lopMLThisMonth = Math.max(0, mlTakenThisMonth - mlLimit);
                  lopELThisMonth = Math.max(0, elTakenThisMonth - elLimit);
                  lopSLThisMonth = Math.max(0, slTakenThisMonth - slLimit);
                } else {
                  lopCLThisMonth = Math.min(clTakenThisMonth, Math.max(0, clTaken - clLimit));
                  lopMLThisMonth = Math.min(mlTakenThisMonth, Math.max(0, mlTaken - mlLimit));
                  lopELThisMonth = Math.min(elTakenThisMonth, Math.max(0, elTaken - elLimit));
                  lopSLThisMonth = Math.min(slTakenThisMonth, Math.max(0, slTaken - slLimit));
                }

                const totalLOPThisMonth = lopCLThisMonth + lopMLThisMonth + lopELThisMonth + lopSLThisMonth;

                const paidCLShown = Math.max(0, (counts.CL + counts.FH * 0.5 + counts.SH * 0.5) - lopCLThisMonth);
                const paidMLShown = Math.max(0, counts.ML - lopMLThisMonth);
                const paidELShown = Math.max(0, counts.EL - lopELThisMonth);
                const paidSLShown = Math.max(0, counts.SL - lopSLThisMonth);

                const leaveTypes = [
                  { label: 'Casual Leave (CL)', count: paidCLShown, class: 'CL' },
                  { label: 'Medical Leave (ML)', count: paidMLShown, class: 'ML' },
                  { label: 'Earned Leave (EL)', count: paidELShown, class: 'EL' },
                  { label: 'Special Leave (SL)', count: paidSLShown, class: 'SL' },
                  { label: 'Weekly Off (WO)', count: counts.WO, class: 'WO' },
                  { label: 'Outdoor Duty (OD)', count: counts.OD, class: 'OD' },
                  { label: 'Tour (TR)', count: counts.TR, class: 'TR' },
                  { label: 'Tour Off (TO)', count: counts.TO, class: 'TO' },
                  { label: 'Compensatory Off (CO)', count: counts.CO, class: 'CO' },
                ];

                const activeLeaves = leaveTypes.filter(l => l.count > 0);

                if (activeLeaves.length === 0 && totalLOPThisMonth === 0) {
                  return (
                    <div style={{ textAlign: 'center', padding: '15px', border: '1px dashed var(--glass-border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', fontSize: '12px' }}>
                      No leaves or duties filed for this month.
                    </div>
                  );
                }

                const myMonthlyEarnedCOffs = cOffCredits.filter(c => c.employee_id === viewedEmployeeIdVal && c.date_worked.startsWith(monthStr));

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {activeLeaves.map(leave => (
                      <div key={leave.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)' }}>
                        <span style={{ fontSize: '13px', fontWeight: '500' }}>{leave.label}</span>
                        <span className={`badge-status ${leave.class}`} style={{ scale: '0.9', padding: '4px 10px' }}>
                          {leave.count} {leave.count === 1 ? 'Day' : 'Days'}
                        </span>
                      </div>
                    ))}
                    {totalLOPThisMonth > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-sm)' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--accent-rose)' }}>Loss of Pay (LOP)</span>
                        <span className="badge-status A" style={{ scale: '0.9', padding: '4px 10px', background: 'var(--accent-rose)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                          {totalLOPThisMonth} {totalLOPThisMonth === 1 ? 'Day' : 'Days'}
                        </span>
                      </div>
                    )}
                    {viewedEmployee.co_eligible && myMonthlyEarnedCOffs.length > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.35)', borderRadius: 'var(--radius-sm)' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--accent-amber)' }}>C-Off Earned (This Month)</span>
                        <span className="badge-status CO" style={{ scale: '0.9', padding: '4px 10px', background: 'var(--accent-amber)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                          {myMonthlyEarnedCOffs.length} {myMonthlyEarnedCOffs.length === 1 ? 'Credit' : 'Credits'}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
            <h4 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-teal)' }}>
              <Calendar size={18} /> Remaining Balances
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '15px' }}>
              Your entitled leave balances.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {/* CL Balance */}
              {balance.cl_eligible && (
                <div className="leave-progress-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-primary)' }}>Casual Leave (CL)</span>
                    <span style={{ color: 'var(--accent-teal)', fontWeight: '600' }}>{balance.cl_balance} / {balance.cl_limit} Days</span>
                  </div>
                  <div className="leave-progress-bar" style={{ height: '6px' }}>
                    <div className="leave-progress-bar-fill cl" style={{ width: `${(balance.cl_balance / Math.max(balance.cl_limit, 1)) * 100}%`, height: '100%' }}></div>
                  </div>
                </div>
              )}

              {/* ML Balance */}
              {balance.ml_eligible && (
                <div className="leave-progress-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-primary)' }}>Medical Leave (ML)</span>
                    <span style={{ color: 'var(--accent-teal)', fontWeight: '600' }}>{balance.ml_balance} / {balance.ml_limit} Days</span>
                  </div>
                  <div className="leave-progress-bar" style={{ height: '6px' }}>
                    <div className="leave-progress-bar-fill ml" style={{ width: `${(balance.ml_balance / Math.max(balance.ml_limit, 1)) * 100}%`, height: '100%' }}></div>
                  </div>
                </div>
              )}

              {/* EL Balance */}
              {balance.el_eligible && (
                <div className="leave-progress-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-primary)' }}>Earned Leave (EL)</span>
                    <span style={{ color: 'var(--accent-teal)', fontWeight: '600' }}>{balance.el_balance} / {balance.el_limit} Days</span>
                  </div>
                  <div className="leave-progress-bar" style={{ height: '6px' }}>
                    <div className="leave-progress-bar-fill el" style={{ width: `${(balance.el_balance / Math.max(balance.el_limit, 1)) * 100}%`, height: '100%' }}></div>
                  </div>
                </div>
              )}

              {/* SL Balance */}
              {balance.sl_eligible && (
                <div className="leave-progress-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-primary)' }}>Special Leave (SL)</span>
                    <span style={{ color: 'var(--accent-teal)', fontWeight: '600' }}>{balance.sl_balance} / {balance.sl_limit} Days</span>
                  </div>
                  <div className="leave-progress-bar" style={{ height: '6px' }}>
                    <div className="leave-progress-bar-fill sl" style={{ width: `${(balance.sl_balance / Math.max(balance.sl_limit, 1)) * 100}%`, height: '100%' }}></div>
                  </div>
                </div>
              )}

              {/* CO Balance progress bar for eligible employees */}
              {viewedEmployee.co_eligible && (() => {
                const yearStr = String(currentYear);
                const coEarnedCount = cOffCredits.filter(c => c.employee_id === viewedEmployeeIdVal && c.date_worked.startsWith(yearStr)).length;
                const coLimit = viewedEmployee.co_limit ?? 15;
                return (
                  <div className="leave-progress-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-primary)' }}>Compensatory Off (CO)</span>
                      <span style={{ color: 'var(--accent-teal)', fontWeight: '600' }}>{coBalance} Available</span>
                    </div>
                    <div className="leave-progress-bar" style={{ height: '6px' }}>
                      <div className="leave-progress-bar-fill co" style={{ width: `${(coBalance / Math.max(coLimit, 1)) * 100}%`, height: '100%', background: 'var(--accent-amber)' }}></div>
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px', textAlign: 'right' }}>
                      Yearly Allowance: {coEarnedCount} / {coLimit} Earned
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* C-Off Registry Details for eligible employees */}
          {viewedEmployee.co_eligible && (
            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
              <h4 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber)' }}>
                <Award size={18} /> Earned C-Off Registry
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '15px' }}>
                Earned Compensatory Off credits (valid for 3 months).
              </p>
              {cOffCredits.filter(c => c.employee_id === viewedEmployeeIdVal).length === 0 ? (
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', padding: '10px', border: '1px dashed var(--glass-border)', borderRadius: 'var(--radius-sm)' }}>
                  No compensatory off credits earned yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto', paddingRight: '5px' }}>
                  {cOffCredits.filter(c => c.employee_id === viewedEmployeeIdVal).map(c => (
                    <div key={c.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '8px 10px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', fontSize: '11px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Worked: {c.date_worked}</span>
                        <span className={`badge-status ${c.status === 'Available' ? 'P' : c.status === 'Used' ? 'WO' : 'A'}`} style={{ scale: '0.8', margin: 0, padding: '2px 6px' }}>
                          {c.status}
                        </span>
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '10px' }}>{c.remarks}</div>
                      {c.status === 'Available' && (
                        <div style={{ color: 'var(--accent-rose)', fontSize: '10px', fontWeight: '500' }}>Expires: {c.expiry_date}</div>
                      )}
                      {c.status === 'Used' && c.used_date && (
                        <div style={{ color: 'var(--accent-emerald)', fontSize: '10px', fontWeight: '500' }}>Used on: {c.used_date}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '20px', marginTop: '10px' }}>
            <button 
              className="btn btn-secondary" 
              style={{ 
                width: '100%', 
                padding: '10px 16px', 
                backgroundColor: 'var(--accent-purple)', 
                borderColor: 'var(--accent-purple)', 
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }} 
              onClick={() => {
                setLeaveFormEmp(viewedEmployee);
                setLeaveFormType('Casual Leave (CL)');
                setLeaveFormFrom('');
                setLeaveFormTo('');
                setLeaveFormTotalDays('1');
                setLeaveFormReason('');
                setLeaveFormAddress(viewedEmployee.address || '');
                setLeaveFormPhone(viewedEmployee.mobile_number || '');
                setLeaveFormAppDate(new Date().toISOString().split('T')[0]);
                setShowLeaveFormModal(true);
              }}
            >
              <Calendar size={16} /> Print Leave Form (Malayalam)
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderEmployeeMaster = () => {
    const filtered = employees
      .filter(emp => currentUser.role === 'Root Admin' || !emp.is_hidden)
      .filter(
        emp => emp.full_name.toLowerCase().includes(employeeSearch.toLowerCase()) || 
               emp.employee_number.toLowerCase().includes(employeeSearch.toLowerCase()) ||
               emp.designation.toLowerCase().includes(employeeSearch.toLowerCase())
      );

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div className="search-bar-row" style={{ flexGrow: 1, margin: 0 }}>
            <div className="form-group" style={{ flexGrow: 1, margin: 0, position: 'relative' }}>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search staff by Name, Employee Number or Designation..."
                value={employeeSearch}
                onChange={e => setEmployeeSearch(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
            </div>
          </div>
          {currentUser.role === 'Root Admin' && (
            <button className="btn btn-primary" onClick={openNewEmployeeModal}>
              <UserPlus size={16} /> Register New Employee
            </button>
          )}
        </div>

        <div className="glass-card">
          <div className="table-container" style={{ margin: 0 }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Emp No</th>
                  <th>Full Name</th>
                  <th>Designation</th>
                  <th>Employment Type</th>
                  {currentUser.role === 'Root Admin' && <th>Role</th>}
                  <th>Details</th>
                  {currentUser.role === 'Root Admin' && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map(emp => (
                  <tr key={emp.id} style={{ opacity: emp.is_archived ? 0.5 : 1 }}>
                    <td>
                      <span className={`status-dot ${emp.is_archived ? 'archived' : 'active'}`}></span>
                      {emp.is_archived ? 'Archived' : 'Active'}
                    </td>
                    <td><strong>{emp.employee_number}</strong></td>
                    <td>{emp.full_name}</td>
                    <td>{emp.designation}</td>
                    <td>{emp.employment_category}</td>
                    {currentUser.role === 'Root Admin' && <td><span className="badge-status TR" style={{ scale: '0.9' }}>{emp.role}</span></td>}
                    <td>
                      <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => handleOpenDetailsModal(emp)}>
                        <Eye size={14} /> View Details
                      </button>
                    </td>
                    {currentUser.role === 'Root Admin' && (
                      <td style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-success" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => openEditEmployeeModal(emp)}><Edit3 size={14} /> Edit</button>
                        <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => {
                          setPwTargetEmp(emp);
                          setPwTargetNew('');
                          setShowResetPasswordModal(true);
                        }}><RotateCcw size={14} /> Password</button>
                        <button className={`btn ${emp.is_archived ? 'btn-success' : 'btn-danger'}`} style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => handleArchiveToggle(emp)}>
                          {emp.is_archived ? 'Restore' : 'Archive'}
                        </button>
                        <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '12px', background: '#dc2626', borderColor: '#dc2626' }} onClick={() => handleDeleteEmployee(emp)}>
                          <Trash size={14} /> Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderHolidayAndLockConfig = () => {
    return (
      <div className="dashboard-layout">
        {/* Holiday Management Card */}
        <div className="dashboard-column">
          <div className="glass-card">
            <h3 style={{ marginBottom: '15px' }}>System Holiday Roster</h3>
            <form onSubmit={handleAddHoliday} style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flexGrow: 1, margin: 0 }}>
                <input type="date" className="form-control" value={newHolidayDate} onChange={e => setNewHolidayDate(e.target.value)} required />
              </div>
              <div className="form-group" style={{ flexGrow: 2, margin: 0 }}>
                <input type="text" className="form-control" placeholder="Holiday Title (e.g. Onam Festival)..." value={newHolidayName} onChange={e => setNewHolidayName(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary"><Plus size={16} /> Add Holiday</button>
            </form>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Holiday Title</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {holidays.map(hol => (
                    <tr key={hol.id}>
                      <td><strong>{hol.date}</strong></td>
                      <td>{hol.name}</td>
                      <td>
                        <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => handleRemoveHoliday(hol.id, hol.name)}><Trash size={14} /> Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Lock Controls */}
        <div className="dashboard-column">
          <div className="glass-card">
            <h3 style={{ marginBottom: '15px' }}>Attendance Monthly Locks</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
              Locking an attendance month prevents regular employees from modifying status codes.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {[0, 1, 2].map(offset => {
                const today = new Date();
                const d = new Date(today.getFullYear(), today.getMonth() - offset, 1);
                const y = d.getFullYear();
                const m = d.getMonth() + 1;
                const lockRecord = locks.find(l => l.year === y && l.month === m);
                const isLocked = lockRecord ? lockRecord.is_locked : false;

                return (
                  <div key={offset} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.01)' }}>
                    <div>
                      <strong style={{ fontFamily: 'var(--font-display)' }}>
                        {d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </strong>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {isLocked ? `Locked` : 'Open'}
                      </div>
                    </div>
                    
                    <button 
                      className={`btn ${isLocked ? 'btn-secondary' : 'btn-danger'}`} 
                      style={{ padding: '6px 16px', fontSize: '12px' }}
                      onClick={() => handleToggleMonthLock(y, m, isLocked)}
                    >
                      {isLocked ? 'Unlock Sheet' : 'Lock Sheet'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderReportsPanel = () => {
    const isRepOfficerRole = employees.some(e => e.reporting_officers?.includes(currentUser?.full_name));

    const visibleEmployees = (currentUser.role === 'Root Admin'
      ? employees.filter(emp => !emp.is_archived)
      : isRepOfficerRole
        ? employees.filter(emp => emp.id === currentUser.id || (emp.reporting_officers && emp.reporting_officers.includes(currentUser.full_name) && !emp.is_archived))
        : employees.filter(emp => emp.id === currentUser.id)
    ).filter(emp => currentUser.role === 'Root Admin' || !emp.is_hidden || emp.id === currentUser.id);

    const visibleWagers = visibleEmployees.filter(emp => emp.employment_category === 'Daily Wage');
    const showDailyWagePanel = currentUser.role === 'Root Admin' || isRepOfficerRole || (currentUser.employment_category === 'Daily Wage');

    return (
      <div className="dashboard-layout">
        {/* Date Selector Row */}
        <div className="glass-card" style={{ gridColumn: '1 / -1', display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '0px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flexGrow: 1 }}>
            <span style={{ fontWeight: '600', fontSize: '16px', color: 'var(--text-primary)' }}>Select Reporting Period</span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Choose a month and year to generate all reports below</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <select 
              className="form-control" 
              value={reportMonth} 
              onChange={e => setReportMonth(parseInt(e.target.value))}
              style={{ width: '160px', padding: '8px 12px' }}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>
                  {new Date(2025, m - 1).toLocaleDateString('en-US', { month: 'long' })}
                </option>
              ))}
            </select>
            <select 
              className="form-control" 
              value={reportYear} 
              onChange={e => setReportYear(parseInt(e.target.value))}
              style={{ width: '110px', padding: '8px 12px' }}
            >
              {Array.from({ length: 6 }, (_, i) => 2025 + i).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '15px' }}>
            {currentUser.role === 'Employee' ? 'My Monthly Sheets' : 'Monthly Sheets'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
            {currentUser.role === 'Employee' 
              ? 'Generate and export your fully detailed monthly sheet as formatted PDF.'
              : 'Generate and export fully detailed monthly sheets as formatted PDFs.'
            }
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {visibleEmployees.map(emp => {
              const isDailyWage = emp.employment_category === 'Daily Wage';
              return (
                <div key={emp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)' }}>
                  <div>
                    <strong>{emp.full_name}</strong> ({emp.employee_number})
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{emp.designation} | {emp.employment_category}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {isDailyWage && (
                      <button className="btn btn-success" style={{ padding: '8px 16px' }} onClick={() => printDailyWageReportSingle(emp, reportYear, reportMonth)}>
                        <FileText size={16} /> Print Salary Sheet
                      </button>
                    )}
                    <button className="btn btn-secondary" style={{ padding: '8px 16px' }} onClick={() => printEmployeeAttendance(emp, reportYear, reportMonth)}>
                      <FileText size={16} /> Print Attendance Sheet
                    </button>
                  </div>
                </div>
              );
            })}
            {visibleEmployees.length === 0 && (
              <div style={{ textTransform: 'uppercase', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
                No active employee records found
              </div>
            )}
          </div>
        </div>

        {showDailyWagePanel ? (
          <div className="glass-card">
            <h3 style={{ marginBottom: '15px' }}>Daily Wage Salary Sheets (Batch)</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
              Select Daily Wage earners in the order you want to print/export their salary sheets. Click a name to add it to the print sequence.
            </p>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '6px 12px', fontSize: '12px' }}
                onClick={() => setSelectedBatchWagers(visibleWagers.map(w => w.id))}
              >
                Select All
              </button>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '6px 12px', fontSize: '12px' }}
                onClick={() => setSelectedBatchWagers([])}
              >
                Clear Selection
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto', paddingRight: '5px', marginBottom: '20px', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)', padding: '10px' }}>
              {visibleWagers.map(emp => {
                const selIdx = selectedBatchWagers.indexOf(emp.id);
                const isSelected = selIdx !== -1;
                return (
                  <div 
                    key={emp.id} 
                    onClick={() => {
                      if (isSelected) {
                        setSelectedBatchWagers(selectedBatchWagers.filter(id => id !== emp.id));
                      } else {
                        setSelectedBatchWagers([...selectedBatchWagers, emp.id]);
                      }
                    }}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      padding: '10px 12px', 
                      border: '1px solid var(--glass-border)', 
                      borderRadius: 'var(--radius-sm)', 
                      background: isSelected ? 'rgba(13, 148, 136, 0.08)' : 'rgba(255, 255, 255, 0.01)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '18px',
                        height: '18px',
                        border: '2px solid var(--accent-teal)',
                        borderRadius: '3px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isSelected ? 'var(--accent-teal)' : 'transparent'
                      }}>
                        {isSelected && <Check size={12} style={{ color: '#ffffff' }} />}
                      </div>
                      <div>
                        <strong>{emp.full_name}</strong>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {emp.designation} | Wage: ₹{emp.daily_wage_rate}/day
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <span style={{ 
                        background: 'var(--accent-teal)', 
                        color: '#ffffff', 
                        fontSize: '11px', 
                        fontWeight: 'bold', 
                        padding: '2px 8px', 
                        borderRadius: '12px' 
                      }}>
                        Order #{selIdx + 1}
                      </span>
                    )}
                  </div>
                );
              })}
              {visibleWagers.length === 0 && (
                <div style={{ textTransform: 'uppercase', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', padding: '15px' }}>
                  No Daily Wage employees found
                </div>
              )}
            </div>

            <button 
              className="btn btn-success" 
              style={{ width: '100%', padding: '10px' }}
              disabled={selectedBatchWagers.length === 0}
              onClick={() => printDailyWageReport(reportYear, reportMonth)}
            >
              <FileText size={16} /> Print Selected Salary Sheets ({selectedBatchWagers.length})
            </button>
          </div>
        ) : (
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '30px' }}>
            <Compass size={48} style={{ color: 'var(--accent-blue)', marginBottom: '15px', opacity: 0.8 }} />
            <h4 style={{ marginBottom: '10px' }}>KSC Self Service</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '280px' }}>
              Use the month selector above to choose any period and download your official, verified attendance sheet instantly.
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderAuditLogs = () => {
    const filteredLogs = auditLogs.filter(log => 
      log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.actor_name.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.details?.toLowerCase().includes(auditSearch.toLowerCase())
    );

    return (
      <div className="glass-card">
        <div className="search-bar-row">
          <div className="form-group" style={{ flexGrow: 1, margin: 0, position: 'relative' }}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search audit trail by Action, Operator, or Details..." 
              value={auditSearch}
              onChange={e => setAuditSearch(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Operator</th>
                <th>Action</th>
                <th>Details</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(log => (
                <tr key={log.id}>
                  <td><strong>{log.actor_name}</strong></td>
                  <td><span className="badge-status CL" style={{ scale: '0.9' }}>{log.action}</span></td>
                  <td>{log.details || '-'}</td>
                  <td>{new Date(log.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ==========================================
  // MAIN BODY RENDER CONTEXTS
  // ==========================================
  if (!currentUser) {
    return (
      <div className="login-container">
        <div className="glass-card login-card" style={{ padding: '30px', maxWidth: '420px' }}>
          <div className="login-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '25px', textAlign: 'left' }}>
            <Compass size={42} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
            <div>
              <h1 style={{ fontSize: '22px', margin: 0, fontWeight: '800', background: 'linear-gradient(135deg, var(--text-primary) 40%, var(--text-secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Kerala Science City</h1>
              <p style={{ margin: '2px 0 0 0', color: 'var(--text-secondary)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Staff Portal & HRM System</p>
            </div>
          </div>

          {showLoginSettings && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HardDrive size={14} style={{ color: isDemoMode ? 'var(--accent-amber)' : 'var(--accent-emerald)' }} />
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Database Mode:</span>
                  <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{isDemoMode ? 'Simulated Local Mode' : 'Supabase Production'}</div>
                </div>
              </div>
              {isSupabaseConfigured && (
                <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '10px', height: 'auto' }} onClick={() => setIsDemoMode(!isDemoMode)}>
                  Use {isDemoMode ? 'Supabase' : 'Local Demo'}
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {loginError && (
              <div className="notification-banner warning" style={{ margin: '0 0 5px 0', padding: '8px 12px' }}>
                <AlertCircle size={16} />
                <span style={{ fontSize: '12px' }}>{loginError}</span>
              </div>
            )}

            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '5px' }}>Username OR Employee Number</label>
              <input type="text" className="form-control" style={{ height: '38px', fontSize: '13px' }} placeholder="e.g. root_admin or KSC033" value={loginIdentifier} onChange={e => setLoginIdentifier(e.target.value)} required />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '5px' }}>Password</label>
              <input type="password" className="form-control" style={{ height: '38px', fontSize: '13px' }} placeholder="••••••••" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '38px', marginTop: '10px', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Attribution Footer */}
          <div style={{ textAlign: 'center', fontSize: '10px', color: 'var(--text-muted)', marginTop: '25px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px' }}>
            Conceived, Designed & Developed by <br />
            <span style={{ color: 'var(--text-secondary)', fontWeight: '600', display: 'block', margin: '3px 0 6px 0' }}>Sujith B Kallara, Scientific Officer, KSSTM</span>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '6px' }}>
              <a href="mailto:sujithbkallara@gmail.com" title="Email" style={{ color: 'var(--text-muted)', transition: 'color 0.2s', display: 'inline-flex', alignItems: 'center' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-blue)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                <Mail size={13} />
              </a>
              <a href="tel:+919995856425" title="Call" style={{ color: 'var(--text-muted)', transition: 'color 0.2s', display: 'inline-flex', alignItems: 'center' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-emerald)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                <Phone size={13} />
              </a>
              <a href="https://wa.me/919995856425" target="_blank" rel="noopener noreferrer" title="WhatsApp" style={{ color: 'var(--text-muted)', transition: 'color 0.2s', display: 'inline-flex', alignItems: 'center' }} onMouseEnter={e => e.currentTarget.style.color = '#25D366'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                <WhatsAppIcon size={12} />
              </a>
            </div>
          </div>

          {/* Subtle Switcher Toggle Settings Icon */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button 
              type="button" 
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', opacity: 0.3 }}
              onClick={() => setShowLoginSettings(!showLoginSettings)}
              title="Database Mode Settings"
            >
              <Settings size={13} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const eligibility = isDemoMode
    ? {
        cl: currentUser.cl_eligible ?? true,
        ml: currentUser.ml_eligible ?? true,
        el: currentUser.el_eligible ?? true,
        sl: currentUser.sl_eligible ?? true,
        wo: currentUser.weekly_off_eligible ?? true,
        od: currentUser.od_eligible ?? true,
        tr: currentUser.tr_eligible ?? true,
        to: currentUser.to_eligible ?? true,
        co: currentUser.co_eligible ?? true,
        fh: currentUser.fh_eligible ?? true,
        sh: currentUser.sh_eligible ?? true,
        a: currentUser.a_eligible ?? true,
        p: currentUser.p_eligible ?? true
      }
    : {
        cl: leaveBalances[currentUser.id]?.cl_eligible ?? true,
        ml: leaveBalances[currentUser.id]?.ml_eligible ?? true,
        el: leaveBalances[currentUser.id]?.el_eligible ?? true,
        sl: leaveBalances[currentUser.id]?.sl_eligible ?? true,
        wo: currentUser.weekly_off_eligible ?? true,
        od: currentUser.od_eligible ?? true,
        tr: currentUser.tr_eligible ?? true,
        to: currentUser.to_eligible ?? true,
        co: currentUser.co_eligible ?? true,
        fh: currentUser.fh_eligible ?? true,
        sh: currentUser.sh_eligible ?? true,
        a: currentUser.a_eligible ?? true,
        p: currentUser.p_eligible ?? true
      };

  const currentOfficers = empForm.reporting_officers.split(',').map(s => s.trim()).filter(Boolean);
  
  const handleRepOfficerChange = (index, value) => {
    const officers = [...currentOfficers];
    if (value === '') {
      officers.splice(index, 1);
    } else {
      officers[index] = value;
    }
    // Keep only unique and max 3
    const uniqueOfficers = Array.from(new Set(officers)).slice(0, 3);
    setEmpForm({
      ...empForm,
      reporting_officers: uniqueOfficers.join(', ')
    });
  };

  const renderOfficerSelect = (index, label) => {
    const currentVal = currentOfficers[index] || '';
    // Check if currentVal is an employee or custom text
    const exists = employees.some(e => e.full_name === currentVal);
    return (
      <div className="form-group" style={{ marginBottom: '8px' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>{label}</span>
        <select 
          className="form-control"
          value={currentVal}
          onChange={e => handleRepOfficerChange(index, e.target.value)}
          style={{ padding: '4px 8px', fontSize: '12px', height: '30px' }}
        >
          <option value="">-- None --</option>
          {currentVal && !exists && (
            <option value={currentVal}>{currentVal}</option>
          )}
          {employees
            .filter(e => !editingEmployee || e.id !== editingEmployee.id)
            .map(e => (
              <option key={e.id} value={e.full_name}>
                {e.full_name} ({e.designation})
              </option>
            ))
          }
        </select>
      </div>
    );
  };

  return (
    <>
      <div className="app-container">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <Compass size={28} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
          <h1 style={{ fontSize: '15px', lineHeight: '1.2', fontWeight: '800', flexGrow: 1 }}>Kerala Science City HRMS</h1>
          <button className="mobile-close-btn" onClick={() => setIsSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <ul className="sidebar-menu">
          <li>
            <button className={`sidebar-item-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }}>
              <Calendar size={18} /> Dashboard
            </button>
          </li>
          <li>
            <button className={`sidebar-item-btn ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => { setActiveTab('attendance'); setIsSidebarOpen(false); }}>
              <Clock size={18} /> My Attendance
            </button>
          </li>
          <li>
            <button className={`sidebar-item-btn ${activeTab === 'employees' ? 'active' : ''}`} onClick={() => { setActiveTab('employees'); setIsSidebarOpen(false); }}>
              <Users size={18} /> {currentUser.role === 'Root Admin' ? 'Staff Master' : 'Staff Register'}
            </button>
          </li>
          {currentUser.role === 'Root Admin' && (
            <li>
              <button className={`sidebar-item-btn ${activeTab === 'holidays' ? 'active' : ''}`} onClick={() => { setActiveTab('holidays'); setIsSidebarOpen(false); }}>
                <Settings size={18} /> Holiday Config
              </button>
            </li>
          )}
          <li>
            <button className={`sidebar-item-btn ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => { setActiveTab('reports'); setIsSidebarOpen(false); }}>
              <FileText size={18} /> Reports Board
            </button>
          </li>
          {currentUser.role === 'Root Admin' && (
            <li>
              <button className={`sidebar-item-btn ${activeTab === 'audits' ? 'active' : ''}`} onClick={() => { setActiveTab('audits'); setIsSidebarOpen(false); }}>
                <Shield size={18} /> Audit Trails
              </button>
            </li>
          )}
        </ul>

        {/* User Card */}
        <div className="sidebar-user">
          <div className="sidebar-user-info" style={{ cursor: 'pointer' }} onClick={() => { openProfileEditModal(); setIsSidebarOpen(false); }}>
            <div className="sidebar-user-avatar">{currentUser.full_name.charAt(0)}</div>
            <div className="sidebar-user-details" style={{ flexGrow: 1 }}>
              <span className="sidebar-user-name" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600', color: 'var(--text-primary)' }}>
                {currentUser.full_name} <Edit3 size={12} style={{ color: 'var(--text-secondary)' }} />
              </span>
              <span className="sidebar-user-role" style={{ fontSize: '11px', display: 'block', marginTop: '2px', color: 'var(--text-secondary)' }}>
                {currentUser.designation}
                {currentUser.role === 'Root Admin' ? ' (root)' : currentUser.role === 'Admin' ? ' (admin)' : ''}
              </span>
            </div>
          </div>
          <button className="sidebar-item-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />} {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button className="sidebar-item-btn" onClick={() => { setShowPasswordModal(true); setIsSidebarOpen(false); }}>
            <Key size={16} /> Change Password
          </button>
          <button className="btn btn-danger" style={{ width: '100%', marginTop: '10px' }} onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>

          {/* Credits Footer */}
          <div style={{ textAlign: 'center', fontSize: '10px', color: 'var(--text-muted)', marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
            Conceived, Designed & Developed by <br />
            <span style={{ color: 'var(--text-secondary)', fontWeight: '600', display: 'block', margin: '3px 0 6px 0' }}>Sujith B Kallara, Scientific Officer, KSSTM</span>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '6px' }}>
              <a href="mailto:sujithbkallara@gmail.com" title="Email" style={{ color: 'var(--text-muted)', transition: 'color 0.2s', display: 'inline-flex', alignItems: 'center' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-blue)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                <Mail size={13} />
              </a>
              <a href="tel:+919995856425" title="Call" style={{ color: 'var(--text-muted)', transition: 'color 0.2s', display: 'inline-flex', alignItems: 'center' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-emerald)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                <Phone size={13} />
              </a>
              <a href="https://wa.me/919995856425" target="_blank" rel="noopener noreferrer" title="WhatsApp" style={{ color: 'var(--text-muted)', transition: 'color 0.2s', display: 'inline-flex', alignItems: 'center' }} onMouseEnter={e => e.currentTarget.style.color = '#25D366'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                <WhatsAppIcon size={12} />
              </a>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <main className="main-workspace">
        <header className="workspace-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="mobile-toggle-btn" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="workspace-title-section">
              <h2>
                {activeTab === 'employees' 
                  ? (currentUser.role === 'Root Admin' ? 'Staff Master' : 'Staff Register') 
                  : (activeTab.charAt(0).toUpperCase() + activeTab.slice(1))
                } Control Hub
              </h2>
              <p>Kerala Science City Staff Registry Panel</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Mode: <span style={{ color: isDemoMode ? 'var(--accent-amber)' : 'var(--accent-emerald)', fontWeight: 'bold' }}>{isDemoMode ? 'Demo Sandbox' : 'Live Supabase'}</span>
            </span>
            <span style={{ fontSize: '13px', fontWeight: '500' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </header>

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '40px 0' }}>
            <Clock size={36} className="animate-spin" style={{ color: 'var(--accent-blue)' }} />
          </div>
        )}

        {!loading && activeTab === 'dashboard' && renderDashboard()}
        {!loading && activeTab === 'attendance' && renderAttendanceCalendar()}
        {!loading && activeTab === 'employees' && renderEmployeeMaster()}
        {!loading && activeTab === 'holidays' && currentUser.role === 'Root Admin' && renderHolidayAndLockConfig()}
        {!loading && activeTab === 'reports' && renderReportsPanel()}
        {!loading && activeTab === 'audits' && renderAuditLogs()}
      </main>

      {/* ==========================================
          MODALS & OVERLAY INTERACTIVE WIDGETS
          ========================================== */}
      
      {/* Malayalam Leave Request Form Modal */}
      {showLeaveFormModal && leaveFormEmp && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3>അവധി അപേക്ഷ ഫോറം (Leave Request Form)</h3>
              <button className="modal-close-btn" onClick={() => setShowLeaveFormModal(false)}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '5px' }}>ജീവനക്കാരന്റെ പേര് (Name)</label>
                <input type="text" className="form-control" value={leaveFormEmp.full_name} readOnly />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '5px' }}>തസ്തിക (Designation)</label>
                <input type="text" className="form-control" value={leaveFormEmp.designation} readOnly />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '5px' }}>അവധിയുടെ സ്വഭാവം (Nature of Leave)</label>
                <select className="form-control" value={leaveFormType} onChange={e => setLeaveFormType(e.target.value)}>
                  <option value="Casual Leave (CL)">Casual Leave (CL)</option>
                  <option value="Earned Leave (EL)">Earned Leave (EL)</option>
                  <option value="Sick Leave (SL)">Sick Leave (SL)</option>
                  <option value="Medical Leave (ML)">Medical Leave (ML)</option>
                  <option value="Compensatory Off (CO)">Compensatory Off (CO)</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div className="form-group" style={{ flex: 1, margin: 0 }}>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '5px' }}>മുതൽ (From Date)</label>
                  <input type="date" className="form-control" value={leaveFormFrom} onChange={e => setLeaveFormFrom(e.target.value)} required />
                </div>
                <div className="form-group" style={{ flex: 1, margin: 0 }}>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '5px' }}>വരെ (To Date)</label>
                  <input type="date" className="form-control" value={leaveFormTo} onChange={e => setLeaveFormTo(e.target.value)} required />
                </div>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '5px' }}>അപേക്ഷിച്ച ദിവസങ്ങൾ (Total Days)</label>
                <input type="number" className="form-control" value={leaveFormTotalDays} onChange={e => setLeaveFormTotalDays(e.target.value)} required />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '5px' }}>അവധിയുടെ കാരണം (Reason)</label>
                <textarea className="form-control" rows="3" value={leaveFormReason} onChange={e => setLeaveFormReason(e.target.value)} placeholder="അവധിക്കുള്ള കാരണം ഇവിടെ എഴുതുക..." required></textarea>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '5px' }}>തീയതി (Application Date)</label>
                <input type="date" className="form-control" value={leaveFormAppDate} onChange={e => setLeaveFormAppDate(e.target.value)} />
              </div>
              <button 
                type="button" 
                className="btn btn-primary" 
                style={{ width: '100%', height: '40px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                onClick={() => {
                  if (!leaveFormFrom || !leaveFormTo || !leaveFormTotalDays || !leaveFormReason) {
                    alert("Please fill in all required fields (From Date, To Date, Total Days, and Reason).");
                    return;
                  }
                  setPrintData({
                    type: 'leave_request',
                    employee: leaveFormEmp,
                    form: {
                      leaveFormType,
                      leaveFormFrom,
                      leaveFormTo,
                      leaveFormTotalDays,
                      leaveFormReason,
                      leaveFormAddress,
                      leaveFormPhone,
                      leaveFormAppDate
                    }
                  });
                  setShowLeaveFormModal(false);
                }}
              >
                അപേക്ഷാ ഫോം പ്രിന്റ് ചെയ്യുക (Print Leave Form)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. Request Attendance/Leave Modal (Remarks not mandatory!) */}
      {showRequestModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Date Events & Attendance Filing</h3>
              <button className="modal-close-btn" onClick={() => setShowRequestModal(false)}>✕</button>
            </div>

            {calendarDateEvents.length > 0 && (
              <div style={{ marginBottom: '20px', padding: '12px', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 'var(--radius-sm)', background: 'rgba(245, 158, 11, 0.05)' }}>
                <strong style={{ color: 'var(--accent-amber)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}><AlertCircle size={16} /> Calendar Events on this Date:</strong>
                <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', fontSize: '12px', color: 'var(--text-primary)' }}>
                  {calendarDateEvents.map((ev, idx) => (
                    <li key={idx} style={{ marginTop: '2px' }}>{ev}</li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleRequestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="form-group">
                <label>Filing Date</label>
                <input type="date" className="form-control" value={reqDate} readOnly />
              </div>

              <div className="form-group">
                <label>Attendance/Leave Status Code</label>
                <select className="form-control" value={reqStatus} onChange={e => setReqStatus(e.target.value)}>
                  {eligibility.p && <option value="P">P - Present</option>}
                  {eligibility.cl && <option value="CL">CL - Casual Leave</option>}
                  {eligibility.ml && <option value="ML">ML - Medical Leave</option>}
                  {eligibility.el && <option value="EL">EL - Earned Leave</option>}
                  {eligibility.sl && <option value="SL">SL - Special Leave</option>}
                  {eligibility.cl && eligibility.fh && <option value="FH">FH - First Half Leave (0.5 day)</option>}
                  {eligibility.cl && eligibility.sh && <option value="SH">SH - Second Half Leave (0.5 day)</option>}
                  {eligibility.wo && <option value="WO">WO - Weekly Off</option>}
                  {eligibility.od && <option value="OD">OD - Outdoor Duty</option>}
                  {eligibility.tr && <option value="TR">TR - Tour (Official)</option>}
                  {eligibility.to && <option value="TO">TO - Tour Off</option>}
                  {eligibility.co && <option value="CO">CO - Compensatory Off</option>}
                  {eligibility.a && <option value="A">A - Absent</option>}
                </select>
              </div>

              {reqStatus === 'CO' && (
                <div className="form-group">
                  <label>Select Earned C-Off to Redeem</label>
                  {cOffCredits.filter(c => c.employee_id === viewedEmployee.id && (c.status === 'Available' || c.id === selectedCOffCreditId)).length === 0 ? (
                    <div style={{ color: 'var(--accent-rose)', fontSize: '12px', marginTop: '5px', fontWeight: '600' }}>
                      ⚠️ You have no available earned C-Off credits to redeem!
                    </div>
                  ) : (
                    <select 
                      className="form-control" 
                      value={selectedCOffCreditId} 
                      onChange={e => setSelectedCOffCreditId(e.target.value)}
                      required
                    >
                      <option value="">-- Choose C-Off Credit --</option>
                      {cOffCredits.filter(c => c.employee_id === viewedEmployee.id && (c.status === 'Available' || c.id === selectedCOffCreditId)).map(c => (
                        <option key={c.id} value={c.id}>
                          Worked on {c.date_worked} (Expires: {c.expiry_date}){c.id === selectedCOffCreditId ? ' [Selected]' : ''}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              <div className="form-group">
                <label>Remarks / Notes (Optional)</label>
                <textarea className="form-control" rows="3" placeholder="State reason, tour details or comments (optional)..." value={reqRemarks} onChange={e => setReqRemarks(e.target.value)}></textarea>
              </div>

              <button type="submit" className="btn btn-primary">Save Entry Status</button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Self Password change Modal */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Change Your Account Password</h3>
              <button className="modal-close-btn" onClick={() => setShowPasswordModal(false)}>✕</button>
            </div>

            <form onSubmit={handleOwnPasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="form-group">
                <label>Current Password</label>
                <input type="password" className="form-control" placeholder="••••••••" value={pwOld} onChange={e => setPwOld(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input type="password" className="form-control" placeholder="Min 6 characters..." value={pwNew} onChange={e => setPwNew(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input type="password" className="form-control" placeholder="••••••••" value={pwConfirm} onChange={e => setPwConfirm(e.target.value)} required />
              </div>

              <button type="submit" className="btn btn-primary">Update Password</button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Admin Reset Password Modal */}
      {showResetPasswordModal && pwTargetEmp && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Reset Password for {pwTargetEmp.full_name}</h3>
              <button className="modal-close-btn" onClick={() => setShowResetPasswordModal(false)}>✕</button>
            </div>

            <form onSubmit={handleAdminResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                You are performing an override reset. No database employee entries will be lost.
              </div>
              <div className="form-group">
                <label>Temporary Password</label>
                <input type="password" className="form-control" placeholder="Min 6 characters..." value={pwTargetNew} onChange={e => setPwTargetNew(e.target.value)} required />
              </div>

              <button type="submit" className="btn btn-danger">Confirm Override Reset</button>
            </form>
          </div>
        </div>
      )}

      {/* 4. Employee Add/Edit Modal (Username editable!) */}
      {showEmployeeModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '850px' }}>
            <div className="modal-header">
              <h3>{editingEmployee ? 'Edit Employee Details' : 'Register New Employee Master'}</h3>
              <button className="modal-close-btn" onClick={() => setShowEmployeeModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveEmployee} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <h4 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '5px' }}>Account Settings</h4>
              <div className="grid-2">
                <div className="form-group">
                  <label>Employee Number (Unique)</label>
                  <input type="text" className="form-control" value={empForm.employee_number} onChange={e => setEmpForm({...empForm, employee_number: e.target.value})} required disabled={!!editingEmployee && currentUser.role !== 'Root Admin'} />
                </div>
                <div className="form-group">
                  <label>Username (Unique login key - Editable by Admin!)</label>
                  <input type="text" className="form-control" value={empForm.username} onChange={e => setEmpForm({...empForm, username: e.target.value})} required />
                </div>
              </div>

              {!editingEmployee && (
                <div className="form-group">
                  <label>Temporary Password</label>
                  <input type="password" className="form-control" value={empForm.password} onChange={e => setEmpForm({...empForm, password: e.target.value})} required />
                </div>
              )}

              <h4 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '5px' }}>Basic Information</h4>
              <div className="grid-2">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" className="form-control" value={empForm.full_name} onChange={e => setEmpForm({...empForm, full_name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Designation</label>
                  <input type="text" className="form-control" value={empForm.designation} onChange={e => setEmpForm({...empForm, designation: e.target.value})} required />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Employment Type</label>
                  <select className="form-control" value={empForm.employment_category} onChange={e => setEmpForm({...empForm, employment_category: e.target.value})}>
                    <option value="Permanent">Permanent</option>
                    <option value="Daily Wage">Daily Wage</option>
                    <option value="Contract">Contract</option>
                    <option value="Apprentice">Apprentice</option>
                    <option value="Intern">Intern</option>
                    <option value="Deputation">Deputation</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Functional Role</label>
                  <select className="form-control" value={empForm.functional_role} onChange={e => setEmpForm({...empForm, functional_role: e.target.value})}>
                    <option value="Administration">Administration</option>
                    <option value="Technical">Technical</option>
                    <option value="Education">Education</option>
                    <option value="Security">Security</option>
                    <option value="Housekeeping">Housekeeping</option>
                    <option value="Garden">Garden</option>
                    <option value="Civil">Civil</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Finance">Finance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontWeight: '600' }}>Reporting Officers (Max 3)</label>
                  {renderOfficerSelect(0, "Primary Reporting Officer")}
                  {renderOfficerSelect(1, "Secondary Reporting Officer (Optional)")}
                  {renderOfficerSelect(2, "Tertiary Reporting Officer (Optional)")}
                </div>
                <div className="form-group">
                  <label>Additional Charge Responsibilities (Comma separated)</label>
                  <input type="text" className="form-control" placeholder="e.g. Technical In-Charge, Admin In-Charge" value={empForm.additional_charges} onChange={e => setEmpForm({...empForm, additional_charges: e.target.value})} />
                </div>
              </div>

              <h4 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '5px' }}>Optional Profile Details (Can be completed by Employee later)</h4>
              <div className="grid-2">
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input type="date" className="form-control" value={empForm.dob} onChange={e => setEmpForm({...empForm, dob: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Joining Date</label>
                  <input type="date" className="form-control" value={empForm.joining_date} onChange={e => setEmpForm({...empForm, joining_date: e.target.value})} />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Gender</label>
                  <select className="form-control" value={empForm.gender} onChange={e => setEmpForm({...empForm, gender: e.target.value})}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Blood Group</label>
                  <input type="text" className="form-control" placeholder="e.g. O+Pos" value={empForm.blood_group} onChange={e => setEmpForm({...empForm, blood_group: e.target.value})} />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Mobile Number</label>
                  <input type="text" className="form-control" value={empForm.mobile_number} onChange={e => setEmpForm({...empForm, mobile_number: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Contact Email Address</label>
                  <input type="email" className="form-control" placeholder="e.g. name@example.com" value={empForm.email} onChange={e => setEmpForm({...empForm, email: e.target.value})} />
                </div>
              </div>

              <div className="form-group">
                <label>Educational Qualification</label>
                <input type="text" className="form-control" value={empForm.educational_qualification} onChange={e => setEmpForm({...empForm, educational_qualification: e.target.value})} />
              </div>

              <div className="form-group">
                <label>Home Address</label>
                <textarea className="form-control" rows="2" value={empForm.address} onChange={e => setEmpForm({...empForm, address: e.target.value})}></textarea>
              </div>

              <div className="grid-3">
                <div className="form-group">
                  <label>Emergency Contact Name</label>
                  <input type="text" className="form-control" value={empForm.emergency_name} onChange={e => setEmpForm({...empForm, emergency_name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Emergency Relation</label>
                  <input type="text" className="form-control" value={empForm.emergency_relation} onChange={e => setEmpForm({...empForm, emergency_relation: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Emergency Phone</label>
                  <input type="text" className="form-control" value={empForm.emergency_phone} onChange={e => setEmpForm({...empForm, emergency_phone: e.target.value})} />
                </div>
              </div>

              <h4 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '5px' }}>Leave Configuration & Permissions (Editable for all employees including Daily Wage!)</h4>
              <div className="grid-2">
                <div className="form-group">
                  <label>Portal Privilege Role</label>
                  <select className="form-control" value={empForm.role} onChange={e => setEmpForm({...empForm, role: e.target.value})}>
                    <option value="Employee">Employee (Self-Service)</option>
                    <option value="Admin">Admin (Approve & Manage)</option>
                    <option value="Root Admin">Root Admin (All Privileges)</option>
                  </select>
                </div>
                
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '15px' }}>
                    <input type="checkbox" id="chkWeeklyOff" checked={empForm.weekly_off_eligible} onChange={e => setEmpForm({...empForm, weekly_off_eligible: e.target.checked})} />
                    <label htmlFor="chkWeeklyOff" style={{ margin: 0, cursor: 'pointer' }}>Eligible for Weekly Off</label>
                  </div>
                  {currentUser.role === 'Root Admin' && (
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '15px' }}>
                      <input type="checkbox" id="chkIsHidden" checked={empForm.is_hidden || false} onChange={e => setEmpForm({...empForm, is_hidden: e.target.checked})} />
                      <label htmlFor="chkIsHidden" style={{ margin: 0, cursor: 'pointer', fontWeight: 'bold', color: 'var(--accent-amber)' }}>Hide from Directory & Reports</label>
                    </div>
                  )}
                </div>
              </div>

              {empForm.weekly_off_eligible && (
                <div className="form-group">
                  <label>Weekly Off Selection (Sunday forces Working Monday)</label>
                  <select className="form-control" value={empForm.weekly_off_day} onChange={e => setEmpForm({...empForm, weekly_off_day: e.target.value})}>
                    <option value="Monday">Monday (Default Weekly Off)</option>
                    <option value="Sunday">Sunday (Alternative Weekly Off)</option>
                  </select>
                </div>
              )}

              {empForm.employment_category === 'Daily Wage' && (
                <div className="grid-2">
                  <div className="form-group">
                    <label>Daily Wage Rate (in ₹)</label>
                    <input type="number" className="form-control" value={empForm.daily_wage_rate} onChange={e => setEmpForm({...empForm, daily_wage_rate: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Maximum Working Days per Month</label>
                    <input type="number" className="form-control" value={empForm.max_working_days} onChange={e => setEmpForm({...empForm, max_working_days: e.target.value})} required />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <strong style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Configure Leave Eligibility & Limits (Applies to Permanent & DW alike!):</strong>
                
                {/* CL Config */}
                <div className="grid-4">
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input type="checkbox" id="chkCLEligible" checked={empForm.cl_eligible} onChange={e => setEmpForm({...empForm, cl_eligible: e.target.checked})} />
                    <label htmlFor="chkCLEligible" style={{ margin: 0 }}>Casual Leave (CL)</label>
                  </div>
                  {empForm.cl_eligible && (
                    <>
                      <select className="form-control" value={empForm.cl_limit_type} onChange={e => setEmpForm({...empForm, cl_limit_type: e.target.value})}>
                        <option value="Annual">Annual (Yearly)</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                      <input type="number" className="form-control" placeholder="Limit" value={empForm.cl_limit} onChange={e => setEmpForm({...empForm, cl_limit: e.target.value})} />
                    </>
                  )}
                </div>

                {/* ML Config */}
                <div className="grid-4">
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input type="checkbox" id="chkMLEligible" checked={empForm.ml_eligible} onChange={e => setEmpForm({...empForm, ml_eligible: e.target.checked})} />
                    <label htmlFor="chkMLEligible" style={{ margin: 0 }}>Medical Leave (ML)</label>
                  </div>
                  {empForm.ml_eligible && (
                    <>
                      <select className="form-control" value={empForm.ml_limit_type} onChange={e => setEmpForm({...empForm, ml_limit_type: e.target.value})}>
                        <option value="Annual">Annual (Yearly)</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                      <input type="number" className="form-control" placeholder="Limit" value={empForm.ml_limit} onChange={e => setEmpForm({...empForm, ml_limit: e.target.value})} />
                    </>
                  )}
                </div>

                {/* EL Config */}
                <div className="grid-4">
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input type="checkbox" id="chkELEligible" checked={empForm.el_eligible} onChange={e => setEmpForm({...empForm, el_eligible: e.target.checked})} />
                    <label htmlFor="chkELEligible" style={{ margin: 0 }}>Earned Leave (EL)</label>
                  </div>
                  {empForm.el_eligible && (
                    <>
                      <select className="form-control" value={empForm.el_limit_type} onChange={e => setEmpForm({...empForm, el_limit_type: e.target.value})}>
                        <option value="Annual">Annual (Yearly)</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                      <input type="number" className="form-control" placeholder="Limit" value={empForm.el_limit} onChange={e => setEmpForm({...empForm, el_limit: e.target.value})} />
                    </>
                  )}
                </div>

                {/* SL Config */}
                <div className="grid-4">
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input type="checkbox" id="chkSLEligible" checked={empForm.sl_eligible} onChange={e => setEmpForm({...empForm, sl_eligible: e.target.checked})} />
                    <label htmlFor="chkSLEligible" style={{ margin: 0 }}>Special Leave (SL)</label>
                  </div>
                  {empForm.sl_eligible && (
                    <>
                      <select className="form-control" value={empForm.sl_limit_type} onChange={e => setEmpForm({...empForm, sl_limit_type: e.target.value})}>
                        <option value="Annual">Annual (Yearly)</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                      <input type="number" className="form-control" placeholder="Limit" value={empForm.sl_limit} onChange={e => setEmpForm({...empForm, sl_limit: e.target.value})} />
                    </>
                  )}
                </div>

                {/* Additional Status Eligibilities */}
                <strong style={{ fontSize: '13px', color: 'var(--text-secondary)', borderTop: '1px solid var(--glass-border)', paddingTop: '15px', marginTop: '10px', display: 'block' }}>Configure Status Eligibility (Gated Filing Option Controls)</strong>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginTop: '5px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input type="checkbox" id="chkPEligible" checked={empForm.p_eligible} onChange={e => setEmpForm({...empForm, p_eligible: e.target.checked})} />
                    <label htmlFor="chkPEligible" style={{ margin: 0, cursor: 'pointer' }}>Present (P)</label>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input type="checkbox" id="chkFHEligible" checked={empForm.fh_eligible} onChange={e => setEmpForm({...empForm, fh_eligible: e.target.checked})} />
                    <label htmlFor="chkFHEligible" style={{ margin: 0, cursor: 'pointer' }}>First Half (FH)</label>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input type="checkbox" id="chkSHEligible" checked={empForm.sh_eligible} onChange={e => setEmpForm({...empForm, sh_eligible: e.target.checked})} />
                    <label htmlFor="chkSHEligible" style={{ margin: 0, cursor: 'pointer' }}>Second Half (SH)</label>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input type="checkbox" id="chkODEligible" checked={empForm.od_eligible} onChange={e => setEmpForm({...empForm, od_eligible: e.target.checked})} />
                    <label htmlFor="chkODEligible" style={{ margin: 0, cursor: 'pointer' }}>Outdoor Duty (OD)</label>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input type="checkbox" id="chkTREligible" checked={empForm.tr_eligible} onChange={e => setEmpForm({...empForm, tr_eligible: e.target.checked})} />
                    <label htmlFor="chkTREligible" style={{ margin: 0, cursor: 'pointer' }}>Tour (TR)</label>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input type="checkbox" id="chkTOEligible" checked={empForm.to_eligible} onChange={e => setEmpForm({...empForm, to_eligible: e.target.checked})} />
                    <label htmlFor="chkTOEligible" style={{ margin: 0, cursor: 'pointer' }}>Tour Off (TO)</label>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input type="checkbox" id="chkCOEligible" checked={empForm.co_eligible} onChange={e => setEmpForm({...empForm, co_eligible: e.target.checked})} />
                      <label htmlFor="chkCOEligible" style={{ margin: 0, cursor: 'pointer' }}>Comp Off (CO)</label>
                    </div>
                    {empForm.co_eligible && (
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center', marginLeft: '5px' }}>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Limit:</span>
                        <input type="number" className="form-control" style={{ width: '55px', padding: '2px 4px', height: '22px', fontSize: '11px', margin: 0 }} value={empForm.co_limit} onChange={e => setEmpForm({...empForm, co_limit: e.target.value})} required />
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input type="checkbox" id="chkAEligible" checked={empForm.a_eligible} onChange={e => setEmpForm({...empForm, a_eligible: e.target.checked})} />
                    <label htmlFor="chkAEligible" style={{ margin: 0, cursor: 'pointer' }}>Absent (A)</label>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
                {editingEmployee ? 'Save Changes' : 'Register Account'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. Employee Self-Service Profile Edit Modal (Verification workflow!) */}
      {showProfileEditModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h3>Edit Your Profile (Verification Required)</h3>
              <button className="modal-close-btn" onClick={() => setShowProfileEditModal(false)}>✕</button>
            </div>
            
            <div style={{ marginBottom: '20px', padding: '12px', border: '1px solid rgba(37, 99, 235, 0.3)', borderRadius: 'var(--radius-sm)', background: 'rgba(37, 99, 235, 0.05)', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <strong>Profile Security Notice:</strong> Modifications submitted here will not be updated instantly. They are held in a secure verification queue and become official once approved by the Admin.
            </div>

            <form onSubmit={handleProfileUpdateRequestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="grid-2">
                <div className="form-group">
                  <label>Mobile Number</label>
                  <input type="text" className="form-control" value={profileEditForm.mobile_number} onChange={e => setProfileEditForm({...profileEditForm, mobile_number: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Contact Email Address</label>
                  <input type="email" className="form-control" value={profileEditForm.email} onChange={e => setProfileEditForm({...profileEditForm, email: e.target.value})} required />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Gender</label>
                  <select className="form-control" value={profileEditForm.gender} onChange={e => setProfileEditForm({...profileEditForm, gender: e.target.value})}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Blood Group</label>
                  <input type="text" className="form-control" value={profileEditForm.blood_group} onChange={e => setProfileEditForm({...profileEditForm, blood_group: e.target.value})} required />
                </div>
              </div>

              <div className="form-group">
                <label>Home Address</label>
                <textarea className="form-control" rows="2" value={profileEditForm.address} onChange={e => setProfileEditForm({...profileEditForm, address: e.target.value})} required></textarea>
              </div>

              <div className="form-group">
                <label>Educational Qualification</label>
                <input type="text" className="form-control" value={profileEditForm.educational_qualification} onChange={e => setProfileEditForm({...profileEditForm, educational_qualification: e.target.value})} required />
              </div>

              <div className="grid-3">
                <div className="form-group">
                  <label>Emergency Contact Name</label>
                  <input type="text" className="form-control" value={profileEditForm.emergency_name} onChange={e => setProfileEditForm({...profileEditForm, emergency_name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Emergency Relation</label>
                  <input type="text" className="form-control" value={profileEditForm.emergency_relation} onChange={e => setProfileEditForm({...profileEditForm, emergency_relation: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Emergency Phone</label>
                  <input type="text" className="form-control" value={profileEditForm.emergency_phone} onChange={e => setProfileEditForm({...profileEditForm, emergency_phone: e.target.value})} required />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>Submit proposed modifications for Verification</button>
            </form>
          </div>
        </div>
      )}

      {/* 6. Employee Directory Details Modal (Glassmorphic design with Directory Privacy!) */}
      {showDetailsModal && selectedEmpDetails && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '750px', background: 'rgba(28, 31, 38, 0.95)', backdropFilter: 'blur(20px)', border: '1px solid var(--glass-border)' }}>
            <div className="modal-header">
              <h3>Employee Directory Profile</h3>
              <button className="modal-close-btn" onClick={() => setShowDetailsModal(false)}>✕</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', paddingBottom: '15px', borderBottom: '1px solid var(--glass-border)' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', color: '#ffffff' }}>
                  {selectedEmpDetails.full_name?.charAt(0)}
                </div>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>{selectedEmpDetails.full_name}</h2>
                  <span style={{ fontSize: '13px', color: 'var(--accent-blue)' }}>{selectedEmpDetails.designation}</span>
                </div>
              </div>

              <div>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '10px', fontSize: '14px', borderLeft: '3px solid var(--accent-blue)', paddingLeft: '8px' }}>Public Directory Info</h4>
                <div className="grid-3">
                  <div style={{ padding: '10px', background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Employee Number</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{selectedEmpDetails.employee_number}</span>
                  </div>
                  <div style={{ padding: '10px', background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Mobile Number</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{selectedEmpDetails.mobile_number || 'Not provided'}</span>
                  </div>
                  <div style={{ padding: '10px', background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Email Address</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', wordBreak: 'break-all' }}>{selectedEmpDetails.email || 'Not provided'}</span>
                  </div>
                  <div style={{ padding: '10px', background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Functional Role</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{selectedEmpDetails.functional_role}</span>
                  </div>
                  <div style={{ padding: '10px', background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Reporting Officers</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {selectedEmpDetails.reporting_officers?.join(', ') || 'None'}
                    </span>
                  </div>
                  <div style={{ padding: '10px', background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Additional Charge</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {selectedEmpDetails.additional_charges?.join(', ') || 'None'}
                    </span>
                  </div>
                  <div style={{ padding: '10px', background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Blood Group</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{selectedEmpDetails.blood_group || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '10px', fontSize: '14px', borderLeft: '3px solid var(--accent-amber)', paddingLeft: '8px' }}>Private Contact & Administrative Info</h4>
                <div className="grid-3">
                  {(() => {
                    const isAuthorized = currentUser.role === 'Root Admin' || currentUser.role === 'Admin' || currentUser.id === selectedEmpDetails.id || (selectedEmpDetails.reporting_officers && selectedEmpDetails.reporting_officers.includes(currentUser.full_name));
                    const renderSensitiveField = (label, value) => (
                      <div key={label} style={{ padding: '10px', background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)' }}>
                        <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>{label}</span>
                        <span style={{ fontSize: '13px', fontWeight: '500', color: isAuthorized ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                          {isAuthorized ? (value || 'Not provided') : '🔒 Hidden for Privacy'}
                        </span>
                      </div>
                    );
                    return (
                      <>
                        {renderSensitiveField("Employment Type", selectedEmpDetails.employment_category)}
                        {renderSensitiveField("Date of Birth", selectedEmpDetails.dob)}
                        {renderSensitiveField("Joining Date", selectedEmpDetails.joining_date)}
                        {renderSensitiveField("Educational Qualification", selectedEmpDetails.educational_qualification)}
                        {renderSensitiveField("Home Address", selectedEmpDetails.address)}
                        {renderSensitiveField("Emergency Contact Name", selectedEmpDetails.emergency_contact?.name)}
                        {renderSensitiveField("Emergency Relation", selectedEmpDetails.emergency_contact?.relation)}
                        {renderSensitiveField("Emergency Phone", selectedEmpDetails.emergency_contact?.phone)}
                        {renderSensitiveField("Daily Wage Rate", selectedEmpDetails.daily_wage_rate > 0 ? `₹${selectedEmpDetails.daily_wage_rate}` : 'N/A')}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>

      {printData && printData.type === 'attendance' && (
        <div className="print-report-container">
          <div className="header" style={{ textAlign: 'center', marginBottom: '15px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0 }}>KERALA STATE SCIENCE AND TECHNOLOGY MUSEUM</h1>
            <h2 style={{ fontSize: '18px', margin: '4px 0 0 0', fontWeight: 'bold' }}>KERALA SCIENCE CITY</h2>
            <h3 style={{ fontSize: '16px', margin: '6px 0 0 0', textDecoration: 'underline', fontWeight: 'bold' }}>Monthly Employee Attendance Report</h3>
            <p style={{ fontSize: '16px', margin: '6px 0 0 0', fontWeight: 'bold' }}>
              {new Date(printData.year, printData.month - 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="divider"></div>
          
          <div className="daily-wage-fields" style={{ marginBottom: '15px', fontSize: '12pt' }}>
            <div style={{ display: 'flex', marginBottom: '4px' }}>
              <span style={{ width: '220px', fontWeight: 'bold' }}>Employee Name</span>
              <span style={{ width: '20px', textAlign: 'center' }}>:</span>
              <span style={{ flexGrow: 1 }}>{printData.targetEmp.full_name}</span>
            </div>
            <div style={{ display: 'flex', marginBottom: '4px' }}>
              <span style={{ width: '220px', fontWeight: 'bold' }}>Employee Number</span>
              <span style={{ width: '20px', textAlign: 'center' }}>:</span>
              <span style={{ flexGrow: 1 }}>{printData.targetEmp.employee_number}</span>
            </div>
            <div style={{ display: 'flex', marginBottom: '4px' }}>
              <span style={{ width: '220px', fontWeight: 'bold' }}>Employment Type</span>
              <span style={{ width: '20px', textAlign: 'center' }}>:</span>
              <span style={{ flexGrow: 1 }}>{printData.targetEmp.employment_category}</span>
            </div>
            <div style={{ display: 'flex', marginBottom: '4px' }}>
              <span style={{ width: '220px', fontWeight: 'bold' }}>Designation</span>
              <span style={{ width: '20px', textAlign: 'center' }}>:</span>
              <span style={{ flexGrow: 1 }}>{printData.targetEmp.designation}</span>
            </div>
            <div style={{ display: 'flex', marginBottom: '4px' }}>
              <span style={{ width: '220px', fontWeight: 'bold' }}>Date of Joining</span>
              <span style={{ width: '20px', textAlign: 'center' }}>:</span>
              <span style={{ flexGrow: 1 }}>{formatDateDMY(printData.targetEmp.joining_date)}</span>
            </div>
          </div>

          <table className="daily-wage-print-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12pt', marginBottom: '15px' }}>
            <thead>
              <tr>
                <th style={{ width: '6%', textAlign: 'center', border: '1px solid #000000', padding: '4px', fontSize: '12pt' }}></th>
                <th style={{ width: '12%', textAlign: 'center', border: '1px solid #000000', padding: '4px', fontSize: '12pt' }}>F.N</th>
                <th style={{ width: '12%', textAlign: 'center', border: '1px solid #000000', padding: '4px', fontSize: '12pt' }}>A.N</th>
                <th style={{ width: '6%', textAlign: 'center', border: '1px solid #000000', padding: '4px', fontSize: '12pt' }}></th>
                <th style={{ width: '12%', textAlign: 'center', border: '1px solid #000000', padding: '4px', fontSize: '12pt' }}>F.N</th>
                <th style={{ width: '12%', textAlign: 'center', border: '1px solid #000000', padding: '4px', fontSize: '12pt' }}>A.N</th>
                <th style={{ width: '6%', textAlign: 'center', border: '1px solid #000000', padding: '4px', fontSize: '12pt' }}></th>
                <th style={{ width: '12%', textAlign: 'center', border: '1px solid #000000', padding: '4px', fontSize: '12pt' }}>F.N</th>
                <th style={{ width: '12%', textAlign: 'center', border: '1px solid #000000', padding: '4px', fontSize: '12pt' }}>A.N</th>
              </tr>
            </thead>
            <tbody>
              {renderDailyWageTableRows(printData.rows).map((row, idx) => (
                <tr key={idx}>
                  <td style={{ textAlign: 'center', fontWeight: 'bold', border: '1px solid #000000', padding: '4px', backgroundColor: '#f3f4f6', fontSize: '12pt' }}>{row.d1}</td>
                  <td style={{ ...getAttStatusStyle(row.fn1), textAlign: 'center', border: '1px solid #000000', padding: '4px', fontSize: '12pt' }}>{row.fn1}</td>
                  <td style={{ ...getAttStatusStyle(row.an1), textAlign: 'center', border: '1px solid #000000', padding: '4px', fontSize: '12pt' }}>{row.an1}</td>
                  <td style={{ textAlign: 'center', fontWeight: 'bold', border: '1px solid #000000', padding: '4px', backgroundColor: '#f3f4f6', fontSize: '12pt' }}>{row.d2}</td>
                  <td style={{ ...getAttStatusStyle(row.fn2), textAlign: 'center', border: '1px solid #000000', padding: '4px', fontSize: '12pt' }}>{row.fn2}</td>
                  <td style={{ ...getAttStatusStyle(row.an2), textAlign: 'center', border: '1px solid #000000', padding: '4px', fontSize: '12pt' }}>{row.an2}</td>
                  <td style={{ textAlign: 'center', fontWeight: 'bold', border: '1px solid #000000', padding: '4px', backgroundColor: '#f3f4f6', fontSize: '12pt' }}>{row.d3}</td>
                  <td style={{ ...getAttStatusStyle(row.fn3), textAlign: 'center', border: '1px solid #000000', padding: '4px', fontSize: '12pt' }}>{row.fn3}</td>
                  <td style={{ ...getAttStatusStyle(row.an3), textAlign: 'center', border: '1px solid #000000', padding: '4px', fontSize: '12pt' }}>{row.an3}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="summary-section" style={{ borderTop: '1px solid #000000', paddingTop: '10px', fontSize: '12pt' }}>
            <strong style={{ display: 'block', fontSize: '14pt', marginBottom: '6px' }}>Summary</strong>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <div>Total Leaves Taken: <strong>{printData.calculatedLeavesCount}</strong></div>
                <div>Loss of Pays (LOP): <strong>{printData.lopCount}</strong></div>
              </div>
              <div>
                {printData.cl_eligible && (
                  <div>Remaining Casual Leave: <strong>{printData.cl_balance}</strong></div>
                )}
                {printData.el_eligible && (
                  <div>Remaining Earned Leave: <strong>{printData.el_balance}</strong></div>
                )}
                {printData.sl_eligible && (
                  <div>Remaining Sick Leave: <strong>{printData.sl_balance}</strong></div>
                )}
                {printData.ml_eligible && printData.targetEmp.gender === 'Female' && (
                  <div>Remaining Maternity Leave: <strong>{printData.ml_balance}</strong></div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {printData && printData.type === 'wages' && (
        <div className="print-report-container">
          <div className="page-number-header" style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '11pt', marginBottom: '10px' }}>1</div>
          <div className="header" style={{ textAlign: 'center', marginBottom: '15px' }}>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '0.5px', margin: 0 }}>KERALA STATE SCIENCE AND TECHNOLOGY MUSEUM</h1>
            <h2 style={{ fontSize: '13px', margin: '2px 0 0 0', fontWeight: 'normal' }}>VIKAS BHAVAN. P.O, THIRUVANANTHAPURAM</h2>
            <h3 style={{ fontSize: '13px', margin: '4px 0 0 0', fontWeight: 'bold', textDecoration: 'underline' }}>ATTENDANCE SHEET OF INCUMBENTS ENGAGED ON DAILY WAGES</h3>
            <p style={{ fontSize: '10px', margin: '4px 0 0 0', fontStyle: 'italic' }}>
              These incumbents will have no claim whatsoever for any other benefits other than the wages for work done.
            </p>
          </div>
          
          <div className="daily-wage-fields" style={{ marginBottom: '12px', fontSize: '11pt' }}>
            <div style={{ display: 'flex', marginBottom: '4px' }}>
              <span style={{ width: '220px', fontWeight: 'bold' }}>Name and address of person</span>
              <span style={{ width: '20px', textAlign: 'center' }}>:</span>
              <span style={{ flexGrow: 1 }}>
                <strong>{printData.report.employee.full_name}</strong>
                {printData.report.employee.address && (
                  <div style={{ fontWeight: 'normal', marginTop: '2px', whiteSpace: 'pre-wrap', lineHeight: '1.3' }}>
                    {printData.report.employee.address}
                  </div>
                )}
              </span>
            </div>
            <div style={{ display: 'flex', marginBottom: '4px' }}>
              <span style={{ width: '220px', fontWeight: 'bold' }}>Educational Qualification</span>
              <span style={{ width: '20px', textAlign: 'center' }}>:</span>
              <span style={{ flexGrow: 1 }}>{printData.report.employee.educational_qualification || 'Not provided'}</span>
            </div>
            <div style={{ display: 'flex', marginBottom: '4px' }}>
              <span style={{ width: '220px', fontWeight: 'bold' }}>Engaged as</span>
              <span style={{ width: '20px', textAlign: 'center' }}>:</span>
              <span style={{ flexGrow: 1 }}>{printData.report.employee.designation}</span>
            </div>
            <div style={{ display: 'flex', marginBottom: '4px' }}>
              <span style={{ width: '220px', fontWeight: 'bold' }}>Rate of wages</span>
              <span style={{ width: '20px', textAlign: 'center' }}>:</span>
              <span style={{ flexGrow: 1 }}>Rs.{printData.report.rate}/- (Max. Rs. {printData.report.rate * printData.report.maxDays}/-)</span>
            </div>
            <div style={{ display: 'flex', marginBottom: '4px' }}>
              <span style={{ width: '220px', fontWeight: 'bold' }}>Month and year</span>
              <span style={{ width: '20px', textAlign: 'center' }}>:</span>
              <span style={{ flexGrow: 1 }}>
                {new Date(printData.year, printData.month - 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>

          <table className="daily-wage-print-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11pt', marginBottom: '10px' }}>
            <thead>
              <tr>
                <th style={{ width: '6%', textAlign: 'center', border: '1px solid #000000', padding: '3px', fontSize: '11pt' }}></th>
                <th style={{ width: '12%', textAlign: 'center', border: '1px solid #000000', padding: '3px', fontSize: '11pt' }}>F.N</th>
                <th style={{ width: '12%', textAlign: 'center', border: '1px solid #000000', padding: '3px', fontSize: '11pt' }}>A.N</th>
                <th style={{ width: '6%', textAlign: 'center', border: '1px solid #000000', padding: '3px', fontSize: '11pt' }}></th>
                <th style={{ width: '12%', textAlign: 'center', border: '1px solid #000000', padding: '3px', fontSize: '11pt' }}>F.N</th>
                <th style={{ width: '12%', textAlign: 'center', border: '1px solid #000000', padding: '3px', fontSize: '11pt' }}>A.N</th>
                <th style={{ width: '6%', textAlign: 'center', border: '1px solid #000000', padding: '3px', fontSize: '11pt' }}></th>
                <th style={{ width: '12%', textAlign: 'center', border: '1px solid #000000', padding: '3px', fontSize: '11pt' }}>F.N</th>
                <th style={{ width: '12%', textAlign: 'center', border: '1px solid #000000', padding: '3px', fontSize: '11pt' }}>A.N</th>
              </tr>
            </thead>
            <tbody>
              {renderDailyWageTableRows(printData.report.dayRows).map((row, idx) => (
                <tr key={idx}>
                  <td style={{ textAlign: 'center', fontWeight: 'bold', border: '1px solid #000000', padding: '3px', backgroundColor: '#f3f4f6', fontSize: '11pt' }}>{row.d1}</td>
                  <td style={{ textAlign: 'center', border: '1px solid #000000', padding: '3px', fontSize: '11pt' }}>{row.fn1}</td>
                  <td style={{ textAlign: 'center', border: '1px solid #000000', padding: '3px', fontSize: '11pt' }}>{row.an1}</td>
                  <td style={{ textAlign: 'center', fontWeight: 'bold', border: '1px solid #000000', padding: '3px', backgroundColor: '#f3f4f6', fontSize: '11pt' }}>{row.d2}</td>
                  <td style={{ textAlign: 'center', border: '1px solid #000000', padding: '3px', fontSize: '11pt' }}>{row.fn2}</td>
                  <td style={{ textAlign: 'center', border: '1px solid #000000', padding: '3px', fontSize: '11pt' }}>{row.an2}</td>
                  <td style={{ textAlign: 'center', fontWeight: 'bold', border: '1px solid #000000', padding: '3px', backgroundColor: '#f3f4f6', fontSize: '11pt' }}>{row.d3}</td>
                  <td style={{ textAlign: 'center', border: '1px solid #000000', padding: '3px', fontSize: '11pt' }}>{row.fn3}</td>
                  <td style={{ textAlign: 'center', border: '1px solid #000000', padding: '3px', fontSize: '11pt' }}>{row.an3}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ fontSize: '11pt', lineHeight: '1.4', marginBottom: '12px' }}>
            <p style={{ margin: '0 0 6px 0', textAlign: 'justify' }}>
              Certified that he/she had worked for <strong>{printData.report.payableDays} days</strong> @ Rs.{printData.report.rate}/- Rs.<strong>{printData.report.totalSalary} /-</strong> (Rupees <strong>{printData.report.totalSalaryInWords} only</strong>) during the month of <strong>{new Date(printData.year, printData.month - 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</strong>. Head of Account: Salary. He/ She was engaged at Science City Kottayam as per directions.
            </p>
            <p style={{ margin: '0', fontStyle: 'italic', color: '#374151' }}>
              This is not a cash receipt. This should invariably be attached to the payment voucher when payment is made.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '25px', fontSize: '11pt' }}>
            <div style={{ width: '200px', textAlign: 'center' }}>
              <strong>Verified by</strong>
              <div style={{ minHeight: '45px' }}></div>
              <div style={{ fontSize: '11pt', fontWeight: 'bold' }}>Name & Designation</div>
            </div>
            <div style={{ width: '200px', textAlign: 'center' }}>
              <strong>Prepared</strong>
              <div style={{ minHeight: '45px' }}></div>
              <strong>ASSISTANT DIRECTOR</strong>
            </div>
          </div>
        </div>
      )}

      {printData && printData.type === 'batch-wages' && printData.reports.map((report, idx) => (
        <div key={report.employee.id} className="print-report-container print-page-break">
          <div className="page-number-header" style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '11pt', marginBottom: '10px' }}>{idx + 1}</div>
          <div className="header" style={{ textAlign: 'center', marginBottom: '15px' }}>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '0.5px', margin: 0 }}>KERALA STATE SCIENCE AND TECHNOLOGY MUSEUM</h1>
            <h2 style={{ fontSize: '13px', margin: '2px 0 0 0', fontWeight: 'normal' }}>VIKAS BHAVAN. P.O, THIRUVANANTHAPURAM</h2>
            <h3 style={{ fontSize: '13px', margin: '4px 0 0 0', fontWeight: 'bold', textDecoration: 'underline' }}>ATTENDANCE SHEET OF INCUMBENTS ENGAGED ON DAILY WAGES</h3>
            <p style={{ fontSize: '10px', margin: '4px 0 0 0', fontStyle: 'italic' }}>
              These incumbents will have no claim whatsoever for any other benefits other than the wages for work done.
            </p>
          </div>
          
          <div className="daily-wage-fields" style={{ marginBottom: '12px', fontSize: '11pt' }}>
            <div style={{ display: 'flex', marginBottom: '4px' }}>
              <span style={{ width: '220px', fontWeight: 'bold' }}>Name and address of person</span>
              <span style={{ width: '20px', textAlign: 'center' }}>:</span>
              <span style={{ flexGrow: 1 }}>
                <strong>{report.employee.full_name}</strong>
                {report.employee.address && (
                  <div style={{ fontWeight: 'normal', marginTop: '2px', whiteSpace: 'pre-wrap', lineHeight: '1.3' }}>
                    {report.employee.address}
                  </div>
                )}
              </span>
            </div>
            <div style={{ display: 'flex', marginBottom: '4px' }}>
              <span style={{ width: '220px', fontWeight: 'bold' }}>Educational Qualification</span>
              <span style={{ width: '20px', textAlign: 'center' }}>:</span>
              <span style={{ flexGrow: 1 }}>{report.employee.educational_qualification || 'Not provided'}</span>
            </div>
            <div style={{ display: 'flex', marginBottom: '4px' }}>
              <span style={{ width: '220px', fontWeight: 'bold' }}>Engaged as</span>
              <span style={{ width: '20px', textAlign: 'center' }}>:</span>
              <span style={{ flexGrow: 1 }}>{report.employee.designation}</span>
            </div>
            <div style={{ display: 'flex', marginBottom: '4px' }}>
              <span style={{ width: '220px', fontWeight: 'bold' }}>Rate of wages</span>
              <span style={{ width: '20px', textAlign: 'center' }}>:</span>
              <span style={{ flexGrow: 1 }}>Rs.{report.rate}/- (Max. Rs. {report.rate * report.maxDays}/-)</span>
            </div>
            <div style={{ display: 'flex', marginBottom: '4px' }}>
              <span style={{ width: '220px', fontWeight: 'bold' }}>Month and year</span>
              <span style={{ width: '20px', textAlign: 'center' }}>:</span>
              <span style={{ flexGrow: 1 }}>
                {new Date(printData.year, printData.month - 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>

          <table className="daily-wage-print-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11pt', marginBottom: '10px' }}>
            <thead>
              <tr>
                <th style={{ width: '6%', textAlign: 'center', border: '1px solid #000000', padding: '3px', fontSize: '11pt' }}></th>
                <th style={{ width: '12%', textAlign: 'center', border: '1px solid #000000', padding: '3px', fontSize: '11pt' }}>F.N</th>
                <th style={{ width: '12%', textAlign: 'center', border: '1px solid #000000', padding: '3px', fontSize: '11pt' }}>A.N</th>
                <th style={{ width: '6%', textAlign: 'center', border: '1px solid #000000', padding: '3px', fontSize: '11pt' }}></th>
                <th style={{ width: '12%', textAlign: 'center', border: '1px solid #000000', padding: '3px', fontSize: '11pt' }}>F.N</th>
                <th style={{ width: '12%', textAlign: 'center', border: '1px solid #000000', padding: '3px', fontSize: '11pt' }}>A.N</th>
                <th style={{ width: '6%', textAlign: 'center', border: '1px solid #000000', padding: '3px', fontSize: '11pt' }}></th>
                <th style={{ width: '12%', textAlign: 'center', border: '1px solid #000000', padding: '3px', fontSize: '11pt' }}>F.N</th>
                <th style={{ width: '12%', textAlign: 'center', border: '1px solid #000000', padding: '3px', fontSize: '11pt' }}>A.N</th>
              </tr>
            </thead>
            <tbody>
              {renderDailyWageTableRows(report.dayRows).map((row, idx) => (
                <tr key={idx}>
                  <td style={{ textAlign: 'center', fontWeight: 'bold', border: '1px solid #000000', padding: '3px', backgroundColor: '#f3f4f6', fontSize: '11pt' }}>{row.d1}</td>
                  <td style={{ textAlign: 'center', border: '1px solid #000000', padding: '3px', fontSize: '11pt' }}>{row.fn1}</td>
                  <td style={{ textAlign: 'center', border: '1px solid #000000', padding: '3px', fontSize: '11pt' }}>{row.an1}</td>
                  <td style={{ textAlign: 'center', fontWeight: 'bold', border: '1px solid #000000', padding: '3px', backgroundColor: '#f3f4f6', fontSize: '11pt' }}>{row.d2}</td>
                  <td style={{ textAlign: 'center', border: '1px solid #000000', padding: '3px', fontSize: '11pt' }}>{row.fn2}</td>
                  <td style={{ textAlign: 'center', border: '1px solid #000000', padding: '3px', fontSize: '11pt' }}>{row.an2}</td>
                  <td style={{ textAlign: 'center', fontWeight: 'bold', border: '1px solid #000000', padding: '3px', backgroundColor: '#f3f4f6', fontSize: '11pt' }}>{row.d3}</td>
                  <td style={{ textAlign: 'center', border: '1px solid #000000', padding: '3px', fontSize: '11pt' }}>{row.fn3}</td>
                  <td style={{ textAlign: 'center', border: '1px solid #000000', padding: '3px', fontSize: '11pt' }}>{row.an3}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ fontSize: '11pt', lineHeight: '1.4', marginBottom: '12px' }}>
            <p style={{ margin: '0 0 6px 0', textAlign: 'justify' }}>
              Certified that he/she had worked for <strong>{report.payableDays} days</strong> @ Rs.{report.rate}/- Rs.<strong>{report.totalSalary} /-</strong> (Rupees <strong>{report.totalSalaryInWords} only</strong>) during the month of <strong>{new Date(printData.year, printData.month - 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</strong>. Head of Account: Salary. He/ She was engaged at Science City Kottayam as per directions.
            </p>
            <p style={{ margin: '0', fontStyle: 'italic', color: '#374151' }}>
              This is not a cash receipt. This should invariably be attached to the payment voucher when payment is made.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '25px', fontSize: '11pt' }}>
            <div style={{ width: '200px', textAlign: 'center' }}>
              <strong>Verified by</strong>
              <div style={{ minHeight: '45px' }}></div>
              <div style={{ fontSize: '11pt', fontWeight: 'bold' }}>Name & Designation</div>
            </div>
            <div style={{ width: '200px', textAlign: 'center' }}>
              <strong>Prepared</strong>
              <div style={{ minHeight: '45px' }}></div>
              <strong>ASSISTANT DIRECTOR</strong>
            </div>
          </div>
        </div>
      ))}
      {/* Malayalam Leave Request Form Print Component */}
      {printData && printData.type === 'leave_request' && (
        <div className="print-report-container leave-request-print">
          <div className="title">സയൻസ് സിറ്റി കോട്ടയം</div>
          
          <div className="field-row" style={{ marginTop: '40px' }}>
            പേര് : <span className="field-dots" style={{ minWidth: '350px' }}>{printData.employee.full_name}</span>
          </div>
          
          <div className="field-row">
            ഉദ്യോഗപ്പേര് : <span className="field-dots" style={{ minWidth: '300px' }}>{printData.employee.designation}</span>
          </div>
          
          <div className="field-row" style={{ whiteSpace: 'nowrap' }}>
            അപേക്ഷിച്ച കാലയളവ് : <span className="field-dots" style={{ minWidth: '40px', textAlign: 'center' }}>{printData.form.leaveFormTotalDays}</span> (ദിവസങ്ങൾ) &nbsp;തിയതി <span className="field-dots" style={{ minWidth: '100px', textAlign: 'center' }}>{new Date(printData.form.leaveFormFrom).toLocaleDateString('en-IN')}</span> മുതൽ <span className="field-dots" style={{ minWidth: '100px', textAlign: 'center' }}>{new Date(printData.form.leaveFormTo).toLocaleDateString('en-IN')}</span> വരെ
          </div>
          
          <div className="field-row">
            അവധിയുടെ സ്വഭാവം : <span className="field-dots" style={{ minWidth: '300px' }}>{printData.form.leaveFormType}</span>
          </div>
          
          <div className="field-row">
            അവധിയുടെ കാരണം : <span className="field-dots" style={{ minWidth: '300px' }}>{printData.form.leaveFormReason}</span>
          </div>
          
          <div className="field-row" style={{ marginTop: '30px' }}>
            തിയതി : <span className="field-dots" style={{ minWidth: '150px' }}>{new Date(printData.form.leaveFormAppDate).toLocaleDateString('en-IN')}</span>
          </div>

          <div style={{ marginTop: '40px', fontSize: '11.5pt' }}>ശുപാർശ</div>
          
          <div style={{ marginTop: '50px', fontSize: '11.5pt', lineHeight: '1.8' }}>
            {/* Row 1 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>മേലധികാരിയുടെ അഭിപ്രായവും</div>
              <div style={{ textAlign: 'center', minWidth: '180px' }}>അപേക്ഷകന്റെ ഒപ്പ്</div>
            </div>
            
            {/* Row 2 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '40px' }}>
              <div>തിയതിയും / ഒപ്പും</div>
              <div style={{ flexGrow: 1, textAlign: 'center', color: '#000000' }}>അനുവദിച്ചു / നിരസിച്ചു</div>
              <div style={{ minWidth: '180px' }}></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

