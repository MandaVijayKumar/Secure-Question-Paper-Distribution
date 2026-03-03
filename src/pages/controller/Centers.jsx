import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../layouts/AdminLayout";

const ManageCenters = () => {

  const [centers, setCenters] = useState([]);
  const [form, setForm] = useState({
    center_code: "",
    center_name: "",
    email: ""
  });

  const [editing, setEditing] = useState(null);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/centers",
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    setCenters(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editing) {
      await axios.put(
        `http://localhost:5000/api/centers/${editing}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
      await axios.post(
        "http://localhost:5000/api/centers",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    setForm({ center_code: "", center_name: "", email: "" });
    setEditing(null);
    fetchCenters();
  };

  const handleEdit = (center) => {
    setForm(center);
    setEditing(center.center_code);
  };

  const handleDelete = async (code) => {
    if (!window.confirm("Delete this center?")) return;

    await axios.delete(
      `http://localhost:5000/api/centers/${code}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchCenters();
  };

  return ( 
    <AdminLayout>
      <div style={styles.container}>
        <h2>Manage Exam Centers</h2>

        {/* Add / Edit Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            placeholder="Center Code"
            value={form.center_code}
            disabled={editing}
            onChange={(e) =>
              setForm({ ...form, center_code: e.target.value })
            }
            required
          />

          <input
            placeholder="Center Name"
            value={form.center_name}
            onChange={(e) =>
              setForm({ ...form, center_name: e.target.value })
            }
            required
          />

          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <button>
            {editing ? "Update Center" : "Add Center"}
          </button>
        </form>

        {/* Center Table */}
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {centers.map((center) => (
              <tr key={center.center_code}>
                <td>{center.center_code}</td>
                <td>{center.center_name}</td>
                <td>{center.email}</td>
                <td>
                  {center.is_active ? (
                    <span style={{ color: "green" }}>Active</span>
                  ) : (
                    <span style={{ color: "red" }}>Inactive</span>
                  )}
                </td>
                <td>
                  <button
                    style={styles.editBtn}
                    onClick={() => handleEdit(center)}
                  >
                    Edit
                  </button>

                  <button
                    style={styles.deleteBtn}
                    onClick={() =>
                      handleDelete(center.center_code)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

const styles = {
  container: {
    padding: "40px",
    background: "#fff",
    borderRadius: "10px"
  },
  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "30px"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse"
  },
  editBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    marginRight: "5px",
    borderRadius: "4px"
  },
  deleteBtn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    borderRadius: "4px"
  }
};

export default ManageCenters;