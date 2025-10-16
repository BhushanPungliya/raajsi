/**
 * Address Helper Utilities
 * Functions to validate and format address data
 */

/**
 * Validate if an address object is complete
 * @param {Object} address - Address object to validate
 * @param {Boolean} requireState - Whether state is required (default: true)
 * @returns {Boolean} - True if address is complete
 */
export const isAddressComplete = (address, requireState = true) => {
    if (!address) return false;
    
    const requiredFields = ['firstName', 'email', 'phoneNumber', 'street', 'city', 'country'];
    
    // Add state to required fields if needed
    if (requireState && address.state) {
        requiredFields.push('state');
    }
    
    return requiredFields.every(field => {
        const value = address[field];
        return value && value.toString().trim().length > 0;
    });
};

/**
 * Validate address fields and return errors
 * @param {Object} address - Address object to validate
 * @returns {Object} - Errors object with field names as keys
 */
export const validateAddress = (address) => {
    const errors = {};
    
    if (!address.firstName?.trim()) {
        errors.firstName = 'First name is required';
    }
    
    if (!address.email?.trim()) {
        errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) {
        errors.email = 'Invalid email format';
    }
    
    if (!address.phoneNumber?.trim()) {
        errors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(address.phoneNumber.replace(/[\s-()]/g, ''))) {
        errors.phoneNumber = 'Invalid phone number (10 digits required)';
    }
    
    if (!address.street?.trim()) {
        errors.street = 'Street address is required';
    }
    
    if (!address.country?.trim()) {
        errors.country = 'Country is required';
    }
    
    if (!address.state?.trim() && address.country) {
        // State might not be required for some countries
        errors.state = 'State is required';
    }
    
    if (!address.city?.trim()) {
        errors.city = 'City is required';
    }
    
    if (!address.zip?.trim()) {
        errors.zip = 'Postal code is required';
    }
    
    return errors;
};

/**
 * Format address for display
 * @param {Object} address - Address object
 * @returns {String} - Formatted address string
 */
export const formatAddressDisplay = (address) => {
    if (!address) return '';
    
    const parts = [
        address.street,
        address.city,
        address.state,
        address.zip,
        address.country
    ].filter(Boolean);
    
    return parts.join(', ');
};

/**
 * Format address for single line display
 * @param {Object} address - Address object
 * @returns {String} - Single line formatted address
 */
export const formatAddressSingleLine = (address) => {
    if (!address) return 'No address provided';
    
    const { street, city, state, zip, country } = address;
    
    let formatted = '';
    if (street) formatted += street;
    if (city) formatted += (formatted ? ', ' : '') + city;
    if (state) formatted += (formatted ? ', ' : '') + state;
    if (zip) formatted += (formatted ? ' ' : '') + zip;
    if (country) formatted += (formatted ? ', ' : '') + country;
    
    return formatted || 'Incomplete address';
};

/**
 * Get default address object
 * @returns {Object} - Default empty address
 */
export const getDefaultAddress = () => ({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India' // Default to India
});

/**
 * Sanitize address data (trim whitespace)
 * @param {Object} address - Address object
 * @returns {Object} - Sanitized address
 */
export const sanitizeAddress = (address) => {
    if (!address) return getDefaultAddress();
    
    return Object.keys(address).reduce((acc, key) => {
        acc[key] = typeof address[key] === 'string' ? address[key].trim() : address[key];
        return acc;
    }, {});
};

/**
 * Check if two addresses are the same
 * @param {Object} address1 - First address
 * @param {Object} address2 - Second address
 * @returns {Boolean} - True if addresses match
 */
export const areAddressesEqual = (address1, address2) => {
    if (!address1 || !address2) return false;
    
    const fields = ['firstName', 'lastName', 'email', 'phoneNumber', 'street', 'city', 'state', 'zip', 'country'];
    
    return fields.every(field => 
        (address1[field] || '').trim().toLowerCase() === (address2[field] || '').trim().toLowerCase()
    );
};

/**
 * Extract name parts from full name
 * @param {String} fullName - Full name string
 * @returns {Object} - Object with firstName and lastName
 */
export const splitFullName = (fullName) => {
    if (!fullName) return { firstName: '', lastName: '' };
    
    const parts = fullName.trim().split(' ');
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ') || '';
    
    return { firstName, lastName };
};

/**
 * Combine first and last name
 * @param {String} firstName - First name
 * @param {String} lastName - Last name
 * @returns {String} - Full name
 */
export const combineFullName = (firstName, lastName) => {
    return [firstName, lastName].filter(Boolean).join(' ').trim();
};
