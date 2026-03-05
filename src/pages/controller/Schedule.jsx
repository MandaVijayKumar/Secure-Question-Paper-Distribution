import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../layouts/AdminLayout";

const Schedule = () => {

    const [papers, setPapers] = useState([]);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState({});
    const [toast, setToast] = useState(null);

    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        fetchPapers();
    }, []);

    const fetchPapers = async () => {
        const res = await axios.get(
            "https://ru-quesitonpapers-backend.onrender.com/api/papers",
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setPapers(res.data);
    };

    const openEdit = (paper) => {
        setSelected(paper);
        setForm({
            exam_date: paper.exam_date?.slice(0, 10),
            release_time: paper.release_time?.slice(0, 16),
            expiry_time: paper.expiry_time?.slice(0, 16)
        });
    };

    const saveSchedule = async () => {

        await axios.put(
            `https://ru-quesitonpapers-backend.onrender.com/api/papers/schedule/${selected.subject_code}`,
            form,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        setToast("Schedule updated successfully");
        setSelected(null);
        fetchPapers();

        setTimeout(() => setToast(null), 3000);
    };
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

    const formatDateOnly = (date) => {
        if (!date) return "—";

        const d = new Date(date);

        return d.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "Asia/Kolkata"
        });
    };

    return (
        <AdminLayout>
            <div style={styles.container}>

                <h2>Exam Schedule Management</h2>

                {toast && <div style={styles.toast}>{toast}</div>}

                <div style={styles.grid}>
                    {papers.map(paper => (
                        <div key={paper.subject_code} style={styles.card}>
                            <h4>{paper.subject_name}</h4>
                            <p>{paper.subject_code}</p>
                            <p><strong>Exam:</strong> {formatDateOnly(paper.exam_date)}</p>
                            <p><strong>Release:</strong> {formatDateTime(paper.release_time)}</p>
                            <p><strong>Expiry:</strong> {formatDateTime(paper.expiry_time)}</p>
                            <button
                                style={styles.editBtn}
                                onClick={() => openEdit(paper)}
                            >
                                Edit Schedule
                            </button>
                        </div>
                    ))}
                </div>

                {/* MODAL */}
                {selected && (
                    <div style={styles.modalOverlay}>
                        <div style={styles.modal}>

                            <h3>Edit Schedule – {selected.subject_name}</h3>

                            <label>Exam Date</label>
                            <input
                                type="date"
                                value={form.exam_date}
                                onChange={(e) =>
                                    setForm({ ...form, exam_date: e.target.value })
                                }
                            />

                            <label>Release Time</label>
                            <input
                                type="datetime-local"
                                value={form.release_time}
                                onChange={(e) =>
                                    setForm({ ...form, release_time: e.target.value })
                                }
                            />

                            <label>Expiry Time</label>
                            <input
                                type="datetime-local"
                                value={form.expiry_time}
                                onChange={(e) =>
                                    setForm({ ...form, expiry_time: e.target.value })
                                }
                            />

                            <div style={styles.actions}>
                                <button onClick={() => setSelected(null)}>Cancel</button>
                                <button onClick={saveSchedule}>Save</button>
                            </div>

                        </div>
                    </div>
                )}

            </div>
        </AdminLayout>
    );
};

const styles = {
    container: { padding: "40px" },
    grid: { display: "grid", gap: "20px" },
    card: {
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
    },
    editBtn: {
        marginTop: "10px",
        background: "#1e40af",
        color: "#fff",
        border: "none",
        padding: "6px 12px",
        borderRadius: "6px"
    },
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
        width: "400px",
        display: "flex",
        flexDirection: "column",
        gap: "10px"
    },
    actions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px"
    },
    toast: {
        background: "#16a34a",
        color: "#fff",
        padding: "10px",
        marginBottom: "20px",
        borderRadius: "6px"
    }
};

export default Schedule;