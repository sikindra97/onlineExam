

import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  Stack,
  CircularProgress,
  Box,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  PlayArrow as StartIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { useSearchParams } from "react-router-dom";

/* =========================
   Safe Date Formatter
========================= */
const formatDateTime = (value) => {
  if (!value) return "Not Scheduled";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "Not Scheduled";
  return d.toLocaleString("en-IN");
};

/* =========================
   CARD HOVER STYLE
========================= */
const cardHoverStyle = {
  height: "100%",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-6px)",
    boxShadow: "0 0 18px rgba(25,118,210,0.45)",
  },
};

export default function Dashboard() {
  const { user } = useAuth();
  const role = user?.role;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter");
  const view = searchParams.get("view"); // New parameter for view type

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageCount, setMessageCount] = useState(0);


  /* =========================
     FETCH EXAMS
  ========================= */
  const fetchExams = async () => {
    try {
      const res = await api.get("/exam");
      setExams(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  /* =========================
   FETCH CONTACT MESSAGES COUNT (ADMIN / TEACHER)
========================= */
const fetchMessageCount = async () => {
  try {
    const res = await api.get("/messages");
    setMessageCount(res.data.length);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  // fetch exams for everyone
  fetchExams();

  // fetch messages only for admin / teacher
  if (role === "admin" || role === "teacher") {
    fetchMessageCount();
  }

  const interval = setInterval(() => {
    fetchExams();

    if (role === "admin" || role === "teacher") {
      fetchMessageCount();
    }
  }, 30000);

  return () => clearInterval(interval);
}, [role]);

  /* =========================
     DELETE EXAM (ADMIN ONLY)
  ========================= */
  const deleteExam = async (examId) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;
    try {
      await api.delete(`/exam/${examId}`);
      fetchExams();
    } catch {
      alert("Delete failed");
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 6, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  /* =========================
     FILTER EXAMS BASED ON URL PARAM
  ========================= */
  let filteredExams = exams;

  if (filter) {
    switch (filter) {
      case "ACTIVE":
        filteredExams = exams.filter(e => 
          e.status === "LIVE" || e.examType === "PRACTICE"
        );
        break;
      case "UPCOMING":
        filteredExams = exams.filter(e => e.status === "UPCOMING");
        break;
      case "LIVE":
        filteredExams = exams.filter(e => e.status === "LIVE");
        break;
      case "HISTORY":
        filteredExams = exams.filter(e => e.hasAttempted || e.status === "ENDED");
        break;
      default:
        filteredExams = exams;
    }
  }

  /* =========================
     STUDENT FILTERS
  ========================= */
  const activeExams = exams.filter(
    (e) =>
      e.status === "LIVE" ||
      e.status === "UPCOMING" ||
      e.examType === "PRACTICE"
  );

  const historyExams = exams.filter(
    (e) => e.hasAttempted || e.status === "ENDED"
  );
const endedExams = [...historyExams].sort((a, b) => {
  return (b.hasAttempted === true) - (a.hasAttempted === true);
});

  // If view is "history", show only history view
  if (view === "history") {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" mb={4} fontWeight="bold">
          Exam History
        </Typography>
        
        {historyExams.length === 0 ? (
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No exam history yet
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {historyExams.map((exam) => (
              <Grid item xs={12} md={6} lg={4} key={exam._id}>
                <Card sx={cardHoverStyle}>
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">{exam.title}</Typography>
                      <Chip 
                        label={exam.status} 
                        size="small" 
                        color={exam.status === "ENDED" ? "default" : "primary"}
                      />
                    </Stack>
                    
                    <Typography color="text.secondary" mt={1}>
                      {exam.description}
                    </Typography>
                    
                    <Typography variant="body2" mt={2}>
                      <strong>Date:</strong> {formatDateTime(exam.startTime)}
                    </Typography>
                    
                    {exam.examType && (
                      <Typography variant="body2" mt={1}>
                        <strong>Type:</strong> {exam.examType}
                      </Typography>
                    )}
                    
                    {exam.hasAttempted && (
                      <Typography variant="body2" mt={1} color="success.main">
                        <strong>Attempted</strong>
                      </Typography>
                    )}
                  </CardContent>
                  
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button 
                      fullWidth 
                      variant="outlined"
                      onClick={() => {
                        // For students, navigate to their specific result
                        if (user?.role === "student") {
                          navigate(`/exam/result/${exam._id}`);
                        } else {
                          // For teachers/admins, use the existing route
                          navigate(`/exam/results/${exam._id}`);
                        }
                      }}
                    >
                      View Results
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button 
            variant="contained" 
            onClick={() => navigate("/")}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Container>
    );
  }

  // Normal dashboard view
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* ================= CREATE EXAM ================= */}
      {(role === "teacher" || role === "admin") && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ mb: 3 }}
          onClick={() => navigate("/create-exam")}
        >
          Create Exam
        </Button>
      )}

      {/* ================= STUDENT DASHBOARD ================= */}
      {role === "student" && (
        <>
          {/* Show filtered title if filter is active */}
          {filter ? (
            <Typography variant="h5" mb={2}>
              {filter === "ACTIVE" && "Active Exams"}
              {filter === "UPCOMING" && "Upcoming Exams"}
              {filter === "LIVE" && "Live Exams"}
              {filter === "HISTORY" && "Exam History"}
            </Typography>
          ) : (
            /* Default view when no filter */
            <>
              {/* ACTIVE / UPCOMING / PRACTICE */}
              <Typography variant="h5" mb={2}>
                Active & Upcoming Exams
              </Typography>

              <Grid container spacing={3} mb={4}>
                {activeExams.map((exam) => (
                  <Grid item xs={12} md={6} lg={4} key={exam._id}>
                    <ExamCard exam={exam} user={user} role={role} navigate={navigate} />
                  </Grid>
                ))}
              </Grid>

              {/* EXAM HISTORY FULL WIDTH */}
              <Box mb={4}>
                <Typography variant="h5" mb={2}>
                  Exam History
                </Typography>
                <Card sx={cardHoverStyle}>
                  <CardContent>
                    {historyExams.length === 0 ? (
                      <Typography color="text.secondary">
                        No exam history yet
                      </Typography>
                    ) : (
                      <>
                        {/* Show only 2 exam history items */}
                        {historyExams.slice(0, 2).map((exam) => (
                          <Box key={exam._id} mb={2}>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Box>
                                <Typography fontWeight={600} fontSize="1.1rem">
                                  {exam.title}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {formatDateTime(exam.startTime)}
                                </Typography>
                              </Box>
                              <Chip 
                                label={exam.status} 
                                size="small" 
                                color={exam.status === "ENDED" ? "default" : "primary"}
                              />
                            </Stack>
                            <Divider sx={{ mt: 1.5 }} />
                          </Box>
                        ))}

                        {/* Show "SHOW MORE" button if there are more than 2 exams */}
                        {historyExams.length > 2 && (
                          <Box sx={{ textAlign: 'center', mt: 3 }}>
                            <Button
                              variant="outlined"
                              onClick={() => navigate("/?view=history")}
                              sx={{ 
                                textTransform: 'uppercase',
                                fontWeight: 'bold'
                              }}
                            >
                              SHOW MORE
                            </Button>
                          </Box>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </Box>

              <Typography variant="h5" mb={2}>
                Ended / Attempted Exams
              </Typography>
            </>
          )}

          {/* ================= EXAM CARDS ================= */}
          <Grid container spacing={3}>
            {(filter ? filteredExams : (role === "student" ? endedExams : exams)).map((exam) => (
              <Grid item xs={12} md={6} lg={4} key={exam._id}>
                <ExamCard
                  exam={exam}
                  user={user}
                  role={role}
                  navigate={navigate}
                  deleteExam={deleteExam}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}

{/* ================= CONTACT MESSAGES ================= */}
{(role === "teacher" || role === "admin") && (
  <Card
    sx={{
      mb: 4,
      p: 2,
      cursor: "pointer",
      background: "linear-gradient(135deg, #1976d2, #42a5f5)",
      color: "white",
    }}
    onClick={() => navigate("/admin/messages")}
  >
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Box>
        <Typography variant="h6" fontWeight="bold">
          Contact Messages
        </Typography>
        <Typography variant="body2">
          Messages sent by students
        </Typography>
      </Box>

      <Chip
        label={messageCount}
        color="error"
        sx={{
          fontWeight: "bold",
          fontSize: "1rem",
          bgcolor: "white",
          color: "#1976d2",
        }}
      />
    </Stack>
  </Card>
)}

      {/* ================= TEACHER/ADMIN DASHBOARD ================= */}
      {(role === "teacher" || role === "admin") && (
        <>
          <Typography variant="h5" mb={2}>
            All Exams
          </Typography>
          <Grid container spacing={3}>
            {exams.map((exam) => (
              <Grid item xs={12} md={6} lg={4} key={exam._id}>
                <ExamCard
                  exam={exam}
                  user={user}
                  role={role}
                  navigate={navigate}
                  deleteExam={deleteExam}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
}

/* =========================
   EXAM CARD
========================= */
function ExamCard({ exam, user, role, navigate, deleteExam }) {
  return (
    <Card sx={cardHoverStyle}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{exam.title}</Typography>
          <Chip 
            label={exam.examType} 
            size="small" 
            color={exam.examType === "PRACTICE" ? "primary" : "default"}
            variant="outlined"
          />
        </Stack>
        {exam.hasAttempted && role === "student" && (
  <Chip
    label="ATTEMPTED"
    size="small"
    color="success"
    sx={{
      mt: 1,
      fontWeight: 600,
      width: "fit-content",
    }}
  />
)}


        <Typography color="text.secondary" mt={1}>
          {exam.description}
        </Typography>

        <Typography variant="body2" mt={1}>
          {exam.examType === "PRACTICE"
            ? "Practice Exam (Anytime)"
            : `Starts at: ${formatDateTime(exam.startTime)}`}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        {role === "student" && (
          <>
            {exam.examType === "TIMED" && exam.hasAttempted && (
              <Button 
                fullWidth 
                variant="outlined"
                onClick={() => {
                  // For students, navigate to their specific result
                  navigate(`/exam/result/${exam._id}`);
                }}
              >
                View Results
              </Button>
            )}

            {exam.examType === "TIMED" &&
              exam.status === "LIVE" &&
              !exam.hasAttempted && (
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<StartIcon />}
                  onClick={() => navigate(`/exam/${exam._id}`)}
                >
                  Start Exam
                </Button>
              )}

            {exam.examType === "PRACTICE" && (
              <Button
                fullWidth
                variant="contained"
                startIcon={<StartIcon />}
                onClick={() => navigate(`/exam/${exam._id}`)}
                sx={{ fontWeight: 'bold' }}
              >
                PRACTICE NOW
              </Button>
            )}

            {(exam.status === "UPCOMING" ||
              exam.status === "ENDED") && (
              <Button fullWidth disabled>
                {exam.status}
              </Button>
            )}
          </>
        )}

        {(role === "teacher" || role === "admin") && (
          <Stack spacing={1} width="100%">
            {exam.examType === "TIMED" && exam.status === "LIVE" && (
              <Button
                variant="contained"
                onClick={() =>
                  navigate(`/exam/results/live/${exam._id}`)
                }
              >
                View Live Results
              </Button>
            )}

            {exam.examType === "TIMED" && exam.status === "ENDED" && (
              <Button
                variant="outlined"
                color="success"
                onClick={() =>
                  navigate(`/exam/results/${exam._id}`)
                }
              >
                View Final Results
              </Button>
            )}

            {(exam.examType === "PRACTICE" ||
              exam.status === "UPCOMING") && (
              <Button
                variant="contained"
                onClick={() =>
                  navigate(`/exam/edit/${exam._id}`)
                }
              >
                Edit Exam
              </Button>
            )}

            {role === "admin" && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => deleteExam(exam._id)}
              >
                Delete Exam
              </Button>
            )}
          </Stack>
        )}
      </CardActions>
    </Card>
  );
}