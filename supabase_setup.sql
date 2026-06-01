-- Kerala Science City (KSC) - Staff Attendance, Leave & Management System
-- Supabase Database Setup Script (Execute in the Supabase SQL Editor)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. DROP TABLES & FUNCTIONS (For clean installation if needed)
-- DROP TABLE IF EXISTS public.profile_update_requests CASCADE;
-- DROP TABLE IF EXISTS public.audit_logs CASCADE;
-- DROP TABLE IF EXISTS public.daily_wage_breaks CASCADE;
-- DROP TABLE IF EXISTS public.attendance_locks CASCADE;
-- DROP TABLE IF EXISTS public.holidays CASCADE;
-- DROP TABLE IF EXISTS public.tour_records CASCADE;
-- DROP TABLE IF EXISTS public.c_off_credits CASCADE;
-- DROP TABLE IF EXISTS public.leave_balances CASCADE;
-- DROP TABLE IF EXISTS public.attendance CASCADE;
-- DROP TABLE IF EXISTS public.employees CASCADE;

-- 2. CREATE EMPLOYEES MASTER TABLE (With nullable personal details for basic creation)
CREATE TABLE public.employees (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    employee_number TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    designation TEXT NOT NULL,
    employment_category TEXT NOT NULL, -- Permanent, Daily Wage, Contract, Apprentice, Intern, Deputation, Other
    functional_role TEXT NOT NULL,      -- Administration, Technical, Education, Security, Housekeeping, Garden, Civil, Electrical, Finance, Other
    additional_charges TEXT[] DEFAULT '{}',
    reporting_officers TEXT[] DEFAULT '{}', -- Store names or IDs of reporting officers
    dob DATE,                             -- Nullable (can be completed by employee later)
    joining_date DATE NOT NULL DEFAULT current_date,
    gender TEXT,                          -- Nullable
    blood_group TEXT,                     -- Nullable
    mobile_number TEXT,                   -- Nullable
    email TEXT UNIQUE NOT NULL,
    address TEXT,                         -- Nullable
    emergency_contact JSONB,              -- Nullable: { "name": "...", "relation": "...", "phone": "..." }
    educational_qualification TEXT,       -- Nullable
    role TEXT NOT NULL DEFAULT 'Employee', -- Root Admin, Admin, Employee
    is_archived BOOLEAN NOT NULL DEFAULT false,
    weekly_off_eligible BOOLEAN NOT NULL DEFAULT true,
    weekly_off_day TEXT NOT NULL DEFAULT 'Monday', -- Monday or Sunday
    daily_wage_rate NUMERIC NOT NULL DEFAULT 0,    -- Wage rate for daily wage category
    max_working_days INT NOT NULL DEFAULT 25,      -- Max working days per month for daily wage
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. CREATE ATTENDANCE TABLE
CREATE TABLE public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status TEXT NOT NULL, -- P, ML, CL, EL, SL, FH, SH, OD, TR, TO, CO, WO, H, A
    remarks TEXT,
    submitted_by UUID NOT NULL REFERENCES public.employees(id),
    approved_by UUID REFERENCES public.employees(id),
    approval_status TEXT NOT NULL DEFAULT 'Pending', -- Pending, Approved, Rejected
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_employee_date UNIQUE (employee_id, date)
);

-- 4. CREATE LEAVE BALANCES TABLE (Includes eligibility configurations and allocations)
CREATE TABLE public.leave_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL UNIQUE REFERENCES public.employees(id) ON DELETE CASCADE,
    cl_balance NUMERIC NOT NULL DEFAULT 0, -- Casual Leave Balance
    cl_eligible BOOLEAN NOT NULL DEFAULT true,
    cl_limit_type TEXT NOT NULL DEFAULT 'Annual', -- Annual or Monthly
    cl_limit NUMERIC NOT NULL DEFAULT 15,
    
    ml_balance NUMERIC NOT NULL DEFAULT 0, -- Medical Leave Balance
    ml_eligible BOOLEAN NOT NULL DEFAULT true,
    ml_limit_type TEXT NOT NULL DEFAULT 'Annual',
    ml_limit NUMERIC NOT NULL DEFAULT 15,
    
    el_balance NUMERIC NOT NULL DEFAULT 0, -- Earned Leave Balance
    el_eligible BOOLEAN NOT NULL DEFAULT true,
    el_limit_type TEXT NOT NULL DEFAULT 'Annual',
    el_limit NUMERIC NOT NULL DEFAULT 20,
    
    sl_balance NUMERIC NOT NULL DEFAULT 0, -- Special Leave Balance
    sl_eligible BOOLEAN NOT NULL DEFAULT true,
    sl_limit_type TEXT NOT NULL DEFAULT 'Annual',
    sl_limit NUMERIC NOT NULL DEFAULT 10,
    
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. CREATE COMPENSATORY OFF (C-OFF) CREDITS TABLE
CREATE TABLE public.c_off_credits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    date_worked DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'Available', -- Available, Used, Expired
    used_date DATE,
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. CREATE TOUR RECORDS TABLE
CREATE TABLE public.tour_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    remarks TEXT,
    tour_off_eligible INT NOT NULL DEFAULT 0, -- Number of tour off days earned
    tour_off_used INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. CREATE HOLIDAYS TABLE
CREATE TABLE public.holidays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL, -- Not unique to support multiple holiday events on same day!
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. CREATE ATTENDANCE LOCKS TABLE
CREATE TABLE public.attendance_locks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year INT NOT NULL,
    month INT NOT NULL, -- 1 to 12
    is_locked BOOLEAN NOT NULL DEFAULT false,
    locked_by UUID REFERENCES public.employees(id),
    locked_at TIMESTAMPTZ,
    CONSTRAINT unique_year_month UNIQUE (year, month)
);

-- 9. CREATE DAILY WAGE BREAK RECORDS TABLE
CREATE TABLE public.daily_wage_breaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    break_start_date DATE NOT NULL,
    rejoining_date DATE NOT NULL,
    notified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. CREATE PROFILE UPDATE REQUESTS TABLE (Employee profile verification queue)
CREATE TABLE public.profile_update_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    pending_data JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending', -- Pending, Approved, Rejected
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    reviewed_by UUID REFERENCES public.employees(id),
    reviewed_at TIMESTAMPTZ
);

-- 11. CREATE AUDIT LOGS TABLE
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.employees(id),
    actor_name TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS) on all public tables
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.c_off_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_wage_breaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_update_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 12. SECURITY FUNCTIONS (SECURITY DEFINER to safely manage users from Root Admin Account)

-- Function to check if calling user is a Root Admin
CREATE OR REPLACE FUNCTION public.is_root_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.employees 
        WHERE id = auth.uid() AND role = 'Root Admin' AND is_archived = false
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if calling user is Admin or Root Admin
CREATE OR REPLACE FUNCTION public.is_admin_or_root()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.employees 
        WHERE id = auth.uid() AND role IN ('Root Admin', 'Admin') AND is_archived = false
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create Employee Auth and Profile (Invoked by Root Admin/Admin via RPC)
CREATE OR REPLACE FUNCTION public.create_new_employee(
    p_employee_number TEXT,
    p_username TEXT,
    p_full_name TEXT,
    p_designation TEXT,
    p_employment_category TEXT,
    p_functional_role TEXT,
    p_additional_charges TEXT[],
    p_reporting_officers TEXT[],
    p_dob DATE,
    p_joining_date DATE,
    p_gender TEXT,
    p_blood_group TEXT,
    p_mobile_number TEXT,
    p_address TEXT,
    p_emergency_contact JSONB,
    p_educational_qualification TEXT,
    p_role TEXT,
    p_weekly_off_eligible BOOLEAN,
    p_weekly_off_day TEXT,
    p_daily_wage_rate NUMERIC,
    p_max_working_days INT,
    p_cl_eligible BOOLEAN,
    p_cl_limit_type TEXT,
    p_cl_limit NUMERIC,
    p_ml_eligible BOOLEAN,
    p_ml_limit_type TEXT,
    p_ml_limit NUMERIC,
    p_el_eligible BOOLEAN,
    p_el_limit_type TEXT,
    p_el_limit NUMERIC,
    p_sl_eligible BOOLEAN,
    p_sl_limit_type TEXT,
    p_sl_limit NUMERIC,
    p_password TEXT
)
RETURNS UUID AS $$
DECLARE
    new_user_id UUID;
    dummy_email TEXT;
BEGIN
    -- Check permissions (Unless it is the very first employee creation when the table is empty)
    IF EXISTS (SELECT 1 FROM public.employees) THEN
        IF NOT public.is_admin_or_root() THEN
            RAISE EXCEPTION 'Access Denied: Only Administrators can create employee accounts.';
        END IF;
    END IF;

    -- Map username to dummy email
    dummy_email := LOWER(p_username) || '@ksc.local';

    -- 1. Insert into auth.users (Supabase native authentication table)
    new_user_id := gen_random_uuid();
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
        confirmation_token, recovery_token, email_change, email_change_token_new
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        new_user_id,
        'authenticated',
        'authenticated',
        dummy_email,
        crypt(p_password, gen_salt('bf', 10)),
        now(),
        '{"provider": "email", "providers": ["email"]}'::jsonb,
        jsonb_build_object('username', p_username, 'employee_number', p_employee_number),
        now(),
        now(),
        '',
        '',
        '',
        ''
    );

    -- 2. Insert into auth.identities
    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
        new_user_id,
        new_user_id,
        jsonb_build_object('sub', new_user_id, 'email', dummy_email),
        'email',
        new_user_id::TEXT,
        now(),
        now(),
        now()
    );

    -- 3. Insert into public.employees
    INSERT INTO public.employees (
        id, employee_number, username, full_name, designation, employment_category,
        functional_role, additional_charges, reporting_officers, dob, joining_date,
        gender, blood_group, mobile_number, email, address, emergency_contact,
        educational_qualification, role, is_archived, weekly_off_eligible, weekly_off_day,
        daily_wage_rate, max_working_days
    ) VALUES (
        new_user_id, p_employee_number, p_username, p_full_name, p_designation, p_employment_category,
        p_functional_role, p_additional_charges, p_reporting_officers, p_dob, COALESCE(p_joining_date, current_date),
        p_gender, p_blood_group, p_mobile_number, dummy_email, p_address, p_emergency_contact,
        p_educational_qualification, p_role, false, p_weekly_off_eligible, p_weekly_off_day,
        p_daily_wage_rate, p_max_working_days
    );

    -- 4. Insert into public.leave_balances (with configurations)
    INSERT INTO public.leave_balances (
        employee_id, 
        cl_eligible, cl_limit_type, cl_limit, cl_balance,
        ml_eligible, ml_limit_type, ml_limit, ml_balance,
        el_eligible, el_limit_type, el_limit, el_balance,
        sl_eligible, sl_limit_type, sl_limit, sl_balance
    ) VALUES (
        new_user_id, 
        p_cl_eligible, p_cl_limit_type, p_cl_limit, p_cl_limit,
        p_ml_eligible, p_ml_limit_type, p_ml_limit, p_ml_limit,
        p_el_eligible, p_el_limit_type, p_el_limit, p_el_limit,
        p_sl_eligible, p_sl_limit_type, p_sl_limit, p_sl_limit
    );

    -- Log Action
    INSERT INTO public.audit_logs (actor_id, actor_name, action, details)
    VALUES (
        COALESCE(auth.uid(), new_user_id),
        COALESCE((SELECT full_name FROM public.employees WHERE id = auth.uid()), 'System Setup'),
        'Employee Creation',
        'Created employee ' || p_full_name || ' (Emp No: ' || p_employee_number || ')'
    );

    RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Reset Password function (Invoked by Root Admin via RPC)
CREATE OR REPLACE FUNCTION public.reset_employee_password(
    p_employee_id UUID,
    p_new_password TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    emp_name TEXT;
    admin_name TEXT;
BEGIN
    -- Check permissions
    IF NOT public.is_root_admin() THEN
        RAISE EXCEPTION 'Access Denied: Only Root Admins can reset passwords.';
    END IF;

    -- Update password in auth.users
    UPDATE auth.users
    SET encrypted_password = crypt(p_new_password, gen_salt('bf', 10)),
        updated_at = now()
    WHERE id = p_employee_id;

    SELECT full_name INTO emp_name FROM public.employees WHERE id = p_employee_id;
    SELECT full_name INTO admin_name FROM public.employees WHERE id = auth.uid();

    -- Log action
    INSERT INTO public.audit_logs (actor_id, actor_name, action, details)
    VALUES (auth.uid(), admin_name, 'Password Reset', 'Reset password for employee: ' || emp_name);

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Self-Service Change Password Function (Invoked by any employee)

CREATE OR REPLACE FUNCTION public.change_own_password(
    p_current_password TEXT,
    p_new_password TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_user_id UUID;
    v_db_password TEXT;
    v_emp_name TEXT;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Access Denied: Not authenticated.';
    END IF;

    -- Fetch current encrypted password
    SELECT encrypted_password INTO v_db_password FROM auth.users WHERE id = v_user_id;

    -- Verify current password
    IF v_db_password = crypt(p_current_password, v_db_password) THEN
        -- Update password
        UPDATE auth.users
        SET encrypted_password = crypt(p_new_password, gen_salt('bf', 10)),
            updated_at = now()
        WHERE id = v_user_id;

        SELECT full_name INTO v_emp_name FROM public.employees WHERE id = v_user_id;

        -- Log Action
        INSERT INTO public.audit_logs (actor_id, actor_name, action, details)
        VALUES (v_user_id, v_emp_name, 'Password Modification', 'Changed own password');

        RETURN TRUE;
    ELSE
        RAISE EXCEPTION 'Incorrect current password.';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profile updates verification function (Invoked by Admin via RPC)
CREATE OR REPLACE FUNCTION public.approve_profile_update(
    p_request_id UUID,
    p_admin_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    v_emp_id UUID;
    v_data JSONB;
    v_emp_name TEXT;
    v_admin_name TEXT;
BEGIN
    -- Check permissions
    IF NOT public.is_admin_or_root() THEN
        RAISE EXCEPTION 'Access Denied: Only Admins can approve profile updates.';
    END IF;

    -- Fetch request details
    SELECT employee_id, pending_data INTO v_emp_id, v_data 
    FROM public.profile_update_requests 
    WHERE id = p_request_id AND status = 'Pending';

    IF v_emp_id IS NULL THEN
        RAISE EXCEPTION 'Pending request not found.';
    END IF;

    -- 1. Apply updates to the employees master table
    UPDATE public.employees
    SET 
        mobile_number = COALESCE((v_data->>'mobile_number'), mobile_number),
        email = COALESCE((v_data->>'email'), email),
        address = COALESCE((v_data->>'address'), address),
        gender = COALESCE((v_data->>'gender'), gender),
        blood_group = COALESCE((v_data->>'blood_group'), blood_group),
        educational_qualification = COALESCE((v_data->>'educational_qualification'), educational_qualification),
        emergency_contact = COALESCE((v_data->'emergency_contact'), emergency_contact),
        updated_at = now()
    WHERE id = v_emp_id;

    -- 2. Mark request as Approved
    UPDATE public.profile_update_requests
    SET 
        status = 'Approved',
        reviewed_by = p_admin_id,
        reviewed_at = now()
    WHERE id = p_request_id;

    -- Get names for log
    SELECT full_name INTO v_emp_name FROM public.employees WHERE id = v_emp_id;
    SELECT full_name INTO v_admin_name FROM public.employees WHERE id = p_admin_id;

    -- 3. Log action
    INSERT INTO public.audit_logs (actor_id, actor_name, action, details)
    VALUES (
        p_admin_id, 
        v_admin_name, 
        'Profile Verification', 
        'Approved and verified profile updates for employee: ' || v_emp_name
    );

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. ROW-LEVEL SECURITY (RLS) POLICIES

-- Policies for public.employees
CREATE POLICY "Public profiles are readable by everyone"
    ON public.employees FOR SELECT
    USING (true);

CREATE POLICY "Root admins can modify employee records"
    ON public.employees FOR UPDATE
    TO authenticated
    USING (public.is_root_admin() OR public.is_admin_or_root())
    WITH CHECK (public.is_root_admin() OR public.is_admin_or_root());

CREATE POLICY "Employees can edit certain parts of their own profile"
    ON public.employees FOR UPDATE
    TO authenticated
    USING (id = auth.uid() AND is_archived = false)
    WITH CHECK (
        id = auth.uid() 
        AND role = (SELECT role FROM public.employees WHERE id = auth.uid()) -- Prevents role escalation
        AND employment_category = (SELECT employment_category FROM public.employees WHERE id = auth.uid())
        AND daily_wage_rate = (SELECT daily_wage_rate FROM public.employees WHERE id = auth.uid())
        AND is_archived = false
    );

-- Policies for public.attendance
CREATE POLICY "Employees can view own attendance records"
    ON public.attendance FOR SELECT
    TO authenticated
    USING (employee_id = auth.uid() OR public.is_admin_or_root());

CREATE POLICY "Employees can submit/request attendance for themselves"
    ON public.attendance FOR INSERT
    TO authenticated
    WITH CHECK (
        employee_id = auth.uid() 
        AND approval_status = 'Pending' 
        AND EXISTS (
            SELECT 1 FROM public.employees WHERE id = auth.uid() AND is_archived = false
        )
    );

CREATE POLICY "Employees can update their pending own attendance in current month"
    ON public.attendance FOR UPDATE
    TO authenticated
    USING (
        employee_id = auth.uid() 
        AND approval_status = 'Pending'
        AND date_trunc('month', date) = date_trunc('month', current_date)
        AND NOT EXISTS (
            SELECT 1 FROM public.attendance_locks 
            WHERE year = EXTRACT(YEAR FROM date) AND month = EXTRACT(MONTH FROM date) AND is_locked = true
        )
    )
    WITH CHECK (
        employee_id = auth.uid()
        AND approval_status = 'Pending'
        AND date_trunc('month', date) = date_trunc('month', current_date)
    );

CREATE POLICY "Admins or Root Admins can manage all attendance"
    ON public.attendance FOR ALL
    TO authenticated
    USING (public.is_admin_or_root())
    WITH CHECK (public.is_admin_or_root());

-- Policies for public.leave_balances
CREATE POLICY "Employees can read own leave balances"
    ON public.leave_balances FOR SELECT
    TO authenticated
    USING (employee_id = auth.uid() OR public.is_admin_or_root());

CREATE POLICY "Admins can update leave balances"
    ON public.leave_balances FOR ALL
    TO authenticated
    USING (public.is_admin_or_root())
    WITH CHECK (public.is_admin_or_root());

-- Policies for public.c_off_credits
CREATE POLICY "Employees can view own C-Off credits"
    ON public.c_off_credits FOR SELECT
    TO authenticated
    USING (employee_id = auth.uid() OR public.is_admin_or_root());

CREATE POLICY "Admins can manage C-Off credits"
    ON public.c_off_credits FOR ALL
    TO authenticated
    USING (public.is_admin_or_root())
    WITH CHECK (public.is_admin_or_root());

-- Policies for public.tour_records
CREATE POLICY "Employees can view own tour records"
    ON public.tour_records FOR SELECT
    TO authenticated
    USING (employee_id = auth.uid() OR public.is_admin_or_root());

CREATE POLICY "Admins can manage tour records"
    ON public.tour_records FOR ALL
    TO authenticated
    USING (public.is_admin_or_root())
    WITH CHECK (public.is_admin_or_root());

-- Policies for public.holidays
CREATE POLICY "Holidays are readable by everyone"
    ON public.holidays FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admins can manage holidays"
    ON public.holidays FOR ALL
    TO authenticated
    USING (public.is_admin_or_root())
    WITH CHECK (public.is_admin_or_root());

-- Policies for public.attendance_locks
CREATE POLICY "Locks are readable by everyone"
    ON public.attendance_locks FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admins can manage locks"
    ON public.attendance_locks FOR ALL
    TO authenticated
    USING (public.is_admin_or_root())
    WITH CHECK (public.is_admin_or_root());

-- Policies for public.daily_wage_breaks
CREATE POLICY "Daily wage breaks are readable by everyone"
    ON public.daily_wage_breaks FOR SELECT
    TO authenticated
    USING (employee_id = auth.uid() OR public.is_admin_or_root());

CREATE POLICY "Admins can manage daily wage breaks"
    ON public.daily_wage_breaks FOR ALL
    TO authenticated
    USING (public.is_admin_or_root())
    WITH CHECK (public.is_admin_or_root());

-- Policies for public.profile_update_requests
CREATE POLICY "Employees can view own profile requests"
    ON public.profile_update_requests FOR SELECT
    TO authenticated
    USING (employee_id = auth.uid() OR public.is_admin_or_root());

CREATE POLICY "Employees can submit profile update requests"
    ON public.profile_update_requests FOR INSERT
    TO authenticated
    WITH CHECK (employee_id = auth.uid() AND status = 'Pending');

CREATE POLICY "Admins can update profile requests"
    ON public.profile_update_requests FOR UPDATE
    TO authenticated
    USING (public.is_admin_or_root())
    WITH CHECK (public.is_admin_or_root());

-- Policies for public.audit_logs
CREATE POLICY "Only Root Admins can view audit logs"
    ON public.audit_logs FOR SELECT
    TO authenticated
    USING (public.is_root_admin());

CREATE POLICY "Allows logging by authenticated users"
    ON public.audit_logs FOR INSERT
    TO authenticated
    WITH CHECK (true);


-- 14. SEED INITIAL ROOT ADMIN ACCOUNT
-- Username: root_admin
-- Employee Number: KSC001
-- Password: KSCAdminPassword123!
-- Email created: root_admin@ksc.local

SELECT public.create_new_employee(
    'KSC001',                                    -- Employee Number
    'root_admin',                                -- Username
    'KSC Root Administrator',                    -- Full Name
    'Root Admin',                                -- Designation
    'Permanent',                                 -- Employment Category
    'Administration',                            -- Functional Role
    ARRAY['System Administrator'::TEXT],         -- Additional Charges
    ARRAY['Director'::TEXT],                     -- Reporting Officers
    '1985-01-01'::DATE,                          -- DOB
    '2015-06-01'::DATE,                          -- Joining Date
    'Male',                                      -- Gender
    'O+Pos',                                     -- Blood Group
    '+91-9876543210',                            -- Mobile
    'Kerala Science City Main Campus, TVM',      -- Address
    '{"name": "Emergency Admin", "relation": "Spouse", "phone": "+91-9876543211"}'::JSONB, -- Emergency
    'M.Tech Computer Science',                   -- Qualification
    'Root Admin',                                -- Role
    true,                                        -- Weekly Off Eligible
    'Monday',                                    -- Weekly Off Day
    0,                                           -- Daily Wage Rate (Not applicable)
    0,                                           -- Max Working Days
    true, 'Annual', 15,                          -- CL Eligibility & Limits
    true, 'Annual', 15,                          -- ML Eligibility & Limits
    true, 'Annual', 20,                          -- EL Eligibility & Limits
    true, 'Annual', 10,                          -- SL Eligibility & Limits
    'KSCAdminPassword123!'                      -- Password (CHANGE ON FIRST LOGIN)
);
