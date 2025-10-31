"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowUp, Loader2 } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { PROJECT_TEMPLATES } from "../../constdata";
import { useClerk } from "@clerk/nextjs";

const formSchema = z.object({
  value: z
    .string()
    .min(1, { message: "Value is required" })
    .max(10000, { message: "Value is too long" }),
});

export const ProjectForm = () => {
  const router = useRouter();
  const trpc = useTRPC();
  const clerk = useClerk();
  const queryClient = useQueryClient();
  const [isFocused, setIsFocused] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { value: "" },
    mode: "onChange", // ✅ ensures validation runs while typing
  });

  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(trpc.projects.getMany.queryOptions());
        toast.success("Project created!");
        queryClient.invalidateQueries(trpc.usage.status.queryOptions())
        router.push(`/projects/${data.id}`);
      },
      onError: (error) => {
        toast.error(error.message);
        if(error.data?.code === "UNAUTHORIZED"){
          clerk.openSignIn()
        }
        if(error.data?.code === "TOO_MANY_REQUESTS"){
          router.push("/pricing")
        }
      },
    })
  );

  const onSelect = (value:string) => {
    form.setValue("value",value,{
        shouldDirty : true,
        shouldTouch : true,
        shouldValidate : true,
    })
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createProject.mutateAsync({
        value: values.value.trim(),
      });
      form.reset(); // ✅ clear textarea after submit
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const isPending = createProject.isPending;
  const isButtonDisabled = isPending || !form.formState.isValid;

  return (
    <Form {...form}>
      <section className="space-y-6">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            "relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all duration-200",
            isFocused && "shadow-sm border-primary/30"
          )}
        >
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <TextareaAutosize
                    {...field}
                    disabled={isPending}
                    minRows={2}
                    maxRows={8}
                    className={cn(
                      "pt-4 resize-none border-none w-full bg-transparent outline-none text-sm leading-relaxed placeholder:text-muted-foreground",
                      isPending && "opacity-60 cursor-not-allowed"
                    )}
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
                <span>Ctrl</span>+<span>Enter</span>
              </kbd>
              &nbsp;to submit
            </div>

            <Button
              type="submit"
              disabled={isButtonDisabled}
              variant="secondary"
              size="icon"
              className={cn(
                "rounded-full transition-all duration-200",
                isButtonDisabled && "opacity-70 cursor-not-allowed"
              )}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>

        {/* ✅ Project Template Buttons */}
        <div className="flex-wrap justify-center gap-2 mt-4 hidden md:flex max-w-3xl mx-auto">
          {PROJECT_TEMPLATES.map((template) => (
            <Button
              key={template.title}
              variant="outline"
              size="sm"
              className="bg-white cursor-pointer rounded-full dark:bg-sidebar hover:bg-accent hover:text-accent-foreground transition-colors"
              onClick={()=>onSelect(template.prompt)}
            >
              {template.emoji}&nbsp;{template.title}
            </Button>
          ))}
        </div>
      </section>
    </Form>
  );
};
