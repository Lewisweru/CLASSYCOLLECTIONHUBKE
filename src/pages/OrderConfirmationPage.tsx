// src/pages/OrderConfirmationPage.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, Link, useLocation } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import apiClient from '../lib/apiClient';

type OrderStatus = 'PAID' | 'FAILED' | 'PAYMENT_FAILED' | 'PENDING' | null;

const MAX_POLLS = 10;
const POLL_INTERVAL = 3000;

export default function OrderConfirmationPage() {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    
    // Get order references
    const merchantReference = searchParams.get('OrderMerchantReference');
    // trackingId is available but currently unused
    // const trackingId = searchParams.get('OrderTrackingId');
    const preConfirmedStatus = location.state?.status === 'PAID' ? 'PAID' : null;

    // State management
    const [orderStatus, setOrderStatus] = useState<OrderStatus>(preConfirmedStatus);
    const [isLoading, setIsLoading] = useState(!preConfirmedStatus);
    const [error, setError] = useState<string | null>(null);
    const [pollCount, setPollCount] = useState(0);

    const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const pollOrderStatus = useCallback(async () => {
        if (!merchantReference) return;

        setPollCount(prev => prev + 1);
        console.log(`Polling attempt ${pollCount + 1} for ${merchantReference}`);

        try {
            const response = await apiClient.get<{ status: string }>(
                `/orders/status/${merchantReference}`
            );
            const newStatus = response.data.status?.toUpperCase() as OrderStatus;
            console.log('Poll response status:', newStatus);

            if (newStatus && newStatus !== orderStatus) {
                setOrderStatus(newStatus);
            }

            // Stop polling if final status reached
            if (newStatus === 'PAID' || newStatus === 'FAILED' || newStatus === 'PAYMENT_FAILED') {
                setIsLoading(false);
                if (intervalRef.current) clearInterval(intervalRef.current);
            }

        } catch (err: any) {
            console.error(`Polling error for ${merchantReference}:`, err);
            
            if (err.response?.status === 404) {
                setError(`Order reference ${merchantReference} not found.`);
                setIsLoading(false);
                if (intervalRef.current) clearInterval(intervalRef.current);
            }
        }
    }, [merchantReference, orderStatus, pollCount]);

    useEffect(() => {
        // Start polling if needed
        if (!preConfirmedStatus && 
            merchantReference && 
            orderStatus !== 'PAID' && 
            orderStatus !== 'FAILED' && 
            orderStatus !== 'PAYMENT_FAILED' && 
            pollCount < MAX_POLLS
        ) {
            setIsLoading(true);
            
            if (!intervalRef.current) {
                // Initial poll
                pollOrderStatus();
                // Set interval for subsequent polls
                intervalRef.current = setInterval(pollOrderStatus, POLL_INTERVAL);
            }
        } else if (pollCount >= MAX_POLLS && 
                 orderStatus !== 'PAID' && 
                 orderStatus !== 'FAILED' && 
                 orderStatus !== 'PAYMENT_FAILED'
        ) {
            setError("Payment status confirmation timed out. Please check your email or contact support.");
            setIsLoading(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [merchantReference, orderStatus, pollCount, preConfirmedStatus, pollOrderStatus]);

    const renderContent = () => {
        if (!preConfirmedStatus && !merchantReference) {
            return (
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 mx-auto text-orange-500 mb-4"/>
                    <h2 className="text-xl font-semibold text-orange-700">Order Information Missing</h2>
                    <p className="text-gray-600 mt-2">Could not retrieve order details from the URL.</p>
                    <Link 
                        to="/" 
                        className="mt-4 inline-block text-teal-600 hover:underline"
                    >
                        Go to Homepage
                    </Link>
                </div>
            );
        }

        if (isLoading) {
            return (
                <div className="text-center">
                    <Loader2 className="h-12 w-12 mx-auto text-teal-600 animate-spin mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700">Processing Payment...</h2>
                    <p className="text-gray-500 mt-2">Please wait while we confirm your payment status.</p>
                    {pollCount > 0 && (
                        <p className="text-xs text-gray-400 mt-1">
                            (Checking status... Attempt {pollCount}/{MAX_POLLS})
                        </p>
                    )}
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center">
                    <AlertCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">Verification Error</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <div className="flex justify-center space-x-4">
                        <Link 
                            to="/cart" 
                            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                        >
                            Back to Cart
                        </Link>
                        <Link 
                            to="/" 
                            className="text-teal-600 hover:underline py-2"
                        >
                            Go to Homepage
                        </Link>
                    </div>
                </div>
            );
        }

        switch (orderStatus) {
            case 'PAID':
                return (
                    <div className="text-center">
                        <CheckCircle className="h-20 w-20 mx-auto text-green-500 mb-6" />
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You For Your Order!</h1>
                        <p className="text-gray-600 mb-8">
                            Your payment was successful and your order (Ref: {merchantReference}) has been placed. 
                            You will receive an email confirmation shortly.
                        </p>
                        <Link 
                            to="/" 
                            className="bg-teal-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                );
            
            case 'FAILED':
            case 'PAYMENT_FAILED':
                return (
                    <div className="text-center">
                        <XCircle className="h-20 w-20 mx-auto text-red-500 mb-6" />
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Failed</h1>
                        <p className="text-gray-600 mb-8">
                            Unfortunately, we could not process your payment for order {merchantReference}. 
                            Please try again or use a different payment method.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Link 
                                to="/cart" 
                                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                            >
                                Back to Cart
                            </Link>
                            <Link 
                                to="/" 
                                className="bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                );
            
            default: // PENDING or other statuses
                return (
                    <div className="text-center">
                        <RefreshCw className="h-16 w-16 mx-auto text-gray-500 animate-spin mb-4" />
                        <h2 className="text-xl font-semibold text-gray-700">Payment Status Pending</h2>
                        <p className="text-gray-500 mt-2 mb-6">
                            We are still awaiting final confirmation for order {merchantReference}. 
                            This can sometimes take a few moments.
                            <br/>
                            Please check your email shortly, or contact support if you don't receive a confirmation.
                        </p>
                        <Link 
                            to="/" 
                            className="text-teal-600 hover:underline py-2"
                        >
                            Go to Homepage
                        </Link>
                    </div>
                );
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center flex flex-col items-center justify-center min-h-[70vh]">
            {renderContent()}
        </div>
    );
}