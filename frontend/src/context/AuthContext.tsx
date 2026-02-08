import {
  createContext,
  useReducer,
  type ReactNode,
  useContext,
} from "react";
import axios from "axios";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: "LOGIN_SUCCESS"; payload: string }
  | { type: "LOGOUT" }
  | { type: "AUTH_ERROR"; payload: string }
  | { type: "SET_LOADING" };

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      localStorage.setItem("token", action.payload);
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${action.payload}`;
      return {
        ...state,
        token: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case "LOGOUT":
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case "AUTH_ERROR":
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case "SET_LOADING":
      return { ...state, loading: true, error: null };
    default:
      return state;
  }
};

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (email: string, password: string) => {
    dispatch({ type: "SET_LOADING" });
    try {
      const res = await axios.post("http://localhost:4000/auth/login", {
        email,
        password,
      });
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.access_token });
    } catch (err: any) {
      dispatch({
        type: "AUTH_ERROR",
        payload: err.response?.data?.message || "Login failed",
      });
    }
  };

  const register = async (email: string, password: string) => {
    dispatch({ type: "SET_LOADING" });
    try {
      const res = await axios.post("http://localhost:4000/auth/register", {
        email,
        password,
      });
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.access_token });
    } catch (err: any) {
      dispatch({
        type: "AUTH_ERROR",
        payload: err.response?.data?.message || "Registration failed",
      });
    }
  };

  const logout = () => dispatch({ type: "LOGOUT" });

  return (
    <AuthContext.Provider value={{ state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
