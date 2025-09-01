
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
import type { GratitudeEntry } from "@/lib/types";

const GratitudeFormSchema = z.object({
  entry: z.string().min(10, {
    message: "entryTooShort",
  }),
});

interface GratitudeCardProps {
  prompt: string;
  day: number;
  isSubmittedToday: boolean;
  submittedEntry: GratitudeEntry | null;
  onAddEntry: (text: string, prompt: string) => void;
  onUpdateEntry: (text: string, prompt: string) => void;
}

export function GratitudeCard({
  prompt,
  day,
  isSubmittedToday,
  submittedEntry,
  onAddEntry,
  onUpdateEntry,
}: GratitudeCardProps) {
  const { t } = useLanguage();
  const [currentView, setCurrentView] = React.useState<'form' | 'submitted' | 'editing'>('form');
  
  // This state holds the prompt currently being displayed or edited.
  const [activePrompt, setActivePrompt] = React.useState(prompt);

  const form = useForm<z.infer<typeof GratitudeFormSchema>>({
    resolver: zodResolver(GratitudeFormSchema),
    defaultValues: {
      entry: "",
    },
  });

  // Effect to manage view state and form values based on submission status and entry data
  React.useEffect(() => {
    if (isSubmittedToday && submittedEntry) {
      setCurrentView('submitted');
      setActivePrompt(submittedEntry.prompt);
      form.reset({ entry: submittedEntry.text });
    } else {
      setCurrentView('form');
      setActivePrompt(prompt);
      form.reset({ entry: "" });
    }
  }, [isSubmittedToday, submittedEntry, day, form, prompt]);


  function onSubmit(data: z.infer<typeof GratitudeFormSchema>) {
    if (currentView === 'editing') {
      onUpdateEntry(data.entry, activePrompt);
      setCurrentView('submitted');
    } else {
      onAddEntry(data.entry, activePrompt);
    }
  }

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } },
  };

  const renderContent = () => {
    switch (currentView) {
      case 'submitted':
        return (
          <motion.div
            key="submitted"
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col h-full bg-secondary/50 rounded-lg p-8"
          >
            <div className="flex-grow">
                <p className="text-lg whitespace-pre-wrap">{submittedEntry?.text}</p>
            </div>
            <div className="flex justify-end mt-4">
                <Button variant="ghost" onClick={() => setCurrentView('editing')}>
                    <Pencil className="mr-2 h-4 w-4" />
                    {t('editEntry')}
                </Button>
            </div>
          </motion.div>
        );
      
      case 'form':
      case 'editing':
        return (
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
                 <div className="flex gap-2">
                    {currentView === 'editing' && (
                        <Button type="button" variant="outline" onClick={() => setCurrentView('submitted')} className="w-full">
                            {t('cancel')}
                        </Button>
                    )}
                    <Button type="submit" className="w-full" size="lg">
                        <Sparkles className="mr-2" />
                        {currentView === 'editing' ? t('saveChanges') : t('saveGratitude')}
                    </Button>
                 </div>
              </form>
            </Form>
          </motion.div>
        );
      
      default:
        return null;
    }
  }

  return (
    <Card className="h-full flex flex-col transform transition-transform duration-300 hover:scale-[1.01] hover:shadow-xl">
        <CardHeader>
          <CardTitle className="text-primary">{t('dailyGratitude').replace('{day}', String(day))}</CardTitle>
          <CardDescription className="text-lg font-serif italic pt-2 flex items-center gap-2">
             {currentView === 'form' ? (
                <>
                    <span className="flex-grow">&ldquo;{activePrompt}&rdquo;</span>
                    <Button variant="ghost" size="icon" onClick={() => {
                        const newPrompt = window.prompt(t('editPrompt'), activePrompt);
                        if (newPrompt) setActivePrompt(newPrompt);
                    }}>
                        <Pencil className="w-4 h-4" />
                    </Button>
                </>
            ) : (
                 <span>&ldquo;{activePrompt}&rdquo;</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </CardContent>
    </Card>
  );
}
