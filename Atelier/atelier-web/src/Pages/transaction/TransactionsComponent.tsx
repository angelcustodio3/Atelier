import React, { useState } from 'react';
// import { auth } from "../../../FirebaseConfig";
import { Drawer, List, ListItem, ListItemText } from '@mui/material';
// import MessagesComponent from './MessagesComponent';
// import TransactionsComponent from './TransactionsComponent';
import { Card, CardContent, Typography, Select, MenuItem, FormControl, InputLabel, CardMedia } from '@mui/material';


interface TransactionItemProps {
    id: number;
    image: string;
    name: string;
    owner: string;
    date: string;
    price: string;
    status: string;
    onStatusChange: (id: number, status: string) => void;
  }

const TransactionsComponent: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<'messages' | 'transactions'>('messages');

  const handleOptionSelect = (option: 'messages' | 'transactions') => {
    setSelectedOption(option);
  };


  return (
    <div>
      {/* Display list of transactions */}
      <h1>Transactions</h1>
      {/* Transaction list */}
    </div>
  );
};

export default TransactionsComponent;