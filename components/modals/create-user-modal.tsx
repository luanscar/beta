"use client";

import { useParams, useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";
import { CompanyWithMembersWithUsers } from "@/types/db-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { MemberRole } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import queryString from "query-string";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Nome deve ter mais de 2 caracters.",
    })
    .transform((name) => {
      return name
        .trim()
        .toLocaleLowerCase()
        .split(" ")
        .map((word) => {
          return word[0].toUpperCase().concat(word.substring(1));
        })
        .join(" ");
    }),
  email: z.string().email("E-mail Inválido!").toLowerCase(),

  role: z.nativeEnum(MemberRole),
});

export const CreateUserModal = () => {
  const router = useRouter();
  const params = useParams();
  const { onOpen, isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "createUser";
  const { company } = data as { company: CompanyWithMembersWithUsers };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  // const { refreshInterval, mutate, cache, ...restConfig } = useSWRConfig();
  // const { mutate } = useUsers();
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = queryString.stringifyUrl({
        url: "/api/company/user",
        query: {
          companyId: params?.companyId,
        },
      });

      await axios.post(url, values).then((res) => {
        if (res.statusText === "Created") {
          toast.success("Usuário criado!");
        }
      });

      form.reset();
      // router.refresh();
      // mutate(url);

      onClose();
    } catch ({ response }: any) {
      const errorMessage = response?.data?.error;
      toast.error(errorMessage);
    }
  };
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: onSubmit,
    onSuccess: () => {
      queryClient.invalidateQueries(["ListUsers"]);
    },
  });

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Crie um perfil novo
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(mutation.mutate)}
            className="space-y-8"
          >
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Nome do usuário
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Digite o nome do usuário"
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
                      Email do usuário
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Digite o email do usuário"
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
                            {role.toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 flex justify-center items-center px-6 py-4">
              <Button variant="default" disabled={isLoading}>
                <p className={cn(`block`, isLoading && "hidden")}>Criar</p>
                {isLoading && (
                  <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
