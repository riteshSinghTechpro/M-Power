import React, { useEffect, useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import SideBar from "../Component/SideBar";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { PhotoCamera } from "@mui/icons-material";
import { Avatar, Input } from "@mui/material";
import { CircularProgress } from "@mui/material";
import moment from "moment/moment";
import {
  Breadcrumbs,
  Link,
  Chip,
  Checkbox,
  FormHelperText,
  OutlinedInput,
  ListItemText,
  Grid,
  Card,
  Typography,
  Box,
  Button,
  TextField,
  DialogTitle,
} from "@mui/material";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import { styled } from "@mui/system";
import { MenuItem, FormControl, InputLabel } from "@mui/material";
import { Select } from "@mui/material";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Component/Loader";

import { IconButton, Autocomplete } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { useLocation } from "react-router-dom";
const options1 = [
  { id: "1", name: "English" },
  { id: "2", name: "Hindi" },
  { id: "3", name: "Tamil" },
  { id: "4", name: "Spanish" },
  // add more options
];

function ViewDetailsList() {
  const baseURL = "https://staffcentral.azurewebsites.net/api";

  const [availableOptions, setAvailableOptions] = React.useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [updateData, setUpdateData] = useState([]);
  const [empIds, setEmpId] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [tabData, setTabData] = useState(true);
  const [expTab, setExpTab] = useState(true);
  const [famTab, setFamTab] = useState(true);
  const [docTab, setDocTab] = useState(true);
  useEffect(() => {
    const id = localStorage.getItem("empId");
    if (id) {
      setEmpId(id);
    }
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDataById = async (empIds) => {
      if (!empIds) return;
      try {
        const response = await axios.get(
          `${baseURL}/EmployeeManagement/GetEmployeeById?EmpCode=${empIds}`
        );
        const data = response.data;
        setUpdateData(data);
        setIsEdit(true);
      } catch (error) {
        console.error("Error fetching state details:", error);
      } finally {
        localStorage.removeItem("empId");
      }
    };
    if (empIds) {
      fetchDataById(empIds);
    }
  }, [empIds]);

  const [activeTab, setActiveTab] = React.useState("1");
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);

  

  // Handle the image upload

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };

  function handleClick(event) {
    event.preventDefault();
  }

  const handleChange1 = (setter, errorSetter, fieldName) => (e) => {
    let value = e.target.value;

    if (fieldName === "mobile" || fieldName === "accountNumber") {
      // Remove non-numeric characters
      value = value.replace(/\D/g, "");

      if (fieldName === "mobile") {
        // Limit to 10 digits for mobile number
        if (value.length > 10) {
          value = value.slice(0, 10);
        }

        if (!/^\d{10}$/.test(value)) {
          errorSetter("m.b. should be 10 digits.");
        } else {
          errorSetter("");
        }
      }

      if (fieldName === "accountNumber") {
        // Limit to 17 digits for account number
        if (value.length > 17) {
          value = value.slice(0, 17);
        }

        if (value.length < 17) {
          errorSetter("Account number cannot exceed 17 digits.");
        } else {
          errorSetter("");
        }
      }
    } else if (fieldName === "linkedin") {
      const urlPattern =
        /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;

      if (!urlPattern.test(value)) {
        errorSetter("Invalid URL format.");
      } else {
        errorSetter("");
      }
    } else {
      // Clear error for other fields
      if (fieldName !== "cAddress2" && fieldName !== "pAddress2") {
        errorSetter("");
      }
    }

    setter(value);
  };

  const location = useLocation();

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [insuranceError, setInsuranceError] = useState("");
  const [insuranceExpiryDateError, setInsuranceExpiryDateError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [dobError, setDobError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [maritalStatusError, setMaritalStatusError] = useState(false);
  const [linkedinError, setLinkedinError] = useState(false);
  const [languageError, setLanguageError] = useState("");
  const [cAddress1Error, setCaddress1Error] = useState("");
  const [cAddress2Error, setCaddress2Error] = useState("");
  const [cCityTownError, setCcityTownError] = useState("");
  const [cPostalCodeError, setCpostalCodeError] = useState("");
  const [cCountryError, setCcountryError] = useState("");
  const [cStateError, setCstateError] = useState("");
  const [pAddress1Error, setPaddress1Error] = useState("");
  const [pAddress2Error, setPaddress2Error] = useState("");
  const [pCityTownError, setPcityTownError] = useState("");
  const [pPostalCodeError, setPpostalCodeError] = useState("");
  const [pCountryError, setPcountryError] = useState("");
  const [pStateError, setPstateError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [mobile, setMobile] = useState("");
  const [gender, setGender] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [language, setLanguage] = useState([]);
  const [insuranceExpiryDate, setInsuranceExpiryDate] = useState("");
  //const [insurance, setInsurance] = useState([]);
  const [insurance, setInsurance] = useState("");

  const [cAddress1, setCaddress1] = useState("");
  const [cAddress2, setCaddress2] = useState("");
  const [cCountry, setCcountry] = useState("");
  const [cState, setCstate] = useState("");
  const [cCityTown, setCcityTown] = useState("");
  const [cPostalCode, setCpostalCode] = useState("");

  const [pAddress1, setPaddress1] = useState("");
  const [pAddress2, setPaddress2] = useState("");
  const [pCityTown, setPcityTown] = useState("");
  const [pPostalCode, setPpostalCode] = useState("");
  const [pCountry, setPcountry] = useState("");
  const [pState, setPstate] = useState("");
  const [employeePicFile, setEmployeePicFile] = useState(null);
  const [sameAsCurrent, setSameAsCurrent] = useState(false);

  const handleCopyAddress = (event) => {
    const isChecked = event.target.checked;
    setSameAsCurrent(isChecked);

    if (isChecked) {
      setPaddress1(cAddress1);
      setPaddress2(cAddress2);
      setPcountry(cCountry);
      setPstate(cState);
      setPcityTown(cCityTown);
      setPpostalCode(cPostalCode);

      setPaddress1Error("");
      setPaddress2Error("");
      setPcountryError("");
      setPstateError("");
      setPcityTownError("");
      setPpostalCodeError("");
    } else {
      setPaddress1("");
      setPaddress2("");
      setPcountry("");
      setPstate("");
      setPcityTown("");
      setPpostalCode("");
    }
  };

  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIFSCCode] = useState("");
  const [accountType, setAccountType] = useState(0);
  // Financial Detail Error
  const [bankNameError, setBankNameError] = useState("");
  const [accountNumberError, setAccountNumberError] = useState("");
  const [ifscCodeError, setIFSCCodeError] = useState("");
  const [accountTypeError, setAccountTypeError] = useState("");

  // Personal Detail Event Handling
  const handleFirstNameChange = handleChange1(setFirstName, setFirstNameError);
  const handleLastNameChange = handleChange1(setLastName, setLastNameError);
  const handleEmailChange = handleChange1(setEmail, setEmailError);
  const handleDobChange = handleChange1(setDob, setDobError);
  //const handleinsuranceChange = handleChange1(setInsurance, setInsuranceError);
  const handleinsuranceChange = (event) => {
    const value = event.target.value === "true"; // Convert the string 'true'/'false' to boolean
    setInsurance(value);
  };
  
  const handleMobileChange = handleChange1(setMobile, setMobileError, "mobile");
  const handleGenderChange = handleChange1(setGender, setGenderError);
  const [insCalendar, setInsCalendar] = useState(false);
  
  useEffect(()=> {
    if (insurance === false) {
        setInsCalendar(true);
      } else {
        setInsCalendar(false);
      }
  },[insurance])
  // const handleinsuranceExpiryDateChange = handleChange1(setInsuranceExpiryDate, setInsuranceExpiryDateError)
  const handleinsuranceExpiryDateChange = (event) => {
    setInsuranceExpiryDate(event.target.value);
  };
  const handleMaritalStatusChange = handleChange1(
    setMaritalStatus,
    setMaritalStatusError
  );
  const handleLinkedInChange = handleChange1(
    setLinkedin,
    setLinkedinError,
    "linkedin"
  );
  const handleLanguageChange = handleChange1(setLanguage, setLanguageError);
  const handleCaddress1Change = handleChange1(setCaddress1, setCaddress1Error);
  const handleCaddress2Change = handleChange1(
    setCaddress2,
    setCaddress2Error,
    "cAddress2"
  );

  const handleCcityTownChange = handleChange1(setCcityTown, setCcityTownError);
  const handleCpostalCodeChange = handleChange1(
    setCpostalCode,
    setCpostalCodeError
  );
  const handleCcountryChange = handleChange1(setCcountry, setCcountryError);
  const handleCstateChange = handleChange1(setCstate, setCstateError);
  const handlePaddress1Change = handleChange1(setPaddress1, setPaddress1Error);
  const handlePaddress2Change = handleChange1(
    setPaddress2,
    setPaddress2Error,
    "pAddress2"
  );
  const handlePcityTownChange = handleChange1(setPcityTown, setPcityTownError);
  const handlePpostalCodeChange = handleChange1(
    setPpostalCode,
    setPpostalCodeError
  );
  const handlePcountryChange = handleChange1(setPcountry, setPcountryError);
  const handlePstateChange = handleChange1(setPstate, setPstateError);
  // Financial Detail Event Handling
  const handleBankNameChange = handleChange1(setBankName, setBankNameError);
  

  const handleAccountNumberChange = handleChange1(
    setAccountNumber,
    setAccountNumberError,
    "accountNumber"
  );
  const handleIFSCCodeChange = handleChange1(setIFSCCode, setIFSCCodeError);
  const handleAccountTypeChange = handleChange1(
    setAccountType,
    setAccountTypeError
  );
  const [countryName, setSelectedCountry] = useState([]);
  const [stateName, setSelectedState] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);
  const [documents, setDocumentName] = useState([]);

  const { empId, flagData } = location.state || {};

  const fetchCountry = async () => {
    try {
      const response = await axios.get(`${baseURL}/Country/GetAllCountry`);
      const data = response.data;
      setSelectedCountry(data); // Assuming data is an array of country objects
    } catch (error) {
      console.error("Error fetching country details:", error);
    }
  };
  useEffect(() => {
    fetchCountry();
  }, []);

  const formattedDate = insuranceExpiryDate
    ? new Date(insuranceExpiryDate).toISOString().split("T")[0]
    : "";

  const fetchState = async (countryId) => {
    if (!countryId) return;
    try {
      const response = await axios.get(
        `${baseURL}/Country/GetStateByCountryId?CountryId=${countryId}`
      );
      const data = response.data;
      setSelectedState(data); // Assuming data is an array of state objects
    } catch (error) {
      console.error("Error fetching state details:", error);
    }
  };

  useEffect(() => {
    if (cCountry) {
      fetchState(cCountry);
    }
  }, [cCountry]);

  const fetchCity = async (stateId) => {
    try {
      const response = await axios.get(
        `${baseURL}/Country/GetCityBystateId?StateId=${stateId}`
      );
      const data = response.data;
      setSelectedCity(data); // Assuming data is an array of city objects
    } catch (error) {
      console.error("Error fetching city details:", error);
    }
  };

  useEffect(() => {
    if (cState) {
      fetchCity(cState);
    }
  }, [cState]);

  const [courseName, setCourseName] = useState([]);
  const [boardName, setBoardName] = useState([]);

  const fetchCourseName = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/EmployeeManagement/GetAllCourse`
      );
      const data = response.data;
      setCourseName(data); // Assuming data is an array of city objects
    } catch (error) {
      console.error("Error fetching course details:", error);
    }
  };

  useEffect(() => {
    fetchCourseName();
  }, []);

  const fetchBoardName = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/EmployeeManagement/GetAllBoards`
      );
      const data = response.data;
      setBoardName(data); // Assuming data is an array of city objects
    } catch (error) {
      console.error("Error fetching board details:", error);
    }
  };

  useEffect(() => {
    fetchBoardName();
  }, []);

  const fetchDocumentName = async () => {
    try {
      const response = await axios.get(`${baseURL}/DocType/GetDocType`);
      const data = response.data;
      setDocumentName(data); // Assuming data is an array of city objects
    } catch (error) {
      console.error("Error fetching board details:", error);
    }
  };

  useEffect(() => {
    fetchDocumentName();
  }, []);

  const [options, setOptions] = useState([]);

  const fetchRoleName = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/CompanyProject/GetAllCompanyRole`
      );
      const data = response.data;
      setOptions(data); // Assuming data is an array of city objects
    } catch (error) {
      console.error("Error fetching Role details:", error);
    }
  };

  useEffect(() => {
    fetchRoleName();
  }, []);

  const [skillsOptions, setSkillsOptions] = useState([]);

  const fetchSkillsName = async () => {
    try {
      const response = await axios.get(`${baseURL}/SkillMaster/GetAllSkill`);
      setSkillsOptions(response.data); // store the entire skill object
    } catch (error) {
      console.error("Error fetching skill details:", error);
    }
  };

  useEffect(() => {
    fetchSkillsName();
  }, []);

  const [roleOptions, setRoleOptions] = useState([]);

  const fetchOptionRoleName = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/CompanyProject/GetAllProjectRole`
      );
      const data = response.data;
      // Ensure each role has both id and name
      const roles = data.map((role) => ({
        value: role.roleId,
        label: role.name,
      }));
      setRoleOptions(roles);
    } catch (error) {
      console.error("Error fetching Role details:", error);
    }
  };

  useEffect(() => {
    fetchOptionRoleName();
  }, []);

  const fetchTechnologyName = async () => {
    try {
      const response = await axios.get(`${baseURL}/Technology/GetTechnologys`);
      const data = response.data;
      setAvailableOptions(data); // Assuming data is an array of city objects
    } catch (error) {
      console.error("Error fetching technology details:", error);
    }
  };

  useEffect(() => {
    fetchTechnologyName();
  }, []);

  const validateField = (field, setError, errorMessage) => {
    if (!field) {
      setError(errorMessage);
      return false;
    } else {
      setError("");
      return true;
    }
  };

  const validateEmail = (email, setError) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError("Please Enter Email Id");
      return false;
    } else if (!emailRegex.test(email)) {
      setError("Invalid email format");
      return false;
    } else {
      setError("");
      return true;
    }
  };

  const [inputRows, setInputRows] = useState([
    {
      id: 1,
      instituteName: "",
      courseName: "",
      university: "",
      percentage: "",
      passingYear: "",
      otherUniversity: "",
    },
  ]);

  const [certificationRows, setCertificationRows] = useState([
    {
      id: 1,
      certificationName: "",
      issuingOrganization: "",
      issuedDate: "",
      expirationDate: "",
      description: "",
    },
  ]);
  const [achievementsRows, setAchievementsRows] = useState([
    { id: 1, achievementTitle: "", adescription: "" },
  ]);
  // State variables for errors
  const [errors, setErrors] = useState({});
  // Handle change functions for each field
  const [checkUniv, setCheckUniv] = useState("");

  
  const handleChange = (index, field, value, type) => {
    
    if (field == "university") {
      const selectedBoard = boardName.find((board) => board.boardId === value);
      setCheckUniv(selectedBoard);
    }
    const rows =
      type === "input"
        ? [...inputRows]
        : type === "certification"
        ? [...certificationRows]
        : [...achievementsRows];
    rows[index][field] = value;
    type === "input"
      ? setInputRows(rows)
      : type === "certification"
      ? setCertificationRows(rows)
      : setAchievementsRows(rows);
    const newErrors = { ...errors };
    delete newErrors[`${field}-${index}`];
    setErrors(newErrors);
  };

  const [inputExpRows, setInputExpRows] = useState([
    { id: Date.now(), companyName: "", role: [], cfromDate: "", ctoDate: "" },
  ]);

  const [projectRows, setProjectRows] = useState([
    {
      id: Date.now(),
      projectName: "",
      pRole: "",
      fromDate: "",
      toDate: "",
      description: "",
    },
  ]);
  const [selectedOptions1, setSelectedOptions1] = useState([]);

  const handleSkillsChange = (event) => {
    const {
      target: { value },
    } = event;

    const selectedOptions =
      typeof value === "string" ? value.split(",") : value;

    setSelectedOptions1(selectedOptions);

    const newErrors = { ...errors };
    delete newErrors["skills"];
    setErrors(newErrors);
  };

  const [selectedOptions2, setSelectedOptions2] = useState([]);

  const handleTechnologyChange = (event) => {
    const {
      target: { value },
    } = event;

    const selectedOptions =
      typeof value === "string" ? value.split(",") : value;

    setSelectedOptions2(selectedOptions);

    const newErrors = { ...errors };
    delete newErrors["technology"];
    setErrors(newErrors);
  };

  const [tool, setTool] = useState("");

  const handleInputChange = (e, index, field, section) => {
    const { value } = e.target;

    if (section === "tool") {
      setTool(value);

      const newErrors = { ...errors };
      delete newErrors["tool"];
      setErrors(newErrors);
      return;
    }

    const rows =
      section === "company"
        ? [...inputExpRows]
        : section === "project"
        ? [...projectRows]
        : [];

    if (rows.length > 0) {
      rows[index][field] = value;

      if (section === "company") {
        setInputExpRows(rows);
      } else if (section === "project") {
        setProjectRows(rows);
      }
    }

    const newErrors = { ...errors };
    delete newErrors[`${field}-${index}`];
    setErrors(newErrors);
  };

  const handleRoleChange = (e, index, section) => {
    const { value } = e.target;

    const rows =
      section === "company"
        ? [...inputExpRows]
        : section === "project"
        ? [...projectRows]
        : [];

    if (rows.length > 0) {
      if (section === "company") {
        rows[index].role = value;
        setInputExpRows(rows);
      } else if (section === "project") {
        rows[index].pRole = value;
        setProjectRows(rows);
      }
    }

    const newErrors = { ...errors };
    delete newErrors[`${section === "company" ? "role" : "pRole"}-${index}`];
    setErrors(newErrors);
  };

  const handleAddExpRow = () => {
    setInputExpRows([
      ...inputExpRows,
      { id: Date.now(), companyName: "", role: [], cfromDate: "", ctoDate: "" },
    ]);
  };
  const handleRemoveExpRow = (index) => {
    const rows = [...inputExpRows];
    rows.splice(index, 1);
    setInputExpRows(rows);
  };
  const handleProjectAddRow = () => {
    setProjectRows([
      ...projectRows,
      {
        id: Date.now(),
        projectName: "",
        pRole: "",
        fromDate: "",
        toDate: "",
        description: "",
      },
    ]);
  };
  const handleProjectRemoveRow = (index) => {
    const rows = [...projectRows];
    rows.splice(index, 1);
    setProjectRows(rows);
  };
  const validateExperienceDetails = () => {
    const newErrors = {};

    // Validate Company Details
    inputExpRows.forEach((row, index) => {
      if (!row.companyName)
        newErrors[`companyName-${index}`] = "Company Name is required";
      if (!row.role || row.role.length === 0)
        newErrors[`role-${index}`] = "Company role is required";
      if (!row.cfromDate)
        newErrors[`cfromDate-${index}`] = "From Date is required";
      if (!row.ctoDate) newErrors[`ctoDate-${index}`] = "To Date is required";
    });
    // Validate Project Details
    projectRows.forEach((row, index) => {
      if (!row.projectName)
        newErrors[`projectName-${index}`] = "Project Name is required";
      if (!row.pRole) newErrors[`pRole-${index}`] = "Project Role is required";
      if (!row.fromDate)
        newErrors[`fromDate-${index}`] = "From Date is required";
      if (!row.toDate) newErrors[`toDate-${index}`] = "To Date is required";
      if (!row.description)
        newErrors[`description-${index}`] = "Description is required";
    });
    // Validate Skills and Technology
    if (selectedOptions1.length === 0)
      newErrors["skills"] = "At least one skill is required";
    if (selectedOptions2.length === 0)
      newErrors["technology"] = "At least one technology is required";
    if (!tool) newErrors["tool"] = "Tool is required";
    setErrors(newErrors);
    

    return Object.keys(newErrors).length === 0;
  };

  const [formValues, setFormValues] = useState({
    name: "",
    isDependent: "",
    employeeRelation: "",
    familyMobileNo: "",
    bloodGroup: "",
    pwd: "",
    description: "",
  });

  const [formRows, setFormRows] = useState([formValues]);
  //const [errors, setErrors] = useState({});

  const handleChange2 = (index, event) => {
    const { name, value } = event.target;
    let newValue = value;

    // Mobile number validation and formatting
    if (name === "familyMobileNo") {
      newValue = newValue.replace(/\D/g, "");
      if (newValue.length > 10) {
        newValue = newValue.slice(0, 10);
      }
    }

    const newRows = [...formRows];
    newRows[index] = { ...newRows[index], [name]: newValue };
    setFormRows(newRows);

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (name === "familyMobileNo") {
        if (!/^\d{10}$/.test(newValue)) {
          newErrors[`${name}-${index}`] =
            "m.b. should be 10 digits.";
        } else {
          delete newErrors[`${name}-${index}`];
        }
      } else {
        delete newErrors[`${name}-${index}`];
      }
      return newErrors;
    });
  };

  const handleRowAdd = () => {
    setFormRows([...formRows, { ...formValues }]);
  };

  const handleRowRemove = (index) => {
    const newRows = formRows.filter((_, i) => i !== index);
    setFormRows(newRows);
  };

  const handleFamilyHealthSubmit = (event) => {
    event.preventDefault();
    const newErrors = {};
    formRows.forEach((row, index) => {
      if (!row.name) newErrors[`name-${index}`] = "Name is required";
      if (!row.isDependent)
        newErrors[`isDependent-${index}`] = "Please select if dependent";
      if (!row.employeeRelation)
        newErrors[`employeeRelation-${index}`] = "Relation is required";
      if (!row.familyMobileNo)
        newErrors[`familyMobileNo-${index}`] = "Mobile number is required";
      if (!row.bloodGroup)
        newErrors[`bloodGroup-${index}`] = "Blood group is required";
      if (!row.pwd) newErrors[`pwd-${index}`] = "Please select if handicapped";
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
     
      setActiveTab(String(parseInt(activeTab) + 1));
      setDocTab(false);
    }
  };

  const validateUploadDocument = () => {
    const newErrors = {};
    fileUploadRows.forEach((row, index) => {
      if (!row.documentType) {
        newErrors[`documentType-${index}`] = "Document Type is required";
      }
      if (!row.file) {
        newErrors[`file-${index}`] = "Please upload file";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatDate = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      let month = ("0" + (date.getMonth() + 1)).slice(-2);
      let day = ("0" + date.getDate()).slice(-2);
      return `${date.getFullYear()}-${month}-${day}`;
    }
    return "";
  };

  const employeeCompanyRoles = {
    roleId: inputExpRows.map((row) => row.role).flat(),
    companyName: inputExpRows[0]?.companyName || "",
  };

  const handleSubmitTransactionMaster = (event) => {
    event.preventDefault();
    if (
      validatePersonalDetails() &&
      validateEducationalDetails() &&
      validateExperienceDetails() &&
      //validateFamilyAndMadicals() &&
      validateUploadDocument()
    ) {
      const payload = {
        empFName: firstName,
        empMName: middleName,
        empLName: lastName,
        empEmailId: email,
        empDateofBirth: dob,
        empMobileNumber: mobile,
        empGenderId: gender,
        empMaritalStatusId: maritalStatus,
        linkedin: linkedin,
        designationId: selectedDesignation,
        departmentId: selectedDept,
        employeePicName:employeePicName,
        employeePicPath: employeePicPath,
        addressDetails: {
          addressCountryId: cCountry,
          addressStateId: cState,
          addressCityId: cCityTown,
          addressPinCode: cPostalCode,
          address1: cAddress1,
          address: cAddress2,
          permanentAddressLine1: pAddress1,
          permanentAddressLine2: pAddress2,
          permanentCountryId: pCountry,
          permanentStateId: pState,
          permanentCityId: pCityTown,
          permanentPostalCode: pPostalCode,
        },
        financialDetails: {
          bankName: bankName,
          accountNumber: accountNumber,
          ifscCode: ifscCode,
          accountType: accountType,
          insurance: insurance,
          insuranceExpiryDate: insuranceExpiryDate || null,
        },
        employeeLanguageDetail: {
          empLanguageId: language,
        },
        educationDetails: inputRows.map((row) => ({
          instituteName: row.instituteName,
          courseId: row.courseName,
          educationBoardId: row.university,
          educationPercentage: row.percentage,
          educationYearOfPassing: row.passingYear,
          otherBoardsandUniversityName: row.otherUniversity,
        })),
        educationCertifications: certificationRows.map((row) => ({
          extraCertificateTitle: row.certificationName,
          issuingOrganizatio: row.issuingOrganization,
          issuedDate: row.issuedDate,
          expirationDate: row.expirationDate,
          extraCertificateDescription: row.cdescription,
        })),
        educationAchievements: achievementsRows.map((row) => ({
          achievementTitle: row.achievementTitle,
          achievementDescription: row.adescription,
        })),
        employeeCompanyDetails: inputExpRows.map((row) => ({
          companyName: row.companyName,
          fromDate: row.cfromDate,
          toDate: row.ctoDate,
        })),
        employeeCompanyRoles,
        employeeProjectDetails: projectRows.map((row) => ({
          projectName: row.projectName,
          projectRoleId: row.pRole,
          fromDate: row.fromDate,
          toDate: row.toDate,
          projectDescription: row.description,
        })),
        employeeSkillsTechnology: {
          skillId: selectedOptions1,
          technologyId: selectedOptions2,
          tool: tool,
        },

        employeeFamilyMedicalDetail: formRows.map((row) => ({
          name: row.name,
          isthatdependent: row.isDependent === "1" ? true : false,
          pwd: row.pwd === "1" ? true : false,
          description: row.description,
          bloodGroup: row.bloodGroup,
          employeeRelation: row.employeeRelation,
          familyMobileNo: row.familyMobileNo,
        })),

        empDocDetails: fileUploadRows.map((row) => ({
          docTypeID: row.documentType,
          docFileName: row.file ? row.file.name : "",
          docPath: row.file ? row.file.name : "",
        })),
      };
      submitFormData(payload);
    }
  };

  const submitFormData = async (formData) => {
    try {
      const response = await axios.post(
        `${baseURL}/EmployeeManagement/SaveEmployee`,
        formData
      );
      if (response.data.success === true) {
        toast.success("Data submitted successfully!", {
          position: "top-center",
          closeButton: false,
          autoClose: 2000,
        });
        setTimeout(() => {
          navigate("/employeedetails");
        }, 3000);
      } else {
        toast.error("Failed to submit data. Please try again.", {
          position: "top-center",
          closeButton: false,
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error submitting form data:", error);
      toast.error("An error occurred while submitting the form.");
    }
  };
  const today = moment().format('YYYY-MM-DD');
  
  useEffect(() => {
    if (Object.keys(updateData).length > 0) {
      // Personal Details
      setEmployeePicName(updateData.employeePicName)
      setFirstName(updateData.empFName || "");
      setMiddleName(updateData.empMName || "");
      setLastName(updateData.empLName || "");
      setEmail(updateData.empEmailId || "");
      setSelectedDesignation(updateData.empDesignationId || "");
      setSelectedDept(updateData.departmentId || "");
      setEmployeePicPath(updateData.employeePicPath || "");
      let dob = updateData.empDateofBirth
        ? new Date(updateData.empDateofBirth)
        : "";
      if (dob instanceof Date && !isNaN(dob)) {
        let month = ("0" + (dob.getMonth() + 1)).slice(-2);
        let day = ("0" + dob.getDate()).slice(-2);
        let formattedDob = `${dob.getFullYear()}-${month}-${day}`;
        setDob(formattedDob);
      } else {
        setDob("");
      }
      setMobile(updateData.empMobileNumber || "");
      setGender(updateData.empGenderId || "");
      setMaritalStatus(updateData.empMaritalStatusId || "");
      setLinkedin(updateData.linkedin || "");
      if (updateData && updateData.employeeLanguageview) {
        const initialLanguages = updateData.employeeLanguageview.map((lang) =>
          lang.empLanguageId.toString()
        );
        setLanguage(initialLanguages);
      }

      // Address Details
      setCaddress1(updateData.addressDetailsview?.address1 || "");
      setCaddress2(updateData.addressDetailsview?.address || "");
      setCcityTown(updateData.addressDetailsview?.addressCityId || "");
      setCpostalCode(updateData.addressDetailsview?.addressPinCode || "");
      setCcountry(updateData.addressDetailsview?.addressCountryId || []);
      setCstate(updateData.addressDetailsview?.addressStateId || "");

      setPaddress1(updateData.addressDetailsview?.permanentAddressLine1 || "");
      setPaddress2(updateData.addressDetailsview?.permanentAddressLine2 || "");
      setPcityTown(updateData.addressDetailsview?.permanentCityId || "");
      setPpostalCode(updateData.addressDetailsview?.permanentPostalCode || "");
      setPcountry(updateData.addressDetailsview?.permanentCountryId || []);
      setPstate(updateData.addressDetailsview?.permanentStateId || "");

      // Financial Details
      setBankName(updateData.financialDetailsview?.bankName || "");
      setAccountNumber(updateData.financialDetailsview?.accountNumber || "");
      setIFSCCode(updateData.financialDetailsview?.ifscCode || "");
      setAccountType(updateData.financialDetailsview?.accountType || 0);
      setInsurance(updateData.financialDetailsview.insurance);
      setInsuranceExpiryDate(
        updateData.financialDetailsview?.insuranceExpiryDate || ""
      );
      // Education Details
      setInputRows(
        updateData.educationDetailsview
          ? updateData.educationDetailsview.map((edu, index) => ({
              id: index + 1,
              educationId: edu.educationId,
              instituteName: edu.instituteName,
              courseName: edu.courseId,
              university: edu.educationBoardId,
              percentage: edu.educationPercentage,
              passingYear: formatDate(new Date(edu.educationYearOfPassing)),
              otherUniversity: edu.otherBoardsandUniversityName,
            }))
          : [
              {
                id: 1,
                instituteName: "",
                courseName: "",
                university: "",
                percentage: "",
                passingYear: "",
              },
            ]
      );

      const certificationRows = updateData.educationCertificationsview
        ? updateData.educationCertificationsview.map((cert, index) => ({
            id: index + 1,
            extraCertificateId: cert.extraCertificateId,
            certificationName: cert.extraCertificateTitle,
            issuingOrganization: cert.issuingOrganizatio,
            issuedDate: formatDate(new Date(cert.issuedDate)),
            expirationDate: formatDate(new Date(cert.expirationDate)),
            cdescription: cert.extraCertificateDescription,
          }))
        : [
            {
              id: 1,
              certificationName: "",
              issuingOrganization: "",
              issuedDate: "",
              expirationDate: "",
              cdescription: "",
            },
          ];

      setCertificationRows(certificationRows);

      setAchievementsRows(
        updateData.educationAchievementsview
          ? updateData.educationAchievementsview.map((ach, index) => ({
              id: index + 1,
              achievementsId: ach.achievementsId,
              achievementTitle: ach.achievementTitle,
              adescription: ach.achievementDescription,
            }))
          : [{ id: 1, achievementTitle: "", adescription: "" }]
      );

      // File Upload Details
      setFileUploadRows(
        updateData.documentDetailsview
          ? updateData.documentDetailsview.map((doc, index) => ({
              id: index + 1,
              documentType: doc.documentType,
              file: doc.file,
            }))
          : [{ id: 1, documentType: "", file: null }]
      );

      // Company Details

      setInputExpRows(
        updateData.employeeCompanyDetailsview
          ? updateData.employeeCompanyDetailsview.map((comp, index) => {
              // Filter roles for the current company
              const rolesForCompany = updateData.employeeCompanyRolesviews
                ? updateData.employeeCompanyRolesviews.map((r) => ({
                    role: r.roleId,
                    companyRoleId: r.companyRoleId,
                  }))
                : [];

              return {
                id: index + 1,
                employeeCompanyId: comp.employeeCompanyId,
                companyName: comp.companyName,
                role: rolesForCompany.map((r) => r.role),
                cfromDate: formatDate(new Date(comp.fromDate)),
                ctoDate: formatDate(new Date(comp.toDate)),
              };
            })
          : [{ id: 1, companyName: "", role: [], cfromDate: "", ctoDate: "" }]
      );

      // Project Details
      setProjectRows(
        updateData.employeeProjectDetailsview
          ? updateData.employeeProjectDetailsview.map((proj, index) => ({
              id: index + 1,
              employeeProjectId: proj.employeeProjectId,
              projectName: proj.projectName,
              pRole: proj.projectRoleId,
              fromDate: formatDate(new Date(proj.fromDate)),
              toDate: formatDate(new Date(proj.toDate)),
              description: proj.projectDescription,
            }))
          : [
              {
                id: 1,
                projectName: "",
                pRole: "",
                fromDate: "",
                toDate: "",
                description: "",
              },
            ]
      );

      setSelectedOptions1(
        updateData.employeeSkillsSkillviews
          ? updateData.employeeSkillsSkillviews.map((skill) => skill.skillId)
          : []
      );
      setSelectedOptions2(
        updateData.employeeSkillsTechnologyView
          ? updateData.employeeSkillsTechnologyView.map(
              (skill) => skill.technologyId
            )
          : []
      );
      setTool(updateData.employeeSkillTechnologyToolView?.tool || "");

      setFormRows(
        updateData.employeeFamilyMedicalDetailview
          ? updateData.employeeFamilyMedicalDetailview.map((row, index) => ({
              name: row.name || "",
              isDependent: row.isthatdependent === true ? "1" : "0",
              employeeRelation: row.employeeRelation || "",
              familyMobileNo: row.familyMobileNo || "",
              bloodGroup: row.bloodGroup || "",
              pwd: row.pwd === true ? "1" : "0",
              description: row.description || "",
            }))
          : [{ id: 1, documentType: "", file: null }]
      );
      
      const x = updateData.employeeDocumentview;

      setFileUploadRows(
        updateData.employeeDocumentview
          ? updateData.employeeDocumentview.map((doc, index) => ({
              id: index + 1,
              docId: doc.docId,
              documentType: doc.docTypeID,
              file: doc.docFileName,
            }))
          : [{ id: 1, documentType: "", file: null }]
      );
    }
  }, [updateData]);

  

  const handleUpdateTransactionMaster = (event) => {
    event.preventDefault();

    if (
      validatePersonalDetails() &&
      validateEducationalDetails() &&
      validateExperienceDetails() &&
      //validateFamilyAndMadicals() &&
      validateUploadDocument()
    ) {
      const payload = {
        empCode: updateData.empCode, // Assuming empCode is part of updateData
        empFName: firstName,
        empMName: middleName,
        empLName: lastName,
        empEmailId: email,
        empDateofBirth: dob,
        empMobileNumber: mobile,
        empGenderId: gender,
        empMaritalStatusId: maritalStatus,
        linkedin: linkedin,
        designationId: selectedDesignation,
        employeePicPath: employeePicPath,
        employeePicName:employeePicName,
        departmentId: selectedDept,
        addressDetails: {
          addressCountryId: cCountry,
          addressStateId: cState,
          addressCityId: cCityTown,
          addressPinCode: cPostalCode,
          address1: cAddress1,
          address: cAddress2,
          permanentAddressLine1: pAddress1,
          permanentAddressLine2: pAddress2,
          permanentCountryId: pCountry,
          permanentStateId: pState,
          permanentCityId: pCityTown,
          permanentPostalCode: pPostalCode,
        },
        financialDetails: {
          bankName: bankName,
          accountNumber: accountNumber,
          ifscCode: ifscCode,
          accountType: accountType,
          insurance: insurance,
          insuranceExpiryDate: insuranceExpiryDate || null,
        },
        employeeLanguageDetail: {
          empLanguageId: language,
        },
        educationDetails: inputRows.map((row) => ({
          educationId: row.educationId || 0, // Assuming educationId is available or default to 0
          instituteName: row.instituteName,
          courseId: row.courseName,
          educationBoardId: row.university,
          educationPercentage: row.percentage,
          educationYearOfPassing: row.passingYear,
          otherBoardsandUniversityName: row.otherUniversity,
        })),
        educationCertifications: certificationRows.map((row) => ({
          extraCertificateId: row.extraCertificateId || 0,
          extraCertificateTitle: row.certificationName,
          issuingOrganizatio: row.issuingOrganization,
          issuedDate: row.issuedDate,
          expirationDate: row.expirationDate,
          extraCertificateDescription: row.cdescription,
        })),
        educationAchievements: achievementsRows.map((row) => ({
          achievementsId: row.achievementsId || 0,
          achievementTitle: row.achievementTitle,
          achievementDescription: row.adescription,
        })),
        employeeCompanyDetails: inputExpRows.map((row) => ({
          employeeCompanyId: row.employeeCompanyId || 0,
          companyName: row.companyName,
          fromDate: row.cfromDate,
          toDate: row.ctoDate,
        })),
        employeeCompanyRoles,
        employeeProjectDetails: projectRows.map((row) => ({
          employeeProjectId: row.employeeProjectId || 0,
          projectName: row.projectName,
          projectRoleId: row.pRole,
          fromDate: row.fromDate,
          toDate: row.toDate,
          projectDescription: row.description,
        })),
        employeeSkillsTechnology: {
          skillId: selectedOptions1,
          technologyId: selectedOptions2,
          tool: tool,
        },

        employeeFamilyMedicalDetail: formRows.map((row, index) => ({
          name: row.name,
          isthatdependent: row.isDependent === "1" ? true : false,
          pwd: row.pwd === "1" ? true : false,
          description: row.description,
          bloodGroup: row.bloodGroup,
          employeeRelation: row.employeeRelation,
          familyMobileNo: row.familyMobileNo,
        })),

        empDocDetails: fileUploadRows.map((row) => {
          const hasFileName = row.file && row.file.name; // Check if row.file exists and has a name
          return {
            docId: row.docId || 0,
            docTypeId: row.documentType,
            docFileName: hasFileName
              ? row.file.name
              : row.file || row.docFileName,
            docPath: hasFileName ? row.file.name : row.file || row.docPath,
          };
        }),
      };

      updateFormData(payload);
    }
  };

  const updateFormData = async (formData) => {
    try {
      const response = await axios.post(
        `${baseURL}/EmployeeManagement/UpdateEmployee`,
        formData
      );
      if (response.data.success === true) {
        toast.success("Data Updated successfully!", {
          position: "top-center",
          closeButton: false,
          autoClose: 2000,
        });
        setIsEdit(false);
        setTimeout(() => {
          navigate("/employeedetails");
        }, 3000);
      } else {
        toast.error("Failed to update data. Please try again.", {
          position: "top-center",
          closeButton: false,
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error("An error occurred while submitting the form.");
    }
  };
  const validatePersonalDetails = () => {
    let isValid = true;

    isValid &= validateField(
      firstName,
      setFirstNameError,
      "Please Enter First Name"
    );
    isValid &= validateField(
      lastName,
      setLastNameError,
      "Please Enter Last Name"
    );
    isValid &= validateEmail(email, setEmailError);
    isValid &= validateField(dob, setDobError, "Please Select Date of Birth");
    isValid &= validateField(mobile, setMobileError, "Please Enter Mobile No.");
    isValid &= validateField(gender, setGenderError, "Please select a gender.");
    isValid &= validateField(
      maritalStatus,
      setMaritalStatusError,
      "Please select Marital Status."
    );
    isValid &= validateField(
      linkedin,
      setLinkedinError,
      "Please Enter LinkedIn."
    );
    isValid &= validateField(
      language,
      setLanguageError,
      "Please select a Language."
    );
    isValid &= validateField(
      cAddress1,
      setCaddress1Error,
      "Please Enter Address1"
    );
    // isValid &= validateField(cAddress2, setCaddress2Error, 'Please Enter Address2');
    isValid &= validateField(
      cCityTown,
      setCcityTownError,
      "Please Enter City/Town"
    );
    isValid &= validateField(
      cPostalCode,
      setCpostalCodeError,
      "Please Enter Postal Code"
    );
    isValid &= validateField(
      cCountry,
      setCcountryError,
      "Please Select Country"
    );
    isValid &= validateField(cState, setCstateError, "Please Select State");
    isValid &= validateField(
      pAddress1,
      setPaddress1Error,
      "Please Enter Address1"
    );
    // isValid &= validateField(pAddress2, setPaddress2Error, 'Please Enter Address2');
    isValid &= validateField(
      pCityTown,
      setPcityTownError,
      "Please Enter City/Town"
    );
    isValid &= validateField(
      pPostalCode,
      setPpostalCodeError,
      "Please Enter Postal Code"
    );
    isValid &= validateField(
      pCountry,
      setPcountryError,
      "Please Select Country"
    );
    isValid &= validateField(pState, setPstateError, "Please Select State");

    return !!isValid;
  };

  const handleAddRow = (type) => {
    const newRow =
      type === "input"
        ? {
            id: inputRows.length + 1,
            instituteName: "",
            courseName: "",
            university: "",
            percentage: "",
            passingYear: "",
          }
        : type === "certification"
        ? {
            id: certificationRows.length + 1,
            certificationName: "",
            issuingOrganization: "",
            issuedDate: "",
            expirationDate: "",
            description: "",
          }
        : {
            id: achievementsRows.length + 1,
            achievementTitle: "",
            adescription: "",
          };
    type === "input"
      ? setInputRows([...inputRows, newRow])
      : type === "certification"
      ? setCertificationRows([...certificationRows, newRow])
      : setAchievementsRows([...achievementsRows, newRow]);
  };
  // Handle remove row functions
  const handleRemoveRow = (index, type) => {
    const rows =
      type === "input"
        ? [...inputRows]
        : type === "certification"
        ? [...certificationRows]
        : [...achievementsRows];
    rows.splice(index, 1);
    type === "input"
      ? setInputRows(rows)
      : type === "certification"
      ? setCertificationRows(rows)
      : setAchievementsRows(rows);
    const newErrors = { ...errors };
    Object.keys(newErrors).forEach((key) => {
      if (key.endsWith(`-${index}`)) {
        delete newErrors[key];
      }
    });
    setErrors(newErrors);
  };
  const handlePersonalDetails = () => {
    if (validatePersonalDetails()) {
      setActiveTab(String(parseInt(activeTab) + 1));
      setTabData(false);
    }
  };
  const validateEducationalDetails = () => {
    const newErrors = {};
    inputRows.forEach((row, index) => {
      if (!row.instituteName)
        newErrors[`instituteName-${index}`] = "Institute Name is required";
      if (!row.courseName)
        newErrors[`courseName-${index}`] = "Course Name is required";
      if (!row.university)
        newErrors[`university-${index}`] = "University is required";
      if (!row.percentage)
        newErrors[`percentage-${index}`] = "Percentage/CGPA is required";
      if (!row.passingYear)
        newErrors[`passingYear-${index}`] = "Passing Year is required";
    });
    certificationRows.forEach((row, index) => {
      if (!row.certificationName)
        newErrors[`certificationName-${index}`] =
          "Certification Name is required";
      if (!row.issuingOrganization)
        newErrors[`issuingOrganization-${index}`] =
          "Issuing Organization is required";
      if (!row.issuedDate)
        newErrors[`issuedDate-${index}`] = "Issued Date is required";
      if (!row.expirationDate)
        newErrors[`expirationDate-${index}`] = "Expiration Date is required";
      if (!row.cdescription)
        newErrors[`cdescription-${index}`] = "Description is required";
    });
    achievementsRows.forEach((row, index) => {
      if (!row.achievementTitle)
        newErrors[`achievementTitle-${index}`] =
          "Achievement Title is required";
      if (!row.adescription)
        newErrors[`adescription-${index}`] = "Description is required";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleValidationFormEducation = () => {
    if (validateEducationalDetails()) {
      setActiveTab(String(parseInt(activeTab) + 1));
      setExpTab(false);
    }
  };

  const handleValidationExperienceForm = () => {
    if (validateExperienceDetails()) {
      setActiveTab(String(parseInt(activeTab) + 1));
      setFamTab(false);
    }
  };

  const [fileUploadRows, setFileUploadRows] = useState([
    { id: 1, documentType: "", file: null },
  ]);

  const handledocChangefile = (index, event) => {
    const newRows = [...fileUploadRows];
    newRows[index].documentType = event.target.value;
    setFileUploadRows(newRows);

    // Clear the error if a valid document type is selected
    const newErrors = { ...errors };
    if (newRows[index].documentType) {
      delete newErrors[`documentType-${index}`];
    }
    setErrors(newErrors);
  };

  const handleFileChange = (index, event) => {
    const newRows = [...fileUploadRows];
    newRows[index].file = event.target.files[0];
    setFileUploadRows(newRows);

    // Clear the error if a file is uploaded
    const newErrors = { ...errors };
    if (newRows[index].file) {
      delete newErrors[`file-${index}`];
    }
    setErrors(newErrors);
  };
  const [employeePicPath, setEmployeePicPath] = useState("");
  const [employeePicName, setEmployeePicName] = useState("");
  const [imageError, setImageError] = useState("");
  // Function to convert file to Base64
  // const handleImageChange = (event) => {
  //   const file = event.target.files[0];

  //   if (file) {
  //     const fileSizeInKB = file.size / 1024; // Convert bytes to KB
  //     if (fileSizeInKB < 1 || fileSizeInKB > 10) {
  //       setImageError("Image size should be between 1 and 10 KB");
  //       return;
  //     } else {
  //       setImageError(""); // Clear error if size is valid
  //     }

  //     setEmployeePicName(file.name);
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onloadend = () => {
  //       const base64String = reader.result;
  //       setEmployeePicPath(base64String); // Save Base64 image to state
  //     };
  //   }
  // };
  const validateImageField = (file, setError, errorMessage) => {
    if (!file) {
      setError(errorMessage);
      return false;
    }
  
    const fileSizeInKB = file.size / 1024;
    const fileType = file.type;
  
    if (fileSizeInKB < 1 || fileSizeInKB > 10) {
      setError("Image size should be between 1 and 10 KB.");
      return false;
    } else if (!["image/jpeg", "image/png"].includes(fileType)) {
      setError("Only JPEG and PNG formats are allowed.");
      return false;
    }
  
    setError("");
    return true;
  };
  const handleImageChange = (event) => {
    const file = event.target.files[0];
  
    const isValid = validateImageField(
      file,
      setImageError,
      "Please upload a valid image."
    );
  
    if (isValid) {
      setEmployeePicName(file.name);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64String = reader.result;
        setEmployeePicPath(base64String);
      };
    }
  };
  
  const handleFileUploadAddRow = () => {
    setFileUploadRows([
      ...fileUploadRows,
      { id: fileUploadRows.length + 1, documentType: "", file: null },
    ]);
  };

  const handleFileRemoveRow = (index) => {
    const newRows = fileUploadRows.filter((_, i) => i !== index);
    setFileUploadRows(newRows);
  };

  const [refreshData, setRefreshData] = useState(false);

  const empData = localStorage.getItem("empData");
  useEffect(() => {
    if (empData === "employeeList") {
      setTabData(false);
      setExpTab(false);
      setFamTab(false);
      setDocTab(false);
      localStorage.removeItem("empData");
    }
  }, [empData]);
  const userEdit = localStorage.getItem("userEdit");
  useEffect(() => {
    if (userEdit == "user" && empData == undefined) {
      navigate("/employeedetails");
      localStorage.removeItem("userEdit");
    }
  }, [userEdit]);

  
  const [data, setData] = useState([]);
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [loading, setLoading] = useState(true);
  const [designationError, setDesignationError] = useState();

  useEffect(() => {
    axios
      .get(baseURL + "/Designation/GetDesignations")
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const handleDesignationChange = (event) => {
    setSelectedDesignation(event.target.value);
  };
  

  const [departmentData, setDepartmentData] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [loadings, setLoadings] = useState(true);
  useEffect(() => {
    axios
      .get(baseURL + "/Department/GetAllDepartment")
      .then((response) => {
        setDepartmentData(response.data);
        setLoadings(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoadings(false);
      });
  }, []);

  const handleDepartmentChange = (event) => {
    setSelectedDept(event.target.value);
  };
  
  return (
    <Box sx={{ display: "flex" }} className="main-container ">
      <ToastContainer />
      <SideBar />
      <Box component="main" className="main-content" sx={{ flexGrow: 1 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Typography
                className="head-title"
                component="h1"
                variant="h6"
                align="left"
              >
                View List
              </Typography>
            </Grid>
            <Grid item xs={4} textAlign={"right"}>
              <div role="presentation" onClick={handleClick}>
                <Breadcrumbs
                  className="breadcrumbs-css"
                  aria-label="breadcrumb"
                  textAlign={"right"}
                  sx={{ mt: 1 }}
                >
                  <Link color="inherit" href="/">
                    Employee Management
                  </Link>
                  <Typography color="text.primary">Employee Form</Typography>
                </Breadcrumbs>
              </div>
            </Grid>
          </Grid>
        </Box>
        <Grid container spacing={2} sx={{ mt: -2 }}>
          <Grid item xs={12}>
            <form
              onSubmit={
                isEdit
                  ? handleUpdateTransactionMaster
                  : handleSubmitTransactionMaster
              }
              className="tondform-css form-card-css_2 form-validation-p"
            >
              <Box sx={{ width: "100%", typography: "body1" }}>
                <Card className="tab-font">
                  <TabContext value={activeTab}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <TabList
                        onChange={handleChangeTab}
                        aria-label="Transaction"
                        className="tab-button"
                      >
                        {/* <Tab label="Employee Details" value="1" /> */}
                        <Tab label="Personal Details" value="1" />
                        <Tab
                          label="Educational Details"
                          value="2"
                          disabled={tabData}
                        />
                        {/* <Tab label="Educational Details" value="2" /> */}
                        <Tab
                          label="Experience Details"
                          value="3"
                          disabled={expTab}
                        />
                        {/* <Tab label="Experience Details" value="3" /> */}
                        <Tab
                          label="Family and Medical Details"
                          value="4"
                          disabled={famTab}
                        />
                        {/* <Tab label="Family and Medical Details" value="4" /> */}
                        <Tab
                          label="Upload Documents"
                          value="5"
                          disabled={docTab}
                        />
                        {/* <Tab label="Upload Documents" value="5" /> */}
                      </TabList>
                    </Box>
                    <TabPanel value="1">
                      <Grid container className="inner-card">
                        <Typography
                          variant="h5"
                          className="title-b"
                          sx={{ mb: 2 }}
                        >
                          Basic Information
                        </Typography>

                        <Grid item xs={4} sx={{ mt: 1, mb: 0, pl: 0, pr: 0 }}>
                          {/* <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>First Name</DialogTitle> */}
                          <TextField
                          disabled
                            fullWidth
                            id="firstename"
                            label="First Name*"
                            variant="outlined"
                            value={firstName}
                            onChange={handleFirstNameChange}
                          />
                          {firstNameError && (
                            <Typography variant="body2" color="error">
                              {firstNameError}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={4} sx={{ mt: 1, mb: 0, pl: 2, pr: 0 }}>
                          {/* <DialogTitle sx={{ pl: 0, pr: 0, pt: 0 }}>Middle Name</DialogTitle> */}
                          <TextField
                          disabled
                            fullWidth
                            id="middle-name"
                            label="Middle Name"
                            value={middleName}
                            onChange={(e) => setMiddleName(e.target.value)} // assuming you have a setMiddleName function to update the state
                          />
                        </Grid>
                        <Grid item xs={4} sx={{ mt: 1, mb: 0, pl: 2, pr: 0 }}>
                          {/* <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>Last Name</DialogTitle> */}
                          <TextField
                          disabled
                            fullWidth
                            labelId="last-name"
                            id="last-name"
                            label="Last Name*"
                            value={lastName}
                            onChange={handleLastNameChange}
                          />
                          {lastNameError && (
                            <Typography variant="body2" color="error">
                              {lastNameError}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={4} sx={{ mt: 3, mb: 0, pl: 0, pr: 0 }}>
                          {/* <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>Email</DialogTitle> */}
                          <TextField
                          disabled
                            fullWidth
                            label="Email*"
                            id="Email"
                            variant="outlined"
                            type="text"
                            value={email}
                            onChange={handleEmailChange}
                          />
                          {emailError && (
                            <Typography variant="body2" color="error">
                              {emailError}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={4} sx={{ mt: 3, mb: 0, pl: 2, pr: 0 }}>
                        <TextField
                        disabled
                            fullWidth
                            id="dateofbirth"
                            variant="outlined"
                            type="date"
                            label="DOB*"
                            value={dob}
                            onChange={handleDobChange}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            inputProps={{
                              max: today, // Disable future dates
                            }}
                          />
                          {dobError && (
                            <Typography variant="body2" color="error">
                              {dobError}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={4} sx={{ mt: 3, mb: 0, pl: 2, pr: 0 }}>
                          {/* <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>Mobile Number</DialogTitle> */}
                          <TextField
                          disabled
                            fullWidth
                            id="mobilenumber"
                            variant="outlined"
                            type="text"
                            label="Mobile Number*"
                            value={mobile}
                            onChange={handleMobileChange}
                          />
                          {mobileError && (
                            <Typography variant="body2" color="error">
                              {mobileError}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={4} sx={{ mt: 3, mb: 0, pl: 0, pr: 0 }}>
                          <DialogTitle sx={{ pl: 0, pr: 0, pt: 0 }}>
                            Gender*
                          </DialogTitle>
                          <FormControl component="fieldset">
                            <RadioGroup
                            
                              aria-label="yes-no-gender"
                              name="gender"
                              value={gender}
                              onChange={handleGenderChange}
                              className="flowys"
                            >
                              <FormControlLabel
                              disabled
                                value="1"
                                control={<Radio />}
                                label="Male"
                              />
                              <FormControlLabel
                              disabled
                                value="2"
                                control={<Radio />}
                                label="Female"
                              />
                            </RadioGroup>
                            {genderError && (
                              <Typography variant="body2" color="error">
                                {genderError}
                              </Typography>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={4} sx={{ mt: 3, mb: 0, pl: 2, pr: 0 }}>
                          <DialogTitle sx={{ pl: 0, pr: 0, pt: 0 }}>
                            Marital Status*
                          </DialogTitle>
                          <FormControl component="fieldset">
                            <RadioGroup
                              aria-label="yes-no-gender"
                              name="marital_status"
                              value={maritalStatus}
                              onChange={handleMaritalStatusChange}
                              className="flowys"
                            >
                              <FormControlLabel
                              disabled
                                value="1"
                                control={<Radio />}
                                label="Married"
                              />
                              <FormControlLabel
                              disabled
                                value="2"
                                control={<Radio />}
                                label="Unmarried"
                              />
                            </RadioGroup>
                            {maritalStatusError && (
                              <Typography variant="body2" color="error">
                                {maritalStatusError}
                              </Typography>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={4} sx={{ mt: 3, mb: 0, pl: 2, pr: 0 }}>
                          {/* <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>Linkedin </DialogTitle> */}
                          <TextField
                          disabled
                            fullWidth
                            label="Linkedin"
                            id="Linkedin "
                            variant="outlined"
                            value={linkedin}
                            onChange={handleLinkedInChange}
                          />
                        </Grid>
                        <Grid item xs={4} sx={{ mt: 3, mb: 1, pl: 0, pr: 0 }}>
                          {/* <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>Language</DialogTitle> */}
                          <FormControl fullWidth>
                            <InputLabel id="language">
                              Select Language
                            </InputLabel>
                            <Select
                            disabled
                              labelId="language"
                              id="language"
                              multiple
                              value={language}
                              onChange={handleLanguageChange}
                              input={<OutlinedInput label="Select Language" />}
                              renderValue={(selected) => (
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 0.5,
                                  }}
                                >
                                  {selected.map((value) => {
                                    const option = options1.find(
                                      (option) => option.id === value
                                    );
                                    return option ? (
                                      <Chip
                                        key={option.id}
                                        label={option.name}
                                      />
                                    ) : null;
                                  })}
                                </Box>
                              )}
                            >
                              {options1.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                  <Checkbox
                                    checked={language.indexOf(option.id) > -1}
                                  />
                                  <ListItemText primary={option.name} />
                                </MenuItem>
                              ))}
                            </Select>
                            {languageError && (
                              <Typography variant="body2" color="error">
                                {languageError}
                              </Typography>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={4} sx={{ mt: 3, mb: 0, pl: 2, pr: 0 }}>
                          <FormControl fullWidth>
                            <InputLabel id="designation-label">
                              Select Designation
                            </InputLabel>
                            <Select
                            disabled
                              labelId="designation-label"
                              id="designation"
                              label="Select Designation"
                              value={selectedDesignation}
                              onChange={handleDesignationChange}
                            >
                              {loading ? (
                                <MenuItem disabled>Loading...</MenuItem>
                              ) : (
                                data.map((row) => (
                                  <MenuItem
                                    key={row.designationId}
                                    value={row.designationId}
                                  >
                                    {row.designationName}
                                  </MenuItem>
                                ))
                              )}
                            </Select>
                            {designationError && (
                              <Typography variant="body2" color="error">
                                {designationError}
                              </Typography>
                            )}
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sx={{ mt: 3, mb: 0, pl: 2, pr: 0 }}>
                          <FormControl fullWidth>
                            <InputLabel id="designation-label">
                              Select Department
                            </InputLabel>
                            <Select
                            disabled
                              labelId="designation-label"
                              id="designation"
                              label="Select Department"
                              value={selectedDept}
                              onChange={handleDepartmentChange}
                            >
                              {loading ? (
                                <MenuItem disabled>Loading...</MenuItem>
                              ) : (
                                departmentData.map((row) => (
                                  <MenuItem
                                    key={row.departmentId}
                                    value={row.departmentId}
                                  >
                                    {row.departmentName}
                                  </MenuItem>
                                ))
                              )}
                            </Select>
                            {designationError && (
                              <Typography variant="body2" color="error">
                                {designationError}
                              </Typography>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={4} sx={{ mt: 3, mb: 0, pl: 0, pr: 0 }}>
                          <DialogTitle>Upload Profile Picture</DialogTitle>
                          <Box className = "upload-pf-section">
                          <TextField
                          disabled
                            fullWidth
                            type="file"
                            onChange={handleImageChange} 
                            error={!!imageError} 
                            helperText={imageError} 
                          /> 
                          <> { updateData.length>0 ? <div className="input-file-upload-img">
                          
                          {updateData.employeePicName}
                          </div>
                          :
                          <div className="input-file-upload-img">
                          
                          {employeePicName}
                          </div>
 } </>


                          </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ mt: 3, mb: 0, pl: 2, pr: 0 }}>
                          <DialogTitle>Insurance</DialogTitle>
                          <FormControl component="fieldset">
                            <RadioGroup
                              aria-label="yes-no-insurance"
                              name="insurance"
                              value={insurance} // Pass boolean state directly
                              onChange={handleinsuranceChange}
                              className="flowys"
                            >
                              <FormControlLabel
                              disabled
                                value={true} // Boolean value for Yes
                                control={<Radio />}
                                label="Yes"
                              />
                              <FormControlLabel
                              disabled
                                value={false} // Boolean value for No
                                control={<Radio />}
                                label="No"
                              />
                            </RadioGroup>
                            {insuranceError && (
                              <Typography variant="body2" color="error">
                                {insuranceError}
                              </Typography>
                            )}
                          </FormControl>
                        </Grid>

                        <Grid item xs={4} sx={{ mt: 3, mb: 0, pl: 2, pr: 0 }}>
                          <DialogTitle>Insurance Expiry Date</DialogTitle>

                          <TextField
                          disabled
                            fullWidth
                            //disabled ={insCalendar}
                            id="insuranceExpiryDate"
                            type="date"
                            variant="outlined"
                            value={formattedDate} // Ensure the correct format
                            onChange={handleinsuranceExpiryDateChange}
                          />
                          {insuranceExpiryDateError && (
                            <Typography variant="body2" color="error">
                              {insuranceExpiryDateError}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>

                      <Grid container className="inner-card">
                        <Typography
                          variant="h5"
                          className="title-b"
                          sx={{ mb: 2, mt: 0 }}
                        >
                          Address Details
                        </Typography>
                        <Typography
                          variant="h5"
                          className="title-c"
                          sx={{ mt: 1 }}
                        >
                          Current Address*
                        </Typography>
                        <Grid item xs={6} sx={{ mt: 3, mb: 0, pl: 0, pr: 0 }}>
                          {/* <DialogTitle sx={{ pl: 0, pr: 0, pt: 2, }}>Address Line 1</DialogTitle> */}
                          <TextField
                          disabled
                            fullWidth
                            id="Address1"
                            label="Address Line 1*"
                            variant="outlined"
                            // placeholder="Address Line 1"
                            value={cAddress1}
                            onChange={handleCaddress1Change}
                          />
                          {cAddress1Error && (
                            <Typography variant="body2" color="error">
                              {cAddress1Error}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 3, mb: 0, pl: 2, pr: 0 }}>
                          {/* <DialogTitle sx={{ pl: 0, pr: 0, pt: 2, }}>Address Line 2</DialogTitle> */}
                          <TextField
                          disabled
                            fullWidth
                            id="Address2"
                            label="Address Line 2*"
                            variant="outlined"
                            // placeholder="Address Line 2"
                            value={cAddress2}
                            onChange={handleCaddress2Change}
                          />
                          {/* {cAddress2Error && (
                            <Typography variant="body2" color="error">
                              {cAddress2Error}
                            </Typography>
                          )} */}
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 3, mb: 0, pl: 0, pr: 0 }}>
                          {/* <DialogTitle sx={{ pl: 0, pr: 0 }}>Country</DialogTitle> */}
                          <FormControl fullWidth>
                            <InputLabel id="role-name-label">
                              Select Country*
                            </InputLabel>
                            <Select
                            disabled
                              labelId="Country"
                              id="Country"
                              label="Select Country*"
                              value={cCountry}
                              onChange={handleCcountryChange}
                            >
                              {countryName.map((country) => (
                                <MenuItem key={country.name} value={country.id}>
                                  {country.name}
                                </MenuItem>
                              ))}
                            </Select>
                            {cCountryError && (
                              <Typography variant="body2" color="error">
                                {cCountryError}
                              </Typography>
                            )}
                          </FormControl>
                        </Grid>

                        <Grid item xs={6} sx={{ mt: 3, mb: 0, pl: 2, pr: 0 }}>
                          {/* <DialogTitle sx={{ pl: 0, pr: 0 }}>State</DialogTitle> */}
                          <FormControl fullWidth>
                            <InputLabel id="role-name-label">
                              Select State*
                            </InputLabel>
                            <Select
                            disabled
                              labelId="State"
                              id="State"
                              label="Select State*"
                              value={cState}
                              onChange={handleCstateChange}
                            >
                              {Array.isArray(stateName) &&
                              stateName.length > 0 ? (
                                stateName.map((state) => (
                                  <MenuItem
                                    key={state.stateId}
                                    value={state.stateId}
                                  >
                                    {state.stateText}
                                  </MenuItem>
                                ))
                              ) : (
                                <MenuItem value="" disabled>
                                  No states available
                                </MenuItem>
                              )}
                            </Select>
                            {cStateError && (
                              <Typography variant="body2" color="error">
                                {cStateError}
                              </Typography>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 3, mb: 0, pl: 0, pr: 0 }}>
                          {/* <DialogTitle sx={{ pl: 0, pr: 0 }}>City/Town </DialogTitle> */}
                          <FormControl fullWidth>
                            <InputLabel id="role-name-label">
                              Select City/Town *
                            </InputLabel>
                            <Select
                            disabled
                              labelId="State"
                              id="State"
                              value={cCityTown}
                              label="Select City/Town* "
                              onChange={handleCcityTownChange}
                            >
                              {Array.isArray(selectedCity) &&
                              selectedCity.length > 0 ? (
                                selectedCity.map((city) => (
                                  <MenuItem
                                    key={city.cityId}
                                    value={city.cityId}
                                  >
                                    {city.cityText}
                                  </MenuItem>
                                ))
                              ) : (
                                <MenuItem value="" disabled>
                                  No states available
                                </MenuItem>
                              )}
                            </Select>
                            {cCityTownError && (
                              <Typography variant="body2" color="error">
                                {cCityTownError}
                              </Typography>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 3, mb: 0, pl: 2, pr: 0 }}>
                          {/* <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>Postal Code </DialogTitle> */}
                          <TextField
                          disabled
                            fullWidth
                            id="Postal"
                            label="Postal Code*"
                            variant="outlined"
                            value={cPostalCode}
                            onChange={handleCpostalCodeChange}
                          />
                          {cPostalCodeError && (
                            <Typography variant="body2" color="error">
                              {cPostalCodeError}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                      <Grid container className="inner-card">
                        <Typography
                          variant="h5"
                          className="title-c"
                          sx={{ mb: 0, mt: 0 }}
                        >
                          Permanent Address*
                        </Typography>
                        <Grid item xs={12}>
                          <Box className="same-as-section">
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={sameAsCurrent}
                                  //onChange={handleCopyAddress}
                                />
                              }
                            />
                            <span className="same-current-text">
                              Same as Current Address
                            </span>
                          </Box>
                        </Grid>
                        {/* <Grid item xs={12} sx={{ mb: 0, pl: 0, pr: 0., }}>
                          <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>Copy As above </DialogTitle>
                          <Checkbox
                            fullWidth
                          />
                        </Grid> */}
                        <Grid item xs={6} sx={{ mt: 3, mb: 0, pl: 0, pr: 0 }}>
                          {/* <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>Address Line 1</DialogTitle> */}
                          <TextField
                          disabled
                            fullWidth
                            id="Address1"
                            label="Address Line 1*"
                            variant="outlined"
                            // placeholder="Address Line 1"
                            value={pAddress1}
                            onChange={handlePaddress1Change}
                          />
                          {pAddress1Error && (
                            <Typography variant="body2" color="error">
                              {pAddress1Error}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 3, mb: 0, pl: 2, pr: 0 }}>
                          {/* <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>Address Line 2</DialogTitle> */}
                          <TextField
                          disabled
                            fullWidth
                            id="Address2"
                            label="Address Line 2"
                            variant="outlined"
                            // placeholder="Address Line 2"
                            value={pAddress2}
                            onChange={handlePaddress2Change}
                          />
                          {/* {pAddress2Error && (
                            <Typography variant="body2" color="error">
                              {pAddress2Error}
                            </Typography>
                          )} */}
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 3, mb: 0, pl: 0, pr: 0 }}>
                          {/* <DialogTitle sx={{ pl: 0, pr: 0 }}>Country</DialogTitle> */}
                          <FormControl fullWidth>
                            <InputLabel id="role-name-label">
                              Select Country*
                            </InputLabel>
                            <Select
                            disabled
                              labelId="Country"
                              id="Country"
                              label="Select Country*"
                              value={pCountry}
                              onChange={handlePcountryChange}
                            >
                              {countryName.map((country) => (
                                <MenuItem key={country.name} value={country.id}>
                                  {country.name}
                                </MenuItem>
                              ))}
                            </Select>
                            {pCountryError && (
                              <Typography variant="body2" color="error">
                                {pCountryError}
                              </Typography>
                            )}
                          </FormControl>
                        </Grid>

                        <Grid item xs={6} sx={{ mt: 3, mb: 0, pl: 2, pr: 0 }}>
                          {/* <DialogTitle sx={{ pl: 0, pr: 0 }}>State</DialogTitle> */}
                          <FormControl fullWidth>
                            <InputLabel id="role-name-label">
                              Select State*
                            </InputLabel>
                            <Select
                            disabled
                              labelId="State"
                              id="State"
                              label="Select State*"
                              value={pState}
                              onChange={handlePstateChange}
                            >
                              {Array.isArray(stateName) &&
                              stateName.length > 0 ? (
                                stateName.map((state) => (
                                  <MenuItem
                                    key={state.stateId}
                                    value={state.stateId}
                                  >
                                    {state.stateText}
                                  </MenuItem>
                                ))
                              ) : (
                                <MenuItem value="" disabled>
                                  No states available
                                </MenuItem>
                              )}
                            </Select>
                            {pStateError && (
                              <Typography variant="body2" color="error">
                                {pStateError}
                              </Typography>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 3, mb: 0, pl: 0, pr: 0 }}>
                          {/* <DialogTitle sx={{ pl: 0, pr: 0 }}>City/Town </DialogTitle> */}
                          <FormControl fullWidth>
                            <InputLabel id="role-name-label">
                              Select City/Town *
                            </InputLabel>
                            <Select
                            disabled
                              labelId="State"
                              id="State"
                              label="Select City/Town* "
                              value={pCityTown}
                              onChange={handlePcityTownChange}
                            >
                              {Array.isArray(selectedCity) &&
                              selectedCity.length > 0 ? (
                                selectedCity.map((city) => (
                                  <MenuItem
                                    key={city.cityId}
                                    value={city.cityId}
                                  >
                                    {city.cityText}
                                  </MenuItem>
                                ))
                              ) : (
                                <MenuItem value="" disabled>
                                  No states available
                                </MenuItem>
                              )}
                            </Select>
                            {pCityTownError && (
                              <Typography variant="body2" color="error">
                                {pCityTownError}
                              </Typography>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 3, mb: 0, pl: 2, pr: 0 }}>
                          {/* <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>Postal Code </DialogTitle> */}
                          <TextField
                          disabled
                            fullWidth
                            id="Postal"
                            label="Postal Code*"
                            variant="outlined"
                            value={pPostalCode}
                            onChange={handlePpostalCodeChange}
                          />
                          {pPostalCodeError && (
                            <Typography variant="body2" color="error">
                              {pPostalCodeError}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                      <Grid container className="inner-card">
                        <Typography
                          variant="h5"
                          className="title-b"
                          sx={{ mb: 0, mt: 0 }}
                        >
                          Financial Details
                        </Typography>
                        <Grid item xs={6} sx={{ mt: 3, mb: 0, pl: 0, pr: 0 }}>
                          {/* <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>Bank Name</DialogTitle> */}
                          <TextField
                          disabled
                            fullWidth
                            id="Bank"
                            label="Bank Name"
                            variant="outlined"
                            value={bankName}
                            onChange={handleBankNameChange}
                          />
                          {bankNameError && (
                            <Typography variant="body2" color="error">
                              {bankNameError}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 3, mb: 0, pl: 2, pr: 0 }}>
                          {/* <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>Account Number</DialogTitle> */}
                          {/* <TextField
                            fullWidth
                            id="Account"
                            label="Account Number"
                            variant="outlined"
                            value={accountNumber}
                            onChange={handleAccountNumberChange}
                          />
                          {accountNumberError && (
                            <Typography variant="body2" color="error">
                              {accountNumberError}
                            </Typography>
                          )} */}
                          <TextField
                          disabled
                            fullWidth
                            id="Account"
                            label="Account Number"
                            variant="outlined"
                            value={accountNumber}
                            onChange={handleAccountNumberChange}
                            error={!!accountNumberError}
                            helperText={!accountNumberError}
                            inputProps={{ maxLength: 17 }} // Prevent input beyond 17 characters
                          />
                          {accountNumberError && (
                            <Typography variant="body2" color="error">
                              {accountNumberError}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 3, mb: 0, pl: 0, pr: 0 }}>
                          {/* <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>IFSC Code</DialogTitle> */}
                          <TextField
                          disabled
                            fullWidth
                            id="IFSC"
                            label="IFSC"
                            variant="outlined"
                            value={ifscCode}
                            onChange={handleIFSCCodeChange}
                          />
                          {ifscCodeError && (
                            <Typography variant="body2" color="error">
                              {ifscCodeError}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 3, mb: 0, pl: 2, pr: 0 }}>
                          {/* <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>Account Type</DialogTitle> */}
                          <FormControl fullWidth>
                            {/* <InputLabel id="role-name-label">Account Type </InputLabel> */}
                            <Select
                            disabled
                              labelId="Account Type"
                              id="Account Type"
                              // label="Account Type"
                              value={accountType}
                              onChange={handleAccountTypeChange}
                            >
                              {" "}
                              <MenuItem value={0}>Select Account Type</MenuItem>
                              <MenuItem value={1}>Saving</MenuItem>
                              <MenuItem value={2}>Current</MenuItem>
                              <MenuItem value={3}>Salary</MenuItem>
                            </Select>
                            {accountTypeError && (
                              <Typography variant="body2" color="error">
                                {accountTypeError}
                              </Typography>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sx={{ mb: 0, pl: 0, pr: 0, mt: 3 }}
                          textAlign={"right"}
                        >
                          <Button
                            variant="contained"
                            onClick={handlePersonalDetails}
                            className="primary"
                            type="submit"
                            sx={{ mt: 0 }}
                          >
                            Next
                          </Button>
                        </Grid>
                      </Grid>
                    </TabPanel>
                    <TabPanel value="2">
                      <Grid container>
                        <Typography
                          variant="h5"
                          className="title-b"
                          sx={{ mb: 2 }}
                        >
                          Education Information
                        </Typography>
                      </Grid>
                      <Box>
                        <Grid
                          container
                          alignItems="center"
                          className="table-header-grid"
                        >
                          <Grid
                            item
                            xs={1}
                            style={{ textAlign: "center" }}
                            className="grid-column-style"
                          >
                            <DialogTitle>S.No</DialogTitle>
                          </Grid>
                          <Grid item xs={2} className="grid-column-style">
                            <DialogTitle>Institute Name*</DialogTitle>
                          </Grid>
                          <Grid item xs={2} className="grid-column-style">
                            <DialogTitle>Course Name*</DialogTitle>
                          </Grid>
                          <Grid item xs={2} className="grid-column-style">
                            <DialogTitle>Board/University*</DialogTitle>
                          </Grid>
                          <Grid item xs={2} className="grid-column-style">
                            <DialogTitle>Percentage/CGPA*</DialogTitle>
                          </Grid>
                          <Grid item xs={2} className="grid-column-style">
                            <DialogTitle>Passing Year*</DialogTitle>
                          </Grid>
                          <Grid item xs={1} className="grid-column-style">
                            <DialogTitle>Actions*</DialogTitle>
                          </Grid>
                        </Grid>
                        {inputRows.map((row, index) => (
                          <Grid
                            container
                            spacing={1}
                            alignItems="center"
                            key={row.id}
                            className="input-row"
                          >
                            <Grid item xs={1}>
                              <Typography className="serial-number">
                                {index + 1}
                              </Typography>
                            </Grid>
                            <Grid item xs={2}>
                              <TextField
                              disabled
                                fullWidth
                                id={`institutename-${index}`}
                                label="Institute Name*"
                                variant="outlined"
                                value={row.instituteName}
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    "instituteName",
                                    e.target.value,
                                    "input"
                                  )
                                }
                                error={!!errors[`instituteName-${index}`]}
                                helperText={errors[`instituteName-${index}`]}
                              />
                            </Grid>
                            <Grid item xs={2}>
                              <FormControl
                                fullWidth
                                error={!!errors[`courseName-${index}`]}
                              >
                                <InputLabel id={`course-name-${index}`}>
                                  Select Course*
                                </InputLabel>
                                <Select
                                disabled
                                  labelId={`course-name-${index}`}
                                  id={`course-name-${index}`}
                                  value={row.courseName}
                                  label="Course Name*"
                                  onChange={(e) =>
                                    handleChange(
                                      index,
                                      "courseName",
                                      e.target.value,
                                      "input"
                                    )
                                  }
                                >
                                  {courseName.map((course) => (
                                    <MenuItem
                                      key={course.courseId}
                                      value={course.courseId}
                                    >
                                      {course.courseName}
                                    </MenuItem>
                                  ))}
                                </Select>
                                <FormHelperText>
                                  {errors[`courseName-${index}`]}
                                </FormHelperText>
                              </FormControl>
                            </Grid>
                            <Grid item xs={2}>
                              {checkUniv.boardName
 == "Other" &&
                              row.university == "99999" ? (
                                <TextField
                                disabled
                                  fullWidth
                                  //labelId={`board-name-${index}`}
                                  value={row.otherUniversity}
                                  label="Select University*"
                                  onChange={(e) =>
                                    handleChange(
                                      index,
                                      "otherUniversity",
                                      e.target.value,
                                      "input"
                                    )
                                  }
                                />
                              ) : (
                                <FormControl
                                  fullWidth
                                  error={!!errors[`university-${index}`]}
                                >
                                  <InputLabel>Select University*</InputLabel>
                                  <Select
                                  disabled
                                    // labelId={`board-name-${index}`}
                                    // id={`board-name-${index}`}
                                    value={row.university}
                                    label="Select University*"
                                    onChange={(e) =>
                                      handleChange(
                                        index,
                                        "university",
                                        e.target.value,
                                        "input"
                                      )
                                    }
                                  >
                                    {boardName.map((board) => (
                                      <MenuItem
                                        key={board.boardId}
                                        value={board.boardId}
                                      >
                                        {board.boardName}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                  <FormHelperText>
                                    {errors[`university-${index}`]}
                                  </FormHelperText>
                                </FormControl>
                              )}
                            </Grid>
                            <Grid item xs={2}>
                              <TextField
                              disabled
                                fullWidth
                                label="Percentage/CGPA*"
                                id={`percentage-${index}`}
                                variant="outlined"
                                value={row.percentage}
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    "percentage",
                                    e.target.value,
                                    "input"
                                  )
                                }
                                error={!!errors[`percentage-${index}`]}
                                helperText={errors[`percentage-${index}`]}
                              />
                            </Grid>
                            <Grid item xs={2}>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                disabled
                                  views={["year"]}
                                  label="Passing Year*"
                                  value={dayjs(row.passingYear)}
                                  maxDate={dayjs()}
                                  onChange={(newValue) =>
                                    handleChange(
                                      index,
                                      "passingYear",
                                      dayjs(newValue).format("YYYY-MM-DD"),
                                      "input"
                                    )
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                    disabled
                                      {...params}
                                      fullWidth
                                      id={`passingyear-${index}`}
                                      variant="outlined"
                                      error={false}
                                      // error={!!errors[`passingYear-${index}`]}
                                      helperText={
                                        errors[`passingYear-${index}`]
                                      }
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            </Grid>
                            <Grid item xs={1} className="flex-center" >
                              {index === inputRows.length - 1 ? (
                                <>
                                  {/* <div
                                    className="icon-btn-plus"
                                    onClick={() => handleAddRow("input")}
                                  > */}
                                  <AddCircleIcon
                                    className="plus-ic"
                                    //onClick={() => handleAddRow("input")}
                                  />
                                  {/* </div> */}
                                  {index > 0 && (
                                    <RemoveCircleIcon
                                    
                                      // onClick={() =>
                                      //   handleRemoveRow(index, "input")
                                      // }
                                      className="minus-ic"
                                    />
                                  )}
                                </>
                              ) : (
                                <RemoveCircleIcon
                                disabled
                                  // onClick={() =>
                                  //   handleRemoveRow(index, "input")
                                  // }
                                  className="minus-ic"
                                />
                              )}
                            </Grid>
                          </Grid>
                        ))}
                      </Box>
                      <Grid container>
                        <Typography
                        disabled
                          variant="h5"
                          className="title-b"
                          sx={{ mb: 2 }}
                        >
                          Certification*
                        </Typography>
                      </Grid>
                      <Box>
                        <Grid
                          container
                          alignItems="center"
                          className="table-header-grid"
                        >
                          <Grid
                            item
                            xs={1}
                            style={{ textAlign: "center" }}
                            className="grid-column-style"
                          >
                            <DialogTitle>S.No</DialogTitle>
                          </Grid>
                          <Grid item xs={2} className="grid-column-style">
                            <DialogTitle>Certification Name*</DialogTitle>
                          </Grid>
                          <Grid item xs={2} className="grid-column-style">
                            <DialogTitle>Issuing Organization*</DialogTitle>
                          </Grid>
                          <Grid item xs={2} className="grid-column-style">
                            <DialogTitle>Issued Date*</DialogTitle>
                          </Grid>
                          <Grid item xs={2} className="grid-column-style">
                            <DialogTitle>Expiration Date*</DialogTitle>
                          </Grid>
                          <Grid item xs={2} className="grid-column-style">
                            <DialogTitle>Description or Details*</DialogTitle>
                          </Grid>
                          <Grid item xs={1} className="grid-column-style">
                            <DialogTitle>Actions*</DialogTitle>
                          </Grid>
                        </Grid>
                        {certificationRows.map((row, index) => (
                          <Grid

                            container
                            spacing={1}
                            alignItems="center"
                            key={row.id}
                            className="input-row"
                          >
                            <Grid item xs={1}>
                              <Typography className="serial-number">
                                {index + 1}
                              </Typography>
                            </Grid>
                            <Grid item xs={2}>
                              <TextField
                              disabled
                                fullWidth
                                id={`certificationname-${index}`}
                                label="Certification Name*"
                                variant="outlined"
                                value={row.certificationName}
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    "certificationName",
                                    e.target.value,
                                    "certification"
                                  )
                                }
                                error={!!errors[`certificationName-${index}`]}
                                helperText={
                                  errors[`certificationName-${index}`]
                                }
                              />
                            </Grid>
                            <Grid item xs={2}>
                              <TextField
                              disabled
                                fullWidth
                                id={`issuingorganization-${index}`}
                                label="Issuing Organization*"
                                variant="outlined"
                                value={row.issuingOrganization}
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    "issuingOrganization",
                                    e.target.value,
                                    "certification"
                                  )
                                }
                                error={!!errors[`issuingOrganization-${index}`]}
                                helperText={
                                  errors[`issuingOrganization-${index}`]
                                }
                              />
                            </Grid>
                            <Grid item xs={2}>
                              <TextField
                              disabled
                                fullWidth
                                id={`issueddate-${index}`}
                                variant="outlined"
                                type="date"
                                value={row.issuedDate}
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    "issuedDate",
                                    e.target.value,
                                    "certification"
                                  )
                                }
                                error={!!errors[`issuedDate-${index}`]}
                                helperText={errors[`issuedDate-${index}`]}
                              />
                            </Grid>
                            <Grid item xs={2}>
                              {/* <TextField
                                fullWidth
                                id={`expirationdate-${index}`}
                                variant="outlined"
                                type='date'
                                value={row.expirationDate}
                                onChange={(e) => handleChange(index, 'expirationDate', e.target.value, 'certification')}
                                error={!!errors[`expirationDate-${index}`]}
                                helperText={errors[`expirationDate-${index}`]}
                              /> */}
                              <TextField
                                disabled
                                fullWidth
                                id={`expirationdate-${index}`}
                                variant="outlined"
                                type="date"
                                value={row.expirationDate}
                                InputProps={{
                                  inputProps: {
                                    min: row.issuedDate
                                      ? new Date(
                                          new Date(row.issuedDate).getTime() +
                                            86400000
                                        )
                                          .toISOString()
                                          .split("T")[0]
                                      : undefined,
                                  },
                                }}
                                //disabled={!row.issuedDate}
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    "expirationDate",
                                    e.target.value,
                                    "certification"
                                  )
                                }
                                error={!!errors[`expirationDate-${index}`]}
                                helperText={errors[`expirationDate-${index}`]}
                              />
                            </Grid>
                            <Grid item xs={2}>
                              <TextField
                              disabled
                                fullWidth
                                // multiline
                                minRows={0}
                                id={`descriptiondetails-${index}`}
                                placeholder="Description or Details"
                                variant="outlined"
                                value={row.cdescription}
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    "cdescription",
                                    e.target.value,
                                    "certification"
                                  )
                                }
                                error={!!errors[`cdescription-${index}`]}
                                helperText={errors[`cdescription-${index}`]}
                              />
                            </Grid>
                            <Grid item xs={1} className="flex-center">
                              {index === certificationRows.length - 1 ? (
                                <>
                                  {/* <div
                                    className="icon-btn-plus"
                                    onClick={() =>
                                      handleAddRow("certification")
                                    }
                                  >
                                    <AddIcon />
                                  </div> */}
                                  <AddCircleIcon
                                    className="plus-ic"
                                    // onClick={() =>
                                    //   handleAddRow("certification")
                                    // }
                                  />
                                  {index > 0 && (
                                    // <div
                                    //   className="icon-btn-minus"
                                    //   onClick={() =>
                                    //     handleRemoveRow(index, "certification")
                                    //   }
                                    // >
                                    //   <RemoveIcon />
                                    // </div>
                                    <RemoveCircleIcon
                                      // onClick={() =>
                                      //   handleRemoveRow(index, "certification")
                                      // }
                                      className="minus-ic"
                                    />
                                  )}
                                </>
                              ) : (
                                // <div
                                //   className="icon-btn-minus"
                                //   onClick={() =>
                                //     handleRemoveRow(index, "certification")
                                //   }
                                // >
                                //   <RemoveIcon />
                                // </div>
                                <RemoveCircleIcon
                                  // onClick={() =>
                                  //   handleRemoveRow(index, "certification")
                                  // }
                                  className="minus-ic"
                                />
                              )}
                            </Grid>
                          </Grid>
                        ))}
                      </Box>
                      <Grid container>
                        <Typography
                          variant="h5"
                          className="title-b"
                          sx={{ mb: 2 }}
                        >
                          Achievement*
                        </Typography>
                      </Grid>
                      <Box>
                        <Grid
                          container
                          alignItems="center"
                          className="table-header-grid"
                        >
                          <Grid
                            item
                            xs={1}
                            style={{ textAlign: "center" }}
                            className="grid-column-style"
                          >
                            <DialogTitle>S.No</DialogTitle>
                          </Grid>
                          <Grid item xs={5} className="grid-column-style">
                            <DialogTitle>Achievement Title*</DialogTitle>
                          </Grid>
                          <Grid item xs={5} className="grid-column-style">
                            <DialogTitle>Description*</DialogTitle>
                          </Grid>
                          <Grid item xs={1} className="grid-column-style">
                            <DialogTitle>Action*</DialogTitle>
                          </Grid>
                        </Grid>
                        {achievementsRows.map((row, index) => (
                          <Grid
                            container
                            spacing={1}
                            alignItems="center"
                            key={row.id}
                            className="input-row"
                          >
                            <Grid item xs={1}>
                              <Typography className="serial-number">
                                {index + 1}
                              </Typography>
                            </Grid>
                            <Grid item xs={5}>
                              <TextField
                              disabled
                                fullWidth
                                id={`achievementTitle-${index}`}
                                label="Achievement Title*"
                                variant="outlined"
                                value={row.achievementTitle}
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    "achievementTitle",
                                    e.target.value,
                                    "achievement"
                                  )
                                }
                                error={!!errors[`achievementTitle-${index}`]}
                                helperText={errors[`achievementTitle-${index}`]}
                              />
                            </Grid>
                            <Grid item xs={5}>
                              <TextField
                              disabled
                                fullWidth
                                // multiline
                                minRows={0}
                                id={`adescription-${index}`}
                                placeholder="Description"
                                variant="outlined"
                                value={row.adescription}
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    "adescription",
                                    e.target.value,
                                    "achievement"
                                  )
                                }
                                error={!!errors[`adescription-${index}`]}
                                helperText={errors[`adescription-${index}`]}
                              />
                            </Grid>
                            <Grid item xs={1} className="flex-center">
                              {index === achievementsRows.length - 1 ? (
                                <>
                                  {/* <div
                                    className="icon-btn-plus"
                                    onClick={() => handleAddRow("achievement")}
                                  >
                                    <AddIcon />
                                  </div> */}
                                  <AddCircleIcon
                                    className="plus-ic"
                                    // onClick={() => handleAddRow("achievement")}
                                  />
                                  {index > 0 && (
                                    // <div
                                    //   className="icon-btn-minus"
                                    //   onClick={() =>
                                    //     handleRemoveRow(index, "achievement")
                                    //   }
                                    // >
                                    //   <RemoveIcon />
                                    // </div>
                                    <RemoveCircleIcon
                                      // onClick={() =>
                                      //   handleRemoveRow(index, "achievement")
                                      // }
                                      className="minus-ic"
                                    />
                                  )}
                                </>
                              ) : (
                                // <div
                                //   className="icon-btn-minus"
                                //   onClick={() =>
                                //     handleRemoveRow(index, "achievement")
                                //   }
                                // >
                                //   <RemoveIcon />
                                // </div>
                                <RemoveCircleIcon
                                  // onClick={() =>
                                  //   handleRemoveRow(index, "achievement")
                                  // }
                                  className="minus-ic"
                                />
                              )}
                            </Grid>
                          </Grid>
                        ))}
                        <Box
                          sx={{ mb: 2, pl: 0, pr: 0, mt: 3 }}
                          textAlign={"right"}
                        >
                          <button
                            variant="contained"
                            className="primary"
                            onClick={handleValidationFormEducation}
                            sx={{ mt: 0 }}
                          >
                            Next
                          </button>
                        </Box>
                      </Box>
                    </TabPanel>
                    <TabPanel value="3">
                      <Grid container>
                        <Typography
                          variant="h5"
                          className="title-b"
                          sx={{ mb: 2 }}
                        >
                          Company Details*
                        </Typography>
                      </Grid>
                      <Box>
                        <Grid
                          container
                          alignItems="center"
                          className="table-header-grid"
                        >
                          <Grid
                            item
                            xs={1}
                            style={{ textAlign: "center" }}
                            className="grid-column-style"
                          >
                            <DialogTitle>S.No</DialogTitle>
                          </Grid>
                          <Grid item xs={3} className="grid-column-style">
                            <DialogTitle>Company Name*</DialogTitle>
                          </Grid>
                          <Grid item xs={3} className="grid-column-style">
                            <DialogTitle>Role*</DialogTitle>
                          </Grid>
                          <Grid item xs={2} className="grid-column-style">
                            <DialogTitle>From Date</DialogTitle>
                          </Grid>
                          <Grid item xs={2} className="grid-column-style">
                            <DialogTitle>To Date</DialogTitle>
                          </Grid>
                          <Grid item xs={1} className="grid-column-style">
                            <DialogTitle>Active</DialogTitle>
                          </Grid>
                        </Grid>
                        {inputExpRows.map((row, index) => (
                          <Grid
                            container
                            spacing={1}
                            alignItems="center"
                            key={row.id}
                            className="input-row"
                          >
                            <Grid item xs={1}>
                              <Typography className="serial-number">
                                {index + 1}
                              </Typography>
                            </Grid>
                            <Grid item xs={3}>
                              <TextField
                                fullWidth
                                disabled
                                id={`companyName-${index}`}
                                label="Company Name*"
                                variant="outlined"
                                error={!!errors[`companyName-${index}`]}
                                helperText={errors[`companyName-${index}`]}
                                value={row.companyName}
                                onChange={(e) =>
                                  handleInputChange(
                                    e,
                                    index,
                                    "companyName",
                                    "company"
                                  )
                                }
                              />
                            </Grid>
                            <Grid item xs={3}>
                              <FormControl
                                fullWidth
                                error={!!errors[`role-${index}`]}
                              >
                                <InputLabel id={`role-${index}`}>
                                  Role*
                                </InputLabel>
                                <Select
                                disabled
                                  labelId={`role-${index}`}
                                  id={`role-${index}`}
                                  multiple
                                  value={row.role} // Assuming row.role is an array of role IDs
                                  onChange={(e) =>
                                    handleRoleChange(e, index, "company")
                                  }
                                  input={<OutlinedInput label="Role*" />}
                                  renderValue={(selected) =>
                                    selected
                                      .map((id) => {
                                        const option = options.find(
                                          (option) => option.roleId === id
                                        );
                                        return option ? option.name : id;
                                      })
                                      .join(", ")
                                  }
                                >
                                  {options.map((option) => (
                                    <MenuItem
                                      key={option.roleId}
                                      value={option.roleId}
                                    >
                                      <Checkbox
                                        checked={row.role.includes(
                                          option.roleId
                                        )}
                                      />
                                      <ListItemText primary={option.name} />
                                    </MenuItem>
                                  ))}
                                </Select>
                              
                                {!!errors[`role-${index}`] && (
                                  <FormHelperText>
                                    {errors[`role-${index}`]}
                                  </FormHelperText>
                                )}
                              </FormControl>
                            </Grid>

                            <Grid item xs={2}>
                              <TextField
                              disabled
                                fullWidth
                                type="date"
                                id={`cfromDate-${index}`}
                                label="From Date*"
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                error={!!errors[`cfromDate-${index}`]}
                                helperText={errors[`cfromDate-${index}`]}
                                value={row.cfromDate}
                                onChange={(e) =>
                                  handleInputChange(
                                    e,
                                    index,
                                    "cfromDate",
                                    "company"
                                  )
                                }
                              />
                            </Grid>
                            <Grid item xs={2}>
                              <TextField
                              disabled
                                fullWidth
                                type="date"
                                id={`ctoDate-${index}`}
                                label="To Date*"
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                error={!!errors[`ctoDate-${index}`]}
                                helperText={errors[`ctoDate-${index}`]}
                                value={row.ctoDate}
                                onChange={(e) =>
                                  handleInputChange(
                                    e,
                                    index,
                                    "ctoDate",
                                    "company"
                                  )
                                }
                                InputProps={{
                                  inputProps: {
                                    min: row.cfromDate
                                      ? new Date(
                                          new Date(row.cfromDate).getTime() +
                                            86400000
                                        )
                                          .toISOString()
                                          .split("T")[0]
                                      : undefined,
                                  },
                                }}
                                //disabled={!row.cfromDate}
                              />
                            </Grid>
                            <Grid item xs={1} className="flex-center">
                              {index === inputExpRows.length - 1 ? (
                                <>
                                  {/* <div
                                    className="icon-btn-plus"
                                    onClick={handleAddExpRow}
                                  >
                                    <AddIcon />
                                  </div> */}
                                  <AddCircleIcon
                                    className="plus-ic"
                                    //onClick={handleAddExpRow}
                                  />
                                  {index > 0 && (
                                    // <div
                                    //   className="icon-btn-minus"
                                    //   onClick={() => handleRemoveExpRow(index)}
                                    // >
                                    //   <RemoveIcon />
                                    // </div>
                                    <RemoveCircleIcon
                                     // onClick={() => handleRemoveExpRow(index)}
                                      className="minus-ic"
                                    />
                                  )}
                                </>
                              ) : (
                                // <div
                                //   className="icon-btn-minus"
                                //   onClick={() => handleRemoveExpRow(index)}
                                // >
                                //   <RemoveIcon />
                                // </div>
                                <RemoveCircleIcon
                                  //onClick={() => handleRemoveExpRow(index)}
                                  className="minus-ic"
                                />
                              )}
                            </Grid>
                          </Grid>
                        ))}
                        <Grid container className="mt-3">
                          <Typography
                            variant="h5"
                            className="title-b"
                            sx={{ mb: 2 }}
                          >
                            Project Details*
                          </Typography>
                        </Grid>
                        <Box>
                          <Grid
                            container
                            alignItems="center"
                            className="table-header-grid"
                          >
                            <Grid
                              item
                              xs={1}
                              style={{ textAlign: "center" }}
                              className="grid-column-style"
                            >
                              <DialogTitle>S.No</DialogTitle>
                            </Grid>
                            <Grid item xs={2} className="grid-column-style">
                              <DialogTitle>Project Name*</DialogTitle>
                            </Grid>
                            <Grid item xs={2} className="grid-column-style">
                              <DialogTitle>Role*</DialogTitle>
                            </Grid>
                            <Grid item xs={2} className="grid-column-style">
                              <DialogTitle>From Date </DialogTitle>
                            </Grid>
                            <Grid item xs={2} className="grid-column-style">
                              <DialogTitle>To Date</DialogTitle>
                            </Grid>
                            <Grid item xs={2} className="grid-column-style">
                              <DialogTitle>Description*</DialogTitle>
                            </Grid>
                            <Grid item xs={1} className="grid-column-style">
                              <DialogTitle>Action</DialogTitle>
                            </Grid>
                          </Grid>
                          {projectRows.map((row, index) => (
                            <Grid
                              container
                              spacing={1}
                              alignItems="center"
                              key={row.id}
                              className="input-row"
                            >
                              <Grid item xs={1}>
                                <Typography className="serial-number">
                                  {index + 1}
                                </Typography>
                              </Grid>
                              <Grid item xs={2}>
                                <TextField
                                disabled
                                  fullWidth
                                  id={`projectName-${index}`}
                                  label="Project Name*"
                                  variant="outlined"
                                  error={!!errors[`projectName-${index}`]}
                                  helperText={errors[`projectName-${index}`]}
                                  value={row.projectName}
                                  onChange={(e) =>
                                    handleInputChange(
                                      e,
                                      index,
                                      "projectName",
                                      "project"
                                    )
                                  }
                                />
                              </Grid>
                              <Grid item xs={2}>
                                <FormControl
                                  fullWidth
                                  error={!!errors[`pRole-${index}`]}
                                >
                                  <InputLabel id={`pRole-${index}-label`}>
                                    Role*
                                  </InputLabel>
                                  <Select
                                  disabled
                                    labelId={`pRole-${index}-label`}
                                    label="Role*"
                                    id={`pRole-${index}`}
                                    value={row.pRole}
                                    onChange={(e) =>
                                      handleRoleChange(e, index, "project")
                                    }
                                    variant="outlined"
                                  >
                                    {roleOptions.map((option) => (
                                      <MenuItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                  {!!errors[`pRole-${index}`] && (
                                    <FormHelperText>
                                      {errors[`pRole-${index}`]}
                                    </FormHelperText>
                                  )}
                                </FormControl>
                              </Grid>
                              <Grid item xs={2}>
                                <TextField
                                disabled
                                  fullWidth
                                  type="date"
                                  id={`fromDate-${index}`}
                                  label="From Date*"
                                  variant="outlined"
                                  InputLabelProps={{ shrink: true }}
                                  error={!!errors[`fromDate-${index}`]}
                                  helperText={errors[`fromDate-${index}`]}
                                  value={row.fromDate}
                                  onChange={(e) =>
                                    handleInputChange(
                                      e,
                                      index,
                                      "fromDate",
                                      "project"
                                    )
                                  }
                                />
                              </Grid>
                              <Grid item xs={2}>
                                <TextField
                                disabled
                                  fullWidth
                                  type="date"
                                  id={`toDate-${index}`}
                                  label="To Date*"
                                  variant="outlined"
                                  InputLabelProps={{ shrink: true }}
                                  error={!!errors[`toDate-${index}`]}
                                  helperText={errors[`toDate-${index}`]}
                                  value={row.toDate}
                                  onChange={(e) =>
                                    handleInputChange(
                                      e,
                                      index,
                                      "toDate",
                                      "project"
                                    )
                                  }
                                  InputProps={{
                                    inputProps: {
                                      min: row.fromDate
                                        ? new Date(
                                            new Date(row.fromDate).getTime() +
                                              86400000
                                          )
                                            .toISOString()
                                            .split("T")[0]
                                        : undefined,
                                    },
                                  }}
                                  //disabled={!row.fromDate}
                                />
                              </Grid>
                              <Grid item xs={2}>
                                <TextField
                                disabled
                                  fullWidth
                                  id={`description-${index}`}
                                  label="Description*"
                                  variant="outlined"
                                  error={!!errors[`description-${index}`]}
                                  helperText={errors[`description-${index}`]}
                                  value={row.description}
                                  onChange={(e) =>
                                    handleInputChange(
                                      e,
                                      index,
                                      "description",
                                      "project"
                                    )
                                  }
                                />
                              </Grid>
                              <Grid item xs={1} className="flex-center">
                                {index === projectRows.length - 1 ? (
                                  <>
                                    {/* <div
                                      className="icon-btn-plus"
                                      onClick={handleProjectAddRow}
                                    >
                                      <AddIcon />
                                    </div> */}
                                    <AddCircleIcon
                                      className="plus-ic"
                                      //onClick={handleProjectAddRow}
                                    />
                                    {index > 0 && (
                                      // <div
                                      //   className="icon-btn-minus"
                                      //   onClick={() =>
                                      //     handleProjectRemoveRow(index)
                                      //   }
                                      // >
                                      //   <RemoveIcon />
                                      // </div>
                                      <RemoveCircleIcon
                                        // onClick={() =>
                                        //   handleProjectRemoveRow(index)
                                        // }
                                        className="minus-ic"
                                      />
                                    )}
                                  </>
                                ) : (
                                  // <div
                                  //   className="icon-btn-minus"
                                  //   onClick={() =>
                                  //     handleProjectRemoveRow(index)
                                  //   }
                                  // >
                                  //   <RemoveIcon />
                                  // </div>
                                  <RemoveCircleIcon
                                    // onClick={() =>
                                    //   handleProjectRemoveRow(index)
                                    // }
                                    className="minus-ic"
                                  />
                                )}
                              </Grid>
                            </Grid>
                          ))}
                        </Box>
                        <Grid container className="mt-3">
                          <Typography
                            variant="h5"
                            className="title-b"
                            sx={{ mb: 0 }}
                          >
                            Skills and Technology*
                          </Typography>
                        </Grid>
                        <Grid
                          container
                          spacing={3}
                          alignItems="center"
                          className="input-row"
                          sx={{ mt: 0, mb: 0, pl: 0, pr: 0 }}
                        >
                          <Grid item xs={12}>
                            <FormControl fullWidth error={!!errors["skills"]}>
                              <InputLabel id="skills-label">Skills</InputLabel>
                              <Select
                              disabled
                                labelId="skills-label"
                                id="skills"
                                multiple
                                value={selectedOptions1}
                                // onChange={(e) =>
                                //   setSelectedOptions1(e.target.value)
                                // }
                                onChange={handleSkillsChange}
                                input={<OutlinedInput label="Skills*" />}
                                renderValue={(selected) => (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: 0.5,
                                    }}
                                  >
                                    {selected.map((value) => (
                                      <Chip
                                        key={value}
                                        label={
                                          skillsOptions.find(
                                            (option) => option.skillId === value
                                          )?.name || value
                                        }
                                      />
                                    ))}
                                  </Box>
                                )}
                              >
                                {skillsOptions.map((option) => (
                                  <MenuItem
                                    key={option.skillId}
                                    value={option.skillId}
                                  >
                                    <Checkbox
                                      checked={
                                        selectedOptions1.indexOf(
                                          option.skillId
                                        ) > -1
                                      }
                                    />
                                    <ListItemText primary={option.name} />
                                  </MenuItem>
                                ))}
                              </Select>
                              {!!errors["skills"] && (
                                <FormHelperText>
                                  {errors["skills"]}
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>

                          <Grid
                            item
                            xs={12}
                            sx={{ mt: 0, mb: 0, pl: 0, pr: 0 }}
                          >
                            <FormControl
                              fullWidth
                              error={!!errors["technology"]}
                            >
                              <InputLabel id="technology-label">
                                Technology
                              </InputLabel>
                              <Select
                              disabled
                                labelId="technology-label"
                                id="technology"
                                multiple
                                value={selectedOptions2}
                                // onChange={(e) =>
                                //   setSelectedOptions2(e.target.value)
                                // }
                                onChange={handleTechnologyChange}
                                input={<OutlinedInput label="Technology*" />}
                                renderValue={(selected) => {
                                  const selectedNames = availableOptions
                                    .filter((option) =>
                                      selected.includes(option.technologyId)
                                    )
                                    .map((option) => option.technologyName);
                                  return (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 0.5,
                                      }}
                                    >
                                      {selectedNames.map((name) => (
                                        <Chip key={name} label={name} />
                                      ))}
                                    </Box>
                                  );
                                }}
                              >
                                {availableOptions.map((option) => (
                                  <MenuItem
                                    key={option.technologyId}
                                    value={option.technologyId}
                                  >
                                    <Checkbox
                                      checked={
                                        selectedOptions2.indexOf(
                                          option.technologyId
                                        ) > -1
                                      }
                                    />
                                    <ListItemText
                                      primary={option.technologyName}
                                    />
                                  </MenuItem>
                                ))}
                              </Select>
                              {!!errors["technology"] && (
                                <FormHelperText>
                                  {errors["technology"]}
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>

                          <Grid
                            item
                            xs={12}
                            sx={{ mt: 0, mb: 0, pl: 0, pr: 0 }}
                          >
                            <TextField
                            disabled
                              fullWidth
                              id="tool"
                              label="Tool*"
                              variant="outlined"
                              error={!!errors["tool"]}
                              helperText={errors["tool"]}
                              value={tool}
                              onChange={(e) =>
                                handleInputChange(e, null, "tool", "tool")
                              }
                            />
                          </Grid>
                        </Grid>
                        <Box
                          sx={{ mb: 2, pl: 0, pr: 0, mt: 3 }}
                          textAlign={"right"}
                        >
                          <Button
                            type="submit"
                            variant="contained"
                            className="primary"
                            onClick={handleValidationExperienceForm}
                          >
                            Next
                          </Button>
                          {/* <button variant="contained" className="primary" onClick={handleValidationFormEducation} sx={{ mt: 0 }}>
                            Next
                          </button> */}
                        </Box>
                      </Box>
                    </TabPanel>

                    <TabPanel value="4">
                      <Grid container>
                        <Typography
                          variant="h5"
                          className="title-b"
                          sx={{ mb: 2 }}
                        >
                          Family And Medical Details
                        </Typography>
                      </Grid>
                      <Box>
                        <Grid
                          container
                          alignItems="center"
                          className="table-header-grid"
                        >
                          <Grid
                            item
                            xs={1}
                            style={{ textAlign: "center" }}
                            className="grid-column-style"
                          >
                            <DialogTitle>Name*</DialogTitle>
                          </Grid>
                          <Grid item xs={2} className="grid-column-style">
                            <DialogTitle>Select Relation*</DialogTitle>
                          </Grid>

                          <Grid item xs={2} className="grid-column-style">
                            <DialogTitle>Family Mobile*</DialogTitle>
                          </Grid>
                          <Grid item xs={2} className="grid-column-style">
                            <DialogTitle>Blood Group*</DialogTitle>
                          </Grid>
                          <Grid item xs={2} className="grid-column-style">
                            <DialogTitle>Phy. handicapped</DialogTitle>
                          </Grid>
                          <Grid item xs={2} className="grid-column-style">
                            <DialogTitle>Is That Dependent</DialogTitle>
                          </Grid>
                          <Grid item xs={1} className="grid-column-style">
                            <DialogTitle>Action</DialogTitle>
                          </Grid>
                        </Grid>
                        <Box>
                          <Box>
                            {formRows.map((row, index) => (
                              <Grid
                                container
                                spacing={1}
                                alignItems="center"
                                key={index}
                                className="input-row"
                              >
                                <Grid
                                  item
                                  xs={1.5}
                                  sx={{ mb: 0, pl: 0, pr: 0, mt: 1 }}
                                >
                                  <TextField
                                  disabled
                                    fullWidth
                                    label="Name*"
                                    name="name"
                                    value={row.name}
                                    onChange={(event) =>
                                      handleChange2(index, event)
                                    }
                                    error={!!errors[`name-${index}`]}
                                    helperText={errors[`name-${index}`]}
                                  />
                                </Grid>

                                <Grid
                                  item
                                  xs={2}
                                  sx={{ mb: 0, pl: 2, pr: 0, mt: 1 }}
                                >
                                  <FormControl fullWidth>
                                    <InputLabel id="employee-relation">
                                      Select Relation*
                                    </InputLabel>
                                    <Select
                                    disabled
                                      labelId="employee-relation"
                                      id="employee-relation"
                                      name="employeeRelation"
                                      value={row.employeeRelation}
                                      label="Employee Relation*"
                                      onChange={(event) =>
                                        handleChange2(index, event)
                                      }
                                      error={
                                        !!errors[`employeeRelation-${index}`]
                                      }
                                    >
                                      <MenuItem value={1}>Father</MenuItem>
                                      <MenuItem value={2}>Mother</MenuItem>
                                      <MenuItem value={3}>Son</MenuItem>
                                    </Select>
                                  </FormControl>
                                  {errors[`employeeRelation-${index}`] && (
                                    <Typography variant="body2" color="error">
                                      {errors[`employeeRelation-${index}`]}
                                    </Typography>
                                  )}
                                </Grid>
                                <Grid item xs={2}>
                                  <TextField
                                  disabled
                                    fullWidth
                                    label="Family Mobile Number*"
                                    id="familymobileno"
                                    variant="outlined"
                                    name="familyMobileNo"
                                    value={row.familyMobileNo}
                                    onChange={(event) =>
                                      handleChange2(index, event)
                                    }
                                    error={!!errors[`familyMobileNo-${index}`]}
                                    helperText={
                                      errors[`familyMobileNo-${index}`]
                                    }
                                  />
                                </Grid>
                                <Grid item xs={2}>
                                  <FormControl fullWidth>
                                    <InputLabel id="blood-group">
                                      Blood Group*
                                    </InputLabel>
                                    <Select
                                    disabled
                                      labelId="blood-group"
                                      id="blood-group"
                                      name="bloodGroup"
                                      value={row.bloodGroup}
                                      label="Blood Group*"
                                      onChange={(event) =>
                                        handleChange2(index, event)
                                      }
                                      error={!!errors[`bloodGroup-${index}`]}
                                    >
                                      <MenuItem value={1}>(A+)</MenuItem>
                                      <MenuItem value={2}>(A-)</MenuItem>
                                      <MenuItem value={3}>(O+)</MenuItem>
                                    </Select>
                                    {errors[`bloodGroup-${index}`] && (
                                      <Typography variant="body2" color="error">
                                        {errors[`bloodGroup-${index}`]}
                                      </Typography>
                                    )}
                                  </FormControl>
                                </Grid>
                                <Grid item xs={1.5}>
                                  <div
                                    sx={{ pl: 0, pr: 0, pt: 0 }}
                                    className="is-that-text-section"
                                  >
                                    Physically Handicapped
                                  </div>
                                  <FormControl component="fieldset">
                                    <RadioGroup
                                      aria-label="pwd-options"
                                      name="pwd"
                                      value={row.pwd}
                                      className="flowys"
                                      onChange={(event) =>
                                        handleChange2(index, event)
                                      }
                                    >
                                      <FormControlLabel
                                      disabled
                                        value="1"
                                        control={<Radio />}
                                        label="Yes"
                                      />
                                      <FormControlLabel
                                      disabled
                                        value="0"
                                        control={<Radio />}
                                        label="No"
                                      />
                                    </RadioGroup>
                                  </FormControl>
                                  {errors[`pwd-${index}`] && (
                                    <Typography variant="body2" color="error">
                                      {errors[`pwd-${index}`]}
                                    </Typography>
                                  )}
                                </Grid>
                                <Grid
                                  item
                                  xs={1.5}
                                  sx={{ mb: 0, pl: 2, pr: 0, mt: 1 }}
                                >
                                  <div
                                    sx={{ pl: 0, pr: 0, pt: 0 }}
                                    className="is-that-text-section"
                                  >
                                    Is that Dependent
                                  </div>
                                  <FormControl component="fieldset">
                                    <RadioGroup
                                      aria-label="yes-no-options"
                                      name="isDependent"
                                      value={row.isDependent}
                                      onChange={(event) =>
                                        handleChange2(index, event)
                                      }
                                      className="flowys"
                                      style={{ fontSize: "12px" }}
                                    >
                                      <FormControlLabel
                                      disabled
                                        value="1"
                                        control={<Radio />}
                                        label="Yes"
                                        style={{ fontSize: "12px" }}
                                      />
                                      <FormControlLabel
                                      disabled
                                        value="0"
                                        control={<Radio />}
                                        label="No"
                                        style={{ fontSize: "12px" }}
                                      />
                                    </RadioGroup>
                                  </FormControl>
                                  {errors[`isDependent-${index}`] && (
                                    <Typography variant="body2" color="error">
                                      {errors[`isDependent-${index}`]}
                                    </Typography>
                                  )}
                                </Grid>

                                <Grid
                                  item
                                  xs={1.5}
                                  sx={{ mb: 0, pl: 2, pr: 0, mt: 1 }}
                                >
                                  <Grid
                                    item
                                    xs={12}
                                    className="parent-class-section-add"
                                  >
                                    <div className="btn-add-minus-section">
                                      {index === formRows.length - 1 ? (
                                        <div className="plus-section">
                                          <AddCircleIcon
                                            className="plus-ic"
                                            //onClick={handleRowAdd}
                                          />
                                          {index > 0 && (
                                            <RemoveCircleIcon
                                              
                                              className="minus-ic"
                                            />
                                          )}
                                        </div>
                                      ) : (
                                        <RemoveCircleIcon
                                         // onClick={() => handleRowRemove(index)}
                                          className="minus-ic"
                                        />
                                      )}
                                    </div>
                                  </Grid>
                                </Grid>
                                { index === formRows.length-1 ?
                                <Grid
                                  item
                                  xs={12}
                                  sx={{ mt: 3, mb: 0, pl: 0, pr: 0 }}
                                >
                                  <TextField
                                  disabled
                                    fullWidth
                                    multiline
                                    minRows={2}
                                    id="description"
                                    label="Description*"
                                    variant="outlined"
                                    name="description"
                                    value={row.description}
                                    onChange={(event) =>
                                      handleChange2(index, event)
                                    }
                                    error={!!errors[`description-${index}`]}
                                    helperText={errors[`description-${index}`]}
                                  />
                                </Grid>: null}
                              </Grid>
                            ))}
                            <div className="btn-family-section">
                              <Button
                                type="submit"
                                variant="contained"
                                className="primary"
                                onClick={handleFamilyHealthSubmit}
                              >
                                Next
                              </Button>
                            </div>
                          </Box>
                        </Box>
                      </Box>
                    </TabPanel>
                    <TabPanel value="5">
                      <Box>
                        <Grid
                          container
                          alignItems="center"
                          className="table-header-grid"
                        >
                          <Grid
                            item
                            xs={1}
                            style={{ textAlign: "center" }}
                            className="grid-column-style"
                          >
                            <DialogTitle>S.No</DialogTitle>
                          </Grid>
                          <Grid item xs={5} className="grid-column-style">
                            <DialogTitle>Document Type*</DialogTitle>
                          </Grid>
                          <Grid item xs={5} className="grid-column-style">
                            <DialogTitle>File Uploaders*</DialogTitle>
                          </Grid>
                          <Grid item xs={1} className="grid-column-style">
                            <DialogTitle>Action</DialogTitle>
                          </Grid>
                        </Grid>
                        {fileUploadRows.map((row, index) => (
                          <Grid
                            container
                            spacing={1}
                            alignItems="center"
                            key={row.id}
                            className="input-row"
                          >
                            <Grid item xs={1}>
                              <Typography className="serial-number">
                                {index + 1}
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={5}
                              sx={{ mb: 0, pl: 0, pr: 0, mt: 1 }}
                            >
                              <FormControl
                                fullWidth
                                error={!!errors[`documentType-${index}`]}
                              >
                                <InputLabel id={`role-name-label-${index}`}>
                                  Document Type*
                                </InputLabel>
                                <Select
                                disabled
                                  labelId={`role-name-label-${index}`}
                                  id={`role-name-select-${index}`}
                                  value={row.documentType}
                                  label="Document Type"
                                  onChange={(event) =>
                                    handledocChangefile(index, event)
                                  }
                                >
                                  {documents.map((doc) => (
                                    <MenuItem
                                      key={doc.docTypeId}
                                      value={doc.docTypeId}
                                    >
                                      {doc.docTypeText}
                                    </MenuItem>
                                  ))}
                                </Select>
                                {errors[`documentType-${index}`] && (
                                  <Typography variant="body2" color="error">
                                    {errors[`documentType-${index}`]}
                                  </Typography>
                                )}
                              </FormControl>
                            </Grid>
                            <Grid
                              item
                              xs={5}
                              sx={{ mb: 0, pl: 2, pr: 0, mt: 1 }}
                            >
                              <div className="file-gp-section">
                                <TextField
                                disabled
                                  fullWidth
                                  id={`file-upload-${index}`}
                                  type="file"
                                  name="docfile"
                                  onChange={(event) =>
                                    handleFileChange(index, event)
                                  }
                                  className="input-file-upload"
                                />
                                {row.file && (
                                  <div className="file-upload">
                                    Uploaded File:{" "}
                                    {typeof row.file === "object"
                                      ? row.file.name
                                      : row.file}
                                  </div>
                                )}
                                {row.file && (
                                  <div className="file-upload-text">
                                    {" "}
                                    {typeof row.file === "object"
                                      ? row.file.name
                                      : row.file}
                                  </div>
                                )}
                              </div>
                              {errors[`file-${index}`] && (
                                <Typography variant="body2" color="error">
                                  {errors[`file-${index}`]}
                                </Typography>
                              )}
                            </Grid>
                            <Grid item xs={1} className="flex-center">
                              {index === fileUploadRows.length - 1 ? (
                                <>
                                  <AddCircleIcon
                                    className="plus-ic"
                                    onClick={handleFileUploadAddRow}
                                  />
                                  {index > 0 && (
                                    <RemoveCircleIcon
                                      //onClick={() => handleFileRemoveRow(index)}
                                      className="minus-ic"
                                    />
                                  )}
                                </>
                              ) : (
                                <RemoveCircleIcon
                                  //onClick={() => handleFileRemoveRow(index)}
                                  className="minus-ic"
                                />
                              )}
                            </Grid>
                          </Grid>
                        ))}

                        {/* <Box
                          sx={{ mb: 0, pl: 0, pr: 0, mt: 3 }}
                          textAlign={"right"}
                        >
                          {flagData == undefined ? (
                            <Button
                              variant="contained"
                              className="primary"
                              type="submit"
                              sx={{ mt: 0 }}
                            >
                              Submit
                            </Button>
                          ) : (
                            <div>
                              <Button
                                variant="contained"
                                className="primary"
                                type="submit"
                                id="edit-trans-btn"
                              >
                                Update
                              </Button>
                              <Button
                                variant="contained"
                                className="warning"
                                type="submit"
                              >
                                Cancel
                              </Button>
                            </div>
                          )}
                         
                        </Box>
                         */}

                        <Box
                          sx={{ mb: 0, pl: 0, pr: 0, mt: 3 }}
                          textAlign={"right"}
                        >
                          {isLoading ? (
                            <CircularProgress size={24} />
                          ) : flagData == undefined ? (
                            <Button
                              variant="contained"
                              className="primary"
                              type="submit"
                              sx={{ mt: 0 }}
                            >
                              Submit
                            </Button>
                          ) : (
                            <div>
                              <Button
                                variant="contained"
                                className="primary"
                                type="submit"
                                id="edit-trans-btn"
                              >
                                Update
                              </Button>
                              <Button
                                variant="contained"
                                className="warning"
                                type="button" // Change type to button to prevent form submission
                                onClick={() => {
                                  // Handle cancel action
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          )}
                        </Box>
                      </Box>
                    </TabPanel>
                  </TabContext>
                </Card>
              </Box>
            </form>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
export default ViewDetailsList;