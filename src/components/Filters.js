import React, { useContext, useEffect, useRef, useImperativeHandle, forwardRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from 'react-datepicker';
import moment from 'moment';
// import { ExtensionContext } from '@looker/extension-sdk-react';
import filterDummy from '../data/filters.json'

export const Filters = forwardRef(({onFiltersUpdate}, ref) => {
    // const extensionContext = useContext(ExtensionContext);
    // const sdk = extensionContext.core40SDK; // Use the appropriate version of the Looker API

    const [filterData, setFilterData] = useState(null);
    const [dateRange, setDateRange] = useState([new Date('2024/10/01'), new Date('2024/10/30')]);
    const [startDate, endDate] = dateRange;

    const companyRef = useRef();
    const symbolRef = useRef();
    const industry_group_enRef = useRef();
    const actionTypeRef = useRef();
    
    useEffect(() => {
        fetchFilterData();
    }, []);

    const fetchFilterData = async () => {
        // setIsLoading(true);
        // setError(null);
        
        // Run Inline Query to get Filters Data from Looker
        // Companies, Symbols, Industries, ActionTypes
        try {
            // RUN INLINE QUERY
            // select action_date, action_type, long_name_en, industry_group_en, isin, symbol from `stg-dev-lkh-23bl6.stg_dev_bqd_product_ca.v_ca_filters` limit 1000
            // const response = await sdk.ok(
            //     sdk.run_inline_query({
            //         result_format: 'json',
            //         limit: null,
            //         body: {
            //             model: 'client_stg_test_data',
            //             view: 'v_ca_filters',
            //             fields: [
            //                 'v_ca_filters.action_type',
            //                 'v_ca_filters.long_name_en',
            //                 'v_ca_filters.industry_group_en',
            //                 'v_ca_filters.symbol'
            //             ],

            //             filters: null,
            //             filter_expression: null,
            //             total: false,
            //         }
            //     })
            // );

            if (filterDummy) {
                const filterDataArr = {
                    long_name_en: [...new Set(filterDummy.filter(event => event['v_ca_filters.long_name_en'] !== null).map(event => event['v_ca_filters.long_name_en']))],
                    symbol: [...new Set(respofilterDummynse.filter(event => event['v_ca_filters.symbol'] !== null).map(event => event['v_ca_filters.symbol']))],
                    industry_group_en: [...new Set(filterDummy.filter(event => event['v_ca_filters.industry_group_en'] !== null).map(event => event['v_ca_filters.industry_group_en']))],
                    actionType: [...new Set(filterDummy.filter(event => event['v_ca_filters.action_type'] !== null).map(event => event['v_ca_filters.action_type']))]
                }

                setFilterData(filterDummy);
            }

            // setIsLoading(false);

        } catch (error) {
            // setIsLoading(false);
            // setError('something went wrong');
            console.error(error);
        }

    }

    const updateFilters = (e) => {
        e.preventDefault();

        const selectedFilters = {
            'long_name_en': companyRef.current.value !== 'all' && companyRef.current.value,
            'symbol': symbolRef.current.value !== 'all' && symbolRef.current.value,
            'industry_group_en': industry_group_enRef.current.value !== 'all' && industry_group_enRef.current.value,
            'actionType': actionTypeRef.current.value !== 'all' && actionTypeRef.current.value,
            'startDate': `${moment(dateRange[0]).format("YYYY/MM/DD")}`,
            'endDate': `${moment(dateRange[1]).format("YYYY/MM/DD")}`
        }

        onFiltersUpdate(selectedFilters);
    }

    const clearFilters = () => {
        companyRef.current.value = 'all';
        symbolRef.current.value = 'all';
        industry_group_enRef.current.value = 'all';
        actionTypeRef.current.value = 'all';

        companyRef.current.disabled = false;
        symbolRef.current.disabled = false;
        industry_group_enRef.current.disabled  = false;
    }

    const onSelectCompanyChange = () => {
        if (companyRef.current.value !== 'all') {
            symbolRef.current.value = 'all';
            industry_group_enRef.current.value = 'all';

            symbolRef.current.disabled = true;
            industry_group_enRef.current.disabled  = true;
        } else {
            symbolRef.current.disabled = false;
            industry_group_enRef.current.disabled  = false;
        }
    }

    const onSelectSymbolChange = () => {
        if (symbolRef.current.value !== 'all') {
            companyRef.current.value = 'all';
            
            companyRef.current.disabled  = true;
        } else {
            companyRef.current.disabled = false;
        }
    }

    useImperativeHandle(ref, () => ({
        clearForm() {
            clearFilters();
        }
    }))
    
    return (
        <form className="filters">
            <div>
                <label>Company Name</label>
                <select ref={companyRef} onChange={onSelectCompanyChange}>
                    <option value="all">all</option>
                    {filterData && filterData.long_name_en.map((filter, idx) => <option value={filter} key={idx}>{filter}</option>)}
                </select>
            </div>
            <div>
                <label>Symbol</label>
                <select ref={symbolRef} onChange={onSelectSymbolChange}>
                    <option value="all">all</option>
                    {filterData && filterData.symbol.map((filter, idx) => <option value={filter} key={idx}>{filter}</option>)}
                </select>
            </div>
            <div>
                <label>Industry</label>
                <select ref={industry_group_enRef}>
                    <option value="all">all</option>
                    {filterData && filterData.industry_group_en.map((filter, idx) => <option value={filter} key={idx}>{filter}</option>)}
                </select>
            </div>
            <div>
                <label>Action Type</label>
                <select ref={actionTypeRef}>
                    <option value="all">all</option>
                    {filterData && filterData.actionType.map((filter, idx) => <option value={filter} key={idx}>{filter}</option>)}
                </select>
            </div>
            <div className="date-picker-wrapper">
                <label>Date Range</label>
                <DatePicker
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => {
                        setDateRange(update);
                    }}
                />
            </div>
            <button className="submit-filters" onClick={updateFilters}>Update</button>
        </form>
    )
})