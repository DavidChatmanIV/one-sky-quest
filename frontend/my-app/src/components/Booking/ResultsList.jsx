import React from "react";
import { Card, Row, Col, Typography, Rate, Tag, Empty } from "antd";

const { Title } = Typography;

const ResultsList = ({ title = "Results", results = [], type = "stay" }) => {
  const getStars = (stars) => <Rate disabled defaultValue={stars || 4} />;

  const renderCard = (item) => {
    return (
      <Card
        key={item.id || item._id || item.name}
        className="hover:shadow-xl transition duration-300"
        cover={
          <img
            alt={item.name}
            src={item.image || "https://via.placeholder.com/400x250"}
            className="h-40 object-cover rounded-t-md"
          />
        }
      >
        <Title level={5}>{item.name}</Title>
        {item.location && <p>{item.location}</p>}

        {type === "stay" && (
          <>
            <p>{getStars(item.stars)}</p>
            <p className="text-blue-600 font-semibold mt-1">
              ${item.price} / night
            </p>
          </>
        )}

        {type === "flight" && (
          <>
            <p>
              {item.from} → {item.to}
            </p>
            <p>
              🕒 {item.departureTime} – {item.arrivalTime}
            </p>
            <p>Duration: {item.duration}</p>
            <p className="text-blue-600 font-semibold mt-1">${item.price}</p>
          </>
        )}

        {type === "car" && (
          <>
            <p>
              {item.company} {item.model}
            </p>
            <p>Seats: {item.seats}</p>
            <p>⭐ {item.rating}</p>
            <p className="text-blue-600 font-semibold mt-1">
              ${item.price} / day
            </p>
          </>
        )}

        {type === "package" && (
          <>
            <Tag color="blue">{item.type}</Tag>
            <p className="text-blue-600 font-semibold mt-1">${item.price}</p>
          </>
        )}
      </Card>
    );
  };

  return (
    <section className="max-w-6xl mx-auto mt-12 px-4">
      <Title level={3} className="text-blue-700 mb-4 text-center">
        {title}
      </Title>

      {results.length > 0 ? (
        <Row gutter={[16, 16]}>
          {results.map((item) => (
            <Col xs={24} sm={12} md={8} key={item.id || item._id || item.name}>
              {renderCard(item)}
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description={`No ${type}s found.`} />
      )}
    </section>
  );
};

export default ResultsList;
