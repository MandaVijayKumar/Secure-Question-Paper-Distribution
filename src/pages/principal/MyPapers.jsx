import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../layouts/AdminLayout";

const MyPapers = () => {

  const [papers, setPapers] = useState([]);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    const res = await axios.get(
      "https://ru-quesitonpapers-backend.onrender.com/api/principal/papers",
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    setPapers(res.data);
  };

  const downloadPaper = async (code) => {
    try {
      const response = await axios.get(
        `https://ru-quesitonpapers-backend.onrender.com/api/principal/download/${code}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob"
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

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

  const getStatus = (paper) => {
    if (!paper.is_released) return "Not Released";

    const now = new Date();
    const expiry = new Date(paper.expiry_time);

    if (now > expiry) return "Expired";
    return "Live";
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

  const formatDateTime = (date) => {
  if (!date) return "—";

  const d = new Date(date);

  if (isNaN(d)) return "Invalid Date";

  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata"
  });
};

  return (
    <AdminLayout>
      <div style={styles.pageWrapper}>

        <div style={styles.headerCard}>
          <h2 style={styles.pageTitle}>Assigned Question Papers</h2>
          <p style={styles.subtitle}>
            Secure access to released examination papers
          </p>
        </div>

        <div style={styles.grid}>
          {papers.map((paper) => {
            const status = getStatus(paper);

            return (
              <div key={paper.subject_code} style={styles.card}>
                
                <div style={styles.cardHeader}>
                 <div>
  <h3 style={styles.subjectName}>
    {paper.subject_name || "Subject"}
  </h3>
  <p style={styles.subjectCode}>
    {paper.subject_code}
  </p>
</div>
                  <span style={getStatusBadge(status)}>
                    {status}
                  </span>
                </div>

                <div style={styles.cardBody}>
                  <p><strong>Exam Date:</strong> {formatDate(paper.exam_date)}</p>
                  <p><strong>Session:</strong> {paper.session}</p>
                  <p><strong>Release:</strong> {formatDateTime(paper.release_time)}</p>
                  <p><strong>Expiry:</strong> {formatDateTime(paper.expiry_time)}</p>
                </div>

                <div style={styles.cardFooter}>
                  {status === "Live" ? (
                    <button
                      style={styles.downloadBtn}
                      onClick={() =>
                        downloadPaper(paper.subject_code)
                      }
                    >
                      Download Paper
                    </button>
                  ) : (
                    <button
                      style={styles.disabledBtn}
                      disabled
                    >
                      Not Available
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </AdminLayout>
  );
};

const getStatusBadge = (status) => {
  if (status === "Live")
    return { ...styles.badge, backgroundColor: "#16a34a" };

  if (status === "Expired")
    return { ...styles.badge, backgroundColor: "#dc2626" };

  return { ...styles.badge, backgroundColor: "#d97706" };
};

const styles = {

  pageWrapper: {
    padding: "40px",
    background: "#f4f6f9",
    minHeight: "100vh"
  },

  headerCard: {
    background: "#ffffff",
    padding: "25px",
    borderRadius: "12px",
    marginBottom: "30px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
  },

  pageTitle: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "700"
  },

  subtitle: {
    marginTop: "6px",
    color: "#6b7280",
    fontSize: "14px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "20px"
  },

  card: {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    transition: "0.3s",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px"
  },

  subject: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "600"
  },

  badge: {
    color: "#fff",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600"
  },

  cardBody: {
    fontSize: "14px",
    lineHeight: "1.8",
    color: "#374151"
  },

  cardFooter: {
    marginTop: "20px"
  },

  downloadBtn: {
    width: "100%",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600"
  },

  disabledBtn: {
    width: "100%",
    background: "#9ca3af",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "8px"
  },
  subjectName: {
  margin: 0,
  fontSize: "18px",
  fontWeight: "600",
  color: "#111827"
},

subjectCode: {
  margin: 0,
  fontSize: "13px",
  color: "#6b7280",
  marginTop: "3px",
  letterSpacing: "0.5px"
},
};

export default MyPapers;