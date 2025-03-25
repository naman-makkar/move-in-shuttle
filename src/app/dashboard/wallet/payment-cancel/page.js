'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircleIcon, HomeIcon, WalletIcon, RefreshCwIcon } from 'lucide-react';

export default function PaymentCancelPage() {
  const router = useRouter();
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Payment Cancelled</h1>
      
      <Card className="border-orange-200 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2"></div>
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-100 text-orange-600 p-3 rounded-full">
              <XCircleIcon className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-center text-xl">Payment Cancelled</CardTitle>
          <CardDescription className="text-center">
            Your wallet recharge transaction was cancelled.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 pb-6">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
            <p className="text-slate-700 text-center">
              No charges have been made to your account.
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <p className="text-blue-800 text-sm">
              If you experienced any issues during the payment process, please try again or contact support.
            </p>
          </div>
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
            onClick={() => router.push('/dashboard/wallet')}
          >
            <RefreshCwIcon className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 