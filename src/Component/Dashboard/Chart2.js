import React from 'react';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';
import { Card, Grid, CardContent, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Total Employees', value: 500 },
  { name: 'Total Shared CV', value: 350 },
  { name: 'Total Shortlisted CV', value: 200 },
];

const databar = [
  { name: 'Total Employees', uv: 4500, amt: 550 },
  { name: 'Total Client', uv: 3000, amt: 2210 },
  { name: 'Total Projects', uv: 1500, amt: 2510 },
  { name: 'Total Shared CV', uv: 1500, amt: 2510 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
function Chart2() {
  return (  
    <div>
      <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={6} >
            <Card >
      <CardContent className='chart-card'>
        <Typography className='chart-title' variant="h6" sx={{ mt: 1 }} component="div">
          Pie Chart
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
            </Grid>
            <Grid item xs={6}>
            <Card>
              <CardContent className='chart-card'>
                <Typography className='chart-title' variant="h6" sx={{ mt: 1, pb:2, }}  component="div">
                  Bar Chart
                </Typography>
                <ResponsiveContainer width="100%" height={385}>
                <BarChart data={databar}>
                  <CartesianGrid strokeDasharray="4 4" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="pv" fill="#8884d8" />
                  <Bar dataKey="uv" fill="#82ca9d" />
                </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            </Grid>
        </Grid>
    </div>
  )
}

export default Chart2
