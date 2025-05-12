import React, { useState, useRef, useEffect } from 'react';
import SideBar from '../Component/SideBar'
import { Breadcrumbs, Link, Checkbox, Grid, Card, Typography, Box, Button, TextField, DialogTitle, TablePagination } from '@mui/material';
import { MenuItem, FormControl, InputLabel } from '@mui/material';
import { Select } from '@mui/material';

import { Table, TableBody, TableCell, TableContainer, TableSortLabel, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

import ConfirmationDialogBox from '../Component/ConfirmationDialogbox';
import CV_TemplatesDialogBox from '../Component/CV_TemplatesDialogBox';
import IconButton from '@mui/material/IconButton';

import { Delete, Edit } from '@mui/icons-material';
import VisibilitySharpIcon from '@mui/icons-material/VisibilitySharp';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import SearchIcon from '@mui/icons-material/Search';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

function TemplateMaster() {
  const baseURL = 'https://staffcentral.azurewebsites.net/api';
  const [isEdit, setIsEdit] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredRows, setFilteredRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState({
    TemplateName: "",
    LayoutId: ""
  });

  const initialState = {
    TemplateId: 0,
    TemplateName: "",
    LayoutId: "",
    LayoutName: "",
    Name: false,
    Email: false,
    LinkedInId: false,
    MobileNo: false,
    Profilepicture: false,
    Designation: false,
    ObjectiveName: false,
    Description: false,
    CompanyName: false,
    FromDate: false,
    ToDate: false,
    ProjectName: false,
    ProjectSummary: false,
    Skills: false,
    Role: false,
    InstituteName: false,
    CourseName: false,
    BoardUniversity: false,
    PercentageCGPA: false,
    PassingYear: false,
    CertificationName: false,
    IssuingOrganization: false,
    IssuedDate: false,
    ExpirationDate: false,
    DescriptionDetails: false,
    LanguageName: false
  };

  const [templates, setTemplates] = useState([]);
  const [templateFormData, setTemplateFormData] = useState(initialState);

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    setFilteredRows(
      templates.filter(template =>
        template.templateName.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

  const fetchTemplates = async () => {
    try {
      const response = await axios.get(`${baseURL}/Teamplate/GetTemplatelist`);
      setTemplates(response.data);
      setFilteredRows(response.data);
    } catch (error) {
    
    }
  }

  const validateTemplateForm = () => {
    let errors = {};

    if (templateFormData.TemplateName?.trim() === '') {
      errors.TemplateName = 'Please enter template name';
    }

    if (templateFormData.LayoutId === "") {
      errors.LayoutId = 'Please select a template layout';
    }

    setError(errors);

    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    if (name === "LayoutId") {
      const selectedLayout = layoutData.find(layout => layout.LayoutId == newValue); // Note: Using == to compare number and string
      setTemplateFormData((v) => ({
        ...v,
        [name]: newValue,
        LayoutName: selectedLayout ? selectedLayout.LayoutName : ''
      }));
    } else {
      setTemplateFormData((v) => ({ ...v, [name]: newValue }));
    }

  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateTemplateForm()) {
      try {
        // Handle form submission
        const payload = {
          TemplateName: templateFormData.TemplateName,
          LayoutId: templateFormData.LayoutId,
          LayoutName: templateFormData.LayoutName,
          Name: templateFormData.Name,
          Email: templateFormData.Email,
          LinkedInId: templateFormData.LinkedInId,
          MobileNo: templateFormData.MobileNo,
          Profilepicture: templateFormData.Profilepicture,
          Designation: templateFormData.Designation,
          ObjectiveName: templateFormData.ObjectiveName,
          Description: templateFormData.Description,
          CompanyName: templateFormData.CompanyName,
          FromDate: templateFormData.FromDate,
          ToDate: templateFormData.ToDate,
          ProjectName: templateFormData.ProjectName,
          ProjectSummary: templateFormData.ProjectSummary,
          Skills: templateFormData.Skills,
          Role: templateFormData.Role,
          InstituteName: templateFormData.InstituteName,
          CourseName: templateFormData.CourseName,
          BoardUniversity: templateFormData.BoardUniversity,
          PercentageCGPA: templateFormData.PercentageCGPA,
          PassingYear: templateFormData.PassingYear,
          CertificationName: templateFormData.CertificationName,
          IssuingOrganization: templateFormData.IssuingOrganization,
          IssuedDate: templateFormData.IssuedDate,
          ExpirationDate: templateFormData.ExpirationDate,
          DescriptionDetails: templateFormData.DescriptionDetails,
          LanguageName: templateFormData.LanguageName
        }

        let response;
        if (isEdit) {
          payload.TemplateId = templateFormData.TemplateId;
          response = await axios.post(`${baseURL}/Teamplate/SaveUpdateTeamplate`, payload);
          if (response.status === 200) {
            toast.success('Record Updated Successfully', { position: 'top-center', closeButton: false, autoClose: 2000 });
          } else {
            toast.error(response.data, { position: 'top-center', closeButton: false, autoClose: 2000 });
          }
        }
        else {
          response = await axios.post(`${baseURL}/Teamplate/SaveUpdateTeamplate`, payload);
          if (response.status === 200) {
            toast.success('Record Submitted Successfully', { position: 'top-center', closeButton: false, autoClose: 2000 });
          } else {
            toast.error(response.data, { position: 'top-center', closeButton: false, autoClose: 2000 });
          }
        }

        // Reset form
        setTemplateFormData(initialState);
        fetchTemplates();
        handleCancel();

      } catch (error) {
        toast.error(error.message, { position: 'top-center', closeButton: false, autoClose: 2000 });
      }
    }

  };

  function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
  }

  const handleEdit = async (templateId) => {

    let response = await axios.get(`${baseURL}/Teamplate/GetTemplateById?TemplateId=${templateId}`);

    setTemplateFormData({
      TemplateId: templateId,
      TemplateName: response.data.templateName,
      LayoutId: response.data.layoutId,
      LayoutName: response.data.layoutName,
      Name: response.data.name,
      Email: response.data.email,
      LinkedInId: response.data.linkedInId,
      MobileNo: response.data.mobileNo,
      Profilepicture: response.data.profilepicture,
      Designation: response.data.designation,
      ObjectiveName: response.data.objectiveName,
      Description: response.data.description,
      CompanyName: response.data.companyName,
      FromDate: response.data.fromDate,
      ToDate: response.data.toDate,
      ProjectName: response.data.projectName,
      ProjectSummary: response.data.projectSummary,
      Skills: response.data.skills,
      Role: response.data.role,
      InstituteName: response.data.instituteName,
      CourseName: response.data.courseName,
      BoardUniversity: response.data.boardUniversity,
      PercentageCGPA: response.data.percentageCGPA,
      PassingYear: response.data.passingYear,
      CertificationName: response.data.certificationName,
      IssuingOrganization: response.data.issuingOrganization,
      IssuedDate: response.data.issuedDate,
      ExpirationDate: response.data.expirationDate,
      DescriptionDetails: response.data.descriptionDetails,
      LanguageName: response.data.languageName
    });
    setIsEdit(true);
    setShowForm(true);
    setError('');
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTemplateId, setSeletedTemplateId] = useState(null);

  const handleDeleteClick = (templateId) => {
    setSeletedTemplateId(templateId);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSeletedTemplateId(null);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`${baseURL}/Teamplate/${selectedTemplateId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast.success('Template deleted successfully', {
          position: 'top-center',
          closeButton: false,
          autoClose: 2000
        });
        fetchTemplates();
      } else {
        
        toast.error('Failed to delete data', {
          position: 'top-center',
          closeButton: false,
          autoClose: 2000
        });
      }
    } catch (error) {
      console.error('Error occurred while deleting data:', error);
      toast.error('Error occurred while deleting data', {
        position: 'top-center',
        closeButton: false,
        autoClose: 2000
      });
    } finally {
      handleCloseDialog();
    }

  };

  const handleCsvDownload = () => {
    return filteredRows.map(row => ({
      'Template Name': row.templateName,
      'Layout Name': row.layoutName,
      'Basic Information': row.basicInformation,
      'Objective': row.objective
    }));
  };

  const downloadExcel = () => {
    const filteredData = filteredRows.map(row => ({
      'Template Name': row.templateName,
      'Layout Name': row.layoutName,
      'Basic Information': row.basicInformation,
      'Objective': row.objective
    }));
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template_Master");
    XLSX.writeFile(wb, "Template_Master.xlsx");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Template Name', 'Layout Name', 'Basic Information', 'Objective']],
      body: filteredRows.map(row => [row.templateName, row.layoutName, row.basicInformation, row.objective]),
    });
    doc.save('Template_Master.pdf');
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsEdit(false);
    setError('');
    setTemplateFormData(initialState);
  };
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };



  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleToggle = () => {
    setShowForm(true);
    setTemplateFormData(initialState);
  };



  const layoutData = [
    { LayoutId: 1, LayoutName: 'Basic' },
    { LayoutId: 2, LayoutName: 'Advanced' }
  ];

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    if (templateFormData.LayoutId != "") {
      setOpen(true);
    }
    else {
      toast.error('Please select a template layout', { position: 'top-center', closeButton: false, autoClose: 2000 });
    }
  };

  const handleClickOpenWithId = async (templateId) => {

    let response = await axios.get(`${baseURL}/Teamplate/GetTemplateById?TemplateId=${templateId}`);

    setTemplateFormData({
      TemplateId: templateId,
      TemplateName: response.data.templateName,
      LayoutId: response.data.layoutId,
      LayoutName: response.data.layoutName,
      Name: response.data.name,
      Email: response.data.email,
      LinkedInId: response.data.linkedInId,
      MobileNo: response.data.mobileNo,
      Profilepicture: response.data.profilepicture,
      Designation: response.data.designation,
      ObjectiveName: response.data.objectiveName,
      Description: response.data.description,
      CompanyName: response.data.companyName,
      FromDate: response.data.fromDate,
      ToDate: response.data.toDate,
      ProjectName: response.data.projectName,
      ProjectSummary: response.data.projectSummary,
      Skills: response.data.skills,
      Role: response.data.role,
      InstituteName: response.data.instituteName,
      CourseName: response.data.courseName,
      BoardUniversity: response.data.boardUniversity,
      PercentageCGPA: response.data.percentageCGPA,
      PassingYear: response.data.passingYear,
      CertificationName: response.data.certificationName,
      IssuingOrganization: response.data.issuingOrganization,
      IssuedDate: response.data.issuedDate,
      ExpirationDate: response.data.expirationDate,
      DescriptionDetails: response.data.descriptionDetails,
      LanguageName: response.data.languageName
    });
    setOpen(true);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortComparator = (a, b, orderBy, order) => {
    if (a[orderBy] && b[orderBy]) {
      const aValue = a[orderBy].toLowerCase();
      const bValue = b[orderBy].toLowerCase();

      if (aValue < bValue) {
        return order === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return order === 'asc' ? 1 : -1;
      }
    }
    return 0;
  };

  const sortedRows = [...filteredRows].sort((a, b) => sortComparator(a, b, orderBy, order));


  const handleClose = () => {
    setOpen(false);
  };

  const sortedAndPagedRows = [...sortedRows]
    .sort((a, b) => b.templateId - a.templateId) // Sort in descending order
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage); // Apply pagination

  return (
    <Box sx={{ display: 'flex' }} className="main-container ">
      <SideBar />
      <Box component="main" className="main-content" sx={{ flexGrow: 1, }}>
        <ToastContainer />
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Typography className='head-title' component="h1" variant="h6" align="left">
                Template Master
              </Typography>
            </Grid>
            <Grid item xs={4} textAlign={'right'}>
              <div role="presentation" onClick={handleClick}>
                <Breadcrumbs className='breadcrumbs-css' aria-label="breadcrumb" textAlign={'right'} sx={{ mt: 1 }}>
                  <Link color="inherit" href="/">
                    CV Generation
                  </Link>
                  <Typography color="text.primary">Template Master</Typography>
                </Breadcrumbs>
              </div>
            </Grid>
          </Grid>
        </Box>

        {showForm &&
          <Paper sx={{ width: '100%', overflow: 'hidden', mb: 2 }} className='form-card-css'>
            <Card className='bs_css' sx={{ minWidth: 275, mt: 2, pb: 1, ml: 3, mr: 3 }}>
              <from className='tondform-css'>
                <Grid container>



                  <Grid item xs={6} sx={{ mt: 0, mb: 3, pl: 0, pr: 0, }}>
                    <Typography variant='h5' className='title-b' sx={{ mb: 2 }}>
                      Setup Template
                    </Typography>
                    {/* <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>Template Name</DialogTitle> */}
                    <TextField
                      fullWidth
                      id="Template Name"
                      placeholder="Template Name"
                      required
                      name="TemplateName"
                      value={templateFormData.TemplateName}
                      onChange={handleChange}
                    />
                    {error.TemplateName && (
                      <Grid item xs={12} sx={{ mb: 1, pl: 0, pr: 2 }}>
                        <Typography fontSize={13} color="error">{error.TemplateName}</Typography>
                      </Grid>
                    )}
                  </Grid>


                  <Grid item xs={6} sx={{ mb: 0, pl: 2, pr: 0 }}>
                    <Typography variant='h5' className='title-b' sx={{ mb: 2 }}>
                      Template Type
                    </Typography>

                    <FormControl fullWidth>
                      {/* <InputLabel id="temp-layout-label">Template Layout</InputLabel> */}

                      <Select
                        id="temp-layout-label"
                        labelId="temp-layout"
                        label="Select Designation"
                        required
                        name="LayoutId"
                        value={templateFormData.LayoutId}
                        onChange={handleChange}
                      >
                        {layoutData.map((layout) => (

                          <MenuItem key={layout.LayoutId} value={layout.LayoutId}>
                            {layout.LayoutName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {error.LayoutId && (
                      <Grid item xs={12} sx={{ mb: 1, pl: 0, pr: 2 }}>
                        <Typography fontSize={13} color="error">{error.LayoutId}</Typography>
                      </Grid>
                    )}
                  </Grid>

                </Grid>

                <Grid container sx={{ pl: 0, pr: 0, mt: 0, }}>
                  <Typography variant='h5' className='title-b' sx={{ mb: 2 }}>
                    Basic Information
                  </Typography>

                  <Grid item xs={4} sx={{ mt: 2, mb: 0, pl: 0, pr: 0 }}>
                    <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>Name</DialogTitle>
                    <Checkbox
                      fullWidth
                      sx={{ p: 0 }}
                      type="checkbox"
                      name="Name"
                      checked={templateFormData.Name}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={4} sx={{ mt: 2, mb: 0, pl: 0, pr: 0 }}>
                    <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>Email</DialogTitle>
                    <Checkbox
                      fullWidth
                      sx={{ p: 0 }}
                      name="Email"
                      checked={templateFormData.Email}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={4} sx={{ mt: 3, mb: 0, pl: 0, pr: 0 }}>
                    <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>Linked In Id</DialogTitle>
                    <Checkbox
                      fullWidth
                      sx={{ p: 0 }}
                      name="LinkedInId"
                      checked={templateFormData.LinkedInId}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={4} sx={{ mt: 3, mb: 0, pl: 0, pr: 0 }}>
                    <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>Mobile no.</DialogTitle>
                    <Checkbox
                      fullWidth
                      sx={{ p: 0 }}
                      name="MobileNo"
                      checked={templateFormData.MobileNo}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={4} sx={{ mt: 2, mb: 0, pl: 0, pr: 0 }}>
                    <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>Profile picture</DialogTitle>
                    <Checkbox
                      fullWidth
                      sx={{ p: 0 }}
                      name="Profilepicture"
                      checked={templateFormData.Profilepicture}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={4} sx={{ mt: 2, mb: 0, pl: 0, pr: 0 }}>
                    <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>Designation</DialogTitle>
                    <Checkbox
                      fullWidth
                      sx={{ p: 0 }}
                      name="Designation"
                      checked={templateFormData.Designation}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>

                <Grid container sx={{ mt: 2, mb: 0, pl: 0, pr: 0 }}>
                  <Typography variant='h5' className='title-b' sx={{ mb: 2 }}>
                    Objective
                  </Typography>
                  <Grid item xs={4} sx={{ mt: 2, mb: 0, pl: 0, pr: 0 }}>
                    <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>Objective Name</DialogTitle>
                    <Checkbox
                      fullWidth
                      sx={{ p: 0 }}
                      name="ObjectiveName"
                      checked={templateFormData.ObjectiveName}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={4} sx={{ mt: 2, mb: 0, pl: 0, pr: 0 }}>
                    <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>Description</DialogTitle>
                    <Checkbox
                      fullWidth
                      sx={{ p: 0 }}
                      name="Description"
                      checked={templateFormData.Description}
                      onChange={handleChange}
                    />
                  </Grid>

                </Grid>

                <Grid container sx={{ mt: 2, mb: 0, pl: 0, pr: 0 }}>
                  <Typography variant='h5' className='title-b' sx={{ mb: 2 }}>
                    Experience
                  </Typography>
                  <Grid item xs={4} sx={{ mt: 2, mb: 0, pl: 0, pr: 0 }}>
                    <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>Company name</DialogTitle>
                    <Checkbox
                      fullWidth
                      sx={{ p: 0 }}
                      name="CompanyName"
                      checked={templateFormData.CompanyName}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={4} sx={{ mt: 2, mb: 0, pl: 0, pr: 0 }}>
                    <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>From date</DialogTitle>
                    <Checkbox
                      fullWidth
                      sx={{ p: 0 }}
                      name="FromDate"
                      checked={templateFormData.FromDate}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={4} sx={{ mt: 2, mb: 0, pl: 0, pr: 0 }}>
                    <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>To date</DialogTitle>
                    <Checkbox
                      fullWidth
                      sx={{ p: 0 }}
                      name="ToDate"
                      checked={templateFormData.ToDate}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={4} sx={{ mt: 2, mb: 0, pl: 0, pr: 0 }}>
                    <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>Skills</DialogTitle>
                    <Checkbox
                      fullWidth
                      sx={{ p: 0 }}
                      name="Skills"
                      checked={templateFormData.Skills}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={4} sx={{ mt: 2, mb: 0, pl: 0, pr: 0 }}>
                    <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>Role</DialogTitle>
                    <Checkbox
                      fullWidth
                      sx={{ p: 0 }}
                      name="Role"
                      checked={templateFormData.Role}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>

                <Grid container sx={{ mt: 2, mb: 0, pl: 0, pr: 0 }}>
                  <Typography variant='h5' className='title-b' sx={{ mb: 2 }}>
                    Education Details
                  </Typography>
                  <Grid item xs={4} sx={{ mt: 2, mb: 0, pl: 0, pr: 0 }}>
                    <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>Institute Name</DialogTitle>
                    <Checkbox
                      fullWidth
                      sx={{ p: 0 }}
                      name="InstituteName"
                      checked={templateFormData.InstituteName}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={4} sx={{ mt: 2, mb: 0, pl: 0, pr: 0 }}>
                    <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>Course Name</DialogTitle>
                    <Checkbox
                      fullWidth
                      sx={{ p: 0 }}
                      name="CourseName"
                      checked={templateFormData.CourseName}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={4} sx={{ mt: 2, mb: 0, pl: 0, pr: 0 }}>
                    <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>Board/University</DialogTitle>
                    <Checkbox
                      fullWidth
                      sx={{ p: 0 }}
                      name="BoardUniversity"
                      checked={templateFormData.BoardUniversity}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={4} sx={{ mt: 2, mb: 0, pl: 0, pr: 0 }}>
                    <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>Percentage/CGPA</DialogTitle>
                    <Checkbox
                      fullWidth
                      sx={{ p: 0 }}
                      name="PercentageCGPA"
                      checked={templateFormData.PercentageCGPA}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={4} sx={{ mt: 2, mb: 0, pl: 0, pr: 0 }}>
                    <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>Passing Year</DialogTitle>
                    <Checkbox
                      fullWidth
                      sx={{ p: 0 }}
                      name="PassingYear"
                      checked={templateFormData.PassingYear}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>

                <Grid container sx={{ mt: 2, mb: 0, pl: 0, pr: 0 }}>
                  <Typography variant='h5' className='title-b' sx={{ mb: 2 }}>
                    Projects
                  </Typography>
                  <Grid item xs={4} sx={{ mt: 2, mb: 0, pl: 0, pr: 0 }}>
                    <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>Project Name</DialogTitle>
                    <Checkbox
                      fullWidth
                      sx={{ p: 0 }}
                      name="ProjectName"
                      checked={templateFormData.ProjectName}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={4} sx={{ mt: 2, mb: 0, pl: 0, pr: 0 }}>
                    <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>Project Summary</DialogTitle>
                    <Checkbox
                      fullWidth
                      sx={{ p: 0 }}
                      name="ProjectSummary"
                      checked={templateFormData.ProjectSummary}
                      onChange={handleChange}
                    />
                  </Grid>

                </Grid>

                <Grid container sx={{ mt: 2, mb: 0, pl: 0, pr: 0 }}>
                  <Typography variant='h5' className='title-b' sx={{ mb: 2 }}>
                    Certification
                  </Typography>
                  <Grid item xs={4} sx={{ mt: 2, mb: 0, pl: 0, pr: 0 }}>
                    <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>Certification Name</DialogTitle>
                    <Checkbox
                      fullWidth
                      sx={{ p: 0 }}
                      name="CertificationName"
                      checked={templateFormData.CertificationName}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={4} sx={{ mt: 2, mb: 0, pl: 0, pr: 0 }}>
                    <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>Issuing Organization</DialogTitle>
                    <Checkbox
                      fullWidth
                      sx={{ p: 0 }}
                      name="IssuingOrganization"
                      checked={templateFormData.IssuingOrganization}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={4} sx={{ mt: 2, mb: 0, pl: 0, pr: 0 }}>
                    <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>Issued Date</DialogTitle>
                    <Checkbox
                      fullWidth
                      sx={{ p: 0 }}
                      name="IssuedDate"
                      checked={templateFormData.IssuedDate}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={4} sx={{ mt: 2, mb: 0, pl: 0, pr: 0 }}>
                    <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>Expiration Date </DialogTitle>
                    <Checkbox
                      fullWidth
                      sx={{ p: 0 }}
                      name="ExpirationDate"
                      checked={templateFormData.ExpirationDate}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={4} sx={{ mt: 2, mb: 0, pl: 0, pr: 0 }}>
                    <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>Description or Details </DialogTitle>
                    <Checkbox
                      fullWidth
                      sx={{ p: 0 }}
                      name="DescriptionDetails"
                      checked={templateFormData.DescriptionDetails}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>

                <Grid container sx={{ mt: 2, mb: 0, pl: 0, pr: 0 }}>
                  <Typography variant='h5' className='title-b' sx={{ mb: 2 }}>
                    Language
                  </Typography>
                  <Grid item xs={4} sx={{ mt: 2, mb: 0, pl: 0, pr: 0 }}>
                    <DialogTitle sx={{ pl: 0, pr: 0, pt: 0, }}>Language Name</DialogTitle>
                    <Checkbox
                      fullWidth
                      sx={{ p: 0 }}
                      name="LanguageName"
                      checked={templateFormData.LanguageName}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>

                <Grid item xs={12} sx={{ mt: -5, mb: 2, pl: 2, pr: 0 }} textAlign={'right'}>

                  <Button variant="contained" color="secondary" className='primary mr-10' type="button" onClick={handleClickOpen} sx={{ mt: 2 }}>
                    Preview
                  </Button>

                  <Button variant="contained" color="primary" className='primary mr-10' type="submit" onClick={handleSubmit} disabled={isLoading} sx={{ mt: 2, ml: 2 }}>
                    {isEdit ? 'Update' : 'Submit'}
                  </Button>
                  <Button variant="contained" color="error" className='warning' onClick={handleCancel} type="button" sx={{ mt: 2, ml: 2 }}>
                    Cancel
                  </Button>
                </Grid>
              </from>
            </Card>

          </Paper>

        }

        {/* Invoke CV Templates Dialog box */}
        <CV_TemplatesDialogBox
          open={open}
          onClose={handleClose}
          templateFormData={templateFormData}
        />
        {/* -------End------- */}

        <Paper sx={{ width: '100%', overflow: 'hidden', mb: 2 }} className='table-card'>
          <Grid container spacing={2} className='table-top-head'>
            <Grid item xs={2} sx={{ mt: 0 }} className='file-upload'>
              <IconButton className='addcss1' onClick={downloadExcel}>
                <img width="15" height="15" src="https://img.icons8.com/ios/50/ms-excel.png" alt="ms-excel" />
              </IconButton>
              <IconButton className='addcss2'>
                <CSVLink data={handleCsvDownload()} filename={'Template_Master.csv'}>
                  <img width="15" height="15" src="https://img.icons8.com/ios/50/csv.png" alt="csv" />
                </CSVLink>
              </IconButton>
              <IconButton className='addcss3' onClick={downloadPDF}>
                <img width="15" height="15" src="https://img.icons8.com/ios/50/pdf--v1.png" alt="pdf--v1" />
              </IconButton>
            </Grid>
            <Grid item xs={5}></Grid>
            <Grid item xs={2} textAlign={'right'}>
              <Button sx={{ mt: 2 }} variant="contained" className='primary' onClick={handleToggle}>
                <AddOutlinedIcon className='add-icon' /> Add
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Box>
                <TextField
                  className='search-css'
                  autoFocus
                  placeholder="Search Template Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={search}
                  onChange={handleSearchChange}
                />
                <SearchIcon className='search-icon' />
              </Box>
            </Grid>
          </Grid>

          {/* -------Start-----------Delete Confrimation box */}
          <ConfirmationDialogBox
            open={isDialogOpen}
            onClose={handleCloseDialog}
            onConfirm={handleConfirmDelete}
            title="Confirm Delete"
            content="Are you sure, you want to delete this record?"
          />
          {/* --------End------- */}

          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="enhanced table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: 50 }}>S.No</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'templateName'}
                      direction={orderBy === 'templateName' ? order : 'asc'}
                      onClick={() => handleRequestSort('templateName')}
                    >
                      Template Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Template Layout</TableCell>
                  <TableCell>Basic Information</TableCell>
                  <TableCell>Objective</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                  <TableRow key={row.templateId}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{row.templateName}</TableCell>
                    <TableCell>{row.layoutName}</TableCell>
                    <TableCell>{row.basicInformation}</TableCell>
                    <TableCell>{row.objective}</TableCell>
                    <TableCell align="right">
      <IconButton className='addcss' onClick={() => handleEdit(row.templateId)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M11 2H9C4 2 2 4 2 9v6c0 5 2 7 7 7h6c5 0 7-2 7-7v-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
          <path d="M16.04 3.02 8.16 10.9c-.3.3-.6.89-.66 1.32l-.43 3.01c-.16 1.09.61 1.85 1.7 1.7l3.01-.43c.42-.06 1.01-.36 1.32-.66l7.88-7.88c1.36-1.36 2-2.94 0-4.94-2-2-3.58-1.36-4.94 0Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
          <path d="M14.91 4.15a7.144 7.144 0 0 0 4.94 4.94" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
      </IconButton>
      <IconButton className='deletecss' onClick={() => handleDeleteClick(row.templateId)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M21 5.98c-3.33-.33-6.68-.5-10.02-.5-1.98 0-3.96.1-5.94.3L3 5.98M8.5 4.97l.22-1.31C8.88 2.71 9 2 10.69 2h2.62c1.69 0 1.82.75 1.97 1.67l.22 1.3M18.85 9.14l-.65 10.07C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14M10.33 16.5h3.33M9.5 12.5h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
      </IconButton>
      <IconButton className='deletecss' onClick={() => handleClickOpenWithId(row.templateId)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M15.58 12c0 1.98-1.6 3.58-3.58 3.58S8.42 13.98 8.42 12s1.6-3.58 3.58-3.58 3.58 1.6 3.58 3.58Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
          <path d="M12 20.27c3.53 0 6.82-2.08 9.11-5.68.9-1.41.9-3.78 0-5.19-2.29-3.6-5.58-5.68-9.11-5.68-3.53 0-6.82 2.08-9.11 5.68-.9 1.41-.9 3.78 0 5.19 2.29 3.6 5.58 5.68 9.11 5.68Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
      </IconButton>
    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box >
    </Box >
  );

}

export default TemplateMaster
