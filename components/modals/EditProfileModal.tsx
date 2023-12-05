'use client'

import axios from 'axios'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useModal } from '@/hooks/use-modal-store'
import toast from 'react-hot-toast'
import { MemberRole } from '@prisma/client'
import queryString from 'query-string'

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'Nome perfil é obrigatório!.',
    })
    .transform((name) => {
      return name
        .trim()
        .toLocaleLowerCase()
        .split(' ')
        .map((word) => {
          return word[0].toUpperCase().concat(word.substring(1))
        })
        .join(' ')
    }),
  email: z.string().email('E-mail is required'),
  password: z.string().min(8, {
    message: 'Sua senha deve ter no mínimo 8 caracters',
  }),
})

export const EditProfileModal = () => {
  const { isOpen, onClose, type, data } = useModal()
  const router = useRouter()

  const isModalOpen = isOpen && type === 'editProfile'
  const { profile, members } = data

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    if (profile) {
      form.setValue('name', profile.name as string)
      form.setValue('email', profile.email as string)
    }
  }, [profile, form])

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/profiles/${profile?.id}`, values)

      onRoleChange(members?.id as string, 'ADMIN')
      form.reset()
      router.refresh()
      onClose()
    } catch (error) {
      console.log(error)
    } finally {
      toast.success('Dados do perfil alterados!')
    }
  }

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      const url = queryString.stringifyUrl({
        url: `/api/profiles/${memberId}`,
      })

      const response = await axios.patch(url, { role })
    } catch (error) {
      console.log(error)
    }
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Editar Perfil
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Seu nome
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter server name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter server name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Senha
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Sua senha deve ter no mínimo 8 caracters"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant="default" disabled={isLoading}>
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
