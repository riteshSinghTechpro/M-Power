import { Card, CardContent, CardHeader, Grid, Typography } from '@mui/material'
import React from 'react'
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import HailOutlinedIcon from '@mui/icons-material/HailOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';

function CardTop() {
  return (
    <Grid container spacing={3}>
    <Grid item xs={3}>
    <Card className='card-css l-bg-green-dark'>
      <CardContent className='card-cont'>
        <Typography className='card-content-title' variant="h3" component="div">
          500
        </Typography>
        <CardHeader className='card-title'
        title="Total Employees"
      />
      {<Person2OutlinedIcon sx={{ fontSize: 48 }} className='icon-bg1' />}
      </CardContent>
    </Card>
    </Grid>

    <Grid item xs={3}>
    <Card className='card-css l-bg-green-dark'>
      <CardContent className='card-cont'>
        <Typography className='card-content-title' variant="h3" component="div">
          250
        </Typography>
        <CardHeader className='card-title'
        title="Total Client"
      />
       {<HailOutlinedIcon sx={{ fontSize: 48 }} className='icon-bg2' />}
      </CardContent>
    </Card>
    </Grid>

    <Grid item xs={3}>
    <Card className='card-css l-bg-green-dark'>
      <CardContent className='card-cont'>
        <Typography className='card-content-title' variant="h3" component="div">
          350
        </Typography>
        <CardHeader className='card-title'
        title="Shared CV's"
      />
      {<ArticleOutlinedIcon sx={{ fontSize: 48 }} className='icon-bg3' />}
      </CardContent>
    </Card>
    </Grid>

    <Grid item xs={3}>
    <Card className='card-css l-bg-green-dark'>
      <CardContent className='card-cont'>
        <Typography className='card-content-title' variant="h3" component="div">
          200
        </Typography>
        <CardHeader className='card-title'
        title="Shortlisted CV's"
      />
      {<ArticleOutlinedIcon sx={{ fontSize: 48 }} className='icon-bg4' />}
      </CardContent>
    </Card>
    </Grid>

  </Grid>
  )
}

export default CardTop
