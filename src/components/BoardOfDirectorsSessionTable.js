import React from "react";

export const BoardOfDirectorsSessionTable = ({ listItem }) => {
    return (
        <div className='events-list'>
            <h3>Board of Directors Session</h3>
            <table>
                <thead>
                    <tr>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Session Type</th>
                        <th>Number of Board of Directors</th>
                        <th>Application Start Date</th>
                        <th>Application End Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className='single-event'>
                        <td>{
                            listItem['v_corporate_actions.bods_start_date'] ? listItem['v_corporate_actions.bods_start_date'] : '-'
                        }</td>
                        <td>{
                            listItem['v_corporate_actions.bods_end_date'] ? listItem['v_corporate_actions.bods_end_date'] : '-'
                        }</td>
                        <td>{
                            listItem['v_corporate_actions.bods_session_type'] ? listItem['v_corporate_actions.bods_session_type'] : '-'
                        }</td>
                        <td>{
                            listItem['v_corporate_actions.bods_number_of_board_of_directors'] ? listItem['v_corporate_actions.bods_number_of_board_of_directors'] : '-'
                        }</td>
                            <td>{
                            listItem['v_corporate_actions.bods_application_start_date'] ? listItem['v_corporate_actions.bods_application_start_date'] : '-'
                        }</td>
                        <td>{
                            listItem['v_corporate_actions.bods_application_end_date'] ? listItem['v_corporate_actions.bods_application_end_date'] : '-'
                        }</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}