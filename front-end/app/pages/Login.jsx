import axios from "axios";
import { useState } from "react";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);

  function checkUserAction(formData) {
    let email = formData.get("email");
    let password = formData.get("password");

    if (isSignUp) {
      axios
        .post("/api/sign-up", {
          email: email,
          password: password,
        })
        .then((Response) => {
          localStorage.setItem("token", Response.data.token);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("user want to log in");
    }
  }
  return (
    <form
      action={checkUserAction}
      className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6 mx-auto"
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
          className="text-blue-600 cursor-pointer hover:underline"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? "Log-in" : "Sign-up"}
        </button>
      </p>
    </form>
  );
}
