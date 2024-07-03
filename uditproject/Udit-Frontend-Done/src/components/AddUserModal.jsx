import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

const AddUserModal = ({ setShowAddUser, showAddUser, handleAddUser }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async () => {
    // Basic validation
    const validationErrors = {};
    if (!name) {
      validationErrors.name = "Name is required";
    }
    if (!email) {
      validationErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = "Email address is invalid";
    }
    if (!password) {
      validationErrors.password = "Password is required";
    }

    // If there are validation errors, set state and return
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // If no errors, proceed with form submission
    const payload = {
      name: name,
      email: email,
      role: role,
      password: password,
    };
    await handleAddUser(payload);
    setShowAddUser(false);
  };

  return (
    <Modal show={showAddUser} onHide={() => setShowAddUser(!showAddUser)}>
      <Modal.Header closeButton>
        <Modal.Title>Add User Form</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formRole">
            <Form.Label>Role</Form.Label>
            <Form.Control
              as="select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowAddUser(!showAddUser)}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Create User
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddUserModal;
