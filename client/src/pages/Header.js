import { Box, Select, MenuItem, Typography, Button, Container } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setLogout } from "../redux/UserSlice";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Timer from "../components/Timer";


function copyStyles(sourceDoc, targetDoc) {
  Array.from(sourceDoc.styleSheets).forEach((styleSheet) => {
    if (styleSheet.cssRules) {
      // for <style> elements
      const newStyleEl = sourceDoc.createElement("style");

      Array.from(styleSheet.cssRules).forEach((cssRule) => {
        // write the text of each rule into the body of the style element
        newStyleEl.appendChild(sourceDoc.createTextNode(cssRule.cssText));
      });

      targetDoc.head.appendChild(newStyleEl);
    } else if (styleSheet.href) {
      // for <link> elements loading CSS from a URL
      const newLinkEl = sourceDoc.createElement("link");

      newLinkEl.rel = "stylesheet";
      newLinkEl.href = styleSheet.href;
      targetDoc.head.appendChild(newLinkEl);
    }
  });
}

class MyWindowPortal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.containerEl = document.createElement("div"); // STEP 1: create an empty div
    this.externalWindow = null;
  }

  componentDidMount() {
    // STEP 3: open a new browser window and store a reference to it
    this.externalWindow = window.open(
      "",
      "",
      "width=600,height=650,left=200,top=200"
    );

    // STEP 4: append the container <div> (that has props.children appended to it) to the body of the new window
    this.externalWindow.document.body.appendChild(this.containerEl);

    this.externalWindow.document.title = "Timer";
    copyStyles(document, this.externalWindow.document);

    // update the state in the parent component if the user closes the
    // new window
    // this.externalWindow.addEventListener("beforeunload", () => {
    //   this.props.closeWindowPortal();
    // });
  }

  componentWillUnmount() {
    // This will fire when this.state.showWindowPortal in the parent component becomes false
    // So we tidy up by just closing the window
    this.externalWindow.close();
  }

  render() {
    // STEP 2: append props.children to the container <div> that isn't mounted anywhere yet
    return ReactDOM.createPortal(this.props.children, this.containerEl);
  }
}

const Header = () => {
  const {user} = useSelector((state) => state.user)
  const [isWindowPortalOpen, setIsWindowPortalOpen] = useState(false);

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
              <MenuItem onClick={()=> {setIsWindowPortalOpen(true)}}>Timer</MenuItem>
              <MenuItem onClick={()=> {dispatch(setLogout()); navigate('/')}}>Logout</MenuItem>
          </Select>
          <img src={`${process.env.REACT_APP_SERVER_URL}/assets/${user.picturePath}`} width="50px" height="50px" style={{borderRadius: '50%', objectFit: 'cover'}} alt={user.name} />
        </Box>

        {isWindowPortalOpen && (
          <MyWindowPortal>
            <Timer />
          </MyWindowPortal>
        )}
    </Box>
  );
};
export default Header;
