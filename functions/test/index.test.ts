// @ts-nocheck
import * as admin from 'firebase-admin';
import * as sinon from 'sinon';
import * as chai from 'chai';
import * as fft from 'firebase-functions-test';

const test = fft();
const expect = chai.expect;

describe('Cloud Functions Unit Tests', () => {
    let myFunctions: any;
    let collectionStub: sinon.SinonStub;

    before(() => {
        // Mock Firestore
        const firestoreMock: any = {
            collection: sinon.stub()
        };
        sinon.stub(admin, 'firestore').get(() => () => firestoreMock);

        // Mock Messaging
        const messagingMock: any = {
            sendEachForMulticast: sinon.stub().resolves({ successCount: 1, failureCount: 0, responses: [] })
        };
        sinon.stub(admin, 'messaging').get(() => () => messagingMock);

        if (admin.apps.length === 0) {
            sinon.stub(admin, 'initializeApp');
        }

        // Import the functions 
        myFunctions = require('../src/index');

        collectionStub = firestoreMock.collection;
    });

    after(() => {
        test.cleanup();
        sinon.restore();
    });

    describe('onNewOrderCreated', () => {
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
                forEach: (cb: (doc: any) => void) => {
                    cb({ id: 'token_abc' });
                }
            };
            const tokensQuery = { get: sinon.stub().resolves(tokensSnapshot) };
            const tokensCollection = { collection: sinon.stub().returns(tokensQuery) };
            const fcmDoc = { doc: sinon.stub().returns(tokensCollection) };

            collectionStub.withArgs('admins').returns(adminsQuery);
            collectionStub.withArgs('fcmTokens').returns(fcmDoc);

            const wrapped = test.wrap(myFunctions.onNewOrderCreated);

            const snapshot = (test.firestore as any).makeDocumentSnapshot(orderData, `orders/${orderId}`);

            await wrapped({
                data: snapshot,
                params: { orderId }
            } as any);

            const messaging = admin.messaging() as any;
            const sendMethod = messaging.sendEachForMulticast as sinon.SinonStub;

            expect(sendMethod.calledOnce).to.be.true;
            const callArgs = sendMethod.firstCall.args[0];
            expect(callArgs.notification.title).to.include('¡Nueva Orden Recibida!');
            expect(callArgs.tokens).to.include('token_abc');
        });

        it('should not send notification if no admins found', async () => {
            const orderId = 'order_456';
            const orderData = {
                shippingAddress: { name: 'Maria' },
                orderAmount: 2000
            };

            const adminsSnapshot = {
                docs: []
            };
            const adminsQuery = { get: sinon.stub().resolves(adminsSnapshot) };
            collectionStub.withArgs('admins').returns(adminsQuery);

            const wrapped = test.wrap(myFunctions.onNewOrderCreated);
            const snapshot = (test.firestore as any).makeDocumentSnapshot(orderData, `orders/${orderId}`);

            await wrapped({
                data: snapshot,
                params: { orderId }
            } as any);
        });
    });
});
