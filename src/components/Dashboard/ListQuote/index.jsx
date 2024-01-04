import {useEffect, useState} from 'react';
import { token } from '../../../helpers/getCookie';
import  { API_URL } from '../../../constants'

const ListQuote = ({customers}) =>{
    const [showModal, setShowModal] = useState(false);
    const [file, setFile] = useState(null);
    const [quotData, setQuoteData] = useState({});
    const [quotations, setQuotations] = useState([]);
    const [filters, setFilters] = useState({
        // created_at_greater_than: undefined,
        // user_id: null,
    });

    const fetchQuotes = async () => {
        try {
            let params = ''
            if(filters.created_at_greater_than){
                params += `&created_at_greater_than=${filters.created_at_greater_than}`
            }
            if(filters.user_id){
                params += `&user_id=${filters.user_id}`
            }
          const response = await fetch(`${API_URL}/list_quotations?1=1${params}`, {
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
    
          const uploadResponse = await fetch(`${API_URL}/upload_file`, {
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
    
    
          const updateResponse = await fetch(`${API_URL}/update_quotation`, {
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
      },[filters])

      const handleFilterChanged = (e) => {
        console.log('HandleDateChanged', e.target.name)
        setFilters((prev)=>({...prev, [e.target.name]: e.target.value}))
      }

      return (
        <div className="quotations-container">
            <div className='filters'>
            <input type="date" name="created_at_greater_than" onChange={handleFilterChanged}/>
            <select value={filters.user_id} name="user_id" onChange={handleFilterChanged}>
            <option value={null}>Select Customer</option>
                {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                    {customer.name}
                    </option>
                ))}
            </select>
            <button className="update-btn" onClick={()=>setFilters({})}>Clear</button>
            </div>
            <table className="quotations-table">
                <thead>
                    <tr>
                    <th>Customer Name</th>
                    <th>Sent At</th>
                    <th>Quote URL</th>
                    <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {quotations.map((quote, index) => (
                    <tr className="quotation" key={index}>
                        <td>{quote.user.name}</td>
                        <td>{quote.updated_at}</td>
                        <td><a href={quote.url} target='_blank'>Open</a></td>
                        <td><button className="update-btn" onClick={()=>handleUpdateClick(quote)}>Update</button></td>
                    </tr>
                    ))}
                </tbody>
            </table>

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
        </div>
    );
}

export default ListQuote;
