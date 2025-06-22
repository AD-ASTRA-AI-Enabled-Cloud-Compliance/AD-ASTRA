'use client'

import { Card, CardContent, CardTitle } from '@/components/ui/card';
import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown';
import { RulesTable } from './components/AgileDevTable';
import { RulesDataProvider } from './components/DataContext_Rules';

const explore_rules = () => {
    const [rules, setRules] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:3001/explore/rules");
                const res = await response.json();
                setRules(res.points);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);
    return (
        <RulesDataProvider>

            <div className='w-[100%]'>
                {/* {JSON.stringify(rules)} */}
                <div>
                <RulesTable />
                    
                    <CardTitle>
                        {Object.keys(rules).length}
                    </CardTitle>
                    {rules && rules.map((val, i) => {
                        return (
                            <Card>
                                {JSON.stringify(val)}
                                <CardContent>

                                    <div><b>Point id: </b>{val.id}</div>
                                    <div><b>doc_id: </b>{val.payload.doc_id}</div>
                                    <div><b>rule: </b>{val.payload.rule}</div>
                                    <div><b>category: </b>{val.payload.category}</div>
                                    <div><b>framework: </b>{val.payload.framework}</div>
                                    <div><b>rule_id: </b>{val.payload.rule_id}</div>
                                    <div><b>model: </b>{val.payload.model}</div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </RulesDataProvider>
    )
}

export default explore_rules