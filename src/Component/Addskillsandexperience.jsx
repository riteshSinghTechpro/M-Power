import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Checkbox,
  Box,
  Typography,
  Grid,
  TextField,
} from "@mui/material";
import {
  setSelectedSkills,
  setAllSkill,
  setSelectedTechnologies,
  setAllTechnologies,
  setSelectedTools,
} from "../feature/apiDataSlice";
import Loader from "../Component/Loader";

function Addskillsandexperience() {
  const dispatch = useDispatch();
  const selectedEmployees = useSelector(
    (state) => state.apiData.selectedEmployees
  );
  const selectedSkills = useSelector((state) => state.apiData.selectedSkills);
  const selectedTechnologies = useSelector(
    (state) => state.apiData.selectedTechnologies
  );
  const selectedTools = useSelector((state) => state.apiData.selectedTools);
  
  const [employeeSkills, setEmployeeSkills] = useState({});
  const [skillsOptions, setSkillsOptions] = useState([]);
  const [employeeTechnologies, setEmployeeTechnologies] = useState({});
  const [technologyOptions, setTechnologyOptions] = useState([]);
  const [employeeTools, setEmployeeTools] = useState({});
  const [employeeNames, setEmployeeNames] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSelectedRowsFromLocalStorage = () => {
      const storedSelectedSkills =
        JSON.parse(localStorage.getItem("selectedSkills")) || [];
      return storedSelectedSkills.map((skill) => skill.empCode);
    };

    const initializeSelectedRows = () => {
      const storedSelectedRows = loadSelectedRowsFromLocalStorage();
      setSelectedRows(storedSelectedRows);
    };

    const loadSkillsFromLocalStorage = () => {
      const storedSkills =
        JSON.parse(localStorage.getItem("employeeSkills")) || {};
      setEmployeeSkills(storedSkills);
      return storedSkills;
    };

    const loadTechnologiesFromLocalStorage = () => {
      const storedTechnologies =
        JSON.parse(localStorage.getItem("employeeTechnologies")) || {};
      setEmployeeTechnologies(storedTechnologies);
      return storedTechnologies;
    };
    const loadToolsFromLocalStorage = () => {
      const storedTools =
        JSON.parse(localStorage.getItem("employeeTools")) || {};
      setEmployeeTools(storedTools);
      return storedTools;
    };

    const fetchEmployeeSkills = async () => {
      try {
        const storedSkills = loadSkillsFromLocalStorage();
        const missingEmployees = selectedEmployees.filter(
          (empcode) => !storedSkills[empcode]
        );

        if (missingEmployees.length > 0) {
          const empCodes = missingEmployees.join(",");
          const response = await axios.get(
            `https://staffcentral.azurewebsites.net/api/CreateEmployeeCV/GetCreateEmployeeCVSkillsByEmpCodes?empCodes=${empCodes}`
          );
          const skillsData = response.data.reduce((acc, skill) => {
            acc[skill.empcode] = acc[skill.empcode] || {
              skills: [],
              name: skill.employeeName,
            };
            acc[skill.empcode].skills.push(skill.skillId);
            return acc;
          }, {});

          setEmployeeSkills((prev) => ({ ...prev, ...skillsData }));
          const namesData = response.data.reduce((acc, skill) => {
            acc[skill.empcode] = skill.employeeName;
            return acc;
          }, {});
          setEmployeeNames((prev) => ({ ...prev, ...namesData }));

          localStorage.setItem(
            "employeeSkills",
            JSON.stringify({ ...storedSkills, ...skillsData })
          );
        } else {
          const namesData = Object.keys(storedSkills).reduce((acc, empcode) => {
            acc[empcode] = storedSkills[empcode]?.name;
            return acc;
          }, {});
          setEmployeeNames(namesData);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employee skills:", error);
      }
    };

    const fetchAllSkills = async () => {
      try {
        const response = await axios.get(
          "https://staffcentral.azurewebsites.net/api/SkillMaster/GetAllSkill"
        );
        setSkillsOptions(response.data);
        dispatch(setAllSkill(response.data));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching all skills:", error);
      }
    };

    const fetchEmployeeTechnologies = async () => {
      try {
        const storedTechnologies = loadTechnologiesFromLocalStorage();
        const missingEmployees = selectedEmployees.filter(
          (empcode) => !storedTechnologies[empcode]
        );
        if (missingEmployees.length > 0) {
          const empCodes = missingEmployees.join(",");
          const response = await axios.get(
            `https://staffcentral.azurewebsites.net/api/CreateEmployeeCV/GetCreateEmployeeCVTechnologyByEmpCodes?empCodes=${empCodes}`
          );
          const technologyData = response.data.reduce((acc, tech) => {
            acc[tech.empcode] = acc[tech.empcode] || {
              technologies: [],
              name: tech.employeeName,
            };
            acc[tech.empcode].technologies.push(tech.technologyId);
            return acc;
          }, {});

          setEmployeeTechnologies((prev) => ({
            ...prev,
            ...technologyData,
          }));
          const namesData = response.data.reduce((acc, tech) => {
            acc[tech.empcode] = tech.employeeName;
            return acc;
          }, {});
          setEmployeeNames((prev) => ({ ...prev, ...namesData }));

          localStorage.setItem(
            "employeeTechnologies",
            JSON.stringify({ ...storedTechnologies, ...technologyData })
          );
        } else {
          const namesData = Object.keys(storedTechnologies).reduce(
            (acc, empcode) => {
              acc[empcode] = storedTechnologies[empcode]?.name;
              return acc;
            },
            {}
          );
          setEmployeeNames(namesData);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employee technologies:", error);
      }
    };

    const fetchAllTechnologies = async () => {
      try {
        const response = await axios.get(
          "https://staffcentral.azurewebsites.net/api/Technology/GetTechnologys"
        );
        setTechnologyOptions(response.data);
        dispatch(setAllTechnologies(response.data));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching all technologies:", error);
      }
    };

    const fetchEmployeeTools = async () => {
      try {
        const storedTools = loadToolsFromLocalStorage();
        const missingEmployees = selectedEmployees.filter(
          (empcode) => !storedTools[empcode]
        );

        if (missingEmployees.length > 0) {
          const empCodes = missingEmployees.join(",");
          const response = await axios.get(
            `https://staffcentral.azurewebsites.net/api/CreateEmployeeCV/GetCreateEmployeeSkillTechCVToolsByEmpCodes?empCodes=${empCodes}`
          );
          const toolsData = response.data.reduce((acc, tool) => {
            acc[tool.empcode] = tool.tool || "";
            return acc;
          }, {});

          setEmployeeTools((prev) => ({ ...prev, ...toolsData }));

          localStorage.setItem(
            "employeeTools",
            JSON.stringify({ ...storedTools, ...toolsData })
          );
        } else {
          setEmployeeTools(storedTools);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employee tools:", error);
      }
    };
    initializeSelectedRows();
    fetchEmployeeSkills();
    fetchAllSkills();
    fetchEmployeeTechnologies();
    fetchAllTechnologies();
    fetchEmployeeTools();
  }, [selectedEmployees, dispatch]);

  const handleSkillChange = (empcode) => (event) => {
    const { value } = event.target;
    setEmployeeSkills((prev) => {
      const newSkills = {
        ...prev,
        [empcode]: { ...prev[empcode], skills: value },
      };
      localStorage.setItem("employeeSkills", JSON.stringify(newSkills));

      const updatedCurrentSkills = selectedRows.map((code) => ({
        empCode: code,
        skills: newSkills[code]?.skills || [],
      }));

      dispatch(setSelectedSkills(updatedCurrentSkills));

      setSelectedRows((prev) => prev.filter((code) => code !== empcode));

      return newSkills;
    });
  };

  const handleTechnologyChange = (empcode) => (event) => {
    const { value } = event.target;
    setEmployeeTechnologies((prev) => {
      const newTechnologies = {
        ...prev,
        [empcode]: { ...prev[empcode], technologies: value },
      };

      localStorage.setItem(
        "employeeTechnologies",
        JSON.stringify(newTechnologies)
      );

      const updatedCurrentTechnologies = selectedRows.map((code) => ({
        empCode: code,
        technologies: newTechnologies[code]?.technologies || [],
      }));

      dispatch(setSelectedTechnologies(updatedCurrentTechnologies));

      setSelectedRows((prev) => prev.filter((code) => code !== empcode));

      return newTechnologies;
    });
  };

  const handleCheckboxToggle = (empcode) => {
    const isChecked = !selectedRows.includes(empcode);
    setSelectedRows((prev) => {
      const newSelectedRows = isChecked
        ? [...prev, empcode]
        : prev.filter((code) => code !== empcode);
      const updatedCurrentSkills = newSelectedRows.map((code) => ({
        empCode: code,
        skills: employeeSkills[code]?.skills || [],
      }));
      const updatedCurrentTechnologies = newSelectedRows.map((code) => ({
        empCode: code,
        technologies: employeeTechnologies[code]?.technologies || [],
      }));
      const updatedCurrentTools = newSelectedRows.map((code) => ({
        empCode: code,
        tool: employeeTools[code] || "",
      }));

      dispatch(setSelectedSkills(updatedCurrentSkills));
      dispatch(setSelectedTechnologies(updatedCurrentTechnologies));
      dispatch(setSelectedTools(updatedCurrentTools));

      localStorage.setItem(
        "selectedSkills",
        JSON.stringify(updatedCurrentSkills)
      );
      localStorage.setItem(
        "selectedTechnologies",
        JSON.stringify(updatedCurrentTechnologies)
      );
      localStorage.setItem(
        "selectedTools",
        JSON.stringify(updatedCurrentTools)
      );

      return newSelectedRows;
    });
  };

  const skillIdToName = skillsOptions.reduce((acc, skill) => {
    acc[skill.skillId] = skill.name;
    return acc;
  }, {});

  const technologyIdToName = technologyOptions.reduce((acc, technology) => {
    acc[technology.technologyId] = technology.technologyName;
    return acc;
  }, {});
  const handleToolsChange = (empcode) => (event) => {
    const newToolValue = event.target.value;
    setEmployeeTools((prev) => ({
      ...prev,
      [empcode]: newToolValue,
    }));

    localStorage.setItem(
      "employeeTools",
      JSON.stringify({
        ...employeeTools,
        [empcode]: newToolValue,
      })
    );
    dispatch(setSelectedTools({ empcode, tools: newToolValue }));
  };
  return (
    <Box>
      {loading ? (
        <Loader />
      ) : (
        <Grid container spacing={2}>
          {selectedEmployees.map((empcode) => (
            <Grid item xs={12} key={empcode}>
              <Typography variant="h6" className="skill-label-text">
                {employeeNames[empcode]}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Skills</InputLabel>
                    <Select
                      multiple
                      value={employeeSkills[empcode]?.skills || []}
                      onChange={handleSkillChange(empcode)}
                      input={<OutlinedInput label="Skills" />}
                      renderValue={(selected) =>
                        selected.map((id) => skillIdToName[id]).join(", ")
                      }
                    >
                      {skillsOptions.map((skill) => (
                        <MenuItem key={skill.skillId} value={skill.skillId}>
                          <Checkbox
                            checked={
                              employeeSkills[empcode]?.skills?.indexOf(
                                skill.skillId
                              ) > -1
                            }
                          />
                          {skill.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Technologies</InputLabel>
                    <Select
                      multiple
                      value={employeeTechnologies[empcode]?.technologies || []}
                      onChange={handleTechnologyChange(empcode)}
                      input={<OutlinedInput label="Technologies" />}
                      renderValue={(selected) =>
                        selected.map((id) => technologyIdToName[id]).join(", ")
                      }
                    >
                      {technologyOptions.map((technology) => (
                        <MenuItem
                          key={technology.technologyId}
                          value={technology.technologyId}
                        >
                          <Checkbox
                            checked={
                              employeeTechnologies[
                                empcode
                              ]?.technologies?.indexOf(
                                technology.technologyId
                              ) > -1
                            }
                          />
                          {technology.technologyName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Tools"
                    value={employeeTools[empcode] || ""}
                    onChange={handleToolsChange(empcode)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Checkbox
                    checked={selectedRows.includes(empcode)}
                    onChange={() => handleCheckboxToggle(empcode)}
                  />
                  Select Employee
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default Addskillsandexperience;
