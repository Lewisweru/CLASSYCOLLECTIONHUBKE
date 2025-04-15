// src/pages/CartPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore, useCartTotal, useCartItemCount } from '../store/cartStore';
import { Minus, Plus, Trash2, ShoppingBag, Info, Loader2 } from 'lucide-react';
import { ShippingDetails, Product } from '../types'; // Assuming Product is needed for item display
import apiClient from '../lib/apiClient'; // Uses apiClient
import toast from 'react-hot-toast';

const deliveryOptions = [
  { id: 'standard', name: 'Standard Delivery', price: 29900, duration: '3-5 business days' },
  { id: 'express', name: 'Express Delivery', price: 59900, duration: '1-2 business days' },
];

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const total = useCartTotal();
  const itemCount = useCartItemCount();
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    fullName: '', email: '', phone: '', address: '', city: '', deliveryOption: 'standard'
  });
  const [formErrors, setFormErrors] = useState<Partial<ShippingDetails>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateForm = (): boolean => {
      const errors: Partial<ShippingDetails> = {};
      if (!shippingDetails.fullName.trim()) errors.fullName = 'Full Name is required';
      if (!shippingDetails.email.trim()) errors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(shippingDetails.email)) errors.email = 'Email is invalid';
      if (!shippingDetails.phone.trim()) errors.phone = 'Phone is required';
      if (!shippingDetails.address.trim()) errors.address = 'Address is required';
      if (!shippingDetails.city.trim()) errors.city = 'City is required';
      setFormErrors(errors);
      return Object.keys(errors).filter(key => errors[key as keyof ShippingDetails]).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setShippingDetails(prev => ({ ...prev, [name]: value }));
      if (formErrors[name as keyof ShippingDetails]) {
          setFormErrors(prev => ({ ...prev, [name]: undefined }));
      }
       setSubmitError(null);
  };

   const handleQuantityChange = (id: string, currentQuantity: number, change: number) => {
     const newQuantity = currentQuantity + change;
     if (newQuantity < 1) {
       if (window.confirm("Remove this item from your cart?")) {
         removeItem(id);
       }
     } else {
       updateQuantity(id, newQuantity);
     }
   };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
        toast.error("Please fix the errors in the shipping details.");
        return;
    }
    if (items.length === 0) {
        toast.error("Your cart is empty.");
        return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Placing your order...");

    const orderPayload = {
        shippingDetails: shippingDetails,
        items: items.map(item => ({ id: item.id, quantity: item.quantity }))
    };

    try {
        // *** Use full relative path starting with /api/ ***
        const response = await apiClient.post('/api/orders', orderPayload);
        // *** End Path Correction ***

        if (response.data && response.data.redirectUrl) {
            toast.success("Redirecting to payment gateway...", { id: toastId });
            clearCart();
            window.location.href = response.data.redirectUrl; // Redirect handled here
            // No need to setIsSubmitting(false) on success if redirecting
        } else {
            console.error("Invalid server response structure after order POST:", response.data);
            throw new Error(response.data?.message || "Failed to initiate payment (Invalid server response).");
        }
    } catch (err: any) {
        console.error("Order submission error:", err);
        // Error message priority: backend response -> generic message
        const errorMsg = err.response?.data?.message || err.message || 'Failed to place order. Please try again.';
        toast.error(errorMsg, { id: toastId });
        setSubmitError(errorMsg);
        setIsSubmitting(false); // Only stop loading on error
    }
    // No finally needed here due to redirect on success
  };

  const selectedDelivery = deliveryOptions.find(opt => opt.id === shippingDetails.deliveryOption);
  const deliveryPriceSmallestUnit = selectedDelivery?.price || 0;
  const grandTotalSmallestUnit = total + deliveryPriceSmallestUnit;

   const formatDisplayPrice = (priceInSmallestUnit: number) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency', currency: 'KES', minimumFractionDigits: 2, maximumFractionDigits: 2
        }).format(priceInSmallestUnit / 100);
    };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      {itemCount === 0 && !isSubmitting ? (
         <div className="text-center py-16 bg-white rounded-lg shadow">
            <ShoppingBag className="h-20 w-20 mx-auto text-gray-400 mb-4" />
           <p className="text-2xl font-semibold text-gray-600 mb-4">Your cart is empty</p>
           <Link to="/" className="bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
             Start Shopping
           </Link>
         </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-lg shadow p-6">
                 <h2 className="text-xl font-semibold mb-4 border-b pb-3">Your Items ({itemCount})</h2>
                  {items.map((item) => (
                      <div key={item.id} className="flex items-start sm:items-center py-5 border-b last:border-b-0 flex-col sm:flex-row">
                           {/* Added check for item.imageUrls and fallback */}
                           <img src={item.imageUrls?.[0] || 'https://via.placeholder.com/96x96/e2e8f0/94a3b8?text=N/A'} alt={item.name} className="w-24 h-24 object-cover rounded flex-shrink-0 mb-4 sm:mb-0 sm:mr-5 bg-gray-100" />
                          <div className="flex-1 mb-4 sm:mb-0">
                              <Link to={`/product/${item.id}`} className="text-lg font-medium text-gray-900 hover:text-teal-600">{item.name}</Link>
                              <p className="text-gray-500 text-sm">{item.subcategory}</p>
                              <p className="text-teal-600 font-semibold mt-1">{formatDisplayPrice(item.price)}</p>
                          </div>
                          <div className="flex items-center space-x-3 ml-auto">
                              <button type="button" onClick={() => handleQuantityChange(item.id, item.quantity, -1)} disabled={item.quantity <= 1} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Decrease quantity"><Minus className="h-4 w-4" /></button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <button type="button" onClick={() => handleQuantityChange(item.id, item.quantity, 1)} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600" aria-label="Increase quantity"><Plus className="h-4 w-4" /></button>
                              <button type="button" onClick={() => removeItem(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-full ml-2" aria-label="Remove item"><Trash2 className="h-5 w-5" /></button>
                          </div>
                      </div>
                  ))}
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  <div className="space-y-3">
                      <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatDisplayPrice(total)}</span></div>
                      <div className="flex justify-between text-gray-600"><span>Delivery ({selectedDelivery?.name})</span><span>{formatDisplayPrice(deliveryPriceSmallestUnit)}</span></div>
                      <div className="border-t pt-3 mt-3"><div className="flex justify-between font-semibold text-lg text-gray-900"><span>Total</span><span>{formatDisplayPrice(grandTotalSmallestUnit)}</span></div></div>
                  </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 lg:col-span-1 h-fit sticky top-20">
                <h2 className="text-xl font-semibold mb-5">Shipping Details</h2>
                <div className="space-y-4">
                     <div><label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label><input id="fullName" type="text" name="fullName" required value={shippingDetails.fullName} onChange={handleInputChange} className={`form-input ${formErrors.fullName ? 'border-red-500' : ''}`}/>{formErrors.fullName && <p className="form-error">{formErrors.fullName}</p>}</div>
                     <div><label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input id="email" type="email" name="email" required value={shippingDetails.email} onChange={handleInputChange} className={`form-input ${formErrors.email ? 'border-red-500' : ''}`} />{formErrors.email && <p className="form-error">{formErrors.email}</p>}</div>
                     <div><label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone *</label><input id="phone" type="tel" name="phone" required value={shippingDetails.phone} onChange={handleInputChange} className={`form-input ${formErrors.phone ? 'border-red-500' : ''}`} />{formErrors.phone && <p className="form-error">{formErrors.phone}</p>}</div>
                     <div><label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address *</label><input id="address" type="text" name="address" required value={shippingDetails.address} onChange={handleInputChange} className={`form-input ${formErrors.address ? 'border-red-500' : ''}`} />{formErrors.address && <p className="form-error">{formErrors.address}</p>}</div>
                     <div><label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City *</label><input id="city" type="text" name="city" required value={shippingDetails.city} onChange={handleInputChange} className={`form-input ${formErrors.city ? 'border-red-500' : ''}`} />{formErrors.city && <p className="form-error">{formErrors.city}</p>}</div>
                     <div><label htmlFor="deliveryOption" className="block text-sm font-medium text-gray-700 mb-1">Delivery Option</label><select id="deliveryOption" name="deliveryOption" value={shippingDetails.deliveryOption} onChange={handleInputChange} className="form-select">{deliveryOptions.map((option) => ( <option key={option.id} value={option.id}> {option.name} - {formatDisplayPrice(option.price)} ({option.duration}) </option> ))}</select></div>
                     <div className="mt-6">{Object.values(formErrors).some(err => err) && ( <p className="text-sm text-red-600 mb-3 text-center flex items-center justify-center"><Info size={16} className="mr-1"/> Please fix the errors above.</p> )}{submitError && ( <p className="text-sm text-red-600 mb-3 text-center">{submitError}</p> )}<button type="submit" disabled={isSubmitting || itemCount === 0} className="w-full bg-teal-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center">{isSubmitting ? ( <> <Loader2 className="animate-spin h-5 w-5 mr-2" /> Processing... </> ) : ( 'Proceed to Payment' )}</button></div>
                </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}