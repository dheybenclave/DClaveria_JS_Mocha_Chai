import { expect } from 'chai';
import BookingAPIBase from '../../../src/pages/api/restful-booker/booking.api.js';
import { DataManager } from '../../../src/utils/data.manager.js';
import { APIRequestHelper } from '../../../src/utils/api.helpers.js';
import { logger } from '../../../src/utils/logger.js';

describe('[api][restful-booker] Restful Booker API Automation', () => {
  let bookingAPI;
  let createdBookingId;

  before(() => {
    bookingAPI = new BookingAPIBase();
    logger.step('API test suite initialized');
  });

  afterEach(async () => {
    if (createdBookingId) {
      try {
        logger.step(`Cleaning up booking ID: ${createdBookingId}`);
        await bookingAPI.deleteBooking(createdBookingId);
        logger.pass(`Cleanup completed for booking ${createdBookingId}`);
      } catch (error) {
        logger.fail(`Cleanup failed for booking ${createdBookingId}: ${error.message}`);
      }
      createdBookingId = null;
    }
  });

  describe('[api][positive][create] CreateBooking API - Positive Tests', () => {
    it('[api][positive][create] @tc_16 should create a new booking with valid data', async () => {
      logger.step('TC_16: Creating new booking with valid data');
      const validBooking = DataManager.getApiData('booking_test_data.json').valid_bookings[0];

      const result = await bookingAPI.createBooking(validBooking);

      expect(result.status).to.equal(200);
      expect(result.json).to.have.property('bookingid');
      expect(result.json).to.have.property('booking');
      expect(result.json.booking.firstname).to.equal(validBooking.firstname);
      expect(result.json.booking.lastname).to.equal(validBooking.lastname);
      expect(result.json.booking.totalprice).to.equal(validBooking.totalprice);
      expect(result.json.booking.depositpaid).to.equal(validBooking.depositpaid);

      createdBookingId = result.json.bookingid;
      logger.pass(`TC_16: Booking created successfully with ID: ${createdBookingId}`);
    });
  });
});
