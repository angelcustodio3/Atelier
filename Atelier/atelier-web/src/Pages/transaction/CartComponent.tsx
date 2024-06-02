// CartComponent.tsx
import React from 'react';
import { Card, CardContent, Typography, Button, CardMedia } from '@mui/material';
// import './CartComponent.css'; 
import './TransactionStyle.css'; 
const CartComponent: React.FC = () => {
  // Dummy data, replace with actual data
  const cartItems = [
    { id: 1, image: '/path/to/image1.jpg', name: 'Product 1', owner: 'Seller 1', price: '$10' },
    { id: 2, image: '/path/to/image2.jpg', name: 'Product 2', owner: 'Seller 2', price: '$20' },
  ];

  return (
    <div className="cart-container">
      {cartItems.map((item) => (
        <Card key={item.id} className="cart-card">
          <CardMedia className="item-image" component="img" height="140" image={item.image} alt={item.name} />
          <CardContent className="item-details">
            <Typography variant="h5" component="div" className="item-name">
              {item.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" className="item-owner">
              Owner: {item.owner}
            </Typography>
            <Typography variant="body2" color="text.secondary" className="item-price">
              Price: {item.price}
            </Typography>
            <div className="item-buttons">
              <Button variant="contained" color="primary" size="small">Buy</Button>
              <Button variant="contained" color="secondary" size="small">Delete</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CartComponent;
