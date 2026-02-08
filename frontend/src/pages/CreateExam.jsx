import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Card,
  CardContent,
  Grid,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

/* 🔥 HOVER GLOW STYLE */
const hoverGlow = {
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 0 18px rgba(25,118,210,0.35)",
  },
};

export default function CreateExam() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [examType, setExamType] = useState("TIMED");
  const [duration, setDuration] = useState(60);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  /* 🔥 MARKING */
  const [marksPerQuestion, setMarksPerQuestion] = useState(1);
  const [passingPercentage, setPassingPercentage] = useState(40);

  /* 🔥 WATERMARK */
  const [watermarkEnabled, setWatermarkEnabled] = useState(false);
  const [watermarkText, setWatermarkText] = useState("");

  /* 🔥 QUESTIONS */
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: 1 },
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correctAnswer: 1 },
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const createExam = async () => {
    try {
      const examData = {
        title,
        description,
        examType,
        duration: examType === "TIMED" ? duration : null,
        ...(examType === "TIMED" && { startTime, endTime }),
        marksPerQuestion,
        passingPercentage,
        questions,
        watermark: {
          enabled: watermarkEnabled,
          text: watermarkText,
        },
      };

      await api.post("/exam", examData);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to create exam");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>
        Create New Exam
      </Typography>

      {/* ================= EXAM DETAILS ================= */}
      <Paper sx={{ p: 3, mb: 4, ...hoverGlow }}>
        <Stack spacing={2}>
          <TextField
            label="Exam Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={2}
            fullWidth
          />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Marks per Question"
                type="number"
                value={marksPerQuestion}
                onChange={(e) =>
                  setMarksPerQuestion(Number(e.target.value))
                }
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Passing %"
                type="number"
                value={passingPercentage}
                inputProps={{ min: 0, max: 100 }}
                onChange={(e) =>
                  setPassingPercentage(Number(e.target.value))
                }
                InputLabelProps={{ shrink: true }}   // 🔥 FIXED LABEL
                fullWidth
              />
            </Grid>
          </Grid>

          <FormControlLabel
            control={
              <Checkbox
                checked={watermarkEnabled}
                onChange={(e) => setWatermarkEnabled(e.target.checked)}
              />
            }
            label="Enable Watermark"
          />

          {watermarkEnabled && (
            <TextField
              label="Watermark Text"
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          )}

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel shrink>Exam Type</InputLabel>
                <Select
                  value={examType}
                  label="Exam Type"
                  onChange={(e) => setExamType(e.target.value)}
                >
                  <MenuItem value="TIMED">Timed Exam</MenuItem>
                  <MenuItem value="PRACTICE">Practice Exam</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {examType === "TIMED" && (
              <Grid item xs={6}>
                <TextField
                  label="Duration (minutes)"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
            )}
          </Grid>

          {examType === "TIMED" && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  type="datetime-local"
                  label="Start Time"
                  InputLabelProps={{ shrink: true }}
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  fullWidth
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  type="datetime-local"
                  label="End Time"
                  InputLabelProps={{ shrink: true }}
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  fullWidth
                />
              </Grid>
            </Grid>
          )}
        </Stack>
      </Paper>

      {/* ================= QUESTIONS ================= */}
      <Typography variant="h5" mb={2}>
        Questions
      </Typography>

      {questions.map((q, qIndex) => (
        <Card key={qIndex} sx={{ mb: 3, ...hoverGlow }}>
          <CardContent>
            <TextField
              fullWidth
              label={`Question ${qIndex + 1}`}
              value={q.question}
              onChange={(e) =>
                updateQuestion(qIndex, "question", e.target.value)
              }
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />

            {q.options.map((opt, oIndex) => (
              <Stack key={oIndex} direction="row" spacing={2} mb={1}>
                <TextField
                  fullWidth
                  label={`Option ${oIndex + 1}`}
                  value={opt}
                  onChange={(e) =>
                    updateOption(qIndex, oIndex, e.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                />
                <Button
                  variant={
                    q.correctAnswer === oIndex + 1
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() =>
                    updateQuestion(qIndex, "correctAnswer", oIndex + 1)
                  }
                >
                  Correct
                </Button>
              </Stack>
            ))}
          </CardContent>
        </Card>
      ))}

      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addQuestion}
        >
          Add Question
        </Button>

        <Button
          variant="contained"
          color="success"
          sx={{ ml: "auto" }}
          onClick={createExam}
        >
          Create Exam
        </Button>
      </Stack>
    </Box>
  );
}













// import { useState } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Paper,
//   Stack,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel,
//   IconButton,
//   Card,
//   CardContent,
//   Grid,
//   Checkbox,
//   FormControlLabel,
//   Alert,
//   Divider,
//   Chip,
//   Slider,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
// } from "@mui/material";
// import { 
//   Add as AddIcon, 
//   Delete as DeleteIcon,
//   ExpandMore as ExpandMoreIcon,
//   AddCircle as AddCircleIcon,
//   RemoveCircle as RemoveCircleIcon 
// } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";
// import api from "../api/axios";

// export default function CreateExam() {
//   const navigate = useNavigate();

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [examType, setExamType] = useState("TIMED");
//   const [duration, setDuration] = useState(60);
//   const [startTime, setStartTime] = useState("");
//   const [endTime, setEndTime] = useState("");

//   /* 🔥 PASSING MARKS */
//   const [passingPercentage, setPassingPercentage] = useState(50);

//   /* 🔥 SECTIONS */
//   const [sections, setSections] = useState([
//     {
//       id: 1,
//       name: "Section 1",
//       marksPerQuestion: 1,
//       questions: [
//         { 
//           id: 1,
//           question: "", 
//           options: ["", "", "", ""], 
//           correctAnswer: 1,
//         },
//       ],
//     },
//   ]);

//   /* 🔥 WATERMARK */
//   const [watermarkEnabled, setWatermarkEnabled] = useState(false);
//   const [watermarkText, setWatermarkText] = useState("");

//   /* ================= CALCULATIONS ================= */
//   const calculateTotalQuestions = () => {
//     return sections.reduce((total, section) => total + section.questions.length, 0);
//   };

//   const calculateTotalMarks = () => {
//     return sections.reduce((total, section) => {
//       return total + (section.questions.length * section.marksPerQuestion);
//     }, 0);
//   };

//   const calculatePassingMarks = () => {
//     const totalMarks = calculateTotalMarks();
//     return Math.ceil((passingPercentage / 100) * totalMarks);
//   };

//   const totalQuestions = calculateTotalQuestions();
//   const totalMarks = calculateTotalMarks();
//   const passingMarks = calculatePassingMarks();

//   /* ================= SECTION HANDLERS ================= */
//   const addSection = () => {
//     const newSectionId = sections.length + 1;
//     setSections([
//       ...sections,
//       {
//         id: newSectionId,
//         name: `Section ${newSectionId}`,
//         marksPerQuestion: 1,
//         questions: [
//           { 
//             id: 1,
//             question: "", 
//             options: ["", "", "", ""], 
//             correctAnswer: 1,
//           },
//         ],
//       },
//     ]);
//   };

//   const removeSection = (sectionIndex) => {
//     if (sections.length === 1) return;
//     setSections(sections.filter((_, index) => index !== sectionIndex));
//   };

//   const updateSectionName = (sectionIndex, name) => {
//     const updatedSections = [...sections];
//     updatedSections[sectionIndex].name = name;
//     setSections(updatedSections);
//   };

//   const updateSectionMarks = (sectionIndex, marks) => {
//     const updatedSections = [...sections];
//     updatedSections[sectionIndex].marksPerQuestion = Math.max(1, parseInt(marks) || 1);
//     setSections(updatedSections);
//   };

//   /* ================= QUESTION HANDLERS ================= */
//   const addQuestion = (sectionIndex) => {
//     const updatedSections = [...sections];
//     const section = updatedSections[sectionIndex];
//     const newQuestionId = section.questions.length + 1;
    
//     section.questions.push({
//       id: newQuestionId,
//       question: "",
//       options: ["", "", "", ""],
//       correctAnswer: 1,
//     });
    
//     setSections(updatedSections);
//   };

//   const removeQuestion = (sectionIndex, questionIndex) => {
//     const updatedSections = [...sections];
//     const section = updatedSections[sectionIndex];
    
//     if (section.questions.length === 1) return;
    
//     section.questions.splice(questionIndex, 1);
    
//     // Re-number questions
//     section.questions.forEach((q, idx) => {
//       q.id = idx + 1;
//     });
    
//     setSections(updatedSections);
//   };

//   const updateQuestion = (sectionIndex, questionIndex, field, value) => {
//     const updatedSections = [...sections];
//     updatedSections[sectionIndex].questions[questionIndex][field] = value;
//     setSections(updatedSections);
//   };

//   const updateOption = (sectionIndex, questionIndex, optionIndex, value) => {
//     const updatedSections = [...sections];
//     updatedSections[sectionIndex].questions[questionIndex].options[optionIndex] = value;
//     setSections(updatedSections);
//   };

//   /* ================= CREATE EXAM ================= */
//   const createExam = async () => {
//     try {
//       // Validation
//       if (!title.trim()) {
//         alert("Please enter exam title");
//         return;
//       }

//       if (totalQuestions === 0) {
//         alert("Please add at least one question");
//         return;
//       }

//       // Check if all questions have text
//       let hasEmptyQuestions = false;
//       sections.forEach(section => {
//         section.questions.forEach(q => {
//           if (!q.question.trim()) hasEmptyQuestions = true;
//         });
//       });
      
//       if (hasEmptyQuestions) {
//         alert("Please fill all question texts");
//         return;
//       }

//       // Check if all options are filled
//       let hasEmptyOptions = false;
//       sections.forEach(section => {
//         section.questions.forEach(q => {
//           q.options.forEach(opt => {
//             if (!opt.trim()) hasEmptyOptions = true;
//           });
//         });
//       });
      
//       if (hasEmptyOptions) {
//         alert("Please fill all options for all questions");
//         return;
//       }

//       // Prepare questions with section marks
//       const allQuestions = [];
//       let questionCounter = 1;
      
//       sections.forEach(section => {
//         section.questions.forEach(q => {
//           allQuestions.push({
//             ...q,
//             questionNumber: questionCounter++, // Auto numbering
//             marks: section.marksPerQuestion, // Section-wise marks
//           });
//         });
//       });

//       const examData = {
//         title,
//         description,
//         examType,
//         duration: examType === "TIMED" ? duration : null,
//         ...(examType === "TIMED" && { startTime, endTime }),
//         passingPercentage,
//         passingMarks,
//         totalMarks,
//         sections: sections.length > 1 ? sections.map(s => ({
//           name: s.name,
//           marksPerQuestion: s.marksPerQuestion,
//           questionCount: s.questions.length,
//         })) : undefined,
//         questions: allQuestions,
//         watermark: {
//           enabled: watermarkEnabled,
//           text: watermarkText,
//         },
//       };

//       console.log("📦 Sending exam data:", examData);
//       await api.post("/exam", examData);
//       alert("Exam created successfully!");
//       navigate("/");
//     } catch (err) {
//       console.error("❌ Failed to create exam:", err);
//       alert("Failed to create exam. Please try again.");
//     }
//   };

//   return (
//     <Box sx={{ p: 4 }}>
//       <Typography variant="h4" mb={3}>
//         Create New Exam
//       </Typography>

//       {/* ================= EXAM SUMMARY CARD ================= */}
//       <Card sx={{ mb: 4, bgcolor: 'primary.light', color: 'white' }}>
//         <CardContent>
//           <Grid container spacing={2}>
//             <Grid item xs={6}>
//               <Typography variant="body2">Total Sections</Typography>
//               <Typography variant="h5">{sections.length}</Typography>
//             </Grid>
//             <Grid item xs={6}>
//               <Typography variant="body2">Total Questions</Typography>
//               <Typography variant="h5">{totalQuestions}</Typography>
//             </Grid>
//             <Grid item xs={6}>
//               <Typography variant="body2">Total Marks</Typography>
//               <Typography variant="h5">{totalMarks}</Typography>
//             </Grid>
//             <Grid item xs={6}>
//               <Typography variant="body2">Passing Marks</Typography>
//               <Typography variant="h5">{passingMarks}</Typography>
//             </Grid>
//           </Grid>
//           {sections.length > 1 && (
//             <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
//               <Typography variant="body2">Sections Breakdown:</Typography>
//               {sections.map((section, idx) => (
//                 <Chip 
//                   key={idx}
//                   label={`${section.name}: ${section.questions.length} × ${section.marksPerQuestion} marks`}
//                   size="small"
//                   sx={{ mr: 1, mt: 1, bgcolor: 'rgba(255,255,255,0.2)' }}
//                 />
//               ))}
//             </Box>
//           )}
//         </CardContent>
//       </Card>

//       {/* ================= EXAM DETAILS ================= */}
//       <Paper sx={{ p: 3, mb: 4 }}>
//         <Stack spacing={2}>
//           <TextField
//             label="Exam Title *"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             fullWidth
//             required
//           />

//           <TextField
//             label="Description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             multiline
//             rows={2}
//             fullWidth
//           />

//           <FormControlLabel
//             control={
//               <Checkbox
//                 checked={watermarkEnabled}
//                 onChange={(e) => setWatermarkEnabled(e.target.checked)}
//               />
//             }
//             label="Enable Watermark"
//           />

//           {watermarkEnabled && (
//             <TextField
//               label="Watermark Text"
//               value={watermarkText}
//               onChange={(e) => setWatermarkText(e.target.value)}
//               placeholder="CGC LANDRAN"
//               fullWidth
//             />
//           )}

//           <Grid container spacing={2}>
//             <Grid item xs={6}>
//               <FormControl fullWidth>
//                 <InputLabel>Exam Type</InputLabel>
//                 <Select
//                   value={examType}
//                   label="Exam Type"
//                   onChange={(e) => setExamType(e.target.value)}
//                 >
//                   <MenuItem value="TIMED">Timed Exam</MenuItem>
//                   <MenuItem value="PRACTICE">Practice Exam</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>

//             {examType === "TIMED" && (
//               <Grid item xs={6}>
//                 <TextField
//                   label="Duration (minutes)"
//                   type="number"
//                   value={duration}
//                   onChange={(e) => setDuration(e.target.value)}
//                   fullWidth
//                   InputProps={{ inputProps: { min: 1 } }}
//                 />
//               </Grid>
//             )}
//           </Grid>

//           {examType === "TIMED" && (
//             <Grid container spacing={2}>
//               <Grid item xs={6}>
//                 <TextField
//                   type="datetime-local"
//                   label="Start Time"
//                   InputLabelProps={{ shrink: true }}
//                   value={startTime}
//                   onChange={(e) => setStartTime(e.target.value)}
//                   fullWidth
//                 />
//               </Grid>

//               <Grid item xs={6}>
//                 <TextField
//                   type="datetime-local"
//                   label="End Time"
//                   InputLabelProps={{ shrink: true }}
//                   value={endTime}
//                   onChange={(e) => setEndTime(e.target.value)}
//                   fullWidth
//                 />
//               </Grid>
//             </Grid>
//           )}

//           {/* ================= PASSING PERCENTAGE SLIDER ================= */}
//           <Box sx={{ mt: 3 }}>
//             <Typography gutterBottom>
//               Passing Percentage: {passingPercentage}%
//             </Typography>
//             <Slider
//               value={passingPercentage}
//               onChange={(e, newValue) => setPassingPercentage(newValue)}
//               min={0}
//               max={100}
//               step={5}
//               valueLabelDisplay="auto"
//               marks={[
//                 { value: 0, label: '0%' },
//                 { value: 25, label: '25%' },
//                 { value: 50, label: '50%' },
//                 { value: 75, label: '75%' },
//                 { value: 100, label: '100%' },
//               ]}
//             />
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
//               <Typography variant="body2" color="text.secondary">
//                 Passing Marks: {passingMarks} / {totalMarks}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 ({passingPercentage}% of total)
//               </Typography>
//             </Box>
//           </Box>
//         </Stack>
//       </Paper>

//       {/* ================= SECTIONS ================= */}
//       <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
//         <Typography variant="h5">
//           {sections.length > 1 ? "Sections" : "Questions"} ({totalQuestions})
//         </Typography>
//         <Button
//           variant="outlined"
//           startIcon={<AddIcon />}
//           onClick={addSection}
//         >
//           Add Section
//         </Button>
//       </Stack>

//       {sections.map((section, sectionIndex) => (
//         <Accordion 
//           key={sectionIndex} 
//           defaultExpanded
//           sx={{ mb: 3 }}
//         >
//           <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//             <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
//               <Typography variant="h6">
//                 {sections.length > 1 ? section.name : "Questions"}
//               </Typography>
//               <Chip 
//                 label={`${section.questions.length} questions`}
//                 size="small"
//                 color="primary"
//                 variant="outlined"
//               />
//               <Chip 
//                 label={`${section.marksPerQuestion} mark${section.marksPerQuestion > 1 ? 's' : ''} each`}
//                 size="small"
//                 color="secondary"
//                 variant="outlined"
//               />
//               {sections.length > 1 && (
//                 <IconButton
//                   size="small"
//                   color="error"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     removeSection(sectionIndex);
//                   }}
//                   sx={{ ml: 'auto' }}
//                 >
//                   <DeleteIcon fontSize="small" />
//                 </IconButton>
//               )}
//             </Stack>
//           </AccordionSummary>
          
//           <AccordionDetails>
//             {/* Section Configuration */}
//             {sections.length > 1 && (
//               <Grid container spacing={2} sx={{ mb: 3 }}>
//                 <Grid item xs={8}>
//                   <TextField
//                     label="Section Name"
//                     value={section.name}
//                     onChange={(e) => updateSectionName(sectionIndex, e.target.value)}
//                     fullWidth
//                   />
//                 </Grid>
//                 <Grid item xs={4}>
//                   <TextField
//                     label="Marks per Question"
//                     type="number"
//                     value={section.marksPerQuestion}
//                     onChange={(e) => updateSectionMarks(sectionIndex, e.target.value)}
//                     fullWidth
//                     InputProps={{ inputProps: { min: 1 } }}
//                   />
//                 </Grid>
//               </Grid>
//             )}

//             {/* Questions in this Section */}
//             {section.questions.map((question, questionIndex) => {
//               // Calculate global question number
//               let globalQuestionNum = 1;
//               for (let i = 0; i < sectionIndex; i++) {
//                 globalQuestionNum += sections[i].questions.length;
//               }
//               globalQuestionNum += questionIndex;
              
//               return (
//                 <Card key={question.id} sx={{ mb: 3, borderLeft: '4px solid', borderLeftColor: 'primary.main' }}>
//                   <CardContent>
//                     <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
//                       <Stack direction="row" alignItems="center" spacing={2}>
//                         <Typography variant="h6">
//                           Q.{globalQuestionNum} {/* Auto numbering */}
//                         </Typography>
//                         {sections.length === 1 && (
//                           <TextField
//                             label="Marks"
//                             type="number"
//                             value={section.marksPerQuestion}
//                             onChange={(e) => updateSectionMarks(sectionIndex, e.target.value)}
//                             size="small"
//                             sx={{ width: '100px' }}
//                             InputProps={{ inputProps: { min: 1 } }}
//                           />
//                         )}
//                       </Stack>
//                       <IconButton
//                         color="error"
//                         size="small"
//                         onClick={() => removeQuestion(sectionIndex, questionIndex)}
//                         disabled={section.questions.length === 1}
//                       >
//                         <DeleteIcon />
//                       </IconButton>
//                     </Stack>

//                     <TextField
//                       fullWidth
//                       label="Question Text *"
//                       value={question.question}
//                       onChange={(e) =>
//                         updateQuestion(sectionIndex, questionIndex, "question", e.target.value)
//                       }
//                       multiline
//                       rows={2}
//                       required
//                     />

//                     <Box sx={{ mt: 2 }}>
//                       <Typography variant="subtitle2" color="text.secondary" gutterBottom>
//                         Options (Select correct one):
//                       </Typography>
//                       {question.options.map((opt, optionIndex) => (
//                         <Stack
//                           key={optionIndex}
//                           direction="row"
//                           spacing={2}
//                           alignItems="center"
//                           mb={1}
//                         >
//                           <TextField
//                             fullWidth
//                             label={`Option ${optionIndex + 1} *`}
//                             value={opt}
//                             onChange={(e) =>
//                               updateOption(sectionIndex, questionIndex, optionIndex, e.target.value)
//                             }
//                             required
//                           />
//                           <Button
//                             variant={
//                               question.correctAnswer === optionIndex + 1
//                                 ? "contained"
//                                 : "outlined"
//                             }
//                             color={
//                               question.correctAnswer === optionIndex + 1
//                                 ? "success"
//                                 : "primary"
//                             }
//                             onClick={() =>
//                               updateQuestion(sectionIndex, questionIndex, "correctAnswer", optionIndex + 1)
//                             }
//                             sx={{ minWidth: '100px' }}
//                           >
//                             {question.correctAnswer === optionIndex + 1 ? "Correct ✓" : "Mark Correct"}
//                           </Button>
//                         </Stack>
//                       ))}
//                     </Box>
//                   </CardContent>
//                 </Card>
//               );
//             })}

//             {/* Add Question Button for this Section */}
//             <Button
//               variant="outlined"
//               startIcon={<AddCircleIcon />}
//               onClick={() => addQuestion(sectionIndex)}
//               fullWidth
//               sx={{ mt: 2 }}
//             >
//               Add Question to {sections.length > 1 ? section.name : "Exam"}
//             </Button>
//           </AccordionDetails>
//         </Accordion>
//       ))}

//       {/* ================= CREATE BUTTON ================= */}
//       <Box sx={{ mt: 4, textAlign: 'center' }}>
//         <Button
//           variant="contained"
//           color="success"
//           size="large"
//           onClick={createExam}
//           disabled={!title.trim() || totalQuestions === 0}
//           sx={{ px: 6, py: 1.5 }}
//         >
//           Create Exam
//         </Button>
//       </Box>

//       {/* ================= VALIDATION ALERT ================= */}
//       {(totalQuestions === 0 || !title.trim()) && (
//         <Alert severity="warning" sx={{ mt: 3 }}>
//           <Typography variant="body2">
//             {!title.trim() && "• Please enter exam title\n"}
//             {totalQuestions === 0 && "• Please add at least one question"}
//           </Typography>
//         </Alert>
//       )}
//     </Box>
//   );
// }