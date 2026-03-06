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
  Grid
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function CreateExam() {

const navigate = useNavigate();

const [title,setTitle] = useState("");
const [description,setDescription] = useState("");
const [subject,setSubject] = useState("");
const [numberOfQuestions,setNumberOfQuestions] = useState(10);
const [examType,setExamType] = useState("TIMED");
const [duration,setDuration] = useState(60);
const [startTime,setStartTime] = useState("");
const [endTime,setEndTime] = useState("");

const createExam = async () => {

try{

const examData = {
title,
description,
subject,
numberOfQuestions,
examType,
duration: examType === "TIMED" ? duration : null,
startTime: examType === "TIMED" ? startTime : null,
endTime: examType === "TIMED" ? endTime : null
};

await api.post("/exam",examData);

navigate("/");

}catch(err){

console.error(err);
alert("Failed to create exam");

}

};

return(

<Box sx={{p:4}}>

<Typography variant="h4" mb={3}>
Create Exam
</Typography>

<Paper sx={{p:3}}>

<Stack spacing={3}>

<TextField
label="Exam Title"
value={title}
onChange={(e)=>setTitle(e.target.value)}
fullWidth
/>

<TextField
label="Description"
value={description}
onChange={(e)=>setDescription(e.target.value)}
multiline
rows={2}
fullWidth
/>

<FormControl fullWidth>

<InputLabel>Subject</InputLabel>

<Select
value={subject}
label="Subject"
onChange={(e)=>setSubject(e.target.value)}
>

<MenuItem value="math">Math</MenuItem>
<MenuItem value="java">Java</MenuItem>
<MenuItem value="dsa">DSA</MenuItem>

</Select>

</FormControl>

<TextField
label="Number Of Questions"
type="number"
value={numberOfQuestions}
onChange={(e)=>setNumberOfQuestions(Number(e.target.value))}
fullWidth
/>

<FormControl fullWidth>

<InputLabel>Exam Type</InputLabel>

<Select
value={examType}
label="Exam Type"
onChange={(e)=>setExamType(e.target.value)}
>

<MenuItem value="TIMED">Timed</MenuItem>
<MenuItem value="PRACTICE">Practice</MenuItem>

</Select>

</FormControl>

{examType==="TIMED" && (

<Grid container spacing={2}>

<Grid item xs={6}>

<TextField
type="datetime-local"
label="Start Time"
InputLabelProps={{shrink:true}}
value={startTime}
onChange={(e)=>setStartTime(e.target.value)}
fullWidth
/>

</Grid>

<Grid item xs={6}>

<TextField
type="datetime-local"
label="End Time"
InputLabelProps={{shrink:true}}
value={endTime}
onChange={(e)=>setEndTime(e.target.value)}
fullWidth
/>

</Grid>

</Grid>

)}

<Button
variant="contained"
color="success"
onClick={createExam}
>

Create Exam

</Button>

</Stack>

</Paper>

</Box>

);

}