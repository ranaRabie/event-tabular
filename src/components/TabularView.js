import React, { useState, useContext, useEffect, useRef } from 'react'
// import { ExtensionContext } from '@looker/extension-sdk-react'
import { Filters } from './Filters'
import { EventsTable } from './EventsTable'
import { DividendTable } from './DividendTable'
import { GeneralAssemblyMeetingTable } from './GeneralAssemblyMeetingTable'
import { BoardOfDirectorsSessionTable } from './BoardOfDirectorsSessionTable'
import { AnnouncementTable } from './AnnouncementTable'
import eventsDummy from '../data/data.json'

export const TabularView = () => {
    // const extensionContext = useContext(ExtensionContext);
    // const sdk = extensionContext.core40SDK; // Use the appropriate version of the Looker API

    const filtersRef = useRef();

    const [eventsList, setEventsList] = useState(null); // Should use setEventsList when calling API
    const [selectedItem, setSelectedItem] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const filterDates = filtersRef.current.getFilterDates();
        
        fetchData({
            "long_name_en": false,
            "symbol": false,
            "industry_group_en": false,
            "actionType": false,
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
        filters.long_name_en ? 
            currentFilters["v_corporate_actions.long_name_en"] = filters.long_name_en : '';

        // eslint-disable-next-line
        filters.symbol ? 
            currentFilters["v_corporate_actions.symbol"] = filters.symbol : '';

        // eslint-disable-next-line
        filters.industry_group_en ? 
            currentFilters["v_corporate_actions.industry_group_en"] = filters.industry_group_en : '';

        // eslint-disable-next-line
        filters.actionType ? 
            currentFilters["v_corporate_actions.action-type"] = filters.actionType : '';

        // eslint-disable-next-line
        filters.startDate && filters.endDate ? 
            currentFilters["v_corporate_actions.action_date"] = `${filters.startDate} to ${filters.endDate}` : '';

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

            // setEventsList(response);
            setEventsList(eventsDummy);
            setIsLoading(false);

        } catch (error) {
            setIsLoading(false);
            setError('something went wrong');
        }
    }

    const handleRowClick = (listItem) => {
        if (
          listItem["v_corporate_actions.action_type"] === "Dividend" ||
          listItem["v_corporate_actions.entry_type"] === "Announcement" ||
          listItem["v_corporate_actions.action_type"] === "Board of Directors Session" ||
          listItem["v_corporate_actions.action_type"] === "General Assembly Meeting"
        ) {
          setSelectedItem(listItem);
        }
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
            <div className='events-wrapper'>
                {eventsList ? (
                    <>
                        {error && <div className='error'>{error}</div>}
                        {isLoading ? (
                            <div class="loader">
                                <div class="loaderBar"></div>
                            </div>
                        ) : ''}
                        <EventsTable list={eventsList} onClickItem={handleRowClick}></EventsTable>

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
                                selectedItem && selectedItem['v_corporate_actions.action_type'] === 'General Assembly Meeting' ?
                                    <GeneralAssemblyMeetingTable listItem={selectedItem}></GeneralAssemblyMeetingTable> : ''
                            }

                            {
                                selectedItem && selectedItem['v_corporate_actions.entry_type'] === 'Announcement' ?
                                    <AnnouncementTable listItem={selectedItem}></AnnouncementTable> : ''
                            }
                        </div>
                    </>
                ) : ''}
            </div>
        </div>
    );
};