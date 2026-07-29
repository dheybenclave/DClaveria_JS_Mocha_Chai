import { CONFIG } from '../../../utils/config.js';
import { APIRequestHelper } from '../../../utils/api.helpers.js';
import { logger } from '../../../utils/logger.js';
import { expect } from 'chai';

export default class BookingAPIBase {
  constructor() {
    this.baseUrl = CONFIG.API_BASE_URL;
    this.authToken = null;
  }

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

  async updateBooking(bookingId, bookingData, partial = false) {
    const token = await this.getAuthToken();
    logger.info(`Updating booking ID: ${bookingId}`);
    const payload = APIRequestHelper.getBookingPayload(bookingData);
    logger.debug(`Update payload: ${JSON.stringify(payload)}`);
    expect(bookingId, 'Booking ID should be provided for update').to.not.be.undefined;
    
    const response = await fetch(`${this.baseUrl}/booking/${bookingId}`, {
      method: 'PUT',
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
