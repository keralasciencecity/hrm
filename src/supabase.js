import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase URL or Anon Key is missing. System will run in Simulated Local Sandbox Mode using localStorage.'
  );
}

// Create and export Supabase client SAFELY to prevent boot-time initialization crashes
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Custom lookup helper to support logging in using Username OR Employee Number.
 * Since Supabase Auth natively authenticates via email, this helper queries the
 * public `employees` table to retrieve the mapped email for a given identifier,
 * falling back to the standard dummy structure if not found or if offline.
 * 
 * @param {string} identifier - Username or Employee Number
 * @returns {Promise<string>} Mapped email address
 */
export async function resolveIdentifierToEmail(identifier) {
  if (!identifier) return '';

  const cleanId = identifier.trim();

  // 1. If it contains an '@', treat it directly as an email
  if (cleanId.includes('@')) {
    return cleanId;
  }

  // 2. If Supabase is not configured, bypass DB query and immediately return standard dummy email
  if (!supabase) {
    return `${cleanId.toLowerCase()}@ksc.local`;
  }

  try {
    // 3. Query public employees table by username to resolve active state
    const { data: userByUsername, error: err1 } = await supabase
      .from('employees')
      .select('username')
      .eq('username', cleanId)
      .eq('is_archived', false)
      .maybeSingle();

    if (userByUsername && userByUsername.username) {
      return `${userByUsername.username.toLowerCase()}@ksc.local`;
    }

    // 4. Query public employees table by employee number to resolve mapped username
    const { data: userByEmpNo, error: err2 } = await supabase
      .from('employees')
      .select('username')
      .eq('employee_number', cleanId)
      .eq('is_archived', false)
      .maybeSingle();

    if (userByEmpNo && userByEmpNo.username) {
      return `${userByEmpNo.username.toLowerCase()}@ksc.local`;
    }
  } catch (err) {
    console.error('Database lookup failed, falling back to dummy email generation:', err);
  }

  // 5. Offline/Initial Setup Fallback: Assume standard username format
  return `${cleanId.toLowerCase()}@ksc.local`;
}
