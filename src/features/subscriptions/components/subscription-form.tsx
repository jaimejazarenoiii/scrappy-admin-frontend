import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  PERIOD_STATUS_LABELS,
  SUBSCRIPTION_PERIOD_STATUS_OPTIONS,
} from '@/features/subscriptions/types'
import {
  defaultSubscriptionFormValues,
  subscriptionFormSchema,
  type SubscriptionFormValues,
} from '@/features/subscriptions/validation/subscription-schema'
import { Button } from '@/shared/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form/form'
import { Input } from '@/shared/ui/input'
import { Select } from '@/shared/ui/select'

export interface SubscriptionFormProps {
  companyName?: string
  defaultValues?: Partial<SubscriptionFormValues>
  submitLabel?: string
  loading?: boolean
  onSubmit: (values: SubscriptionFormValues) => void | Promise<void>
  onCancel?: () => void
}

export function SubscriptionForm({
  companyName,
  defaultValues,
  submitLabel = 'Save subscription',
  loading,
  onSubmit,
  onCancel,
}: SubscriptionFormProps) {
  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionFormSchema),
    defaultValues: defaultSubscriptionFormValues(defaultValues),
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {companyName ? (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Company</p>
            <p className="mt-1 text-sm font-medium">{companyName}</p>
          </div>
        ) : null}

        <FormField
          control={form.control}
          name="planName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plan name</FormLabel>
              <FormControl>
                <Input placeholder="Standard" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Period status</FormLabel>
              <FormControl>
                <Select {...field}>
                  {SUBSCRIPTION_PERIOD_STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {PERIOD_STATUS_LABELS[status]}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <p className="text-xs text-[var(--muted)]">
                API accepts only Pending or Active for a period. Use Pending after expire / suspend.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="startsAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Starts at</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endsAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ends at</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2 pt-1">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving…' : submitLabel}
          </Button>
          {onCancel ? (
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
          ) : null}
        </div>
      </form>
    </Form>
  )
}
