import React from "react";
import { Card } from "antd";

const { Meta } = Card;

const TravelCard = ({ title, location, description, image }) => {
  return (
    <Card
      hoverable
      cover={
        image ? (
          <img alt={title} src={image} className="h-48 w-full object-cover" />
        ) : null
      }
      className="w-full max-w-sm shadow-lg transition-transform duration-300 hover:scale-105"
    >
      <Meta
        title={title}
        description={
          <>
            <p className="text-sm font-semibold text-blue-600 mt-2">
              {location}
            </p>
            <p className="text-gray-600 text-sm">{description}</p>
          </>
        }
      />
    </Card>
  );
};

export default TravelCard;
