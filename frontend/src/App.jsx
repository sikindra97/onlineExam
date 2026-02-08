// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { AuthProvider } from "./contexts/AuthContext";
// import { ThemeModeProvider } from "./contexts/ThemeContext";
// import PrivateRoute from "./components/PrivateRoute";
// import Layout from "./components/Layout";

// // Pages
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import Exam from "./pages/Exam";
// import EditExam from "./pages/EditExam";
// import CreateExam from "./pages/CreateExam";
// import Results from "./pages/Results";
// import MyResults from "./pages/MyResults";
// import ExamList from "./pages/ExamList";
// import TeacherLiveResults from "./pages/TeacherLiveResults"; // ✅ NEW

// function App() {
//   return (
//     <ThemeModeProvider>
//       <Router>
//         <AuthProvider>
//           <Layout>
//             <Routes>
//               {/* ================= PUBLIC ================= */}
//               <Route path="/login" element={<Login />} />
//               <Route path="/register" element={<Register />} />

//               {/* ================= DASHBOARD ================= */}
//               <Route
//                 path="/"
//                 element={
//                   <PrivateRoute>
//                     <Dashboard />
//                   </PrivateRoute>
//                 }
//               />

//               {/* ================= EXAMS ================= */}
//               <Route
//                 path="/exam/:id"
//                 element={
//                   <PrivateRoute>
//                     <Exam />
//                   </PrivateRoute>
//                 }
//               />

//               <Route
//                 path="/create-exam"
//                 element={
//                   <PrivateRoute allowedRoles={["teacher", "admin"]}>
//                     <CreateExam />
//                   </PrivateRoute>
//                 }
//               />

//               <Route
//                 path="/exam/edit/:id"
//                 element={
//                   <PrivateRoute allowedRoles={["teacher", "admin"]}>
//                     <EditExam />
//                   </PrivateRoute>
//                 }
//               />

//               {/* ================= RESULTS ================= */}
//               <Route
//                 path="/exam/results/:id"
//                 element={
//                   <PrivateRoute allowedRoles={["teacher", "admin"]}>
//                     <Results />
//                   </PrivateRoute>
//                 }
//               />

//               {/* 🔴 LIVE RESULTS (NEW) */}
//               <Route
//                 path="/exam/results/live/:examId"
//                 element={
//                   <PrivateRoute allowedRoles={["teacher", "admin"]}>
//                     <TeacherLiveResults />
//                   </PrivateRoute>
//                 }
//               />

//               <Route
//                 path="/results"
//                 element={
//                   <PrivateRoute allowedRoles={["student"]}>
//                     <Results />
//                   </PrivateRoute>
//                 }
//               />

//               <Route
//                 path="/my-results"
//                 element={
//                   <PrivateRoute allowedRoles={["student"]}>
//                     <MyResults />
//                   </PrivateRoute>
//                 }
//               />

//               {/* ================= LIST ================= */}
//               <Route
//                 path="/exam-list"
//                 element={
//                   <PrivateRoute>
//                     <ExamList />
//                   </PrivateRoute>
//                 }
//               />

//               {/* ================= FALLBACK ================= */}
//               <Route path="*" element={<Navigate to="/" />} />
//             </Routes>
//           </Layout>
//         </AuthProvider>
//       </Router>
//     </ThemeModeProvider>
//   );
// }

// export default App;




import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeModeProvider } from "./contexts/ThemeContext";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Exam from "./pages/Exam";
import EditExam from "./pages/EditExam";
import CreateExam from "./pages/CreateExam";
import Results from "./pages/Results";
import MyResults from "./pages/MyResults";
import ExamList from "./pages/ExamList";
import TeacherLiveResults from "./pages/TeacherLiveResults";
import StudentExamResult from "./pages/StudentExamResult";
import Contact from "./pages/Contact";
import AdminMessages from "./pages/AdminMessages"; // ✅ NEW

function App() {
  return (
    <ThemeModeProvider>
      <Router>
        <AuthProvider>
          <Layout>
            <Routes>
              {/* ================= PUBLIC ================= */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* ================= DASHBOARD ================= */}
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />

              {/* ================= CONTACT ================= */}
              <Route
                path="/contact"
                element={
                  <PrivateRoute>
                    <Contact />
                  </PrivateRoute>
                }
              />

              {/* ================= ADMIN / TEACHER MESSAGES ================= */}
              <Route
                path="/admin/messages"
                element={
                  <PrivateRoute allowedRoles={["admin", "teacher"]}>
                    <AdminMessages />
                  </PrivateRoute>
                }
              />

              {/* ================= EXAMS ================= */}
              <Route
                path="/exam/:id"
                element={
                  <PrivateRoute>
                    <Exam />
                  </PrivateRoute>
                }
              />

              <Route
                path="/create-exam"
                element={
                  <PrivateRoute allowedRoles={["teacher", "admin"]}>
                    <CreateExam />
                  </PrivateRoute>
                }
              />

              <Route
                path="/exam/edit/:id"
                element={
                  <PrivateRoute allowedRoles={["teacher", "admin"]}>
                    <EditExam />
                  </PrivateRoute>
                }
              />

              {/* ================= RESULTS ================= */}
              <Route
                path="/exam/results/:id"
                element={
                  <PrivateRoute allowedRoles={["teacher", "admin"]}>
                    <Results />
                  </PrivateRoute>
                }
              />

              {/* ================= STUDENT EXAM RESULT ================= */}
              <Route
                path="/exam/result/:examId"
                element={
                  <PrivateRoute allowedRoles={["student"]}>
                    <StudentExamResult />
                  </PrivateRoute>
                }
              />

              {/* ================= LIVE RESULTS ================= */}
              <Route
                path="/exam/results/live/:examId"
                element={
                  <PrivateRoute allowedRoles={["teacher", "admin"]}>
                    <TeacherLiveResults />
                  </PrivateRoute>
                }
              />

              <Route
                path="/results"
                element={
                  <PrivateRoute allowedRoles={["student"]}>
                    <Results />
                  </PrivateRoute>
                }
              />

              <Route
                path="/my-results"
                element={
                  <PrivateRoute allowedRoles={["student"]}>
                    <MyResults />
                  </PrivateRoute>
                }
              />

              {/* ================= LIST ================= */}
              <Route
                path="/exam-list"
                element={
                  <PrivateRoute>
                    <ExamList />
                  </PrivateRoute>
                }
              />

              {/* ================= FALLBACK ================= */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </Router>
    </ThemeModeProvider>
  );
}

export default App;
