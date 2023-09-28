import { useState, useEffect } from "react";
import navbar from "../components/navbar.jsx";
import axios from "axios";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Button } from "react-bootstrap";

function deleteSkill() {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [activeSkills, setActiveSkills] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoaded, setWait] = useState(false);

  // Get all active skills when the component mounts
  useEffect(() => {
    const getActiveSkills = async () => {
      try {
        const response = await axios.get("http://localhost:5001/get_skills_by_status/active");
        if (response.status === 200) {
          setActiveSkills(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getActiveSkills();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setWait(true);
    }, 1);
  }, []);

  // Handle Select change
  const handleSelectChange = (selectedOptions) => {
    const newSelectedSkills = selectedOptions.map((option) => option.value);
    setSelectedSkills(newSelectedSkills);
    setSelectedOptions(selectedOptions);
  };

  // Show delete confirmation modal
  const handleShowModal = () => {
    if (activeSkills.length === 0) {
      toast.error("There is no active skill to delete");
      return;
    }
    if (selectedSkills.length === 0) {
      toast.error("Please select at least one skill to delete");
      return;
    }
    setShowModal(true);
  };

  // Close delete confirmation modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Delete selected skills
  const handleDeleteSkills = async () => {
  
    for (const skillId of selectedSkills) {
      const response = await axios.put(
        `http://localhost:5001/delete_skill/${skillId}`,
        {
          skill_status: "inactive",
        }
      );
  
      if (response.status !== 200) {
        // Error deleting skill
        console.log(`Error deleting skill with ID ${skillId}: `, response.data);
      }
    }
  
    // All skills deleted successfully
    toast.success("Skills deleted successfully");

    // Close modal
    handleCloseModal();
    // Clear selected skills
    setSelectedSkills([]);
    // Clear the Select component's value
    setSelectedOptions([]);
    // Update the activeSkills array by filtering out the deleted skills
    setActiveSkills((prevActiveSkills) =>
      prevActiveSkills.filter((skill) => !selectedSkills.includes(skill.skill_id))
    );
  };

  return (
    <div>
      {navbar()}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <section className="section-hero overlay inner-page bg-image" style={{ backgroundImage: "url(/images/hero_1.jpg)" }} id="home-section">
        <div className="container">
          <div className="row">
            <div className="col-md-7">
              <h1 className="text-white font-weight-bold">Delete Skills</h1>
              <div className="custom-breadcrumbs">
                <a href="/">Home</a><span className="mx-2 slash">/</span>
                <a href="/viewSkills">Skills</a><span className="mx-2 slash">/</span>
                <span className="text-white"><strong>Delete Skills</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="site-section" id="next-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mb-5 mb-lg-0 mx-auto">
              <p className="font-weight-bold h6 pb-2">Select one or more skills to delete: </p>
              {activeSkills.length === 0 && isLoaded && <p className="text-danger">There is no active skill to delete.</p>}
              <Select
                options={activeSkills.map((skill) => ({ value: skill.skill_id, label: skill.skill_name }))}
                onChange={handleSelectChange}
                isMulti
                value={selectedOptions}
              />
              <button className="btn btn-danger mt-3" onClick={handleShowModal}>
                Delete selected skills
              </button>
            </div>
            <div className="col-lg-10 mb-5 mb-lg-0 mx-auto mt-4">
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>Skill Name</th>
                    <th>Skill Description</th>
                  </tr>
                </thead>
                <tbody>
                  {activeSkills.map((skill) => (
                    <tr key={skill.skill_id}>
                      <td>{skill.skill_name}</td>
                      <td>{skill.skill_description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Delete confirmation modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete the selected skills?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteSkills}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default deleteSkill;
