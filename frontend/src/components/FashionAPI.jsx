import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FashionAPI.css';

const FashionAPI = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [page, setPage] = useState(1);
  const [similarItems, setSimilarItems] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 30;

  // Fetch all items from the API
  const fetchItems = async (pageNum) => {
    try {
      setLoading(true);
      console.log(`Fetching page ${pageNum} with ${itemsPerPage} items per page`);
      
      const response = await axios.get(`http://192.168.202.110:8000/all-items?page=${pageNum}&items_per_page=${itemsPerPage}`);
      console.log('API Response:', response.data);
      
      // Check if response.data is an array or has an items property
      let itemsData = [];
      if (Array.isArray(response.data)) {
        itemsData = response.data;
      } else if (response.data.items && Array.isArray(response.data.items)) {
        itemsData = response.data.items;
      } else {
        console.error('Unexpected API response structure:', response.data);
        setError('Unexpected data format received from the server');
        setLoading(false);
        return;
      }
      
      // Process the items to convert Base64 to image URLs
      const processedItems = itemsData.map(item => {
        console.log('Processing item:', item);
        return {
          ...item,
          // Convert Base64 to image URL
          imageUrl: `data:image/jpeg;base64,${item.image}`
        };
      });
      
      console.log('Processed items:', processedItems);
      setItems(processedItems);
      
      // Update total pages if available in the response
      if (response.data.total_pages) {
        setTotalPages(response.data.total_pages);
      }
      
      setLoading(false);
    } catch (err) {
      setError(`Failed to fetch items: ${err.message}`);
      setLoading(false);
      console.error('Error fetching items:', err);
    }
  };

  // Find similar items based on selected image
  const findSimilarItems = async (imageId) => {
    try {
      setLoadingSimilar(true);
      console.log('Finding similar items for image ID:', imageId);
      
      const response = await axios.post('http://192.168.202.110:8000/find-similar', {
        image_id: imageId
      });
      
      console.log('Similar items response:', response.data);
      
      // Check if response.data is an array
      let similarItemsData = Array.isArray(response.data) ? response.data : [];
      
      // Process similar items to convert Base64 to image URLs
      const processedSimilarItems = similarItemsData.map(item => ({
        ...item,
        imageUrl: `data:image/jpeg;base64,${item.image}`
      }));
      
      console.log('Processed similar items:', processedSimilarItems);
      setSimilarItems(processedSimilarItems);
      setLoadingSimilar(false);
    } catch (err) {
      setError(`Failed to find similar items: ${err.message}`);
      setLoadingSimilar(false);
      console.error('Error finding similar items:', err);
    }
  };

  // Handle image selection
  const handleImageSelect = (item) => {
    console.log('Selected item:', item);
    setSelectedImage(item);
    findSimilarItems(item.id);
  };

  // Load items when component mounts or page changes
  useEffect(() => {
    fetchItems(page);
  }, [page]);

  // Handle pagination
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="fashion-api-container">
      <h1>Fashion Items</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Loading items...</div>
      ) : (
        <>
          {items.length === 0 ? (
            <div className="no-items">No items found. Please try again later.</div>
          ) : (
            <div className="items-grid">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className={`item-card ${selectedImage?.id === item.id ? 'selected' : ''}`}
                  onClick={() => handleImageSelect(item)}
                >
                  <img 
                    src={item.imageUrl} 
                    alt={item.name || 'Fashion item'} 
                    className="item-image"
                    onError={(e) => {
                      console.error('Image failed to load:', e);
                      e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Available';
                    }}
                  />
                  <div className="item-details">
                    <h3>{item.name || 'Unnamed Item'}</h3>
                    {item.price && <p>${item.price}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="pagination">
            <button 
              onClick={handlePrevPage} 
              disabled={page === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            <span className="page-number">Page {page} of {totalPages}</span>
            <button 
              onClick={handleNextPage}
              disabled={page >= totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
          
          {selectedImage && (
            <div className="selected-item-section">
              <h2>Selected Item</h2>
              <div className="selected-item">
                <img 
                  src={selectedImage.imageUrl} 
                  alt={selectedImage.name || 'Selected item'} 
                  className="selected-image"
                  onError={(e) => {
                    console.error('Selected image failed to load:', e);
                    e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Available';
                  }}
                />
                <div className="selected-details">
                  <h3>{selectedImage.name || 'Unnamed Item'}</h3>
                  {selectedImage.price && <p>${selectedImage.price}</p>}
                  {selectedImage.description && <p>{selectedImage.description}</p>}
                </div>
              </div>
            </div>
          )}
          
          {selectedImage && (
            <div className="similar-items-section">
              <h2>Similar Items</h2>
              {loadingSimilar ? (
                <div className="loading">Finding similar items...</div>
              ) : similarItems.length === 0 ? (
                <div className="no-items">No similar items found.</div>
              ) : (
                <div className="similar-items-grid">
                  {similarItems.map((item) => (
                    <div key={item.id} className="similar-item-card">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name || 'Similar item'} 
                        className="similar-item-image"
                        onError={(e) => {
                          console.error('Similar image failed to load:', e);
                          e.target.src = 'https://via.placeholder.com/200x200?text=Image+Not+Available';
                        }}
                      />
                      <div className="similar-item-details">
                        <h3>{item.name || 'Unnamed Item'}</h3>
                        {item.price && <p>${item.price}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FashionAPI; 