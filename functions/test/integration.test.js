const admin = require('firebase-admin');
const sinon = require('sinon');
const chai = require('chai');
const fft = require('firebase-functions-test');

const test = fft();
const expect = chai.expect;

describe('Cloud Functions Integration Tests', () => {
    let myFunctions;
    let collectionStub;

    before(() => {
        // Mock Firestore
        const firestoreMock = {
            collection: sinon.stub()
        };
        sinon.stub(admin, 'firestore').get(() => () => firestoreMock);

        // Mock Messaging
        const messagingMock = {
            sendEachForMulticast: sinon.stub().resolves({ successCount: 1, failureCount: 0, responses: [] })
        };
        sinon.stub(admin, 'messaging').get(() => () => messagingMock);
        
        if (admin.apps.length === 0) {
            sinon.stub(admin, 'initializeApp');
        }

        // Import the compiled functions
        // Must ensure we require the CJS build from lib/
        myFunctions = require('../lib/index.js');
        
        collectionStub = firestoreMock.collection;
    });

    after(() => {
        test.cleanup();
        sinon.restore();
    });

    it('should be able to import functions', () => {
        expect(myFunctions).to.exist;
        expect(myFunctions.onNewOrderCreated).to.exist;
    });

    it('should send notifications to admins when a new order is created', async () => {
        const orderId = 'order_123';
        const orderData = {
            shippingAddress: { name: 'Juan Perez' },
            orderAmount: 5000
        };
        
        // Mock Firestore Responses
        const adminsSnapshot = {
            docs: [{ id: 'admin_uid_1' }, { id: 'admin_uid_2' }]
        };
        const adminsQuery = { get: sinon.stub().resolves(adminsSnapshot) };
        
        const tokensSnapshot = {
            empty: false,
            forEach: (cb) => {
                cb({ id: 'token_abc' });
            }
        };
        const tokensQuery = { get: sinon.stub().resolves(tokensSnapshot) };
        const tokensCollection = { collection: sinon.stub().returns(tokensQuery) };
        const fcmDoc = { doc: sinon.stub().returns(tokensCollection) };
        
        collectionStub.withArgs('admins').returns(adminsQuery);
        collectionStub.withArgs('fcmTokens').returns(fcmDoc);

        const wrapped = test.wrap(myFunctions.onNewOrderCreated);
        
        // Create mock snapshot
        const snapshot = test.firestore.makeDocumentSnapshot(orderData, `orders/${orderId}`);
        
        await wrapped({
            data: snapshot,
            params: { orderId }
        });

        const messaging = admin.messaging();
        const sendMethod = messaging.sendEachForMulticast;
        
        expect(sendMethod.calledOnce).to.be.true;
        const callArgs = sendMethod.firstCall.args[0];
        expect(callArgs.notification.title).to.include('¡Nueva Orden Recibida!');
    });
});
