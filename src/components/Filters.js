import React, { useRef, useImperativeHandle, forwardRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from 'react-datepicker';
import moment from 'moment';

export const Filters = forwardRef(({onFiltersUpdate}, ref) => {
    const [dateRange, setDateRange] = useState([new Date('2024/10/01'), new Date('2024/10/30')]);
    const [startDate, endDate] = dateRange;

    const companyRef = useRef();
    const symbolRef = useRef();
    const industry_group_enRef = useRef();
    const actionTypeRef = useRef();

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
                    <option value="A L1">A L1</option>
                    {/* {filterData && filterData.long_name_en.map((filter, idx) => <option value={filter} key={idx}>{filter}</option>)} */}
                </select>
            </div>
            <div>
                <label>Symbol</label>
                <select ref={symbolRef} onChange={onSelectSymbolChange}>
                    <option value="all">all</option>
                    {/* {filterData && filterData.symbol.map((filter, idx) => <option value={filter} key={idx}>{filter}</option>)} */}
                </select>
            </div>
            <div>
                <label>Industry</label>
                <select ref={industry_group_enRef}>
                    <option value="all">all</option>
                    {/* {filterData && filterData.industry_group_en.map((filter, idx) => <option value={filter} key={idx}>{filter}</option>)} */}
                </select>
            </div>
            <div>
                <label>Action Type</label>
                <select ref={actionTypeRef}>
                    <option value="all">all</option>
                    {/* {filterData && filterData.actionType.map((filter, idx) => <option value={filter} key={idx}>{filter}</option>)} */}
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