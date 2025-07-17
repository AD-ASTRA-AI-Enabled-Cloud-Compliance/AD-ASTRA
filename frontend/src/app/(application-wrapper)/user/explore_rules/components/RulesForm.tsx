'use client'
import React from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { CopyPlus, EllipsisIcon, Save, Trash2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import WrapperInput from '@/components/ui/WrapperInput';

import { handleSubmit, onDestroy } from '@/actions/crudOperations';


import PageHeader from '@/components/ui-app/header';
import { useAgileDevDataContext } from './DataContext_Rules';
import { AgileDevType } from './lib';

interface AgileDevFormProps {
  item?: AgileDevType | null;
}

export function AgileDevForm({ item }: AgileDevFormProps) {
  const { setDataAgileDev, setSelctedAgileDev } = useAgileDevDataContext();
  const { selectedAgileDev } = useAgileDevDataContext();

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const action = (event.nativeEvent as SubmitEvent).submitter?.getAttribute("value");
    const isCloneOrCreate = action === "CREATE_AgileDev";
    const uuid = isCloneOrCreate
      ? selectedAgileDev?.dev_token || null
      : item?.dev_token || null;

    if (isCloneOrCreate === false && !uuid) {
      alert(`"Missing UUID for action:" ${action}`);
      console.error("Missing UUID for action:", action);
      return;
    }

    if (action === "CREATE_AgileDev") {
      handleSubmit(action, event, uuid, setDataAgileDev, setSelctedAgileDev);

    } else {
      handleSubmit("UPDATE_AgileDev", event, uuid, setDataAgileDev, setSelctedAgileDev);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {item ?
          (<EllipsisIcon size={17} className='hover:bg- hover:text-slate-50 hover:cursor-pointer rounded-sm' />)
          :
          (<Button type='submit'>Add</Button>)}
      </SheetTrigger>

      <SheetDescription className='hidden'></SheetDescription>
      <SheetContent side='right'>
        <SheetHeader>
          <SheetTitle>{item ? 'Edit/Clone' : 'Add'}</SheetTitle>
        </SheetHeader>
        <ScrollArea className='h-full'>
          <PageHeader text={item ? item.feature_name : 'Add new stage'} />
          <form onSubmit={onFormSubmit}>
            <WrapperInput fiedlName='uuid' inptype='text' value={item?.uuid} />
            <WrapperInput fiedlName='dev_token' inptype='text' value={item?.dev_token} />
            <WrapperInput fiedlName='unique_token' inptype='text' value={item?.unique_token} />
            <WrapperInput fiedlName='feature_name' inptype='text' value={item?.feature_name} />
            <WrapperInput fiedlName='obs' inptype='text' value={item?.obs} />
            <WrapperInput fiedlName='taggi' inptype='text' value={item?.taggi} />
            <WrapperInput fiedlName='duedate' inptype='date' value={item?.duedate} />
            <WrapperInput fiedlName='archive' inptype='number' value={item?.archive} />
            <WrapperInput fiedlName='cloned_steps' inptype='text' value={item?.cloned_steps} />
            <WrapperInput fiedlName='company_token' inptype='text' value={item?.company_token} />
            <WrapperInput fiedlName='company_usrID' inptype='number' value={item?.company_usrID} />

            <DialogTrigger asChild>
              {item ? (
                <div className='flex flex-row justify-center items-center mt-3'>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="icon" type="submit" name="action" value="saveChanges" className='px-10 mx-3'>
                          <Save />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Update</p></TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" type="submit" name="action" value="CREATE_AgileDev" className='px-10 mx-3'>
                          <CopyPlus />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Clone record</p></TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>)
                :
                (<Button type="submit" name="action" value="CREATE_AgileDev">Add</Button>)}
            </DialogTrigger>
          </form>

          {item && (
            <div className='flex flex-col justify-center items-center mt-3'>
              <SheetHeader>
                <SheetTitle>Delete</SheetTitle>
              </SheetHeader>
              <form onSubmit={(event) => onDestroy('DELETE_AgileDev', item.unique_token, event)}>
                <div className='flex flex-col justify-center items-center mt-3'>
                  <div>
                    <Checkbox className='mx-2' required id='confirm' name='confirm' />
                    <label htmlFor='confirm' className='text-sm font-medium leading-none'>Confirm and delete</label>
                  </div>
                  <Button variant="outline" size="icon" type="submit">
                    <Trash2 />
                  </Button>
                </div>
              </form>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

export default AgileDevForm