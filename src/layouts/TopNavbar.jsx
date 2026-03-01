import { jwtDecode } from "jwt-decode";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TopNavbar = () => {
  const navigate = useNavigate();

  // ✅ FIXED HERE
  const token = localStorage.getItem("accessToken");

  let name = "";
  let role = "";

  if (token) {
    const decoded = jwtDecode(token);
    name = decoded.name;
    role = decoded.role;
  }

  const logout = () => {
    localStorage.removeItem("accessToken"); // ✅ also fix here
    navigate("/");
  };

  return (
    <div style={styles.navbar}>
      <div style={styles.left}>
        <img
          src="/logo.png"
          alt="University Logo"
          style={styles.logo}
        />
        <div>
          <h3 style={styles.title}>Secure Examination Portal</h3>
          <p style={styles.subtitle}>University Examination System</p>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.userInfo}>
          {/* <span style={styles.userName}>{name}</span> */}
          <span style={styles.roleBadge}>
            {role?.toUpperCase()}
          </span>
        </div>

        <button style={styles.logoutBtn} onClick={logout}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
};

const styles = {
  navbar: {
    height: "70px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e0e6ed",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 30px"
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "15px"
  },
  logo: {
    width: "50px",
    height: "50px"
  },
  title: {
    margin: 0,
    color: "#1c2e4a"
  },
  subtitle: {
    margin: 0,
    fontSize: "12px",
    color: "#888"
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "20px"
  },
  userInfo: {
    textAlign: "right"
  },
  userName: {
    fontWeight: "600",
    display: "block"
  },
  roleBadge: {
    backgroundColor: "#1c2e4a",
    color: "#fff",
    fontSize: "12px",
    padding: "3px 8px",
    borderRadius: "12px"
  },
  logoutBtn: {
    backgroundColor: "#b22222",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px"
  }
};

export default TopNavbar;