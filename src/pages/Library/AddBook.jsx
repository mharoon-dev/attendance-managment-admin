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
import Loader from '../../components/Loader/Loader';

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
            <ArrowBackIcon /> لائبریری پر واپس جائیں
          </button>
          <h1>نئی کتاب شامل کریں</h1>
        </div>

        <div className="add-book-content">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="title">
                  <MenuBookIcon className="form-icon" /> کتاب کا عنوان
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="کتاب کا عنوان درج کریں"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="author">
                  <PersonIcon className="form-icon" /> مصنف
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  placeholder="مصنف کا نام درج کریں"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="isbn">آئی ایس بی این</label>
                <input
                  type="text"
                  id="isbn"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleInputChange}
                  placeholder="آئی ایس بی این درج کریں"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="category">زمرہ</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">زمرہ منتخب کریں</option>
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="publisher">
                  <BusinessIcon className="form-icon" /> ناشر
                </label>
                <input
                  type="text"
                  id="publisher"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleInputChange}
                  placeholder="ناشر کا نام درج کریں"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="publishYear">
                  <CalendarTodayIcon className="form-icon" /> اشاعت کا سال
                </label>
                <input
                  type="number"
                  id="publishYear"
                  name="publishYear"
                  value={formData.publishYear}
                  onChange={handleInputChange}
                  placeholder="اشاعت کا سال درج کریں"
                  min="1000"
                  max={new Date().getFullYear()}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="copies">
                  <LibraryBooksIcon className="form-icon" /> کل کاپیاں
                </label>
                <input
                  type="number"
                  id="copies"
                  name="copies"
                  value={formData.copies}
                  onChange={handleInputChange}
                  placeholder="کل کاپیاں درج کریں"
                  min="1"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="availableCopies">دستیاب کاپیاں</label>
                <input
                  type="number"
                  id="availableCopies"
                  name="availableCopies"
                  value={formData.availableCopies}
                  onChange={handleInputChange}
                  placeholder="دستیاب کاپیاں درج کریں"
                  min="0"
                  max={formData.copies || 999}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="location">
                  <LocationOnIcon className="form-icon" /> مقام
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="مثال کے طور پر، شیلف اے-12"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="coverImage">کور امیج یو آر ایل</label>
                <input
                  type="url"
                  id="coverImage"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleInputChange}
                  placeholder="کور امیج یو آر ایل درج کریں"
                />
              </div>
              
              <div className="form-group full-width">
                <label htmlFor="description">
                  <DescriptionIcon className="form-icon" /> تفصیل
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="کتاب کی تفصیل درج کریں"
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
                منسوخ کریں
              </button>
              <button 
                type="submit" 
                className="save-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader />
                ) : (
                  <>
                    <SaveIcon /> کتاب محفوظ کریں
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