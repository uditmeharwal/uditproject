import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const UserModal = ({ setEditUser, editUser, editUserData, handleEditUser }) => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [role, setRole] = useState();

  const handleSubmit = async () => {
    const payload = {
      name: name || editUserData.name,
      email: email || editUserData.email,
      role: role || editUserData.role,
    };
    await handleEditUser(payload, editUserData._id);
    setEditUser(!editUser);
  };

  return (
    <Modal show={editUser} onHide={() => setEditUser(!editUser)}>
      <Modal.Header closeButton>
        <Modal.Title>Update User Form</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name || editUserData.name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              disabled={true}
              placeholder="Enter email"
              value={email || editUserData.email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formRole">
            <Form.Label>Role</Form.Label>
            <Form.Control
              as="select"
              value={role || editUserData.role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setEditUser(!editUser)}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserModal;
