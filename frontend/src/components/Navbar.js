import { Link, useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <nav className="navbar">

            <Link to="/" className="logo">
                🔐 DigiWallet
            </Link>

            <div className="nav-links">

                <Link to="/">
                    Home
                </Link>

                {token ? (
                    <>
                        <Link to="/dashboard">
                            Dashboard
                        </Link>

                        <button
                            onClick={logout}
                            className="logout-btn"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="nav-register"
                        >
                            Register
                        </Link>
                    </>
                )}

            </div>

        </nav>
    );
}

export default Navbar;