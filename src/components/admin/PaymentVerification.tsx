import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  buyer: {
    full_name: string;
  };
  product: {
    title: string;
  };
}

export const PaymentVerification = () => {
  const { toast } = useToast()

  const { data: payments, refetch } = useQuery({
    queryKey: ['pendingPayments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          buyer:users!buyer_id(full_name),
          product:products(title)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as Payment[]
    }
  })

  const handleVerify = async (paymentId: string) => {
    try {
      const { error } = await supabase
        .from('payments')
        .update({ 
          status: 'verified',
          verified_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', paymentId)

      if (error) throw error

      toast({
        title: "Payment verified",
        description: "The payment has been verified successfully."
      })
      
      refetch()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error verifying payment",
        description: "Please try again later."
      })
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Payment Verification</h2>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Buyer</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments?.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{payment.product?.title}</TableCell>
              <TableCell>{payment.buyer?.full_name}</TableCell>
              <TableCell>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: payment.currency || 'XAF'
                }).format(payment.amount)}
              </TableCell>
              <TableCell>
                {new Date(payment.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => handleVerify(payment.id)}
                  size="sm"
                >
                  Verify
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}