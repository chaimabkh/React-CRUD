import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [items, setItems] = useState([]);
    const [itemName, setItemName] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [itemId, setItemId] = useState(null);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        axios.get('/api/items').then(res => {
            setItems(res.data);
        });
    }, []);

    const handleItemNameChange = e => {
        setItemName(e.target.value);
    };

    const handleItemDescriptionChange = e => {
        setItemDescription(e.target.value);
    };

    const handleItemSubmit = e => {
        e.preventDefault();
        if (!editing) {
            axios.post('/api/items', { name: itemName, description: itemDescription }).then(res => {
                setItems([...items, res.data]);
            });
        } else {
            axios.put(`/api/items/${itemId}`, { name: itemName, description: itemDescription }).then(res => {
                setItems(
                    items.map(item => {
                        if (item.id === itemId) {
                            return res.data;
                        }
                        return item;
                    })
                );
            });
            setItemId(null);
            setEditing(false);
        }
        setItemName('');
        setItemDescription('');
    };

    const handleItemDelete = itemId => {
        axios.delete(`/api/items/${itemId}`).then(() => {
            setItems(items.filter(item => item.id !== itemId));
        });
    };

    const handleItemEdit = item => {
        setItemId(item.id);
        setItemName(item.name);
        setItemDescription(item.description);
        setEditing(true);
    };

    return (
        <div className="app-container">
            <h1 className="app-header">Items</h1>
            <ul className="item-list">
                {items.map(item => (
                    <li key={item.id} className="item">
                        <div className="item-details">
                            <h2 className="item-name">{item.name}</h2>
                            <p className="item-description">{item.description}</p>
                        </div>
                        <div className="item-actions">
                            <button className="item-button" onClick={() => handleItemDelete(item.id)}>Delete</button>
                            <button className="item-button" onClick={() => handleItemEdit(item)}>Edit</button>
                        </div>
                    </li>
                ))}
            </ul>
            <h2 className="app-header">{editing ? 'Edit item' : 'Add item'}</h2>
            <form className="item-form" onSubmit={handleItemSubmit}>
                <label className="item-label">
                    Name:
                    <input className="item-input" type="text" value={itemName} onChange={handleItemNameChange} />
                </label>
                <label className="item-label">
                    Description:
                    <input className="item-input" type="text" value={itemDescription} onChange={handleItemDescriptionChange} />
                </label>
                <button className="item-button" type="submit">{editing ? 'Save' : 'Add'}</button>
            </form>
        </div>
    );
}

export default App;
