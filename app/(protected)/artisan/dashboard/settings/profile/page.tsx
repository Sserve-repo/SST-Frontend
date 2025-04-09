"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProfileImageUpload } from "@/components/settings/profile-image-upload"
import { MultiSelect } from "@/components/settings/multi-select"
import { SaveConfirmDialog } from "@/components/settings/save-confirm-dialog"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  personalDetails: z.object({
    profileImage: z.string(),
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    email: z.string().email(),
    phone: z.string().min(10).max(15),
    bio: z.string().max(500).optional(),
  }),
  businessDetails: z.object({
    businessName: z.string().min(2).max(100),
    serviceAreas: z.array(z.string()).min(1),
    specialties: z.array(z.string()).min(1),
    experience: z.string(),
    website: z.string().url().optional(),
  }),
  paymentSettings: z.object({
    basePrice: z.number().min(0),
    payoutSchedule: z.enum(["weekly", "biweekly", "monthly"]),
    accountHolder: z.string().min(2),
    accountNumber: z.string().min(8),
    bankName: z.string().min(2),
  }),
})

// Sample data for dropdowns
const SERVICE_AREAS = ["Downtown", "North End", "South Side", "East Side", "West End", "Suburbs"]

const SPECIALTIES = [
  "Haircuts",
  "Hair Coloring",
  "Styling",
  "Extensions",
  "Treatments",
  "Makeup",
  "Nails",
  "Spa Services",
]

const EXPERIENCE_LEVELS = ["1-2 years", "3-5 years", "5-10 years", "10+ years"]

export default function ProfileSettingsPage() {
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const { toast } = useToast()

  // In a real app, this would be fetched from an API
  const defaultValues: z.infer<typeof formSchema> = {
    personalDetails: {
      profileImage: "/assets/images/image-placeholder.png",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah@example.com",
      phone: "+1234567890",
      bio: "Professional hairstylist with over 5 years of experience.",
    },
    businessDetails: {
      businessName: "Style & Grace Salon",
      serviceAreas: ["Downtown", "North End"],
      specialties: ["Haircuts", "Hair Coloring", "Styling"],
      experience: "5-10 years",
      website: "https://example.com",
    },
    paymentSettings: {
      basePrice: 50,
      payoutSchedule: "biweekly",
      accountHolder: "Sarah Johnson",
      accountNumber: "****1234",
      bankName: "Example Bank",
    },
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // In a real app, this would be an API call
    console.log(data)
    setShowSaveDialog(false)
    toast({
      title: "Profile updated",
      description: "Your profile changes have been saved successfully.",
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Profile Settings</h1>
        <p className="text-gray-500">Manage your personal and business information</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(() => setShowSaveDialog(true))} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="personalDetails.profileImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Picture</FormLabel>
                    <FormControl>
                      <ProfileImageUpload value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="personalDetails.firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="personalDetails.lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="personalDetails.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="personalDetails.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} type="tel" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="personalDetails.bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Tell us about yourself..." className="resize-none" />
                    </FormControl>
                    <FormDescription>Brief description of your experience and expertise</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="businessDetails.businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessDetails.serviceAreas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Areas</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={SERVICE_AREAS}
                        selected={field.value}
                        onChange={field.onChange}
                        placeholder="Select areas"
                      />
                    </FormControl>
                    <FormDescription>Areas where you provide your services</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessDetails.specialties"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialties</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={SPECIALTIES}
                        selected={field.value}
                        onChange={field.onChange}
                        placeholder="Select specialties"
                      />
                    </FormControl>
                    <FormDescription>Your areas of expertise</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="businessDetails.experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select experience" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {EXPERIENCE_LEVELS.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="businessDetails.website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input {...field} type="url" placeholder="https://" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="paymentSettings.basePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Price (per hour)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentSettings.payoutSchedule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payout Schedule</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select schedule" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="biweekly">Bi-weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="paymentSettings.accountHolder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Holder Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentSettings.bankName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="paymentSettings.accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormDescription>Your bank account number is securely stored</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" size="lg">
              Save Changes
            </Button>
          </div>
        </form>
      </Form>

      <SaveConfirmDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        onConfirm={() => form.handleSubmit(onSubmit)()}
      />
    </div>
  )
}

