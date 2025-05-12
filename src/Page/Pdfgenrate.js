import React, { useState } from 'react';
import { Button, Card, CardContent, FormControl, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';

function Pdfgenrate() {
  const [deviceId, setDeviceId] = useState('');
  const [device, setDevice] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [country, setCountry] = useState('');
  const [timezone, setTimezone] = useState('');
  const [dataOption, setDataOption] = useState('temperature');
  const [interval, setInterval] = useState('');
  const [aggregation, setAggregation] = useState('mean');

  const handleSee = () => {
 
    console.log("See button clicked with form data:", {
      deviceId,
      device,
      startTime,
      endTime,
      country,
      timezone,
      dataOption,
      interval,
      aggregation
    });
  };

  const handleRefresh = () => {
  
    console.log("Refresh button clicked with form data:", {
      deviceId,
      device,
      startTime,
      endTime,
      country,
      timezone,
      dataOption,
      interval,
      aggregation
    });
  };

  const handleSubmit = () => {

    console.log("Submit button clicked with form data:", {
      deviceId,
      device,
      startTime,
      endTime,
      country,
      timezone,
      dataOption,
      interval,
      aggregation
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Typography variant="h4" gutterBottom>Data Explorer through PDF</Typography>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography>ID</Typography>
                <TextField
                  fullWidth
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography>Select Device</Typography>
                <FormControl fullWidth>
                  <Select
                    value={device}
                    onChange={(e) => setDevice(e.target.value)}
                  >
                    <MenuItem value="device1">Device 1</MenuItem>
                    <MenuItem value="device2">Device 2</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" onClick={handleSee}>See</Button>
                <Button variant="contained" onClick={handleRefresh} style={{ marginLeft: '10px' }}>Refresh</Button>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Start Time"
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="End Time"
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Select Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Select Time Zone"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <Typography>Temp or Humidity</Typography>
                  <Select
                    value={dataOption}
                    onChange={(e) => setDataOption(e.target.value)}
                  >
                    <MenuItem value="temperature">Temperature</MenuItem>
                    <MenuItem value="humidity">Humidity</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Interval in min"
                  type="number"
                  value={interval}
                  onChange={(e) => setInterval(e.target.value)}
                  InputProps={{ inputProps: { min: 1 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography>Aggregation</Typography>
                <FormControl fullWidth>
                
                  <Select
                    value={aggregation}
                    onChange={(e) => setAggregation(e.target.value)}
                  >
                    <MenuItem value="mean">Mean</MenuItem>
                    <MenuItem value="sum">Sum</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" onClick={handleSubmit}>Submit</Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        {/* Second half of the content */}
      </Grid>
    </Grid>
  );
}

export default Pdfgenrate;
