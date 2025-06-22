
import React from 'react'
import { AgileDevType } from './lib'
import AgileDevForm from './AgileDevForm'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from "@/components/ui/menubar"
import { EllipsisVertical } from 'lucide-react'

const AgileDev = ({ data }: { data: AgileDevType }) => {
    return (
        <Card>
            <CardContent>
                <CardTitle className='flex flex-row justify-around '>

                    <AgileDevForm item={data} />

                    <Menubar>
                        <MenubarMenu>
                            <MenubarTrigger>
                                <EllipsisVertical size={15} className='hover:bg- hover:text-slate-50 hover:cursor-pointer rounded-sm' />
                                <span className='text-xs'>
                                    Options
                                </span>
                            </MenubarTrigger>
                            <MenubarContent>
                                <MenubarItem>
                                    Details
                                </MenubarItem>
                                <MenubarItem>
                                    Update
                                </MenubarItem>
                                <MenubarItem >
                                    Delete
                                </MenubarItem>
                                <MenubarItem >
                                    Close
                                </MenubarItem>
                                <MenubarSeparator />
                                <MenubarSub >
                                    <MenubarSubTrigger disabled className='text-muted'>Share</MenubarSubTrigger>
                                    <MenubarSubContent>
                                        <MenubarItem>Email link</MenubarItem>
                                        <MenubarItem>Messages</MenubarItem>
                                        <MenubarItem>Notes</MenubarItem>
                                    </MenubarSubContent>
                                </MenubarSub>
                                <MenubarSeparator />
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>
                </CardTitle>

                {/* <div>uuid: {data.uuid}</div>
                <div>dev_token: {data.dev_token}</div>
                <div>unique_token: {data.unique_token}</div> */}
                <div>feature_name: {data.feature_name}</div>
                <div>obs: {data.obs}</div>
                <div>taggi: {data.taggi}</div>
                <div>duedate: {data.duedate}</div>
                <div>archive: {data.archive}</div>
                {/* <div>cloned_steps: {data.cloned_steps}</div> */}
                {/* <div>company_token: {data.company_token}</div>
                <div>company_usrID: {data.company_usrID}</div> */}

            </CardContent>
        </Card>
    )
}

export default AgileDev