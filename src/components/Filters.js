import React, { useContext, useEffect, useImperativeHandle, forwardRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from 'react-datepicker';
import moment from 'moment';
// import { ExtensionContext } from '@looker/extension-sdk-react';
import filterDummy from '../Data/filters.json'
import Select from 'react-select';

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

    const [company, setCompany] = useState(null);
    const [companyShort, setCompanyShort] = useState(null);
    const [symbol, setSymbol] = useState(null);
    const [industry, setIndustry] = useState(null);
    const [actionType, setActionType] = useState(null);
    const [isin, setIsin] = useState(null);

    const [isCompanyDisabled, setIsCompanyDisabled] = useState(false);
    const [isCompanyShortDisabled, setIsCompanyShortDisabled] = useState(false);
    const [isSymbolDisabled, setIsSymbolDisabled] = useState(false);
    const [isIsinDisabled, setIsIsinDisabled] = useState(false);
    const [isIndustryDisabled, setIsIndustryDisabled] = useState(false);
    
    useEffect(() => {
        fetchFilterData();
    }, []);

    const fetchFilterData = async () => {
        setError(null);
        
        // Run Inline Query to get Filters Data from Looker
        // Companies, Symbols, Industries, ActionTypes
        try {
            // RUN INLINE QUERY
            // select action_date, action_type, company_full_name, industry_group_en, isin, symbol from `stg-dev-lkh-23bl6.stg_dev_bqd_product_ca.v_looker_corporate_actions_filters` limit 1000
            // const response = await sdk.ok(
            //     sdk.run_inline_query({
            //         result_format: 'json',
            //         limit: null,
            //         body: {
            //             model: 'client_stg_test_data',
            //             view: 'v_looker_corporate_actions_filters',
            //             fields: [
            //                 'v_looker_corporate_actions_filters.action_type',
            //                 'v_looker_corporate_actions_filters.company_full_name',
            //                 'v_looker_corporate_actions_filters.industry_group_en',
            //                 'v_looker_corporate_actions_filters.symbol'
            //             ],

            //             filters: null,
            //             filter_expression: null,
            //             total: false,
            //         }
            //     })
            // );

            if (filterDummy) {
                // Remove nulls, duplication and group by each field
                RemoveDataDuplicatesAndNulls(filterDummy);
            }

        } catch (error) {
            setError('something went wrong loading filters');
        }

    }

    const RemoveDataDuplicatesAndNulls = (data) => {
        const filterDataArr = {
            company_full_name: [...[...new Set(data
                    .filter(event => event['v_looker_corporate_actions_filters.company_full_name'] !== null)
                    .map(event => event['v_looker_corporate_actions_filters.company_full_name']))]
                    .sort((a,b) => a.localeCompare(b))
                    .map(item => ({"label": item, "value": item}))
            ],
            symbol: [...[...new Set(data
                    .filter(event => event['v_looker_corporate_actions_filters.symbol'] !== null)
                    .map(event => event['v_looker_corporate_actions_filters.symbol']))]
                    .map(item => ({"label": item, "value": item}))
            ],
            industry_group_en: [...[...new Set(data
                    .filter(event => event['v_looker_corporate_actions_filters.industry_group_en'] !== null)
                    .map(event => event['v_looker_corporate_actions_filters.industry_group_en']))]
                    .sort((a,b) => a.localeCompare(b))
                    .map(item => ({"label": item, "value": item}))
            ],
            actionType: [...[...new Set(data
                    .filter(event => event['v_looker_corporate_actions_filters.action_type'] !== null)
                    .map(event => event['v_looker_corporate_actions_filters.action_type']))]
                    .sort((a,b) => a.localeCompare(b))
                    .map(item => ({"label": item, "value": item}))
            ],
            company_short_name: [...[...new Set(data
                    .filter(event => event['v_looker_corporate_actions_filters.company_short_name'] !== null)
                    .map(event => event['v_looker_corporate_actions_filters.company_short_name']))]
                    .sort((a,b) => a.localeCompare(b))
                    .map(item => ({"label": item, "value": item}))
            ],
            isin: [...[...new Set(data
                    .filter(event => event['v_looker_corporate_actions_filters.isin'] !== null)
                    .map(event => event['v_looker_corporate_actions_filters.isin']))]
                    .sort((a,b) => a.localeCompare(b))
                    .map(item => ({"label": item, "value": item}))
            ],
        }

        setFilterData(filterDataArr);
    }

    const updateFilters = (e, startDate = dateRange[0], endDate = dateRange[1]) => {
        e.preventDefault();

        const selectedFilters = {
            'company_full_name': company !== null && company.value,
            'symbol': symbol !== null && symbol.value,
            'industry_group_en': industry !== null && industry.value,
            'actionType': actionType !== null && actionType.value,
            'company_short_name': companyShort !== null && companyShort.value,
            'isin': isin !== null && isin.value,
            'startDate': `${moment(startDate).format("YYYY/MM/DD")}`,
            'endDate': `${moment(endDate).format("YYYY/MM/DD")}`,
        }

        console.log(selectedFilters);
        handleFilterChange(selectedFilters);
    }

    const clearFilters = (e) => {
        e.preventDefault();
      
        setCompany(null);
        setCompanyShort(null);
        setIndustry(null);
        setActionType(null);
        setSymbol(null);
        setIsin(null);

        const currentDateRange = [new Date(startDateRange), new Date(endDateRange)]

        setDateRange(currentDateRange);

        setIsCompanyShortDisabled(false);
        setIsCompanyDisabled(false);
        setIsIndustryDisabled(false);
        setIsIsinDisabled(false);
        setIsSymbolDisabled(false);

        updateFilters(e, currentDateRange[0], currentDateRange[1]);
    }

    const handleSelectChange = (option, field) => {
        if (field === 'company') {
            if (option !== null) {
                setIsCompanyShortDisabled(true);
                setIsIndustryDisabled(true);
                setIsIsinDisabled(true);
                setIsSymbolDisabled(true);
            } else {
                setIsCompanyShortDisabled(false);
                setIsCompanyDisabled(false);
                setIsIndustryDisabled(false);
                setIsIsinDisabled(false);
                setIsSymbolDisabled(false);
            }

            setCompany(option);
            setIndustry(null);
            setSymbol(null);
            setCompanyShort(null);
            setIsin(null);
        } else if (field === 'symbol') {
            if (option !== null) {
                setIsCompanyShortDisabled(true);
                setIsIndustryDisabled(true);
                setIsIsinDisabled(true);
                setIsCompanyDisabled(true);
            } else {
                setIsCompanyShortDisabled(false);
                setIsCompanyDisabled(false);
                setIsIndustryDisabled(false);
                setIsIsinDisabled(false);
                setIsSymbolDisabled(false);
            }

            setSymbol(option);
            setIndustry(null);
            setCompany(null);
            setCompanyShort(null);
            setIsin(null);
        } else if (field === 'industry') {
           setIndustry(option);
        } else if (field === 'actionType') {
            setActionType(option);
        } else if (field === 'companyShortName') {
            if (option !== null) {
                setIsCompanyDisabled(true);
                setIsIndustryDisabled(true);
                setIsIsinDisabled(true);
                setIsSymbolDisabled(true);
            } else {
                setIsCompanyShortDisabled(false);
                setIsCompanyDisabled(false);
                setIsIndustryDisabled(false);
                setIsIsinDisabled(false);
                setIsSymbolDisabled(false);
            }

            setCompanyShort(option);
            setIndustry(null);
            setSymbol(null);
            setCompany(null);
            setIsin(null);
        } else if (field === 'isin') {
            if (option !== null) {
                setIsCompanyShortDisabled(true);
                setIsIndustryDisabled(true);
                setIsCompanyDisabled(true);
                setIsSymbolDisabled(true);
            } else {
                setIsCompanyShortDisabled(false);
                setIsCompanyDisabled(false);
                setIsIndustryDisabled(false);
                setIsIsinDisabled(false);
                setIsSymbolDisabled(false);
            }

            setIsin(option);
            setIndustry(null);
            setSymbol(null);
            setCompanyShort(null);
            setCompany(null);
        }
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
                        <label>Company Full Name</label>
                        <Select 
                            className="react-select-container"
                            classNamePrefix="react-select"
                            options={filterData && filterData.company_full_name} 
                            onChange={(e) => handleSelectChange(e, 'company')}
                            isDisabled={isCompanyDisabled}
                            isClearable
                            value={company}
                        />
                </div>
                <div>
                    <label>Company Short Name</label>
                        <Select 
                            className="react-select-container"
                            classNamePrefix="react-select"
                            options={filterData && filterData.company_short_name} 
                            onChange={(e) => handleSelectChange(e, 'companyShortName')}
                            isDisabled={isCompanyShortDisabled}
                            isClearable
                            value={companyShort}
                        />
                </div>
                <div>
                    <label>Symbol</label> 
                        <Select 
                            className="react-select-container"
                            classNamePrefix="react-select"
                            options={filterData && filterData.symbol} 
                            onChange={(e) => handleSelectChange(e, 'symbol')}
                            isDisabled={isSymbolDisabled}
                            isClearable
                            value={symbol}
                        />
                </div>
                <div>
                    <label>Industry</label>
                        <Select 
                            className="react-select-container"
                            classNamePrefix="react-select"
                            options={filterData && filterData.industry_group_en} 
                            onChange={(e) => handleSelectChange(e, 'industry')}
                            isDisabled={isIndustryDisabled}
                            isClearable
                            value={industry}
                        />
                </div>
                <div>
                    <label>Action Type</label>
                        <Select 
                            className="react-select-container"
                            classNamePrefix="react-select"
                            options={filterData && filterData.actionType} 
                            onChange={(e) => handleSelectChange(e, 'actionType')}
                            isClearable
                            value={actionType}
                        />
                </div>
                <div>
                    <label>ISIN</label> 
                        <Select 
                            className="react-select-container"
                            classNamePrefix="react-select"
                            options={filterData && filterData.isin} 
                            onChange={(e) => handleSelectChange(e, 'isin')}
                            isDisabled={isIsinDisabled}
                            isClearable   
                            value={isin}                     
                        />
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