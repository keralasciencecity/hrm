-- Kerala Science City - Database Migration (Updates for Version 1.1)
-- Run this in your Supabase SQL Editor to update your existing tables.

-- 1. ADD LEAVE ELIGIBILITY & CONFIGURATION FIELDS TO LEAVE BALANCES
ALTER TABLE public.leave_balances 
ADD COLUMN IF NOT EXISTS cl_eligible BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS cl_limit_type TEXT DEFAULT 'Annual', -- 'Annual' or 'Monthly'
ADD COLUMN IF NOT EXISTS cl_limit NUMERIC DEFAULT 15,

ADD COLUMN IF NOT EXISTS ml_eligible BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS ml_limit_type TEXT DEFAULT 'Annual',
ADD COLUMN IF NOT EXISTS ml_limit NUMERIC DEFAULT 15,

ADD COLUMN IF NOT EXISTS el_eligible BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS el_limit_type TEXT DEFAULT 'Annual',
ADD COLUMN IF NOT EXISTS el_limit NUMERIC DEFAULT 20,

ADD COLUMN IF NOT EXISTS sl_eligible BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS sl_limit_type TEXT DEFAULT 'Annual',
ADD COLUMN IF NOT EXISTS sl_limit NUMERIC DEFAULT 10;

-- 2. CREATE PROFILE UPDATE REQUESTS QUEUE TABLE
CREATE TABLE IF NOT EXISTS public.profile_update_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    pending_data JSONB NOT NULL, -- Holds proposed changes (mobile, address, emergency contact, blood group, etc.)
    status TEXT NOT NULL DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected'
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    reviewed_by UUID REFERENCES public.employees(id),
    reviewed_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.profile_update_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Employees can view own profile requests"
    ON public.profile_update_requests FOR SELECT
    TO authenticated
    USING (employee_id = auth.uid() OR public.is_admin_or_root());

CREATE POLICY "Employees can submit profile update requests"
    ON public.profile_update_requests FOR INSERT
    TO authenticated
    WITH CHECK (employee_id = auth.uid() AND status = 'Pending');

CREATE POLICY "Admins can update profile requests (approvals)"
    ON public.profile_update_requests FOR UPDATE
    TO authenticated
    USING (public.is_admin_or_root())
    WITH CHECK (public.is_admin_or_root());

-- Disable the direct log profile changes trigger on employees to let the new workflow process first.
DROP TRIGGER IF EXISTS trigger_log_profile_changes ON public.employees;

-- Write an RPC function to execute profile verification approvals programmatically
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

-- 3. DROP OLD SELECT POLICY AND ENABLE PUBLIC SELECT FOR LOGIN NAMESPACE RESOLVER
DROP POLICY IF EXISTS "Public profiles are readable by authenticated users" ON public.employees;
DROP POLICY IF EXISTS "Public profiles are readable by everyone" ON public.employees;

CREATE POLICY "Public profiles are readable by everyone"
    ON public.employees FOR SELECT
    USING (true);

ALTER TABLE public.employees
ADD COLUMN IF NOT EXISTS od_eligible BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS tr_eligible BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS to_eligible BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS co_eligible BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS fh_eligible BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS sh_eligible BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS a_eligible BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS p_eligible BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS co_limit INT DEFAULT 15;
