
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Sparkles, Pencil } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useLanguage } from "@/components/app/LanguageProvider";
import { cn } from "@/lib/utils";

const GratitudeFormSchema = z.object({
  entry: z.string().min(10, {
    message: "entryTooShort",
  }),
});

interface GratitudeCardProps {
  prompt: string;
  day: number;
  isSubmittedToday: boolean;
  onEntrySubmit: (text: string, prompt: string) => void;
}

export function GratitudeCard({
  prompt,
  day,
  isSubmittedToday,
  onEntrySubmit,
}: GratitudeCardProps) {
  const { t } = useLanguage();
  const [editablePrompt, setEditablePrompt] = React.useState(prompt);
  const [isEditingPrompt, setIsEditingPrompt] = React.useState(false);
  
  React.useEffect(() => {
      setEditablePrompt(prompt);
      setIsEditingPrompt(false);
  }, [prompt]);


  const form = useForm<z.infer<typeof GratitudeFormSchema>>({
    resolver: zodResolver(GratitudeFormSchema),
    defaultValues: {
      entry: "",
    },
  });

  React.useEffect(() => {
    form.reset({ entry: "" });
  }, [editablePrompt, form]);

  function onSubmit(data: z.infer<typeof GratitudeFormSchema>) {
    onEntrySubmit(data.entry, editablePrompt);
    form.reset();
  }
  
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
  };

  return (
    <Card className="h-full flex flex-col transform transition-transform duration-300 hover:scale-[1.01] hover:shadow-xl">
        <CardHeader>
          <CardTitle className="text-primary">{t('dailyGratitude').replace('{day}', String(day))}</CardTitle>
          <CardDescription className="text-lg font-serif italic pt-2 flex items-center gap-2">
            {isSubmittedToday ? (
                <span>&ldquo;{prompt}&rdquo;</span>
            ) : isEditingPrompt ? (
                <Textarea
                    value={editablePrompt}
                    onChange={(e) => setEditablePrompt(e.target.value)}
                    onBlur={() => setIsEditingPrompt(false)}
                    className="flex-grow"
                    autoFocus
                />
            ) : (
                <>
                    <span className="flex-grow">&ldquo;{editablePrompt}&rdquo;</span>
                    <Button variant="ghost" size="icon" onClick={() => setIsEditingPrompt(true)} className="flex-shrink-0">
                        <Pencil className="w-4 h-4" />
                    </Button>
                </>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <AnimatePresence mode="wait">
            {isSubmittedToday ? (
              <motion.div
                key="submitted"
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col items-center justify-center h-full text-center bg-secondary/50 rounded-lg p-8"
              >
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold">{t('submittedTitle')}</h3>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="entry"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder={t('gratitudePlaceholder')}
                              className="min-h-[150px] text-base resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage>
                            {form.formState.errors.entry && t(form.formState.errors.entry.message || '')}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                     <Button type="submit" className="w-full" size="lg">
                        <Sparkles className="mr-2" />
                        {t('saveGratitude')}
                    </Button>
                  </form>
                </Form>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
    </Card>
  );
}
