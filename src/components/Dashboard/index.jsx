import {useState, useContext, useEffect} from 'react';
import './styles.css';
import unsetCookie from "../../helpers/unsetCookie";
import AddQuote from './AddQuote'
import AddUser from './AddUser';
import { useNavigate } from "react-router-dom";
import { MyContext }  from '../../MainContext'
import ListQuote from './ListQuote';
import { API_URL } from '../../constants'
import { token } from "../../helpers/getCookie";

const Dashboard = () => {
  const [showUserModal, setShowUserModal] = useState(false);
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);

  const { user, setUser } = useContext(MyContext);

  if(!user?.id){
    setTimeout(() =>{
      navigate('/')
    })
  }

  const handleCloseUserModal = () => {
    setShowUserModal(false);
  };

  const fetchCustomers = async () => {

    try {

      const response = await fetch(`${API_URL}/list_users?user_type=customer&query=`, {
        method: "GET",
        headers: {
          Authorization: `Bearer: ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }

      const data = await response.json();
      setCustomers(data.list);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const logout = () => {
    unsetCookie()
    setUser(null)
    navigate('/login')
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="landing-page">
      <header className="header">
        <nav className="navbar">
          <div className="container">
            <h1>SPMS</h1>
            <div className="left-container">
              <a className="login-btn" onClick={logout}>Logout</a>
              <a className="login-btn" onClick={()=>setShowUserModal(true)}>Create Customer</a>
            </div>
          </div>
        </nav>
      </header>

      <main className="main-content">
        <section className="hero">
          
          <div className="container">
            <ListQuote customers={customers}/>
            <AddQuote customers={customers}/>
          </div>
        </section>

        {showUserModal && (
          <div className="modal-overlay">
            <div className="modal">
              <span className="close-modal" onClick={handleCloseUserModal}>
                &times;
              </span>
              <AddUser />
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2023 SPMS</p>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;
