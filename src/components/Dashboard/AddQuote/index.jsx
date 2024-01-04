import { useState, useEffect } from "react";
import './styles.css'
import { token } from '../../../helpers/getCookie';

const AddQuote = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [file, setFile] = useState(null);

  const fetchCustomers = async () => {

    try {

      const response = await fetch(`https://spms-fvqd.onrender.com/list_users?query=${searchQuery}`, {
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

  useEffect(() => {
    fetchCustomers();
  }, [searchQuery]);

  const handleCustomerSelect = (e) => {
    setSelectedCustomer(e.target.value);
  };

  const handleKeyUp = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('uploaded_file', file);

      const uploadResponse = await fetch('https://spms-fvqd.onrender.com/upload_file', {
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

      const updateResponse = await fetch('https://spms-fvqd.onrender.com/create_quotation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer: ${token}`,
        },
        body: JSON.stringify({ 
          performed_by_id: '123',
          user_id: selectedCustomer,
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

  return (
    <div className="add-container">
      <h2>Add Quote</h2>
      <form className="add-quote-form" onSubmit={handleFileUpload} >
        <select value={selectedCustomer} onChange={handleCustomerSelect} onKeyUp={handleKeyUp}>
          <option value="">Select Customer</option>
          {filteredCustomers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default AddQuote;
