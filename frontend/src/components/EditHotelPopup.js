import React, { useState } from "react";
import Axios from "axios";
import "./EditHotelPopup.css";

const EditHotelPopup = ({ hotel, closePopup, refreshHotels }) => {
    const [editedHotel, setEditedHotel] = useState({
        Name: hotel.Name,
        Description: hotel.Description,
        StarRating: hotel.StarRating,
        Location: { ...hotel.Location }, // Copy location object
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("Location.")) {
            const field = name.split(".")[1];
            setEditedHotel((prev) => ({
                ...prev,
                Location: { ...prev.Location, [field]: value },
            }));
        } else {
            setEditedHotel((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = () => {
        Axios.put(`http://localhost:3001/update-hotel/${hotel.HotelID}`, editedHotel)
            .then(() => {
                alert("Hotel updated successfully!");
                closePopup();
                refreshHotels();
            })
            .catch((error) => {
                console.error("Error updating hotel:", error);
                alert("Failed to update hotel.");
            });
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Edit Hotel</h2>
                <label>Name:</label>
                <input type="text" name="Name" value={editedHotel.Name} onChange={handleChange} />

                <label>Description:</label>
                <textarea name="Description" value={editedHotel.Description} onChange={handleChange} />

                <label>Star Rating:</label>
                <input type="number" name="StarRating" value={editedHotel.StarRating} onChange={handleChange} min="1" max="5" />

                <h3>Location</h3>
                <label>City:</label>
                <input type="text" name="Location.city" value={editedHotel.Location.city} onChange={handleChange} />
                
                <label>State:</label>
                <input type="text" name="Location.state" value={editedHotel.Location.state} onChange={handleChange} />
                
                <label>Zip:</label>
                <input type="text" name="Location.zip" value={editedHotel.Location.zip} onChange={handleChange} />
                
                <label>Country:</label>
                <input type="text" name="Location.country" value={editedHotel.Location.country} onChange={handleChange} />

                <div className="popup-buttons">
                    <button className="save-button" onClick={handleSave}>Save Changes</button>
                    <button className="cancel-button" onClick={closePopup}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default EditHotelPopup;
