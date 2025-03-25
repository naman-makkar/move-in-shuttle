'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircleIcon, HomeIcon, WalletIcon, RefreshCwIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [updatingWallet, setUpdatingWallet] = useState(false);
  const [walletUpdated, setWalletUpdated] = useState(false);
  
  const sessionId = searchParams.get('session_id');
  const amount = searchParams.get('amount');
  const userId = searchParams.get('userId');
  
  useEffect(() => {
    async function verifyPayment() {
      if (!sessionId || !amount || !userId) {
        setError('Invalid payment information');
        setLoading(false);
        return;
      }
      
      try {
        // In a real implementation, you'd verify the payment with Stripe first
        // For simplicity, we'll assume the payment was successful if we have the session ID
        setSuccess(true);
        setLoading(false);
      } catch (err) {
        console.error('Payment verification error:', err);
        setError('Unable to verify payment status');
        setLoading(false);
      }
    }
    
    verifyPayment();
  }, [sessionId, amount, userId]);
  
  // Function to update wallet balance
  async function updateWalletBalance() {
    if (!userId || !amount) {
      setError('Missing user ID or amount');
      return;
    }
    
    try {
      setUpdatingWallet(true);
      const res = await fetch('/api/user/wallet/recharge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          amount: Number(amount),
          description: `Stripe payment (${sessionId})`
        })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setWalletUpdated(true);
      } else {
        setError(data.error || 'Failed to update wallet balance');
      }
    } catch (err) {
      console.error('Error updating wallet:', err);
      setError('Failed to update wallet. Please contact support.');
    } finally {
      setUpdatingWallet(false);
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Payment Status</h1>
      
      {loading ? (
        <Card>
          <CardContent className="p-6 flex justify-center items-center">
            <p>Verifying payment status...</p>
          </CardContent>
        </Card>
      ) : error ? (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : success ? (
        <Card className="border-green-200 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2"></div>
          <CardHeader className="pb-4">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 text-green-600 p-3 rounded-full">
                <CheckCircleIcon className="h-8 w-8" />
              </div>
            </div>
            <CardTitle className="text-center text-xl">Payment Successful!</CardTitle>
            <CardDescription className="text-center">
              Your payment was processed successfully.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4 pb-6">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-green-800 font-medium">Amount: <span className="font-bold text-xl">₹{amount}</span></p>
              <p className="text-sm text-green-700 mt-1">Transaction ID: {sessionId.substring(0, 12)}...</p>
            </div>
            
            {walletUpdated ? (
              <Alert className="bg-green-50 border-green-200 text-green-800">
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                <AlertDescription>
                  Your wallet has been successfully updated!
                </AlertDescription>
              </Alert>
            ) : (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p className="text-blue-800 text-sm mb-3">
                  Click the button below to add the funds to your wallet.
                </p>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={updateWalletBalance}
                  disabled={updatingWallet}
                >
                  {updatingWallet ? (
                    <>
                      <RefreshCwIcon className="h-4 w-4 mr-2 animate-spin" />
                      Updating Wallet...
                    </>
                  ) : (
                    <>
                      <WalletIcon className="h-4 w-4 mr-2" />
                      Add Funds to Wallet
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              className="w-full bg-slate-800 hover:bg-slate-700"
              onClick={() => router.push('/dashboard/wallet')}
            >
              <WalletIcon className="h-4 w-4 mr-2" />
              Back to Wallet
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/dashboard')}
            >
              <HomeIcon className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </CardFooter>
        </Card>
      ) : null}
    </div>
  );
} 