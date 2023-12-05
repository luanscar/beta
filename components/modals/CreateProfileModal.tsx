'use client'

import { ShieldAlert, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import qs from 'query-string'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { useModal } from '@/hooks/use-modal-store'
import { CompanyWithMembersWithProfiles } from '@/types'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { ChannelType, Company, MemberRole } from '@prisma/client'

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Nome deve ter mais de 2 caracters.',
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
  email: z.string().email('E-mail Inválido!').toLowerCase(),

  role: z.nativeEnum(MemberRole),
})

export const CreateProfileModal = () => {
  const router = useRouter()
  const params = useParams()
  const { onOpen, isOpen, onClose, type, data } = useModal()

  const isModalOpen = isOpen && type === 'members'
  const { company } = data as { company: CompanyWithMembersWithProfiles }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: '/api/profiles',
        query: {
          companyId: params?.companyId,
        },
      })

      await axios.post(url, values)

      form.reset()
      router.refresh()
      onClose()
    } catch ({ response }: any) {
      const errorMessage = response?.data?.error
      toast.error(errorMessage)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Crie um perfil novo
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
                      Nome do perfil
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
                      Email do perfil
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
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Função do perfil</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0  outline-none">
                          <SelectValue placeholder="Selecione a função do perfil" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(MemberRole).map((role) => (
                          <SelectItem
                            key={role}
                            value={role}
                            className="capitalize"
                          >
                            {role.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant="default" disabled={isLoading}>
                Criar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
