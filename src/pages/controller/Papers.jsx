import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../layouts/AdminLayout";

const ManagePapers = () => {

  const [papers, setPapers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [allCenters, setAllCenters] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [editCenters, setEditCenters] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null); // { type: "success" | "error", message: "" }

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchPapers();
    fetchCenters();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, filterStatus, papers]);

  // ================= FETCH PAPERS =================
  const fetchPapers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:5000/api/papers",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPapers(res.data);
      setError("");
    } catch (err) {
      setError("Failed to load papers");
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH CENTERS =================
  const fetchCenters = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/centers/list",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setAllCenters(res.data);
  };

  // ================= STATUS =================
  const getStatus = (paper) => {
    const now = new Date();
    const release = new Date(paper.release_time);
    const expiry = new Date(paper.expiry_time);

    if (!paper.is_released) return "Not Released";
    if (now < release) return "Scheduled";
    if (now > expiry) return "Expired";
    return "Live";
  };

  // ================= FILTER =================
  const applyFilters = () => {
    let data = [...papers];

    if (search) {
      data = data.filter(p =>
        p.subject_code?.toLowerCase().includes(search.toLowerCase()) ||
        p.subject_name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterStatus !== "All") {
      data = data.filter(p => getStatus(p) === filterStatus);
    }

    setFiltered(data);
  };

  // ================= TOGGLE RELEASE =================
  const togglePaper = async (code) => {
    await axios.patch(
      `http://localhost:5000/api/papers/toggle/${code}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchPapers();
  };

  // ================= DELETE =================
  const deletePaper = async (code) => {
    if (!window.confirm("Delete this paper?")) return;

    await axios.delete(
      `http://localhost:5000/api/papers/${code}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchPapers();
  };

  // ================= DOWNLOAD =================
  const downloadPaper = async (code) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/papers/download/${code}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob"
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${code}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Download failed");
    }
  };

  // ================= CENTER MANAGEMENT =================
  const openCenterManager = (paper) => {
    setSelectedPaper(paper);
    const currentCenters = paper.center_codes
      ? paper.center_codes.split(",")
      : [];
    setEditCenters(currentCenters);
  };

  const toggleCenter = (code) => {
    if (editCenters.includes(code)) {
      setEditCenters(editCenters.filter(c => c !== code));
    } else {
      setEditCenters([...editCenters, code]);
    }
  };


  const saveCenters = async () => {

    try {

      setSaving(true);

      await axios.put(
        `http://localhost:5000/api/papers/${selectedPaper.subject_code}/centers`,
        { center_codes: editCenters },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setToast({
        type: "success",
        message: "Centers updated successfully"
      });

      setSelectedPaper(null);
      fetchPapers();

    } catch (err) {

      setToast({
        type: "error",
        message: err.response?.data?.message || "Update failed"
      });

    } finally {
      setSaving(false);

      // Auto-hide after 3 seconds
      setTimeout(() => setToast(null), 3000);
    }
  };
  // ================= FORMAT =================
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

  const formatDateTime = (date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

  const getBadgeStyle = (status) => {
    switch (status) {
      case "Live": return styles.liveBadge;
      case "Expired": return styles.expiredBadge;
      case "Scheduled": return styles.scheduledBadge;
      default: return styles.pendingBadge;
    }
  };

  return (
    <AdminLayout>
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            background: toast.type === "success" ? "#16a34a" : "#dc2626",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 9999,
            fontSize: "14px"
          }}
        >
          {toast.message}
        </div>
      )}
      <div style={styles.container}>

        <h2 style={styles.heading}>Paper Management</h2>

        {loading && <p>Loading papers...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* FILTER */}
        <div style={styles.filterBar}>
          <input
            type="text"
            placeholder="Search subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={styles.select}
          >
            <option>All</option>
            <option>Live</option>
            <option>Expired</option>
            <option>Scheduled</option>
            <option>Not Released</option>
          </select>
        </div>

        {/* CARDS */}
        <div style={styles.grid}>
          {filtered.map((paper) => {
            const status = getStatus(paper);
            const centerCodes = paper.center_codes
              ? paper.center_codes.split(",")
              : [];
            const centerNames = paper.center_names
              ? paper.center_names.split(",")
              : [];

            return (
              <div key={paper.subject_code} style={styles.card}>

                <div style={styles.cardHeader}>
                  <div>
                    <div style={styles.subjectName}>{paper.subject_name}</div>
                    <div style={styles.subjectMeta}>
                      {paper.subject_code} • {paper.course_name} • {paper.department_name}
                    </div>
                    <div style={styles.semester}>
                      Semester {paper.semester_number}
                    </div>
                  </div>

                  <span style={getBadgeStyle(status)}>{status}</span>
                </div>

                <div style={styles.cardBody}>
                  <div><strong>Exam:</strong> {formatDate(paper.exam_date)} ({paper.session})</div>
                  <div><strong>Release:</strong> {formatDateTime(paper.release_time)}</div>
                  <div><strong>Expiry:</strong> {formatDateTime(paper.expiry_time)}</div>

                  <div>
                    <strong>Assigned Centers:</strong>
                    {centerCodes.length > 0 ? (
                      <select style={styles.dropdown}>
                        {centerCodes.map((code, index) => (
                          <option key={code}>
                            {centerNames[index] || code} ({code})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div style={{ color: "#999" }}>No Centers Assigned</div>
                    )}
                  </div>
                </div>

                <div style={styles.cardActions}>
                  <button
                    style={styles.downloadBtn}
                    onClick={() => downloadPaper(paper.subject_code)}
                  >
                    Download
                  </button>

                  <button
                    style={paper.is_released ? styles.closeBtn : styles.releaseBtn}
                    onClick={() => togglePaper(paper.subject_code)}
                  >
                    {paper.is_released ? "Close" : "Release"}
                  </button>

                  <button
                    style={styles.manageBtn}
                    onClick={() => openCenterManager(paper)}
                  >
                    Manage Centers
                  </button>

                  <button
                    style={styles.deleteBtn}
                    onClick={() => deletePaper(paper.subject_code)}
                  >
                    Delete
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* MODAL */}
        {selectedPaper && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h3>Manage Centers – {selectedPaper.subject_name}</h3>

              <div style={styles.centerList}>
                {allCenters.map(center => (
                  <label key={center.center_code} style={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={editCenters.includes(center.center_code)}
                      onChange={() => toggleCenter(center.center_code)}
                    />
                    {center.center_name} ({center.center_code})
                  </label>
                ))}
              </div>

              <div style={styles.modalActions}>
                <button
                  style={styles.cancelBtn}
                  onClick={() => setSelectedPaper(null)}
                >
                  Cancel
                </button>
                <button
                  style={styles.saveBtn}
                  onClick={saveCenters}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

// ================= STYLES =================
const styles = {
  container: {
    padding: "40px",
    background: "#f4f6f9",
    minHeight: "100vh"
  },
  heading: { marginBottom: "25px" },
  filterBar: { display: "flex", gap: "15px", marginBottom: "30px" },
  searchInput: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    width: "300px"
  },
  select: { padding: "8px", borderRadius: "6px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    gap: "25px"
  },
  card: {
    background: "#fff",
    borderRadius: "14px",
    padding: "22px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)"
  },
  cardHeader: { display: "flex", justifyContent: "space-between" },
  subjectName: { fontWeight: "700", fontSize: "16px" },
  subjectMeta: { fontSize: "13px", color: "#6b7280" },
  semester: { fontSize: "12px", color: "#374151" },
  cardBody: { marginTop: "15px", fontSize: "14px" },
  cardActions: { display: "flex", gap: "8px", marginTop: "15px", flexWrap: "wrap" },
  dropdown: { marginTop: "6px", padding: "6px", borderRadius: "6px", width: "100%" },
  downloadBtn: { background: "#2563eb", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer" },
  releaseBtn: { background: "#16a34a", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer" },
  closeBtn: { background: "#dc2626", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer" },
  manageBtn: { background: "#1e40af", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer" },
  deleteBtn: { background: "#7c2d12", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer" },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  modal: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    width: "420px",
    maxHeight: "500px",
    overflowY: "auto"
  },
  centerList: { marginTop: "15px" },
  checkbox: { display: "block", marginBottom: "8px" },
  modalActions: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" },
  cancelBtn: { background: "#9ca3af", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px" },
  saveBtn: { background: "#16a34a", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px" },
  liveBadge: { background: "#dcfce7", color: "#166534", padding: "4px 10px", borderRadius: "20px" },
  expiredBadge: { background: "#fee2e2", color: "#991b1b", padding: "4px 10px", borderRadius: "20px" },
  scheduledBadge: { background: "#e0f2fe", color: "#0369a1", padding: "4px 10px", borderRadius: "20px" },
  pendingBadge: { background: "#fef3c7", color: "#92400e", padding: "4px 10px", borderRadius: "20px" }
};

export default ManagePapers;