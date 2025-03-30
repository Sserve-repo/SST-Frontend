"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Plus, Tag } from "lucide-react"

export function CreateDiscount() {
  const [createOpen, setCreateOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleCreate = () => {
    setCreateOpen(false)
    setConfirmOpen(true)
  }

  const handleConfirm = () => {
    // Handle the actual discount creation here
    setConfirmOpen(false)
    // You can add a success notification here
  }

  return (
    <>
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogTrigger asChild>
          <Button className="bg-[#5D3A8B] hover:bg-[#4C2E70]">
            <Plus className="mr-2 h-4 w-4" />
            Create Discount
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Create Discount</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-base font-medium">
                Discount Name
              </label>
              <Input id="name" placeholder="Enter Discount Name" className="h-12" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="type" className="text-base font-medium">
                  Discount Type
                </label>
                <Select>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Percentage(%) or Fixed Amount($20)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="price" className="text-base font-medium">
                  Discount Price
                </label>
                <Input id="price" placeholder="20% or $20" className="h-12" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="startDate" className="text-base font-medium">
                  Start Date
                </label>
                <Input id="startDate" type="date" placeholder="Please Start Date" className="h-12" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="endDate" className="text-base font-medium">
                  End Date
                </label>
                <Input id="endDate" type="date" placeholder="Please End Date" className="h-12" />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setCreateOpen(false)}
              className="h-12 px-8 text-red-500 hover:text-red-600"
            >
              Discard
            </Button>
            <Button onClick={handleCreate} className="h-12 px-8 bg-[#5D3A8B] hover:bg-[#4C2E70]">
              Create Discount
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <div className="grid gap-6 py-4 text-center">
            <div className="mx-auto rounded-full bg-purple-100 p-3">
              <Tag className="h-6 w-6 text-[#5D3A8B]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Are you sure you want to create this discount?</h2>
              <p className="text-sm text-gray-500">
                Once this discount is applied, it will affect the listed price of your item(s).
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setConfirmOpen(false)
                  setCreateOpen(true)
                }}
                className="flex-1 h-12"
              >
                Back
              </Button>
              <Button onClick={handleConfirm} className="flex-1 h-12 bg-[#5D3A8B] hover:bg-[#4C2E70]">
                Proceed
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

