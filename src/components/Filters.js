import React, { useContext, useEffect, useRef, useImperativeHandle, forwardRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from 'react-datepicker';
import moment from 'moment';
// import { ExtensionContext } from '@looker/extension-sdk-react';
import filterDummy from '../data/filters.json'

export const Filters = forwardRef(({handleFilterChange}, ref) => {
    // const extensionContext = useContext(ExtensionContext);
    // const sdk = extensionContext.core40SDK; // Use the appropriate version of the Looker API

    const endDateRange = new Date();
    const startDateRange = new Date(endDateRange);
    startDateRange.setDate(endDateRange.getDate() - 1);

    const [filterData, setFilterData] = useState(null);
    const [dateRange, setDateRange] = useState([new Date(startDateRange), new Date(endDateRange)]);
    const [startDate, endDate] = dateRange;
    const [error, setError] = useState(null);

    const companyRef = useRef();
    const symbolRef = useRef();
    const industry_group_enRef = useRef();
    const actionTypeRef = useRef();

    const [isCompanySelected, setIsCompanySelected] = useState(false);
    const [isSymbolSelected, setIsSymbolSelected] = useState(false);
    
    useEffect(() => {
        fetchFilterData();
    }, []);

    const fetchFilterData = async () => {
        setError(null);
        
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
                    symbol: [...new Set(filterDummy.filter(event => event['v_ca_filters.symbol'] !== null).map(event => event['v_ca_filters.symbol']))],
                    industry_group_en: [...new Set(filterDummy.filter(event => event['v_ca_filters.industry_group_en'] !== null).map(event => event['v_ca_filters.industry_group_en']))],
                    actionType: [...new Set(filterDummy.filter(event => event['v_ca_filters.action_type'] !== null).map(event => event['v_ca_filters.action_type']))]
                }

                setFilterData(filterDataArr);
            }

        } catch (error) {
            setError('something went wrong loading filters');
        }

    }

    const updateFilters = (e, startDate = dateRange[0], endDate = dateRange[1]) => {
        e.preventDefault();

        const selectedFilters = {
            'long_name_en': companyRef.current.value !== 'all' && companyRef.current.value,
            'symbol': symbolRef.current.value !== 'all' && symbolRef.current.value,
            'industry_group_en': industry_group_enRef.current.value !== 'all' && industry_group_enRef.current.value,
            'actionType': actionTypeRef.current.value !== 'all' && actionTypeRef.current.value,
            'startDate': `${moment(startDate).format("YYYY/MM/DD")}`,
            'endDate': `${moment(endDate).format("YYYY/MM/DD")}`
        }

        handleFilterChange(selectedFilters);
    }

    const clearFilters = (e) => {
        e.preventDefault();
        companyRef.current.value = 'all';
        symbolRef.current.value = 'all';
        industry_group_enRef.current.value = 'all';
        actionTypeRef.current.value = 'all';

        const currentDateRange = [new Date(startDateRange), new Date(endDateRange)]

        setDateRange(currentDateRange);

        setIsCompanySelected(false);
        setIsSymbolSelected(false);

        updateFilters(e, currentDateRange[0], currentDateRange[1]);
    }

    const handleCompanyChange = (e) => {
        setIsCompanySelected(e.target.value !== "all");
        setIsSymbolSelected(false);
    };
    
    const handleSymbolChange = (e) => {
        setIsSymbolSelected(e.target.value !== "all");
        setIsCompanySelected(false);
    };

    useImperativeHandle(ref, () => ({
        clearForm() {
            clearFilters();
        },
        getFilterDates() {
            return {startDate: `${moment(startDateRange).format("YYYY/MM/DD")}`, endDate: `${moment(endDateRange).format("YYYY/MM/DD")}`}
        }
    }))
    
    return (
        <>
            {error && <div className='error'>{error}</div>}
            <form className="filters">
                <div>
                    <label>Company Name</label>
                    <select ref={companyRef} onChange={handleCompanyChange} disabled={isSymbolSelected}>
                        <option value="all">all</option>
                        {filterData && filterData.long_name_en.map((company, idx) => <option value={company} key={idx}>{company}</option>)}
                    </select>
                </div>
                <div>
                    <label>Symbol</label>
                    <select ref={symbolRef} onChange={handleSymbolChange} disabled={isCompanySelected}>
                        <option value="all">all</option>
                        {filterData && filterData.symbol.map((symbol, idx) => <option value={symbol} key={idx}>{symbol}</option>)}
                    </select>
                </div>
                <div>
                    <label>Industry</label>
                    <select ref={industry_group_enRef} disabled={isCompanySelected}>
                        <option value="all">all</option>
                        {filterData && filterData.industry_group_en.map((industry, idx) => <option value={industry} key={idx}>{industry}</option>)}
                    </select>
                </div>
                <div>
                    <label>Action Type</label>
                    <select ref={actionTypeRef}>
                        <option value="all">all</option>
                        {filterData && filterData.actionType.map((action, idx) => <option value={action} key={idx}>{action}</option>)}
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
                <button className="submit-filters" onClick={updateFilters}>Apply</button>
                <button className="clear-filters" onClick={clearFilters}>Clear</button>
            </form>
        </>
    )
})