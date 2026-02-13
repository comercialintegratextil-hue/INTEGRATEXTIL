import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Si no hay credenciales (modo local sin Supabase), usamos valores dummy
// para evitar que createClient falle al iniciar.
// El bypass en SupabaseAuthContext manejará la autenticación.
const isLocalMode = !supabaseUrl || !supabaseAnonKey;

const effectiveUrl = isLocalMode ? 'https://placeholder.supabase.co' : supabaseUrl;
const effectiveKey = isLocalMode ? 'placeholder-key' : supabaseAnonKey;

export const supabase = createClient(effectiveUrl, effectiveKey, {
    auth: {
        persistSession: !isLocalMode // No persistir sesión si estamos en modo local falso
    }
});

if (isLocalMode) {
    console.warn('⚠️ Supabase Client inicializado en MODO MOCK (Sin credenciales). Solo funcionará el acceso temporal local.');
}