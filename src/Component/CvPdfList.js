import React, { useEffect, useRef, useState } from "react";
import Grid from "@mui/material/Grid";
import { useSelector, useDispatch } from "react-redux";
import SideBar from "./SideBar";
import { Box, Typography, Button } from "@mui/material";
import moment from "moment";
import html2pdf from "html2pdf.js";
import axios from "axios";

import {
  setSelectedEducationDetails,
  setTemplateData,
} from "../feature/apiDataSlice";
import Loader from "../Component/Loader";
import { FaPhoneAlt, FaLinkedin } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { MdOutlineWork, MdDownload } from "react-icons/md";
import { AiFillProject } from "react-icons/ai";
import { IoArrowBackOutline } from "react-icons/io5";
import CreateCV from "../Page/CreateCV";
import { useNavigate } from "react-router-dom";
function CvPdfList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedEmployees = useSelector(
    (state) => state.apiData.selectedEmployees
  );
  const clientName = useSelector((state) => state.apiData.selectedClientName);
  const templateName = useSelector(
    (state) => state.apiData.selectedTemplateName
  );

 

  const basicInfoData = useSelector(
    (state) => state.apiData.selectedBasicInformation
  );
  const objectiveData = useSelector(
    (state) => state.apiData.selectedObjectiveDetails
  );
  const expDetailsData = useSelector(
    (state) => state.apiData.selectedExperienceDetails
  );
  const projectDetailsData = useSelector(
    (state) => state.apiData.selectedProjectDetails
  );

  const selectedAllSkill = useSelector((state) => state.apiData.allSkill) || [];
  const selectedSkill = useSelector((state) => state.apiData.selectedSkills);
  const selectedAllTech =
    useSelector((state) => state.apiData.allTechnology) || [];
  const selectedTechnology = useSelector(
    (state) => state.apiData.selectedTechnologies
  );
  const selectedTools = useSelector((state) => state.apiData.selectedTools);
  const selectedEducationDetails = useSelector(
    (state) => state.apiData.selectedEducationDetails
  );
  const templateId = useSelector((state) => state.apiData.selectedTemplateName);
  

  const [currentEmployeeIndex, setCurrentEmployeeIndex] = useState(0);

  const baseURL = "https://staffcentral.azurewebsites.net/api";
  const employeeRefs = useRef([]);

  // const downloadPdf = (employeeCode, index) => {
  //   const element = employeeRefs.current[index];
  //   const downloadButton = document.getElementById(`download-btn-${index}`);
  //   if (downloadButton) {
  //     downloadButton.style.display = "none";
  //   }

  //   const options = {
  //     filename: `${employeeCode}_cv.pdf`,
  //     image: { type: "jpeg", quality: 0.98 },
  //     html2canvas: {
  //       scale: 3,
  //       width: element.scrollWidth,
  //       scrollX: 0,
  //       scrollY: 0,
  //       useCORS: true,
  //     },
  //     jsPDF: {
  //       unit: "pt",
  //       format: "a4",
  //       orientation: "portrait",
  //     },
  //     margin: [3, 3, 3 ,3],
  //   };

  //   html2pdf()
  //     .set(options)
  //     .from(element)
  //     .save()
  //     .then(() => {
  //       if (downloadButton) {
  //         downloadButton.style.display = "block";
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("PDF generation failed: ", error);
  //       if (downloadButton) {
  //         downloadButton.style.display = "block";
  //       }
  //     });
  // };
  const downloadPdf = (employeeCode, index) => {
    const element = employeeRefs.current[index];
    const downloadButton = document.getElementById(`download-btn-${index}`);

    if (downloadButton) {
      downloadButton.style.display = "none";
    }

    // Calculate the element's height and width
    const elementWidth = element.scrollWidth;
    const elementHeight = element.scrollHeight;

    // A4 size width in points (pt) is 595.28 pt; adjust scale if needed
    const pdfWidth = 595.28; // Standard A4 page width in pt
    const pdfHeight = (elementHeight * pdfWidth) / elementWidth; // Dynamically calculate height based on content

    const options = {
      filename: `${employeeCode}_cv.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 3,
        useCORS: true,
      },
      jsPDF: {
        unit: "pt",
        format: [pdfWidth, pdfHeight], // Set custom width and dynamic height
        orientation: "portrait",
      },
      margin: [3, 3, 3, 3], // Set the margin
      pagebreak: { mode: "avoid-all" }, // Avoid breaking elements across pages
    };

    html2pdf()
      .set(options)
      .from(element)
      .save()
      .then(() => {
        if (downloadButton) {
          downloadButton.style.display = "block";
        }
      })
      .catch((error) => {
        console.error("PDF generation failed: ", error);
        if (downloadButton) {
          downloadButton.style.display = "block";
        }
      });
  };

  const refreshList = () => {
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
    refreshList();
  }, []);

  const skillMap = Array.isArray(selectedAllSkill)
    ? selectedAllSkill.reduce((acc, skill) => {
        acc[skill.skillId] = skill.name;
        return acc;
      }, {})
    : {}; // Fallback to an

  const techMap = Array.isArray(selectedAllTech)
    ? selectedAllTech.reduce((acc, tech) => {
        acc[tech.technologyId] = tech.technologyName;
        return acc;
      }, {})
    : {};
  //const [templateData, setTemplateData] = useState(null);
  const templateData = useSelector((state) => state.apiData.templateData);
  const [loading, setLoading] = useState(true);
  const fetchTemplateData = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/Teamplate/GetTemplateById?TemplateId=${templateId}`
      );

      dispatch(setTemplateData(response.data));
      setLoading(false);
    } catch (error) {}
  };
  useEffect(() => {
    if (templateId) {
      fetchTemplateData();
    }
  }, [templateId]);
  const backFunIcon = () => {
    navigate('/createCV')
   
  }
  

  return (
    <>
      {templateData?.layoutName == "Basic" ? (
        <Box className="cv-generate-section">
          <SideBar />

          <Box component="main" className="cv-inner-section">
            {loading ? (
              <Loader />
            ) : (
              <Typography variant="h4">
                <Box className="cv-text">Curriculum Vitae</Box>
                <Grid container spacing={2}>
                  {selectedEducationDetails?.employeeCVBasicInformation
                    ?.length > 0
                    ? selectedEducationDetails.employeeCVBasicInformation.map(
                        (basicInfo, index) => (
                          <Grid
                            item
                            xs={12}
                            key={index}
                            className="page-break"
                            ref={(el) => (employeeRefs.current[index] = el)}
                          >
                            <Grid item xs={12}>
                              <Box className="profile-cv-section">
                                <Box className="circle-img-section">
                                  {basicInfo?.profileImageData && (
                                    <img
                                      src={basicInfo.profileImageData}
                                      alt={`${
                                        basicInfo?.employeeName || "Employee"
                                      }'s profile`}
                                      style={{
                                        width: "100px",
                                        height: "100px",
                                        borderRadius: "50%",
                                      }}
                                    />
                                  )}
                                </Box>
                                <Box className="pf-img-section">
                                  {templateData?.name &&
                                    basicInfo?.employeeName && (
                                      <Box className="pf-img-name">
                                        {basicInfo.employeeName}
                                      </Box>
                                    )}
                                  <Box className="pf-text-sec">
                                    {templateData?.email &&
                                      basicInfo?.employeeEmail && (
                                        <Box className="cv-text-heading">
                                          {basicInfo.employeeEmail} |
                                        </Box>
                                      )}
                                    {templateData?.mobileNo &&
                                      basicInfo?.employeeMobileNo && (
                                        <Box className="cv-text-heading">
                                          {basicInfo.employeeMobileNo} |
                                        </Box>
                                      )}
                                    {templateData?.linkedInId &&
                                      basicInfo?.linkedInId && (
                                        <Box className="cv-text-heading">
                                          {basicInfo.linkedInId}
                                        </Box>
                                      )}
                                  </Box>
                                </Box>
                              </Box>
                            </Grid>

                            <Box className="profile-cv-section">
                              {templateData?.objectiveName &&
                                objectiveData
                                  ?.filter(
                                    (obj) =>
                                      obj.employeeCode ===
                                      basicInfo?.employeeCode
                                  )
                                  ?.map((obj, objIndex) => (
                                    <Box
                                      className="objective-section"
                                      key={objIndex}
                                    >
                                      <Box className="cv-title-text exp-title-cv-text">
                                        Objective Description
                                      </Box>
                                      {templateData?.description && (
                                        <Box className="cv-text-heading">
                                          <Box
                                            className="emp-cv-details"
                                            dangerouslySetInnerHTML={{
                                              __html: obj.objectiveDescription,
                                            }}
                                          />
                                        </Box>
                                      )}
                                    </Box>
                                  ))}
                            </Box>

                            <Box className="Exp-cv-section">
                              {expDetailsData
                                ?.filter(
                                  (exp) =>
                                    exp.empCode === basicInfo?.employeeCode
                                )
                                ?.map((exp, expIndex) => (
                                  <Box
                                    className="objective-section"
                                    key={expIndex}
                                    sx={{ mt: expIndex > 0 ? 2 : 0 }}
                                  >
                                    {expIndex === 0 && (
                                      <Box className="cv-title-text exp-title-cv-text">
                                        Experience
                                      </Box>
                                    )}
                                    <Box className="all-exp-data">
                                      <Box className="left-experience-column">
                                        {templateData?.companyName && (
                                          <Box className="cv-text-heading">
                                            Company Name:{" "}
                                            <span className="emp-cv-details">
                                              {exp.companyName}
                                            </span>
                                          </Box>
                                        )}
                                        {templateData?.role && (
                                          <Box className="cv-text-heading">
                                            Company Role:{" "}
                                            <span className="emp-cv-details">
                                              {exp.companyRole}
                                            </span>
                                          </Box>
                                        )}
                                      </Box>
                                      <Box className="right-experience-column">
                                        {templateData?.fromDate && (
                                          <Box className="cv-text-heading">
                                            From Date:{" "}
                                            <span className="emp-cv-details">
                                              {moment(exp.fromDate).format(
                                                "D MMMM YYYY"
                                              )}
                                            </span>
                                          </Box>
                                        )}
                                        {templateData?.toDate && (
                                          <Box className="cv-text-heading">
                                            To Date:{" "}
                                            <span className="emp-cv-details">
                                              {moment(exp.toDate).format(
                                                "D MMMM YYYY"
                                              )}
                                            </span>
                                          </Box>
                                        )}
                                      </Box>
                                    </Box>
                                  </Box>
                                ))}
                            </Box>

                            <Box className="Exp-cv-section">
                              {selectedEducationDetails?.employeeEducationCVBasicInformation
                                ?.filter(
                                  (exp) =>
                                    exp.employeeCode === basicInfo.employeeCode
                                )
                                ?.map((exp, expIndex) => (
                                  <Box
                                    className="objective-section"
                                    key={expIndex}
                                    sx={{ mt: expIndex > 0 ? 2 : 0 }}
                                  >
                                    {expIndex === 0 && (
                                      <Box className="cv-title-text exp-title-cv-text">
                                        Education
                                      </Box>
                                    )}
                                    <Box className="all-exp-data">
                                      <Box className="left-experience-column">
                                        {templateData?.instituteName && (
                                          <Box className="cv-text-heading">
                                            Institute Name:{" "}
                                            <span className="emp-cv-details">
                                              {exp.instituteName}
                                            </span>
                                          </Box>
                                        )}
                                        {templateData?.boardUniversity && (
                                          <Box className="cv-text-heading">
                                            Board/University:{" "}
                                            <span className="emp-cv-details">
                                              {exp.boardUniversity}
                                            </span>
                                          </Box>
                                        )}
                                        {templateData?.passingYear && (
                                          <Box className="cv-text-heading">
                                            Passing Year:{" "}
                                            <span className="emp-cv-details">
                                              {moment(exp.passingYear).format(
                                                "D MMMM YYYY"
                                              )}
                                            </span>
                                          </Box>
                                        )}
                                      </Box>
                                      <Box className="right-experience-column">
                                        {templateData?.courseName && (
                                          <Box className="cv-text-heading">
                                            Course Name:{" "}
                                            <span className="emp-cv-details">
                                              {exp.courseName}
                                            </span>
                                          </Box>
                                        )}
                                        {templateData?.percentageCGPA && (
                                          <Box className="cv-text-heading">
                                            <span className="emp-cv-details">
                                              Percentage/CGPA:{" "}
                                              {exp.percentageCGPA} %
                                            </span>
                                          </Box>
                                        )}
                                      </Box>
                                    </Box>
                                  </Box>
                                ))}
                            </Box>

                            <Box className="Exp-cv-section">
                              {projectDetailsData
                                ?.filter(
                                  (exp) =>
                                    exp.empCode === basicInfo.employeeCode
                                )
                                ?.map((exp, expIndex) => (
                                  <Box
                                    className="objective-section"
                                    key={expIndex}
                                    sx={{ mt: expIndex > 0 ? 2 : 0 }}
                                  >
                                    {expIndex === 0 && (
                                      <Box className="cv-title-text exp-title-cv-text">
                                        Projects
                                      </Box>
                                    )}
                                    <Box className="all-exp-data">
                                      <Box className="left-experience-column">
                                        {templateData?.projectName && (
                                          <Box className="cv-text-heading">
                                            Project Name:{" "}
                                            <span className="emp-cv-details">
                                              {exp.projectName}
                                            </span>
                                          </Box>
                                        )}
                                      </Box>
                                      <Box className="right-experience-column">
                                        {templateData?.projectSummary && (
                                          <Box className="cv-text-heading">
                                            Project Summary:{" "}
                                            <span className="emp-cv-details">
                                              {exp.projectDescription}
                                            </span>
                                          </Box>
                                        )}
                                      </Box>
                                    </Box>
                                  </Box>
                                ))}
                            </Box>

                            <Box className="Exp-cv-section">
                              {selectedEducationDetails.employeeCVCertificationDetails
                                ?.filter(
                                  (exp) =>
                                    exp.employeeCode === basicInfo.employeeCode
                                )
                                ?.map((exp, expIndex) => (
                                  <Box
                                    className="objective-section"
                                    key={expIndex}
                                    sx={{ mt: expIndex > 0 ? 2 : 0 }}
                                  >
                                    {expIndex === 0 && (
                                      <Box className="cv-title-text exp-title-cv-text">
                                        Certification
                                      </Box>
                                    )}
                                    <Box className="all-exp-data">
                                      <Box className="left-experience-column">
                                        {templateData?.certificationName && (
                                          <Box className="cv-text-heading">
                                            Certification Name:
                                            <span className="emp-cv-details">
                                              {exp.certificationName}
                                            </span>
                                          </Box>
                                        )}
                                        {templateData?.issuedDate && (
                                          <Box className="cv-text-heading">
                                            Issued Date:
                                            <span className="emp-cv-details">
                                              {moment(exp.issuedDate).format(
                                                "D MMMM YYYY"
                                              )}
                                            </span>
                                          </Box>
                                        )}
                                        {templateData?.descriptionDetails && (
                                          <Box className="cv-text-heading">
                                            Description or Details:
                                            <span className="emp-cv-details">
                                              {exp.description}
                                            </span>
                                          </Box>
                                        )}
                                      </Box>
                                      <Box className="right-experience-column">
                                        {templateData?.issuingOrganization && (
                                          <Box className="cv-text-heading">
                                            Issuing Organization:{" "}
                                            <span className="emp-cv-details">
                                              {exp.issuingOrganization}
                                            </span>
                                          </Box>
                                        )}
                                        {templateData?.expirationDate && (
                                          <Box className="cv-text-heading">
                                            Expiration Date:{" "}
                                            <span className="emp-cv-details">
                                              {moment(
                                                exp.expirationDate
                                              ).format("D MMMM YYYY")}
                                            </span>
                                          </Box>
                                        )}
                                      </Box>
                                    </Box>
                                  </Box>
                                ))}
                            </Box>

                            <Box className="profile-cv-section">
                              {selectedSkill
                                ?.filter(
                                  (skill) =>
                                    skill.empCode === basicInfo.employeeCode
                                )
                                ?.map((skillData, skillIndex) => (
                                  <Box
                                    className="objective-section"
                                    key={skillIndex}
                                    sx={{ mt: skillData > 0 ? 2 : 0 }}
                                  >
                                    {templateData?.skills && (
                                      <Box className="cv-text-heading">
                                        Skills:{" "}
                                        <span className="emp-cv-details">
                                          {skillData.skills
                                            .map((skillId) => skillMap[skillId])
                                            .join(", ")}
                                        </span>
                                      </Box>
                                    )}
                                  </Box>
                                ))}
                            </Box>
                            <Box className="profile-cv-section">
                              {selectedTechnology
                                ?.filter(
                                  (tech) =>
                                    tech.empCode === basicInfo.employeeCode
                                )
                                ?.map((techData, techIndex) => (
                                  <Box
                                    className="objective-section"
                                    key={techIndex}
                                  >
                                    <Box className="cv-text-heading">
                                      Technologies:{" "}
                                      <span className="emp-cv-details">
                                        {techData.technologies
                                          .map((techId) => techMap[techId])
                                          .join(", ")}
                                      </span>
                                    </Box>
                                  </Box>
                                ))}
                            </Box>
                            <Box className="profile-cv-section">
                              {selectedTools
                                ?.filter(
                                  (tool) =>
                                    tool.empCode === basicInfo.employeeCode
                                )
                                ?.map((toolData, toolIndex) => (
                                  <Box
                                    className="objective-section"
                                    key={toolIndex}
                                  >
                                    <Box className="cv-text-heading">
                                      Tools:{" "}
                                      <span className="emp-cv-details">
                                        {toolData.tool}
                                      </span>
                                    </Box>
                                  </Box>
                                ))}
                            </Box>

                            <Box className="download-cv-section-adv">
                              <MdDownload
                                className="adv-download-btn"
                                id={`download-btn-${index}`}
                                variant="contained"
                                color="primary"
                                onClick={() =>
                                  downloadPdf(basicInfo.empcode, index)
                                }
                              />
                            </Box>
                          </Grid>
                        )
                      )
                    : "No Data are present"}
                </Grid>
              </Typography>
            )}
          </Box>
        </Box>
      ) : (
        <>
        <Box className= "icon-prev-cv-sec">
        <IoArrowBackOutline className= "icon-prev-cv" onClick={backFunIcon}/>
         </Box>
        <Box className="cv-generate-section">
          <SideBar />
         
          <Box component="main" id="adv-content-all">
            {loading ? (
              <Loader />
            ) : (
              <Box className="advance-cv-inner-section">
                {selectedEducationDetails?.employeeCVBasicInformation?.length >
                0
                  ? selectedEducationDetails.employeeCVBasicInformation.map(
                      (basicInfo, index) => (
                        <Box
                          className="content-all-cv-adv"
                          ref={(el) => (employeeRefs.current[index] = el)}
                        >
                          <Box className="left-cv-profile" id="left-cv-profile">
                            <Box className="adv-circle-img-section">
                              {basicInfo?.profileImageData && (
                                <img
                                  src={basicInfo.profileImageData}
                                  alt={`${
                                    basicInfo?.employeeName || "Employee"
                                  }'s profile`}
                                  className="adv-pf-img"
                                />
                              )}
                            </Box>
                            <Box className="adv-contact-section">
                              <Box className="adv-text-heading">
                                Contact<Box className="adv-line-text"></Box>
                              </Box>
                              <Box className="adv-pf-text-sec">
                                {templateData?.mobileNo &&
                                  basicInfo?.employeeMobileNo && (
                                    <Box className="adv-pf-img-name">
                                      <span className="adv-pf-icon">
                                        <FaPhoneAlt />
                                      </span>
                                      {basicInfo.employeeMobileNo}
                                    </Box>
                                  )}
                                {templateData?.email &&
                                  basicInfo?.employeeEmail && (
                                    <Box className="adv-pf-img-name adv-inner-img">
                                      <span className="adv-pf-icon">
                                        <IoMdMail />
                                      </span>
                                      {basicInfo.employeeEmail}
                                    </Box>
                                  )}
                                {templateData?.linkedInId &&
                                  basicInfo?.linkedInId && (
                                    <Box className="adv-pf-img-name adv-inner-img">
                                      <span className="adv-pf-icon">
                                        <FaLinkedin />
                                      </span>
                                      {basicInfo.linkedInId}
                                    </Box>
                                  )}
                              </Box>
                              {/* Education Details */}
                              <Box>
                                {selectedEducationDetails?.employeeEducationCVBasicInformation
                                  ?.filter(
                                    (exp) =>
                                      exp.employeeCode ===
                                      basicInfo.employeeCode
                                  )
                                  ?.map((exp, expIndex) => (
                                    <Box
                                      key={expIndex}
                                      sx={{ mt: expIndex > 0 ? 2 : 0 }}
                                    >
                                      {expIndex === 0 && (
                                        <Box className="adv-educ-text-heading">
                                          Education
                                          <Box className="adv-line-text"></Box>
                                        </Box>
                                      )}
                                      <Box className="adv-pf-text-sec">
                                        {templateData?.passingYear && (
                                          <Box className="adv-pf-img-name adv-educ-text-year">
                                            {moment(exp.passingYear).format(
                                              " MMMM YYYY"
                                            )}
                                          </Box>
                                        )}
                                        {templateData?.boardUniversity && (
                                          <Box className="adv-pf-img-name">
                                            {exp.boardUniversity}
                                          </Box>
                                        )}
                                        {templateData?.instituteName && (
                                          <Box className="adv-pf-img-name adv-institute-text">
                                            <Box className="adv-bullet-text"></Box>
                                            {exp.instituteName}
                                          </Box>
                                        )}
                                        {templateData?.percentageCGPA && (
                                          <Box className="adv-pf-img-name adv-institute-text">
                                            <Box className="adv-bullet-text"></Box>
                                            {exp.percentageCGPA}%
                                          </Box>
                                        )}
                                      </Box>
                                    </Box>
                                  ))}
                              </Box>

                              {/* skills  */}
                              <Box>
                                {selectedSkill
                                  ?.filter(
                                    (skill) =>
                                      skill.empCode === basicInfo.employeeCode
                                  )
                                  ?.map((skillData, skillIndex) => (
                                    <Box
                                      className="objective-section"
                                      key={skillIndex}
                                      sx={{ mt: skillData > 0 ? 2 : 0 }}
                                    >
                                      <Box className="adv-educ-text-heading">
                                        Skills
                                        <Box className="adv-line-text"></Box>
                                      </Box>

                                      {templateData?.skills && (
                                        <Box className="adv-skills-text">
                                          {skillData.skills.map(
                                            (skillId, index) => (
                                              <Box
                                                key={index}
                                                className="adv-skills-text-section"
                                              >
                                                <Box className="adv-bullet-text"></Box>
                                                {skillMap[skillId]}
                                              </Box>
                                            )
                                          )}
                                        </Box>
                                      )}
                                    </Box>
                                  ))}
                              </Box>

                              {/* Technology */}
                              <Box>
                                {selectedTechnology
                                  ?.filter(
                                    (tech) =>
                                      tech.empCode === basicInfo.employeeCode
                                  )
                                  ?.map((techData, techIndex) => (
                                    <Box
                                      className="objective-section"
                                      key={techIndex}
                                      sx={{ mt: techData > 0 ? 2 : 0 }}
                                    >
                                      <Box className="adv-educ-text-heading">
                                        Technologies
                                        <Box className="adv-line-text"></Box>
                                      </Box>

                                      {templateData?.skills && (
                                        <Box className="adv-skills-text">
                                          {techData.technologies.map(
                                            (techIndex, index) => (
                                              <Box
                                                key={index}
                                                className="adv-skills-text-section"
                                              >
                                                <Box className="adv-bullet-text"></Box>
                                                {techMap[techIndex]}
                                              </Box>
                                            )
                                          )}
                                        </Box>
                                      )}
                                    </Box>
                                  ))}
                              </Box>

                              {/* Tools */}
                              <Box>
                                {selectedTools
                                  ?.filter(
                                    (tool) =>
                                      tool.empCode === basicInfo.employeeCode
                                  )
                                  ?.map((toolData, toolIndex) => (
                                    <Box key={toolIndex}>
                                      <Box className="adv-educ-text-heading">
                                        Tools
                                        <Box className="adv-line-text"></Box>
                                      </Box>

                                      <Box className="adv-pf-text-sec">
                                        <Box className="adv-pf-img-name adv-institute-text">
                                          <Box className="adv-bullet-text"></Box>
                                          {toolData.tool}
                                        </Box>
                                      </Box>
                                    </Box>
                                  ))}
                              </Box>
                            </Box>
                          </Box>

                          <Box className="adv-right-column-cv">
                            <Box className="adv-pf-text-sec-right">
                              {templateData?.name &&
                                basicInfo?.employeeName && (
                                  <Box className="adv-pf-name">
                                    {basicInfo.employeeName}
                                  </Box>
                                )}
                              {templateData?.designation &&
                                basicInfo?.designation && (
                                  <Box className="adv-pf-designation">
                                    {basicInfo.designation}
                                    <Box className="line-adv-text-cv"></Box>
                                  </Box>
                                )}
                            </Box>
                            {/* objective details */}
                            <Box>
                              {templateData?.objectiveName &&
                                objectiveData
                                  ?.filter(
                                    (obj) =>
                                      obj.employeeCode ===
                                      basicInfo?.employeeCode
                                  )
                                  ?.map((obj, objIndex) => (
                                    <Box
                                      key={objIndex}
                                      className="objective-details-section"
                                    >
                                      <Box className="adv-objective-text">
                                        Objective
                                      </Box>
                                      <Box className="adv-objective-line-text"></Box>
                                      {templateData?.description && (
                                        <div
                                          className="adv-text-description"
                                          dangerouslySetInnerHTML={{
                                            __html: obj.objectiveDescription,
                                          }}
                                        />
                                      )}
                                    </Box>
                                  ))}
                            </Box>

                            {/* Experience Details */}
                           
<Box>
                              {expDetailsData
                                ?.filter(
                                  (exp) =>
                                    exp.empCode === basicInfo?.employeeCode
                                )
                                ?.map((exp, expIndex, arr) => (
                                  <Box
                                    key={expIndex}
                                    className="exp-details-section"
                                  >
                                    {expIndex === 0 && (
                                      <Box className="adv-objective-text">
                                        <span>
                                          <MdOutlineWork />
                                        </span>{" "}
                                        Work Experience
                                      </Box>
                                    )}
                                    {expIndex === 0 && (
                                      <Box className="adv-objective-line-text"></Box>
                                    )}
                                    <Box className="adv-working-exp with-line">
                                      <Box className="date-cv-compname-section">
                                        <Box>
                                          {templateData?.companyName && (
                                            <Box className="adv-experience-text-comp">
                                              {exp.companyName}
                                            </Box>
                                          )}
                                          {templateData?.role && (
                                            <Box>
                                              {exp.companyRole
                                                .split(",")
                                                .map((role, index) => (
                                                  <div
                                                    key={index}
                                                    className="exp-role-adv-text"
                                                  >
                                                    {role.trim()}
                                                  </div>
                                                ))}
                                            </Box>
                                          )}
                                        </Box>
                                        <Box className="date-adv-text-section">
                                          {templateData?.fromDate && (
                                            <Box className="adv-experience-text">
                                              {moment(exp.fromDate).format(
                                                "MMM YYYY"
                                              )}{" "}
                                            </Box>
                                          )}

                                          {templateData?.toDate && (
                                            <Box className="adv-experience-text">
                                              <span className="adv-dash">
                                                -
                                              </span>
                                              {moment(exp.toDate).format(
                                                " MMM YYYY"
                                              )}
                                            </Box>
                                          )}
                                        </Box>
                                      </Box>
                                      {templateData?.role && (
                                        <Box className="adv-experience-text-comp padding-des-exp">
                                          <ul>
                                            {exp.companyDes
                                              ? exp.companyDes
                                                  .split(".")
                                                  .filter(
                                                    (des) => des.trim() !== ""
                                                  )
                                                  .map((des, index) => (
                                                    <li key={index}>
                                                      {des.trim()}
                                                    </li>
                                                  ))
                                              : null}
                                          </ul>
                                        </Box>
                                      )}

                                      {expIndex !== arr.length - 1 && (
                                        <Box className="circle"></Box>
                                      )}
                                    </Box>
                                  </Box>
                                ))}
                            </Box>
                            {/* Project  */}

                            <Box>
                              {projectDetailsData
                                ?.filter(
                                  (exp) =>
                                    exp.empCode === basicInfo?.employeeCode
                                )
                                ?.map((exp, expIndex, arr) => (
                                  <Box
                                    key={expIndex}
                                    className="exp-details-section"
                                  >
                                    {expIndex === 0 && (
                                      <Box className="adv-objective-text">
                                        <span>
                                          <MdOutlineWork />
                                        </span>{" "}
                                        Project
                                      </Box>
                                    )}
                                    {expIndex === 0 && (
                                      <Box className="adv-objective-line-text"></Box>
                                    )}
                                    <Box className="adv-working-exp with-line">
                                      <Box className="date-cv-compname-section">
                                        <Box>
                                          {templateData?.projectName && (
                                            <Box className="adv-experience-text-comp">
                                              {exp.projectName}
                                            </Box>
                                          )}
                                          {templateData?.role && (
                                            <Box>
                                              {exp.projectRole
                                                .split(",")
                                                .map((role, index) => (
                                                  <div
                                                    key={index}
                                                    className="exp-role-adv-text"
                                                  >
                                                    {role.trim()}
                                                  </div>
                                                ))}
                                            </Box>
                                          )}
                                        </Box>
                                        <Box className="date-adv-text-section">
                                          {templateData?.fromDate && (
                                            <Box className="adv-experience-text">
                                              {moment(exp.fromDate).format(
                                                " MMM YYYY"
                                              )}{" "}
                                            </Box>
                                          )}

                                          {templateData?.toDate && (
                                            <Box className="adv-experience-text">
                                              <span className="adv-dash">
                                                -
                                              </span>
                                              {moment(exp.toDate).format(
                                                " MMM YYYY"
                                              )}
                                            </Box>
                                          )}
                                        </Box>
                                      </Box>
                                      {templateData?.projectSummary && (
                                        <Box className="adv-experience-text-comp padding-des-exp">
                                          <ul>
                                            {exp.projectDescription

                                              ? exp.projectDescription

                                                  .split(".")
                                                  .filter(
                                                    (des) => des.trim() !== ""
                                                  )
                                                  .map((des, index) => (
                                                    <li key={index}>
                                                      {des.trim()}
                                                    </li>
                                                  ))
                                              : null}
                                          </ul>
                                        </Box>
                                      )}

                                      {expIndex !== arr.length - 1 && (
                                        <Box className="circle"></Box>
                                      )}
                                    </Box>
                                  </Box>
                                ))}
                            </Box>

                            {/* Certification */}
                            <Box>
                              {selectedEducationDetails.employeeCVCertificationDetails
                                ?.filter(
                                  (exp) =>
                                    exp.employeeCode === basicInfo.employeeCode
                                )
                                ?.map((exp, expIndex, arr) => (
                                  <Box
                                    key={expIndex}
                                    className="exp-details-section"
                                  >
                                    {expIndex === 0 && (
                                      <Box className="adv-objective-text">
                                        <span>
                                        <AiFillProject />
                                        </span>{" "}
                                        Certification
                                      </Box>
                                    )}
                                    {expIndex === 0 && (
                                      <Box className="adv-objective-line-text"></Box>
                                    )}
                                    <Box className="adv-working-exp with-line">
                                      <Box className="date-cv-compname-section">
                                        <Box>
                                          {templateData?.certificationName && (
                                            <Box className="adv-experience-text-comp">
                                              {exp.certificationName}
                                            </Box>
                                          )}
                                          {templateData?.issuingOrganization && (
                                          <Box >
                                            
                                              {exp.issuingOrganization
                                                .split(",")
                                                .map((role, index) => (
                                                  <div key={index} className="exp-role-adv-text">
                                                    {role.trim()}
                                                  </div>
                                                ))}
                                          </Box>
                                        )}
                                        </Box>
                                        <Box className="date-adv-text-section">
                                          {templateData?.fromDate && (
                                            <Box className="adv-experience-text">
                                              {moment(exp.issuedDate).format(
                                                " MMM YYYY"
                                              )}{" "}
                                            </Box>
                                          )}

                                          {templateData?.toDate && (
                                            <Box className="adv-experience-text">
                                              <span className="adv-dash">
                                                -
                                              </span>
                                              {moment(exp.expirationDate).format(
                                                " MMM YYYY"
                                              )}
                                            </Box>
                                          )}
                                        </Box>
                                      </Box>
                                      {templateData?.role && (
                                        <Box className="adv-experience-text-comp padding-des-exp">
                                          <ul>
                                            {exp.description

                                              ? exp.description

                                                  .split(".")
                                                  .filter(
                                                    (des) => des.trim() !== ""
                                                  )
                                                  .map((des, index) => (
                                                    <li key={index}>
                                                      {des.trim()}
                                                    </li>
                                                  ))
                                              : null}
                                          </ul>
                                        </Box>
                                      )}
                                      {expIndex !== arr.length - 1 && (
                                        <Box className="circle"></Box>
                                      )}
                                    </Box>
                                  </Box>
                                ))}
                            </Box> 
                           

                            <Box>
                              <MdDownload
                                className="adv-download-btn"
                                id={`download-btn-${index}`}
                                variant="contained"
                                color="primary"
                                onClick={() =>
                                  downloadPdf(basicInfo.empcode, index)
                                }
                              />
                            </Box>
                          </Box>
                        </Box>
                      )
                    )
                  : "No Data are present"}
              </Box>
            )}
          </Box>
        </Box>
        </>
      )}
    </>
  );
}

export default CvPdfList;
