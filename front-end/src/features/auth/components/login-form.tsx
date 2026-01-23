import api from "@/services/api";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const { login } = useAuth();

  function checkUserAction(formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");
    if (isSignUp) {
      api
        .post("/sign-up", {
          email: email,
          password: password,
        })
        .then(() => {
          login(); // Update context state
        })
        .catch((error) => {
          console.log(error);
          alert(error.response?.data?.message);
        });
    } else {
      api
        .post("/sign-in", {
          email: email,
          password: password,
        })
        .then((Response) => {
          alert("login successfull");
          login(); // Update context state
        })
        .catch((error) => {
          console.log("Session expire");
          alert(error.response?.data?.message);
        });
    }
  }

  return (
    <form
      action={checkUserAction}
      className="w-full max-w-md bg-white p-8 border border-gray-300 rounded-2xl shadow-xl space-y-6 mx-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      {/* Heading */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
        <p className="text-sm text-gray-500 mt-1">Sign in to continue</p>
      </div>

      {/* Username */}
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Username <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          required
          type="text"
          placeholder="example@gmail.com"
          className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>

      {/* Password */}
      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password <span className="text-red-500">*</span>
        </label>
        <input
          id="password"
          name="password"
          required
          type="password"
          placeholder="••••••••"
          className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>

      {/* Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 active:scale-95 transition-all duration-200"
      >
        {isSignUp ? "Sign Up" : "Log-In"}
      </button>

      {/* Footer */}
      <p className="text-center text-sm text-gray-500">
        Don’t have an account?{" "}
        <button
          type="button"
          className="text-blue-600 cursor-pointer hover:underline"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? "Log-in" : "Sign-up"}
        </button>
      </p>
    </form>
  );
}
