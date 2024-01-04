import { Link } from "react-router-dom";
import './styles.css';
import { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import './styles.css';
import { MyContext }  from '../../MainContext'


const Home = () => {
  const navigate = useNavigate();

  const { user } = useContext(MyContext);

  if(user?.id){
    setTimeout(() =>{
      navigate('/dashboard')
    })
  }
return (
    <div className="landing-page">
      <header className="header">
        <nav className="navbar">
          <div className="container">
            <h1>SPMS</h1>
            <div className="left-container">
                <Link to={`login`}><a className="login-btn">Login</a></Link>
            </div>
          </div>
        </nav>
      </header>

      {/* <main className="main-content">
        <section className="hero">
          <div className="container">
            <h2>Welcome to SPMS</h2>
          </div>
        </section>
      </main> */}

      {/* <footer className="footer">
        <div className="container">
          <p>&copy; 2023 SPMS</p>
        </div>
      </footer> */}
    </div>
  );
}
export default Home