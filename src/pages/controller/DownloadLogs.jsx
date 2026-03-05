import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../layouts/AdminLayout";

const DownloadLogs = () => {

  const [logs,setLogs] = useState([]);

  const token = localStorage.getItem("accessToken");

  useEffect(()=>{
    fetchLogs();
  },[]);

  const fetchLogs = async () => {

    const res = await axios.get(
      "http://localhost:5000/api/logs/downloads",
      { headers:{Authorization:`Bearer ${token}`} }
    );

    setLogs(res.data);
    console.log(res.data)
  };

  return (
    <AdminLayout>

      <div style={{padding:"40px"}}>

        <h2>Question Paper Download Logs</h2>

        <table border="1" width="100%" cellPadding="8">

          <thead>
            <tr>
              <th>Subject Code</th>
              <th>Subject Name</th>
              <th>Center</th>
              <th>Principal</th>
              <th>Email</th>
              <th>Downloaded At</th>
            </tr>
          </thead>

          <tbody>

            {logs.map(log=>(
              <tr key={log.log_id}>
                <td>{log.subject_code}</td>
                <td>{log.subject_name}</td>
                <td>{log.center_name}-{log.center_code}</td>
                <td>{log.principal_name}</td>
                <td>{log.principal_email}</td>
                <td>{new Date(log.downloaded_at).toLocaleString("en-IN")}</td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </AdminLayout>
  );
};

export default DownloadLogs;