import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  LogOut,
  FileText,
  ChevronDown,
  ChevronRight,
  Building2,
  BookOpen,
  Layers,
  PanelLeftClose,
  PanelLeftOpen,
  User,
  Users,
  Calendar
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import "./Sidebar.css";

const Sidebar = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("accessToken");

  const [manageOpen, setManageOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  let role = "";
  let name = "";

  if (token) {
    const decoded = jwtDecode(token);
    role = decoded.role;
    name = decoded.name || "User";
  }

  useEffect(() => {
    if (
      location.pathname.includes("/controller") &&
      (
        location.pathname.includes("papers") ||
        location.pathname.includes("centers") ||
        location.pathname.includes("subjects")
      )
    ) {
      setManageOpen(true);
    }
  }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>

      {/* ===== University Logo Header ===== */}
      <div className="sidebar-logo">

        {!collapsed && (
          <div className="university-text">
            <div className="university-name">
              Rayalaseema University
            </div>
            <div className="university-sub">
              Examination Portal
            </div>
          </div>
        )}
      </div>

      {/* ===== User Profile Section ===== */}


      {/* ===== Collapse Button ===== */}
      <div className="collapse-container">
        <button
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* ===== Menu ===== */}
      <div className="menu">

        {role === "controller" && (
          <>
            <MenuItem
              icon={<LayoutDashboard size={18} />}
              label="Dashboard"
              active={isActive("/controller/dashboard")}
              collapsed={collapsed}
              onClick={() => navigate("/controller/dashboard")}
            />

            <MenuItem
              icon={<Upload size={18} />}
              label="Bulk Upload"
              active={isActive("/controller/bulk-upload")}
              collapsed={collapsed}
              onClick={() => navigate("/controller/bulk-upload")}
            />

            {/* Manage */}
            <div>
              <div
                className={`menu-item ${manageOpen ? "active" : ""}`}
                onClick={() => setManageOpen(!manageOpen)}
              >
                <FileText size={18} />
                {!collapsed && <span>Academic Management</span>}
                {!collapsed &&
                  <span className="arrow">
                    {manageOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </span>
                }
              </div>

              <div className={`submenu ${manageOpen ? "open" : ""}`}>
                <SubMenuItem
                  icon={<Layers size={16} />}
                  label="Question Papers"
                  collapsed={collapsed}
                  active={isActive("/controller/papers")}
                  onClick={() => navigate("/controller/papers")}
                />

                <SubMenuItem
                  icon={<Building2 size={16} />}
                  label="Exam Centers"
                  collapsed={collapsed}
                  active={isActive("/controller/centers")}
                  onClick={() => navigate("/controller/centers")}
                />

                <SubMenuItem
                  icon={<BookOpen size={16} />}
                  label="Subjects"
                  collapsed={collapsed}
                  active={isActive("/controller/subjects")}
                  onClick={() => navigate("/controller/subjects")}
                />
                <SubMenuItem
                  icon={<Users size={16} />}
                  label="Manage Users"
                  collapsed={collapsed}
                  active={isActive("/controller/users")}
                  onClick={() => navigate("/controller/users")}
                />
                <SubMenuItem
                  icon={<Calendar size={16} />}
                  label="Exam Schedule"
                  collapsed={collapsed}
                  active={isActive("/controller/schedule")}
                  onClick={() => navigate("/controller/schedule")}
                />
              </div>
            </div>
          </>
        )}

        {role === "principal" && (
          <MenuItem
            icon={<FileText size={18} />}
            label="Assigned Papers"
            collapsed={collapsed}
            active={isActive("/principal/papers")}
            onClick={() => navigate("/principal/papers")}
          />
        )}

        <MenuItem
          icon={<LogOut size={18} />}
          label="Logout"
          collapsed={collapsed}
          onClick={logout}
        />

      </div>
    </div>
  );
};

const MenuItem = ({ icon, label, onClick, active, collapsed }) => (
  <div className={`menu-item ${active ? "active" : ""}`} onClick={onClick}>
    {icon}
    {!collapsed && <span>{label}</span>}
  </div>
);

const SubMenuItem = ({ icon, label, onClick, active, collapsed }) => (
  <div className={`submenu-item ${active ? "active" : ""}`} onClick={onClick}>
    {icon}
    {!collapsed && <span>{label}</span>}
  </div>
);

export default Sidebar;