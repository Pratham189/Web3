import { Link } from "react-router-dom";
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import nftLogo from './NFT.webp';

const Navigation = ({ web3Handler, account }) => {
    return (
        <Navbar expand="lg" bg="dark" variant="dark" className="custom-navbar">
            <Container>
                <Navbar.Brand as={Link} to="/" className="custom-brand">
                    <img src={nftLogo} alt="NFT Logo" className="logo-img" style={{ maxHeight: '40px', maxWidth: '40px' }} />
                    NFT Marketplace
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/" className="custom-nav-link">Home</Nav.Link>
                        <Nav.Link as={Link} to="/create" className="custom-nav-link">Create</Nav.Link>
                        <Nav.Link as={Link} to="/my-listed-items" className="custom-nav-link">My Listed Items</Nav.Link>
                        <Nav.Link as={Link} to="/my-purchases" className="custom-nav-link">My Purchases</Nav.Link>
                        {/* Add more Nav links as needed */}
                    </Nav>
                    <Nav>
                        {account ? (
                            <Nav.Link
                                href={`https://etherscan.io/address/${account}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="button nav-button btn-sm mx-4">
                                <Button variant="outline-light">
                                    {account.slice(0, 5) + '...' + account.slice(38, 42)}
                                </Button>
                            </Nav.Link>
                        ) : (
                            <Button onClick={web3Handler} variant="outline-light">Connect Wallet</Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigation;
