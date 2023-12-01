import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Container } from "@mui/system";
import { useState, useEffect } from "react";
import axios from "../services/api";
import { useDispatch, useSelector } from "react-redux";
import { setTasks } from "../redux/TaskSlice";
import Header from "./Header";
import { Link } from "react-router-dom";
import Task from "../components/Task";
import Stack from "@mui/material/Stack";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const Home = () => {
  const dispatch = useDispatch();
  const [typeFilter, setTypeFilter] = useState("");
  const [dayFilter, setDayFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [view, setView] = useState("Grid");

  const types = ["Default", "Development", "Work", "School"];
  const status = ["Completed", "Pending"]
  const days = [
    { label: "Today", value: "today" },
    { label: "Last 7 Days", value: "seven" },
    { label: "Last 30 Days", value: "thirty" },
  ];
  const views = ["Grid", "Calendar"];
  const localizer = momentLocalizer(moment);

  useEffect(() => {
    axios.get(`/task?type=${typeFilter}&day=${dayFilter}&status=${statusFilter}`).then((res) => {
      dispatch(setTasks(res.data.tasks));
    });
  }, [typeFilter, dayFilter, statusFilter, view]);
  const { tasks } = useSelector((state) => state.task);

  const handleTypeChange = (e) => {
    setTypeFilter(e.target.value)
  };

  const handleStatusChange = (e) => {
    console.log(e.target.value)
    setStatusFilter(e.target.value)
  };

  const handleViewChange = (e) => {
    setView(e.target.value)
  };


  return (
    <Box>
      <Header />
      <Container>
        <Box display="flex" justifyContent="space-between" mt="2rem">
          <Stack direction="row" spacing={2}>
            <FormControl style={{ minWidth: 150}} >
              <InputLabel id="typeLabel">Select Type</InputLabel>
              <Select labelId="typeLabel" value={typeFilter} onChange={handleTypeChange}>
                {types.map((type, idx) => (
                  <MenuItem key={`${idx}-${type}`} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl style={{ minWidth: 150 }}>
              <InputLabel>Select Status</InputLabel>
              <Select value={statusFilter} onChange={handleStatusChange}>
                {status.map((type, idx) => (
                  <MenuItem key={`${idx}-${type}`} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl style={{ minWidth: 150 }}>
              <Select value={view} onChange={handleViewChange}>
                {views.map((type, idx) => (
                  <MenuItem key={`${idx}-${type}`} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Default view is Grid</FormHelperText>
            </FormControl>
          </Stack>
          <Stack direction="row" spacing={2}>
            {days.map((day, idx) => (
              <Button
                variant="contained"
                size="small"
                // color={day.value === dayFilter ? "success" : "secondary"}
                key={`${idx}-${day.value}`}
                onClick={() => {
                  setDayFilter(day.value);
                }}
              >
                {day.label}
              </Button>
            ))}
          </Stack>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Button onClick={() => {setTypeFilter(''); setDayFilter(''); setStatusFilter('')}}>Clear filters</Button>
        </Box>
        <Box mt="2rem">
          {view === "Grid" && 
            (<Grid container spacing={2}>
              {tasks.map((task, idx) => (
                <Grid item  key={`${idx}-${task.id}`}>
                  <Link
                    style={{ textDecoration: "none" }}
                    to={`/task/${task._id}`}
                  >
                    <Task task={task} />
                  </Link>
                </Grid>
              ))}
            </Grid>)
          }

          {view === "Calendar" &&
            (<Calendar
              defaultView="month"
              localizer={localizer}
              events={tasks.map((task, idx) => {
                return {
                  start: new Date(task.startDate),
                  end: new Date(task.endDate),
                  title: task.name
                }
              })}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
            />)
          }
        </Box>
      </Container>
    </Box>
  );
};
export default Home;
