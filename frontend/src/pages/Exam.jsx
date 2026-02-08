// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../api/axios";
// import {
//   Box,
//   Typography,
//   Button,
//   Paper,
//   Radio,
//   RadioGroup,
//   Divider,
//   Alert,
//   LinearProgress,
// } from "@mui/material";

// export default function Exam() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [exam, setExam] = useState(null);
//   const [answers, setAnswers] = useState([]);
//   const [timeLeft, setTimeLeft] = useState(null);
//   const [submitted, setSubmitted] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api
//       .get(`/exam/${id}`)
//       .then(res => {
//         setExam(res.data);
//         setAnswers(Array(res.data.questions.length).fill(null));

//         if (res.data.examType === "TIMED") {
//           const sec = Math.floor(
//             (new Date(res.data.endTime).getTime() - Date.now()) / 1000
//           );
//           setTimeLeft(sec > 0 ? sec : 0);
//         }
//       })
//       .catch(err =>
//         setError(err.response?.data?.message || "Failed to load exam")
//       )
//       .finally(() => setLoading(false));
//   }, [id]);

//   useEffect(() => {
//     if (timeLeft > 0 && !submitted) {
//       const t = setTimeout(() => setTimeLeft(v => v - 1), 1000);
//       return () => clearTimeout(t);
//     }
//     if (timeLeft === 0 && !submitted && exam?.examType === "TIMED") {
//       submitExam();
//     }
//   }, [timeLeft, submitted, exam]);

//   const submitExam = async () => {
//     if (submitted) return;

//     if (!answers.some(a => a !== null)) {
//       setError("Please attempt at least one question");
//       return;
//     }

//     setSubmitted(true);

//     try {
//       const res = await api.post(`/exam/${id}/submit`, { answers });

//       if (exam.examType === "PRACTICE") {
//         localStorage.setItem(
//           `practice_result_${id}`,
//           JSON.stringify({
//             ...res.data,
//             examTitle: exam.title,
//             practice: true,
//             attemptedAt: new Date().toISOString(),
//           })
//         );
//       }

//       navigate(`/exam/result/${id}`, { state: res.data });
//     } catch (err) {
//       setSubmitted(false);
//       setError(err.response?.data?.message || "Failed to submit exam");
//     }
//   };

//   const formatTime = s => {
//     const m = Math.floor(s / 60);
//     const sec = s % 60;
//     return `${m}:${sec < 10 ? "0" : ""}${sec}`;
//   };

//   if (loading) return <LinearProgress />;

//   if (error) {
//     return (
//       <Box sx={{ p: 4 }}>
//         <Alert severity="error">{error}</Alert>
//         <Button sx={{ mt: 2 }} onClick={() => navigate("/")}>
//           Back
//         </Button>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: 4 }}>
//      <Paper
//   className="exam-paper"
//   data-watermark={
//     exam?.watermark?.text ||
//     exam?.title ||
//     "CONFIDENTIAL"
//   }
//   sx={{ p: 4 }}
// >
//         <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
//           <Typography variant="h4">{exam.title}</Typography>
//           {timeLeft !== null && (
//             <Typography color="primary">
//               Time Left: {formatTime(timeLeft)}
//             </Typography>
//           )}
//         </Box>

//         <Typography color="text.secondary" mb={2}>
//           {exam.description}
//         </Typography>

//         <Divider />

//         {exam.questions.map((q, qi) => (
//           <Box key={qi} sx={{ mt: 4 }}>
//             <Typography fontWeight="bold">
//               {qi + 1}. {q.question}
//             </Typography>

//             <RadioGroup
//               value={answers[qi] !== null ? answers[qi] : ""}
//               onChange={e => {
//                 const updated = [...answers];
//                 updated[qi] = Number(e.target.value);
//                 setAnswers(updated);
//               }}
//             >
//               {q.options.map((opt, oi) => (
//                 <Box key={oi} sx={{ display: "flex", gap: 2, mb: 1 }}>
//                   <Radio value={oi} />
//                   <Typography>{opt}</Typography>
//                 </Box>
//               ))}
//             </RadioGroup>
//           </Box>
//         ))}

//         <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
//           <Typography>
//             Answered: {answers.filter(a => a !== null).length}/
//             {exam.questions.length}
//           </Typography>

//           <Button
//             variant="contained"
//             color="success"
//             disabled={submitted}
//             onClick={submitExam}
//           >
//             Submit Exam
//           </Button>
//         </Box>
//       </Paper>
//     </Box>
//   );
// }















import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  Box,
  Typography,
  Button,
  Paper,
  Radio,
  RadioGroup,
  Divider,
  Alert,
  LinearProgress,
} from "@mui/material";

export default function Exam() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= FETCH EXAM ================= */
  useEffect(() => {
    api
      .get(`/exam/${id}`)
      .then(res => {
        setExam(res.data);
        setAnswers(Array(res.data.questions.length).fill(null));

       if (res.data.examType === "TIMED") {
  const key = `exam_start_${id}`;

  let startTime = localStorage.getItem(key);

  if (!startTime) {
    startTime = Date.now();
    localStorage.setItem(key, startTime);
  } else {
    startTime = Number(startTime);
  }

  const durationSeconds = res.data.duration * 60;
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const remaining = durationSeconds - elapsed;

  setTimeLeft(remaining > 0 ? remaining : 0);
}

      })
      .catch(err =>
        setError(err.response?.data?.message || "Failed to load exam")
      )
      .finally(() => setLoading(false));
  }, [id]);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      const t = setTimeout(() => setTimeLeft(v => v - 1), 1000);
      return () => clearTimeout(t);
    }

    if (timeLeft === 0 && !submitted && exam?.examType === "TIMED") {
      submitExam();
    }
  }, [timeLeft, submitted, exam]);

  /* ================= SUBMIT EXAM ================= */
  const submitExam = async () => {
    if (submitted) return;

    if (!answers.some(a => a !== null)) {
      setError("Please attempt at least one question");
      return;
    }

    setSubmitted(true);

    try {
      const res = await api.post(`/exam/${id}/submit`, { answers });

      // 🔥 clear timer storage
      localStorage.removeItem(`exam_end_${id}`);

      if (exam.examType === "PRACTICE") {
        localStorage.setItem(
          `practice_result_${id}`,
          JSON.stringify({
            ...res.data,
            examTitle: exam.title,
            practice: true,
            attemptedAt: new Date().toISOString(),
          })
        );
      }

      navigate(`/exam/result/${id}`, { state: res.data });
    } catch (err) {
      setSubmitted(false);
      setError(err.response?.data?.message || "Failed to submit exam");
    }
  };

  /* ================= TIME FORMAT ================= */

const formatTime = s => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;

  return `${h.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
};





  if (loading) return <LinearProgress />;

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button sx={{ mt: 2 }} onClick={() => navigate("/")}>
          Back
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      {/* ⏱ FIXED TIMER UI */}

{timeLeft !== null && exam.examType === "TIMED" && (
  <Box
    sx={theme => ({
      position: "fixed",
      top: 80,
      right: 30,

      background:
        timeLeft <= 300
          ? "#d32f2f"
          : theme.palette.mode === "light"
          ? "#ffffff"
          : "#1e1e1e",

      color:
        timeLeft <= 300
          ? "#fff"
          : theme.palette.mode === "light"
          ? "#000"
          : "#fff",

      px: 2.5,
      py: 1,
      borderRadius: 2,
      fontWeight: "bold",
      zIndex: 1200,
      boxShadow:
        theme.palette.mode === "light"
          ? "0 4px 10px rgba(0,0,0,0.15)"
          : "0 0 12px rgba(0,0,0,0.5)",
      border:
        theme.palette.mode === "light"
          ? "1px solid rgba(0,0,0,0.12)"
          : "none",
    })}
  >
    ⏱ Time Left: {formatTime(timeLeft)}
  </Box>
)}






















      <Paper
        className="exam-paper"
        data-watermark={
          exam?.watermark?.text ||
          exam?.title ||
          "CONFIDENTIAL"
        }
        sx={{ p: 4 }}
      >
        <Typography variant="h4" mb={1}>
          {exam.title}
        </Typography>

        <Typography color="text.secondary" mb={2}>
          {exam.description}
        </Typography>

        <Divider />

        {exam.questions.map((q, qi) => (
          <Box key={qi} sx={{ mt: 4 }}>
            <Typography fontWeight="bold">
              {qi + 1}. {q.question}
            </Typography>

            <RadioGroup
              value={answers[qi] !== null ? answers[qi] : ""}
              onChange={e => {
                const updated = [...answers];
                updated[qi] = Number(e.target.value);
                setAnswers(updated);
              }}
            >
              {q.options.map((opt, oi) => (
                <Box key={oi} sx={{ display: "flex", gap: 2, mb: 1 }}>
                  <Radio value={oi} />
                  <Typography>{opt}</Typography>
                </Box>
              ))}
            </RadioGroup>
          </Box>
        ))}

        <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
          <Typography>
            Answered: {answers.filter(a => a !== null).length}/
            {exam.questions.length}
          </Typography>

          <Button
            variant="contained"
            color="success"
            disabled={submitted}
            onClick={submitExam}
          >
            Submit Exam
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
