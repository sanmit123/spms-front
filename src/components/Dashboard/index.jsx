import {useEffect, useState, useContext} from 'react';
import './styles.css';
import unsetCookie from "../../helpers/unsetCookie";
import AddQuote from './AddQuote'
import { useNavigate } from "react-router-dom";
import { token } from '../../helpers/getCookie';
import { MyContext }  from '../../MainContext'

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  const [quotData, setQuoteData] = useState({});
  const [quotations, setQuotations] = useState([]);
  const navigate = useNavigate();

  const { user, setUser } = useContext(MyContext);

  if(!user?.id){
    setTimeout(() =>{
      navigate('/')
    })
  }

  const fetchQuotes = async () => {
    try {
      const response = await fetch("https://spms-5gg3.onrender.com/list_quotations", {
        method: "GET",
        headers: {
          Authorization: `Bearer: ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch quotes');
      }

      const data = await response.json();
      setQuotations(data?.list || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  
  const logout = () => {
    unsetCookie()
    setUser(null)
    navigate('/login')
  }

  const handleUpdateClick = (quote) => {
    setQuoteData(quote)
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('uploaded_file', file);

      const uploadResponse = await fetch('https://spms-5gg3.onrender.com/upload_file', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer: ${token}`,
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('File upload failed');
      }

      const { file_url } = await uploadResponse.json();


      const updateResponse = await fetch('https://spms-5gg3.onrender.com/update_quotation', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer: ${token}`,
        },
        body: JSON.stringify({ 
          id: quotData.id, 
          performed_by_id: '123',
          user_id: quotData.user_id,
          url: file_url 
        }),
      });

      if (!updateResponse.ok) {
        throw new Error('Update quotation failed');
      }

      console.log('Quotation updated successfully');

      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect (()=>{
    fetchQuotes()
  },[])

  return (
    <div className="landing-page">
      <header className="header">
        <nav className="navbar">
          <div className="container">
            <h1>SPMS</h1>
            <div className="left-container">
              <a className="login-btn" onClick={logout}>Logout</a>
            </div>
          </div>
        </nav>
      </header>

      <main className="main-content">
        <section className="hero">
          <div className="container">
            <div className="quotations-container">
              <table className="quotations-table">
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Quote URL</th>
                    <th>Sent At</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Mapping quotations to display */}
                  {quotations.map((quote, index) => (
                    <tr className="quotation" key={index}>
                      <td>{quote.user.name}</td>
                      <td><a href={quote.url}>Open</a></td>
                      <td>{quote.updated_at}</td>
                      <td><button className="update-btn" onClick={()=>handleUpdateClick(quote)}>Update</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <AddQuote />
          </div>
        </section>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <span className="close-modal" onClick={handleCloseModal}>
                &times;
              </span>
              <h2>Upload File</h2>
              <form className="file-upload-form" onSubmit={handleFileUpload} >
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Upload</button>
              </form>
            </div>
          </div>
        )}
      </main>
{/* 
      <footer className="footer">
        <div className="container">
          <p>&copy; 2023 SPMS</p>
        </div>
      </footer> */}
    </div>
  );
}

export default Dashboard;
