"use client"


import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export function TabPanel() {

  const [tab, setTab] = useState("open");

  const handleChangeTab = (_e: Event, newValue: string) => {
    console.log(newValue)
    setTab(newValue);
  };
  return (

    <div className="w-full p-2" >
      <Tabs onValueChange={() => { handleChangeTab }} defaultValue={tab} className="w-full flex flex-col">
        <TabsList className="flex justify-start pl-1">
          <TabsTrigger value="open">Active</TabsTrigger>
          <TabsTrigger value="pending">Done</TabsTrigger>
          <TabsTrigger value="resolve">Unread</TabsTrigger>
          <div className="flex w-full gap-1 pr-1 items-center justify-end">
            <Separator className="h-5" orientation="vertical" />
            <TabsTrigger value="contacts">Filter</TabsTrigger>
          </div>
        </TabsList>
        <TabsContent value="open">Change your password here.</TabsContent>
        <TabsContent value="pending">here.</TabsContent>
      </Tabs>
    </div>
  )
}