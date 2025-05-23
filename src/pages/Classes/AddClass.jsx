import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSave, FiX, FiPlus, FiTrash2 } from "react-icons/fi";
import {
  BsBuilding,
  BsPeople,
  BsCalendar,
  BsPersonBadge,
} from "react-icons/bs";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import CustomDropdown from "../../components/CustomDropdown/CustomDropdown";
import useSidebar from "../../hooks/useSidebar";
import "./AddClass.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addClassFailure,
  addClassStart,
  addClassSuccess,
} from "../../redux/slices/classesSlice";
import { toast, Toaster } from "sonner";
import Loader from "../../components/Loader/Loader";
import { api } from "../../utils/url";

const AddClass = () => {
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [loading, setLoading] = useState(false);
  const { teachers } = useSelector((state) => state.teachers);
  const [newTeacherId, setNewTeacherId] = useState("");
  const [newTeacherYear, setNewTeacherYear] = useState(
    new Date().getFullYear()
  );
  const [teachersList, setTeachersList] = useState([]);
  const [removedTeachers, setRemovedTeachers] = useState([]);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    className: "",
    grade: "",
    classTeachers: [],
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDropdownChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTeacher = () => {
    if (newTeacherId && newTeacherYear) {
      // Check if teacher already exists for the given year
      const teacherExistsForYear = teachersList.some(
        (teacher) => teacher.year === parseInt(newTeacherYear)
      );

      if (teacherExistsForYear) {
        alert("A teacher is already assigned for this year");
        return;
      }

      const newTeacher = {
        teacherId: newTeacherId,
        year: parseInt(newTeacherYear),
      };

      setTeachersList([...teachersList, newTeacher]);
      setFormData((prev) => ({
        ...prev,
        classTeachers: [...prev.classTeachers, newTeacher],
      }));

      // Reset input fields
      setNewTeacherId("");
      setNewTeacherYear(new Date().getFullYear());
    }
  };

  const handleRemoveTeacher = (index) => {
    const removedTeacher = teachersList[index];
    setRemovedTeachers([...removedTeachers, removedTeacher]);

    setTeachersList((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      classTeachers: prev.classTeachers.filter((_, i) => i !== index),
    }));
  };

  const handleRestoreTeacher = (removedTeacher) => {
    setTeachersList([...teachersList, removedTeacher]);
    setFormData((prev) => ({
      ...prev,
      classTeachers: [...prev.classTeachers, removedTeacher],
    }));
    setRemovedTeachers((prev) =>
      prev.filter((t) => t.teacherId !== removedTeacher.teacherId)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      dispatch(addClassStart());
      const response = await api.post("classes/create", formData);
      dispatch(addClassSuccess(response.data.data));
      setLoading(false);
      toast.success("Class added successfully");
      console.log(response);

      setTimeout(() => {
        navigate("/classes");
      }, 1000);
    } catch (error) {
      dispatch(addClassFailure(error.response.data.message));
      console.error("Error submitting class:", error);
      setLoading(false);
      toast.error("Error submitting class");
    }

    // Simulate API call
    setTimeout(() => {
      console.log("Class data to be submitted:", formData);
      setLoading(false);
      navigate("/classes");
    }, 1500);
  };

  const teacherOptions = [
    ...teachers.map((teacher) => ({
      value: teacher.jobDetails.teacherId,
      label: `${teacher.fullName}`,
      icon: <BsPersonBadge />,
      disabled: teachersList.some(
        (t) => t.teacherId === teacher.jobDetails.teacherId
      ),
    })),
  ];

  return (
    <>
      <Toaster position="top-right" />
      {loading && <Loader />}
      <div className={`layout-container ${sidebarOpen ? "sidebar-open" : ""}`}>
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <div
          className={`add-class-container ${
            !sidebarOpen ? "sidebar-closed" : ""
          }`}
        >
          <div className="add-class-header">
            <button className="cancel-btn" onClick={() => navigate("/classes")}>
              <FiX /> منسوخ کریں
            </button>
            <h1>نیا کلاس شامل کریں</h1>
          </div>

          <div className="add-class-content">
            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <div className="card-header">
                  <h2 >بنیادی معلومات</h2>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="className">کلاس کا نام</label>
                    <div className="input-with-icon">
                      <BsBuilding className="input-icon" />
                      <input
                        type="text"
                        id="className"
                        name="className"
                        value={formData.className}
                        onChange={handleInputChange}
                        placeholder="کلاس کا نام درج کریں"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="grade">گریڈ</label>
                    <div className="input-with-icon">
                      <BsBuilding className="input-icon" />
                      <input
                        type="number"
                        id="grade"
                        name="grade"
                        value={formData.grade}
                        onChange={handleInputChange}
                        placeholder="گریڈ درج کریں"
                        min="1"
                        max="12"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="startDate">شروع کی تاریخ</label>
                    <div className="input-with-icon">
                      <BsCalendar className="input-icon" />
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="endDate">اختتام کی تاریخ</label>
                    <div className="input-with-icon">
                      <BsCalendar className="input-icon" />
                      <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="card-header">
                  <h2>کلاس ٹیچرز</h2>
                </div>
                <div className="teachers-container">
                  <div className="teacher-input-group">
                    <div className="form-row">
                      <div className="form-group">
                        <label>ٹیچر</label>
                        <CustomDropdown
                          value={newTeacherId}
                          onChange={(value) => setNewTeacherId(value)}
                          options={teacherOptions}
                          placeholder="ٹیچر منتخب کریں"
                          icon={<BsPersonBadge />}
                        />
                      </div>
                      <div className="form-group">
                        <label>سال</label>
                        <div className="input-with-icon">
                          <BsCalendar className="input-icon" />
                          <input
                            type="number"
                            value={newTeacherYear}
                            onChange={(e) => setNewTeacherYear(e.target.value)}
                            placeholder="سال درج کریں"
                            min="2000"
                            max="2100"
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="add-teacher-btn"
                      onClick={handleAddTeacher}
                    >
                      <FiPlus /> ٹیچر شامل کریں
                    </button>
                  </div>

                  <div className="classes-teachers-list">
                    {teachersList.map((teacher, index) => {
                      const selectedTeacher = teachers.find(
                        (t) => t.jobDetails.teacherId === teacher.teacherId
                      );
                      return (
                        <div key={index} className="classes-teacher-item">
                          <span>
                            {selectedTeacher?.fullName} ({teacher.year})
                          </span>
                          <button
                            type="button"
                            className=""
                            onClick={() => handleRemoveTeacher(index)}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <br />
                  <br />

                  {removedTeachers.length > 0 && (
                    <div className="removed-teachers-section">
                      <h3>Removed Teachers</h3>
                      <div className="classes-teachers-list">
                        {removedTeachers.map((teacher, index) => {
                          const selectedTeacher = teachers.find(
                            (t) => t.jobDetails.teacherId === teacher.teacherId
                          );
                          return (
                            <div key={index} className="classes-teacher-item">
                              <span>
                                {selectedTeacher?.fullName} ({teacher.year})
                              </span>
                              <button
                                type="button"
                                className="restore-teacher-btn"
                                onClick={() => handleRestoreTeacher(teacher)}
                              >
                                <FiPlus /> Restore
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => navigate("/classes")}
                >
                  <FiX /> منسوخ کریں
                </button>
                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? (
                    <span className="loading-spinner"></span>
                  ) : (
                    <>
                      <FiSave /> کلاس محفوظ کریں
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddClass;
