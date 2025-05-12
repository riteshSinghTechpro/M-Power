import React, {useRef} from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { Grid, Typography, Box, Button, DialogTitle, IconButton, Avatar, Chip, Divider, Paper, Container } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function CV_TemplatesDialogBox({ open, onClose, templateFormData }) {

    const componentRef = useRef();

    const handleDownloadPdf = async () => {
        const element = componentRef.current;
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 4.2, canvas.height / 6);
        pdf.save("resume.pdf");
    };

    return (
        <BootstrapDialog
            open={open}
            onClose={onClose}
            aria-labelledby="customized-dialog-title"
        >
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                Template Layout
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>

            <DialogContent dividers sx={{ overflow: 'visible' }} ref={componentRef}>
                {(templateFormData.LayoutId === 1) && <Container maxWidth="md">
                    <Paper elevation={0} sx={{ padding: 0, marginTop: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
                            {templateFormData.Profilepicture && <Avatar alt="John Doe" src="/static/images/avatar/1.jpg" sx={{ width: 100, height: 100, marginRight: 3 }} />}
                            <Box>
                                {templateFormData.Name && <Typography variant="h4" gutterBottom>
                                    Name
                                </Typography>
                                }
                                {templateFormData.Designation && <Typography variant="h6" gutterBottom>
                                    Designation
                                </Typography>
                                }
                                <Typography variant="body1" gutterBottom>
                                    {templateFormData.Email && <span>Email</span>} {templateFormData.MobileNo && <span>| MobileNo</span>} {templateFormData.LinkedInId && <span>| LinkedIn Id</span>}
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ marginY: 3 }} />

                        <Box sx={{ marginBottom: 3 }}>
                            <Typography variant="h5" gutterBottom>
                                Objective
                            </Typography>
                            <Grid container spacing={1}>
                                {templateFormData.ObjectiveName && <Grid item xs={6}>
                                    <Typography variant="body2">Objective Name</Typography>
                                </Grid>
                                }
                                {templateFormData.Description && <Grid item xs={6}>
                                    <Typography variant="body2">Description</Typography>
                                </Grid>
                                }
                            </Grid>
                        </Box>

                        <Divider sx={{ marginY: 3 }} />

                        <Box sx={{ marginBottom: 3 }}>
                            <Typography variant="h5" gutterBottom>
                                Experience
                            </Typography>
                            <Grid container spacing={1}>
                                {templateFormData.CompanyName && <Grid item xs={6}>
                                    <Typography variant="body2">Company Name</Typography>
                                </Grid>
                                }
                                {templateFormData.FromDate && <Grid item xs={6}>
                                    <Typography variant="body2">From date</Typography>
                                </Grid>
                                }
                                {templateFormData.ToDate && <Grid item xs={6}>
                                    <Typography variant="body2">To date</Typography>
                                </Grid>
                                }
                                {templateFormData.Skills && <Grid item xs={6}>
                                    <Typography variant="body2">Skills</Typography>
                                </Grid>
                                }
                                {templateFormData.Role && <Grid item xs={6}>
                                    <Typography variant="body2">Role</Typography>
                                </Grid>
                                }
                            </Grid>
                        </Box>

                        <Divider sx={{ marginY: 3 }} />

                        <Box sx={{ marginBottom: 3 }}>
                            <Typography variant="h5" gutterBottom>
                                Education Details
                            </Typography>
                            <Grid container spacing={1}>
                                {templateFormData.InstituteName && <Grid item xs={6}>
                                    <Typography variant="body2">Institute Name</Typography>
                                </Grid>
                                }
                                {templateFormData.CourseName && <Grid item xs={6}>
                                    <Typography variant="body2">Course Name</Typography>
                                </Grid>
                                }
                                {templateFormData.BoardUniversity && <Grid item xs={6}>
                                    <Typography variant="body2">Board/University</Typography>
                                </Grid>
                                }
                                {templateFormData.PercentageCGPA && <Grid item xs={6}>
                                    <Typography variant="body2">Percentage/CGPA</Typography>
                                </Grid>
                                }
                                {templateFormData.PassingYear && <Grid item xs={6}>
                                    <Typography variant="body2">Passing Year</Typography>
                                </Grid>
                                }
                            </Grid>
                        </Box>

                        <Divider sx={{ marginY: 3 }} />

                        <Box sx={{ marginBottom: 3 }}>
                            <Typography variant="h5" gutterBottom>
                                Projects
                            </Typography>
                            <Grid container spacing={1}>
                                {templateFormData.ProjectName && <Grid item xs={6}>
                                    <Typography variant="body2">Project Name</Typography>
                                </Grid>
                                }
                                {templateFormData.ProjectSummary && <Grid item xs={6}>
                                    <Typography variant="body2">Project Summary</Typography>
                                </Grid>
                                }
                            </Grid>
                        </Box>

                        <Divider sx={{ marginY: 3 }} />

                        <Box sx={{ marginBottom: 3 }}>
                            <Typography variant="h5" gutterBottom>
                                Certification
                            </Typography>
                            <Grid container spacing={1}>
                                {templateFormData.CertificationName && <Grid item xs={6}>
                                    <Typography variant="body2">Certification Name</Typography>
                                </Grid>
                                }
                                {templateFormData.IssuingOrganization && <Grid item xs={6}>
                                    <Typography variant="body2">Issuing Organization</Typography>
                                </Grid>
                                }
                                {templateFormData.IssuedDate && <Grid item xs={6}>
                                    <Typography variant="body2">Issued Date</Typography>
                                </Grid>
                                }
                                {templateFormData.ExpirationDate && <Grid item xs={6}>
                                    <Typography variant="body2">Expiration Date</Typography>
                                </Grid>
                                }
                                {templateFormData.DescriptionDetails && <Grid item xs={6}>
                                    <Typography variant="body2">Description or Details</Typography>
                                </Grid>
                                }
                            </Grid>
                        </Box>

                        <Divider sx={{ marginY: 3 }} />

                        <Box sx={{ marginBottom: 3 }}>
                            <Typography variant="h5" gutterBottom>
                                Language
                            </Typography>
                            {templateFormData.LanguageName && <Typography variant="body2">
                                Language Name
                            </Typography>
                            }
                        </Box>

                    </Paper>
                </Container>
                }

                {(templateFormData.LayoutId === 2) && <Container maxWidth="md">
                    <Paper elevation={0} sx={{ padding: 0, marginTop: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
                            {templateFormData.Profilepicture && <Avatar alt="John Doe" src="/static/images/avatar/1.jpg" sx={{ width: 100, height: 100, marginRight: 3 }} />}
                            <Box>
                                {templateFormData.Name && <Typography variant="h4" gutterBottom sx={{ color: '#1976d2' }}>
                                    Name
                                </Typography>
                                }
                                {templateFormData.Designation && <Typography variant="h6" gutterBottom sx={{ color: '#424242' }}>
                                    Designation
                                </Typography>
                                }
                                <Typography variant="body1" gutterBottom sx={{ color: '#757575' }}>
                                    {templateFormData.Email && <span>Email</span>} {templateFormData.MobileNo && <span>| MobileNo</span>} {templateFormData.LinkedInId && <span>| LinkedIn Id</span>}
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ marginY: 3 }} />

                        <Box sx={{ marginBottom: 3 }}>
                            <Typography variant="h5" gutterBottom sx={{ color: '#1976d2' }}>
                                Objective
                            </Typography>
                            <Grid container spacing={1}>
                                {templateFormData.ObjectiveName && <Grid item xs={6}>
                                    <Typography variant="body1" sx={{ color: '#424242' }}>Objective Name</Typography>
                                </Grid>
                                }
                                {templateFormData.Description && <Grid item xs={6}>
                                    <Typography variant="body1" sx={{ color: '#424242' }}>Description</Typography>
                                </Grid>
                                }
                            </Grid>
                        </Box>

                        <Divider sx={{ marginY: 3 }} />

                        <Box sx={{ marginBottom: 3 }}>
                            <Typography variant="h5" gutterBottom sx={{ color: '#1976d2' }}>
                                Experience
                            </Typography>
                            <Grid container spacing={1}>
                                {templateFormData.CompanyName && <Grid item xs={6}>
                                    <Typography variant="body2">Company Name</Typography>
                                </Grid>
                                }
                                {templateFormData.FromDate && <Grid item xs={6}>
                                    <Typography variant="body2">From date</Typography>
                                </Grid>
                                }
                                {templateFormData.ToDate && <Grid item xs={6}>
                                    <Typography variant="body2">To date</Typography>
                                </Grid>
                                }
                                {templateFormData.Skills && <Grid item xs={6}>
                                    <Typography variant="body2">Skills</Typography>
                                </Grid>
                                }
                                {templateFormData.Role && <Grid item xs={6}>
                                    <Typography variant="body2">Role</Typography>
                                </Grid>
                                }
                            </Grid>
                        </Box>

                        <Divider sx={{ marginY: 3 }} />

                        <Box sx={{ marginBottom: 3 }}>
                            <Typography variant="h5" gutterBottom sx={{ color: '#1976d2' }}>
                                Education Details
                            </Typography>
                            <Grid container spacing={1}>
                                {templateFormData.CourseName && <Grid item xs={6}>
                                    <Typography variant="body2">Course Name</Typography>
                                </Grid>
                                }
                                {templateFormData.InstituteName && <Grid item xs={6}>
                                    <Typography variant="body2">Institute Name</Typography>
                                </Grid>
                                }
                                {templateFormData.BoardUniversity && <Grid item xs={6}>
                                    <Typography variant="body2">Board/University</Typography>
                                </Grid>
                                }
                                {templateFormData.PercentageCGPA && <Grid item xs={6}>
                                    <Typography variant="body2">Percentage/CGPA</Typography>
                                </Grid>
                                }
                                {templateFormData.PassingYear && <Grid item xs={6}>
                                    <Typography variant="body2">Passing Year</Typography>
                                </Grid>
                                }
                            </Grid>

                        </Box>

                        <Divider sx={{ marginY: 3 }} />

                        <Box sx={{ marginBottom: 3 }}>
                            <Typography variant="h5" gutterBottom sx={{ color: '#1976d2' }}>
                                Projects
                            </Typography>
                            <Grid container spacing={1}>
                                {templateFormData.ProjectName && <Grid item xs={6}>
                                    <Typography variant="body2">Project Name</Typography>
                                </Grid>
                                }
                                {templateFormData.ProjectSummary && <Grid item xs={6}>
                                    <Typography variant="body2">Project Summary</Typography>
                                </Grid>
                                }
                            </Grid>
                        </Box>

                        <Divider sx={{ marginY: 3 }} />

                        <Box sx={{ marginBottom: 3 }}>
                            <Typography variant="h5" gutterBottom sx={{ color: '#1976d2' }}>
                                Certification
                            </Typography>
                            <Grid container spacing={1}>
                                {templateFormData.CertificationName && <Grid item xs={6}>
                                    <Typography variant="body2">Certification Name</Typography>
                                </Grid>
                                }
                                {templateFormData.IssuingOrganization && <Grid item xs={6}>
                                    <Typography variant="body2">Issuing Organization</Typography>
                                </Grid>
                                }
                                {templateFormData.IssuedDate && <Grid item xs={6}>
                                    <Typography variant="body2">Issued Date</Typography>
                                </Grid>
                                }
                                {templateFormData.ExpirationDate && <Grid item xs={6}>
                                    <Typography variant="body2">Expiration Date</Typography>
                                </Grid>
                                }
                                {templateFormData.DescriptionDetails && <Grid item xs={6}>
                                    <Typography variant="body2">Description or Details</Typography>
                                </Grid>
                                }
                            </Grid>
                        </Box>

                        {templateFormData.Skills && <Divider sx={{ marginY: 3 }} />}

                        {templateFormData.Skills && <Box sx={{ marginBottom: 3 }}>
                            <Typography variant="h5" gutterBottom sx={{ color: '#1976d2' }}>
                                Skills & Technologies
                            </Typography>
                            <Grid container spacing={1}>
                                <Grid item>
                                    <Chip label="Skills" />
                                </Grid>
                                <Grid item>
                                    <Chip label="Technologies" />
                                </Grid>
                                <Grid item>
                                    <Chip label="Tools" />
                                </Grid>                              
                            </Grid>
                        </Box>
                        }

                        <Divider sx={{ marginY: 3 }} />

                        <Box sx={{ marginBottom: 3 }}>
                            <Typography variant="h5" gutterBottom sx={{ color: '#1976d2' }}>
                                Language
                            </Typography>
                            {templateFormData.LanguageName && <Typography variant="body2">
                                Language Name
                            </Typography>
                            }
                        </Box>
                    </Paper>
                </Container>
                }
            </DialogContent> 

            <DialogActions>
                <Button onClick={() => handleDownloadPdf()} className='primary mr-10' variant="contained">
                    Download as PDF
                </Button>
                <Button onClick={() => onClose()}  className='warning' variant="contained">
                    Close
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
}
