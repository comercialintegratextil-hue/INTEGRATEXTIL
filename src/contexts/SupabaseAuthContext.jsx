import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (user) => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const { data: userRole, error: roleError } = await supabase
      .from('users_roles')
      .select('role, status')
      .eq('user_id', user.id)
      .maybeSingle();

    let userProfile = {
        id: user.id,
        email: user.email,
        first_name: user.user_metadata.first_name,
        last_name: user.user_metadata.last_name,
        role: 'Usuario',
        status: true,
    };

    if (roleError) {
      console.error('Error fetching user role:', roleError);
    } else if (userRole) {
        userProfile.role = userRole.role;
        userProfile.status = userRole.status;
    }
    
    setProfile(userProfile);
    setLoading(false);

  }, []);

  const handleSession = useCallback(async (session) => {
    setSession(session);
    const currentUser = session?.user ?? null;
    setUser(currentUser);
    await fetchProfile(currentUser);
  }, [fetchProfile]);

  useEffect(() => {
    setLoading(true);
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      handleSession(session);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          handleSession(session);
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [handleSession]);
  
  const signUp = useCallback(async (email, password, options) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign up Failed",
        description: error.message || "Something went wrong",
      });
    } else {
      toast({
        title: "¡Registro Exitoso!",
        description: "Por favor, revisa tu correo para verificar tu cuenta.",
      });
    }

    return { data, error };
  }, [toast]);

  const signIn = useCallback(async (email, password) => {
    // ============================================================================
    // 🚨 BYPASS TEMPORAL - SOLO PARA DESARROLLO
    // ============================================================================
    // Este bypass permite acceder sin Supabase mientras se configura el proyecto
    // CREDENCIALES TEMPORALES:
    // Email: integratextilerp@gmail.com
    // Password: 8224
    // Rol: SuperAdministrador
    // 
    // ⚠️ IMPORTANTE: ELIMINAR ESTE CÓDIGO CUANDO SUPABASE ESTÉ CONFIGURADO
    // ============================================================================
    
    if (email === 'integratextilerp@gmail.com' && password === '8224') {
      // Crear sesión temporal local
      const tempUser = {
        id: 'temp-user-local-dev',
        email: 'integratextilerp@gmail.com',
        user_metadata: {
          first_name: 'Integra',
          last_name: 'Textil ERP'
        }
      };
      
      const tempSession = {
        user: tempUser,
        access_token: 'temp-local-token'
      };
      
      // Simular perfil con rol SuperAdministrador
      const tempProfile = {
        id: tempUser.id,
        email: tempUser.email,
        first_name: 'Integra',
        last_name: 'Textil ERP',
        role: 'SuperAdministrador',
        status: true
      };
      
      setSession(tempSession);
      setUser(tempUser);
      setProfile(tempProfile);
      
      toast({
        title: "✅ Acceso Temporal Concedido",
        description: "Usando credenciales locales (desarrollo). Configura Supabase para producción.",
      });
      
      return { error: null };
    }
    
    // ============================================================================
    // FIN DEL BYPASS TEMPORAL
    // ============================================================================
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign in Failed",
        description: error.message || "Something went wrong",
      });
    }

    return { error };
  }, [toast]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign out Failed",
        description: error.message || "Something went wrong",
      });
    }

    return { error };
  }, [toast]);

  const value = useMemo(() => ({
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  }), [user, profile, session, loading, signUp, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};