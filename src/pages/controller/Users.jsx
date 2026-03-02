import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../layouts/AdminLayout";

const ManageUser = () => {

  const [users, setUsers] = useState([]);
  const [centers, setCenters] = useState([]);
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchUsers();
    fetchCenters();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get(
      "https://ru-quesitonpapers-backend.onrender.com/api/users",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('user data is:',res.data)
    setUsers(res.data);
    console.log(res.data)
  };

  const fetchCenters = async () => {
    const res = await axios.get(
      "https://ru-quesitonpapers-backend.onrender.com/api/centers/list",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setCenters(res.data);
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {

    if (!form.name || !form.email || !form.role) {
      setError("All required fields must be filled");
      return;
    }

    try {

      if (editing) {
        await axios.put(
          `https://ru-quesitonpapers-backend.onrender.com/api/users/${editing}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        if (!form.password) {
          setError("Password required for new user");
          return;
        }

        await axios.post(
          "https://ru-quesitonpapers-backend.onrender.com/api/users",
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setToast("User saved successfully");
      setError(null);
      setForm({});
      setEditing(null);
      fetchUsers();

      setTimeout(() => setToast(null), 3000);

    } catch (err) {
      setError("Operation failed");
    }
  };
 const handleAdd = async () => {

  if (!form.name || !form.email || !form.password || !form.role) {
    setError("All required fields must be filled");
    return;
  }

  try {

    await axios.post(
      "https://ru-quesitonpapers-backend.onrender.com/api/users",
      form,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setToast("User created successfully");
    setError(null);
    setForm({});
    fetchUsers();

    setTimeout(() => setToast(null), 3000);

  } catch (err) {
    setError("User creation failed");
  }
};
  // ================= DELETE =================
  const deleteUser = async (id) => {

    if (!window.confirm("Delete this user?")) return;

    await axios.delete(
      `https://ru-quesitonpapers-backend.onrender.com/api/users/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setToast("User deleted");
    fetchUsers();
    setTimeout(() => setToast(null), 3000);
  };

  // ================= TOGGLE ACTIVE =================
  const toggleActive = async (user) => {

    await axios.put(
      `https://ru-quesitonpapers-backend.onrender.com/api/users/${user.user_id}`,
      { ...user, is_active: !user.is_active },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchUsers();
  };

  return (
    <AdminLayout>
      <div style={styles.container}>

        <h2 style={styles.heading}>Academic User Management</h2>
        <button style={styles.primaryBtn} onClick={handleAdd}>
            Add User
          </button>

        {toast && <div style={styles.successToast}>{toast}</div>}
        {error && <div style={styles.errorToast}>{error}</div>}

        {/* ===== FORM ===== */}
        <div style={styles.formCard}>

          <h3 style={styles.formTitle}>
            {editing ? "Edit User" : "Create New User"}
          </h3>

          <div style={styles.formGrid}>

            <input
              placeholder="Full Name *"
              value={form.name || ""}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              placeholder="Email *"
              value={form.email || ""}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            {!editing && (
              <input
                type="password"
                placeholder="Password *"
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            )}

            {editing && (
              <input
                type="password"
                placeholder="Change Password (optional)"
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            )}

            <select
              value={form.role || ""}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
            >
              <option value="">Select Role *</option>
              <option value="controller">Controller</option>
              <option value="principal">Principal</option>
            </select>

            {form.role === "principal" && (
              <select
                value={form.center_code || ""}
                onChange={(e) =>
                  setForm({ ...form, center_code: e.target.value })
                }
              >
                <option value="">Assign Center</option>
                {centers.map(c => (
                  <option key={c.center_code} value={c.center_code}>
                    {c.center_name}
                  </option>
                ))}
              </select>
            )}

          </div>

          <button style={styles.primaryBtn} onClick={handleSubmit}>
            {editing ? "Update User" : "Add User"}
          </button>

        </div>

        {/* ===== USERS GRID ===== */}
        <div style={styles.grid}>
          {users.map(user => (
            <div key={user.user_id} style={styles.card}>

              <div style={styles.cardHeader}>
                <h4>{user.name}</h4>
                <span style={user.is_active ? styles.activeBadge : styles.inactiveBadge}>
                  {user.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Center:</strong> {user.center_name || "Not Assigned"}</p>

              <div style={styles.actions}>
                <button
                  style={styles.editBtn}
                  onClick={() => {
                    setEditing(user.user_id);
                    setForm(user);
                  }}
                >
                  Edit
                </button>

                <button
                  style={styles.toggleBtn}
                  onClick={() => toggleActive(user)}
                >
                  {user.is_active ? "Deactivate" : "Activate"}
                </button>

                <button
                  style={styles.deleteBtn}
                  onClick={() => deleteUser(user.user_id)}
                >
                  Delete
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </AdminLayout>
  );
};

const styles = {
  container: { padding: "40px", background: "#f8fafc", minHeight: "100vh" },
  heading: { marginBottom: "20px" },

  successToast: {
    background: "#16a34a",
    color: "#fff",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "15px"
  },

  errorToast: {
    background: "#dc2626",
    color: "#fff",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "15px"
  },

  formCard: {
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    marginBottom: "40px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.05)"
  },

  formTitle: { marginBottom: "15px" },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
    gap: "15px",
    marginBottom: "15px"
  },

  primaryBtn: {
    background: "#1e3a8a",
    color: "#fff",
    padding: "8px 14px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
    gap: "20px"
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.05)"
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px"
  },

  activeBadge: {
    background: "#dcfce7",
    color: "#166534",
    padding: "4px 8px",
    borderRadius: "20px",
    fontSize: "12px"
  },

  inactiveBadge: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "4px 8px",
    borderRadius: "20px",
    fontSize: "12px"
  },

  actions: {
    marginTop: "15px",
    display: "flex",
    gap: "8px",
    flexWrap: "wrap"
  },

  editBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  toggleBtn: {
    background: "#f59e0b",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  deleteBtn: {
    background: "#7c2d12",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

export default ManageUser;