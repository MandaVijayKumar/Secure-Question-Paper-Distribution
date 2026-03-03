import { useEffect, useState } from "react";
import axios from "axios";
import '../../styles/PaperList.css'
import AdminLayout from "../../layouts/AdminLayout";

const PapersList = () => {

  const [papers, setPapers] = useState([]);
  const [centers, setCenters] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [formData, setFormData] = useState({});

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchPapers();
    fetchCenters();
  }, []);

  const fetchPapers = async () => {
    const res = await axios.get("http://localhost:5000/api/papers", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setPapers(res.data);
  };

  const fetchCenters = async () => {
    const res = await axios.get("http://localhost:5000/api/centers/list", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setCenters(res.data);
  };

  const toggleRelease = async (paper) => {
    await axios.patch(
      `http://localhost:5000/api/papers/release/${paper.subject_code}`,
      { is_released: !paper.is_released },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchPapers();
  };

  const handleDelete = async (code) => {
    if (!window.confirm("Delete this paper?")) return;

    await axios.delete(
      `http://localhost:5000/api/papers/${code}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchPapers();
  };

  const openEditModal = (paper) => {
    setSelectedPaper(paper);
    setFormData({
      ...paper,
      center_codes: paper.centers || ""
    });
  };

  const handleUpdate = async () => {
    await axios.put(
      `http://localhost:5000/api/papers/${selectedPaper.subject_code}`,
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setSelectedPaper(null);
    fetchPapers();
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">
          Subject → Paper → Center Mapping
        </h2>

        <div className="overflow-x-auto bg-white shadow rounded-xl">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase">
              <tr>
                <th className="p-4">Subject</th>
                <th>Course</th>
                <th>Semester</th>
                <th>Exam Date</th>
                <th>Session</th>
                <th>Centers</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {papers.map((p) => (
                <tr key={p.subject_code} className="border-t">
                  <td className="p-4">{p.subject_name}</td>
                  <td>{p.course_name}</td>
                  <td>{p.semester_number}</td>
                  <td>{p.exam_date?.slice(0,10)}</td>
                  <td>{p.session}</td>
                  <td>{p.centers}</td>

                  <td>
                    <button
                      onClick={() => toggleRelease(p)}
                      className={`px-3 py-1 rounded-full text-white text-xs ${
                        p.is_released
                          ? "bg-green-600"
                          : "bg-red-500"
                      }`}
                    >
                      {p.is_released ? "Released" : "Not Released"}
                    </button>
                  </td>

                  <td className="space-x-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(p.subject_code)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= MODAL ================= */}

        {selectedPaper && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-96 space-y-4">
              <h3 className="text-lg font-bold">
                Edit {selectedPaper.subject_name}
              </h3>

              <input
                type="date"
                value={formData.exam_date?.slice(0,10)}
                onChange={(e) =>
                  setFormData({ ...formData, exam_date: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <input
                type="text"
                placeholder="Exam Time"
                value={formData.exam_time}
                onChange={(e) =>
                  setFormData({ ...formData, exam_time: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <select
                multiple
                className="w-full border p-2 rounded h-32"
                value={formData.center_codes?.split(",")}
                onChange={(e) => {
                  const values = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  );
                  setFormData({
                    ...formData,
                    center_codes: values.join(",")
                  });
                }}
              >
                {centers.map((c) => (
                  <option key={c.center_code} value={c.center_code}>
                    {c.center_name}
                  </option>
                ))}
              </select>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setSelectedPaper(null)}
                  className="px-4 py-2 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PapersList;