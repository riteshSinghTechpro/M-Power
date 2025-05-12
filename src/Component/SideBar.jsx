import React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";
import { Collapse } from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import StaffCentrallogo from "../images/StaffCentral.png"; // Import your image file
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import Person3OutlinedIcon from "@mui/icons-material/Person3Outlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";

import { Link } from "react-router-dom";

import { useState, useEffect } from "react";
import axios from "axios";

const drawerWidth = 240;

// const settings = ["Profile", "Account", "Logout", "Change Password"];
const settings = ["Profile", "Change Password", "Logout"];
const routeMap = {
  Profile: "/profile",
  Account: "/account",
  "Change Password": "/changepassword",
  Logout: "/",
};

const handleLogout = () => {
  sessionStorage.removeItem("employeeName");
  window.location.href = routeMap.Logout;
};

const iconMap = {
  Profile: <Person3OutlinedIcon />,
  Account: <AccountCircleOutlinedIcon />,
  Logout: <ExitToAppOutlinedIcon />,
  "Change Password": <LockResetOutlinedIcon />,
};

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: "white",
  color: "black",
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function SideBar() {
  const name = sessionStorage.getItem("employeeName");
  let roles = sessionStorage.getItem("employeeRoles");
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [dashboardOpen, setDashboardOpen] = React.useState(false);
  const [parrent, setparrent] = React.useState(false);
  const [parrent1, setparrent1] = React.useState(false);
  const [parrent2, setparrent2] = React.useState(false);
  const baseURL = "https://staffcentral.azurewebsites.net/api";
  const [moduleLinksByRole, setModuleLinksByRole] = useState([]);
  // State for managing collapsible sections
  const [leaveRequestCollapse, setLeaveRequestCollapse] = useState(false);
  const [mastercollapseleave, setMasterCollapseLeave] = useState(false);
  const [transcollapseleave, setTransCollapseLeave] = useState(false);

  const [reportLeaves, setReportLeaves] = useState(false);

  const handleLeaveClick = () => {
    setLeaveRequestCollapse((prev) => !prev);
  };

  const handleMasterClickLeave = () => {
    setMasterCollapseLeave((prev) => !prev); // Toggle the masters section
    setTransCollapseLeave(false); // Close the transaction section
    setReportLeaves(false);
  };

  const handleRepoClickLeave = () => {
    setTransCollapseLeave((prev) => !prev); // Toggle the transaction section
    setMasterCollapseLeave(false); // Close the masters section
    setReportLeaves(false);
  };

  const handleRepoClickLeaveReport = () => {
    setReportLeaves((prev) => !prev); // Toggle the transaction section
    setMasterCollapseLeave(false);
    setTransCollapseLeave(false);
  };

  useEffect(() => {
    axios
      .get(baseURL + "/LinkRoleMapping/GetAllLink-RoleMappingView")
      .then((response) => {
        if (roles != null) {
          roles = sessionStorage.getItem("employeeRoles").split(",");
          // Filter data based on roleText
          const filteredData = response.data.filter((item) =>
            roles.includes(item.roleText.trim())
          );

          // Merge data based on moduleName
          const mergedData = filteredData.reduce((acc, curr) => {
            const existingModule = acc.find(
              (item) => item.moduleName === curr.moduleName
            );
            if (existingModule) {
              // Merge and remove duplicates for moduleLinkId
              const moduleLinkIdSet = new Set([
                ...existingModule.moduleLinkId.split(", "),
                ...curr.moduleLinkId.split(", "),
              ]);
              existingModule.moduleLinkId =
                Array.from(moduleLinkIdSet).join(", ");

              // Merge and remove duplicates for linkNames
              const linkNamesSet = new Set([
                ...existingModule.linkNames.split(", "),
                ...curr.linkNames.split(", "),
              ]);
              existingModule.linkNames = Array.from(linkNamesSet).join(", ");

              // Merge roleId and roleText as it is unique no need to remove duplicates
              existingModule.roleId += `, ${curr.roleId}`;
              existingModule.roleText += `, ${curr.roleText}`;
            } else {
              acc.push(curr);
            }
            return acc;
          }, []);
          setModuleLinksByRole(mergedData);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
    setparrent(false);
    setparrent1(false);
    setparrent2(false);
  };

  const handleDashboardClick = () => {
    setDashboardOpen(!dashboardOpen);
    if (!dashboardOpen) {
      setparrent(false);
    }
  };

  const handaleclidasbor2 = () => {
    if (parrent == false) {
      setparrent(true);
      setparrent1(false);
      setparrent2(false);
    } else {
      setparrent(false);
    }
  };

  const handaleclidasbor3 = () => {
    if (parrent1 == false) {
      setparrent1(true);
      setparrent(false);
      setparrent2(false);
    } else {
      setparrent1(false);
    }
  };

  const handaleclidasbor4 = () => {
    if (parrent2 == false) {
      setparrent2(true);
      setparrent(false);
      setparrent1(false);
    } else {
      setparrent2(false);
    }
  };

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const [expanded, setExpanded] = useState(false);
  const [tranexpand, setTranexpand] = useState(false);
  const [reportscollapse, setReportscollpase] = useState(false);
  const [mastercollapseemp, setMastercollapseemp] = useState(false);
  const [transcollapseemp, setTranscollapseemp] = useState(false);
  const [cvmastercollapse, setCVmastercollapse] = useState(false);
  const [cvtransection, setCVtransection] = useState(false);

  const navigate = useNavigate();

  const handleMasterClick = () => {
    if (expanded === false) {
      setExpanded(true);
      setTranexpand(false);
      setReportscollpase(false);
    } else {
      setExpanded(false);
    }
  };
  const handletransClick = () => {
    if (tranexpand == false) {
      setTranexpand(true);
      setExpanded(false);
      setReportscollpase(false);
    } else {
      setTranexpand(false);
    }
  };
  const handlReportClick = () => {
    if (reportscollapse == false) {
      setReportscollpase(true);
      setTranexpand(false);
      setExpanded(false);
    } else {
      setReportscollpase(false);
    }
  };
  const handleMasterClickEmp = () => {
    if (mastercollapseemp === false) {
      setMastercollapseemp(true);
      setTranscollapseemp(false);
    } else {
      setMastercollapseemp(false);
    }
  };
  const handleRepoClickEmp = () => {
    if (transcollapseemp === false) {
      setTranscollapseemp(true);
      setMastercollapseemp(false);
    } else {
      setTranscollapseemp(false);
    }
  };

  const handleCVclick = () => {
    if (cvmastercollapse == false) {
      setCVmastercollapse(true);
    } else {
      setCVmastercollapse(false);
    }
  };
  const handleCVTransClick = () => {
    if (cvtransection == false) {
      setCVtransection(true);
    } else {
      setCVtransection(false);
    }
  };
  const transFun = () => {
    localStorage.removeItem("userEdit");
    localStorage.removeItem("empData", "employeeList");
    localStorage.removeItem("userEdit", "user");
    navigate("/transactionMaster");
  };
  let sideNav = [];
  if (moduleLinksByRole.length > 0) {
    const order = [
      "Employee Management",
      "Role Management",
      "Leave Management",
      "User Management",
      "CV Generation",
    ];
    for (let i = 0; i < order.length; i++) {
      for (let j = 0; j < moduleLinksByRole.length; j++) {
        if (moduleLinksByRole[j].moduleName === order[i]) {
          sideNav.push(moduleLinksByRole[j]);
          break;
        }
      }
    }
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ marginLeft: "auto" }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Typography component="h5" className="admin-title">
                  {name}
                </Typography>
                <Avatar
                  alt="Remy Sharp"
                  src="https://einfosoft.com/templates/admin/kuber/source/light/assets/images/user/admin.jpg"
                />
              </IconButton>
            </Tooltip>

            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={
                    setting === "Logout" ? handleLogout : handleCloseUserMenu
                  }
                  component={Link}
                  to={routeMap[setting]}
                >
                  {(setting === "Account" ||
                    setting === "Logout" ||
                    moduleLinksByRole.some((module) =>
                      module.linkNames.includes(setting)
                    )) && (
                    <>
                      <ListItemIcon>{iconMap[setting]}</ListItemIcon>
                      <Typography textAlign="center"> {setting}</Typography>
                    </>
                  )}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer className="side-menu-text" variant="permanent" open={open}>
        <DrawerHeader>
          <Avatar
            className="mart-logo"
            alt="Online Mart"
            src={StaffCentrallogo}
          />
          <IconButton className="left-click" onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>

        <List>
          {/* <Typography className='dashboard-tr'>Dashboard</Typography> */}
          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={() => {
              navigate("/dashboard");
            }}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                  color: "black",
                }}
              >
                <SpaceDashboardOutlinedIcon />
              </ListItemIcon>
              <ListItemText
                primary="Dashboard"
                sx={{
                  opacity: open ? 1 : 0,
                  color: "black",
                }}
              />
            </ListItemButton>
          </ListItem>

          <div>
            {sideNav.map((module, index) => (
              <div key={index}>
                {/* Employee Management Module Start */}
                {module.moduleName == "Employee Management" && (
                  <ListItem
                    disablePadding
                    sx={{ display: "block" }}
                    onClick={handaleclidasbor3}
                  >
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center",
                          color: "black",
                        }}
                      >
                        <BadgeOutlinedIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Employee Management"
                        sx={{
                          opacity: open ? 1 : 0,
                          color: "black",
                        }}
                      />
                      {open ? (
                        parrent ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )
                      ) : null}
                    </ListItemButton>
                  </ListItem>
                )}
                {module.moduleName === "Employee Management" && (
                  <Collapse
                    className="smsvg"
                    in={parrent1}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {(module.linkNames.includes("Designation") ||
                        module.linkNames.includes("Document Type") ||
                        module.linkNames.includes("Skill Master") ||
                        module.linkNames.includes("Department Master") ||
                        module.linkNames.includes("Employee Role")) && ( // Added check for Employee Role
                        <>
                          <ListItem
                            disablePadding
                            sx={{ display: "block" }}
                            onClick={handleMasterClickEmp}
                          >
                            <ListItemButton
                              sx={{
                                minHeight: 48,
                                justifyContent: open ? "initial" : "center",
                                px: 2.5,
                                pl: 4,
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: open ? 4 : "auto",
                                  justifyContent: "center",
                                  color: "black",
                                  pl: 4,
                                }}
                              >
                                <CircleOutlinedIcon />
                              </ListItemIcon>

                              <ListItemText
                                primary="Masters"
                                sx={{
                                  opacity: open ? 1 : 0,
                                  color: "black",
                                }}
                              />
                              {open ? (
                                mastercollapseemp ? (
                                  <ExpandLessIcon />
                                ) : (
                                  <ExpandMoreIcon />
                                )
                              ) : null}
                            </ListItemButton>
                          </ListItem>

                          {mastercollapseemp && (
                            <List sx={{ pl: 4 }}>
                              {module.linkNames.includes("Designation") && (
                                <ListItem
                                  disablePadding
                                  sx={{ display: "block" }}
                                  onClick={() => navigate("/DesignationMaster")}
                                >
                                  <ListItemButton
                                    sx={{
                                      minHeight: 48,
                                      justifyContent: open
                                        ? "initial"
                                        : "center",
                                      px: 2.5,
                                      pl: 4,
                                    }}
                                  >
                                    <ListItemIcon
                                      sx={{
                                        minWidth: 0,
                                        mr: open ? 2 : "auto",
                                        justifyContent: "center",
                                        color: "black",
                                      }}
                                    >
                                      <CircleOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary="Designation"
                                      sx={{
                                        opacity: open ? 1 : 0,
                                        color: "black",
                                      }}
                                    />
                                  </ListItemButton>
                                </ListItem>
                              )}
                              {module.linkNames.includes("Document Type") && (
                                <ListItem
                                  disablePadding
                                  sx={{ display: "block" }}
                                  onClick={() =>
                                    navigate("/documentTypeMaster")
                                  }
                                >
                                  <ListItemButton
                                    sx={{
                                      minHeight: 48,
                                      justifyContent: open
                                        ? "initial"
                                        : "center",
                                      px: 2.5,
                                      pl: 4,
                                    }}
                                  >
                                    <ListItemIcon
                                      sx={{
                                        minWidth: 0,
                                        mr: open ? 2 : "auto",
                                        justifyContent: "center",
                                        color: "black",
                                      }}
                                    >
                                      <CircleOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary="Document Type"
                                      sx={{
                                        opacity: open ? 1 : 0,
                                        color: "black",
                                      }}
                                    />
                                  </ListItemButton>
                                </ListItem>
                              )}
                              {module.linkNames.includes("Skill Master") && (
                                <ListItem
                                  disablePadding
                                  sx={{ display: "block" }}
                                  onClick={() => navigate("/SkillMaster")}
                                >
                                  <ListItemButton
                                    sx={{
                                      minHeight: 48,
                                      justifyContent: open
                                        ? "initial"
                                        : "center",
                                      px: 2.5,
                                      pl: 4,
                                    }}
                                  >
                                    <ListItemIcon
                                      sx={{
                                        minWidth: 0,
                                        mr: open ? 2 : "auto",
                                        justifyContent: "center",
                                        color: "black",
                                      }}
                                    >
                                      <CircleOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary="Skill Master"
                                      sx={{
                                        opacity: open ? 1 : 0,
                                        color: "black",
                                      }}
                                    />
                                  </ListItemButton>
                                </ListItem>
                              )}
                              {module.linkNames.includes("Department") && (
                                <ListItem
                                  disablePadding
                                  sx={{ display: "block" }}
                                  onClick={() => navigate("/DepartmentMaster")}
                                >
                                  <ListItemButton
                                    sx={{
                                      minHeight: 48,
                                      justifyContent: open
                                        ? "initial"
                                        : "center",
                                      px: 2.5,
                                      pl: 4,
                                    }}
                                  >
                                    <ListItemIcon
                                      sx={{
                                        minWidth: 0,
                                        mr: open ? 2 : "auto",
                                        justifyContent: "center",
                                        color: "black",
                                      }}
                                    >
                                      <CircleOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary="Department"
                                      sx={{
                                        opacity: open ? 1 : 0,
                                        color: "black",
                                      }}
                                    />
                                  </ListItemButton>
                                </ListItem>
                              )}
                              {module.linkNames.includes("Employee Role") && ( // Added Employee Role
                                <ListItem
                                  disablePadding
                                  sx={{ display: "block" }}
                                  onClick={() =>
                                    navigate("/EmployeeRoleMaster")
                                  } // Change to the correct route
                                >
                                  <ListItemButton
                                    sx={{
                                      minHeight: 48,
                                      justifyContent: open
                                        ? "initial"
                                        : "center",
                                      px: 2.5,
                                      pl: 4,
                                    }}
                                  >
                                    <ListItemIcon
                                      sx={{
                                        minWidth: 0,
                                        mr: open ? 2 : "auto",
                                        justifyContent: "center",
                                        color: "black",
                                      }}
                                    >
                                      <CircleOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary="Employee Role"
                                      sx={{
                                        opacity: open ? 1 : 0,
                                        color: "black",
                                      }}
                                    />
                                  </ListItemButton>
                                </ListItem>
                              )}
                            </List>
                          )}
                        </>
                      )}

                      {(module.linkNames.includes("Employee List") ||
                        module.linkNames.includes("Employee Form")) && (
                        <>
                          <ListItem
                            disablePadding
                            sx={{ display: "block" }}
                            onClick={handleRepoClickEmp}
                          >
                            <ListItemButton
                              sx={{
                                minHeight: 48,
                                justifyContent: open ? "initial" : "center",
                                px: 2.5,
                                pl: 4,
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: open ? 4 : "auto",
                                  justifyContent: "center",
                                  color: "black",
                                  pl: 4,
                                }}
                              >
                                <CircleOutlinedIcon />
                              </ListItemIcon>

                              <ListItemText
                                primary="Transaction"
                                sx={{
                                  opacity: open ? 1 : 0,
                                  color: "black",
                                }}
                              />
                              {open ? (
                                transcollapseemp ? (
                                  <ExpandLessIcon />
                                ) : (
                                  <ExpandMoreIcon />
                                )
                              ) : null}
                            </ListItemButton>
                          </ListItem>

                          {transcollapseemp && (
                            <List sx={{ pl: 4 }}>
                              {module.linkNames.includes("Employee List") && (
                                <ListItem
                                  disablePadding
                                  sx={{ display: "block" }}
                                  onClick={() => navigate("/employeedetails")}
                                >
                                  <ListItemButton
                                    sx={{
                                      minHeight: 48,
                                      justifyContent: open
                                        ? "initial"
                                        : "center",
                                      px: 2.5,
                                      pl: 4,
                                    }}
                                  >
                                    <ListItemIcon
                                      sx={{
                                        minWidth: 0,
                                        mr: open ? 2 : "auto",
                                        justifyContent: "center",
                                        color: "black",
                                      }}
                                    >
                                      <CircleOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary="Employee List"
                                      sx={{
                                        opacity: open ? 1 : 0,
                                        color: "black",
                                      }}
                                    />
                                  </ListItemButton>
                                </ListItem>
                              )}
                              {module.linkNames.includes("Employee Form") && (
                                <ListItem
                                  disablePadding
                                  sx={{ display: "block" }}
                                  onClick={() => navigate("/transactionMaster")}
                                >
                                  <ListItemButton
                                    sx={{
                                      minHeight: 48,
                                      justifyContent: open
                                        ? "initial"
                                        : "center",
                                      px: 2.5,
                                      pl: 4,
                                    }}
                                  >
                                    <ListItemIcon
                                      sx={{
                                        minWidth: 0,
                                        mr: open ? 2 : "auto",
                                        justifyContent: "center",
                                        color: "black",
                                      }}
                                    >
                                      <CircleOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary="Employee Form"
                                      sx={{
                                        opacity: open ? 1 : 0,
                                        color: "black",
                                      }}
                                    />
                                  </ListItemButton>
                                </ListItem>
                              )}
                            </List>
                          )}
                        </>
                      )}
                    </List>
                  </Collapse>
                )}

                {/* Employee Management Module End */}
                {/* Role Management Module Start */}
                {module.moduleName == "Role Management" && (
                  <ListItem
                    disablePadding
                    sx={{ display: "block" }}
                    onClick={handaleclidasbor2}
                  >
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center",
                          color: "black",
                        }}
                      >
                        <GridViewOutlinedIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Role Management"
                        sx={{
                          opacity: open ? 1 : 0,
                          color: "black",
                        }}
                      />
                      {open ? (
                        parrent ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )
                      ) : null}
                    </ListItemButton>
                  </ListItem>
                )}

                {module.moduleName == "Role Management" && (
                  <Collapse in={parrent} timeout="auto" unmountOnExit>
                    <List className="smsvg" component="div" disablePadding>
                      {/* Masters Group */}
                      {module.linkNames.includes("Role Master") ||
                      module.linkNames.includes("Link And Role Mapping") ? (
                        <>
                          <ListItem
                            disablePadding
                            sx={{ display: "block" }}
                            onClick={handleMasterClick}
                          >
                            <ListItemButton
                              sx={{
                                minHeight: 48,
                                justifyContent: open ? "initial" : "center",
                                px: 2.5,
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: open ? 3 : "auto",
                                  justifyContent: "center",
                                  color: "black",

                                  position: "relative",
                                  left: "30px",
                                }}
                              >
                                <CircleOutlinedIcon />
                              </ListItemIcon>
                              <ListItemText
                                primary="Masters"
                                sx={{
                                  opacity: open ? 1 : 0,
                                  color: "black",
                                  position: "relative",
                                  left: "35px",
                                }}
                              />
                              {open ? (
                                expanded ? (
                                  <ExpandLessIcon />
                                ) : (
                                  <ExpandMoreIcon />
                                )
                              ) : null}
                            </ListItemButton>
                          </ListItem>

                          <Collapse in={expanded} timeout="auto" unmountOnExit>
                            <List sx={{ pl: 4 }}>
                              {(module.linkNames.includes("Role Master") ||
                                module.linkNames.includes(
                                  "Link And Role Mapping"
                                )) && (
                                <>
                                  {module.linkNames.includes("Role Master") && (
                                    <ListItem
                                      disablePadding
                                      sx={{ display: "block" }}
                                      onClick={() => {
                                        navigate("/rolemaster");
                                      }}
                                    >
                                      <ListItemButton
                                        sx={{
                                          minHeight: 48,
                                          justifyContent: open
                                            ? "initial"
                                            : "center",
                                          px: 2.5,
                                          pl: 4,
                                        }}
                                      >
                                        <ListItemIcon
                                          sx={{
                                            minWidth: 0,
                                            mr: open ? 2 : "auto",
                                            justifyContent: "center",
                                            color: "black",
                                          }}
                                        >
                                          <CircleOutlinedIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                          primary="Role Masters"
                                          sx={{
                                            opacity: open ? 1 : 0,
                                            color: "black",
                                          }}
                                        />
                                      </ListItemButton>
                                    </ListItem>
                                  )}

                                  {module.linkNames.includes(
                                    "Link And Role Mapping"
                                  ) && (
                                    <ListItem
                                      disablePadding
                                      sx={{ display: "block" }}
                                      onClick={() => {
                                        navigate("/userrolemapping");
                                      }}
                                    >
                                      <ListItemButton
                                        sx={{
                                          minHeight: 48,
                                          justifyContent: open
                                            ? "initial"
                                            : "center",
                                          px: 2.5,
                                          pl: 4,
                                        }}
                                      >
                                        <ListItemIcon
                                          sx={{
                                            minWidth: 0,
                                            mr: open ? 2 : "auto",
                                            justifyContent: "center",
                                            color: "black",
                                          }}
                                        >
                                          <CircleOutlinedIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                          primary="Link & Role Mapping"
                                          sx={{
                                            opacity: open ? 1 : 0,
                                            color: "black",
                                          }}
                                        />
                                      </ListItemButton>
                                    </ListItem>
                                  )}
                                </>
                              )}
                            </List>
                          </Collapse>
                        </>
                      ) : null}

                      {module.linkNames.includes("User & Role Mapping") ? (
                        <>
                          <ListItem
                            disablePadding
                            sx={{ display: "block" }}
                            onClick={handletransClick}
                          >
                            <ListItemButton
                              sx={{
                                minHeight: 48,
                                justifyContent: open ? "initial" : "center",
                                px: 2.5,
                                pl: 4,
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: open ? 4 : "auto",
                                  justifyContent: "center",
                                  color: "black",
                                }}
                              ></ListItemIcon>
                              <CircleOutlinedIcon />

                              <ListItemText
                                primary="Transaction"
                                sx={{
                                  opacity: open ? 1 : 0,
                                  color: "black",
                                  position: "relative",
                                  left: "30px",
                                }}
                              />
                              {open ? (
                                tranexpand ? (
                                  <ExpandLessIcon />
                                ) : (
                                  <ExpandMoreIcon />
                                )
                              ) : null}
                            </ListItemButton>
                          </ListItem>

                          {tranexpand === true ? (
                            <List sx={{ pl: 4 }}>
                              {module.linkNames.includes(
                                "User & Role Mapping"
                              ) && (
                                <ListItem
                                  disablePadding
                                  sx={{ display: "block" }}
                                  onClick={() => {
                                    navigate("/userandrolemapping");
                                  }}
                                >
                                  <ListItemButton
                                    sx={{
                                      minHeight: 48,
                                      justifyContent: open
                                        ? "initial"
                                        : "center",
                                      px: 2.5,
                                      pl: 4,
                                    }}
                                  >
                                    <ListItemIcon
                                      sx={{
                                        minWidth: 0,
                                        mr: open ? 2 : "auto",
                                        justifyContent: "center",
                                        color: "black",
                                      }}
                                    >
                                      <CircleOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary="User & Role Mapping"
                                      sx={{
                                        opacity: open ? 1 : 0,
                                        color: "black",
                                      }}
                                    />
                                  </ListItemButton>
                                </ListItem>
                              )}
                            </List>
                          ) : null}
                        </>
                      ) : null}

                      {module.linkNames.includes("User Role Access") ? (
                        <>
                          <ListItem
                            disablePadding
                            sx={{ display: "block" }}
                            onClick={handlReportClick}
                          >
                            <ListItemButton
                              sx={{
                                minHeight: 48,
                                justifyContent: open ? "initial" : "center",
                                px: 2.5,
                                pl: 4,
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: open ? 4 : "auto",
                                  justifyContent: "center",
                                  color: "black",
                                }}
                              ></ListItemIcon>
                              <CircleOutlinedIcon />

                              <ListItemText
                                primary="Reports"
                                sx={{
                                  opacity: open ? 1 : 0,
                                  color: "black",
                                  position: "relative",
                                  left: "30px",
                                }}
                              />
                              {open ? (
                                reportscollapse ? (
                                  <ExpandLessIcon />
                                ) : (
                                  <ExpandMoreIcon />
                                )
                              ) : null}
                            </ListItemButton>
                          </ListItem>

                          {reportscollapse === true ? (
                            <List sx={{ pl: 4 }}>
                              {module.linkNames.includes(
                                "User Role Access"
                              ) && (
                                <ListItem
                                  disablePadding
                                  sx={{ display: "block" }}
                                  onClick={() => {
                                    navigate("/userroleaccess");
                                  }}
                                >
                                  <ListItemButton
                                    sx={{
                                      minHeight: 48,
                                      justifyContent: open
                                        ? "initial"
                                        : "center",
                                      px: 2.5,
                                      pl: 4,
                                    }}
                                  >
                                    <ListItemIcon
                                      sx={{
                                        minWidth: 0,
                                        mr: open ? 2 : "auto",
                                        justifyContent: "center",
                                        color: "black",
                                      }}
                                    >
                                      <CircleOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary="User Role Access"
                                      sx={{
                                        opacity: open ? 1 : 0,
                                        color: "black",
                                      }}
                                    />
                                  </ListItemButton>
                                </ListItem>
                              )}
                            </List>
                          ) : null}
                        </>
                      ) : null}
                    </List>
                  </Collapse>
                )}
                {/* Role Management Module End */}

                {/* Leave Management Module Start */}
                {module.moduleName === "Leave Management" && (
                  <ListItem
                    disablePadding
                    sx={{ display: "block" }}
                    onClick={handleLeaveClick}
                  >
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center",
                          color: "black",
                        }}
                      >
                        <BadgeOutlinedIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Leave Management"
                        sx={{
                          opacity: open ? 1 : 0,
                          color: "black",
                        }}
                      />
                      {open ? (
                        leaveRequestCollapse ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )
                      ) : null}
                    </ListItemButton>
                  </ListItem>
                )}

                {/* Expand the submodules when Leave Management is clicked */}
                {module.moduleName === "Leave Management" && (
                  <Collapse
                    className="smsvg"
                    in={leaveRequestCollapse}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {(module.linkNames.includes("Leave Type") ||
                        module.linkNames.includes("Holiday Master") ||
                        module.linkNames.includes("Leave Approval")) && (
                        <>
                          <ListItem
                            disablePadding
                            sx={{ display: "block" }}
                            onClick={handleMasterClickLeave}
                          >
                            <ListItemButton
                              sx={{
                                minHeight: 48,
                                justifyContent: open ? "initial" : "center",
                                px: 2.5,
                                pl: 4,
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: open ? 4 : "auto",
                                  justifyContent: "center",
                                  color: "black",
                                  pl: 4,
                                }}
                              >
                                <CircleOutlinedIcon />
                              </ListItemIcon>

                              <ListItemText
                                primary="Master"
                                sx={{
                                  opacity: open ? 1 : 0,
                                  color: "black",
                                }}
                              />
                              {open ? (
                                mastercollapseleave ? (
                                  <ExpandLessIcon />
                                ) : (
                                  <ExpandMoreIcon />
                                )
                              ) : null}
                            </ListItemButton>
                          </ListItem>

                          {/* Master Submodules */}
                          {mastercollapseleave && (
                            <List sx={{ pl: 4 }}>
                              {module.linkNames.includes("Holiday Master") && (
                                <ListItem
                                  disablePadding
                                  sx={{ display: "block" }}
                                  onClick={() => navigate("/HolidayMaster")}
                                >
                                  <ListItemButton
                                    sx={{
                                      minHeight: 48,
                                      justifyContent: open
                                        ? "initial"
                                        : "center",
                                      px: 2.5,
                                      pl: 4,
                                    }}
                                  >
                                    <ListItemIcon
                                      sx={{
                                        minWidth: 0,
                                        mr: open ? 2 : "auto",
                                        justifyContent: "center",
                                        color: "black",
                                      }}
                                    >
                                      <CircleOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary="Holiday Master"
                                      sx={{
                                        opacity: open ? 1 : 0,
                                        color: "black",
                                      }}
                                    />
                                  </ListItemButton>
                                </ListItem>
                              )}

                              {module.linkNames.includes("Leave Type") && (
                                <ListItem
                                  disablePadding
                                  sx={{ display: "block" }}
                                  onClick={() => navigate("/LeaveTypeMaster")}
                                >
                                  <ListItemButton
                                    sx={{
                                      minHeight: 48,
                                      justifyContent: open
                                        ? "initial"
                                        : "center",
                                      px: 2.5,
                                      pl: 4,
                                    }}
                                  >
                                    <ListItemIcon
                                      sx={{
                                        minWidth: 0,
                                        mr: open ? 2 : "auto",
                                        justifyContent: "center",
                                        color: "black",
                                      }}
                                    >
                                      <CircleOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary="Leave Type"
                                      sx={{
                                        opacity: open ? 1 : 0,
                                        color: "black",
                                      }}
                                    />
                                  </ListItemButton>
                                </ListItem>
                              )}

                              {module.linkNames.includes("Leave Approval") && (
                                <ListItem
                                  disablePadding
                                  sx={{ display: "block" }}
                                  onClick={() =>
                                    navigate("/LeaveApprovalMaster")
                                  }
                                >
                                  <ListItemButton
                                    sx={{
                                      minHeight: 48,
                                      justifyContent: open
                                        ? "initial"
                                        : "center",
                                      px: 2.5,
                                      pl: 4,
                                    }}
                                  >
                                    <ListItemIcon
                                      sx={{
                                        minWidth: 0,
                                        mr: open ? 2 : "auto",
                                        justifyContent: "center",
                                        color: "black",
                                      }}
                                    >
                                      <CircleOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary="Leave Approval"
                                      sx={{
                                        opacity: open ? 1 : 0,
                                        color: "black",
                                      }}
                                    />
                                  </ListItemButton>
                                </ListItem>
                              )}
                            </List>
                          )}
                        </>
                      )}

                      {/* Transaction Section */}
                      {module.linkNames.includes("Leave Request") && (
                        <>
                          <ListItem
                            disablePadding
                            sx={{ display: "block" }}
                            onClick={handleRepoClickLeave}
                          >
                            <ListItemButton
                              sx={{
                                minHeight: 48,
                                justifyContent: open ? "initial" : "center",
                                px: 2.5,
                                pl: 4,
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: open ? 4 : "auto",
                                  justifyContent: "center",
                                  color: "black",
                                  pl: 4,
                                }}
                              >
                                <CircleOutlinedIcon />
                              </ListItemIcon>

                              <ListItemText
                                primary="Transaction"
                                sx={{
                                  opacity: open ? 1 : 0,
                                  color: "black",
                                }}
                              />
                              {open ? (
                                transcollapseleave ? (
                                  <ExpandLessIcon />
                                ) : (
                                  <ExpandMoreIcon />
                                )
                              ) : null}
                            </ListItemButton>
                          </ListItem>

                          {/* Transaction Submodules */}
                          {transcollapseleave && (
                            <List sx={{ pl: 4 }}>
                              {module.linkNames.includes("Leave Request") && (
                                <ListItem
                                  disablePadding
                                  sx={{ display: "block" }}
                                  onClick={() => navigate("/LeaveRequest")}
                                >
                                  <ListItemButton
                                    sx={{
                                      minHeight: 48,
                                      justifyContent: open
                                        ? "initial"
                                        : "center",
                                      px: 2.5,
                                      pl: 4,
                                    }}
                                  >
                                    <ListItemIcon
                                      sx={{
                                        minWidth: 0,
                                        mr: open ? 2 : "auto",
                                        justifyContent: "center",
                                        color: "black",
                                      }}
                                    >
                                      <CircleOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary="Leave Request"
                                      sx={{
                                        opacity: open ? 1 : 0,
                                        color: "black",
                                      }}
                                    />
                                  </ListItemButton>
                                </ListItem>
                              )}
                            </List>
                          )}
                        </>
                      )}

                      {/* Reports  start here */}
                      {module.linkNames.includes("Leave Request") && (
                        <>
                          <ListItem
                            disablePadding
                            sx={{ display: "block" }}
                            onClick={handleRepoClickLeaveReport}
                          >
                            <ListItemButton
                              sx={{
                                minHeight: 48,
                                justifyContent: open ? "initial" : "center",
                                px: 2.5,
                                pl: 4,
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: open ? 4 : "auto",
                                  justifyContent: "center",
                                  color: "black",
                                  pl: 4,
                                }}
                              >
                                <CircleOutlinedIcon />
                              </ListItemIcon>

                              <ListItemText
                                primary="Reports"
                                sx={{
                                  opacity: open ? 1 : 0,
                                  color: "black",
                                }}
                              />
                              {open ? (
                                reportLeaves ? (
                                  <ExpandLessIcon />
                                ) : (
                                  <ExpandMoreIcon />
                                )
                              ) : null}
                            </ListItemButton>
                          </ListItem>

                          {/* Report module of Attendance Submodules */}
                          {reportLeaves && (
                            <List sx={{ pl: 4 }}>
                              {module.linkNames.includes("Leave Request") && (
                                <ListItem
                                  disablePadding
                                  sx={{ display: "block" }}
                                  onClick={() => navigate("/leaveBalanceReport")}
                                >
                                  <ListItemButton
                                    sx={{
                                      minHeight: 48,
                                      justifyContent: open
                                        ? "initial"
                                        : "center",
                                      px: 2.5,
                                      pl: 4,
                                    }}
                                  >
                                    <ListItemIcon
                                      sx={{
                                        minWidth: 0,
                                        mr: open ? 2 : "auto",
                                        justifyContent: "center",
                                        color: "black",
                                      }}
                                    >
                                      <CircleOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary="Leave Balance Report"
                                      sx={{
                                        opacity: open ? 1 : 0,
                                        color: "black",
                                      }}
                                    />
                                  </ListItemButton>
                                </ListItem>
                              )}
                            </List>
                          )}
                          

                          {reportLeaves && (
                            <List sx={{ pl: 4 }}>
                              {module.linkNames.includes("Leave Request") && (
                                <ListItem
                                  disablePadding
                                  sx={{ display: "block" }}
                                  onClick={() => navigate("/leaveAppliedReport")}
                                >
                                  <ListItemButton
                                    sx={{
                                      minHeight: 48,
                                      justifyContent: open
                                        ? "initial"
                                        : "center",
                                      px: 2.5,
                                      pl: 4,
                                    }}
                                  >
                                    <ListItemIcon
                                      sx={{
                                        minWidth: 0,
                                        mr: open ? 2 : "auto",
                                        justifyContent: "center",
                                        color: "black",
                                      }}
                                    >
                                      <CircleOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary="Leave Applied Report"
                                      sx={{
                                        opacity: open ? 1 : 0,
                                        color: "black",
                                      }}
                                    />
                                  </ListItemButton>
                                </ListItem>
                              )}
                            </List>
                          )}


                        </>
                      )}
                    </List>
                  </Collapse>
                )}

                {/* Leave Management Module End */}

                {/* CV Generation Module Start */}
                {module.moduleName === "CV Generation" && (
                  <ListItem
                    disablePadding
                    sx={{ display: "block" }}
                    onClick={handaleclidasbor4}
                  >
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center",
                          color: "black",
                        }}
                      >
                        <SettingsOutlinedIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="CV Generation"
                        sx={{
                          opacity: open ? 1 : 0,
                          color: "black",
                        }}
                      />
                      {open ? (
                        parrent ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )
                      ) : null}
                    </ListItemButton>
                  </ListItem>
                )}

                {module.moduleName === "CV Generation" && (
                  <Collapse in={parrent2} timeout="auto" unmountOnExit>
                    <List className="smsvg" component="div" disablePadding>
                      {(module.linkNames.includes("Template Master") ||
                        module.linkNames.includes("Objective Master") ||
                        module.linkNames.includes("Client Master")) && (
                        <>
                          <ListItem
                            disablePadding
                            sx={{ display: "block" }}
                            onClick={handleCVclick}
                          >
                            <ListItemButton
                              sx={{
                                minHeight: 48,
                                justifyContent: open ? "initial" : "center",
                                px: 2.5,
                                pl: 4,
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: open ? 4 : "auto",
                                  justifyContent: "center",
                                  color: "black",
                                }}
                              ></ListItemIcon>
                              <CircleOutlinedIcon />

                              <ListItemText
                                primary="Masters"
                                sx={{
                                  opacity: open ? 1 : 0,
                                  color: "black",
                                  position: "relative",
                                  left: "35px",
                                }}
                              />
                              {open ? (
                                cvmastercollapse ? (
                                  <ExpandLessIcon />
                                ) : (
                                  <ExpandMoreIcon />
                                )
                              ) : null}
                            </ListItemButton>
                          </ListItem>

                          {cvmastercollapse === true ? (
                            <List sx={{ pl: 4 }}>
                              {(module.linkNames.includes("Template Master") ||
                                module.linkNames.includes("Objective Master") ||
                                module.linkNames.includes("Client Master")) && (
                                <>
                                  {module.linkNames.includes(
                                    "Template Master"
                                  ) && (
                                    <ListItem
                                      disablePadding
                                      sx={{ display: "block" }}
                                      onClick={() => {
                                        navigate("/templatemaster");
                                      }}
                                    >
                                      <ListItemButton
                                        sx={{
                                          minHeight: 48,
                                          justifyContent: open
                                            ? "initial"
                                            : "center",
                                          px: 2.5,
                                          pl: 4,
                                        }}
                                      >
                                        <ListItemIcon
                                          sx={{
                                            minWidth: 0,
                                            mr: open ? 2 : "auto",
                                            justifyContent: "center",
                                            color: "black",
                                          }}
                                        >
                                          <CircleOutlinedIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                          primary="Template Master"
                                          sx={{
                                            opacity: open ? 1 : 0,
                                            color: "black",
                                          }}
                                        />
                                      </ListItemButton>
                                    </ListItem>
                                  )}
                                  {module.linkNames.includes(
                                    "Objective Master"
                                  ) && (
                                    <ListItem
                                      disablePadding
                                      sx={{ display: "block" }}
                                      onClick={() => {
                                        navigate("/Objectivemaster");
                                      }}
                                    >
                                      <ListItemButton
                                        sx={{
                                          minHeight: 48,
                                          justifyContent: open
                                            ? "initial"
                                            : "center",
                                          px: 2.5,
                                          pl: 4,
                                        }}
                                      >
                                        <ListItemIcon
                                          sx={{
                                            minWidth: 0,
                                            mr: open ? 2 : "auto",
                                            justifyContent: "center",
                                            color: "black",
                                          }}
                                        >
                                          <CircleOutlinedIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                          primary="Objective Master"
                                          sx={{
                                            opacity: open ? 1 : 0,
                                            color: "black",
                                          }}
                                        />
                                      </ListItemButton>
                                    </ListItem>
                                  )}

                                  {module.linkNames.includes(
                                    "Client Master"
                                  ) && (
                                    <ListItem
                                      disablePadding
                                      sx={{ display: "block" }}
                                      onClick={() => {
                                        navigate("/clientmaster");
                                      }}
                                    >
                                      <ListItemButton
                                        sx={{
                                          minHeight: 48,
                                          justifyContent: open
                                            ? "initial"
                                            : "center",
                                          px: 2.5,
                                          pl: 4,
                                        }}
                                      >
                                        <ListItemIcon
                                          sx={{
                                            minWidth: 0,
                                            mr: open ? 2 : "auto",
                                            justifyContent: "center",
                                            color: "black",
                                          }}
                                        >
                                          <CircleOutlinedIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                          primary="Client Master"
                                          sx={{
                                            opacity: open ? 1 : 0,
                                            color: "black",
                                          }}
                                        />
                                      </ListItemButton>
                                    </ListItem>
                                  )}
                                </>
                              )}
                            </List>
                          ) : null}
                        </>
                      )}

                      {(module.linkNames.includes("Create CV") ||
                        module.linkNames.includes("Generated CV")) && (
                        <>
                          <ListItem
                            disablePadding
                            sx={{ display: "block" }}
                            onClick={handleCVTransClick}
                          >
                            <ListItemButton
                              sx={{
                                minHeight: 48,
                                justifyContent: open ? "initial" : "center",
                                px: 2.5,
                                pl: 4,
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: open ? 4 : "auto",
                                  justifyContent: "center",
                                  color: "black",
                                }}
                              ></ListItemIcon>
                              <CircleOutlinedIcon />

                              <ListItemText
                                primary="Transaction"
                                sx={{
                                  opacity: open ? 1 : 0,
                                  color: "black",
                                  position: "relative",
                                  left: "35px",
                                }}
                              />
                              {open ? (
                                cvtransection ? (
                                  <ExpandLessIcon />
                                ) : (
                                  <ExpandMoreIcon />
                                )
                              ) : null}
                            </ListItemButton>
                          </ListItem>

                          {cvtransection === true ? (
                            <List sx={{ pl: 4 }}>
                              <ListItem
                                disablePadding
                                sx={{ display: "block" }}
                                onClick={() => {
                                  navigate("/createCV");
                                }}
                              >
                                <ListItemButton
                                  sx={{
                                    minHeight: 48,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2.5,
                                    pl: 4,
                                  }}
                                >
                                  <ListItemIcon
                                    sx={{
                                      minWidth: 0,
                                      mr: open ? 2 : "auto",
                                      justifyContent: "center",
                                      color: "black",
                                    }}
                                  >
                                    <CircleOutlinedIcon />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary="Create CV"
                                    sx={{
                                      opacity: open ? 1 : 0,
                                      color: "black",
                                    }}
                                  />
                                </ListItemButton>
                              </ListItem>

                              <ListItem
                                disablePadding
                                sx={{ display: "block" }}
                                onClick={() => {
                                  navigate("/generatedCV");
                                }}
                              >
                                <ListItemButton
                                  sx={{
                                    minHeight: 48,
                                    justifyContent: open ? "initial" : "center",
                                    px: 2.5,
                                    pl: 4,
                                  }}
                                >
                                  <ListItemIcon
                                    sx={{
                                      minWidth: 0,
                                      mr: open ? 2 : "auto",
                                      justifyContent: "center",
                                      color: "black",
                                    }}
                                  >
                                    <CircleOutlinedIcon />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary="Generated CV"
                                    sx={{
                                      opacity: open ? 1 : 0,
                                      color: "black",
                                    }}
                                  />
                                </ListItemButton>
                              </ListItem>
                            </List>
                          ) : null}
                        </>
                      )}
                    </List>
                  </Collapse>
                )}
                {/* CV Generation Module End */}
              </div>
            ))}
          </div>
        </List>
      </Drawer>
    </Box>
  );
}
