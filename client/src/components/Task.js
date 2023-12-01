import {
  Card,
  Box,
  CardContent,
  CardActionArea,
  Typography,
  Button,
} from "@mui/material";
const Task = ({ task }) => {
  console.log(task)
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card>
        <CardActionArea>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div" color={task.status === "completed" ? "#e0e0e0": ""} style={{textDecoration: task.status === "completed" ? "line-through" : "none"}}>
              {task.name}
            </Typography>
            <Typography gutterBottom variant="body2" color={task.status === "completed" ? "#e0e0e0": "text.secondary"} fontWeight="bold" style={{textDecoration: task.status === "completed" ? "line-through" : "none"}}>
              {task.startDate.split("T")[0]} ~ {task.endDate.split("T")[0]}
            </Typography>
            <Typography sx={{ p: 0 }} color={task.status === "completed" ? "#e0e0e0": ""} style={{textDecoration: task.status === "completed" ? "line-through" : "none"}}>{task.type}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
};
export default Task;
