import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Remove the old icon imports
// import { FiSearch, FiFilter, FiBook, FiPlus, FiEdit2, FiTrash2, FiEye, FiCheck, FiX } from 'react-icons/fi';
// import { BsBookHalf, BsPerson, BsCalendar, BsClock, BsArrowLeft } from 'react-icons/bs';

// Import Material UI icons
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import BookIcon from '@mui/icons-material/Book';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import CustomDropdown from '../../components/CustomDropdown/CustomDropdown';
import useSidebar from '../../hooks/useSidebar';
import './Library.css';

const Library = () => {
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedSort, setSelectedSort] = useState('title-asc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
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
    description: ''
  });

  // Sample data for books
  const [books, setBooks] = useState([
    {
      id: 1,
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      isbn: '978-0446310789',
      category: 'Fiction',
      publisher: 'Grand Central Publishing',
      publishYear: 1960,
      copies: 5,
      availableCopies: 3,
      location: 'Shelf A-12',
      status: 'available',
      description: 'The story of racial injustice and the loss of innocence in the American South.',
      coverImage: 'https://images-na.ssl-images-amazon.com/images/P/0446310786.01.L.jpg'
    },
    {
      id: 2,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '978-0743273565',
      category: 'Fiction',
      publisher: 'Scribner',
      publishYear: 1925,
      copies: 4,
      availableCopies: 0,
      location: 'Shelf A-15',
      status: 'unavailable',
      description: 'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
      coverImage: 'https://images-na.ssl-images-amazon.com/images/P/0743273567.01.L.jpg'
    },
    {
      id: 3,
      title: '1984',
      author: 'George Orwell',
      isbn: '978-0451524935',
      category: 'Science Fiction',
      publisher: 'Signet Classic',
      publishYear: 1949,
      copies: 6,
      availableCopies: 4,
      location: 'Shelf B-03',
      status: 'available',
      description: 'A dystopian social science fiction novel and cautionary tale.',
      coverImage: 'https://images-na.ssl-images-amazon.com/images/P/0451524934.01.L.jpg'
    },
    {
      id: 4,
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      isbn: '978-0141439518',
      category: 'Romance',
      publisher: 'Penguin Classics',
      publishYear: 1813,
      copies: 3,
      availableCopies: 2,
      location: 'Shelf C-07',
      status: 'available',
      description: 'A romantic novel of manners that satirizes 19th century society.',
      coverImage: 'https://images-na.ssl-images-amazon.com/images/P/0141439513.01.L.jpg'
    },
    {
      id: 5,
      title: 'The Catcher in the Rye',
      author: 'J.D. Salinger',
      isbn: '978-0316769488',
      category: 'Fiction',
      publisher: 'Little, Brown and Company',
      publishYear: 1951,
      copies: 4,
      availableCopies: 1,
      location: 'Shelf A-18',
      status: 'limited',
      description: 'The story of teenage protagonist Holden Caulfield\'s three days in New York City after being expelled from his boarding school.',
      coverImage: 'https://images-na.ssl-images-amazon.com/images/P/0316769487.01.L.jpg'
    },
    {
      id: 6,
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      isbn: '978-0547928227',
      category: 'Fantasy',
      publisher: 'Houghton Mifflin Harcourt',
      publishYear: 1937,
      copies: 5,
      availableCopies: 3,
      location: 'Shelf D-12',
      status: 'available',
      description: 'A fantasy novel about the adventures of Bilbo Baggins, a hobbit who embarks on a quest to help a group of dwarves reclaim their mountain home.',
      coverImage: 'https://images-na.ssl-images-amazon.com/images/P/054792822X.01.L.jpg'
    }
  ]);

  // Sample data for dropdowns
  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'Fiction', label: 'Fiction' },
    { value: 'Non-Fiction', label: 'Non-Fiction' },
    { value: 'Science Fiction', label: 'Science Fiction' },
    { value: 'Fantasy', label: 'Fantasy' },
    { value: 'Romance', label: 'Romance' },
    { value: 'Mystery', label: 'Mystery' },
    { value: 'Biography', label: 'Biography' },
    { value: 'History', label: 'History' },
    { value: 'Science', label: 'Science' }
  ];

  const statuses = [
    { value: '', label: 'All Statuses' },
    { value: 'available', label: 'Available' },
    { value: 'unavailable', label: 'Unavailable' },
    { value: 'limited', label: 'Limited' }
  ];

  const sortOptions = [
    { value: 'title-asc', label: 'Title (A-Z)' },
    { value: 'title-desc', label: 'Title (Z-A)' },
    { value: 'author-asc', label: 'Author (A-Z)' },
    { value: 'author-desc', label: 'Author (Z-A)' },
    { value: 'year-desc', label: 'Year (Newest)' },
    { value: 'year-asc', label: 'Year (Oldest)' },
    { value: 'available-desc', label: 'Available (High-Low)' },
    { value: 'available-asc', label: 'Available (Low-High)' }
  ];

  useEffect(() => {
    // Simulate API call to fetch books
    const fetchBooks = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await api.get('/books');
        // setBooks(response.data);
        
        // Simulate API delay
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching books:', error);
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleSortChange = (e) => {
    setSelectedSort(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddBook = () => {
    setShowAddModal(true);
  };

  const handleEditBook = (book) => {
    setSelectedBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      publisher: book.publisher,
      publishYear: book.publishYear,
      copies: book.copies,
      availableCopies: book.availableCopies,
      location: book.location,
      description: book.description
    });
    setShowEditModal(true);
  };

  const handleViewBook = (book) => {
    setSelectedBook(book);
    setShowDetailsModal(true);
  };

  const handleDeleteBook = (book) => {
    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      // In a real app, this would be an API call
      // await api.delete(`/books/${book.id}`);
      
      // Update local state
      setBooks(books.filter(b => b.id !== book.id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (showEditModal) {
      // In a real app, this would be an API call
      // await api.put(`/books/${selectedBook.id}`, formData);
      
      // Update local state
      setBooks(books.map(book => 
        book.id === selectedBook.id 
          ? { 
              ...book, 
              ...formData,
              status: formData.availableCopies > 0 
                ? (formData.availableCopies < formData.copies ? 'limited' : 'available')
                : 'unavailable'
            } 
          : book
      ));
      
      setShowEditModal(false);
    } else {
      // In a real app, this would be an API call
      // const response = await api.post('/books', formData);
      
      // Update local state
      const newBook = {
        id: books.length + 1,
        ...formData,
        status: formData.availableCopies > 0 
          ? (formData.availableCopies < formData.copies ? 'limited' : 'available')
          : 'unavailable',
        coverImage: 'https://via.placeholder.com/150x200?text=No+Cover'
      };
      
      setBooks([...books, newBook]);
      setShowAddModal(false);
    }
    
    // Reset form
    setFormData({
      title: '',
      author: '',
      isbn: '',
      category: '',
      publisher: '',
      publishYear: '',
      copies: '',
      availableCopies: '',
      location: '',
      description: ''
    });
  };

  const filteredBooks = books
    .filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.isbn.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === '' || book.category === selectedCategory;
      const matchesStatus = selectedStatus === '' || book.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      switch (selectedSort) {
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'author-asc':
          return a.author.localeCompare(b.author);
        case 'author-desc':
          return b.author.localeCompare(a.author);
        case 'year-desc':
          return b.publishYear - a.publishYear;
        case 'year-asc':
          return a.publishYear - b.publishYear;
        case 'available-desc':
          return b.availableCopies - a.availableCopies;
        case 'available-asc':
          return a.availableCopies - b.availableCopies;
        default:
          return 0;
      }
    });

  const getStatusClass = (status) => {
    switch (status) {
      case 'available':
        return 'status-available';
      case 'unavailable':
        return 'status-unavailable';
      case 'limited':
        return 'status-limited';
      default:
        return '';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'unavailable':
        return 'Unavailable';
      case 'limited':
        return 'Limited';
      default:
        return status;
    }
  };

  return (
    <div className={`layout-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`library-container ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        <div className="library-header">
          <h1>Library</h1>
          <button className="add-book-btn" onClick={handleAddBook}>
            <AddIcon /> Add New Book
          </button>
        </div>

        <div className="library-toolbar">
          <div className="search-box">
            <div className="search-icon-container">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <div className="filter-options">
            <CustomDropdown
              options={categories}
              value={selectedCategory}
              onChange={handleCategoryChange}
              placeholder="All Categories"
              icon={<MenuBookIcon />}
              name="category"
            />
            
            <CustomDropdown
              options={statuses}
              value={selectedStatus}
              onChange={handleStatusChange}
              placeholder="All Statuses"
              icon={<CheckIcon />}
              name="status"
            />
            
            <CustomDropdown
              options={sortOptions}
              value={selectedSort}
              onChange={handleSortChange}
              placeholder="Sort By"
              icon={<FilterListIcon />}
              name="sort"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading books...</p>
          </div>
        ) : (
          <div className="books-grid">
            {filteredBooks.length > 0 ? (
              filteredBooks.map(book => (
                <div key={book.id} className="book-card">
                  <div className="book-cover">
                    <img src={book.coverImage} alt={book.title} />
                    <div className={`book-status ${getStatusClass(book.status)}`}>
                      {getStatusText(book.status)}
                    </div>
                  </div>
                  <div className="book-info">
                    <h3 className="book-title">{book.title}</h3>
                    <p className="book-author">{book.author}</p>
                    <div className="book-details">
                      <div className="book-detail">
                        <PersonIcon className="detail-icon" />
                        <span>{book.availableCopies}/{book.copies} Available</span>
                      </div>
                      <div className="book-detail">
                        <BookIcon className="detail-icon" />
                        <span>{book.category}</span>
                      </div>
                    </div>
                    <div className="book-actions">
                      <button 
                        className="action-btn view-btn"
                        onClick={() => handleViewBook(book)}
                      >
                        <VisibilityIcon />
                      </button>
                      <button 
                        className="action-btn edit-btn"
                        onClick={() => handleEditBook(book)}
                      >
                        <EditIcon />
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteBook(book)}
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <MenuBookIcon className="no-results-icon" />
                <h3>No books found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Book</h2>
              <button 
                className="close-btn"
                onClick={() => setShowAddModal(false)}
              >
                <CloseIcon />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="title">Book Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="author">Author</label>
                    <input
                      type="text"
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
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
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <CustomDropdown
                      options={categories.filter(cat => cat.value !== '')}
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="Select Category"
                      icon={<MenuBookIcon />}
                      name="category"
                      label="Category"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="publisher">Publisher</label>
                    <input
                      type="text"
                      id="publisher"
                      name="publisher"
                      value={formData.publisher}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="publishYear">Publication Year</label>
                    <input
                      type="number"
                      id="publishYear"
                      name="publishYear"
                      value={formData.publishYear}
                      onChange={handleInputChange}
                      min="1000"
                      max={new Date().getFullYear()}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="copies">Total Copies</label>
                    <input
                      type="number"
                      id="copies"
                      name="copies"
                      value={formData.copies}
                      onChange={handleInputChange}
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
                      min="0"
                      max={formData.copies || 999}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="location">Location</label>
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
                  
                  <div className="form-group full-width">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="save-btn"
                >
                  Add Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Book Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Book</h2>
              <button 
                className="close-btn"
                onClick={() => setShowEditModal(false)}
              >
                <CloseIcon />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="title">Book Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="author">Author</label>
                    <input
                      type="text"
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
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
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <CustomDropdown
                      options={categories.filter(cat => cat.value !== '')}
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="Select Category"
                      icon={<MenuBookIcon />}
                      name="category"
                      label="Category"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="publisher">Publisher</label>
                    <input
                      type="text"
                      id="publisher"
                      name="publisher"
                      value={formData.publisher}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="publishYear">Publication Year</label>
                    <input
                      type="number"
                      id="publishYear"
                      name="publishYear"
                      value={formData.publishYear}
                      onChange={handleInputChange}
                      min="1000"
                      max={new Date().getFullYear()}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="copies">Total Copies</label>
                    <input
                      type="number"
                      id="copies"
                      name="copies"
                      value={formData.copies}
                      onChange={handleInputChange}
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
                      min="0"
                      max={formData.copies || 999}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="location">Location</label>
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
                  
                  <div className="form-group full-width">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="save-btn"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Book Details Modal */}
      {showDetailsModal && selectedBook && (
        <div className="modal-overlay">
          <div className="modal-content book-details-modal">
            <div className="modal-header">
              <h2>Book Details</h2>
              <button 
                className="close-btn"
                onClick={() => setShowDetailsModal(false)}
              >
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <div className="book-details-container">
                <div className="book-details-cover">
                  <img src={selectedBook.coverImage} alt={selectedBook.title} />
                  <div className={`book-details-status ${getStatusClass(selectedBook.status)}`}>
                    {getStatusText(selectedBook.status)}
                  </div>
                </div>
                <div className="book-details-info">
                  <h3 className="book-details-title">{selectedBook.title}</h3>
                  <p className="book-details-author">by {selectedBook.author}</p>
                  
                  <div className="book-details-grid">
                    <div className="book-details-item">
                      <span className="details-label">ISBN:</span>
                      <span className="details-value">{selectedBook.isbn}</span>
                    </div>
                    <div className="book-details-item">
                      <span className="details-label">Category:</span>
                      <span className="details-value">{selectedBook.category}</span>
                    </div>
                    <div className="book-details-item">
                      <span className="details-label">Publisher:</span>
                      <span className="details-value">{selectedBook.publisher}</span>
                    </div>
                    <div className="book-details-item">
                      <span className="details-label">Published:</span>
                      <span className="details-value">{selectedBook.publishYear}</span>
                    </div>
                    <div className="book-details-item">
                      <span className="details-label">Copies:</span>
                      <span className="details-value">{selectedBook.availableCopies} of {selectedBook.copies} available</span>
                    </div>
                    <div className="book-details-item">
                      <span className="details-label">Location:</span>
                      <span className="details-value">{selectedBook.location}</span>
                    </div>
                  </div>
                  
                  <div className="book-details-description">
                    <h4>Description</h4>
                    <p>{selectedBook.description}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </button>
              <button 
                className="edit-btn"
                onClick={() => {
                  setShowDetailsModal(false);
                  handleEditBook(selectedBook);
                }}
              >
                <EditIcon /> Edit Book
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library; 