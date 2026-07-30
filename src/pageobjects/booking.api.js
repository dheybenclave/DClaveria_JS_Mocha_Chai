import { CONFIG } from '../utils/config.js';
import { APIRequestHelper } from '../utils/api.helpers.js';
import { logger } from '../utils/logger.js';
import { expect } from 'chai';

/**
 * Base API page object for Restful Booker CRUD operations.
 * Handles authentication, booking lifecycle, and response validation.
 */
export default class BookingAPIBase {
  /**
   * Initializes the API base URL and auth token holder.
   */
  constructor() {
    this.baseUrl = CONFIG.API_BASE_URL;
    this.authToken = null;
  }

  /**
   * Retrieves a cached auth token or fetches a new one from the API.
   * @returns {Promise<string>} Auth token string.
   */
  async getAuthToken() {
    if (!this.authToken) {
      logger.info('Getting auth token');
      const authResponse = await fetch(`${this.baseUrl}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: CONFIG.API_USERNAME,
          password: CONFIG.API_PASSWORD
        })
      });
      
      expect(authResponse.status, 'Auth request should succeed').to.equal(200);
      const responseJson = await authResponse.json();
      expect(responseJson.token, 'Auth token should be present').to.not.be.undefined;
      this.authToken = responseJson.token;
      expect(this.authToken, 'Auth token should not be empty').to.not.be.empty;
    }
    return this.authToken;
  }

  /**
   * Creates a new booking using the provided booking data.
   * @param {Object} [bookingData={}] - Booking fields to override defaults.
   * @param {string} [bookingData.firstname] - First name.
   * @param {string} [bookingData.lastname] - Last name.
   * @param {number} [bookingData.totalprice] - Total price.
   * @param {boolean} [bookingData.depositpaid] - Whether deposit is paid.
   * @param {Object} [bookingData.bookingdates] - Booking date range.
   * @param {string} [bookingData.bookingdates.checkin] - Check-in date.
   * @param {string} [bookingData.bookingdates.checkout] - Check-out date.
   * @param {string} [bookingData.additionalneeds] - Additional needs.
   * @returns {Promise<{response: Response, status: number, json: Object}>} Created booking response.
   */
  async createBooking(bookingData = {}) {
    logger.info('Creating new booking');
    const payload = APIRequestHelper.getBookingPayload(bookingData);
    logger.debug(`Payload: ${JSON.stringify(payload)}`);
    expect(payload, 'Booking payload should not be empty').to.not.be.empty;
    
    const response = await fetch(`${this.baseUrl}/booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    expect(response.status, 'Create booking should return 200').to.equal(200);
    const responseJson = await response.json();
    expect(responseJson.bookingid, 'Booking ID should be returned').to.not.be.undefined;
    return {
      response,
      status: response.status,
      json: responseJson
    };
  }

  /**
   * Retrieves a booking by its ID.
   * @param {number|string} bookingId - Booking ID to retrieve.
   * @returns {Promise<{response: Response, status: number, json: Object}>} Booking response.
   */
  async getBookingById(bookingId) {
    logger.info(`Getting booking by ID: ${bookingId}`);
    expect(bookingId, 'Booking ID should be provided').to.not.be.undefined;
    
    const response = await fetch(`${this.baseUrl}/booking/${bookingId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    expect(response.status, 'Get booking should return 200').to.equal(200);
    const responseJson = await response.json();
    expect(responseJson, 'Response should contain booking data').to.not.be.empty;
    return {
      response,
      status: response.status,
      json: responseJson
    };
  }

  /**
   * Retrieves bookings filtered by provided criteria.
   * @param {Object} [filters={}] - Filter parameters.
   * @param {string} [filters.firstname] - Filter by first name.
   * @param {string} [filters.lastname] - Filter by last name.
   * @param {string} [filters.checkin] - Filter by check-in date.
   * @param {string} [filters.checkout] - Filter by check-out date.
   * @returns {Promise<{response: Response, status: number, json: Array}>} Filtered bookings response.
   */
  async getBookingsByFilter(filters = {}) {
    logger.info(`Getting bookings by filter: ${JSON.stringify(filters)}`);
    const queryParams = new URLSearchParams();
    
    if (filters.firstname) queryParams.append('firstname', filters.firstname);
    if (filters.lastname) queryParams.append('lastname', filters.lastname);
    if (filters.checkin) queryParams.append('checkin', filters.checkin);
    if (filters.checkout) queryParams.append('checkout', filters.checkout);

    const response = await fetch(`${this.baseUrl}/booking?${queryParams}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    expect(response.status, 'Filter search should return 200').to.equal(200);
    const responseJson = await response.json();
    expect(Array.isArray(responseJson), 'Response should be an array').to.be.true;
    return {
      response,
      status: response.status,
      json: responseJson
    };
  }

  /**
   * Fully updates an existing booking.
   * @param {number|string} bookingId - Booking ID to update.
   * @param {Object} bookingData - Booking fields to update.
   * @param {boolean} [partial=false] - If true, performs a PATCH instead of PUT.
   * @returns {Promise<{response: Response, status: number, json: Object}>} Updated booking response.
   */
  async updateBooking(bookingId, bookingData, partial = false) {
    const token = await this.getAuthToken();
    logger.info(`Updating booking ID: ${bookingId}`);
    const payload = APIRequestHelper.getBookingPayload(bookingData);
    logger.debug(`Update payload: ${JSON.stringify(payload)}`);
    expect(bookingId, 'Booking ID should be provided for update').to.not.be.undefined;
    
    const method = partial ? 'PATCH' : 'PUT';
    const response = await fetch(`${this.baseUrl}/booking/${bookingId}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${token}`
      },
      body: JSON.stringify(payload)
    });

    expect(response.status, 'Update booking should return 200').to.equal(200);
    const responseJson = await response.json();
    expect(responseJson, 'Update response should not be empty').to.not.be.empty;
    return {
      response,
      status: response.status,
      json: responseJson
    };
  }

  /**
   * Partially updates an existing booking.
   * @param {number|string} bookingId - Booking ID to patch.
   * @param {Object} bookingData - Partial booking fields to update.
   * @returns {Promise<{response: Response, status: number, json: Object}>} Patched booking response.
   */
  async partialUpdateBooking(bookingId, bookingData) {
    const token = await this.getAuthToken();
    logger.info(`Partially updating booking ID: ${bookingId}`);
    const payload = APIRequestHelper.getBookingPayload(bookingData);
    logger.debug(`Patch payload: ${JSON.stringify(payload)}`);
    expect(bookingId, 'Booking ID should be provided for partial update').to.not.be.undefined;
    
    const response = await fetch(`${this.baseUrl}/booking/${bookingId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${token}`
      },
      body: JSON.stringify(payload)
    });

    expect(response.status, 'Partial update should return 200').to.equal(200);
    const responseJson = await response.json();
    expect(responseJson, 'Patch response should not be empty').to.not.be.empty;
    return {
      response,
      status: response.status,
      json: responseJson
    };
  }

  /**
   * Deletes a booking by ID.
   * @param {number|string} bookingId - Booking ID to delete.
   * @returns {Promise<{response: Response, status: number}>} Delete response.
   */
  async deleteBooking(bookingId) {
    const token = await this.getAuthToken();
    logger.info(`Deleting booking ID: ${bookingId}`);
    expect(bookingId, 'Booking ID should be provided for delete').to.not.be.undefined;
    
    const response = await fetch(`${this.baseUrl}/booking/${bookingId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Basic ${token}`
      }
    });

    expect([200, 201, 204], 'Delete should return success status').to.include(response.status);
    return {
      response,
      status: response.status
    };
  }

  /**
   * Validates that a booking object contains all required fields.
   * @param {Object} booking - Booking object to validate.
   * @param {string} booking.firstname - First name.
   * @param {string} booking.lastname - Last name.
   * @param {number} booking.totalprice - Total price.
   * @param {boolean} booking.depositpaid - Deposit paid flag.
   * @param {Object} booking.bookingdates - Booking dates.
   * @param {string} booking.bookingdates.checkin - Check-in date.
   * @param {string} booking.bookingdates.checkout - Check-out date.
   * @returns {Promise<{isValid: boolean, missingFields: Array, data: Object}>} Validation result.
   */
  async validateBookingResponse(booking) {
    logger.info('Validating booking response');
    expect(booking, 'Booking object should not be null').to.not.be.null;
    expect(booking.firstname, 'First name should exist').to.not.be.undefined;
    expect(booking.lastname, 'Last name should exist').to.not.be.undefined;
    expect(booking.totalprice, 'Total price should exist').to.not.be.undefined;
    const validation = APIRequestHelper.validateBookingResponse(booking);
    expect(validation.isValid, 'Booking should be valid').to.be.true;
    return validation;
  }
}
