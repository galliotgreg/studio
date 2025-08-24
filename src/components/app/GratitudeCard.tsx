"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, BrainCircuit, Sparkles } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { cn } from "@/lib/utils";

const GratitudeFormSchema = z.object({
  entry: z.string().min(10, {
    message: "Your entry must be at least 10 characters.",
  }),
});

interface GratitudeCardProps {
  prompt: string;
  day: number;
  isSubmittedToday: boolean;
  isSuggestingPrompt: boolean;
  onEntrySubmit: (text: string) => void;
  onSuggestPrompt: () => void;
}

export function GratitudeCard({
  prompt,
  day,
  isSubmittedToday,
  isSuggestingPrompt,
  onEntrySubmit,
  onSuggestPrompt,
}: GratitudeCardProps) {
  const form = useForm<z.infer<typeof GratitudeFormSchema>>({
    resolver: zodResolver(GratitudeFormSchema),
    defaultValues: {
      entry: "",
    },
  });

  function onSubmit(data: z.infer<typeof GratitudeFormSchema>) {
    onEntrySubmit(data.entry);
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
          <CardTitle className="text-primary">Day {day}: Daily Gratitude</CardTitle>
          <CardDescription className="text-lg font-serif italic pt-2">
            "{prompt}"
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
                <h3 className="text-xl font-semibold">Thank you for your entry!</h3>
                <p className="text-muted-foreground mt-2">
                  You've completed your gratitude for today. See you tomorrow!
                </p>
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
                              placeholder="What are you grateful for today? Write at least one thing..."
                              className="min-h-[150px] text-base resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <Button type="submit" className="w-full" size="lg">
                        <Sparkles className="mr-2" />
                        Save My Gratitude
                    </Button>
                  </form>
                </Form>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        {!isSubmittedToday && (
            <CardFooter>
            <Button
                variant="link"
                className="text-muted-foreground mx-auto"
                onClick={onSuggestPrompt}
                disabled={isSuggestingPrompt}
            >
                <BrainCircuit className={cn("mr-2", isSuggestingPrompt && "animate-spin")} />
                {isSuggestingPrompt ? "Thinking..." : "Feeling stuck? Get a new prompt"}
            </Button>
            </CardFooter>
        )}
    </Card>
  );
}
