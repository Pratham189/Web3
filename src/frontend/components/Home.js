import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Row, Col, Card, Button } from 'react-bootstrap';
import './Home.css'; 

const Home = ({ marketplace, nft }) => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const loadMarketplaceItems = async () => {
    try {
      const itemCount = await marketplace.itemCount();
      console.log("Item count:", itemCount);
  
      let items = [];
      for (let i = 1; i <= itemCount; i++) {
        console.log("Fetching item:", i);
        const item = await marketplace.items(i);
        console.log("Fetched item:", item);
      }
  
      console.log("Items:", items);
      setLoading(false);
      setItems(items);
    } catch (error) {
      console.error("Error loading marketplace items:", error);
      setLoading(false);
    }
  };
  

  const buyMarketItem = async (item) => {
    await (await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })).wait();
    loadMarketplaceItems();
  };

  useEffect(() => {
    loadMarketplaceItems();
  }, []);

  if (loading) {
    return (
      <main style={{ padding: '1rem 0' }}>
        <h2>Loading...</h2>
      </main>
    );
  }

  return (
    <div className="custom-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for items..."
          value={searchTerm}
          onChange={handleSearch}
          className="form-control"
        />
      </div>
      {filteredItems.length > 0 ? (
        <Row xs={1} md={2} lg={4} className="g-4 py-5">
          {filteredItems.map((item, idx) => (
            <Col key={idx} className="overflow-hidden">
              <Card className="custom-card">
                <Card.Img variant="top" src={item.image} className="custom-card-img" />
                <Card.Body>
                  <Card.Title className="custom-card-title">{item.name}</Card.Title>
                  <Card.Text className="custom-card-description">{item.description}</Card.Text>
                </Card.Body>
                <Card.Footer>
                  <div className="d-grid">
                    <Button onClick={() => buyMarketItem(item)} variant="primary" size="lg">
                      Buy for {ethers.utils.formatEther(item.totalPrice)} ETH
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <main style={{ padding: '1rem 0' }}>
          <h2>No listed assets</h2>
        </main>
      )}
    </div>
  );
};

export default Home;
