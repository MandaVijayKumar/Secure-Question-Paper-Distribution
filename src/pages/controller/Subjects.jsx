import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../layouts/AdminLayout";

const Subjects = () => {

  const [subjects, setSubjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [assignedCenters, setAssignedCenters] = useState([]);
  const [allCenters, setAllCenters] = useState([]);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    const res = await axios.get(
      "https://ru-quesitonpapers-backend.onrender.com/api/subjects",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setSubjects(res.data);
  };

  const openEdit = async (subject_code) => {

    const res = await axios.get(
      `https://ru-quesitonpapers-backend.onrender.com/api/subjects/${subject_code}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setSelected(res.data.subject);
    setAssignedCenters(res.data.assignedCenters.map(c => c.center_code));
    setAllCenters(res.data.allCenters);
  };

  const toggleCenter = (code) => {

    if (assignedCenters.includes(code)) {
      setAssignedCenters(assignedCenters.filter(c => c !== code));
    } else {
      setAssignedCenters([...assignedCenters, code]);
    }
  };

  const saveCenters = async () => {

    await axios.put(
      `https://ru-quesitonpapers-backend.onrender.com/api/subjects/${selected.subject_code}/centers`,
      { center_codes: assignedCenters },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Centers updated successfully");
    setSelected(null);
  };

  return (
    <AdminLayout>
      <div style={styles.container}>

        <h2 style={styles.heading}>Subject Center Management</h2>

        <div style={styles.grid}>
          {subjects.map((sub) => (
            <div key={sub.subject_code} style={styles.card}>
              <div style={styles.subjectName}>{sub.subject_name}</div>
              <div style={styles.subjectCode}>{sub.subject_code}</div>
              <div style={styles.meta}>
                {sub.course_name} • {sub.department_name}
              </div>

              <button
                style={styles.editBtn}
                onClick={() => openEdit(sub.subject_code)}
              >
                Manage Centers
              </button>
            </div>
          ))}
        </div>

        {/* ===== MODAL ===== */}
        {selected && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>

              <h3>
                Assign Centers – {selected.subject_name}
              </h3>

              <div style={styles.centerList}>
                {allCenters.map(center => (
                  <label key={center.center_code} style={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={assignedCenters.includes(center.center_code)}
                      onChange={() => toggleCenter(center.center_code)}
                    />
                    {center.center_name} ({center.center_code})
                  </label>
                ))}
              </div>

              <div style={styles.modalActions}>
                <button
                  style={styles.cancelBtn}
                  onClick={() => setSelected(null)}
                >
                  Cancel
                </button>

                <button
                  style={styles.saveBtn}
                  onClick={saveCenters}
                >
                  Save Changes
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

const styles = {
  container: {
    padding: "40px",
    background: "#f4f6f9",
    minHeight: "100vh"
  },
  heading: {
    marginBottom: "30px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px"
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.05)"
  },
  subjectName: {
    fontWeight: "600",
    fontSize: "15px"
  },
  subjectCode: {
    fontSize: "13px",
    color: "#6b7280"
  },
  meta: {
    fontSize: "12px",
    marginBottom: "12px"
  },
  editBtn: {
    background: "#1e3a8a",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer"
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  modal: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    width: "400px"
  },
  centerList: {
    marginTop: "15px",
    maxHeight: "200px",
    overflowY: "auto"
  },
  checkbox: {
    display: "block",
    marginBottom: "8px"
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "20px",
    gap: "10px"
  },
  cancelBtn: {
    background: "#9ca3af",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer"
  },
  saveBtn: {
    background: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

export default Subjects;