'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import qs from 'query-string'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  password: z.string().min(8, {
    message: 'Sua senha deve ter no mínimo 8 caracters',
  }),
})

interface ResetPasswordProps {
  profileId: string
}

export const ResetPassword = ({ profileId }: ResetPasswordProps) => {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
    },
  })
  const isLoading = form.formState.isSubmitting
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `/api/profiles/${profileId}`,
        query: {
          profileId: profileId,
        },
      })

      await axios.patch(url, values)

      form.reset()
      router.refresh()
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Dialog open>
      <DialogContent className="bg-white  overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-ls pb-6 text-start font-semibold">
            Você deve atualizar sua senha!
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        type="password"
                        placeholder="Escolha sua senha"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Atualizar</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
