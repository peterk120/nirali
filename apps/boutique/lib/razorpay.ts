/**
 * Utility functions for Razorpay integration
 */

// Function to load Razorpay SDK dynamically
export const loadRazorpayScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    const existingScript = document.getElementById('razorpay-script');
    if (existingScript) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
    
    document.head.appendChild(script);
  });
};

// Function to open Razorpay payment modal
export const openRazorpayPayment = (options: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const razorpayOptions = {
      ...options,
      handler: (response: any) => {
        resolve(response);
      },
      modal: {
        ondismiss: () => {
          reject(new Error('Payment cancelled by user'));
        }
      }
    };

    // @ts-ignore - Razorpay is loaded dynamically
    const rzp = new window.Razorpay(razorpayOptions);
    rzp.open();
  });
};