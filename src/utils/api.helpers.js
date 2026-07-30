/**
 * Helper class for generating common API request payloads and validating responses.
 */
export class APIRequestHelper {
  /**
   * Creates a Basic Authorization header value from username and password.
   * @param {string} username - API username.
   * @param {string} password - API password.
   * @returns {string} Base64-encoded Basic auth token.
   */
  static createAuthToken(username, password) {
    const auth = Buffer.from(`${username}:${password}`).toString('base64');
    return auth;
  }

  /**
   * Builds common headers for JSON API requests.
   * @param {string|null} [authToken=null] - Optional Basic auth token.
   * @returns {Object} Headers object.
   */
  static getCommonHeaders(authToken = null) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    if (authToken) {
      headers['Authorization'] = `Basic ${authToken}`;
    }

    return headers;
  }

  /**
   * Builds a booking payload, merging overrides into sensible defaults.
   * @param {Object} [overrides={}] - Fields to override in the default booking payload.
   * @returns {Object} Booking payload object.
   */
  static getBookingPayload(overrides = {}) {
    const defaults = {
      firstname: 'John',
      lastname: 'Doe',
      totalprice: 150,
      depositpaid: true,
      bookingdates: {
        checkin: '2025-09-01',
        checkout: '2025-09-10'
      },
      additionalneeds: 'Breakfast'
    };

    return { ...defaults, ...overrides };
  }

  /**
   * Builds a booking dates payload, merging overrides into sensible defaults.
   * @param {Object} [overrides={}] - Date fields to override.
   * @returns {Object} Booking dates payload object.
   */
  static getBookingDatesPayload(overrides = {}) {
    const defaults = {
      checkin: '2025-09-01',
      checkout: '2025-09-10'
    };

    return { ...defaults, ...overrides };
  }

  /**
   * Validates that a booking object contains all required fields and nested date fields.
   * @param {Object} booking - Booking object to validate.
   * @returns {{isValid: boolean, missingFields: string[], data: Object}} Validation result.
   */
  static validateBookingResponse(booking) {
    const requiredFields = ['firstname', 'lastname', 'totalprice', 'depositpaid', 'bookingdates', 'bookingid'];
    const dateFields = ['checkin', 'checkout'];
    const missingFields = [];

    for (const field of requiredFields) {
      if (!(field in booking)) {
        missingFields.push(field);
      }
    }

    if (booking.bookingdates) {
      for (const dateField of dateFields) {
        if (!(dateField in booking.bookingdates)) {
          missingFields.push(`bookingdates.${dateField}`);
        }
      }
    }

    return {
      isValid: missingFields.length === 0,
      missingFields,
      data: booking
    };
  }
}
