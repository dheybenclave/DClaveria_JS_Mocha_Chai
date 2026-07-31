import { expect } from 'chai';
import { APIRequestHelper } from '../utils/api.helpers.js';
import { CONFIG } from '../utils/config.js';
import { logger } from '../utils/logger.js';

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
   * Retrieves a cached auth token or generates a new Basic auth token from credentials.
   * @returns {Promise<string>} Base64-encoded Basic auth token.
   */
  async getAuthToken() {
    if (!this.authToken) {
      logger.info('Generating auth token from credentials');
      this.authToken = APIRequestHelper.createAuthToken(CONFIG.API_USERNAME, CONFIG.API_PASSWORD);
      logger.info('Asserting auth token is not empty');
      expect(this.authToken, 'Auth token should not be empty').to.not.be.empty;
      logger.info('Auth token generated successfully');
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
    logger.info('Asserting booking payload is not empty');
    expect(payload, 'Booking payload should not be empty').to.not.be.empty;

    const response = await fetch(`${this.baseUrl}/booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    logger.info(`Asserting create booking status is 200, actual: ${response.status}`);
    expect(response.status, 'Create booking should return 200').to.equal(200);
    const responseJson = await response.json();
    logger.info('Asserting booking ID is returned in response');
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
    logger.info('Asserting booking ID is provided');
    expect(bookingId, 'Booking ID should be provided').to.not.be.undefined;

    const response = await fetch(`${this.baseUrl}/booking/${bookingId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    logger.info(`Asserting get booking status is 200, actual: ${response.status}`);
    expect(response.status, 'Get booking should return 200').to.equal(200);
    const responseJson = await response.json();
    logger.info('Asserting response contains booking data');
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

    logger.info(`Asserting filter search status is 200, actual: ${response.status}`);
    expect(response.status, 'Filter search should return 200').to.equal(200);
    const responseJson = await response.json();
    logger.info('Asserting filter response is an array');
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
    logger.info('Asserting booking ID is provided for update');
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

    logger.info(`Asserting update booking status is 200, actual: ${response.status}`);
    expect(response.status, 'Update booking should return 200').to.equal(200);
    const responseJson = await response.json();
    logger.info('Asserting update response is not empty');
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
    logger.info('Asserting booking ID is provided for partial update');
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

    logger.info(`Asserting partial update status is 200, actual: ${response.status}`);
    expect(response.status, 'Partial update should return 200').to.equal(200);
    const responseJson = await response.json();
    logger.info('Asserting patch response is not empty');
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
    logger.info('Asserting booking ID is provided for delete');
    expect(bookingId, 'Booking ID should be provided for delete').to.not.be.undefined;

    const response = await fetch(`${this.baseUrl}/booking/${bookingId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Basic ${token}`
      }
    });

    logger.info(`Asserting delete status is success (200/201/204), actual: ${response.status}`);
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
    logger.info('Asserting booking object is not null');
    expect(booking, 'Booking object should not be null').to.not.be.null;
    logger.info('Asserting first name exists');
    expect(booking.firstname, 'First name should exist').to.not.be.undefined;
    logger.info('Asserting last name exists');
    expect(booking.lastname, 'Last name should exist').to.not.be.undefined;
    logger.info('Asserting total price exists');
    expect(booking.totalprice, 'Total price should exist').to.not.be.undefined;
    const validation = APIRequestHelper.validateBookingResponse(booking);
    logger.info('Asserting booking validation is true');
    expect(validation.isValid, 'Booking should be valid').to.be.true;
    return validation;
  }

  async validateStatusResponse(responseStatus, expectedStatus) {

    logger.info(`Asserting booking response status - Actual: ${responseStatus} | Expected: ${expectedStatus}`);
    expect(responseStatus, 'Create booking should return HTTP 200').to.equal(expectedStatus);
  }

  /**
 * Validates the API response structure and data payload for a created booking.
 * @param {Object} response - The API response object (contains status and json).
 * @param {Object} expectedData - The expected payload used to create the booking.
 */
  async validateBookingCreation(response, expectedData) {
    logger.info('Validating booking creation response and payload structures.');

    logger.info(`Asserting response JSON contains required parameters [Booking ID, Booking Details]`);
    expect(response.json, 'Response should contain booking object').to.have.property('bookingid');
    expect(response.json, 'Response should contain booking details').to.have.property('booking');

    const actualBooking = response.json.booking;

    logger.info('Asserting first name matches expected value');
    expect(actualBooking.firstname, 'First name should match').to.equal(expectedData.firstname);
    logger.info('Asserting last name matches expected value');
    expect(actualBooking.lastname, 'Last name should match').to.equal(expectedData.lastname);
    logger.info('Asserting total price matches expected value');
    expect(actualBooking.totalprice, 'Total price should match').to.equal(expectedData.totalprice);
    logger.info('Asserting deposit paid matches expected value');
    expect(actualBooking.depositpaid, 'Deposit paid should match').to.equal(expectedData.depositpaid);

    return response.json.bookingid;
  }

  async validateGetBookingResponse(result, expectedData) {
    logger.info('Validating get booking response structure and data.');

    logger.info('Asserting get booking status is 200');
    expect(result.status, 'Get booking should return HTTP 200').to.equal(200);

    logger.info('Asserting first name matches');
    expect(result.json.firstname, 'First name should match').to.equal(expectedData.firstname);
    logger.info('Asserting last name matches');
    expect(result.json.lastname, 'Last name should match').to.equal(expectedData.lastname);
    logger.info('Asserting total price matches');
    expect(result.json.totalprice, 'Total price should match').to.equal(expectedData.totalprice);
    logger.info('Asserting deposit paid matches');
    expect(result.json.depositpaid, 'Deposit paid should match').to.equal(expectedData.depositpaid);
    logger.info('Asserting response contains booking dates');
    expect(result.json, 'Response should contain booking dates').to.have.property('bookingdates');
    logger.info('Asserting check-in date matches');
    expect(result.json.bookingdates.checkin, 'Check-in date should match').to.equal(expectedData.bookingdates.checkin);
    logger.info('Asserting check-out date matches');
    expect(result.json.bookingdates.checkout, 'Check-out date should match').to.equal(expectedData.bookingdates.checkout);
  }

  async validateFilterResponse(result, createdBookingId) {
    logger.info('Validating filter search response.');

    logger.info('Asserting filter search status is 200');
    expect(result.status, 'Filter search should return HTTP 200').to.equal(200);
    logger.info('Asserting filter response is an array');
    expect(Array.isArray(result.json), 'Response should be an array').to.be.true;
    logger.info('Asserting filter returned at least one booking');
    expect(result.json, 'Filter should return at least one booking').to.have.length.greaterThan(0);
    const matchingBookingIds = result.json.map(booking => booking.bookingid);
    logger.info('Asserting created booking is in filtered results');
    expect(matchingBookingIds, 'Created booking should be in filtered results').to.include(createdBookingId);
  }

  async validateUpdateResponse(result, expectedData) {
    logger.info('Validating update response structure and data.');

    logger.info('Asserting update booking status is 200');
    expect(result.status, 'Update booking should return HTTP 200').to.equal(200);
    logger.info('Asserting update response is not empty');
    expect(result.json, 'Update response should not be empty').to.not.be.empty;
    logger.info('Asserting first name matches updated value');
    expect(result.json.firstname, 'First name should match updated value').to.equal(expectedData.firstname);
    logger.info('Asserting last name matches updated value');
    expect(result.json.lastname, 'Last name should match updated value').to.equal(expectedData.lastname);
    logger.info('Asserting total price matches updated value');
    expect(result.json.totalprice, 'Total price should match updated value').to.equal(expectedData.totalprice);
    logger.info('Asserting response contains booking dates');
    expect(result.json, 'Response should contain booking dates').to.have.property('bookingdates');
  }

  async validateDeleteResponse(result) {
    logger.info('Validating delete response status.');
    logger.info(`Asserting delete status is success (200/201/204), actual: ${result.status}`);
    expect([200, 201, 204], 'Delete should return success status').to.include(result.status);
  }

  async validateErrorThrown(action) {
    logger.info('Asserting action throws an error');
    let errorCaught = false;
    try {
      await action();
    } catch (error) {
      errorCaught = true;
      logger.info(`Expected error caught: ${error.message}`);
    }
    expect(errorCaught, 'Action should throw an error').to.be.true;
    return errorCaught;
  }
}
