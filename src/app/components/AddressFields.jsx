'use client';

import { useState, useEffect } from 'react';
import Select from 'react-select';
import { Country, State, City } from 'country-state-city';

/**
 * AddressFields Component
 * Searchable dropdowns for Country, State, and City with hierarchical selection
 * 
 * @param {Object} address - Current address object with country, state, city
 * @param {Function} onChange - Callback when any field changes
 * @param {Object} errors - Validation errors object
 * @param {Boolean} disabled - Disable all fields
 * @param {Boolean} showLabels - Show field labels (default: true)
 * @param {String} layout - 'grid' or 'stack' layout (default: 'grid')
 */
export default function AddressFields({ 
    address = {}, 
    onChange, 
    errors = {}, 
    disabled = false,
    showLabels = true,
    layout = 'grid'
}) {
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    
    const [stateOptions, setStateOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);

    // Custom styles for react-select to match your theme
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            borderRadius: '8px',
            borderColor: state.isFocused ? '#BA7E38' : errors[state.selectProps.name] ? '#EF4444' : '#D1D5DB',
            padding: '6px',
            minHeight: '48px',
            boxShadow: state.isFocused ? '0 0 0 2px rgba(186, 126, 56, 0.2)' : 'none',
            '&:hover': {
                borderColor: state.isFocused ? '#BA7E38' : '#9CA3AF'
            },
            cursor: disabled ? 'not-allowed' : 'pointer',
            backgroundColor: disabled ? '#F9FAFB' : 'white'
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected 
                ? '#BA7E38' 
                : state.isFocused 
                ? '#F3E8D7' 
                : 'white',
            color: state.isSelected ? 'white' : '#3C3C3C',
            cursor: 'pointer',
            padding: '10px 12px',
            '&:active': {
                backgroundColor: '#BA7E38'
            }
        }),
        menu: (provided) => ({
            ...provided,
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            zIndex: 100
        }),
        menuList: (provided) => ({
            ...provided,
            maxHeight: '200px',
            padding: '4px'
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#9CA3AF'
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#3C3C3C'
        }),
        input: (provided) => ({
            ...provided,
            color: '#3C3C3C'
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: '#BA7E38',
            '&:hover': {
                color: '#a96f2e'
            }
        }),
        clearIndicator: (provided) => ({
            ...provided,
            color: '#EF4444',
            '&:hover': {
                color: '#DC2626'
            }
        }),
        loadingIndicator: (provided) => ({
            ...provided,
            color: '#BA7E38'
        })
    };

    // Get all countries with India first
    const countryOptions = Country.getAllCountries()
        .map(country => ({
            value: country.isoCode,
            label: country.name,
            flag: country.flag,
            phoneCode: country.phonecode,
            ...country
        }))
        .sort((a, b) => {
            // Put India first
            if (a.value === 'IN') return -1;
            if (b.value === 'IN') return 1;
            return a.label.localeCompare(b.label);
        });

    // Initialize selected values from address prop
    useEffect(() => {
        if (address?.country) {
            // Find country by name
            const country = countryOptions.find(c => 
                c.label.toLowerCase() === address.country.toLowerCase()
            );
            
            if (country) {
                setSelectedCountry(country);
                
                // Load states for this country
                const states = State.getStatesOfCountry(country.value);
                const stateOpts = states.map(state => ({
                    value: state.isoCode,
                    label: state.name,
                    countryCode: state.countryCode,
                    ...state
                }));
                setStateOptions(stateOpts);
                
                // If state exists, find and select it
                if (address.state && stateOpts.length > 0) {
                    const state = stateOpts.find(s => 
                        s.label.toLowerCase() === address.state.toLowerCase()
                    );
                    
                    if (state) {
                        setSelectedState(state);
                        
                        // Load cities for this state
                        const cities = City.getCitiesOfState(country.value, state.value);
                        const cityOpts = cities.map(city => ({
                            value: city.name,
                            label: city.name,
                            ...city
                        }));
                        setCityOptions(cityOpts);
                        
                        // If city exists, find and select it
                        if (address.city) {
                            const city = cityOpts.find(c => 
                                c.label.toLowerCase() === address.city.toLowerCase()
                            );
                            if (city) {
                                setSelectedCity(city);
                            }
                        }
                    }
                }
            }
        }
    }, []); // Only run once on mount

    // Handle country change
    const handleCountryChange = (option) => {
        setSelectedCountry(option);
        setSelectedState(null);
        setSelectedCity(null);
        
        if (option) {
            // Load states for selected country
            const states = State.getStatesOfCountry(option.value);
            const stateOpts = states.map(state => ({
                value: state.isoCode,
                label: state.name,
                countryCode: state.countryCode,
                ...state
            }));
            setStateOptions(stateOpts);
            setCityOptions([]);
            
            // Call onChange with updated address
            onChange({
                ...address,
                country: option.label,
                state: '',
                city: ''
            });
        } else {
            // Cleared selection
            setStateOptions([]);
            setCityOptions([]);
            onChange({
                ...address,
                country: '',
                state: '',
                city: ''
            });
        }
    };

    // Handle state change
    const handleStateChange = (option) => {
        setSelectedState(option);
        setSelectedCity(null);
        
        if (option && selectedCountry) {
            // Load cities for selected state
            const cities = City.getCitiesOfState(selectedCountry.value, option.value);
            const cityOpts = cities.map(city => ({
                value: city.name,
                label: city.name,
                stateCode: city.stateCode,
                ...city
            }));
            setCityOptions(cityOpts);
            
            // Call onChange with updated address
            onChange({
                ...address,
                state: option.label,
                city: ''
            });
        } else {
            // Cleared selection
            setCityOptions([]);
            onChange({
                ...address,
                state: '',
                city: ''
            });
        }
    };

    // Handle city change
    const handleCityChange = (option) => {
        setSelectedCity(option);
        
        if (option) {
            onChange({
                ...address,
                city: option.label
            });
        } else {
            onChange({
                ...address,
                city: ''
            });
        }
    };

    const gridClass = layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-4' : 'space-y-4';

    return (
        <div className={gridClass}>
            {/* Country Dropdown */}
            <div>
                {showLabels && (
                    <label className="block text-sm font-medium text-[#3C3C3C] mb-2">
                        Country *
                    </label>
                )}
                <Select
                    name="country"
                    options={countryOptions}
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    isDisabled={disabled}
                    placeholder="Select Country"
                    styles={customStyles}
                    isSearchable
                    isClearable
                    className="react-select-container"
                    classNamePrefix="react-select"
                    noOptionsMessage={() => "No countries found"}
                />
                {errors?.country && (
                    <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                )}
            </div>

            {/* State Dropdown */}
            <div>
                {showLabels && (
                    <label className="block text-sm font-medium text-[#3C3C3C] mb-2">
                        State {stateOptions.length > 0 ? '*' : ''}
                    </label>
                )}
                <Select
                    name="state"
                    options={stateOptions}
                    value={selectedState}
                    onChange={handleStateChange}
                    isDisabled={disabled || !selectedCountry || stateOptions.length === 0}
                    placeholder={
                        !selectedCountry 
                            ? "Select country first" 
                            : stateOptions.length === 0 
                            ? "No states available" 
                            : "Select State"
                    }
                    styles={customStyles}
                    isSearchable
                    isClearable
                    className="react-select-container"
                    classNamePrefix="react-select"
                    noOptionsMessage={() => "No states found"}
                />
                {errors?.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                )}
            </div>

            {/* City Dropdown */}
            <div>
                {showLabels && (
                    <label className="block text-sm font-medium text-[#3C3C3C] mb-2">
                        City {cityOptions.length > 0 ? '*' : ''}
                    </label>
                )}
                <Select
                    name="city"
                    options={cityOptions}
                    value={selectedCity}
                    onChange={handleCityChange}
                    isDisabled={disabled || !selectedState || cityOptions.length === 0}
                    placeholder={
                        !selectedState 
                            ? "Select state first" 
                            : cityOptions.length === 0 
                            ? "No cities available" 
                            : "Select City"
                    }
                    styles={customStyles}
                    isSearchable
                    isClearable
                    className="react-select-container"
                    classNamePrefix="react-select"
                    noOptionsMessage={() => "No cities found"}
                />
                {errors?.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
            </div>
        </div>
    );
}
