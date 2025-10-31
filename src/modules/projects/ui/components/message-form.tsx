import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowUp, Loader2Icon } from "lucide-react";
import TextAreaAutosize from "react-textarea-autosize";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Usage from "./usage";
import { useRouter } from "next/navigation";

interface Props {
  projectId: string;
}

const formSchema = z.object({
  value: z
    .string()
    .min(1, { message: "Value is required" })
    .max(10000, { message: "Value is too long" }),
});

export const MessageForm = ({ projectId }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const {data:usage} = useQuery(trpc.usage.status.queryOptions())
  const [isFocused, setIsFocused] = useState(false);
  const showUsage = !!usage;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { value: "" },
    mode: "onChange",
  });

  const createMessage = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: (data) => {
        form.reset();
        queryClient.invalidateQueries(
          trpc.messages.getMany.queryOptions({ projectId: data.projectId })
        );
        queryClient.invalidateQueries(
          trpc.usage.status.queryOptions()
        );
        toast.success("Message sent!");
      },
      onError: (error) => {
        toast.error(error.message);
        if(error.data?.code === "TOO_MANY_REQUESTS"){
          router.push("/pricing")
        }
      },
    })
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createMessage.mutateAsync({
        value: values.value,
        projectId,
      });
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const isPending = createMessage.isPending;
  const isButtonDisabled = isPending || !form.formState.isValid;

  return (
    <Form {...form}>
      {showUsage && (
        <Usage points={usage.remainingPoints} msBeforeNext={usage.msBeforeNext} />
      )}
      {/* ✅ form.handleSubmit prevents full reload */}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all",
          isFocused && "shadow-xs",
          showUsage && "rounded-t-none"
        )}
      >
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <TextAreaAutosize
                  {...field}
                  disabled={isPending}
                  minRows={2}
                  maxRows={8}
                  className="pt-4 resize-none border-none w-full bg-transparent outline-none"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="What would you like to build?"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      form.handleSubmit(onSubmit)();
                    }
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-x-2 items-end justify-between pt-2">
          <div className="text-[10px] text-muted-foreground font-mono">
            <kbd className="inline-flex h-5 select-none items-center gap-1 rounded bg-muted px-1.5 font-mono text-[10px] text-muted-foreground font-medium">
              <span>Ctrl</span>+ Enter
            </kbd>
            &nbsp;to submit
          </div>

          <Button
            type="submit"
            disabled={isButtonDisabled}
            className={cn(
              "size-9 rounded-full cursor-pointer",
              isButtonDisabled && "bg-muted-foreground border"
            )}
          >
            {isPending ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <ArrowUp />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
