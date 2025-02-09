import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Card } from 'react-bootstrap';
import { BASE_API } from '../../../constants/BASE_API';

const CreateChatModal = ({ onClose, onChatCreated }) => {
  const [chatName, setChatName] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSave = () => {
    console.log('Створюємо чат з назвою:', chatName);
    console.log('Обраний користувач:', selectedUser);
    const token = localStorage.getItem('accessToken');

    const body = JSON.stringify({
      id: selectedUser.id,
      email: selectedUser.email,
      firstName: selectedUser.firstName,
      lastName: selectedUser.lastName,
      role: selectedUser.role
    });

    fetch(`${BASE_API}/Chat/private-chat`, {
      method: 'POST',
       headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: body
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }).then((data) =>{
      console.log("succesfully created chat");
       onChatCreated();
    }) 

    onClose(); 
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    fetch(`${BASE_API}/Chat/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Answer from the server:", data);
        setUsers(data);
      })
      .catch((error) => {
        console.error('Помилка запиту:', error);
      });
  }, []);

  return (
    <Modal show={true} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Створити новий чат</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Назва чату</Form.Label>
          <Form.Control
            type="text"
            placeholder="Введіть назву"
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
          />
        </Form.Group>

        <div className="user-panels" style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px' }}>
          {users.map((user) => (
            <Card
              key={user.id}
              className={`mb-2 ${selectedUser?.id === user.id ? 'border-primary' : ''}`}
              onClick={() => setSelectedUser(user)}
              style={{ cursor: 'pointer' }}
            >
              <Card.Body>
                <Card.Title>{user.firstName} {user.lastName}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{user.role}</Card.Subtitle>
                <Card.Text>
                  Email: {user.email}
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Скасувати
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={!selectedUser}>
          Зберегти
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateChatModal;