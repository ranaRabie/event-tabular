import React, { useState, useContext, useEffect, useRef } from 'react'
// import { ExtensionContext } from '@looker/extension-sdk-react'
import moment from 'moment'
import { Filters } from './Filters'
import { EventsTable } from './Tables/EventsTable';
import { DividendTable } from './Tables/DividendTable';
import { GeneralAssemblyMeetingTable } from './Tables/GeneralAssemblyMeetingTable';
import { BoardOfDirectorsSessionTable } from './Tables/BoardOfDirectorsSessionTable';
import { AnnouncementTable } from './Tables/AnnouncementTable';
import { IPOTable } from './Tables/IPOTable';
import { OtherTable } from './Tables/OtherTable';
import eventsDummy from '../Data/data.json'

export const TabularView = () => {
    // const extensionContext = useContext(ExtensionContext);
    // const sdk = extensionContext.core40SDK; // Use the appropriate version of the Looker API

    const filtersRef = useRef();

    const [eventsList, setEventsList] = useState(null); // Should use setEventsList when calling API
    const [selectedItem, setSelectedItem] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [noData, setNoData] = useState(null);

    useEffect(() => {
        const filterDates = filtersRef.current.getFilterDates();
        
        fetchData({
            "company_full_name": false,
            "company_short_name": false,
            "symbol": false,
            "industry_group_en": false,
            "actionType": false,
            "isin": false,
            "startDate": filterDates.startDate,
            "endDate": filterDates.endDate
        });
    }, []);

    const fetchData = async (filters) => {
        setIsLoading(true);
        setSelectedItem(null);
        setError(null);

        const currentFilters = {};

        // eslint-disable-next-line
        filters.company_full_name ? 
            currentFilters["v_corporate_actions.company_full_name"] = filters.company_full_name : '';
        
        // eslint-disable-next-line
        filters.company_short_name ? 
            currentFilters["v_corporate_actions.company_short_name"] = filters.company_short_name : '';

        // eslint-disable-next-line
        filters.symbol ? 
            currentFilters["v_corporate_actions.symbol"] = `${filters.symbol}` : '';

        // eslint-disable-next-line
        filters.industry_group_en ? 
            currentFilters["v_corporate_actions.industry_group_en"] = filters.industry_group_en : '';

        // eslint-disable-next-line
        filters.actionType ? 
            currentFilters["v_corporate_actions.action_type"] = filters.actionType : '';

        // eslint-disable-next-line
        filters.startDate && filters.endDate ? 
            currentFilters["v_corporate_actions.action_date"] = `${filters.startDate} to ${filters.endDate}` : '';

        // eslint-disable-next-line
        filters.isin ? 
            currentFilters["v_corporate_actions.isin"] = `${filters.isin}` : '';

        try {
            // RUN INLINE QUERY
            // select action_date, action_type, long_name_en, industry_group_en, isin, symbol from `stg-dev-lkh-23bl6.stg_dev_bqd_product_ca.v_corporate_actions` limit 1000
            // const response = await sdk.ok(
            //     sdk.run_inline_query({
            //         result_format: 'json',
            //         limit: null,
            //         body: {
            //             model: 'client_stg_test_data',
            //             view: 'v_corporate_actions',
            //             fields: [
            //                 'v_corporate_actions.action_date',
            //                 'v_corporate_actions.action_type',
            //                 'v_corporate_actions.entry_type',
            //                 'v_corporate_actions.long_name_en',
            //                 'v_corporate_actions.industry_group_en',
            //                 'v_corporate_actions.isin',
            //                 'v_corporate_actions.symbol',
            //                 'v_corporate_actions.Count',
            //                 'v_corporate_actions.action_description',
            //                 'v_corporate_actions.dividends_announcement_date',
            //                 'v_corporate_actions.dividends_eligibility_date',
            //                 'v_corporate_actions.dividends_distribution_method',
            //                 'v_corporate_actions.dividends_distribution_amount',
            //                 'v_corporate_actions.gam_type_of_assembly',
            //                 'v_corporate_actions.gam_agm_date',
            //                 'v_corporate_actions.gam_holding_site',
            //                 'v_corporate_actions.gam_status',
            //                 'v_corporate_actions.bods_start_date',
            //                 'v_corporate_actions.bods_end_date',
            //                 'v_corporate_actions.bods_session_type',
            //                 'v_corporate_actions.bods_number_of_board_of_directors',
            //                 'v_corporate_actions.bods_application_start_date',
            //                 'v_corporate_actions.bods_application_end_date',
            //                 'v_corporate_actions.announcement_details'
            //             ],

            //             filters: currentFilters,
            //             filter_expression: null,
            //             total: false,
            //         }
            //     })
            // );

            
            if(eventsDummy.length === 0) {
                setNoData('No Data');
            }
            
            // setEventsList(response);
            setEventsList(eventsDummy);
            setIsLoading(false);

        } catch (error) {
            setIsLoading(false);
            setEventsList(null);
            setError(error);
        }
    }

    const handleRowClick = (listItem) => {
        setSelectedItem(listItem);
    };

    const handleClosePopup = () => {
        setSelectedItem(null);
    };

    const handleFilterChange = (filtersList) => {
        fetchData(filtersList);
    }

    return (
        <div className='app-wrapper'>
            <Filters handleFilterChange={handleFilterChange} ref={filtersRef} />
            {eventsList ? (
                <>
                    {isLoading ? (
                        <div class="loader">
                            <div class="loaderBar"></div>
                        </div>
                    ) : ''}
                    <div className='events-wrapper'>
                        {error && <div className='error'>{error}</div>}
                        {noData && <div className='no-data'>{noData}</div>}
                        
                        {eventsList.length > 0 &&
                            <EventsTable list={eventsList} onClickItem={handleRowClick}></EventsTable>
                        }

                        <div className='filter-result'>
                            {selectedItem && <button onClick={handleClosePopup} className="close-button">X</button>}
                            {
                                selectedItem && selectedItem['v_corporate_actions.action_type'] === 'Dividend' ?
                                    <DividendTable listItem={selectedItem}></DividendTable> : ''
                            }
                            
                            {
                                selectedItem && selectedItem['v_corporate_actions.action_type'] === 'Board of Directors Session' ?
                                    <BoardOfDirectorsSessionTable listItem={selectedItem}></BoardOfDirectorsSessionTable> : ''
                            }

                            {
                                selectedItem && selectedItem['v_corporate_actions.action_type'] === '(AGM) General Assembly' ?
                                    <GeneralAssemblyMeetingTable listItem={selectedItem}></GeneralAssemblyMeetingTable> : ''
                            }
                            
                            {
                                selectedItem && selectedItem['v_corporate_actions.action_type'] === 'IPO' ?
                                    <IPOTable listItem={selectedItem}></IPOTable> : ''
                            }

                            {
                                selectedItem && selectedItem['v_corporate_actions.entry_type'] === 'Announcement' ?
                                    <AnnouncementTable listItem={selectedItem}></AnnouncementTable> : ''
                            }

                            {
                                selectedItem && 
                                selectedItem['v_corporate_actions.action_type'] !== 'Dividend' && 
                                selectedItem['v_corporate_actions.action_type'] !== 'Board of Directors Session' && 
                                selectedItem['v_corporate_actions.action_type'] !== '(AGM) General Assembly' &&
                                selectedItem['v_corporate_actions.action_type'] !== 'IPO' &&
                                selectedItem['v_corporate_actions.entry_type'] !== 'Announcement' ?
                                    <OtherTable listItem={selectedItem}></OtherTable> : ''
                            }
                        </div>
                    </div>
                </>
            ) : ''}
        </div>
    );
};