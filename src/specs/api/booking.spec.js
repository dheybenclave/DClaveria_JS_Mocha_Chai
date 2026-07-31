import { expect } from 'chai';
import BookingAPIBase from '../../pageobjects/booking.api.js';
import { DataManager } from '../../utils/data.manager.js';
import { logger } from '../../utils/logger.js';

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

  describe('CreateBooking API - Positive Tests', () => {
    it('@api_tc_1 should create a new booking with valid data', async () => {
      logger.info('TC_API_1: Creating new booking with valid data');
      const validBooking = DataManager.getApiData('booking_test_data.json').valid_bookings[0];

      const result = await bookingAPI.createBooking(validBooking);

      logger.info('Asserting create booking status is 200');
      bookingAPI.validateStatusResponse(result.status, 200);

      logger.info('Asserting booking creation response structure and payload');
      bookingAPI.validateBookingCreation(result, validBooking)

      createdBookingId = result.json.bookingid;
      logger.info(`TC_API_1: Booking created successfully with ID: ${createdBookingId}`);

    });
  });

  describe('CreateBooking API - Negative Tests', () => {
    it('@api_tc_2 should not persist invalid totalprice string value', async () => {
      logger.info('TC_API_2: Creating booking with invalid totalprice type');

      const invalidBooking = DataManager.getApiData('booking_test_data.json').invalid_bookings[2];
      const result = await bookingAPI.createBooking(invalidBooking);

      bookingAPI.validateStatusResponse(result.status, 200);
      expect(result.json, 'Response should contain booking object').to.have.property('bookingid');
      expect(result.json.booking.totalprice, 'totalprice should not be stored as invalid string').to.not.equal('not_a_number');
      logger.info('TC_API_2: Negative test completed - invalid totalprice was not persisted');
    });
  });

  describe('GetBooking API - Positive Tests', () => {
    it('@api_tc_3 should retrieve an existing booking by ID', async () => {
      logger.info('TC_API_3: Creating booking before retrieval');

      const validBooking = DataManager.getApiData('booking_test_data.json').valid_bookings[1];
      const createResult = await bookingAPI.createBooking(validBooking);
      createdBookingId = createResult.json.bookingid;

      logger.info(`TC_API_3: Retrieving booking by ID: ${createdBookingId}`);
      const result = await bookingAPI.getBookingById(createdBookingId);

      bookingAPI.validateGetBookingResponse(result, validBooking);

      logger.info(`TC_API_3: Booking retrieved successfully for ID: ${createdBookingId}`);
    });

    it('@api_tc_4 should filter bookings by firstname and lastname', async () => {
      logger.info('TC_API_4: Creating booking before filter search');

      const validBooking = DataManager.getApiData('booking_test_data.json').valid_bookings[0];
      const createResult = await bookingAPI.createBooking(validBooking);
      createdBookingId = createResult.json.bookingid;

      const filterData = DataManager.getApiData('booking_test_data.json').filter_data;
      logger.info(`TC_API_4: Filtering bookings by firstname: ${filterData.firstname}, lastname: ${filterData.lastname}`);
      const result = await bookingAPI.getBookingsByFilter(filterData);

      bookingAPI.validateFilterResponse(result, createdBookingId);

      logger.info(`TC_API_4: Filter returned ${result.json.length} matching booking(s)`);
    });
  });

  describe('GetBooking API - Negative Tests', () => {
    it('@api_tc_5 should return 404 for non-existent booking ID', async () => {
      logger.info('TC_API_5: Attempting to retrieve non-existent booking');
      const nonExistentId = 999999999;

      await bookingAPI.validateErrorThrown(async () => bookingAPI.getBookingById(nonExistentId));

      logger.info('TC_API_5: Negative test completed successfully');
    });
  });

  describe('UpdateBooking API - Positive Tests', () => {
    it('@api_tc_6 should fully update an existing booking with PUT', async () => {
      logger.info('TC_API_6: Creating booking before full update');
      const validBooking = DataManager.getApiData('booking_test_data.json').valid_bookings[0];
      const createResult = await bookingAPI.createBooking(validBooking);
      createdBookingId = createResult.json.bookingid;

      const updateData = DataManager.getApiData('booking_test_data.json').update_data[0];
      logger.info(`TC_API_6: Fully updating booking ID: ${createdBookingId}`);
      const result = await bookingAPI.updateBooking(createdBookingId, updateData, false);

      bookingAPI.validateUpdateResponse(result, updateData);

      logger.info(`TC_API_6: Booking fully updated successfully for ID: ${createdBookingId}`);
    });

    it('@api_tc_7 should partially update an existing booking with PATCH', async () => {
      logger.info('TC_API_7: Creating booking before partial update');
      const validBooking = DataManager.getApiData('booking_test_data.json').valid_bookings[1];
      const createResult = await bookingAPI.createBooking(validBooking);
      createdBookingId = createResult.json.bookingid;

      const updateData = DataManager.getApiData('booking_test_data.json').update_data[0];
      logger.info(`TC_API_7: Partially updating booking ID: ${createdBookingId}`);
      const result = await bookingAPI.partialUpdateBooking(createdBookingId, updateData);

      bookingAPI.validateUpdateResponse(result, updateData);

      logger.info(`TC_API_7: Booking partially updated successfully for ID: ${createdBookingId}`);
    });
  });

  describe('UpdateBooking API - Negative Tests', () => {
    it('@api_tc_8 should fail to update non-existent booking', async () => {
      logger.info('TC_API_8: Attempting to update non-existent booking');
      const nonExistentId = 999999999;
      const updateData = DataManager.getApiData('booking_test_data.json').update_data[0];

      await bookingAPI.validateErrorThrown(async () => bookingAPI.updateBooking(nonExistentId, updateData, false));

      logger.info('TC_API_8: Negative test completed successfully');
    });
  });

  describe('DeleteBooking API - Positive Tests', () => {
    it('@api_tc_9 should delete an existing booking', async () => {
      logger.info('TC_API_9: Creating booking before deletion');
      const validBooking = DataManager.getApiData('booking_test_data.json').valid_bookings[0];
      const createResult = await bookingAPI.createBooking(validBooking);
      const bookingIdToDelete = createResult.json.bookingid;

      logger.info(`TC_API_9: Deleting booking ID: ${bookingIdToDelete}`);
      const result = await bookingAPI.deleteBooking(bookingIdToDelete);

      bookingAPI.validateDeleteResponse(result);
      logger.info(`TC_API_9: Booking deleted successfully with status: ${result.status}`);

      createdBookingId = null;
    });
  });

  describe('DeleteBooking API - Negative Tests', () => {
    it('@api_tc_10 should handle delete of non-existent booking', async () => {
      logger.info('TC_API_10: Attempting to delete non-existent booking');
      const nonExistentId = 999999999;

      await bookingAPI.validateErrorThrown(async () => bookingAPI.deleteBooking(nonExistentId));

      logger.info('TC_API_10: Negative test completed successfully');
    });
  });
});
