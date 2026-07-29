import { expect } from 'chai';
import BookingAPIBase from '../../../src/pages/api/restful-booker/booking.api.js';
import { DataManager } from '../../../src/utils/data.manager.js';
import { logger } from '../../../src/utils/logger.js';

describe('@api @api_e2e_1 Restful Booker API Automation', () => {
  let bookingAPI;
  let createdBookingId;

  before(() => {
    bookingAPI = new BookingAPIBase();
    logger.info('API test suite initialized');
  });

  afterEach(async () => {
    if (createdBookingId) {
      try {
        logger.info(`Cleaning up booking ID: ${createdBookingId}`);
        await bookingAPI.deleteBooking(createdBookingId);
        logger.info(`Cleanup completed for booking ${createdBookingId}`);
      } catch (error) {
        logger.error(`Cleanup failed for booking ${createdBookingId}: ${error.message}`);
      }
      createdBookingId = null;
    }
  });

  describe('@api CreateBooking API - Positive Tests', () => {
    it('@api @api_tc_1 should create a new booking with valid data', async () => {
      logger.info('TC_API_1: Creating new booking with valid data');
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
      logger.info(`TC_API_1: Booking created successfully with ID: ${createdBookingId}`);
    });
  });
});
