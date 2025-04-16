// src/pages/OrderConfirmationPage.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, Link, useLocation } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import apiClient from '../lib/apiClient';

type OrderStatus = 'PAID' | 'FAILED' | 'PAYMENT_FAILED' | 'PENDING' | 'UNKNOWN_STATUS' | 'IPN_PROCESSING_ERROR' | 'CONFIG_ERROR' | null; // Added more potential statuses

const MAX_POLLS = 10;
const POLL_INTERVAL = 3000; // 3 seconds

export default function OrderConfirmationPage() {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const merchantReference = searchParams.get('OrderMerchantReference');
    const preConfirmedStatus = location.state?.status === 'PAID' ? 'PAID' : null;

    const [orderStatus, setOrderStatus] = useState<OrderStatus>(preConfirmedStatus);
    const [isLoading, setIsLoading] = useState(!preConfirmedStatus);
    const [error, setError] = useState<string | null>(null);
    const [pollCount, setPollCount] = useState(0);

    const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isMountedRef = useRef(true); // Track mount status

    // Set mount status
    useEffect(() => {
        isMountedRef.current = true;
        return () => { isMountedRef.current = false; };
    }, []);

    // --- Polling Function ---
    const pollOrderStatus = useCallback(async () => {
        if (!merchantReference || !isMountedRef.current) return;

        // --- FIX: Increment poll count *before* the API call ---
        const currentPollAttempt = pollCount + 1;
        setPollCount(currentPollAttempt);
        // --- End FIX ---

        console.log(`Polling attempt ${currentPollAttempt} for ${merchantReference}`);

        try {
            const response = await apiClient.get<{ status: string }>( `/api/orders/status/${merchantReference}` );
            const newStatus = response.data.status?.toUpperCase() as OrderStatus;
            console.log(`Poll response status: ${newStatus}`);

            if (!isMountedRef.current) return; // Check again after await

            if (newStatus && newStatus !== orderStatus) {
                setOrderStatus(newStatus); // Update status immediately
            }

            // --- FIX: Check for final status *after* setting state ---
            if (newStatus === 'PAID' || newStatus === 'FAILED' || newStatus === 'PAYMENT_FAILED') {
                console.log(`Final status ${newStatus} received. Stopping polling.`);
                setIsLoading(false);
                if (intervalRef.current) clearInterval(intervalRef.current);
            } else if (currentPollAttempt >= MAX_POLLS) {
                // --- FIX: Check max polls *after* the attempt ---
                console.log(`Max polls (${MAX_POLLS}) reached without final status.`);
                setError("Payment status confirmation timed out. Please check your email or contact support.");
                setIsLoading(false);
                if (intervalRef.current) clearInterval(intervalRef.current);
            }
            // --- End FIX ---

        } catch (err: any) {
            if (!isMountedRef.current) return;
            console.error(`Polling error for ${merchantReference}:`, err);
            const errorMsg = err.response?.status === 404
                ? `Order reference ${merchantReference} not found.`
                : err.response?.data?.message || `Failed to fetch order status.`;
            setError(errorMsg);
            setIsLoading(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
    // Include only stable dependencies or those that should trigger re-creation
    }, [merchantReference, orderStatus, pollCount]); // Keep dependencies, pollCount change triggers next poll check in useEffect


    // --- Effect to Start/Manage Polling ---
    useEffect(() => {
        // --- Conditions to Start/Continue Polling ---
        const shouldPoll = isMountedRef.current &&
                           !preConfirmedStatus &&
                           merchantReference &&
                           orderStatus !== 'PAID' &&
                           orderStatus !== 'FAILED' &&
                           orderStatus !== 'PAYMENT_FAILED' &&
                           pollCount < MAX_POLLS &&
                           !error;

        if (shouldPoll) {
            if (!isLoading) setIsLoading(true); // Ensure loading is true while polling might start/continue
            // Setup the timer if it's not already running
            if (!intervalRef.current) {
                 // Use setTimeout for the *next* poll, initial poll triggered below if count is 0
                if (pollCount > 0) {
                    intervalRef.current = setTimeout(pollOrderStatus, POLL_INTERVAL);
                }
            }
        } else {
             // Conditions not met (final status, max polls, error, unmounted, etc.)
             if (intervalRef.current) {
                 clearInterval(intervalRef.current); // Use clearInterval for timers set with setInterval/setTimeout
                 intervalRef.current = null;
             }
             // Ensure loading is false if polling stops for any reason
             if (isLoading) setIsLoading(false);
        }

        // --- Initial Poll Trigger ---
        // Trigger the very first poll if needed when the component mounts/merchantRef appears
        if (pollCount === 0 && shouldPoll && !isLoading && !intervalRef.current) {
             console.log("Triggering initial poll.");
             pollOrderStatus(); // Don't wait for interval for the first check
        }
        // --- End Initial Poll Trigger ---


        // Cleanup function to clear timer on unmount or when polling stops
        return () => {
            if (intervalRef.current) {
                clearTimeout(intervalRef.current); // Use clearTimeout
                intervalRef.current = null;
            }
        };
    // Adjust dependencies: pollOrderStatus is stable due to useCallback.
    // React to changes in conditions that START polling.
    }, [merchantReference, orderStatus, preConfirmedStatus, error, isLoading, pollCount, pollOrderStatus]);


    // --- Render Logic (Unchanged) ---
    const renderContent = () => { /* ... existing render logic ... */ if (!preConfirmedStatus && !merchantReference) { return ( <div className="text-center"> <AlertCircle className="h-12 w-12 mx-auto text-orange-500 mb-4"/> <h2 className="text-xl font-semibold text-orange-700">Order Information Missing</h2> <p className="text-gray-600 mt-2">Could not retrieve order details from the URL.</p> <Link to="/" className="mt-4 inline-block text-teal-600 hover:underline">Go to Homepage</Link> </div> ); } if (isLoading) { return ( <div className="text-center"> <Loader2 className="h-12 w-12 mx-auto text-teal-600 animate-spin mb-4" /> <h2 className="text-xl font-semibold text-gray-700">Processing Payment...</h2> <p className="text-gray-500 mt-2">Please wait while we confirm your payment status.</p> {pollCount > 0 && ( <p className="text-xs text-gray-400 mt-1">(Checking status... Attempt {pollCount}/{MAX_POLLS})</p> )} </div> ); } if (error) { return ( <div className="text-center"> <AlertCircle className="h-16 w-16 mx-auto text-red-500 mb-4" /> <h1 className="text-2xl font-bold text-gray-900 mb-3">Verification Error</h1> <p className="text-gray-600 mb-6">{error}</p> <div className="flex justify-center space-x-4"> <Link to="/cart" className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors">Back to Cart</Link> <Link to="/" className="text-teal-600 hover:underline py-2">Go to Homepage</Link> </div> </div> ); } switch (orderStatus) { case 'PAID': return ( <div className="text-center"> <CheckCircle className="h-20 w-20 mx-auto text-green-500 mb-6" /> <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You For Your Order!</h1> <p className="text-gray-600 mb-8">Your payment was successful and your order (Ref: {merchantReference}) has been placed. You will receive an email confirmation shortly.</p> <Link to="/" className="bg-teal-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">Continue Shopping</Link> </div> ); case 'FAILED': case 'PAYMENT_FAILED': return ( <div className="text-center"> <XCircle className="h-20 w-20 mx-auto text-red-500 mb-6" /> <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Failed</h1> <p className="text-gray-600 mb-8">Unfortunately, we could not process your payment for order {merchantReference}. Please try again or use a different payment method.</p> <div className="flex justify-center space-x-4"> <Link to="/cart" className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors">Back to Cart</Link> <Link to="/" className="bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">Continue Shopping</Link> </div> </div> ); default: return ( <div className="text-center"> <RefreshCw className="h-16 w-16 mx-auto text-gray-500 animate-spin mb-4" /> <h2 className="text-xl font-semibold text-gray-700">Payment Status Pending</h2> <p className="text-gray-500 mt-2 mb-6">We are still awaiting final confirmation for order {merchantReference}. This can sometimes take a few moments.<br/>Please check your email shortly, or contact support if you don't receive a confirmation.</p> <Link to="/" className="text-teal-600 hover:underline py-2">Go to Homepage</Link> </div> ); } };

    return ( <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center flex flex-col items-center justify-center min-h-[70vh]"> {renderContent()} </div> );
}