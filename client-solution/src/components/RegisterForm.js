// src/components/RegisterForm.js
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../api/auth';
import { useNavigate, Link } from 'react-router-dom';

export const RegisterForm = () => {
  const initialFormData = {
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    address: {
      country: '',
      city: '',
      street: '',
      postalCode: ''
    }
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // Validation rules
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Name validation
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';

    // Address validation
    if (!formData.address.country) newErrors['address.country'] = 'Country is required';
    if (!formData.address.city) newErrors['address.city'] = 'City is required';
    if (!formData.address.street) newErrors['address.street'] = 'Street is required';
    if (!formData.address.postalCode) newErrors['address.postalCode'] = 'Postal code is required';

    return newErrors;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubmitError(''); // Clear submit error when user types

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error for the field being changed
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setSubmitError('');

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registrationData } = formData;
      
      const response = await authApi.register(registrationData);
      
      // Check if response has required data
      if (response && response.token) {
        login(response.token, response.user);
        navigate('/dashboard');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setSubmitError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to render input field with error
  const renderInput = (name, placeholder, type = 'text') => {
    const isAddress = name.includes('.');
    const value = isAddress 
      ? formData.address[name.split('.')[1]]
      : formData[name];
    const error = errors[name];
    
    return (
      <div className="mb-4">
        <input
          name={name}
          type={type}
          required
          className={`appearance-none relative block w-full px-3 py-2 border 
            ${error ? 'border-red-500' : 'border-gray-300'}
            placeholder-gray-500 text-gray-900 rounded-md
            focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
            focus:z-10 sm:text-sm`}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          disabled={isLoading}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              sign in to your account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* Account Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Account Details</h3>
              {renderInput('email', 'Email address', 'email')}
              {renderInput('password', 'Password', 'password')}
              {renderInput('confirmPassword', 'Confirm Password', 'password')}
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
              {renderInput('firstName', 'First Name')}
              {renderInput('lastName', 'Last Name')}
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Address</h3>
              {renderInput('address.country', 'Country')}
              {renderInput('address.city', 'City')}
              {renderInput('address.street', 'Street')}
              {renderInput('address.postalCode', 'Postal Code')}
            </div>
          </div>

          {submitError && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
              {submitError}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent
                text-sm font-medium rounded-md text-white bg-indigo-600
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;