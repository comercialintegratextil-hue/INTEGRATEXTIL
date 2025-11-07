// Lightweight supabase stub to allow running the app without connecting to Supabase.
// This implements the minimal API surface used across the app and returns
// safe defaults (empty arrays / nulls) so the UI doesn't make real network calls.

const noopPromise = async (result) => ({ ...(result ?? {}), error: null });

const queryBuilder = () => {
	return {
		select: async () => ({ data: [], error: null }),
		insert: async () => ({ data: null, error: null }),
		update: async () => ({ data: null, error: null }),
		delete: async () => ({ data: null, error: null }),
		eq: function () { return this; },
		order: function () { return this; },
		maybeSingle: async () => ({ data: null, error: null }),
		single: async () => ({ data: null, error: null }),
	};
};

export const supabase = {
	from: (table) => queryBuilder(),
	rpc: async (fnName, params) => ({ data: null, error: null }),
	functions: {
		// simulate serverless functions
		invoke: async (name, opts) => ({ data: [], error: null }),
	},
	auth: {
		getSession: async () => {
			// Try to read a session from localStorage (if running in browser)
			try {
				const session = typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem('app_session') || 'null') : null;
				return { data: { session } };
			} catch (e) {
				return { data: { session: null } };
			}
		},
		onAuthStateChange: (cb) => {
			// No realtime auth in stub; return a fake subscription object
			return { data: { subscription: { unsubscribe: () => {} } } };
		},
		signUp: async (opts) => ({ data: null, error: null }),
		signInWithPassword: async (opts) => ({ data: null, error: null }),
		signOut: async () => ({ error: null }),
		resetPasswordForEmail: async (email, opts) => ({ error: null }),
	},
	removeChannel: (c) => {},
	channel: () => ({ subscribe: () => {}, unsubscribe: () => {} }),
};

export default supabase;