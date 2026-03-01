import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./routes/ProtectedRoute";

import ControllerDashboard from "./pages/controller/Dashboard";
import BulkUpload from "./pages/controller/BulkUpload";
import Centers from "./pages/controller/Centers";
import Subjects from "./pages/controller/Subjects";
import Papers from "./pages/controller/Papers";

import PrincipalDashboard from "./pages/principal/Dashboard";
import PapersList from "./pages/controller/PapersList";
import MyPapers from "./pages/principal/MyPapers";
import { Users } from "lucide-react";
import ManageUser from "./pages/controller/Users";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/controller/dashboard"
        element={
          <ProtectedRoute role="controller">
            <ControllerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/controller/bulk-upload"
        element={
          <ProtectedRoute role="controller">
            <BulkUpload />
          </ProtectedRoute>
        }
      />

      <Route
        path="/controller/centers"
        element={
          <ProtectedRoute role="controller">
            <Centers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/controller/subjects"
        element={
          <ProtectedRoute role="controller">
            <Subjects />
          </ProtectedRoute>
        }
      />

      <Route
        path="/controller/papers"
        element={
          <ProtectedRoute role="controller">
            <Papers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/controller/paperslist"
        element={
          <ProtectedRoute role="controller">
            <PapersList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/controller/users"
        element={
          <ProtectedRoute role="controller">
            <ManageUser />
          </ProtectedRoute>
        }
      />
      <Route
        path="/principal/dashboard"
        element={
          <ProtectedRoute role="principal">
            <PrincipalDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/principal/papers"
        element={
          <ProtectedRoute role="principal">
            <MyPapers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/principal/papers"
        element={
          <ProtectedRoute role="principal">
            <PrincipalDashboard />
          </ProtectedRoute>
        }
      />
      {/* <Route
        path="/controller/users"
        element={
          <ProtectedRoute role="controller">
            <Users />
          </ProtectedRoute>
        }
      /> */}
    </Routes>
  );
}

export default App;