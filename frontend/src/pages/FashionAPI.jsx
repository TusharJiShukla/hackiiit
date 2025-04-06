import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Configure the base URL for your FastAPI server
const API_BASE_URL = 'http://192.168.202.110:8000';

const FashionAPI = () => {
  const [queryId, setQueryId] = useState('');
  const [similarItems, setSimilarItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [randomImages, setRandomImages] = useState([]);
  const [showRandomImages, setShowRandomImages] = useState(true);
  const [allImageIds, setAllImageIds] = useState([]);
  const [failedImages, setFailedImages] = useState({}); // Track failed images to prevent repeated errors
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 30;

  // Load image IDs from API on component mount
  useEffect(() => {
    const loadImageIds = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/all-items?page=${currentPage}&items_per_page=${itemsPerPage}`);
        
        if (response.data && response.data.items) {
          const imageIds = response.data.items.map(item => item.id);
          setAllImageIds(imageIds);
          
          // Set total pages if available in the response
          if (response.data.total_pages) {
            setTotalPages(response.data.total_pages);
          }
          
          // If we have image IDs, generate random images
          if (imageIds.length > 0) {
            generateRandomImages(imageIds);
          } else {
            console.error('No image IDs found in the response');
            setError('No images found. Please try again later.');
          }
        } else {
          console.error('Unexpected API response structure:', response.data);
          setError('Failed to load images. Please try again later.');
        }
      } catch (err) {
        console.error('Error loading image IDs:', err);
        setError('Failed to load images. Please check if the server is running.');
      }
    };
    
    loadImageIds();
  }, [currentPage]); // Re-run when currentPage changes

  // Generate random images from the list of all image IDs
  const generateRandomImages = async (imageIds) => {
    try {
      // Shuffle the array to get random images
      const shuffled = [...imageIds].sort(() => 0.5 - Math.random());
      // Take the first 50 images (or fewer if we have less than 50)
      const selectedIds = shuffled.slice(0, Math.min(50, shuffled.length));
      
      // Fetch the full item data for the selected IDs
      const response = await axios.get(`${API_BASE_URL}/all-items?page=${currentPage}&items_per_page=${itemsPerPage}`);
      const allItems = response.data.items;
      
      // Create image objects with the full item data
      const images = selectedIds.map(id => {
        const item = allItems.find(item => item.id === id);
        return {
          id,
          // Use the image field directly from the API response
          image_path: item ? item.image : null,
          loading: true
        };
      });
      
      setRandomImages(images);
    } catch (err) {
      console.error('Error generating random images:', err);
      setError('Failed to load random images. Please try again.');
    }
  };

  // Handle image click to find similar items
  const handleImageClick = (id) => {
    setQueryId(id);
    setShowRandomImages(false);
    findSimilarItems(id);
  };

  // Find similar items when an item ID is submitted
  const findSimilarItems = async (id) => {
    if (!id.trim()) {
      setError('Please enter an item ID');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${API_BASE_URL}/find-similar`, {
        query_id: id
      });
      
      // Process the response to use the image field directly
      const processedItems = response.data.similar_items.map(item => {
        return {
          ...item,
          // Use the image field directly from the API response
          image_path: item.image || null,
          loading: true // Add a loading state for each image
        };
      });
      
      setSimilarItems(processedItems);
    } catch (err) {
      console.error('Error finding similar items:', err);
      setError('Failed to find similar items. Please check if the FastAPI server is running and accessible.');
      setSimilarItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Find similar items when form is submitted
  const handleFindSimilar = async (e) => {
    e.preventDefault();
    setShowRandomImages(false);
    findSimilarItems(queryId);
  };

  // Go back to random images
  const handleBackToRandom = () => {
    setShowRandomImages(true);
    setSimilarItems([]);
    setQueryId('');
    setError(null);
  };

  // Generate new random images
  const handleGenerateNewRandom = () => {
    if (allImageIds.length > 0) {
      generateRandomImages(allImageIds);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-center text-gray-800 drop-shadow-sm tracking-wider">
          ✨ Fashion <span className="text-pink-500">Similar Items</span> ✨
        </h1>
        
        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {!showRandomImages && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-pink-100 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="bg-gradient-to-r from-pink-400 to-rose-400 text-white p-2 rounded-lg mr-3">🔍</span>
              Find Similar Items
            </h2>
            
            <form onSubmit={handleFindSimilar} className="space-y-4">
              <div>
                <label htmlFor="queryId" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter Item ID
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="queryId"
                    value={queryId}
                    onChange={(e) => setQueryId(e.target.value)}
                    placeholder="Enter the ID of the item to find similar items"
                    className="flex-1 px-4 py-2 rounded-lg border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-lg font-medium hover:from-pink-500 hover:to-rose-500 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
                  >
                    {loading ? 'Searching...' : 'Find Similar'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : (
          <>
            {showRandomImages ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-pink-100 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <span className="bg-gradient-to-r from-pink-400 to-rose-400 text-white p-2 rounded-lg mr-3">🖼️</span>
                    Browse Fashion Items
                  </h2>
                  <button
                    onClick={handleGenerateNewRandom}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200"
                  >
                    Show New Random Items
                  </button>
                </div>
                <p className="text-gray-600 mb-4">Click on any image to find similar items</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 auto-rows-fr">
                  {randomImages.map((item) => (
                    <div
                      key={item.id}
                      className="relative flex flex-col items-center p-4 rounded-lg bg-white/50 border border-pink-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer h-full"
                      onClick={() => handleImageClick(item.id)}
                    >
                      <div className="w-full aspect-square flex items-center justify-center mb-2 overflow-hidden rounded-lg bg-gray-100">
                        {item.loading && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
                          </div>
                        )}
                        <img
                          src={item.image_path}
                          alt={`Item ${item.id}`}
                          className={`w-full h-full object-cover hover:scale-110 transition-transform duration-300 ${item.loading ? 'opacity-0' : 'opacity-100'}`}
                          onLoad={() => {
                            // Update the loading state when the image loads
                            setRandomImages(prevImages => 
                              prevImages.map(img => 
                                img.id === item.id ? { ...img, loading: false } : img
                              )
                            );
                          }}
                          onError={(e) => {
                            // Only log error and update state if we haven't already marked this image as failed
                            if (!failedImages[item.id]) {
                              console.error(`Failed to load image for item ${item.id}`);
                              // Update the loading state
                              setRandomImages(prevImages => 
                                prevImages.map(img => 
                                  img.id === item.id ? { ...img, loading: false } : img
                                )
                              );
                              // Mark this image as failed to prevent repeated error handling
                              setFailedImages(prev => ({ ...prev, [item.id]: true }));
                              // Use a data URI for the placeholder instead of an external URL
                              e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22150%22%20height%3D%22150%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20150%20150%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18a5c1c8c8c%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3A-apple-system%2CBlinkMacSystemFont%2C%26quot%3BSegoe%20UI%26quot%3B%2CRoboto%2C%26quot%3BHelvetica%20Neue%26quot%3B%2CArial%2C%26quot%3BNoto%20Sans%26quot%3B%2Csans-serif%2C%26quot%3BApple%20Color%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Symbol%26quot%3B%2C%26quot%3BNoto%20Color%20Emoji%26quot%3B%2Cmonospace%2C%26quot%3BSegoe%20UI%20Mono%26quot%3B%2C%26quot%3BRoboto%20Mono%26quot%3B%2C%26quot%3BMonaco%26quot%3B%2C%26quot%3BCourier%20New%26quot%3B%2Cmonospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18a5c1c8c8c%22%3E%3Crect%20width%3D%22150%22%20height%3D%22150%22%20fill%3D%22%23373940%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2256.1953125%22%20y%3D%2280.1%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
                              e.target.onerror = null; // Prevent infinite error loop
                            }
                          }}
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">ID: {item.id}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pagination Controls */}
                <div className="mt-6 flex justify-center items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <>
                {similarItems.length > 0 ? (
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-pink-100 p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold text-gray-800 flex items-center">
                        <span className="bg-gradient-to-r from-pink-400 to-rose-400 text-white p-2 rounded-lg mr-3">🎯</span>
                        Similar Items
                      </h2>
                      <button
                        onClick={handleBackToRandom}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200"
                      >
                        Back to Browse
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 auto-rows-fr">
                      {similarItems.map((item) => (
                        <div
                          key={item.id}
                          className="relative flex flex-col items-center p-4 rounded-lg bg-white/50 border border-pink-100 shadow-sm hover:shadow-md transition-all duration-300 h-full"
                        >
                          <div className="w-full aspect-square flex items-center justify-center mb-2 overflow-hidden rounded-lg bg-gray-100">
                            {item.loading && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
                              </div>
                            )}
                            <img
                              src={item.image_path}
                              alt={item.name || `Item ${item.id}`}
                              className={`w-full h-full object-cover hover:scale-110 transition-transform duration-300 ${item.loading ? 'opacity-0' : 'opacity-100'}`}
                              onLoad={() => {
                                // Update the loading state when the image loads
                                setSimilarItems(prevItems => 
                                  prevItems.map(img => 
                                    img.id === item.id ? { ...img, loading: false } : img
                                  )
                                );
                              }}
                              onError={(e) => {
                                // Only log error and update state if we haven't already marked this image as failed
                                if (!failedImages[item.id]) {
                                  console.error(`Failed to load image for item ${item.id} at ${item.image_path}`);
                                  // Update the loading state
                                  setSimilarItems(prevItems => 
                                    prevItems.map(img => 
                                      img.id === item.id ? { ...img, loading: false } : img
                                    )
                                  );
                                  // Mark this image as failed to prevent repeated error handling
                                  setFailedImages(prev => ({ ...prev, [item.id]: true }));
                                  // Use a data URI for the placeholder instead of an external URL
                                  e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22150%22%20height%3D%22150%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20150%20150%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18a5c1c8c8c%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3A-apple-system%2CBlinkMacSystemFont%2C%26quot%3BSegoe%20UI%26quot%3B%2CRoboto%2C%26quot%3BHelvetica%20Neue%26quot%3B%2CArial%2C%26quot%3BNoto%20Sans%26quot%3B%2Csans-serif%2C%26quot%3BApple%20Color%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Symbol%26quot%3B%2C%26quot%3BNoto%20Color%20Emoji%26quot%3B%2Cmonospace%2C%26quot%3BSegoe%20UI%20Mono%26quot%3B%2C%26quot%3BRoboto%20Mono%26quot%3B%2C%26quot%3BMonaco%26quot%3B%2C%26quot%3BCourier%20New%26quot%3B%2Cmonospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18a5c1c8c8c%22%3E%3Crect%20width%3D%22150%22%20height%3D%22150%22%20fill%3D%22%23373940%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2256.1953125%22%20y%3D%2280.1%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
                                  e.target.onerror = null; // Prevent infinite error loop
                                }
                              }}
                            />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-800 truncate w-full">
                              {item.name || `Item ${item.id}`}
                            </p>
                            <p className="text-xs text-gray-500">ID: {item.id}</p>
                            {item.similarity && (
                              <p className="text-xs text-pink-500 mt-1">
                                Similarity: {(item.similarity * 100).toFixed(1)}%
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-pink-100 p-6 text-center">
                    <p className="text-gray-500">Enter an item ID above to find similar items.</p>
                    <button
                      onClick={handleBackToRandom}
                      className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200"
                    >
                      Back to Browse
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FashionAPI; 