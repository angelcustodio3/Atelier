// TransactionComponent.tsx
import React from 'react';
import { Card, CardContent, Typography, Button, CardMedia } from '@mui/material';
import './TransactionStyle.css'; // Import CSS file

const TransactionsComponent: React.FC = () => {
  // Dummy data, replace with actual data
  const transactions = [
    { id: 1, image: '/path/to/image1.jpg', name: 'Product 1', owner: 'Seller 1', date: '2024-10-01', price: '$10', status: 'Pending' },
    { id: 2, image: '/path/to/image2.jpg', name: 'Product 2', owner: 'Seller 2', date: '2024-10-02', price: '$20', status: 'Delivered' },
  ];

  return (
    <div className="transaction-container">
      {transactions.map((transaction) => (
        <Card key={transaction.id} className="transaction-card">
          <CardMedia className="item-image" component="img" height="140" image={transaction.image} alt={transaction.name} />
          <CardContent className="item-details">
            <Typography variant="h5" component="div" className="item-name">
              {transaction.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" className="item-owner">
              Owner: {transaction.owner}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Date: {transaction.date}
            </Typography>
            <Typography variant="body2" color="text.secondary" className="item-price">
              Price: {transaction.price}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Status: {transaction.status}
            </Typography>
            <div className="item-buttons">
              <Button size="small">Action</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TransactionsComponent;
