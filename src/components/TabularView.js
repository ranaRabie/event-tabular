import React, { useState, useContext, useEffect, useRef } from 'react'
import moment from 'moment'
// import { ExtensionContext } from '@looker/extension-sdk-react'
import { Filters } from './Filters'
import { EventsTable } from './EventsTable'
import { DividendTable } from './DividendTable'
import { GeneralAssemblyMeetingTable } from './GeneralAssemblyMeetingTable'
import { BoardOfDirectorsSessionTable } from './BoardOfDirectorsSessionTable'
import { AnnouncementTable } from './AnnouncementTable'
import eventsDummy from '../data.json'

export const TabularView = () => {
    // const extensionContext = useContext(ExtensionContext);
    // const sdk = extensionContext.core40SDK; // Use the appropriate version of the Looker API

    const filtersRef = useRef();

    const [eventsList, setEventsList] = useState(null); // Should use setEventsList when calling API
    const [selectedItem, setSelectedItem] = useState(null);
    const [filterData, setFilterData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const { firstDateOfMonth, lastDateOfMonth } = getMonthStartEndDate(new Date());

        fetchData(firstDateOfMonth, lastDateOfMonth);
    }, []);

    const fetchData = async (startDate, endDate) => {
        setIsLoading(true);
        setSelectedItem(null);
        setError(null);
        // filtersRef.current.clearForm();

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
            //                 'v_corporate_actions.dividends_ex_date',
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

            //             filters: {
            //                 "v_corporate_actions.action_date": `${moment(startDate).format("YYYY/MM/DD")} to ${moment(endDate).format("YYYY/MM/DD")}`
            //             },
            //             filter_expression: null,
            //             total: false,
            //         }
            //     })
            // );

            // setEventsList(response);
            setEventsList(eventsDummy);
            
            // if (response) {
                // setEventsFilterList(response); // Set it when set eventsList

                // const filterDataArr = {
                //     long_name_en: [...new Set(response.filter(event => event['v_corporate_actions.long_name_en'] !== null).map(event => event['v_corporate_actions.long_name_en']))],
                //     symbol: [...new Set(response.filter(event => event['v_corporate_actions.symbol'] !== null).map(event => event['v_corporate_actions.symbol']))],
                //     industry_group_en: [...new Set(response.filter(event => event['v_corporate_actions.industry_group_en'] !== null).map(event => event['v_corporate_actions.industry_group_en']))],
                //     actionType: [...new Set(response.filter(event => event['v_corporate_actions.action_type'] !== null).map(event => event['v_corporate_actions.action_type']))]
                // }

                // setFilterData(filterDataArr);
            // }

            setIsLoading(false);

        } catch (error) {
            setIsLoading(false);
            setError('something went wrong');
            console.error(error);
        }
    }

    const onClickItem = (item) => {
        console.log(item);
        setSelectedItem(item);
    }

    const getMonthStartEndDate = (currentDate) => {
        const firstDateOfMonth = (date = new Date()) =>
            new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDateOfMonth = (date = new Date()) =>
            new Date(date.getFullYear(), date.getMonth() + 1, 0);

        return { firstDateOfMonth: firstDateOfMonth(currentDate), lastDateOfMonth: lastDateOfMonth(currentDate) };
    }

    const onFiltersUpdate = (filtersList) => {
        

        const filteredEvents = eventsList.filter(event =>
            (!filtersList.long_name_en || event['v_corporate_actions.long_name_en'] === filtersList.long_name_en) &&
            (!filtersList.symbol || event['v_corporate_actions.symbol'] === parseInt(filtersList.symbol)) &&
            (!filtersList.industry_group_en || event['v_corporate_actions.industry_group_en'] === filtersList.industry_group_en) &&
            (!filtersList.actionType || event['v_corporate_actions.action_type'] === filtersList.actionType)
        );

        
    }

    return (
        <div className='app-wrapper'>
            <Filters filterData={filterData} onFiltersUpdate={onFiltersUpdate} ref={filtersRef} />
            <div className='events-wrapper'>
                {eventsList ? (
                    <>
                        {error && <div className='error'>{error}</div>}
                        {isLoading ? (
                            <div class="loader">
                                <div class="loaderBar"></div>
                            </div>
                        ) : ''}
                        <EventsTable list={eventsList} onClickItem={onClickItem}></EventsTable>

                        {
                            selectedItem && selectedItem['v_corporate_actions.action_type'] === 'Dividend' ?
                                <DividendTable listItem={selectedItem}></DividendTable> : ''
                        }

                        {
                            selectedItem && selectedItem['v_corporate_actions.entry_type'] === 'Announcement' ?
                                <AnnouncementTable listItem={selectedItem}></AnnouncementTable> : ''
                        }
                    </>
                ) : ''}
            </div>
        </div>
    );
};