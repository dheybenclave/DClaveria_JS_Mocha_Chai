export class APIRequestHelper {
  static createAuthToken(username, password) {
    const auth = Buffer.from(`${username}:${password}`).toString('base64');
    return auth;
  }

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

  static getBookingDatesPayload(overrides = {}) {
    const defaults = {
      checkin: '2025-09-01',
      checkout: '2025-09-10'
    };

    return { ...defaults, ...overrides };
  }

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
