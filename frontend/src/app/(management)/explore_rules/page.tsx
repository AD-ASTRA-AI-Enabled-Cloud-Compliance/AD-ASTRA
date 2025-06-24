
import React, { useEffect, useState } from 'react'
import { RulesTable } from './components/RulesTable';
import { RulesDataProvider } from './components/DataContext_Rules';

const explore_rules = () => {
    return (
        <RulesDataProvider>
            <div className='w-[100%]'>
                <RulesTable />
            </div>
        </RulesDataProvider>
    )
}

export default explore_rules