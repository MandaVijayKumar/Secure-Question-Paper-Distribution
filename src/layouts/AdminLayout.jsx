import Sidebar from "../components/Sidebar";
import TopNavbar from "./TopNavbar";
import '../styles/PaperList.css'
const AdminLayout = ({ children }) => {
  return (
    <div style={styles.wrapper}>
      <Sidebar />

      <div style={styles.main}>
        <TopNavbar />
        <div style={styles.content}>
          {children}
        </div>
      </div>

    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f4f6f9"
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column"
  },
  content: {
    padding: "30px",
    flex: 1
  }
};

export default AdminLayout;