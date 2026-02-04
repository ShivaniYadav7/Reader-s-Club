import React from 'react';
import { Card, CardActionArea, CardContent, Typography, Box } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const CreateCard = ({ title, onClick }) => {
  return (
    <Card variant="outlined" sx={{ borderStyle: 'dashed', minHeight: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CardActionArea onClick={onClick} sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <AddCircleOutlineIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
        <CardContent>
          <Typography variant="h6" align="center" color="primary" fontWeight={600}>
            {title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CreateCard;
