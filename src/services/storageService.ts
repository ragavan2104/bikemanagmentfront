import { auth } from '../config/firebase';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const uploadBikeImage = async (file: File): Promise<string> => {
  try {
    // Ensure user is authenticated
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be authenticated to upload images');
    }

    // Validate file
    if (!file) {
      throw new Error('No file provided');
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      throw new Error('File size must be less than 5MB');
    }

    console.log('Uploading file via server:', file.name);
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'bike'); // or 'aadhar'
    
    // Get user token for authentication
    const idToken = await user.getIdToken();
    
    // Upload through server to avoid CORS issues
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${idToken}`
      }
    });
    
    console.log('Upload successful:', response.data);
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Upload failed');
    }
    
    const downloadURL = response.data.data.downloadURL;
    console.log('Download URL obtained:', downloadURL);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    
    // Handle axios errors specifically
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please login again.');
      } else if (error.response?.status === 413) {
        throw new Error('File too large. Maximum size is 5MB.');
      } else if (error.response?.status === 503) {
        throw new Error('Storage service unavailable. Please set up Firebase Storage in the Firebase Console.');
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.code === 'ERR_NETWORK') {
        throw new Error('Network error. Please check if the server is running on port 5000.');
      }
    }
    
    throw new Error('Failed to upload image: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

export const uploadAadharImage = async (file: File): Promise<string> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be authenticated to upload images');
    }

    if (!file || !file.type.startsWith('image/')) {
      throw new Error('Invalid file type');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB');
    }

    console.log('Uploading Aadhar image via server:', file.name);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'aadhar');
    
    const idToken = await user.getIdToken();
    
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${idToken}`
      }
    });
    
    console.log('Aadhar upload successful:', response.data);
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Upload failed');
    }
    
    return response.data.data.downloadURL;
  } catch (error) {
    console.error('Error uploading Aadhar image:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please login again.');
      } else if (error.response?.status === 413) {
        throw new Error('File too large. Maximum size is 5MB.');
      } else if (error.response?.status === 503) {
        throw new Error('Storage service unavailable. Please set up Firebase Storage in the Firebase Console.');
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.code === 'ERR_NETWORK') {
        throw new Error('Network error. Please check if the server is running on port 5000.');
      }
    }
    
    throw new Error('Failed to upload Aadhar image: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};
