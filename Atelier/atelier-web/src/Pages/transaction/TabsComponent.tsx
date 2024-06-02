import React, { useState } from 'react';
import { AppBar, Tabs, Tab, Typography, Box } from '@mui/material';
import TransactionComponent from './TransactionsComponent';
import CartComponent from './CartComponent';
import Header from "../../Header";
import './TabStyle.css';

const TabsComponent: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <Header/>
      <AppBar position="static">
        <Tabs value={selectedTab} onChange={handleChange} aria-label="tabs" className='tab-container'>
          <Tab label="Transaction" />
          <Tab label="Cart" />
        </Tabs>
      </AppBar>
      <TabPanel value={selectedTab} index={0}>
        <TransactionComponent />
      </TabPanel>
      <TabPanel value={selectedTab} index={1}>
        <CartComponent />
      </TabPanel>
    </Box>
  );
};

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

export default TabsComponent;
