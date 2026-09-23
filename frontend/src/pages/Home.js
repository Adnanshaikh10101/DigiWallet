import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {

    return (
        <>
            <Navbar />

            <section className="hero">

                <div className="hero-content">

                    <p className="hero-small">
                        YOUR PERSONAL CLOUD
                    </p>

                    <h1>
                        Your Documents.
                        <br />
                        <span>Safe & Accessible.</span>
                    </h1>

                    <p className="hero-description">
                        Store your important documents securely
                        in the cloud and access them anytime,
                        from anywhere.
                    </p>

                    <div className="hero-buttons">

                        <Link
                            to="/register"
                            className="primary-btn"
                        >
                            Get Started
                        </Link>

                        <Link
                            to="/login"
                            className="secondary-btn"
                        >
                            Login
                        </Link>

                    </div>

                </div>

                <div className="hero-card">

                    <div className="cloud-icon">
                        ☁️
                    </div>

                    <h3>
                        Cloud Storage
                    </h3>

                    <p>
                        Your files are stored securely
                        in the cloud.
                    </p>

                    <div className="fake-file">
                        📄 Resume.pdf
                    </div>

                    <div className="fake-file">
                        📄 Marksheet.pdf
                    </div>

                    <div className="fake-file">
                        📄 Certificate.pdf
                    </div>

                </div>

            </section>


            <section className="features">

                <h2>
                    Everything you need
                </h2>

                <div className="feature-grid">

                    <div className="feature-card">
                        <div>🔐</div>
                        <h3>Secure</h3>
                        <p>
                            JWT authentication keeps
                            your account protected.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div>☁️</div>
                        <h3>Cloud Storage</h3>
                        <p>
                            Store documents using
                            Cloudinary.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div>📱</div>
                        <h3>Accessible</h3>
                        <p>
                            Access your documents
                            whenever you need them.
                        </p>
                    </div>

                </div>

            </section>
        </>
    );
}

export default Home;