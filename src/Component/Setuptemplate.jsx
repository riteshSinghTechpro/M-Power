import React, { useState, useEffect } from "react";
import {
  Card,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
  Grid,
  Select,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedClientName,
  setSelectedTemplateName,
  setSelectedpdfData,
  setSelectedBasicInformation,
  setSelectedEducationDetails,
} from "../feature/apiDataSlice";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CvPdfList from "./CvPdfList";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
function Setuptemplate() {
  const navigate = useNavigate();
  const [ClientNames, setClientNames] = useState([]);
  const [TemplateNames, setTemplateNames] = useState([]);
  const dispatch = useDispatch();
  const selectedClient = useSelector(
    (state) => state.apiData.selectedClientName
  );
  const selectedTemplate = useSelector(
    (state) => state.apiData.selectedTemplateName
  );
  const selectedData = useSelector((state) => state.apiData.selectedpdfData);
  
  const baseURL = "https://staffcentral.azurewebsites.net/api";
  const selectedEmployees = useSelector(
    (state) => state.apiData.selectedEmployees
  );

  // Fetch client names when component loads
  useEffect(() => {
    axios
      .get(`${baseURL}/CreateEmployeeCV/GetAllClient`)
      .then((response) => {
        setClientNames(response.data);
      })
      .catch((error) => {
        console.error("Error fetching client names!", error);
      });
  }, []);

  // Fetch template names when component loads
  useEffect(() => {
    axios
      .get(`${baseURL}/CreateEmployeeCV/GetAllTemplate`)
      .then((response) => {
        setTemplateNames(response.data);
      })
      .catch((error) => {
        console.error("Error fetching template names!", error);
      });
  }, []);

  const handleClientChange = (event) => {
    const selectedClient = event.target.value;
    dispatch(setSelectedClientName(selectedClient));
  };

  const handleTemplateChange = (event) => {
    const selectedTemplate = event.target.value;
    
    dispatch(setSelectedTemplateName(selectedTemplate));
  };

  // Function to handle the "View as PDF" button click
  const handleViewAsPDF = () => {
    navigate("/CvPdfList");
    // setOpen(true);
    if (!selectedTemplate) {
      alert("Please select a template first!");
      return;
    }

    const templateId = TemplateNames.find(
      (template) => template.templateName === selectedTemplate
    )?.templateId;

    if (templateId) {
      axios
        .get(`${baseURL}/Teamplate/GetTemplateById?TemplateId=${templateId}`)
        .then((response) => {
          dispatch(setSelectedpdfData(response.data));
        })
        .catch((error) => {
          console.error("Error fetching template PDF data!", error);
        });
    }
  };

  const [data, setData] = useState([]);
  const refreshList = () => {
    const empCodes = selectedEmployees.join(",");
    axios
      .get(`${baseURL}/CreateEmployeeCV/GetEmployeeCVBasicInfoByEmpCodes`, {
        params: { empCodes: empCodes },
      })
      .then((response) => {
        setData(response.data);
        dispatch(setSelectedBasicInformation(response.data));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    refreshList();
  }, []);

  const refreshLists = () => {
    const empCodes = selectedEmployees.join(",");
    axios
      .get(`${baseURL}/CreateEmployeeCV/GetEmployeeCVDetails?empCodes`, {
        params: { empCodes: empCodes },
      })
      .then((response) => {
        dispatch(setSelectedEducationDetails(response.data));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    refreshLists();
  }, []);

  const basicAllInfo = useSelector(
    (state) => state.apiData.selectedEducationDetails
  );
  const objectiveData = useSelector(
    (state) => state.apiData.selectedObjectiveDetails
  );
  const projectDetailsData = useSelector(
    (state) => state.apiData.selectedProjectDetails
  );
  const expDetailsData = useSelector(
    (state) => state.apiData.selectedExperienceDetails
  );
  const selectedSkill = useSelector((state) => state.apiData.selectedSkills);
  const selectedTechnology = useSelector(
    (state) => state.apiData.selectedTechnologies
  );

  

  const selectedTools = useSelector((state) => state.apiData.selectedTools);

  const arrayTools = [];
  arrayTools.push(...selectedTools); // Spread the elements of selectedTools into 'a'
  
  
  const handleSave = () => {
    const payload = {
      employeeCVRecords: basicAllInfo.employeeCVBasicInformation.map((info) => {
        const employeeObjective =
          objectiveData.find((obj) => obj.employeeCode === info.employeeCode) ||
          {};

        const employeeEducationDetails =
          basicAllInfo.employeeEducationCVBasicInformation.filter(
            (edu) => edu.employeeCode === info.employeeCode
          );
        const employeeCertificationDetails =
          basicAllInfo.employeeCVCertificationDetails.filter(
            (cert) => cert.employeeCode === info.employeeCode
          );
        const employeeAchievementDetails =
          basicAllInfo.employeeCVAchievementDetails.filter(
            (ach) => ach.employeeCode === info.employeeCode
          );
        const employeeProjectDetails = projectDetailsData.filter(
          (project) => project.empCode === info.employeeCode
        );

        const employeeExperienceDetails = expDetailsData.filter(
          (exp) => exp.empCode === info.employeeCode
        );

        const employeeSkills =
          selectedSkill.find((skill) => skill.empCode === info.employeeCode)
            ?.skills || [];

        const employeeTechnology =
          selectedTechnology.find((tech) => tech.empCode === info.employeeCode)
            ?.technologies || [];

        const employeeTools = Array.isArray(arrayTools)
          ? arrayTools.filter((tool) => tool.empCode === info.employeeCode)
          : [];

        return {
          cvEmpCode: info.employeeCode,
          createCVEmployeeLists: [
            {
              cvEmpCode: info.employeeCode,
              employeeName: info.employeeName,
              employeeEmailID: info.employeeEmail,
              mobileNumber: info.employeeMobileNo,
            },
          ],
          createEmployeeCVBasicInfos: [
            {
              cvEmpCode: info.employeeCode,
              employeeName: info.employeeName,
              email: info.employeeEmail,
              mobileNo: info.employeeMobileNo,
              linkedin: info.linkedInId,
              designationId: 0,
              designation: info.designation,
              emplanguage: info.emplanguage || "Hindi",
              profileImageData: info.profileImageData || "string",
            },
          ],
          createCVEmployeeObjectiveDetails: [
            {
              cvEmpCode: employeeObjective.employeeCode || info.employeeCode,
              objectiveId: 0,
              objectiveName:
                employeeObjective.employeeObjective || "Default Objective",
              objectiveDescriptin:
                employeeObjective.objectiveDescription || "Default description",
            },
          ],
          createCVEmployeeEducationDetails: employeeEducationDetails.map(
            (edu) => ({
              cvEmpCode: edu.employeeCode,
              educationId: 0,
              instituteName: edu.instituteName,
              educationBoardId: 0,
              boardName: edu.boardUniversity,
              courseId: 0,
              courseName: edu.courseName,
              educationPercentage: edu.percentageCGPA,
              educationYearOfPassing: edu.passingYear || "Unknown",
            })
          ),
          createCVEmployeeExtraCertificateDetails:
            employeeCertificationDetails.map((cert) => ({
              cvEmpCode: cert.employeeCode,
              extraCertificateId: 0,
              extraCertificateTitle: cert.certificationName,
              issuingOrganization: cert.issuingOrganization,
              extraCertificateDescription: cert.description || "No description",
              issuedDate: new Date(cert.issuedDate).toISOString(),
              expirationDate: new Date(cert.expirationDate).toISOString(),
            })),
          createCVEmployeeAchievementDetails: employeeAchievementDetails.map(
            (ach) => ({
              cvEmpCode: ach.employeeCode,
              achievementsId: 0,
              achievementTitle: ach.achievementTitle,
              achievementDescription:
                ach.achievementDescription || "No description",
            })
          ),
          createCVEmployeeProjectDeatails: employeeProjectDetails.map(
            (project) => ({
              cvEmpCode: project.empCode,
              projectId: 0,
              projectName: project.projectName,
              projectRoleId: project.projectRoleID || 0,
              fromDate: new Date(project.fromDate).toISOString(),
              toDate: new Date(project.toDate).toISOString(),
              descriptions: project.projectDescription || "No description",
              projectRoleName: project.projectRole,
            })
          ),
          createCVEmployeeExpriencesDeatails: employeeExperienceDetails.map(
            (exp) => ({
              cvEmpCode: exp.empCode,
              companyName: exp.companyName,
              companyRoleName: exp.companyRole,
              fromDate: new Date(exp.fromDate).toISOString(),
              toDate: new Date(exp.toDate).toISOString(),
              experienceSummary:exp.companyDes,
              companyRoleId:0,
            })
          ),

          createCVEmployeeSkillDetails: employeeSkills.map((skill) => ({
            cvEmpCode: info.employeeCode,
            skillId: skill,
            skillName: "string",
          })),

          createCVEmployeeTechnologyDetails: employeeTechnology.map((tech) => ({
            cvEmpCode: info.employeeCode,
            technologyId: tech,
            technologyName: "string",
          })),

          createCVEmployeeSkillTechToolDetails: employeeTools.map((tool) => ({
            cvEmpCode: tool.empCode,
            tool: tool.tool,
          })),

          createCVEmployeeTemplateDetails: [
            {
              cvEmpCode: info.employeeCode,
              clientId: 0,
              clientName: selectedClient,
              templateId: selectedTemplate,
              templateName: "string",
            },
          ],
        };
      }),
    };

    saveCVEmployeeMultiple(payload);
  };

  const saveCVEmployeeMultiple = async (payload) => {
    
    try {
      const response = await fetch(
        "https://staffcentral.azurewebsites.net/api/CreateEmployeeCV/SaveCVEmployeeMultiple",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (response.ok) {
      
        toast.success('Record Saved Successfully', { position: 'top-center', closeButton: false,autoClose: 2000 });
        navigate('/generatedCV')
        
        // Handle success (e.g., show notification, refresh data, etc.)
      } else {
        console.error("API error:", data);
        // Handle error (e.g., show error message)
        toast.error(response.data, { position: 'top-center', closeButton: false,autoClose: 2000 });
      }
    } catch (error) {
      console.error("Request failed:", error);
     
      // Handle network or other errors
    }
  };
  
  
  return (
    <Card className="border-0">
      <form className="tondform-css form-validation-p">
        <Grid container>
          <Grid item xs={5} sx={{ mt: 2, mb: 0, pl: 0, pr: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="client-name-label">Choose Client Name</InputLabel>
              <Select
                labelId="client-name-label"
                id="client-name-select"
                value={selectedClient}
                label="Choose Client Name"
                onChange={handleClientChange}
              >
                {ClientNames.map((item) => (
                  <MenuItem key={item.clientId} value={item.clientName}>
                    {item.clientName.trim()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={5} sx={{ mt: 2, mb: 0, pl: 0, pr: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="template-name-label">
                Choose Template Name
              </InputLabel>
              <Select
                labelId="template-name-label"
                id="template-name-select"
                value={selectedTemplate}
                label="Choose Template Name"
                onChange={handleTemplateChange}
              >
                {TemplateNames.map((template) => (
                  <MenuItem
                    key={template.templateId}
                    value={template.templateId}
                  >
                    {template.templateName.trim()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={2} sx={{ mt: 2, mb: 0, pl: 0, pr: 0 }}>
          <Button  style={{ backgroundColor: 'green', color: 'white',marginRight:'10px' }} onClick={handleSave}>Save</Button>
            <Button
              className=" primary"
              
              variant="contained"
              onClick={handleViewAsPDF}
            >
              PreView
            </Button>
            
          </Grid>
        </Grid>
      </form>
      <ToastContainer />
    </Card>
  );
}

export default Setuptemplate;
