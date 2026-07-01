// Custom API bridge for MERN stack - mimics Supabase JS client
const getToken = () => (typeof window !== "undefined" ? localStorage.getItem("auth_token") : null);

// Basic API request helper
async function apiRequest(method: string, path: string, body?: any, expectStatus?: number) {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const err: any = new Error(errorData.message || `Request failed with status ${res.status}`);
    err.status = res.status;
    throw err;
  }

  return res.json();
}

// Chained Query Builder mimicking Supabase postgrest-js
class MockQueryBuilder {
  private tableName: string;
  private filters: Record<string, any> = {};
  private sortColumn?: string;
  private sortAscending?: boolean;
  private limitCount?: number;
  private updateData?: any;
  private insertData?: any;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  select(columns?: string) {
    return this;
  }

  insert(data: any) {
    this.insertData = data;
    return this;
  }

  update(data: any) {
    this.updateData = data;
    return this;
  }

  eq(column: string, value: any) {
    this.filters[column] = value;
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.sortColumn = column;
    this.sortAscending = options?.ascending ?? true;
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  async then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    try {
      let data: any;

      if (this.insertData) {
        if (this.tableName === "contact_messages") {
          data = await apiRequest("POST", "/api/contact", this.insertData);
        } else if (this.tableName === "quote_requests") {
          data = await apiRequest("POST", "/api/quotes", this.insertData);
        } else {
          throw new Error(`Insert not supported on table ${this.tableName}`);
        }
      } else if (this.updateData) {
        if (this.tableName === "profiles") {
          data = await apiRequest("PUT", "/api/profiles/me", this.updateData);
        } else if (this.tableName === "quote_requests") {
          const quoteId = this.filters.id;
          if (!quoteId) throw new Error("Missing quote request ID for update");
          data = await apiRequest("PATCH", `/api/quotes/${quoteId}`, this.updateData);
        } else {
          throw new Error(`Update not supported on table ${this.tableName}`);
        }
      } else {
        if (this.tableName === "profiles") {
          data = [await apiRequest("GET", "/api/profiles/me")];
        } else if (this.tableName === "quote_requests") {
          const rawQuotes = await apiRequest("GET", "/api/quotes");
          data = rawQuotes;
          if (this.limitCount) {
            data = data.slice(0, this.limitCount);
          }
        } else if (this.tableName === "contact_messages") {
          data = await apiRequest("GET", "/api/contact");
          if (this.limitCount) {
            data = data.slice(0, this.limitCount);
          }
        } else if (this.tableName === "user_roles") {
          const sessionRes = await auth.getSession();
          const userRole = (sessionRes.data?.session?.user as any)?.user_metadata?.role || "customer";
          const isAdminQuery = this.filters.role === "admin";
          const userIsAdmin = userRole === "admin";
          if (isAdminQuery && userIsAdmin) {
            data = [{ role: "admin" }];
          } else {
            data = [];
          }
        } else {
          throw new Error(`Select not supported on table ${this.tableName}`);
        }
      }

      const result = { data, error: null };
      return onfulfilled ? onfulfilled(result) : result;
    } catch (err: any) {
      console.error(`[MockQueryBuilder Error]`, err);
      const result = { data: null, error: { message: err.message } };
      return onfulfilled ? onfulfilled(result) : result;
    }
  }

  async maybeSingle() {
    const { data, error } = await this;
    if (error) return { data: null, error };
    return { data: data && data.length > 0 ? data[0] : null, error: null };
  }

  async single() {
    const { data, error } = await this;
    if (error) return { data: null, error };
    if (!data || data.length === 0) return { data: null, error: { message: "No rows found" } };
    return { data: data[0], error: null };
  }
}

type AuthChangeCallback = (event: string, session: any) => void;
let authCallbacks: AuthChangeCallback[] = [];

const notifyAuthStateChange = (session: any) => {
  const event = session ? "SIGNED_IN" : "SIGNED_OUT";
  authCallbacks.forEach((cb) => cb(event, session));
};

const auth = {
  async signUp({ email, password, options }: any) {
    try {
      const res = await apiRequest("POST", "/api/auth/register", {
        email,
        password,
        fullName: options?.data?.full_name,
        mobile: options?.data?.mobile,
      });
      localStorage.setItem("auth_token", res.token);
      notifyAuthStateChange(res.session);
      return { data: res.session, error: null };
    } catch (err: any) {
      return { data: null, error: { message: err.message } };
    }
  },

  async signInWithPassword({ email, password }: any) {
    try {
      const res = await apiRequest("POST", "/api/auth/login", { email, password });
      localStorage.setItem("auth_token", res.token);
      notifyAuthStateChange(res.session);
      return { data: res.session, error: null };
    } catch (err: any) {
      return { data: null, error: { message: err.message } };
    }
  },

  async signInAdminWithPassword({ email, password }: any) {
    try {
      const res = await apiRequest("POST", "/api/auth/admin-login", { email, password });
      localStorage.setItem("auth_token", res.token);
      notifyAuthStateChange(res.session);
      return { data: res.session, error: null };
    } catch (err: any) {
      return { data: null, error: { message: err.message } };
    }
  },

  async signOut() {
    try {
      localStorage.removeItem("auth_token");
      notifyAuthStateChange(null);
      return { error: null };
    } catch (err: any) {
      return { error: { message: err.message } };
    }
  },

  async getSession() {
    const token = getToken();
    if (!token) return { data: { session: null }, error: null };
    try {
      const res = await apiRequest("GET", "/api/auth/session");
      // Profile fetch is non-fatal — don't let it kill the session
      try {
        const profile = await apiRequest("GET", "/api/profiles/me");
        if (res.session && res.session.user) {
          res.session.user.user_metadata.role = profile.role;
        }
      } catch (_profileErr) {
        // Profile unavailable — session still valid
      }
      return { data: { session: res.session }, error: null };
    } catch (err: any) {
      // Only clear token if it's actually invalid/expired (401), not on network errors
      if (err.status === 401) {
        localStorage.removeItem("auth_token");
      }
      return { data: { session: null }, error: null };
    }
  },

  onAuthStateChange(callback: AuthChangeCallback) {
    authCallbacks.push(callback);
    this.getSession().then(({ data }) => {
      callback(data?.session ? "SIGNED_IN" : "SIGNED_OUT", data?.session);
    });
    return {
      data: {
        subscription: {
          unsubscribe() {
            authCallbacks = authCallbacks.filter((cb) => cb !== callback);
          },
        },
      },
    };
  },

  async resetPasswordForEmail(email: string, options?: any) {
    try {
      const res = await apiRequest("POST", "/api/auth/reset-password-request", {
        email,
        redirectTo: options?.redirectTo,
      });
      return { data: res, error: null };
    } catch (err: any) {
      return { data: null, error: { message: err.message } };
    }
  },

  async updateUser({ password }: any) {
    try {
      const res = await apiRequest("POST", "/api/auth/reset-password-update", { password });
      return { data: res, error: null };
    } catch (err: any) {
      return { data: null, error: { message: err.message } };
    }
  },

  async setSession(tokens: any) {
    if (tokens?.access_token) {
      localStorage.setItem("auth_token", tokens.access_token);
      const sessionRes = await this.getSession();
      notifyAuthStateChange(sessionRes.data?.session);
      return { data: sessionRes.data, error: null };
    }
    return { data: null, error: new Error("No access token provided") };
  },
};

// Export the mock supabase instance
export const supabase = {
  auth,
  from: (tableName: string) => new MockQueryBuilder(tableName),
} as any;
