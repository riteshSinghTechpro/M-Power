import { createSlice } from '@reduxjs/toolkit';

const apiDataSlice = createSlice({
  name: 'apiData',
  initialState: {
    selectedEmployees: [], 
    selectedObjectiveDetails: [],
    selectedExperienceDetails: [], 
    selectedProjectDetails: [],
    selectedSkills: {}, 
    allSkill:{},
    allTechnology:{},
    selectedTechnologies: {},
    selectedTools: {},
    selectedClientName:{},
    selectedTemplateName: {},
    selectedpdfData: {},
    selectedBasicInformation:{},
    selectedEducationDetails:[],
    selectedEmployeeCode:"",
    selectedEmpCVDataInfo: [],
    templateData: null,
    cvEmployeeCode:"",
  },
  reducers: {
    setSelectedEmployees: (state, action) => {
      state.selectedEmployees = action.payload;
    },
    setSelectedObjectiveDetails: (state, action) => {
      state.selectedObjectiveDetails = action.payload;
    },
    setSelectedExperienceDetails: (state, action) => {
      state.selectedExperienceDetails = action.payload; 
    },
    setSelectedProjectDetails: (state, action) => {
      state.selectedProjectDetails = action.payload;
    },
    setSelectedSkills: (state, action) => {
      state.selectedSkills = action.payload;
    },
    setSelectedTechnologies: (state, action) => {
      state.selectedTechnologies = action.payload;
    },
    setSelectedTools: (state, action) => {
      state.selectedTools = action.payload;
    },
    setSelectedClientName: (state, action) => {
      state.selectedClientName = action.payload;
    },
    setSelectedTemplateName: (state, action) => {
      state.selectedTemplateName = action.payload;
    },
    setSelectedpdfData: (state, action) => {
      state.selectedpdfData = action.payload;
    },
    setSelectedBasicInformation: (state, action) => {
      state.selectedBasicInformation = action.payload;
    },
    setAllSkill: (state, action) => {
      state.allSkill = action.payload;
    },
    setAllTechnologies:(state, action) => {
      state.allTechnology = action.payload;
    },
    setSelectedEducationDetails:(state, action) => {
      state.selectedEducationDetails = action.payload;
    },
    setSelectedEmployeeCode:(state, action) => {
      state.selectedEmployeeCode = action.payload;
    },

    setSelectedEmpCVDataInfo:(state, action) => {
      state.selectedEmpCVDataInfo = action.payload;
    },
    setTemplateData: (state, action) => {
      state.templateData = action.payload;
    },
    setCvEmployeeCode: (state, action) => {
      state.cvEmployeeCode = action.payload;
    },
  },
});

export const { setSelectedEmployees, setSelectedExperienceDetails, setSelectedProjectDetails, setSelectedSkills, setSelectedTechnologies, setSelectedTools, setSelectedClientName, setSelectedTemplateName, setSelectedpdfData, setSelectedBasicInformation, setSelectedObjectiveDetails, setAllSkill, setAllTechnologies, setSelectedEducationDetails, setSelectedEmployeeCode, setSelectedEmpCVDataInfo, setTemplateData, setCvEmployeeCode } = apiDataSlice.actions;
export default apiDataSlice.reducer;

