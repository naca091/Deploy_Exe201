import React from 'react';
import { Carousel } from 'antd';

const Banner = () => {
  return (
    <Carousel autoplay>
      <div>
        <img 
          src="/api/placeholder/1200/300" 
          alt="Banner 1"
          style={{ width: '100%', height: '300px', objectFit: 'cover' }}
        />
      </div>
      {/* Add more banner images as needed */}
    </Carousel>
  );
};