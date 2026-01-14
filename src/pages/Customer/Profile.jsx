import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import API from "../../services/api";

export default function Profile() {
  const { user, login } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  if (!user) {
    return <p className="text-center mt-20 text-gray-500">Loading profile…</p>;
  }

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await API.put("/users/profile", form);
      login(localStorage.getItem("token"), res.data.user);
      setEditing(false);
      alert("Profile updated successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">My Profile</h2>

          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="px-5 py-2 text-sm font-medium rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="px-5 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
              >
                {loading ? "Saving…" : "Save"}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setForm({
                    name: user.name,
                    phone: user.phone || "",
                    address: user.address || "",
                  });
                }}
                className="px-5 py-2 text-sm font-medium rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* PROFILE DETAILS */}
        <div className="space-y-6">
          <ProfileField
            label="Full Name"
            value={user.name}
            editing={editing}
            field="name"
            form={form}
            setForm={setForm}
          />

          <ProfileField
            label="Email"
            value={user.email}
            readOnly
          />

          <ProfileField
            label="Phone Number"
            value={user.phone || "Not provided"}
            editing={editing}
            field="phone"
            form={form}
            setForm={setForm}
          />

          <ProfileField
            label="Address"
            value={user.address || "Not provided"}
            editing={editing}
            field="address"
            form={form}
            setForm={setForm}
            textarea
          />
        </div>

        {/* FOOTER */}
        <div className="mt-10 text-right text-sm text-gray-400">
          Account created on{" "}
          {user.createdAt
            ? new Date(user.createdAt).toLocaleDateString()
            : "N/A"}
        </div>
      </div>
    </div>
  );
}

/* =========================
   PROFILE FIELD COMPONENT
========================= */
function ProfileField({
  label,
  value,
  editing = false,
  field,
  form,
  setForm,
  textarea = false,
  readOnly = false,
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-gray-500">{label}</span>

      {editing && field && !readOnly ? (
        textarea ? (
          <textarea
            rows={3}
            value={form[field]}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, [field]: e.target.value }))
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        ) : (
          <input
            type="text"
            value={form[field]}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, [field]: e.target.value }))
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        )
      ) : (
        <div className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-2 text-gray-800 font-medium">
          {value}
        </div>
      )}
    </div>
  );
}
