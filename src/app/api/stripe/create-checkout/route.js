import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Initialize Stripe with the secret key
// In production, use environment variable
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_your_key');

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const { amount } = await request.json();
    
    if (!amount || amount < 1) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }
    
    // Convert to smallest currency unit (cents for USD)
    const amountInSmallestUnit = Math.round(amount * 100);
    
    // Create a Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'Wallet Recharge',
              description: `Add ${amount} points to your campus wallet`,
            },
            unit_amount: amountInSmallestUnit,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/dashboard/wallet/payment-success?session_id={CHECKOUT_SESSION_ID}&amount=${amount}&userId=${session.user.userId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/dashboard/wallet/payment-cancel`,
      metadata: {
        userId: session.user.userId,
        amount: amount,
      },
    });
    
    return NextResponse.json({ id: checkoutSession.id, url: checkoutSession.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
} 