import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from 'src/lib/auth.context'
import { Button } from 'src/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'src/components/ui/form'
import { Input } from 'src/components/ui/input'
import { useToast } from 'src/hooks/use-toast'

interface SignupFormData {
  name: string
  email: string
  phone: string
  postcode: string
  password: string
  confirmPassword: string
}

export function SignupForm() {
  const { t } = useTranslation()
  const { signup } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const form = useForm<SignupFormData>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      postcode: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: SignupFormData) => {
    if (data.password !== data.confirmPassword) {
      form.setError('confirmPassword', {
        type: 'manual',
        message: t('auth.errors.passwordMismatch'),
      })
      return
    }

    try {
      await signup(data.name, data.email, data.password, data.phone, data.postcode)
      toast({
        title: t('auth.success.registration'),
        variant: 'default',
      })
      navigate('/')
    } catch (error) {
      toast({
        title: t('auth.errors.registrationFailed'),
        variant: 'destructive',
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">
        <FormField
          control={form.control}
          name="name"
          rules={{
            required: t('auth.errors.required'),
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.name')}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          rules={{
            required: t('auth.errors.required'),
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: t('auth.errors.invalidEmail'),
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.email')}</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          rules={{
            required: t('auth.errors.required'),
            pattern: {
              value: /^(\+44|0044|0)7\d{9}$|^(\+33|0033|0)[67]\d{8}$/,
              message: t('auth.errors.invalidPhone'),
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.phone')}</FormLabel>
              <FormControl>
                <Input 
                  type="tel" 
                  placeholder="+447911123456" 
                  {...field} 
                />
              </FormControl>
              <div className="text-sm text-muted-foreground mt-1">
                {t('auth.phoneHelper')}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="postcode"
          rules={{
            required: t('auth.errors.required'),
            pattern: {
              value: /^[A-Z0-9]{4,10}$/,
              message: t('auth.errors.invalidPostcode'),
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.postcode')}</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          rules={{
            required: t('auth.errors.required'),
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.password')}</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          rules={{
            required: t('auth.errors.required'),
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.confirmPassword')}</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {t('auth.registerButton')}
        </Button>
      </form>
    </Form>
  )
}