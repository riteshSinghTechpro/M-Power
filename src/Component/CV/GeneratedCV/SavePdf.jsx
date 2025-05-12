import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import html2pdf from "html2pdf.js";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedEmpCVDataInfo,
  setTemplateData,
} from "../../../feature/apiDataSlice";
import SideBar from "../../SideBar";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Loader from "../../Loader";
import { FaPhoneAlt, FaLinkedin } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { MdOutlineWork, MdDownload } from "react-icons/md";
import { AiFillProject } from "react-icons/ai";
import { useLocation } from "react-router-dom";
import { setAllSkill, setAllTechnologies } from "../../../feature/apiDataSlice";
import { GiFastBackwardButton } from "react-icons/gi";
import { IoArrowBackOutline } from "react-icons/io5";
function SavePdf() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const baseURL = "https://staffcentral.azurewebsites.net/api";
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { cvEmpCodes, templateIds } = location.state || {};
  const selectedEmployees = useSelector(
    (state) => state.apiData.selectedEmployees
  );
  const selectedCVInfoData = useSelector(
    (state) => state.apiData.selectedEmpCVDataInfo
  );
  // const templateData = useSelector((state) => state.apiData.templateData);

  const selectedAllTech =
    useSelector((state) => state.apiData.allTechnology) || [];
  

  const refreshList = () => {
    //const empCodes = selectedEmployees.join(",");
    axios
      .get(`${baseURL}/GenerateCV/GeneratedEmployeeCVDetailsAsync?empCodes`, {
        params: { empCodes: cvEmpCodes },
      })
      .then((response) => {
        dispatch(setSelectedEmpCVDataInfo(response.data));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const cvempCode = useSelector((state) => state.apiData.cvEmployeeCode);
  
  useEffect(() => {
    refreshList();
  }, []);
  
  const [templateData, setTemplateData] = useState(null);
  const fetchTemplateData = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/Teamplate/GetTemplateById?TemplateId=${templateIds}`
      );
      //dispatch(setTemplateData(response.data));
      setTemplateData(response.data);

      setLoading(false);
    } catch (error) {}
  };
  useEffect(() => {
    if (templateIds) {
      fetchTemplateData();
    }
  }, [templateIds]);

  const [skillsOptions, setSkillsOptions] = useState([]);

  const fetchAllSill = async () => {
    try {
      const response = await axios.get(`${baseURL}/SkillMaster/GetAllSkill`);
      dispatch(setAllSkill(response.data));
    } catch (error) {}
  };
  useEffect(() => {
    fetchAllSill();
  }, []);

  const fetchAllTechnologies = async () => {
    try {
      const response = await axios.get(`${baseURL}/Technology/GetTechnologys`);
      dispatch(setAllTechnologies(response.data));
    } catch (error) {
      console.error("Error fetching all technologies:", error);
    }
  };
  useEffect(() => {
    fetchAllTechnologies();
  }, []);
  

  const selectedAllSkill = useSelector((state) => state.apiData.allSkill);
  const selectedTools = useSelector((state) => state.apiData.selectedTools);

  const employeeRefs = useRef([]);

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
      margin: [1, 1, 1, 1], // Set the margin
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

  const layoutName = templateData?.layoutName;
const backFunIcon = () => {
  navigate('/generatedCV') 
}

  return (
    <>
      {layoutName === "Advanced" ? (
        <>
        <Box className= "icon-prev-cv-sec">
        <IoArrowBackOutline className= "icon-prev-cv" onClick={backFunIcon}/>
         </Box>
        <Box className="cv-generate-section">
          <SideBar />
          <GiFastBackwardButton className="left-arrow-icon-adv-cv" />
          <Box component="main">
            {loading ? (
              <Loader />
            ) : (
              <Box component="main" className="advance-cv-inner-section ">
                {selectedCVInfoData?.employeeBasicGenerateCVInformation
                  ?.length > 0 &&
                selectedAllSkill.length > 0 &&
                selectedAllTech.length > 0
                  ? selectedCVInfoData.employeeBasicGenerateCVInformation.map(
                      (basicInfo, index) => (
                        <Box
                          className="content-all-cv-adv"
                          ref={(el) => (employeeRefs.current[index] = el)}
                        >
                          <Box key={index} className="left-cv-profile">
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
                                  basicInfo?.mobileNumber && (
                                    <Box className="adv-pf-img-name">
                                      <span className="adv-pf-icon">
                                        <FaPhoneAlt />
                                      </span>
                                      {basicInfo.mobileNumber}
                                    </Box>
                                  )}
                                {templateData?.email &&
                                  basicInfo?.employeeEmailID && (
                                    <Box className="adv-pf-img-name adv-inner-img">
                                      <span className="adv-pf-icon">
                                        <IoMdMail />
                                      </span>
                                      {basicInfo.employeeEmailID}
                                    </Box>
                                  )}

                                {templateData.linkedInId && (
                                  <Box className="adv-pf-img-name adv-inner-img">
                                    <span className="adv-pf-icon">
                                      <FaLinkedin />
                                    </span>
                                    {basicInfo.linkedinId}
                                  </Box>
                                )}
                              </Box>

                              {/* Education Details */}
                              <Box>
                                {selectedCVInfoData?.employeeGenerateCVEducationDetails
                                  ?.filter(
                                    (exp) =>
                                      exp.cvEmpCode === basicInfo.cvEmpCode
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
                                            {moment(
                                              exp.educationYearOfPassing
                                            ).format("MMM YYYY")}
                                          </Box>
                                        )}
                                        {templateData?.boardUniversity && (
                                          <Box className="adv-pf-img-name">
                                            {exp.boardName}
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
                                            {exp.educationPercentage}%
                                          </Box>
                                        )}
                                      </Box>
                                    </Box>
                                  ))}
                              </Box>
                              {/* skills */}
                              <Box>
                                {selectedCVInfoData?.employeeGenerateCVSkillDetails
                                  ?.filter(
                                    (skill) =>
                                      skill.cvEmpCode === basicInfo.cvEmpCode
                                  )
                                  ?.map((skillData, skillIndex) => {
                                    // Find the skill name based on skillId from selectedAll
                                    const matchingSkill = selectedAllSkill.find(
                                      (selectedSkill) =>
                                        selectedSkill.skillId ===
                                        skillData.skillId
                                    );
                                    return (
                                      <Box
                                        className="objective-section"
                                        key={skillIndex}
                                        sx={{ mt: skillIndex > 0 ? 2 : 0 }}
                                      >
                                        {skillIndex === 0 && (
                                          <Box className="adv-educ-text-heading adv-text-save-heading">
                                            Skills
                                            <Box className="adv-line-text"></Box>
                                          </Box>
                                        )}
                                        {templateData?.skills && (
                                          <Box className="adv-skills-text-save">
                                            <Box className="adv-skills-text-section">
                                              <Box className="adv-bullet-text"></Box>

                                              {matchingSkill
                                                ? matchingSkill.name
                                                : "Unknown Skill"}
                                            </Box>
                                          </Box>
                                        )}
                                      </Box>
                                    );
                                  })}
                              </Box>
                              {/* Technology */}
                              <Box>
                                {selectedCVInfoData?.employeeGenerateCVTechnologyDetails
                                  ?.filter(
                                    (tech) =>
                                      tech.cvEmpCode === basicInfo.cvEmpCode
                                  )
                                  ?.map((techData, techIndex) => {
                                    // Find the skill name based on skillId from selectedAll
                                    const matchingTech = selectedAllTech.find(
                                      (selectedTech) =>
                                        selectedTech.technologyId ===
                                        techData.technologyId
                                    );
                                    return (
                                      <Box
                                        className="objective-section"
                                        key={techIndex}
                                        sx={{ mt: techIndex > 0 ? 2 : 0 }}
                                      >
                                        {techIndex === 0 && (
                                          <Box className="adv-educ-text-heading adv-text-save-heading">
                                            Technology
                                            <Box className="adv-line-text"></Box>
                                          </Box>
                                        )}
                                        {templateData?.skills && (
                                          <Box className="adv-skills-text-save">
                                            <Box className="adv-skills-text-section">
                                              <Box className="adv-bullet-text"></Box>
                                              {/* Display the skill name based on matching skillId */}
                                              {matchingTech
                                                ? matchingTech.technologyName
                                                : "Unknown Skill"}
                                            </Box>
                                          </Box>
                                        )}
                                      </Box>
                                    );
                                  })}
                              </Box>

                              {/* Tools */}
                              <Box>
                                {selectedCVInfoData?.employeeGenerateCVSkillTechToolDetails
                                  ?.filter(
                                    (tool) =>
                                      tool.cvEmpCode === basicInfo.cvEmpCode
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
                                selectedCVInfoData?.employeeGenerateCVObjective
                                  ?.filter(
                                    (obj) =>
                                      obj.cvEmpCode === basicInfo?.cvEmpCode
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
                                            __html: obj.objectiveDescriptin,
                                          }}
                                        />
                                      )}
                                    </Box>
                                  ))}
                            </Box>

                            {/* Experience Details */}
                            <Box>
                              {selectedCVInfoData?.employeeGenerateCVExprienceDeatail
                                ?.filter(
                                  (exp) =>
                                    exp.cvEmpCode === basicInfo?.cvEmpCode
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
                                                "MMM YYYY"
                                              )}
                                            </Box>
                                          )}
                                        </Box>
                                      </Box>
                                      {templateData?.role && (
                                        <Box className="adv-experience-text-comp padding-des-exp">
                                          <ul>
                                            {exp.experienceSummary
                                              ? exp.experienceSummary
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
                              {selectedCVInfoData?.employeeGenerateCVProjectDetails
                                ?.filter(
                                  (exp) =>
                                    exp.cvEmpCode === basicInfo?.cvEmpCode
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
                                              {exp.projectRoleName
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
                                      {templateData?.role && (
                                        <Box className="adv-experience-text-comp padding-des-exp">
                                          <ul>
                                            {exp.descriptions

                                              ? exp.descriptions

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
                              {selectedCVInfoData?.employeeGenerateCVCertification
                                ?.filter(
                                  (exp) =>
                                    exp.cvEmpCode === basicInfo?.cvEmpCode
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
                                              {exp.extraCertificateTitle}
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
                                            {exp.extraCertificateDescription

                                              ? exp.extraCertificateDescription

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
      ) : (
        <Box className="cv-generate-section">
          <SideBar />

          <Box component="main" className="cv-inner-section">
            {loading ? (
              <Loader />
            ) : (
              <Typography variant="h4">
                <Box className="cv-text">Curriculum Vitae</Box>
                <Grid container spacing={2}>
                  {selectedCVInfoData?.employeeBasicGenerateCVInformation
                    ?.length > 0 &&
                  selectedAllSkill.length > 0 &&
                  selectedAllTech.length > 0
                    ? selectedCVInfoData.employeeBasicGenerateCVInformation.map(
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
                                      basicInfo?.employeeEmailID && (
                                        <Box className="cv-text-heading">
                                          {basicInfo.employeeEmailID} |
                                        </Box>
                                      )}
                                    {templateData?.mobileNo &&
                                      basicInfo?.mobileNumber && (
                                        <Box className="cv-text-heading">
                                          {basicInfo.mobileNumber} |
                                        </Box>
                                      )}
                                  </Box>
                                </Box>
                              </Box>
                            </Grid>

                            {/* objective Details */}
                            <Box className="profile-cv-section">
                              {templateData?.objectiveName &&
                                selectedCVInfoData?.employeeGenerateCVObjective
                                  ?.filter(
                                    (obj) =>
                                      obj.cvEmpCode === basicInfo?.cvEmpCode
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
                                              __html: obj.objectiveDescriptin,
                                            }}
                                          />
                                        </Box>
                                      )}
                                    </Box>
                                  ))}
                            </Box>

                            {/* experience Details */}
                            <Box className="Exp-cv-section">
                              {selectedCVInfoData?.employeeGenerateCVExprienceDeatail
                                ?.filter(
                                  (exp) =>
                                    exp.cvEmpCode === basicInfo?.cvEmpCode
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

                            {/* Education Details */}
                            <Box className="Exp-cv-section">
                              {selectedCVInfoData?.employeeGenerateCVEducationDetails
                                ?.filter(
                                  (exp) => exp.cvEmpCode === basicInfo.cvEmpCode
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

                            {/* project  */}
                            <Box className="Exp-cv-section">
                              {selectedCVInfoData?.employeeGenerateCVProjectDetails
                                ?.filter(
                                  (exp) => exp.cvEmpCode === basicInfo.cvEmpCode
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
                                              {exp.descriptions}
                                            </span>
                                          </Box>
                                        )}
                                      </Box>
                                    </Box>
                                  </Box>
                                ))}
                            </Box>

                            {/* Certification */}
                            <Box className="Exp-cv-section">
                              {selectedCVInfoData?.employeeGenerateCVCertification
                                ?.filter(
                                  (exp) => exp.cvEmpCode === basicInfo.cvEmpCode
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
                                              {exp.extraCertificateTitle}
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
                                              {exp.extraCertificateDescription}
                                            </span>
                                          </Box>
                                        )}
                                      </Box>
                                      <Box className="right-experience-column">
                                        {/* {templateData?.issuingOrganization && (
                          <Box className="cv-text-heading">
                            Issuing Organization:{" "}
                            <span className="emp-cv-details">
                              {exp.issuingOrganization}
                            </span>
                          </Box>
                        )} */}
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

                            {/* skills */}
                            <Box className="adv-skills-basic-section">
                              {selectedCVInfoData
                                ?.employeeGenerateCVSkillDetails?.length >
                                0 && (
                                <Box className="cv-text-heading">
                                  Skills:{" "}
                                  <span className="des-skill-basic-text">
                                    {selectedCVInfoData?.employeeGenerateCVSkillDetails
                                      ?.filter(
                                        (skill) =>
                                          skill.cvEmpCode ===
                                          basicInfo.cvEmpCode
                                      )
                                      ?.map((skillData) => {
                                        // Find the skill name based on skillId from selectedAllSkill
                                        const matchingSkill =
                                          selectedAllSkill.find(
                                            (selectedSkill) =>
                                              selectedSkill.skillId ===
                                              skillData.skillId
                                          );
                                        return matchingSkill
                                          ? matchingSkill.name
                                          : "Unknown Skill";
                                      })
                                      .join(", ")}{" "}
                                  </span>
                                </Box>
                              )}
                            </Box>

                            {/* technology */}
                            <Box className="adv-skills-basic-section">
                              {selectedCVInfoData
                                ?.employeeGenerateCVTechnologyDetails?.length >
                                0 && (
                                <Box className="cv-text-heading">
                                  Technologies:{" "}
                                  <span className="des-skill-basic-text">
                                    {selectedCVInfoData?.employeeGenerateCVTechnologyDetails
                                      ?.filter(
                                        (skill) =>
                                          skill.cvEmpCode ===
                                          basicInfo.cvEmpCode
                                      )
                                      ?.map((skillData) => {
                                        const matchingSkill =
                                          selectedAllTech.find(
                                            (selectedSkill) =>
                                              selectedSkill.technologyId ===
                                              skillData.technologyId
                                          );
                                        return matchingSkill
                                          ? matchingSkill.technologyName
                                          : "Unknown Skill";
                                      })
                                      .join(", ")}{" "}
                                  </span>
                                </Box>
                              )}
                            </Box>

                            {/* tools */}
                            <Box className="profile-cv-section">
                              {selectedCVInfoData?.employeeGenerateCVSkillTechToolDetails
                                ?.filter(
                                  (tool) =>
                                    tool.cvEmpCode === basicInfo.cvEmpCode
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

                            <Box className="download-cv-section-ad">
                              <MdDownload
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
      )}
    </>
  );
}

export default SavePdf;
