import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import useSidebar from '../../hooks/useSidebar';
import './AddBook.css';

const AddBook = () => {
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    publisher: '',
    publishYear: '',
    copies: '',
    availableCopies: '',
    location: '',
    description: '',
    coverImage: ''
  });

  // Sample data for dropdowns
  const categories = [
    { value: 'Fiction', label: 'Fiction' },
    { value: 'Non-Fiction', label: 'Non-Fiction' },
    { value: 'Science Fiction', label: 'Science Fiction' },
    { value: 'Fantasy', label: 'Fantasy' },
    { value: 'Romance', label: 'Romance' },
    { value: 'Mystery', label: 'Mystery' },
    { value: 'Biography', label: 'Biography' },
    { value: 'History', label: 'History' },
    { value: 'Science', label: 'Science' },
    { value: 'Technology', label: 'Technology' },
    { value: 'Art', label: 'Art' },
    { value: 'Music', label: 'Music' },
    { value: 'Poetry', label: 'Poetry' },
    { value: 'Drama', label: 'Drama' },
    { value: 'Reference', label: 'Reference' },
    { value: 'Children', label: 'Children' },
    { value: 'Young Adult', label: 'Young Adult' },
    { value: 'Educational', label: 'Educational' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      // await api.post('/books', formData);
      
      // Simulate API delay
      setTimeout(() => {
        setIsLoading(false);
        navigate('/library');
      }, 1000);
    } catch (error) {
      console.error('Error adding book:', error);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/library');
  };

  return (
    <div className={`layout-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`add-book-container ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        <div className="add-book-header">
          <button className="back-btn" onClick={handleCancel}>
            <ArrowBackIcon /> Back to Library
          </button>
          <h1>Add New Book</h1>
        </div>

        <div className="add-book-content">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="title">
                  <MenuBookIcon className="form-icon" /> Book Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter book title"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="author">
                  <PersonIcon className="form-icon" /> Author
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  placeholder="Enter author name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="isbn">ISBN</label>
                <input
                  type="text"
                  id="isbn"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleInputChange}
                  placeholder="Enter ISBN"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="publisher">
                  <BusinessIcon className="form-icon" /> Publisher
                </label>
                <input
                  type="text"
                  id="publisher"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleInputChange}
                  placeholder="Enter publisher name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="publishYear">
                  <CalendarTodayIcon className="form-icon" /> Publication Year
                </label>
                <input
                  type="number"
                  id="publishYear"
                  name="publishYear"
                  value={formData.publishYear}
                  onChange={handleInputChange}
                  placeholder="Enter publication year"
                  min="1000"
                  max={new Date().getFullYear()}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="copies">
                  <LibraryBooksIcon className="form-icon" /> Total Copies
                </label>
                <input
                  type="number"
                  id="copies"
                  name="copies"
                  value={formData.copies}
                  onChange={handleInputChange}
                  placeholder="Enter total copies"
                  min="1"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="availableCopies">Available Copies</label>
                <input
                  type="number"
                  id="availableCopies"
                  name="availableCopies"
                  value={formData.availableCopies}
                  onChange={handleInputChange}
                  placeholder="Enter available copies"
                  min="0"
                  max={formData.copies || 999}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="location">
                  <LocationOnIcon className="form-icon" /> Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Shelf A-12"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="coverImage">Cover Image URL</label>
                <input
                  type="url"
                  id="coverImage"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleInputChange}
                  placeholder="Enter cover image URL"
                />
              </div>
              
              <div className="form-group full-width">
                <label htmlFor="description">
                  <DescriptionIcon className="form-icon" /> Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter book description"
                  rows="4"
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="save-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="loading-spinner-small"></div>
                ) : (
                  <>
                    <SaveIcon /> Save Book
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBook; 