import { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import axios from "axios";
import * as XLSX from "xlsx";

const REQUIRED_COLUMNS = [
  "subject_code",
  "subject_name",
  "course_name",
  "department_name",
  "semester_number",
  "exam_date",
  "session",
  "exam_time",
  "release_time",
  "expiry_time",
  "center_codes",
  "pdf_file_name",
];

const BulkUpload = () => {
  const [excelFile, setExcelFile] = useState(null);
  const [zipFile, setZipFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [columnsValid, setColumnsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);

  // ===== Excel Preview =====
  const handleExcelChange = (e) => {
    const file = e.target.files[0];
    setExcelFile(file);

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      const workbook = XLSX.read(evt.target.result, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      if (!jsonData.length) {
        alert("Excel file is empty");
        return;
      }

      const columns = Object.keys(jsonData[0]);

      const isValid = REQUIRED_COLUMNS.every((col) =>
        columns.includes(col)
      );

      setColumnsValid(isValid);

      if (!isValid) {
        alert("Invalid Excel format. Please use updated template.");
      }

      setPreviewData(jsonData.slice(0, 10));
    };

    reader.readAsBinaryString(file);
  };

  // ===== Upload Handler =====
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!excelFile || !zipFile) {
      alert("Select Excel and ZIP files");
      return;
    }

    if (!columnsValid) {
      alert("Excel format invalid");
      return;
    }

    const formData = new FormData();
    formData.append("excel", excelFile);
    formData.append("zip", zipFile);

    try {
      setLoading(true);
      setProgress(0);
      setResult(null);

      const token = localStorage.getItem("accessToken");

      const response = await axios.post(
        "http://localhost:5000/api/papers/bulk-upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (event) => {
            const percent = Math.round(
              (event.loaded * 100) / event.total
            );
            setProgress(percent);
          },
        }
      );

      setResult(response.data);
      setProgress(100);
      setLoading(false);

    } catch (error) {
      alert(error.response?.data?.message || "Upload failed");
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div style={styles.container}>
        <h2>Bulk Subject Question Paper Upload</h2>

        <form onSubmit={handleUpload} style={styles.form}>

          <div>
            <label>Excel File</label>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleExcelChange}
            />
          </div>

          <div>
            <label>ZIP File (PDFs)</label>
            <input
              type="file"
              accept=".zip"
              onChange={(e) => setZipFile(e.target.files[0])}
            />
          </div>

          {loading && (
            <>
              <div style={styles.progressBar}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${progress}%`,
                  }}
                />
              </div>
              <p>{progress}% Uploading...</p>
            </>
          )}

          <button disabled={loading}>
            {loading ? "Processing..." : "Start Upload"}
          </button>
        </form>

        {/* Preview Section */}
        {previewData.length > 0 && (
          <div style={styles.previewSection}>
            <h3>Excel Preview</h3>

            <table style={styles.table}>
              <thead>
                <tr>
                  {Object.keys(previewData[0]).map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((cell, i) => (
                      <td key={i}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {columnsValid ? (
              <p style={{ color: "green" }}>
                ✔ Excel format valid
              </p>
            ) : (
              <p style={{ color: "red" }}>
                ⚠ Invalid Excel format
              </p>
            )}
          </div>
        )}

        {/* Result */}
        {result && (
          <div style={styles.result}>
            <p>Total Records: {result.total}</p>
            <p style={{ color: "green" }}>
              Success: {result.success}
            </p>
            <p style={{ color: "red" }}>
              Failed: {result.failed}
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

const styles = {
  container: {
    padding: "40px",
    background: "#fff",
    borderRadius: "10px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  progressBar: {
    width: "100%",
    height: "8px",
    background: "#e2e8f0",
    borderRadius: "5px",
  },
  progressFill: {
    height: "100%",
    background: "#2563eb",
  },
  previewSection: {
    marginTop: "40px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "15px",
  },
  result: {
    marginTop: "30px",
    padding: "20px",
    background: "#f8fafc",
  },
};

export default BulkUpload;