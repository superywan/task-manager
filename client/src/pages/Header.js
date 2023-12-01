import { Box, Select, MenuItem, InputLabel, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setLogout } from "../redux/UserSlice";
const Header = () => {
  const {user} = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  return (
    <Box
      height="100px"
      backgroundColor="#2196f3"
      padding="0 20px"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
        <Box fontWeight="bold">
          <Typography fontWeight="bold">
            <Link to="/home" style={{color:"#e3f2fd", textDecoration: 'none'}}>Task Manger</Link>
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="15px">
          <Select sx={{boxShadow: 'none', '.MuiOutlinedInput-notchedOutline' : {border: 0}}} value={user.name} style={{color:"#e3f2fd", textDecoration: 'none', fontWeight:"bold"}}>
              <MenuItem value={user.name}>{user.name}</MenuItem>
              <MenuItem onClick={()=> {navigate('/task/create')}}>Create New Task</MenuItem>
              <MenuItem onClick={()=> {dispatch(setLogout()); navigate('/')}}>Logout</MenuItem>
          </Select>
          <img src={`${process.env.REACT_APP_SERVER_URL}/assets/${user.picturePath}`} width="50px" height="50px" style={{borderRadius: '50%', objectFit: 'cover'}} alt={user.name} />
        </Box>
    </Box>
  );
};
export default Header;
