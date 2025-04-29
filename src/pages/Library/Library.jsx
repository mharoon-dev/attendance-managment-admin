import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Remove the old icon imports
// import { FiSearch, FiFilter, FiBook, FiPlus, FiEdit2, FiTrash2, FiEye, FiCheck, FiX } from 'react-icons/fi';
// import { BsBookHalf, BsPerson, BsCalendar, BsClock, BsArrowLeft } from 'react-icons/bs';

// Import Material UI icons
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import BookIcon from "@mui/icons-material/Book";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import CustomDropdown from "../../components/CustomDropdown/CustomDropdown";
import useSidebar from "../../hooks/useSidebar";
import "./Library.css";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../../utils/url";
import {
  addBookFailure,
  addBookStart,
  addBookSuccess,
  deleteBookFailure,
  deleteBookStart,
  deleteBookSuccess,
  updateBookFailure,
  updateBookStart,
  updateBookSuccess,
} from "../../redux/slices/librarySlice";
import Loader from "../../components/Loader/Loader";
import { toast, Toaster } from "sonner";

const Library = () => {
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const {user} = useSelector((state) => state.user);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const dispatch = useDispatch();
  const { books } = useSelector((state) => state.library);
  const [formData, setFormData] = useState({
    bookName: "",
    category: "",
    shelfNo: "",
    issuedTo: "",
    issuedDate: "",
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, bookId: null });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddBook = () => {
    setShowAddModal(true);
    setFormData({
      bookName: "",
      category: "",
      shelfNo: "",
      issuedTo: "",
      issuedDate: "",
    });
  };

  const handleEditBook = (book) => {
    setSelectedBook(book);
    setFormData({
      bookName: book.bookName,
      category: book.category,
      shelfNo: book.shelfNo,
      issuedTo: book.issuedTo,
      issuedDate: book.issuedDate ? new Date(book.issuedDate).toISOString().split('T')[0] : '',
    });
    setShowEditModal(true);
  };

  const handleViewBook = (book) => {
    setSelectedBook(book);
    setShowDetailsModal(true);
  };

  const handleDeleteClick = (bookId) => {
    setDeleteConfirmation({ show: true, bookId });
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation({ show: false, bookId: null });
  };

  const handleDeleteBook = async (bookId) => {
    try {
      setIsLoading(true);
      dispatch(deleteBookStart());
      const response = await api.delete(`library/books/${bookId}`);
      dispatch(deleteBookSuccess(bookId));
      if (response.status === 200) {
        toast.success('Book deleted successfully');
        setDeleteConfirmation({ show: false, bookId: null });
      }
    } catch (error) {
      dispatch(deleteBookFailure(error.response.data.message));
      toast.error('Error deleting book');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (showEditModal) {
        dispatch(updateBookStart());

        const response = await api.put(
          `library/books/${selectedBook._id}`,
          formData
        );
        dispatch(updateBookSuccess(response.data.data));
        toast.success("Book updated successfully");

        setShowEditModal(false);
      } else {
        const newBook = {
          ...formData,
        };

        dispatch(addBookStart());
        const response = await api.post("library/books", newBook);
        dispatch(addBookSuccess(response.data.data));
        toast.success("Book added successfully");
        setShowAddModal(false);
      }

      // Reset form
      setFormData({
        bookName: "",
        category: "",
        shelfNo: "",
        issuedTo: "",
        issuedDate: "",
      });
    } catch (error) {
      if (showEditModal) {
        dispatch(updateBookFailure(error.response.data.message));
        toast.error("Book update failed");
      } else {
        dispatch(addBookFailure(error.response.data.message));
        toast.error("Book add failed");
      }
    }
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.bookName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.shelfNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.issuedTo.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  return (
    <>
    <Toaster position="top-right" />
    <div className={`layout-container ${sidebarOpen ? "sidebar-open" : ""}`}>
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className={`library-container ${!sidebarOpen ? "sidebar-closed" : ""}`}
      >
        <div className="library-header">
          <h1>Library</h1>
          {
            (user.role === "admin" || user.role === "superAdmin") && (
              <button className="add-book-btn" onClick={handleAddBook}>
                <AddIcon /> Add New Book
              </button>
            )
          }
        </div>

        <div className="library-toolbar">
          <div className="search-box">
            <div className="search-icon-container">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search by book name, category, shelf number, or issued to..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        {isLoading ? (
         <Loader />
        ) : (
          <div className="books-grid">
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <div key={book._id} className="book-card">
                  <div className="book-info">
                    <h3 className="book-title">{book.bookName}</h3>
                    <div className="book-details">
                      <div className="book-detail">
                        <BookIcon className="detail-icon" />
                        <span>{book.category}</span>
                      </div>
                      <div className="book-detail">
                        <span>Shelf: {book.shelfNo}</span>
                      </div>
                      {book.issuedTo && (
                        <div className="book-detail">
                          <PersonIcon className="detail-icon" />
                          <span>Issued to: {book.issuedTo}</span>
                        </div>
                      )}
                      {book.issuedDate && (
                        <div className="book-detail">
                          <CalendarTodayIcon className="detail-icon" />
                          <span>
                            Issued on:{" "}
                            {new Date(book.issuedDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="book-card-footer">
                      <button 
                        className="view-book-btn"
                        onClick={() => handleViewBook(book)}
                      >
                        <VisibilityIcon /> View Details
                      </button>
                      {
                        (user.role === "admin" || user.role === "superAdmin") && (
                          <div className="quick-actions">
                            <button 
                              className="action-btn edit"
                              onClick={() => handleEditBook(book)}
                            >
                              <EditIcon />
                            </button>
                            <button 
                              className="action-btn delete" 
                              onClick={() => handleDeleteClick(book._id)}
                            >
                              <DeleteIcon />
                            </button>
                          </div>
                        )
                      }
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <MenuBookIcon className="no-results-icon" />
                <h3>No books found</h3>
                <p>Try adjusting your search</p>
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
                    <label htmlFor="bookName">Book Name</label>
                    <input
                      type="text"
                      id="bookName"
                      name="bookName"
                      value={formData.bookName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                   <label htmlFor="category">Category</label>
                   <input
                      type="text"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="shelfNo">Shelf Number</label>
                    <input
                      type="text"
                      id="shelfNo"
                      name="shelfNo"
                      value={formData.shelfNo}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="issuedTo">Issued To</label>
                    <input
                      type="text"
                      id="issuedTo"
                      name="issuedTo"
                      value={formData.issuedTo}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="issuedDate">Issue Date</label>
                    <input
                      type="date"
                      id="issuedDate"
                      name="issuedDate"
                      value={formData.issuedDate}
                      onChange={handleInputChange}
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
                <button type="submit" className="save-btn">
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
                    <label htmlFor="bookName">Book Name</label>
                    <input
                      type="text"
                      id="bookName"
                      name="bookName"
                      value={formData.bookName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="shelfNo">Shelf Number</label>
                    <input
                      type="text"
                      id="shelfNo"
                      name="shelfNo"
                      value={formData.shelfNo}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="issuedTo">Issued To</label>
                    <input
                      type="text"
                      id="issuedTo"
                      name="issuedTo"
                      value={formData.issuedTo}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="issuedDate">Issue Date</label>
                    <input
                      type="date"
                      id="issuedDate"
                      name="issuedDate"
                      value={formData.issuedDate}
                      onChange={handleInputChange}
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
                <button type="submit" className="save-btn">
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
                <div className="book-details-info">
                  <h3 className="book-details-title">
                    {selectedBook.bookName}
                  </h3>

                  <div className="book-details-grid">
                    <div className="book-details-item">
                      <span className="details-label">Category:</span>
                      <span className="details-value">
                        {selectedBook.category}
                      </span>
                    </div>
                    <div className="book-details-item">
                      <span className="details-label">Shelf Number:</span>
                      <span className="details-value">
                        {selectedBook.shelfNo}
                      </span>
                    </div>
                    {selectedBook.issuedTo && (
                      <div className="book-details-item">
                        <span className="details-label">Issued To:</span>
                        <span className="details-value">
                          {selectedBook.issuedTo}
                        </span>
                      </div>
                    )}
                    {selectedBook.issuedDate && (
                      <div className="book-details-item">
                        <span className="details-label">Issue Date:</span>
                        <span className="details-value">
                          {new Date(
                            selectedBook.issuedDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
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
              {
                user.role === "admin" || user.role === "superAdmin" && (
                  <button
                    className="edit-btn"
                onClick={() => {
                  setShowDetailsModal(false);
                  handleEditBook(selectedBook);
                }}
              >
                <EditIcon /> Edit Book
              </button>
                )
              }
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="modal-overlay">
          <div className="delete-confirmation-modal">
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button className="modal-close-btn" onClick={handleCancelDelete}>
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this book? This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={handleCancelDelete}>
                Cancel
              </button>
              <button 
                className="delete-btn" 
                onClick={() => handleDeleteBook(deleteConfirmation.bookId)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Library;
