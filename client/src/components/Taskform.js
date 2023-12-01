import { Formik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import {
  MenuItem,
  TextField,
  Typography,
  useMediaQuery,
  Box,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Button, Select } from "@mui/material";
import { useState } from "react";
import axiosInstance from "../services/api";
import { useNavigate } from "react-router-dom";
const initialEditSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  startDate: Yup.string().required("required"),
  endDate: Yup.string().required("required"),
  type: Yup.string().required("Required"),
  status: Yup.string().required("Required"),
});

const initialCreateSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  startDate: Yup.string().required("required"),
  endDate: Yup.string().required("required"),
  type: Yup.string().required("Required"),
});

let initialValues = {
  name: "",
  type: "",
  startDate: dayjs().format('YYYY-MM-DD'),
  endDate: dayjs().format('YYYY-MM-DD'),
  time: dayjs(),
};
const TaskForm = ({ mode = "edit", task }) => {
  const navigate = useNavigate();
  const types = ["Default", "Development", "Work", "School"];

  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));


  const handleFormSubmit = (values, onSubmitProps) => {
    if (mode === "edit") {
      axiosInstance.put(`/task/${values._id}`, values).then((res) => {
        navigate("/home");
      });
    } else {
      values.time = values.time.format('HH:mm')
      axiosInstance.post(`/task/create`, values).then((res) => {
        navigate("/home");
      });
    }
  };
  const handleDelete = (values) => {
    console.log(values)
    axiosInstance.delete(`/${values._id}`).then((res) => {
      navigate("/home");
    });
  }
  const isNotMobile = useMediaQuery("(min-width: 768px)");

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={mode === "create" ? initialValues : task}
      validationSchema={mode === "create" ? initialCreateSchema : initialEditSchema}
    >
      {({
        handleSubmit,
        handleBlur,
        touched,
        resetForm,
        values,
        handleChange,
        errors,
      }) => (
        <Box p="2rem 0" m="2rem auto" width={isNotMobile ? "50%" : "90%"}>
          <Typography variant="h5" fontWeight="bold" textAlign="center" mb="2rem">
            Create a Task
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap="30px">
              <TextField
                label="Task Name"
                value={values.name}
                name="name"
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.name) && Boolean(errors.name)}
                helperText={touched.name && errors.name}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date"
                  value={mode ==="edit" ? dayjs(values.startDate || null) : values.startDate}
                  minDate={mode === "edit" ? null : dayjs()}
                  onChange={(newValue) => {
                    values.startDate = newValue.format("YYYY-MM-DD");
                    setStartDate(values.startDate);
                  }}
                  onBlur={handleBlur}
                  name="startDate"
                  renderInput={(params) => (
                    <TextField {...params} />
                  )}
                  error={Boolean(touched.date) && Boolean(errors.date)}
                />
              </LocalizationProvider>
              {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  label="Start Time"
                  value={mode ==="edit" ? dayjs(`${values.date.split("T")[0]}T${values.time}` || null) : values.time}
                  onChange={(newValue) => {
                    values.time = newValue;
                  }}
                  name="time"
                  onBlur={handleBlur}
                  error={Boolean(touched.time) && Boolean(errors.time)}
                  renderInput={(params) => (
                    <TextField {...params} />
                  )}
                />
              </LocalizationProvider> */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="End Date"
                  value={mode ==="edit" ? dayjs(values.endDate || null) : values.endDate}
                  minDate={mode === "edit" ? null : dayjs()}
                  onChange={(newValue) => {
                    values.endDate = newValue.format("YYYY-MM-DD");
                    setEndDate(values.endDate);
                  }}
                  onBlur={handleBlur}
                  name="endDate"
                  renderInput={(params) => (
                    <TextField {...params} />
                  )}
                  error={Boolean(touched.date) && Boolean(errors.date)}
                />
              </LocalizationProvider>
              {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  label="End Time"
                  value={mode ==="edit" ? dayjs(`${values.date.split("T")[0]}T${values.time}` || null) : values.time}
                  onChange={(newValue) => {
                    values.time = newValue;
                  }}
                  name="time"
                  onBlur={handleBlur}
                  error={Boolean(touched.time) && Boolean(errors.time)}
                  renderInput={(params) => (
                    <TextField {...params} />
                  )}
                />
              </LocalizationProvider> */}
              <FormControl>
                <InputLabel>Select Type</InputLabel>
                <Select
                  label="Task type"
                  value={values.type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="type"
                  error={Boolean(touched.type) && Boolean(errors.type)}
                >
                  {types.map((type, idx) => (
                    <MenuItem value={type} key={`${idx}-${type}`}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {mode === "edit" && (
                <FormControl>
                  <InputLabel>Status</InputLabel>
                  <Select
                    label="Status"
                    value={values.status}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="status"
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                </FormControl>
              )}
              <Button
                variant="contained"
                type="submit"
                m="2rem 0"
                p="1rem 0"
              >
                {mode === "edit" ? 'Edit Task' : 'Create Task' }
              </Button>
              {mode === "edit" && (
                <Button
                  color="error"
                  variant="contained"
                  onClick={() => {
                    handleDelete(values)
                  }}
                  m="2rem 0"
                  p="1rem 0"
                >
                  Delete Task
                </Button>
              )}
            </Box>
          </form>
        </Box>
      )}
    </Formik>
  );
};

export default TaskForm;
