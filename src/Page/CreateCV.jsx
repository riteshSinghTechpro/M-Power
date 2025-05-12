import React, { useEffect } from 'react';
import { Box, Grid, Card, Breadcrumbs, Link, Typography, Button } from '@mui/material';
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import CreatecvEmployeeTable from '../Component/CreatecvEmployeeTable';
import Objective from '../Component/Objective';
import Addskillsandexperience from '../Component/Addskillsandexperience';
import Setuptemplate from '../Component/Setuptemplate';
import ExperienceDetails from './ExperienceDetails';
import ProjectDetails from '../Component/ProjectDetails';
import { useSelector } from 'react-redux';
import SideBar from '../Component/SideBar';
function CreateCV() {
  const selectedEmployees = useSelector((state) => state.apiData.selectedEmployees);
  const selectedObjectiveDetails = useSelector((state) => state.apiData.selectedObjectiveDetails);
  const expDetailsData = useSelector((state) => state.apiData.selectedExperienceDetails);
  const projectDetailsData = useSelector((state) => state.apiData.selectedProjectDetails);
  const selectedSkill = useSelector((state) => state.apiData.selectedSkills);

  const [activeTab, setActiveTab] = React.useState('1');
  const [objData, setObjData] = React.useState(true);
  const [experienceTab, setExperienceTab] = React.useState(true);
  const [projectTab, setProjectTab] = React.useState(true);
  const [skillTab, setSkillTab] = React.useState(true);
  const [setupTab, setSetupTab] = React.useState(true);

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleNextTab = () => {
    let nextTab = (parseInt(activeTab) + 1).toString();
    setActiveTab(nextTab);
  };

  const handlePreviousTab = () => {
    let prevTab = (parseInt(activeTab) - 1).toString();
    setActiveTab(prevTab);
  };

  // Effect to handle Objective and Experience Tab
  useEffect(() => {
    setObjData(selectedEmployees.length === 0);
    setExperienceTab(selectedObjectiveDetails.length === 0);
  }, [selectedEmployees, selectedObjectiveDetails]);

  // Effect to handle Experience and Project Tabs
  useEffect(() => {
    if (Array.isArray(selectedEmployees) && Array.isArray(expDetailsData)) {
      const allMatched = selectedEmployees.every(emp =>
        expDetailsData.some(expDetail => expDetail.empCode === emp)
      );
      setProjectTab(!allMatched || experienceTab);
    }
  }, [selectedEmployees, expDetailsData, experienceTab]);

  // Effect to handle Skills and Template Tabs
  useEffect(() => {
    if (Array.isArray(selectedEmployees) && Array.isArray(projectDetailsData)) {
      const allMatched = selectedEmployees.every(emp =>
        projectDetailsData.some(expDetail => expDetail.empCode === emp)
      );
      setSkillTab(!allMatched || projectTab);
    }
  }, [selectedEmployees, projectDetailsData, projectTab]);

  useEffect(() => {
    if (Array.isArray(selectedEmployees) && Array.isArray(selectedSkill)) {
      const allMatched = selectedEmployees.every(emp =>
        selectedSkill.some(expDetail => expDetail.empCode === emp)
      );
      setSetupTab(!allMatched || skillTab);
    }
  }, [selectedEmployees, selectedSkill, skillTab]);

  // Get the disabled state of the next tab
  const getNextTabDisabled = () => {
    switch (activeTab) {
      case '1':
        return objData; // Objective tab disabled condition
      case '2':
        return experienceTab; // Experience tab disabled condition
      case '3':
        return projectTab; // Project tab disabled condition
      case '4':
        return skillTab; // Skill tab disabled condition
      case '5':
        return setupTab; // Setup tab disabled condition
      default:
        return false;
    }
  };

  const isLastTab = activeTab === '6';
  const isFirstTab = activeTab === '1';

  return (
    <Box sx={{ display: 'flex' }} className="main-container">
      <SideBar />
      <Box component="main" className="main-content" sx={{ flexGrow: 1 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Typography className='head-title' component="h1" variant="h6" align="left">
                Create CV
              </Typography>
            </Grid>
            <Grid item xs={4} textAlign={'right'}>
              <Breadcrumbs className='breadcrumbs-css' aria-label="breadcrumb" textAlign={'right'} sx={{ mt: 1 }}>
                <Link underline="hover" color="inherit" href="/">
                  CV Generation
                </Link>
                <Typography color="text.primary">Create CV</Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
        </Box>

        <Card sx={{ minWidth: 275, mt: 0, pb: 1 }}>
          <Box sx={{ width: '100%' }}>
            <TabContext value={activeTab}>
              <TabList onChange={handleChangeTab} aria-label="Tabs" className="tab-button border-cv ">
                <Tab label="Personal Details" value="1" />
                <Tab label="Objective" value="2" disabled={objData} />
                <Tab label="Experience Details" value="3" disabled={experienceTab} />
                <Tab label="Project Details" value="4" disabled={projectTab} />
                <Tab label="Skills & Technologies" value="5" disabled={skillTab} />
                <Tab label="Setup Template" value="6" disabled={setupTab} />
              </TabList>
              <TabPanel value="1"><CreatecvEmployeeTable /></TabPanel>
              <TabPanel value="2"><Objective /></TabPanel>
              <TabPanel value="3"><ExperienceDetails /></TabPanel>
              <TabPanel value="4"><ProjectDetails /></TabPanel>
              <TabPanel value="5"><Addskillsandexperience /></TabPanel>
              <TabPanel value="6"><Setuptemplate /></TabPanel>
            </TabContext>
          </Box>

          {/* Previous and Next buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
            <Button variant="contained" disabled={isFirstTab} onClick={handlePreviousTab}>
              Previous
            </Button>
            <Button
              variant="contained"
              disabled={isLastTab || getNextTabDisabled()} // Disable Next if next tab is disabled
              onClick={handleNextTab}
            >
              Next
            </Button>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}

export default CreateCV;
