import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
     await API.post(`/users/reset-password/${token}`, {
  password,
});

      

      alert("Password reset successful");
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Reset failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>

      <form onSubmit={submit} className="space-y-4">
        <input
          type="password"
          placeholder="New password"
          className="border p-2 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>
      </form>

      {error && (
        <p className="text-red-600 mt-3 text-center">
          {error}
        </p>
      )}
    </div>
  );
}
